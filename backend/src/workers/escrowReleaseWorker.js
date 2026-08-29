const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_for_dev',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

async function processMatureOrders() {
  console.log('🔍 [Auto-Approve Worker] Polling for mature IN_REVIEW orders...');
  try {
    // Highly concurrent, lock-safe query grabbing 50 rows at a time
    const matureOrders = await prisma.$queryRaw`
      SELECT id, "sellerId", "sellerEarnings"
      FROM "Order"
      WHERE status = 'DELIVERED' 
        AND "autoApproveAt" <= NOW()
      FOR UPDATE SKIP LOCKED
      LIMIT 50
    `;

    if (!matureOrders || matureOrders.length === 0) {
      return;
    }

    console.log(`⚙️ [Auto-Approve Worker] Processing ${matureOrders.length} mature orders...`);

    for (const order of matureOrders) {
      try {
        // Step 1: Release Razorpay Escrow Hold (Simulated if no transfer record yet)
        const transferRecord = await prisma.transfer.findUnique({ where: { orderId: order.id } });
        if (transferRecord && transferRecord.razorpayTransferId && transferRecord.onHold) {
           await razorpay.transfers.patch(transferRecord.razorpayTransferId, { on_hold: false });
           await prisma.transfer.update({
             where: { id: transferRecord.id },
             data: { onHold: false, status: 'RELEASED' }
           });
        }
        
        // Step 2: Finalize Local State
        const latestDeliverable = await prisma.deliverable.findFirst({
          where: { orderId: order.id },
          orderBy: { version: 'desc' },
          select: { id: true }
        });

        await prisma.$transaction([
          ...(latestDeliverable ? [
            prisma.deliverable.update({
              where: { id: latestDeliverable.id },
              data: {
                reviewStatus: 'APPROVED',
                reviewedAt: new Date()
              }
            })
          ] : []),
          prisma.order.update({
            where: { id: order.id },
            data: { status: 'COMPLETED' }
          }),
          prisma.wallet.upsert({
            where: { userId: order.sellerId },
            create: { userId: order.sellerId, availableBalance: order.sellerEarnings },
            update: { availableBalance: { increment: order.sellerEarnings } }
          }),
          prisma.user.update({
             where: { id: order.sellerId },
             data: { points: { increment: 50 } }
          }),
          prisma.notification.create({
            data: {
              userId: order.sellerId,
              title: "Auto-Approved",
              message: `Client review period expired. ₹${order.sellerEarnings} escrow released to your wallet.`,
              type: "ORDER_AUTO_APPROVED"
            }
          })
        ]);
        console.log(`✅ [Auto-Approve Worker] Order ${order.id} automatically completed & funds released.`);
      } catch (err) {
        console.error(`❌ [Auto-Approve Worker] Failed to process order ${order.id}:`, err);
        // Continue to next order even if one fails
      }
    }
  } catch (error) {
    console.error('❌ [Auto-Approve Worker] Fatal Error during polling:', error);
  }
}

// Start the continuous polling loop (runs every 60 seconds)
const POLLING_INTERVAL = 60 * 1000;
console.log('🚀 [Auto-Approve Worker] Initialized. Heartbeat interval:', POLLING_INTERVAL, 'ms');
setInterval(processMatureOrders, POLLING_INTERVAL);

// Initial run
processMatureOrders();
