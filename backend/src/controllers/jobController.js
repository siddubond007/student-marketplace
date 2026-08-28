const prisma = require('../config/db');
const { Prisma } = require('@prisma/client');

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
      where.locationPreferences = { contains: location, mode: 'insensitive' };
    }

    // Language Matching
    if (language) {
      where.languagePreferences = { contains: language, mode: 'insensitive' };
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
          client: { select: { id: true, fullName: true, email: true } },
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
            fullName: true,
            email: true
          }
        },
        bids: {
          select: {
            id: true,
            studentId: true,
            proposedAmount: true,
            deliveryDays: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (err) {
    console.error('Error in getMyProjects:', err);
    res.status(500).json({ error: err.message });
  }
};

// 6. GET JOB BY ID (AUTHORIZATION PROTECTED) (GET /api/jobs/:jobId)
exports.getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: { select: { id: true, fullName: true, email: true } },
        bids: {
          include: {
            student: { select: { id: true, fullName: true, email: true, freeBidsRemaining: true } }
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access Denied: You cannot view this internal project workspace.' });
    }

    res.json(job);
  } catch (err) {
    console.error('Error in getJobById:', err);
    res.status(500).json({ error: err.message });
  }
};

// 7. GET PUBLIC JOB BY ID (GET /api/jobs/public/:jobId)
exports.getPublicJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: { select: { id: true, fullName: true } },
        bids: { select: { id: true } }
      }
    });

    if (!job || job.status === 'DRAFT' || !job.isOpen) {
      return res.status(404).json({ error: 'Job not available or private.' });
    }

    return res.json(job);
  } catch (err) {
    console.error('Error in getPublicJobById:', err);
    return res.status(500).json({ error: err.message });
  }
};

// 8. DELETE JOB / DRAFT (DELETE /api/jobs/:jobId)
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this project.' });
    }

    await prisma.job.delete({ where: { id: jobId } });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error in deleteJob:', err);
    res.status(500).json({ error: err.message });
  }
};

// 9. HARDENED SUBMIT BID (POST /api/jobs/:jobId/bids)
// Solves: Concurrency quota race conditions & Sec 11 Indian Contract Act minor checks
exports.submitBid = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT_FREELANCER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered Student Freelancers can submit proposals.' });
    }

    const { proposedAmount, deliveryDays, coverLetter } = req.body;
    const jobId = req.params.jobId;

    if (!proposedAmount || parseFloat(proposedAmount) <= 0) {
      return res.status(400).json({ error: 'Proposed amount must be greater than zero.' });
    }

    // Interactive Transaction with Serializable Isolation Level to prevent race condition quota exploits
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. Fetch target job inside transaction lock
        const targetJob = await tx.job.findUnique({ where: { id: jobId } });
        if (!targetJob || targetJob.status === 'DRAFT' || !targetJob.isOpen) {
          throw new Error('This job is not accepting public proposals.');
        }

        // 2. Fetch fresh user state inside transaction
        const freshUser = await tx.user.findUnique({ where: { id: req.user.id } });
        if (!freshUser) {
          throw new Error('User account not found.');
        }

        if (freshUser.freeBidsRemaining <= 0) {
          throw new Error('No free bids remaining this month.');
        }

        // 3. Indian Contract Act Sec 11 Legal Safeguard for Minor Freelancers (<18 yrs)
        if (freshUser.age && freshUser.age < 18 && !freshUser.parentConsentDeclared) {
          throw new Error(
            'Sec 11 Compliance: Minor freelancers must have guardian consent affirmed to enter legally binding project bids.'
          );
        }

        // 4. Ensure 1 proposal limit per student per job
        const existingBid = await tx.bid.findUnique({
          where: { jobId_studentId: { jobId, studentId: req.user.id } }
        });
        if (existingBid) {
          throw new Error('You have already submitted a proposal for this job. Only 1 bid per applicant is permitted.');
        }

        // 5. Create bid and decrement bid quota atomically
        const bid = await tx.bid.create({
          data: {
            jobId,
            studentId: req.user.id,
            proposedAmount: parseFloat(proposedAmount),
            deliveryDays: parseInt(deliveryDays, 10) || 3,
            coverLetter: coverLetter || 'Looking forward to working on this project!'
          }
        });

        const updatedUser = await tx.user.update({
          where: { id: req.user.id },
          data: { freeBidsRemaining: { decrement: 1 } }
        });

        return { bid, remainingBids: updatedUser.freeBidsRemaining };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      }
    );

    return res.status(201).json({
      message: 'Proposal submitted successfully',
      bid: result.bid,
      remainingBids: result.remainingBids
    });
  } catch (err) {
    console.error('Error in submitBid:', err);
    return res.status(400).json({ error: err.message });
  }
};

// 10. HARDENED ACCEPT BID (POST /api/jobs/:jobId/bids/:bidId/accept)
// Solves: Fake escrow funding exploit by setting order status to PENDING_PAYMENT
exports.acceptBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only the project owner can hire freelancers.' });
    }

    const bid = await prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid || bid.jobId !== jobId) return res.status(404).json({ error: 'Bid not found for this job' });

    if (bid.proposedAmount <= 0) return res.status(400).json({ error: 'Invalid bid amount.' });

    // 10% platform fee calculation
    const platformFee = Number((bid.proposedAmount * 0.10).toFixed(2));
    const sellerEarnings = Number((bid.proposedAmount - platformFee).toFixed(2));
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + bid.deliveryDays);

    // 1. GENERATE RAZORPAY ORDER FIRST
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(bid.proposedAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `bid_${bid.id}`
    });

    // 2. CREATE DATABASE TRANSACTION
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          clientId: job.clientId,
          sellerId: bid.studentId,
          jobId: job.id,
          totalAmount: bid.proposedAmount,
          platformFee,
          sellerEarnings,
          status: 'PENDING_PAYMENT',
          razorpayOrderId: rzpOrder.id, // Save securely
          deadline
        }
      }),
      prisma.bid.update({
        where: { id: bid.id },
        data: { status: 'SHORTLISTED' }
      })
    ]);

    // 3. RETURN REQUIRED FLAGS TO FRONTEND
    return res.json({
      message: 'Freelancer selected! Please complete Razorpay checkout to fund escrow and lock hiring.',
      checkoutRequired: true,
      order: {
        id: order.id,
        razorpayOrderId: rzpOrder.id,
        totalAmount: bid.proposedAmount
      }
    });

  } catch (err) {
    console.error("Accept Bid Error:", err);
    return res.status(500).json({ error: 'Failed to accept bid and initiate escrow.' });
  }
};

exports.shortlistBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || (job.clientId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to manage bids for this job.' });
    }

    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: { status: 'SHORTLISTED' }
    });

    return res.json({ success: true, message: 'Proposal shortlisted', bid: updatedBid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 12. REJECT BID (POST /api/jobs/:jobId/bids/:bidId/reject)
exports.rejectBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || (job.clientId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to manage bids for this job.' });
    }

    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: { status: 'REJECTED' }
    });

    return res.json({ success: true, message: 'Proposal rejected', bid: updatedBid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
