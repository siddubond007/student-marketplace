const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_for_dev',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

async function processMatureOrders() {
  console.log('🔍 [Auto-Approve Worker] Polling for mature DELIVERED orders...');
  try {
    const candidates = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        autoApproveAt: {
          lte: new Date()
        }
      },
      select: {
        id: true
      },
      take: 50
    });

    if (!candidates.length) {
      return;
    }

    console.log(`⚙️ [Auto-Approve Worker] Processing up to ${candidates.length} mature orders...`);

    for (const candidate of candidates) {
      try {
        await prisma.$transaction(async (tx) => {
          const lockedOrders = await tx.$queryRaw`
            SELECT id, "sellerId", "sellerEarnings", "autoApproveAt"
            FROM "Order"
            WHERE id = ${candidate.id}
              AND status = 'DELIVERED'
              AND "autoApproveAt" IS NOT NULL
              AND "autoApproveAt" <= NOW()
            FOR UPDATE
          `;

          if (!lockedOrders || lockedOrders.length === 0) {
            return;
          }

          const order = lockedOrders[0];

          const transferRecord = await tx.transfer.findUnique({
            where: { orderId: order.id }
          });

          if (
            transferRecord &&
            transferRecord.razorpayTransferId &&
            transferRecord.onHold
          ) {
            await razorpay.transfers.patch(
              transferRecord.razorpayTransferId,
              { on_hold: false }
            );

            await tx.transfer.update({
              where: { id: transferRecord.id },
              data: {
                onHold: false,
                status: 'RELEASED'
              }
            });
          }

          const latestDeliverable = await tx.deliverable.findFirst({
            where: { orderId: order.id },
            orderBy: { version: 'desc' },
            select: {
              id: true,
              version: true
            }
          });

          if (latestDeliverable) {
            await tx.deliverable.update({
              where: { id: latestDeliverable.id },
              data: {
                reviewStatus: 'APPROVED',
                reviewedAt: new Date(),
                reviewedById: null
              }
            });
          }

          await tx.order.update({
            where: { id: order.id },
            data: {
              status: 'COMPLETED',
              autoApproveAt: null
            }
          });

          await tx.wallet.upsert({
            where: { userId: order.sellerId },
            create: {
              userId: order.sellerId,
              availableBalance: order.sellerEarnings
            },
            update: {
              availableBalance: {
                increment: order.sellerEarnings
              }
            }
          });

          await tx.user.update({
            where: { id: order.sellerId },
            data: {
              points: {
                increment: 50
              }
            }
          });

          if (latestDeliverable) {
            await tx.orderActivityEvent.create({
              data: {
                orderId: order.id,
                actorId: null,
                type: 'DELIVERY_APPROVED',
                message: `Review period expired; delivery version ${latestDeliverable.version} was auto-approved.`,
                source: 'ESCROW_RELEASE_WORKER',
                metadata: {
                  deliverableId: latestDeliverable.id,
                  version: latestDeliverable.version,
                  automatic: true
                }
              }
            });
          }

          await tx.orderActivityEvent.create({
            data: {
              orderId: order.id,
              actorId: null,
              type: 'PAYMENT_RELEASED',
              message: `₹${order.sellerEarnings} released to the freelancer after the review period expired.`,
              source: 'ESCROW_RELEASE_WORKER',
              metadata: {
                amount: order.sellerEarnings,
                automatic: true,
                deliveryVersion: latestDeliverable?.version || null
              }
            }
          });

          await tx.notification.create({
            data: {
              userId: order.sellerId,
              title: "Auto-Approved",
              message: `Client review period expired. ₹${order.sellerEarnings} escrow released to your wallet.`,
              type: "ORDER_AUTO_APPROVED"
            }
          });

          console.log(`✅ [Auto-Approve Worker] Order ${order.id} automatically completed & funds released.`);
        });
      } catch (err) {
        console.error(`❌ [Auto-Approve Worker] Failed to process order ${candidate.id}:`, err);
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
