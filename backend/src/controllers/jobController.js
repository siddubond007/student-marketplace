const prisma = require('../config/db');

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access Denied: Only Client accounts can post job briefs.' });
    }

    const { title, category, description, budget, reviewWindow, attachmentUrls } = req.body;
    const job = await prisma.job.create({
      data: {
        clientId: req.user.id,
        title,
        category,
        description,
        budget: parseFloat(budget),
        reviewWindow: reviewWindow ? parseInt(reviewWindow, 10) : 5,
        attachmentUrls: attachmentUrls || []
      },
      include: { client: { select: { id: true, fullName: true, email: true } } }
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { isOpen: true },
      include: {
        client: { select: { id: true, fullName: true } },
        bids: { select: { id: true, studentId: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 30 // Capped at the latest 30 live jobs
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this job.' });
    }

    await prisma.job.delete({ where: { id: jobId } });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitBid = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT_FREELANCER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered Student Freelancers can submit proposals.' });
    }

    const { proposedAmount, deliveryDays, coverLetter } = req.body;
    const jobId = req.params.jobId;

    if (req.user.freeBidsRemaining <= 0) {
      return res.status(403).json({ error: 'No free bids remaining this month.' });
    }

    const existingBid = await prisma.bid.findUnique({
      where: { jobId_studentId: { jobId, studentId: req.user.id } }
    });
    if (existingBid) {
      return res.status(400).json({ error: 'You have already submitted a proposal for this job. Only 1 bid per applicant is permitted.' });
    }

    const [bid, updatedUser] = await prisma.$transaction([
      prisma.bid.create({
        data: {
          jobId,
          studentId: req.user.id,
          proposedAmount: parseFloat(proposedAmount),
          deliveryDays: parseInt(deliveryDays, 10),
          coverLetter: coverLetter || 'Looking forward to working on this project!'
        }
      }),
      prisma.user.update({
        where: { id: req.user.id },
        data: { freeBidsRemaining: { decrement: 1 } }
      })
    ]);

    res.status(201).json({ message: 'Proposal submitted successfully', bid, remainingBids: updatedUser.freeBidsRemaining });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
