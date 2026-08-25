const prisma = require('../config/db');

exports.createPayoutRequest = async (req, res) => {
  try {
    const { amount, upiId } = req.body;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    const withdrawAmount = Number(amount);

    if (withdrawAmount < 100) {
      return res.status(400).json({ error: 'Minimum withdrawal is ₹100.' });
    }

    if (wallet.availableBalance < withdrawAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance.' });
    }

    const payout = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: req.user.id },
        data: {
          availableBalance: {
            decrement: withdrawAmount
          },
          pendingBalance: {
            increment: withdrawAmount
          }
        }
      });

      return tx.payoutRequest.create({
        data: {
          userId: req.user.id,
          amount: withdrawAmount,
          method: 'UPI',
          destination: upiId
        }
      });
    });

    res.status(201).json({
      message: 'Withdrawal request submitted successfully.',
      payout
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyPayoutRequests = async (req, res) => {
  try {
    const payouts = await prisma.payoutRequest.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyWallet = async (req, res) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: req.user.id
      },
      select: {
        availableBalance: true,
        pendingBalance: true,
        upiId: true
      }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
