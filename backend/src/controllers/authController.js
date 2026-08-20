const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, middleName, lastName, username, role, age, dob } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Please provide first name, last name, email, and password.' });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'This email is already registered. Please sign in.' });
    }

    // Clean username fallback
    const userCleanName = (username || `${firstName.toLowerCase()}${Math.floor(100 + Math.random() * 900)}`).replace(/\s+/g, '');
    const existingUser = await prisma.user.findUnique({ where: { username: userCleanName } });
    const finalUsername = existingUser ? `${userCleanName}${Math.floor(100 + Math.random() * 900)}` : userCleanName;

    const passwordHash = await bcrypt.hash(password, 10);
    const parsedAge = parseInt(age, 10) || 18;
    const isMinor = parsedAge < 18;
    const fullName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        username: finalUsername,
        email,
        passwordHash,
        firstName,
        middleName: middleName || null,
        lastName,
        fullName,
        role: isMinor ? 'STUDENT_FREELANCER' : (role || 'STUDENT_FREELANCER'),
        isMinor,
        age: parsedAge,
        dob: dob ? new Date(dob) : null,
        profile: {
          create: {
            tagline: isMinor ? 'Young Student Creator (Minor Verified)' : 'Student Creator & Freelancer',
            bio: 'Student Fresher ready to deliver quality work and build a verified portfolio.',
            college: 'College / University',
            category: 'Graphic Design',
            hourlyRate: 499,
            skills: ['Student Talent', 'Fast Learner']
          }
        },
        wallet: { create: { isParentAccount: isMinor } }
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

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: email }
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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Database Error: ' + err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
