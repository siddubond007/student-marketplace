const prisma = require('../config/db');

const ACTIVE_ORDER_STATUSES = [
  'FUNDED_IN_ESCROW',
  'REQUIREMENTS_SUBMITTED',
  'IN_PROGRESS',
  'DELIVERED',
  'REVISION_REQUESTED',
  'IN_REVIEW'
];

const dashboardOrderInclude = {
  seller: {
    select: {
      id: true,
      fullName: true
    }
  },
  job: {
    select: {
      id: true,
      title: true,
      status: true
    }
  },
  deliverables: {
    orderBy: {
      version: 'desc'
    },
    take: 1,
    select: {
      id: true,
      version: true,
      reviewStatus: true,
      submittedAt: true
    }
  }
};

exports.getClientDashboard = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'CLIENT') {
      return res.status(403).json({
        error: 'Access denied: client dashboard access required.'
      });
    }

    const clientId = req.user.id;

    const [
      jobs,
      proposalAggregate,
      orders,
      unreadNotifications
    ] = await Promise.all([
      prisma.job.findMany({
        where: {
          clientId,
          isDeleted: false
        },
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          isOpen: true,
          budget: true,
          deadlineDate: true,
          timeline: true,
          createdAt: true,
          updatedAt: true,
          bids: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),

      prisma.bid.count({
        where: {
          job: {
            clientId
          },
          status: {
            in: ['PENDING', 'SHORTLISTED']
          }
        }
      }),

      prisma.order.findMany({
        where: {
          clientId
        },
        include: dashboardOrderInclude,
        orderBy: {
          updatedAt: 'desc'
        }
      }),

      prisma.notification.count({
        where: {
          userId: clientId,
          isRead: false
        }
      })
    ]);

    const activeJobs = jobs.filter((job) =>
      ['IN_PROGRESS', 'PENDING_PAYMENT'].includes(String(job.status).toUpperCase())
    );

    const activeOrders = orders.filter((order) =>
      ACTIVE_ORDER_STATUSES.includes(order.status)
    );

    const activeProjectIds = new Set(
      activeOrders
        .map((order) => order.job?.id)
        .filter(Boolean)
    );

    const activeProjects = jobs
      .filter((job) => {
        const status = String(job.status || '').toUpperCase();
        return (
          activeProjectIds.has(job.id) ||
          status === 'IN_PROGRESS' ||
          status === 'PENDING_PAYMENT'
        );
      })
      .slice(0, 4)
      .map((job) => ({
        id: job.id,
        title: job.title,
        category: job.category,
        status: job.status,
        budget: job.budget,
        deadlineDate: job.deadlineDate,
        timeline: job.timeline,
        proposalCount: job.bids.length,
        updatedAt: job.updatedAt
      }));

    const proposalJobs = jobs
      .map((job) => ({
        ...job,
        pendingProposalCount: job.bids.filter((bid) =>
          ['PENDING', 'SHORTLISTED'].includes(bid.status)
        ).length
      }))
      .filter((job) => job.pendingProposalCount > 0)
      .sort((a, b) => b.pendingProposalCount - a.pendingProposalCount)
      .slice(0, 5)
      .map((job) => ({
        id: job.id,
        title: job.title,
        status: job.status,
        pendingProposalCount: job.pendingProposalCount
      }));

    const deliveryApprovalItems = orders
      .filter((order) =>
        order.status === 'DELIVERED' &&
        order.deliverables?.[0]?.reviewStatus === 'PENDING_REVIEW'
      )
      .slice(0, 5)
      .map((order) => ({
        orderId: order.id,
        projectId: order.job?.id || null,
        projectTitle: order.job?.title || 'Project',
        studentName: order.seller?.fullName || 'Student',
        amount: order.totalAmount,
        deliverableVersion: order.deliverables[0].version,
        submittedAt: order.deliverables[0].submittedAt
      }));

    const paymentItems = orders
      .filter((order) => order.status === 'PENDING_PAYMENT')
      .slice(0, 5)
      .map((order) => ({
        orderId: order.id,
        projectId: order.job?.id || null,
        projectTitle: order.job?.title || 'Project',
        studentName: order.seller?.fullName || 'Student',
        amount: order.totalAmount,
        createdAt: order.createdAt
      }));

    const totalSpend = orders
      .filter((order) =>
        order.status !== 'PENDING_PAYMENT' &&
        order.status !== 'CANCELLED_REFUNDED'
      )
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const escrowAmount = orders
      .filter((order) => ACTIVE_ORDER_STATUSES.includes(order.status))
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const completedProjects = orders.filter(
      (order) => order.status === 'COMPLETED'
    ).length;

    const projectCounts = {
      all: jobs.length,
      drafts: jobs.filter((job) => String(job.status).toUpperCase() === 'DRAFT').length,
      published: jobs.filter((job) => String(job.status).toUpperCase() === 'OPEN').length,
      inProgress: jobs.filter((job) =>
        String(job.status).toUpperCase() === 'IN_PROGRESS'
      ).length,
      completed: jobs.filter((job) =>
        String(job.status).toUpperCase() === 'COMPLETED'
      ).length,
      cancelled: jobs.filter((job) =>
        String(job.status).toUpperCase() === 'CANCELLED'
      ).length
    };

    return res.json({
      summary: {
        activeProjects: activeJobs.length,
        pendingProposals: proposalAggregate,
        totalSpend,
        escrowAmount,
        completedProjects,
        unreadNotifications
      },
      projectCounts,
      attention: {
        proposalJobs,
        deliveryApprovalItems,
        paymentItems
      },
      activeProjects
    });
  } catch (err) {
    console.error('Client Dashboard Error:', err);
    return res.status(500).json({
      error: 'Failed to load client dashboard.'
    });
  }
};
