const fs = require('fs');
const file = 'backend/src/controllers/jobController.js';
let code = fs.readFileSync(file, 'utf8');

// Use regex to cleanly target and replace only the acceptBid function
const acceptBidRegex = /exports\.acceptBid\s*=\s*async\s*\(\s*req\s*,\s*res\s*\)\s*=>\s*\{[\s\S]*?(?=(?:\nexports\.\w+\s*=|\nmodule\.exports\s*=|$))/;

const newAcceptBid = `exports.acceptBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only the project owner can hire freelancers.' });
    }

    const bid = await prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid || bid.jobId !== jobId) return res.status(404).json({ error: 'Bid not found for this job' });

    if (bid.proposedAmount <= 0) return res.status(400).json({ error: 'Invalid bid amount.' });

    // 10% platform fee calculation
    const platformFee = Number((bid.proposedAmount * 0.10).toFixed(2));
    const sellerEarnings = Number((bid.proposedAmount - platformFee).toFixed(2));
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + bid.deliveryDays);

    // 1. GENERATE RAZORPAY ORDER FIRST
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(bid.proposedAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: \`bid_\${bid.id}\`
    });

    // 2. CREATE DATABASE TRANSACTION
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          clientId: job.clientId,
          sellerId: bid.studentId,
          jobId: job.id,
          totalAmount: bid.proposedAmount,
          platformFee,
          sellerEarnings,
          status: 'PENDING_PAYMENT',
          razorpayOrderId: rzpOrder.id, // Save securely
          deadline
        }
      }),
      prisma.bid.update({
        where: { id: bid.id },
        data: { status: 'SHORTLISTED' }
      })
    ]);

    // 3. RETURN REQUIRED FLAGS TO FRONTEND
    return res.json({
      message: 'Freelancer selected! Please complete Razorpay checkout to fund escrow and lock hiring.',
      checkoutRequired: true,
      order: {
        id: order.id,
        razorpayOrderId: rzpOrder.id,
        totalAmount: bid.proposedAmount
      }
    });

  } catch (err) {
    console.error("Accept Bid Error:", err);
    return res.status(500).json({ error: 'Failed to accept bid and initiate escrow.' });
  }
};
`;

if (code.match(acceptBidRegex)) {
  code = code.replace(acceptBidRegex, newAcceptBid);
  fs.writeFileSync(file, code);
  console.log("✅ Backend jobController patched with Razorpay SDK integration!");
} else {
  console.log("❌ Could not find exports.acceptBid. Please check the file.");
}
