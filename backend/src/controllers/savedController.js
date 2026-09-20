const prisma = require('../config/db');

const canSaveJobs = (role) => role === 'STUDENT_FREELANCER' || role === 'ADMIN';
const canSaveGigs = (role) => role === 'CLIENT' || role === 'ADMIN';

exports.getSavedLibrary = async (req, res) => {
  try {
    const includeJobs = canSaveJobs(req.user.role);
    const includeGigs = canSaveGigs(req.user.role);
    const [savedJobs, gigFavorites] = await Promise.all([
      includeJobs ? prisma.savedJob.findMany({
        where: { userId: req.user.id }, orderBy: { createdAt: 'desc' },
        include: { job: { select: {
          id: true, title: true, category: true, subcategory: true, projectType: true, description: true,
          skills: true, experienceLevel: true, budgetType: true, fixedBudget: true, minimumBudget: true,
          maximumBudget: true, budget: true, currency: true, timeline: true, startPreference: true, startDate: true,
          deadlineType: true, deadlineDate: true, preferredLocation: true, preferredState: true, preferredCity: true,
          locationPreferences: true, preferredLanguages: true, languagePreferences: true, status: true, isOpen: true,
          createdAt: true, updatedAt: true,
          client: { select: { id: true, fullName: true, averageRating: true, totalReviews: true, profile: { select: { avatarUrl: true, college: true } } } }
        } } }
      }) : Promise.resolve([]),
      includeGigs ? prisma.gigFavorite.findMany({
        where: { userId: req.user.id }, orderBy: { createdAt: 'desc' },
        include: { gig: { select: {
          id: true, title: true, category: true, description: true, coverImage: true, status: true, isDeleted: true,
          isTiered: true, createdAt: true, updatedAt: true,
          packages: {
            where: { tierName: { in: ['Single', 'Basic', 'Standard', 'Premium'] } },
            orderBy: { price: 'asc' }, select: { tierName: true, price: true, deliveryDays: true, revisions: true }
          },
          seller: { select: {
            id: true, fullName: true, averageRating: true, totalReviews: true,
            profile: { select: { avatarUrl: true, college: true, tagline: true } }
          } }
        } } }
      }) : Promise.resolve([])
    ]);

    return res.json({
      jobs: savedJobs.map(item => ({ id: item.id, savedAt: item.createdAt, job: item.job })),
      gigs: gigFavorites.map(item => ({ id: item.id, savedAt: item.createdAt, gig: item.gig }))
    });
  } catch (error) {
    console.error('Get Saved Library Error:', error);
    return res.status(500).json({ error: 'Failed to load your Saved Library.' });
  }
};

exports.saveJob = async (req, res) => {
  try {
    if (!canSaveJobs(req.user.role)) return res.status(403).json({ error: 'Only Student Freelancer accounts can save projects.' });
    const { jobId } = req.params;
    const job = await prisma.job.findFirst({ where: { id: jobId, status: 'OPEN', isOpen: true, isDeleted: false }, select: { id: true } });
    if (!job) return res.status(404).json({ error: 'Open project not found.' });
    const saved = await prisma.savedJob.upsert({
      where: { jobId_userId: { jobId, userId: req.user.id } }, create: { jobId, userId: req.user.id }, update: {}
    });
    return res.status(201).json({ saved: true, savedAt: saved.createdAt });
  } catch (error) {
    console.error('Save Job Error:', error);
    return res.status(500).json({ error: 'Failed to save this project.' });
  }
};

exports.removeSavedJob = async (req, res) => {
  try {
    if (!canSaveJobs(req.user.role)) return res.status(403).json({ error: 'Only Student Freelancer accounts can manage saved projects.' });
    const result = await prisma.savedJob.deleteMany({ where: { jobId: req.params.jobId, userId: req.user.id } });
    return res.json({ saved: false, removed: result.count > 0 });
  } catch (error) {
    console.error('Remove Saved Job Error:', error);
    return res.status(500).json({ error: 'Failed to remove this project from your Saved Library.' });
  }
};