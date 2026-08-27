const fs = require('fs');
const file = 'backend/src/controllers/jobController.js';
let data = fs.readFileSync(file, 'utf8');

const target = 'exports.acceptBid = async (req, res) => {';
const nextTarget = 'exports.shortlistBid = async (req, res) => {';

if (data.includes(target) && data.includes(nextTarget)) {
    const startIndex = data.indexOf(target);
    const endIndex = data.indexOf(nextTarget);

    const before = data.substring(0, startIndex);
    const after = data.substring(endIndex);

    const newAcceptBid = `exports.acceptBid = async (req, res) => {
  try {
    const { jobId, bidId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.clientId !== req.user.id) return res.status(403).json({ error: 'Only project owner can hire.' });

    const bid = await prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid || bid.jobId !== jobId) return res.status(404).json({ error: 'Bid not found' });
    if (!job.isOpen) return res.status(400).json({ error: 'This project already has a hired student.' });

    // SECURITY UPGRADE: Prevent negative money exploits
    if (bid.proposedAmount <= 0) return res.status(400).json({ error: 'Invalid bid amount.' });

    const platformFee = bid.proposedAmount * 0.10;
    const sellerEarnings = bid.proposedAmount - platformFee;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + bid.deliveryDays);

    // ARCHITECTURE UPGRADE: Execute as a single atomic transaction
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          clientId: job.clientId,
          sellerId: bid.studentId,
          jobId: job.id,
          totalAmount: bid.proposedAmount,
          platformFee,
          sellerEarnings,
          status: 'FUNDED_IN_ESCROW', // Fixed Escrow Bypass
          deadline
        }
      }),
      prisma.bid.update({
        where: { id: bid.id },
        data: { status: 'HIRED' }
      }),
      prisma.notification.create({
        data: {
          userId: bid.studentId,
          title: "You Have Been Hired",
          message: "Congratulations! The client has funded the escrow. You can now start working.",
          type: "BID_HIRED"
        }
      }),
      prisma.job.update({
        where: { id: job.id },
        data: { status: 'IN_PROGRESS', isOpen: false }
      })
    ]);

    return res.json({
      success: true,
      message: 'Student hired successfully and funds secured in escrow',
      order
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

`;
    fs.writeFileSync(file, before + newAcceptBid + after);
    console.log('\n✅ SUCCESS: acceptBid logic safely upgraded to use ACID Transactions!');
} else {
    console.log('\n❌ Error: Could not find the functions in the file.');
}
