const prisma = require('../config/db');

async function recalculateUserReputation(userId) {
  const reviewStats = await prisma.review.aggregate({
    where: {
      revieweeId: userId,
      isVisible: true
    },
    _avg: {
      overallRating: true,
      communicationRating: true,
      qualityRating: true,
      timelinessRating: true
    },
    _count: {
      id: true
    }
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      averageRating: Number(reviewStats._avg.overallRating || 0),
      communicationAvg: Number(reviewStats._avg.communicationRating || 0),
      qualityAvg: Number(reviewStats._avg.qualityRating || 0),
      timelinessAvg: Number(reviewStats._avg.timelinessRating || 0),
      totalReviews: reviewStats._count.id
    }
  });
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        wallet: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Admin retrieved ${users.length} users successfully.`);
    res.json(users);
  } catch (err) {
    console.error("Admin getAllUsers Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      studentCount,
      clientCount,
      suspendedUsers,
      totalJobs,
      openJobs,
      totalOrders,
      completedOrders,
      disputedOrders,
      pendingVerifications,
      approvedVerifications,
      moderationLogs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT_FREELANCER' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.job.count(),
      prisma.job.count({ where: { isOpen: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count({ where: { status: 'DISPUTED' } }),
      prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      prisma.verificationRequest.count({ where: { status: 'APPROVED' } }),
      prisma.moderationLog.count()
    ]);

    const reputationStats = await prisma.user.aggregate({
      _sum: { points: true },
      _avg: { averageRating: true }
    });

    const stats = {
      totalUsers,
      studentCount,
      clientCount,
      suspendedUsers,
      totalJobs,
      openJobs,
      totalOrders,
      completedOrders,
      disputedOrders,
      pendingVerifications,
      approvedVerifications,
      moderationLogs,
      totalReputationPoints: reputationStats._sum.points || 0,
      averagePlatformRating: Number(
        reputationStats._avg.averageRating || 0
      ).toFixed(2)
    };

    res.json(stats);
  } catch (err) {
    console.error("Admin getStats Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete: ' + err.message });
  }
};

exports.toggleSuspend = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: !user.isSuspended }
    });

    res.json({ message: `User status changed to ${updated.isSuspended ? 'SUSPENDED' : 'ACTIVE'}.`, isSuspended: updated.isSuspended });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    res.json({ message: `User role changed to ${role}.`, user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getModerationLogs = async (req, res) => {
  try {
    const logs = await prisma.moderationLog.findMany({
      include: { sender: { select: { fullName: true, email: true, username: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getVerifications = async (req, res) => {
  try {
    const verifications = await prisma.verificationRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            username: true,
            age: true,
            role: true,
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(verifications);
  } catch (err) {
    console.error('getVerifications error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, status, reason } = req.body;
    
    const dataToUpdate = {
      reviewedAt: new Date()
    };

    if (type === 'COLLEGE') {
      dataToUpdate.collegeIdStatus = status;
      dataToUpdate.collegeRejectionReason = status === 'REJECTED' ? (reason || 'College ID document was unreadable or rejected.') : null;
    } else if (type === 'GOVT') {
      dataToUpdate.govtIdStatus = status;
      dataToUpdate.govtRejectionReason = status === 'REJECTED' ? (reason || 'Government ID document was unreadable or rejected.') : null;
    } else {
      dataToUpdate.status = status;
      dataToUpdate.collegeIdStatus = status;
      dataToUpdate.govtIdStatus = status;
    }

    const verification = await prisma.verificationRequest.update({
      where: { id },
      data: dataToUpdate
    });

    await prisma.notification.create({
      data: {
        userId: verification.userId,
        title: status === 'APPROVED'
          ? 'Verification Approved'
          : 'Verification Update',
        message: status === 'APPROVED'
          ? 'Your student verification has been approved. Your profile now displays verified status.'
          : `Verification status changed to ${status}.`,
        type: 'VERIFICATION_STATUS'
      }
    });
    
    res.json({ message: `Verification for ${type || 'All'} updated to ${status}`, verification });
  } catch (err) {
    console.error('updateVerificationStatus error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPayoutRequests = async (req, res) => {
  try {
    const payouts = await prisma.payoutRequest.findMany({
      include: {
        user: {
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

    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approvePayoutRequest = async (req, res) => {
  try {
    const { payoutId } = req.params;

    const payout = await prisma.payoutRequest.findUnique({
      where: { id: payoutId }
    });

    if (!payout) {
      return res.status(404).json({ error: 'Payout request not found.' });
    }

    await prisma.$transaction([
      prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: 'COMPLETED',
          processedAt: new Date()
        }
      }),
      prisma.wallet.update({
        where: { userId: payout.userId },
        data: {
          pendingBalance: {
            decrement: payout.amount
          }
        }
      })
    ]);

    res.json({ message: 'Payout approved successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectPayoutRequest = async (req, res) => {
  try {
    const { payoutId } = req.params;

    const payout = await prisma.payoutRequest.findUnique({
      where: { id: payoutId }
    });

    if (!payout) {
      return res.status(404).json({ error: 'Payout request not found.' });
    }

    await prisma.$transaction([
      prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: 'REJECTED',
          processedAt: new Date()
        }
      }),
      prisma.wallet.update({
        where: { userId: payout.userId },
        data: {
          pendingBalance: {
            decrement: payout.amount
          },
          availableBalance: {
            increment: payout.amount
          }
        }
      })
    ]);

    res.json({ message: 'Payout rejected and funds returned to wallet.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        reviewer: { select: { fullName: true } },
        reviewee: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.hideReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        isVisible: false,
        moderatedBy: req.user.id,
        moderatedAt: new Date(),
        moderationReason: reason || 'Hidden by admin'
      }
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.showReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        isVisible: true,
        moderatedBy: req.user.id,
        moderatedAt: new Date(),
        moderationReason: 'Review restored by admin'
      }
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.flagReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        isFlagged: true,
        moderatedBy: req.user.id,
        moderatedAt: new Date(),
        moderationReason: reason || 'Flagged by admin'
      }
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await prisma.review.delete({
      where: { id: reviewId }
    });

    res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

