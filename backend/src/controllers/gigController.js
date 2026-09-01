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
        status: 'DRAFT',
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
