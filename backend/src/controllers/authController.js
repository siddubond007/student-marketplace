const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

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
    console.log(`✅ Login successful: ${user.email} -> Role: ${user.role}`);
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Database Error: ' + err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
