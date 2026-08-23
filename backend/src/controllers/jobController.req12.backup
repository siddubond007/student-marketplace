const prisma = require('../config/db');

// 1. CREATE OR SAVE DRAFT (POST /api/jobs)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access Denied: Only Client accounts can post jobs or save drafts.' });
    }

    const {
      id,
      title,
      category,
      subcategory,
      projectType,
      description,
      deliverables,
      requirements,
      skills,
      experienceLevel,
      budget,
      timeline,
      reviewWindow,
      attachmentUrls,
      externalLinks,
      referenceLinks,
      visibility,
      locationPreferences,
      languagePreferences,
      screeningQuestions,
      currentStep,
      status
    } = req.body;

    const jobStatus = status || 'OPEN';
    const isOpenState = jobStatus === 'OPEN';

    // If draft ID already exists, update the existing draft
    if (id) {
      const existingJob = await prisma.job.findUnique({ where: { id } });
      if (!existingJob) {
        return res.status(404).json({ error: 'Job not found to update' });
      }
      if (existingJob.clientId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'You do not have permission to edit this draft.' });
      }

      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          title: title !== undefined ? title : existingJob.title,
          category: category !== undefined ? category : existingJob.category,
          subcategory: subcategory !== undefined ? subcategory : existingJob.subcategory,
          projectType: projectType !== undefined ? projectType : existingJob.projectType,
          description: description !== undefined ? description : existingJob.description,
          deliverables: deliverables !== undefined ? deliverables : existingJob.deliverables,
          requirements: requirements !== undefined ? requirements : existingJob.requirements,
          skills: skills !== undefined ? skills : existingJob.skills,
          experienceLevel: experienceLevel !== undefined ? experienceLevel : existingJob.experienceLevel,
          budget: budget !== undefined ? parseFloat(budget) || 0 : existingJob.budget,
          timeline: timeline !== undefined ? timeline : existingJob.timeline,
          reviewWindow: reviewWindow ? parseInt(reviewWindow, 10) : existingJob.reviewWindow,
          attachmentUrls: attachmentUrls !== undefined ? attachmentUrls : existingJob.attachmentUrls,
          externalLinks: externalLinks !== undefined ? externalLinks : existingJob.externalLinks,
          referenceLinks: referenceLinks !== undefined ? referenceLinks : existingJob.referenceLinks,
          visibility: visibility !== undefined ? visibility : existingJob.visibility,
          locationPreferences: locationPreferences !== undefined ? locationPreferences : existingJob.locationPreferences,
          languagePreferences: languagePreferences !== undefined ? languagePreferences : existingJob.languagePreferences,
          screeningQuestions: screeningQuestions !== undefined ? screeningQuestions : existingJob.screeningQuestions,
          currentStep: currentStep !== undefined ? parseInt(currentStep, 10) : existingJob.currentStep,
          status: jobStatus,
          isOpen: isOpenState
        },
        include: { client: { select: { id: true, fullName: true, email: true } } }
      });

      return res.json({
        message: jobStatus === 'DRAFT' ? 'Draft updated successfully' : 'Job published successfully',
        job: updatedJob
      });
    }

    // Otherwise create a new Job or Draft
    const job = await prisma.job.create({
      data: {
        clientId: req.user.id,
        title: title || 'Untitled Draft',
        category: category || 'Web Development',
        subcategory: subcategory || '',
        projectType: projectType || 'FIXED',
        description: description || '',
        deliverables: deliverables || [],
        requirements: requirements || null,
        skills: skills || [],
        experienceLevel: experienceLevel || 'INTERMEDIATE',
        budget: budget ? parseFloat(budget) || 0 : 0,
        timeline: timeline || '1_MONTH',
        reviewWindow: reviewWindow ? parseInt(reviewWindow, 10) : 5,
        attachmentUrls: attachmentUrls || [],
        externalLinks: externalLinks || [],
        referenceLinks: referenceLinks || [],
        visibility: visibility || 'PUBLIC',
        locationPreferences: locationPreferences || '',
        languagePreferences: languagePreferences || '',
        screeningQuestions: screeningQuestions || [],
        currentStep: currentStep ? parseInt(currentStep, 10) : 1,
        status: jobStatus,
        isOpen: isOpenState
      },
      include: { client: { select: { id: true, fullName: true, email: true } } }
    });

    res.status(201).json({
      message: jobStatus === 'DRAFT' ? 'Draft saved successfully' : 'Job created successfully',
      job
    });
  } catch (err) {
    console.error('Error in createJob:', err);
    res.status(500).json({ error: err.message });
  }
};

