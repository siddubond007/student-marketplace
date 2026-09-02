const prisma = require('../config/db');

exports.createGig = async (req, res) => {
  try {
    const { title, category, categoryId, subcategoryId, description, coverImage, isTiered, packages } = req.body;
    const gig = await prisma.gig.create({
      data: {
        sellerId: req.user.id,
        title,
        category,
        categoryId,
        subcategoryId,
        description,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        isTiered: isTiered || false,
        packages: {
          create: packages || [{ tierName: 'Single', price: 499, deliveryDays: 2, revisions: 2, description: 'Standard student delivery' }]
        }
      },
      include: { packages: true, seller: { select: { fullName: true, age: true, profile: true } } }
    });
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getGigById = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await prisma.gig.findFirst({
      where: {
        id: gigId,
        status: 'PUBLISHED',
        isDeleted: false
      },
      include: {
        packages: {
          orderBy: { price: 'asc' }
        },
        seller: {
          select: {
            id: true,
            username: true,
            fullName: true,
            age: true,
            averageRating: true,
            totalReviews: true,
            points: true,
            profile: {
              select: {
                avatarUrl: true,
                tagline: true,
                bio: true,
                college: true,
                category: true,
                hourlyRate: true,
                skills: true,
                badges: true
              }
            },
            verification: {
              select: {
                status: true,
                collegeIdStatus: true,
                govtIdStatus: true
              }
            }
          }
        }
      }
    });

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found.' });
    }

    return res.json(gig);
  } catch (err) {
    console.error('Get Gig By ID Error:', err);
    return res.status(500).json({ error: 'Failed to load gig.' });
  }
};

