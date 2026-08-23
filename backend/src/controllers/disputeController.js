const prisma = require('../config/db');

exports.createDispute = async (req, res) => {
  try {
    const { orderId, reason, evidence } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (
      order.clientId !== req.user.id &&
      order.sellerId !== req.user.id
    ) {
      return res.status(403).json({ error: 'You are not part of this order.' });
    }

    if (
      ['COMPLETED', 'CANCELLED_REFUNDED', 'DISPUTED']
        .includes(order.status)
    ) {
      return res.status(400).json({
        error: 'Dispute cannot be opened for this order status.'
      });
    }

    const dispute = await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'DISPUTED' }
      });

      return tx.dispute.create({
        data: {
          orderId,
          openedById: req.user.id,
          reason,
          evidence
        }
      });
    });

    res.status(201).json({
      message: 'Dispute opened successfully.',
      dispute
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyDisputes = async (req, res) => {
  try {
    const disputes = await prisma.dispute.findMany({
      where: {
        openedById: req.user.id
      },
      include: {
        order: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(disputes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDisputes = async (req, res) => {
  try {
    const disputes = await prisma.dispute.findMany({
      include: {
        order: true,
        openedBy: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(disputes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        order: true
      }
    });

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found.' });
    }

    if (decision === 'RELEASE_TO_SELLER') {

      await prisma.$transaction([
        prisma.order.update({
          where: { id: dispute.orderId },
          data: { status: 'COMPLETED' }
        }),

        prisma.wallet.upsert({
          where: { userId: dispute.order.sellerId },
          create: {
            userId: dispute.order.sellerId,
            availableBalance: dispute.order.sellerEarnings
          },
          update: {
            availableBalance: {
              increment: dispute.order.sellerEarnings
            }
          }
        }),

        prisma.dispute.update({
          where: { id },
          data: {
            status: 'RESOLVED',
            adminDecision: decision,
            resolvedAt: new Date()
          }
        })
      ]);

    } else if (decision === 'REFUND_CLIENT') {

      await prisma.$transaction([
        prisma.order.update({
          where: { id: dispute.orderId },
          data: {
            status: 'CANCELLED_REFUNDED'
          }
        }),

        prisma.dispute.update({
          where: { id },
          data: {
            status: 'RESOLVED',
            adminDecision: decision,
            resolvedAt: new Date()
          }
        })
      ]);

    } else {
      return res.status(400).json({
        error: 'Invalid decision.'
      });
    }

    res.json({
      message: 'Dispute resolved successfully.'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
