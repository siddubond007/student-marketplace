const prisma = require('../config/db');

exports.createReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      rating,
      communication,
      qualityOfWork,
      timeliness,
      comment
    } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Reviews can only be submitted for completed orders.' });
    }

    if (order.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Only the client can review this order.' });
    }

    const existingReview = await prisma.review.findUnique({
      where: { orderId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already submitted.' });
    }

    const review = await prisma.review.create({
      data: {
        orderId,
        authorId: req.user.id,
        receiverId: order.sellerId,
        rating,
        communication,
        qualityOfWork,
        timeliness,
        comment,
        isApproved: true
      }
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        receiverId: userId,
        isApproved: true
      },
      include: {
        author: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
