const createGigRevision = async (tx, gigId, actorId, changeType) => {
  const gig = await tx.gig.findUnique({
    where: { id: gigId },
    include: {
      packages: {
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!gig) {
    throw new Error('Gig not found while creating revision snapshot.');
  }

  const latestRevision = await tx.gigRevision.findFirst({
    where: { gigId },
    orderBy: { version: 'desc' },
    select: { version: true }
  });

  const snapshot = {
    id: gig.id,
    sellerId: gig.sellerId,
    title: gig.title,
    category: gig.category,
    categoryId: gig.categoryId,
    subcategoryId: gig.subcategoryId,
    description: gig.description,
    coverImage: gig.coverImage,
    isTiered: gig.isTiered,
    status: gig.status,
    draftData: gig.draftData || {},
    draftVersion: gig.draftVersion,
    moderationStatus: gig.moderationStatus,
    moderationReasonCode: gig.moderationReasonCode,
    moderationFindings: gig.moderationFindings || null,
    packages: gig.packages.map((pkg) => ({
      id: pkg.id,
      tierName: pkg.tierName,
      price: pkg.price,
      deliveryDays: pkg.deliveryDays,
      revisions: pkg.revisions,
      description: pkg.description,
      scope: pkg.scope || null,
      features: pkg.features || null
    }))
  };

  return tx.gigRevision.create({
    data: {
      gigId: gig.id,
      actorId: actorId || null,
      version: (latestRevision?.version || 0) + 1,
      changeType,
      snapshot
    }
  });
};

module.exports = { createGigRevision };
