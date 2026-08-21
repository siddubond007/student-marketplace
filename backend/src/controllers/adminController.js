const prisma = require('../config/db');

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
    const totalUsers = await prisma.user.count();
    const studentCount = await prisma.user.count({ where: { role: 'STUDENT_FREELANCER' } });
    const clientCount = await prisma.user.count({ where: { role: 'CLIENT' } });
    const totalJobs = await prisma.job.count();
    const totalOrders = await prisma.order.count();
    const moderationLogs = await prisma.moderationLog.count();

    res.json({
      totalUsers,
      studentCount,
      clientCount,
      totalJobs,
      totalOrders,
      moderationLogs
    });
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
    
    res.json({ message: `Verification for ${type || 'All'} updated to ${status}`, verification });
  } catch (err) {
    console.error('updateVerificationStatus error:', err);
    res.status(500).json({ error: err.message });
  }
};
