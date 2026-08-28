const crypto = require('crypto');
const prisma = require('../config/db');

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'fallback_secret_for_dev';
    const signature = req.headers['x-razorpay-signature'];
    const eventId = req.headers['x-razorpay-event-id'];

    if (!signature || !eventId) {
      return res.status(400).send('Missing essential headers');
    }

    // 1. Cryptographic Signature Verification using the Unadulterated Raw Buffer
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body) // req.body is a raw Buffer here, NOT a parsed JSON object
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('❌ Webhook Signature Mismatch Warning');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // 2. Strict Idempotency Check to prevent race conditions and replay attacks
    const existingLog = await prisma.webhookLog.findUnique({ where: { eventId } });
    if (existingLog) {
      console.log('🔄 Webhook Event Already Processed:', eventId);
      return res.status(200).send('Webhook already processed');
    }

    // 3. Parse Payload for Business Logic
    const payload = JSON.parse(req.body.toString());
    const eventType = payload.event;

    // 4. State Machine Transition: Capture Escrow Payment
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      if (razorpayOrderId) {
        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            status: 'FUNDED_IN_ESCROW',
            razorpayPaymentId
          }
        });
        console.log(`✅ Escrow securely funded for Razorpay Order: ${razorpayOrderId}`);
      }
    }

    // 5. Commit Immutable Log
    await prisma.webhookLog.create({
      data: { eventId, eventType }
    });

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Critical Webhook Error:', error);
    res.status(500).send('Webhook server error');
  }
};
