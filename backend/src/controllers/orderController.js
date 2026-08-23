const prisma = require('../config/db');

// Create Order & Fund Escrow
exports.createOrder = async (req, res) => {
  try {
    const { sellerId, gigId, jobId, totalAmount, deliveryDays, requirements } = req.body;
    const amount = parseFloat(totalAmount);
    const platformFee = Number((amount * 0.06).toFixed(2)); // 6% fee
    const sellerEarnings = Number((amount * 0.94).toFixed(2)); // 94% net
    const days = parseInt(deliveryDays, 10) || 3;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    const order = await prisma.order.create({
      data: {
        clientId: req.user.id,
        sellerId,
        gigId: gigId || null,
        jobId: jobId || null,
        totalAmount: amount,
        platformFee,
        sellerEarnings,
        status: 'FUNDED_IN_ESCROW',
        deadline,
        requirements: requirements || 'Standard project deliverables.'
      },
      include: {
        client: { select: { id: true, fullName: true, email: true } },
        seller: { select: { id: true, fullName: true, email: true } }
      }
    });

    res.status(201).json({ message: 'Order created and escrow funded successfully.', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User's Active Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { clientId: req.user.id },
          { sellerId: req.user.id }
        ]
      },
      include: {
        client: { select: { id: true, fullName: true } },
        seller: { select: { id: true, fullName: true, age: true } },
        deliverables: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student Submits Deliverable
exports.submitDeliverable = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { fileUrls, driveLinks, message } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the assigned student freelancer can submit deliverables.' });
    }

    const autoApproveAt = new Date();
    autoApproveAt.setDate(autoApproveAt.getDate() + 5); // 5-day review timer

    const [deliverable, updatedOrder] = await prisma.$transaction([
      prisma.deliverable.create({
        data: {
          orderId,
          fileUrls: fileUrls || [],
          driveLinks: driveLinks || [],
          message: message || 'Work completed and submitted for review.'
        }
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'DELIVERED',
          autoApproveAt
        }
        }),
      prisma.notification.create({
        data: {
          userId: order.clientId,
          title: "Deliverable Submitted",
          message: "A freelancer has submitted work for your review. The 5-day approval timer has started.",
          type: "DELIVERABLE_SUBMITTED"
        }
      })
    ]);

    res.json({ message: 'Deliverable submitted. 5-day review timer started.', deliverable, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Client Approves Order & Releases Payout
exports.approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only the client can approve this order.' });
    }

    // Complete order and credit student wallet
    const [updatedOrder, updatedWallet] = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' }
      }),
      prisma.wallet.upsert({
        where: { userId: order.sellerId },
        create: {
          userId: order.sellerId,
          availableBalance: order.sellerEarnings
        },
        update: {
          availableBalance: { increment: order.sellerEarnings }
        }
      }),
      prisma.user.update({
        where: { id: order.sellerId },
        data: { points: { increment: 50 } } // +50 student reputation points
      }),
      prisma.notification.create({
        data: {
          userId: order.sellerId,
          title: "Order Approved",
          message: `Your order has been approved and ₹${order.sellerEarnings} has been added to your wallet.`,
          type: "ORDER_APPROVED"
        }
      })
    ]);

    res.json({ message: 'Order approved! ₹' + order.sellerEarnings + ' released to student wallet.', order: updatedOrder, wallet: updatedWallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Order Messages
exports.getMessages = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (
      order.clientId !== req.user.id &&
      order.sellerId !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await prisma.message.findMany({
      where: { orderId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isClient = order.clientId === req.user.id;
    const isSeller = order.sellerId === req.user.id;

    if (!isClient && !isSeller) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const recipientId = isClient
      ? order.sellerId
      : order.clientId;

    const message = await prisma.message.create({
      data: {
        orderId,
        senderId: req.user.id,
        recipientId,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

