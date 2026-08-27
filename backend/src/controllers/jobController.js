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
      categoryId,
      subcategory,
      subcategoryId,
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
          categoryId: categoryId !== undefined ? categoryId : existingJob.categoryId,
          subcategory: subcategory !== undefined ? subcategory : existingJob.subcategory,
          subcategoryId: subcategoryId !== undefined ? subcategoryId : existingJob.subcategoryId,
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
      categoryId,
      subcategory,
      subcategoryId,
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
          categoryId: categoryId !== undefined ? categoryId : existingJob.categoryId,
        subcategory: subcategory !== undefined ? subcategory : existingJob.subcategory,
          subcategoryId: subcategoryId !== undefined ? subcategoryId : existingJob.subcategoryId,
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

// 3. GET PUBLIC JOBS (Enterprise Discovery API with Multifaceted Filtering)
exports.getJobs = async (req, res) => {
  try {
    const { q, minBudget, maxBudget, type, skills, location, language, page = 1, limit = 20 } = req.query;

    // Base constraints
    let where = {
      isOpen: true,
      status: 'OPEN'
    };

    // Full-Text Search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }

    // Budget Range constraints
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget.gte = parseFloat(minBudget);
      if (maxBudget) where.budget.lte = parseFloat(maxBudget);
    }

    // Project Type
    if (type) {
      const typesArray = type.split(',').map(t => t.trim());
      where.projectType = { in: typesArray };
    }

    // Multi-Skill Matching
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      where.skills = { hasSome: skillsArray };
    }

    // Location Matching
    if (location) {
      where.preferredLocation = location;
    }

    // Language Matching
    if (language) {
      where.preferredLanguages = { hasSome: [language] };
    }

    // Pagination calculations
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Execute parallel queries for optimal performance
    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          client: { select: { id: true, fullName: true, profile: true } },
          bids: { select: { id: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        total: totalJobs,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalJobs / pageSize)
      }
    });
  } catch (err) {
    console.error('Error in Enterprise getJobs:', err);
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

    // Security: Only owner/admin can access the private client project page
    if (job.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access Denied: You cannot view this project.' });
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

// PUBLIC JOB DETAILS (GET /api/jobs/public/:jobId)
exports.getPublicJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        },
        bids: {
          select: {
            id: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'DRAFT' || !job.isOpen) {
      return res.status(404).json({ error: 'Job not available' });
    }

    return res.json(job);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ACCEPT BID / HIRE STUDENT
exports.acceptBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.clientId !== req.user.id) return res.status(403).json({ error: 'Only project owner can hire.' });

    const bid = await prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid || bid.jobId !== jobId) return res.status(404).json({ error: 'Bid not found' });
    if (!job.isOpen) return res.status(400).json({ error: 'This project already has a hired student.' });

    // SECURITY UPGRADE: Prevent negative money exploits
    if (bid.proposedAmount <= 0) return res.status(400).json({ error: 'Invalid bid amount.' });

    const platformFee = bid.proposedAmount * 0.10;
    const sellerEarnings = bid.proposedAmount - platformFee;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + bid.deliveryDays);

    // ARCHITECTURE UPGRADE: Execute as a single atomic transaction
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          clientId: job.clientId,
          sellerId: bid.studentId,
          jobId: job.id,
          totalAmount: bid.proposedAmount,
          platformFee,
          sellerEarnings,
          status: 'FUNDED_IN_ESCROW', // Fixed Escrow Bypass
          deadline
        }
      }),
      prisma.bid.update({
        where: { id: bid.id },
        data: { status: 'HIRED' }
      }),
      prisma.notification.create({
        data: {
          userId: bid.studentId,
          title: "You Have Been Hired",
          message: "Congratulations! The client has funded the escrow. You can now start working.",
          type: "BID_HIRED"
        }
      }),
      prisma.job.update({
        where: { id: job.id },
        data: { status: 'IN_PROGRESS', isOpen: false }
      })
    ]);

    return res.json({
      success: true,
      message: 'Student hired successfully and funds secured in escrow',
      order
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.shortlistBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can manage proposals.' });
    }

    const bid = await prisma.bid.findUnique({
      where: { id: bidId }
    });

    if (!bid || bid.jobId !== jobId) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: {
        status: 'SHORTLISTED'
      }
    });

    await prisma.notification.create({
      data: {
        userId: bid.studentId,
        title: "Proposal Shortlisted",
        message: "Good news! Your proposal has been shortlisted by a client. You are one step closer to being hired.",
        type: "PROPOSAL_SHORTLISTED"
      }
    });

    return res.json({
      success: true,
      message: 'Proposal shortlisted',
      bid: updatedBid
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.rejectBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can manage proposals.' });
    }

    const bid = await prisma.bid.findUnique({
      where: { id: bidId }
    });

    if (!bid || bid.jobId !== jobId) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: {
        status: 'REJECTED'
      }
    });

    return res.json({
      success: true,
      message: 'Proposal rejected',
      bid: updatedBid
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
