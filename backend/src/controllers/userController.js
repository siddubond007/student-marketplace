const prisma = require('../config/db');

exports.getFreelancers = async (req, res) => {
  try {
    const { category } = req.query;

    let whereClause = {
      role: 'STUDENT_FREELANCER',
      isSuspended: false
    };

    if (category && category !== 'all') {
      const cleanCategory = category.replace(/-/g, ' ');
      whereClause.profile = {
        category: { contains: cleanCategory, mode: 'insensitive' }
      };
    }

    const freelancers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        age: true,
        points: true,
        createdAt: true,
        profile: true,
        reviewsReceived: { select: { rating: true, comment: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { username: userId },
          { email: userId }
        ]
      },
      include: {
        profile: true,
        gigs: { include: { packages: true } },
        reviewsReceived: { include: { author: { select: { fullName: true } } } },
        verification: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      tagline, bio, college, category, hourlyRate, skills, avatarUrl, coverUrl,
      experienceList, educationList, qualificationList, certificationList, publicationList 
    } = req.body;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        tagline: tagline || '',
        bio: bio || '',
        college: college || '',
        category: category || 'Graphic Design',
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 499,
        skills: skills || ['Student Talent'],
        avatarUrl,
        coverUrl,
        experienceList: experienceList || [],
        educationList: educationList || [],
        qualificationList: qualificationList || [],
        certificationList: certificationList || [],
        publicationList: publicationList || []
      },
      update: {
        tagline,
        bio,
        college,
        category,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        skills: skills ? skills : undefined,
        avatarUrl,
        coverUrl,
        experienceList: experienceList ? experienceList : undefined,
        educationList: educationList ? educationList : undefined,
        qualificationList: qualificationList ? qualificationList : undefined,
        certificationList: certificationList ? certificationList : undefined,
        publicationList: publicationList ? publicationList : undefined
      }
    });

    res.json({ message: 'Profile updated successfully!', profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addPortfolioItem = async (req, res) => {
  try {
    const { title, category, img, link } = req.body;
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.id } });
    
    const currentItems = Array.isArray(profile.portfolioItems) ? profile.portfolioItems : [];
    const newItem = { id: Date.now(), title, category, img, link };
    const updatedItems = [newItem, ...currentItems];

    await prisma.profile.update({
      where: { userId: req.user.id },
      data: { portfolioItems: updatedItems }
    });

    res.status(201).json({ message: 'Portfolio item added successfully!', portfolioItems: updatedItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
