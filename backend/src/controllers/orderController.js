const prisma = require('../config/db');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_for_dev',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Create Order & Fund Escrow
exports.createOrder = async (req, res) => {
  try {
    const { sellerId, gigId, jobId, totalAmount, deliveryDays, requirements } = req.body;
    
    // 1. Financial Math
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    
    const platformFee = Number((amount * 0.06).toFixed(2));
    const sellerEarnings = Number((amount * 0.94).toFixed(2));
    const days = parseInt(deliveryDays, 10) || 3;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    // 2. Fetch Freelancer to get their Razorpay Linked Account ID
    const seller = await prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller) return res.status(404).json({ error: 'Freelancer not found' });
    
    // Fallback account logic for development. In production, fail if not linked.
    const linkedAccountId = seller.razorpayAccountId || process.env.DEV_LINKED_ACCOUNT_ID;

    // 3. Construct Compliant Escrow Transfers Array (on_hold: true)
    let transfers = [];
    if (linkedAccountId) {
      transfers.push({
        account: linkedAccountId,
        amount: Math.round(sellerEarnings * 100), // Razorpay expects paise
        currency: "INR",
        notes: { purpose: "Escrow for Project Delivery" },
        on_hold: true // RBI Mandate: Funds sit in nodal account until explicit release
      });
    }

    // 4. Create Gateway Order
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      transfers: transfers.length > 0 ? transfers : undefined
    });

    // 5. Create Local Database State (Status: PENDING_PAYMENT)
    const order = await prisma.order.create({
      data: {
        clientId: req.user.id,
        sellerId,
        gigId: gigId || null,
        jobId: jobId || null,
        totalAmount: amount,
        platformFee,
        sellerEarnings,
        status: 'PENDING_PAYMENT',
        razorpayOrderId: rpOrder.id,
        deadline,
        requirements: requirements || 'Standard project deliverables.'
      }
    });

    res.status(201).json({ 
      message: 'Gateway order generated successfully.', 
      order,
      razorpayOrderId: rpOrder.id
    });
  } catch (err) {
    console.error('Escrow Gateway Error:', err);
    res.status(500).json({ error: 'Escrow gateway failure: ' + err.message });
  }
}

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
        deliverables: true,
        reviews: {
          select: {
            id: true,
            reviewerId: true,
            revieweeId: true,
            overallRating: true
          }
        }
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

    const order = await prisma.order.findFirst({
      where: { id: orderId, sellerId: req.user.id }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found or unauthorized'
      });
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
    
    const result = await prisma.$transaction(async (tx) => {
      // 1. Acquire pessimistic lock on the exact row
      const lockedOrders = await tx.$queryRaw`SELECT * FROM "Order" WHERE id = ${orderId} FOR UPDATE`;
      if (!lockedOrders || lockedOrders.length === 0) throw new Error("Order not found");
      
      const order = lockedOrders[0];

      if (order.clientId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new Error("FORBIDDEN: Only the client can approve this order.");
      }
      if (order.status === 'COMPLETED') {
        throw new Error("BAD_REQUEST: Order is already completed.");
      }

      // 2. Perform safe, locked state transitions
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' }
      });

      const updatedWallet = await tx.wallet.upsert({
        where: { userId: order.sellerId },
        create: { userId: order.sellerId, availableBalance: order.sellerEarnings },
        update: { availableBalance: { increment: order.sellerEarnings } }
      });

      await tx.user.update({
        where: { id: order.sellerId },
        data: { points: { increment: 50 } }
      });

      await tx.notification.create({
        data: {
          userId: order.sellerId,
          title: "Order Approved",
          message: `Your order has been approved and ₹${order.sellerEarnings} has been added to your wallet.`,
          type: "ORDER_APPROVED"
        }
      });

      return { updatedOrder, updatedWallet, sellerEarnings: order.sellerEarnings };
    }, { maxWait: 2000, timeout: 5000 });

    res.json({ 
      message: 'Order approved! ₹' + result.sellerEarnings + ' released to student wallet.', 
      order: result.updatedOrder, 
      wallet: result.updatedWallet 
    });
  } catch (err) {
    if (err.message.includes('FORBIDDEN')) return res.status(403).json({ error: err.message.replace('FORBIDDEN: ', '') });
    if (err.message.includes('BAD_REQUEST')) return res.status(400).json({ error: err.message.replace('BAD_REQUEST: ', '') });
    res.status(500).json({ error: err.message });
  }
};

// Get Order Messages
exports.getMessages = async (req, res) => {
  try {
    const { orderId } = req.params;

    const authBoundary = req.user?.role === 'admin' 
    ? { id: orderId } 
    : { id: orderId, OR: [{ clientId: req.user.id }, { sellerId: req.user.id }] };

  const order = await prisma.order.findFirst({
    where: authBoundary
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

    const authBoundary = req.user?.role === 'admin' 
    ? { id: orderId } 
    : { id: orderId, OR: [{ clientId: req.user.id }, { sellerId: req.user.id }] };

  const order = await prisma.order.findFirst({
    where: authBoundary
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

