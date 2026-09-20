const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { sendPasswordResetEmail } = require('../services/emailService');

async function createAdminLoginLog(adminId, email, ipAddress, userAgent, loginStatus) {
  try {
    await prisma.adminLoginLog.create({
      data: {
        adminId,
        email,
        ipAddress,
        userAgent,
        loginStatus
      }
    });
  } catch (err) {
    console.error('AdminLoginLog Error:', err);
  }
}


exports.register = async (req, res) => {
  try {
    const { email, password, firstName, middleName, lastName, username, role, age, dob } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Please provide first name, last name, email, and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } }
    });
    if (existingEmail) {
      return res.status(400).json({ error: 'This email is already registered. Please sign in.' });
    }

    const isOwnerAdmin = cleanEmail === 'siddusiddharth80193@gmail.com';
    const userCleanName = (username || `${firstName.toLowerCase()}${Math.floor(100 + Math.random() * 900)}`).replace(/\s+/g, '');
    const passwordHash = await bcrypt.hash(password, 10);
    const parsedAge = parseInt(age, 10) || 18;
    const isMinor = parsedAge < 18;

    // Indian Contract Act Sec 11 Safeguard
    const requestedRole = isOwnerAdmin ? 'ADMIN' : (role || 'STUDENT_FREELANCER');
    if (isMinor && requestedRole === 'CLIENT') {
      return res.status(403).json({ error: 'Legal Capacity Error: Users under 18 cannot legally enter into employment contracts or act as a Client.' });
    }
    const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        username: userCleanName,
        email: cleanEmail,
        passwordHash,
        firstName,
        middleName: middleName || null,
        lastName,
        fullName,
        role: isOwnerAdmin ? 'ADMIN' : (isMinor ? 'STUDENT_FREELANCER' : (role || 'STUDENT_FREELANCER')),
        isMinor,
        age: parsedAge,
        dob: dob ? new Date(dob) : null,
        profile: {
          create: {
            tagline: isOwnerAdmin ? 'Super Administrator & Founder' : (isMinor ? 'Young Student Creator (Minor Verified)' : 'Student Creator & Freelancer'),
            bio: isOwnerAdmin ? 'Platform Administrator for SkillLaunch.' : 'Student Fresher ready to deliver quality work and build a verified portfolio.',
            college: isOwnerAdmin ? 'Mohan Babu University (MBU) - Tirupati' : '',
            category: isOwnerAdmin ? 'Platform Operations' : 'General Freelancing',
            hourlyRate: isOwnerAdmin ? 999 : 350,
            skills: ['Student Talent', 'Fast Learner']
          }
        },
        wallet: { create: { isParentAccount: isMinor, availableBalance: isOwnerAdmin ? 5000 : 0 } }
      },
      include: { profile: true, wallet: true }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful', token, user });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: 'Database Error: ' + err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const cleanInput = email.trim();

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanInput, mode: 'insensitive' } },
          { username: { equals: cleanInput, mode: 'insensitive' } }
        ]
      },
      include: { profile: true, wallet: true, verification: true }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email or username. Please sign up.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      if (user.role === 'ADMIN') {
        await createAdminLoginLog(
          user.id,
          user.email,
          req.ip,
          req.headers['user-agent'],
          'FAILED_BAD_PASSWORD'
        );
      }

      return res.status(400).json({ error: 'Incorrect password. Please try again.' });
    }

    // Auto-promote Owner Email to ADMIN on Login
    if (user.email.toLowerCase() === 'siddusiddharth80193@gmail.com' && user.role !== 'ADMIN') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN', isSuspended: false },
        include: { profile: true, wallet: true, verification: true }
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    if (user.role === 'ADMIN') {
      await createAdminLoginLog(
        user.id,
        user.email,
        req.ip,
        req.headers['user-agent'],
        'SUCCESS'
      );
    }

    console.log(`✅ Login successful: ${user.email} -> Role: ${user.role}`);
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Database Error: ' + err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Get Current User Error:', err);
    res.status(500).json({ error: 'Failed to load your account.' });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Please provide your current password, new password, and confirmation.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    const passwordCriteria = {
      hasMinLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    };

    if (!Object.values(passwordCriteria).every(Boolean)) {
      return res.status(400).json({ error: 'New password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { passwordHash: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    const currentMatches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!currentMatches) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      return res.status(400).json({ error: 'New password must be different from your current password.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    });

    return res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change Password Error:', err);
    return res.status(500).json({ error: 'Failed to change your password.' });
  }
};


const hashResetToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const validatePassword = (value) => ({
  hasMinLength: typeof value === 'string' && value.length >= 8,
  hasUpper: typeof value === 'string' && /[A-Z]/.test(value),
  hasLower: typeof value === 'string' && /[a-z]/.test(value),
  hasNumber: typeof value === 'string' && /[0-9]/.test(value),
  hasSpecial: typeof value === 'string' && /[!@#$%^&*(),.?":{}|<>]/.test(value)
});

exports.requestPasswordReset = async (req, res) => {
  const genericMessage = 'If an account exists for that email, a password reset link has been prepared.';

  try {
    const email = typeof req.body?.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';

    if (!email) {
      return res.status(400).json({ error: 'Please enter your email address.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, fullName: true }
    });

    if (!user) {
      return res.json({ message: genericMessage });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() }
      }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashResetToken(rawToken),
          expiresAt
        }
      })
    ]);

    const baseUrl = (process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetLink = `${baseUrl}/reset-password?token=${rawToken}`;

    let deliveryResult = { sent: false };
    try {
      deliveryResult = await sendPasswordResetEmail({
        to: user.email,
        name: user.fullName,
        resetLink,
        expiresAt
      });
    } catch (mailError) {
      console.error('Password reset email delivery error:', mailError.message);
    }

    const response = { message: genericMessage };
    if (process.env.NODE_ENV !== 'production' && !deliveryResult.sent) {
      response.devResetLink = resetLink;
      response.devEmailDelivery = 'Email provider not configured; development reset link returned.';
    }

    return res.json(response);
  } catch (err) {
    console.error('Request Password Reset Error:', err);
    return res.status(500).json({ error: 'Unable to process the password reset request.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Reset token, new password, and confirmation are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    const criteria = validatePassword(newPassword);
    if (!Object.values(criteria).every(Boolean)) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      });
    }

    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash: hashResetToken(token),
        usedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: { select: { id: true, passwordHash: true } }
      }
    });

    if (!resetRecord) {
      return res.status(400).json({ error: 'This password reset link is invalid or has expired. Please request a new one.' });
    }

    if (await bcrypt.compare(newPassword, resetRecord.user.passwordHash)) {
      return res.status(400).json({ error: 'New password must be different from your current password.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() }
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetRecord.userId,
          usedAt: null,
          id: { not: resetRecord.id }
        },
        data: { usedAt: new Date() }
      })
    ]);

    return res.json({ message: 'Password reset successfully. You can now sign in with your new password.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    return res.status(500).json({ error: 'Unable to reset your password.' });
  }
};
