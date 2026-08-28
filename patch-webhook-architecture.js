const fs = require('fs');

// 1. Create Webhook Controller
const controllerCode = `const crypto = require('crypto');
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
        console.log(\`✅ Escrow securely funded for Razorpay Order: \${razorpayOrderId}\`);
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
`;
fs.writeFileSync('backend/src/controllers/webhookController.js', controllerCode);

// 2. Create Webhook Route
const routeCode = `const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/razorpay', webhookController.handleRazorpayWebhook);

module.exports = router;
`;
fs.writeFileSync('backend/src/routes/webhookRoutes.js', routeCode);

// 3. Patch server.js
let serverCode = fs.readFileSync('backend/src/server.js', 'utf8');

// Add import
if (!serverCode.includes("const webhookRoutes")) {
  serverCode = serverCode.replace(
    "const disputeRoutes = require('./routes/disputeRoutes');",
    "const disputeRoutes = require('./routes/disputeRoutes');\nconst webhookRoutes = require('./routes/webhookRoutes');"
  );
}

// Inject raw middleware specifically for webhooks BEFORE the global JSON parser
if (!serverCode.includes("/api/webhooks")) {
  serverCode = serverCode.replace(
    "app.use(express.json({ limit: '15mb' }));",
    "// 🛡️ CRITICAL: Webhooks must use raw buffer to mathematically verify Razorpay signatures\napp.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);\n\napp.use(express.json({ limit: '15mb' }));"
  );
}

fs.writeFileSync('backend/src/server.js', serverCode);
console.log("✅ Webhook architecture deployed successfully!");
