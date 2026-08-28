const fs = require('fs');

const orderPath = './backend/src/controllers/orderController.js';
let orderCtrl = fs.readFileSync(orderPath, 'utf8');

const newApproveOrder = `exports.approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const result = await prisma.$transaction(async (tx) => {
      // 1. Acquire pessimistic lock on the exact row
      const lockedOrders = await tx.$queryRaw\`SELECT * FROM "Order" WHERE id = \${orderId} FOR UPDATE\`;
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
          message: \`Your order has been approved and ₹\${order.sellerEarnings} has been added to your wallet.\`,
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
};`;

orderCtrl = orderCtrl.replace(/exports\.approveOrder = async \(req, res\) => \{[\s\S]*?\n\};/, newApproveOrder);
fs.writeFileSync(orderPath, orderCtrl, 'utf8');
console.log("✅ orderController.js patched with pessimistic locking.");

const payoutPath = './backend/src/controllers/payoutController.js';
let payoutCtrl = fs.readFileSync(payoutPath, 'utf8');

const newCreatePayout = `exports.createPayoutRequest = async (req, res) => {
  try {
    const { amount, upiId } = req.body;
    const withdrawAmount = Number(amount);

    if (withdrawAmount < 100) return res.status(400).json({ error: 'Minimum withdrawal is ₹100.' });

    const payout = await prisma.$transaction(async (tx) => {
      // 1. Acquire pessimistic lock on the user's wallet
      const lockedWallets = await tx.$queryRaw\`SELECT * FROM "Wallet" WHERE "userId" = \${req.user.id} FOR UPDATE\`;
      if (!lockedWallets || lockedWallets.length === 0) throw new Error("Wallet not found.");
      
      const wallet = lockedWallets[0];

      // 2. Validate balance strictly under lock
      if (wallet.availableBalance < withdrawAmount) {
        throw new Error("BAD_REQUEST: Insufficient wallet balance.");
      }

      // 3. Process withdrawal safely
      await tx.wallet.update({
        where: { userId: req.user.id },
        data: {
          availableBalance: { decrement: withdrawAmount },
          pendingBalance: { increment: withdrawAmount }
        }
      });

      return tx.payoutRequest.create({
        data: {
          userId: req.user.id,
          amount: withdrawAmount,
          method: 'UPI',
          destination: upiId
        }
      });
    }, { maxWait: 2000, timeout: 5000 });

    res.status(201).json({ message: 'Withdrawal request submitted successfully.', payout });
  } catch (err) {
    if (err.message.includes('BAD_REQUEST')) return res.status(400).json({ error: err.message.replace('BAD_REQUEST: ', '') });
    res.status(500).json({ error: err.message });
  }
};`;

payoutCtrl = payoutCtrl.replace(/exports\.createPayoutRequest = async \(req, res\) => \{[\s\S]*?\n\};/, newCreatePayout);
fs.writeFileSync(payoutPath, payoutCtrl, 'utf8');
console.log("✅ payoutController.js patched with pessimistic locking.");
