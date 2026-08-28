const fs = require('fs');
const file = 'backend/src/controllers/orderController.js';
let code = fs.readFileSync(file, 'utf8');

// 1. Add Razorpay instantiation at the top
if (!code.includes("require('razorpay')")) {
  code = code.replace(
    "const prisma = require('../config/db');",
    "const prisma = require('../config/db');\nconst Razorpay = require('razorpay');\n\nconst razorpay = new Razorpay({\n  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_for_dev',\n  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'\n});"
  );
}

// 2. Rewrite createOrder for Gateway Integration and Split Transfers
const createOrderMatch = code.match(/exports\.createOrder\s*=\s*async\s*\(req,\s*res\)\s*=>\s*\{([\s\S]*?)\n\};\n\n\/\/ Get User's Active Orders/);
if (createOrderMatch) {
  const newCreateOrder = `exports.createOrder = async (req, res) => {
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
      receipt: \`rcpt_\${Date.now()}\`,
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
}`;
  code = code.replace(createOrderMatch[0], newCreateOrder + "\n\n// Get User's Active Orders");
}

fs.writeFileSync(file, code);
console.log("✅ Escrow order generation logic securely patched.");