exports.getMyGigs = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT_FREELANCER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Only Student Freelancer accounts can view their gigs.'
      });
    }

    const gigs = await prisma.gig.findMany({
      where: {
        sellerId: req.user.id,
        isDeleted: false
      },
      include: {
        packages: {
          orderBy: { price: 'asc' }
        },
        orders: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    return res.json(gigs);
  } catch (err) {
    console.error('Get My Gigs Error:', err);
    return res.status(500).json({ error: 'Failed to load your gigs.' });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const gigs = await prisma.gig.findMany({
      where: {
        status: 'PUBLISHED',
        isDeleted: false
      },
      include: { packages: true, seller: { select: { id: true, fullName: true, age: true, profile: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const stripHtmlToText = (value) =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|ul|ol)>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const validateGigSubmission = (draftData) => {
  const blockers = [];
  const addBlocker = (step, field, message, detail = null) => {
    blockers.push({ step, field, message, detail });
  };

  const basics = draftData?.basics || {};
  const pricing = draftData?.pricing || {};
  const delivery = draftData?.delivery || {};
  const requirements = Array.isArray(draftData?.requirements)
    ? draftData.requirements
    : [];
  const media = draftData?.media || {};
  const gallery = Array.isArray(media.gallery) ? media.gallery : [];

  const title = String(basics.title || '').trim();
  if (title.length < 3 || title.length > 120) {
    addBlocker(
      1,
      'title',
      'Complete your service basics.',
      title
        ? 'Title must be between 3 and 120 characters.'
        : 'Add a service title.'
    );
  }

  if (!String(basics.categoryId || '').trim()) {
    addBlocker(1, 'categoryId', 'Complete your service basics.', 'Select a primary category.');
  }

  if (!String(basics.subcategoryId || '').trim()) {
    addBlocker(1, 'subcategoryId', 'Complete your service basics.', 'Select a subcategory.');
  }

  if (!String(basics.serviceType || '').trim()) {
    addBlocker(1, 'serviceType', 'Complete your service basics.', 'Select a service type.');
  }

  const description = stripHtmlToText(draftData?.description);
  if (description.length < 50) {
    addBlocker(
      2,
      'description',
      'Add a meaningful service description.',
      description
        ? 'The description needs at least 50 meaningful characters.'
        : 'A service description is required.'
    );
  }

  const rawPrice = String(pricing.basePrice ?? '').trim();
  const price = Number(rawPrice);
  if (!rawPrice || !Number.isFinite(price) || !(price > 0)) {
    addBlocker(
      3,
      'basePrice',
      'Complete your pricing.',
      !rawPrice
        ? 'Enter a base price.'
        : 'Base price must be greater than 0.'
    );
  }

  if (!String(pricing.currency || '').trim()) {
    addBlocker(3, 'currency', 'Complete your pricing.', 'Select a currency.');
  }

  if (pricing.packageModel !== 'single') {
    addBlocker(3, 'packageModel', 'Complete your pricing.', 'Use single-price mode.');
  }

  const rawDelivery = String(delivery.deliveryDays ?? '').trim();
  const deliveryDays = Number(rawDelivery);
  if (
    !rawDelivery ||
    !Number.isInteger(deliveryDays) ||
    !(deliveryDays > 0)
  ) {
    addBlocker(
      4,
      'deliveryDays',
      'Complete your scope and delivery details.',
      !rawDelivery
        ? 'Set a delivery time.'
        : 'Delivery time must be a positive whole number of days.'
    );
  }

  const rawRevisions = String(delivery.revisions ?? '').trim();
  const revisions = Number(rawRevisions);
  if (
    !rawRevisions ||
    (rawRevisions !== 'unlimited' &&
      (!Number.isInteger(revisions) || revisions < 0))
  ) {
    addBlocker(
      4,
      'revisions',
      'Complete your scope and delivery details.',
      !rawRevisions
        ? 'Select a revision allowance.'
        : 'Revision allowance must be 0 or more, or unlimited.'
    );
  }

  const validateList = (items, field, label) => {
    const normalized = Array.isArray(items) ? items : [];
    const hasMeaningful = normalized.some(
      (item) => String(item || '').trim().length > 0
    );
    const hasBlank = normalized.some(
      (item) => String(item || '').trim().length === 0
    );

    if (!hasMeaningful) {
      addBlocker(
        4,
        field,
        'Complete your scope and delivery details.',
        `Add at least one ${label}.`
      );
    } else if (hasBlank) {
      addBlocker(
        4,
        field,
        'Complete your scope and delivery details.',
        `Complete all ${label} or remove blank items.`
      );
    }
  };

  validateList(delivery.includedItems, 'includedItems', 'included item');
  validateList(delivery.deliverables, 'deliverables', 'deliverable');

  const excludedItems = Array.isArray(delivery.excludedItems)
    ? delivery.excludedItems
    : [];
  if (
    excludedItems.length > 0 &&
    excludedItems.some((item) => String(item || '').trim().length === 0)
  ) {
    addBlocker(
      4,
      'excludedItems',
      'Complete your scope and delivery details.',
      'Complete or remove blank excluded items.'
    );
  }

  if (requirements.length === 0) {
    addBlocker(
      5,
      'requirements',
      'Complete your buyer requirements.',
      'Add at least one buyer requirement.'
    );
  } else {
    requirements.forEach((requirement, index) => {
      const prefix = `requirements.${requirement?.id || index}`;
      const questionValid =
        String(requirement?.question || '').trim().length > 0;
      const typeValid = Boolean(requirement?.type);
      const requiredValid = typeof requirement?.required === 'boolean';

      if (!typeValid || !requiredValid || !questionValid) {
        addBlocker(
          5,
          prefix,
          'Complete your buyer requirements.',
          'Every requirement needs a meaningful question and valid type settings.'
        );
      }

      if (requirement?.type === 'multiple-choice') {
        const options = Array.isArray(requirement.options)
          ? requirement.options
          : [];
        const meaningfulOptions = options.filter(
          (option) => String(option || '').trim().length > 0
        );

        if (meaningfulOptions.length < 2) {
          addBlocker(
            5,
            prefix,
            'Complete your buyer requirements.',
            'Multiple-choice requirements need at least two meaningful choices.'
          );
        }
      }
    });
  }

  if (!media.cover) {
    addBlocker(6, 'media.cover', 'Fix your media.', 'Add a cover image.');
  } else if (media.cover.validationError) {
    addBlocker(
      6,
      'media.cover',
      'Fix your media.',
      String(media.cover.validationError)
    );
  }

  const invalidGallery = gallery.find((item) => item?.validationError);
  if (invalidGallery) {
    addBlocker(
      6,
      `media.gallery.${invalidGallery.id || 'item'}`,
      'Fix your media.',
      'Fix or remove invalid gallery images.'
    );
  }

  return blockers;
};

const normalizeDraftVersion = (value) => {
  const version = Number(value);
  return Number.isInteger(version) && version >= 0 ? version : 0;
};

const canonicalizeJson = (value) => {
  if (Array.isArray(value)) {
    return value.map(canonicalizeJson);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = canonicalizeJson(value[key]);
        return result;
      }, {});
  }

  return value;
};

const areDraftsEqual = (left, right) =>
  JSON.stringify(canonicalizeJson(left)) ===
  JSON.stringify(canonicalizeJson(right));

const draftResponse = (gig) => ({
  id: gig.id,
  status: gig.status,
  draftData: gig.draftData || {},
  draftVersion: gig.draftVersion,
  updatedAt: gig.updatedAt
});

const resolveDraftTaxonomyIds = async (draftData, fallback = {}) => {
  const categorySlug =
    typeof draftData?.basics?.categoryId === 'string'
      ? draftData.basics.categoryId.trim()
      : '';

  const subcategorySlug =
    typeof draftData?.basics?.subcategoryId === 'string'
      ? draftData.basics.subcategoryId.trim()
      : '';

  let categoryId =
    Object.prototype.hasOwnProperty.call(fallback, 'categoryId')
      ? fallback.categoryId
      : null;

  let subcategoryId =
    Object.prototype.hasOwnProperty.call(fallback, 'subcategoryId')
      ? fallback.subcategoryId
      : null;

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true }
    });

    categoryId = category?.id || null;
  } else {
    categoryId = null;
  }

  if (subcategorySlug) {
    const subcategory = await prisma.subcategory.findUnique({
      where: { slug: subcategorySlug },
      select: { id: true, categoryId: true }
    });

    if (
      subcategory &&
      (!categoryId || subcategory.categoryId === categoryId)
    ) {
      subcategoryId = subcategory.id;
    } else {
      subcategoryId = null;
    }
  } else {
    subcategoryId = null;
  }

  return {
    categoryId,
    subcategoryId
  };
};

exports.createGigDraft = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT_FREELANCER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Only Student Freelancer accounts can create gig drafts.'
      });
    }

    const { draftData, draftVersion } = req.body;

    if (!draftData || typeof draftData !== 'object' || Array.isArray(draftData)) {
      return res.status(400).json({ error: 'draftData must be a JSON object.' });
    }

    const clientVersion = normalizeDraftVersion(draftVersion);
    const { categoryId, subcategoryId } = await resolveDraftTaxonomyIds(draftData);

    const gig = await prisma.gig.create({
      data: {
        sellerId: req.user.id,
        title: typeof draftData?.basics?.title === 'string'
          ? draftData.basics.title
          : 'Untitled Draft',
        category: typeof draftData?.basics?.categoryId === 'string'
          ? draftData.basics.categoryId
          : '',
        categoryId,
        subcategoryId,
        description: typeof draftData.description === 'string'
          ? draftData.description
          : '',
        coverImage: typeof draftData?.media?.cover?.url === 'string'
          ? draftData.media.cover.url
          : '',
        status: 'DRAFT',
        draftData,
        draftVersion: Math.max(clientVersion, 1)
      }
    });

    return res.status(201).json({
      message: 'Gig draft saved successfully.',
      draft: draftResponse(gig)
    });
  } catch (err) {
    console.error('Create Gig Draft Error:', err);
    return res.status(500).json({ error: 'Failed to create gig draft.' });
  }
};

