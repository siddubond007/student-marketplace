const prisma = require('../config/db');

exports.createGig = async (req, res) => {
  try {
    const { title, category, description, coverImage, isTiered, packages } = req.body;
    const gig = await prisma.gig.create({
      data: {
        sellerId: req.user.id,
        title,
        category,
        description,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        isTiered: isTiered || false,
        packages: {
          create: packages || [{ tierName: 'Single', price: 499, deliveryDays: 2, revisions: 2, description: 'Standard student delivery' }]
        }
      },
      include: { packages: true, seller: { select: { fullName: true, age: true, profile: true } } }
    });
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const gigs = await prisma.gig.findMany({
      include: { packages: true, seller: { select: { id: true, fullName: true, age: true, profile: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