// 2. UPDATE EXISTING JOB / DRAFT (PUT /api/jobs/:jobId)
exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const existingJob = await prisma.job.findUnique({ where: { id: jobId } });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (existingJob.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to edit this job.' });
    }

    const {
      title,
      category,
      subcategory,
      projectType,
      description,
      deliverables,
      requirements,
      skills,
      experienceLevel,
      budget,
      timeline,
      reviewWindow,
      attachmentUrls,
      externalLinks,
      referenceLinks,
      visibility,
      locationPreferences,
      languagePreferences,
      screeningQuestions,
      currentStep,
      status
    } = req.body;

    const jobStatus = status || existingJob.status;
    const isOpenState = jobStatus === 'OPEN';

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: title !== undefined ? title : existingJob.title,
        category: category !== undefined ? category : existingJob.category,
        subcategory: subcategory !== undefined ? subcategory : existingJob.subcategory,
        projectType: projectType !== undefined ? projectType : existingJob.projectType,
        description: description !== undefined ? description : existingJob.description,
        deliverables: deliverables !== undefined ? deliverables : existingJob.deliverables,
        requirements: requirements !== undefined ? requirements : existingJob.requirements,
        skills: skills !== undefined ? skills : existingJob.skills,
        experienceLevel: experienceLevel !== undefined ? experienceLevel : existingJob.experienceLevel,
        budget: budget !== undefined ? parseFloat(budget) || 0 : existingJob.budget,
        timeline: timeline !== undefined ? timeline : existingJob.timeline,
        reviewWindow: reviewWindow !== undefined ? parseInt(reviewWindow, 10) : existingJob.reviewWindow,
        attachmentUrls: attachmentUrls !== undefined ? attachmentUrls : existingJob.attachmentUrls,
        externalLinks: externalLinks !== undefined ? externalLinks : existingJob.externalLinks,
        referenceLinks: referenceLinks !== undefined ? referenceLinks : existingJob.referenceLinks,
        visibility: visibility !== undefined ? visibility : existingJob.visibility,
        locationPreferences: locationPreferences !== undefined ? locationPreferences : existingJob.locationPreferences,
        languagePreferences: languagePreferences !== undefined ? languagePreferences : existingJob.languagePreferences,
        screeningQuestions: screeningQuestions !== undefined ? screeningQuestions : existingJob.screeningQuestions,
        currentStep: currentStep !== undefined ? parseInt(currentStep, 10) : existingJob.currentStep,
        status: jobStatus,
        isOpen: isOpenState
      },
      include: { client: { select: { id: true, fullName: true, email: true } } }
    });

    res.json({
      message: updatedJob.status === 'DRAFT' ? 'Draft updated successfully' : 'Job updated successfully',
      job: updatedJob
    });
  } catch (err) {
    console.error('Error in updateJob:', err);
    res.status(500).json({ error: err.message });
  }
};

// 3. GET PUBLIC JOBS (Hides DRAFT jobs from marketplace)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        isOpen: true,
        status: 'OPEN'
      },
      include: {
        client: { select: { id: true, fullName: true } },
        bids: { select: { id: true, studentId: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. GET CLIENT'S DRAFTS ONLY (GET /api/jobs/my-drafts)
exports.getMyDrafts = async (req, res) => {
  try {
    const drafts = await prisma.job.findMany({
      where: {
        clientId: req.user.id,
        status: 'DRAFT'
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 5. GET ALL PROJECTS FOR LOGGED-IN CLIENT (GET /api/jobs/my-projects)
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await prisma.job.findMany({
      where: {
        clientId: req.user.id
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        },
        bids: {
          select: {
            id: true,
            studentId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. GET SINGLE JOB / DRAFT BY ID (GET /api/jobs/:jobId)
exports.getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: { select: { id: true, fullName: true } },
        bids: {
          include: {
            student: { select: { id: true, fullName: true, profile: true } }
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Security: Only owner/admin can inspect drafts
    if (job.status === 'DRAFT' && job.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access Denied: You cannot view this draft.' });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. DELETE JOB / DRAFT (DELETE /api/jobs/:jobId)
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

// 7. SUBMIT BID (Preserves proposal submission logic)
exports.submitBid = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT_FREELANCER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered Student Freelancers can submit proposals.' });
    }

    const { proposedAmount, deliveryDays, coverLetter } = req.body;
    const jobId = req.params.jobId;

    const targetJob = await prisma.job.findUnique({ where: { id: jobId } });
    if (!targetJob || targetJob.status === 'DRAFT' || !targetJob.isOpen) {
      return res.status(400).json({ error: 'This job is not accepting public proposals.' });
    }

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