exports.getGigDraft = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await prisma.gig.findFirst({
      where: {
        id: gigId,
        sellerId: req.user.id,
        status: { in: ['DRAFT', 'PENDING_REVIEW'] },
        isDeleted: false
      }
    });

    if (!gig) {
      return res.status(404).json({ error: 'Gig draft not found.' });
    }

    return res.json({
      draft: draftResponse(gig)
    });
  } catch (err) {
    console.error('Get Gig Draft Error:', err);
    return res.status(500).json({ error: 'Failed to load gig draft.' });
  }
};

exports.updateGigDraft = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { draftData, draftVersion } = req.body;

    if (!draftData || typeof draftData !== 'object' || Array.isArray(draftData)) {
      return res.status(400).json({ error: 'draftData must be a JSON object.' });
    }

    const existingGig = await prisma.gig.findFirst({
      where: {
        id: gigId,
        sellerId: req.user.id,
        status: 'DRAFT',
        isDeleted: false
      }
    });

    if (!existingGig) {
      return res.status(404).json({ error: 'Gig draft not found.' });
    }

    const clientVersion = normalizeDraftVersion(draftVersion);

    if (clientVersion < existingGig.draftVersion) {
      return res.status(409).json({
        error: 'Stale draft version rejected.',
        draft: draftResponse(existingGig)
      });
    }

    if (clientVersion === existingGig.draftVersion) {
      const sameDraft = areDraftsEqual(
        existingGig.draftData || {},
        draftData
      );

      if (sameDraft) {
        return res.json({
          message: 'Gig draft already saved.',
          draft: draftResponse(existingGig)
        });
      }

      return res.status(409).json({
        error: 'Draft version conflict. Refresh the saved draft before overwriting it.',
        draft: draftResponse(existingGig)
      });
    }

    const { categoryId, subcategoryId } = await resolveDraftTaxonomyIds(
      draftData,
      {
        categoryId: existingGig.categoryId,
        subcategoryId: existingGig.subcategoryId
      }
    );

    const result = await prisma.gig.updateMany({
      where: {
        id: gigId,
        sellerId: req.user.id,
        status: 'DRAFT',
        isDeleted: false,
        draftVersion: existingGig.draftVersion
      },
      data: {
        title: typeof draftData?.basics?.title === 'string'
          ? draftData.basics.title
          : existingGig.title,
        category: typeof draftData?.basics?.categoryId === 'string'
          ? draftData.basics.categoryId
          : existingGig.category,
        categoryId,
        subcategoryId,
        description: typeof draftData.description === 'string'
          ? draftData.description
          : existingGig.description,
        coverImage: typeof draftData?.media?.cover?.url === 'string'
          ? draftData.media.cover.url
          : existingGig.coverImage,
        draftData,
        draftVersion: clientVersion
      }
    });

    if (result.count !== 1) {
      const latest = await prisma.gig.findFirst({
        where: {
          id: gigId,
          sellerId: req.user.id,
          status: 'DRAFT',
          isDeleted: false
        }
      });

      if (!latest) {
        return res.status(404).json({ error: 'Gig draft not found.' });
      }

      return res.status(409).json({
        error: 'Draft was updated by another save request.',
        draft: draftResponse(latest)
      });
    }

    const updatedGig = await prisma.gig.findUnique({
      where: { id: gigId }
    });

    return res.json({
      message: 'Gig draft updated successfully.',
      draft: draftResponse(updatedGig)
    });
  } catch (err) {
    console.error('Update Gig Draft Error:', err);
    return res.status(500).json({ error: 'Failed to update gig draft.' });
  }
};


