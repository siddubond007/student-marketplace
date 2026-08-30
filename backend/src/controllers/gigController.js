const prisma = require('../config/db');

exports.createGig = async (req, res) => {
  try {
    const { title, category, categoryId, subcategoryId, description, coverImage, isTiered, packages } = req.body;
    const gig = await prisma.gig.create({
      data: {
        sellerId: req.user.id,
        title,
        category,
        categoryId,
        subcategoryId,
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


exports.getGigById = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await prisma.gig.findFirst({
      where: {
        id: gigId,
        isDeleted: false
      },
      include: {
        packages: {
          orderBy: { price: 'asc' }
        },
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true,
            age: true,
            averageRating: true,
            totalReviews: true,
            points: true,
            profile: {
              select: {
                avatarUrl: true,
                tagline: true,
                bio: true,
                college: true,
                category: true,
                hourlyRate: true,
                skills: true,
                badges: true
              }
            },
            verification: {
              select: {
                status: true,
                collegeIdStatus: true,
                govtIdStatus: true
              }
            }
          }
        }
      }
    });

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found.' });
    }

    return res.json(gig);
  } catch (err) {
    console.error('Get Gig By ID Error:', err);
    return res.status(500).json({ error: 'Failed to load gig.' });
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