exports.submitGigDraft = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT_FREELANCER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Only Student Freelancer accounts can submit gig drafts.'
      });
    }

    const { gigId } = req.params;

    const gig = await prisma.gig.findFirst({
      where: {
        id: gigId,
        sellerId: req.user.id,
        status: 'DRAFT',
        isDeleted: false
      }
    });

    if (!gig) {
      return res.status(404).json({ error: 'Gig draft not found.' });
    }

    const blockers = validateGigSubmission(gig.draftData || {});

    if (blockers.length > 0) {
      return res.status(422).json({
        error: 'Gig cannot be submitted until all required blockers are fixed.',
        blockers
      });
    }

    const submittedGig = await prisma.gig.updateMany({
      where: {
        id: gigId,
        sellerId: req.user.id,
        status: 'DRAFT',
        isDeleted: false,
        draftVersion: gig.draftVersion
      },
      data: {
        status: 'PENDING_REVIEW'
      }
    });

    if (submittedGig.count !== 1) {
      return res.status(409).json({
        error: 'The gig changed before submission. Refresh the draft and try again.'
      });
    }

    const updatedGig = await prisma.gig.findUnique({
      where: { id: gigId }
    });

    return res.json({
      message: 'Gig submitted for review successfully.',
      submission: {
        id: updatedGig.id,
        status: updatedGig.status,
        updatedAt: updatedGig.updatedAt
      }
    });
  } catch (err) {
    console.error('Submit Gig Draft Error:', err);
    return res.status(500).json({ error: 'Failed to submit gig for review.' });
  }
};
