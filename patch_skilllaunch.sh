#!/bin/bash

==============================================================================

SkillLaunch Automated One-Click Repair & Hardening Installer

Targeted for project structure: ~/student-marketplace/backend

==============================================================================

echo ""
echo "    SKILLLAUNCH AUTOMATED ONE-CLICK REPAIR       "
echo ""
echo ""

1. Locate Backend Root Directory

TARGET_DIR="."
if [ -d "backend" ]; then
TARGET_DIR="backend"
fi

echo "[+] Working in directory target: $TARGET_DIR"

JOB_CTRL="$TARGET_DIR/src/controllers/jobController.js"
ORDER_CTRL="$TARGET_DIR/src/controllers/orderController.js"
SCHEMA_FILE="$TARGET_DIR/prisma/schema.prisma"

mkdir -p "$TARGET_DIR/src/controllers"
mkdir -p "$TARGET_DIR/prisma"

2. Write Hardened jobController.js directly via Node.js (Prevents Heredoc issues)

node -e '
const fs = require("fs");
const path = require("path");

const targetDir = process.argv[1];
const jobCode = `const prisma = require("../config/db");
const { Prisma } = require("@prisma/client");

// 1. CREATE OR SAVE DRAFT (POST /api/jobs)
exports.createJob = async (req, res) => {
try {
if (req.user.role !== "CLIENT" && req.user.role !== "ADMIN") {
return res.status(403).json({ error: "Access Denied: Only Client accounts can post jobs or save drafts." });
}

const {
  id, title, category, categoryId, subcategory, subcategoryId,
  projectType, description, deliverables, requirements, skills,
  experienceLevel, budget, timeline, reviewWindow, attachmentUrls,
  externalLinks, referenceLinks, visibility, locationPreferences,
  languagePreferences, screeningQuestions, currentStep, status
} = req.body;

const jobStatus = status || "OPEN";
const isOpenState = jobStatus === "OPEN";

if (id) {
  const existingJob = await prisma.job.findUnique({ where: { id } });
  if (!existingJob) {
    return res.status(404).json({ error: "Job not found to update" });
  }
  if (existingJob.clientId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You do not have permission to edit this draft." });
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      title: title !== undefined ? title : existingJob.title,
      category: category !== undefined ? category : existingJob.category,
      categoryId: categoryId !== undefined ? categoryId : existingJob.categoryId,
      subcategory: subcategory !== undefined ? subcategory : existingJob.subcategory,
      subcategoryId: subcategoryId !== undefined ? subcategoryId : existingJob.subcategoryId,
      projectType: projectType !== undefined ? projectType : existingJob.projectType,
      description: description !== undefined ? description : existingJob.description,
      deliverables: deliverables !== undefined ? deliverables : existingJob.deliverables,
      requirements: requirements !== undefined ? requirements : existingJob.requirements,
      skills: skills !== undefined ? skills : existingJob.skills,
      experienceLevel: experienceLevel !== undefined ? experienceLevel : existingJob.experienceLevel,
      budget: budget !== undefined ? parseFloat(budget) || 0 : existingJob.budget,
      timeline: timeline !== undefined ? timeline : existingJob.timeline,
      reviewWindow: reviewWindow ? parseInt(reviewWindow, 10) : existingJob.reviewWindow,
      attachmentUrls: attachmentUrls !== undefined ? attachmentUrls : existingJob.attachmentUrls,
      externalLinks: externalLinks !== undefined ? externalLinks : existingJob.externalLinks,
      referenceLinks: referenceLinks !== undefined ? referenceLinks : existingJob.referenceLinks,
      visibility: visibility !== undefined ? visibility : existingJob.visibility,
      locationPreferences: locationPreferences !== undefined ? locationPreferences : existingJob.locationPreferences,
      languagePreferences: languagePreferences !== undefined ? languagePreferences : existingJob.languagePreferences,
      screeningQuestions: screeningQuestions !== undefined ? screeningQuestions : existingJob.screeningQuestions,
      currentStep: currentStep !== undefined ? parseInt(currentStep, 10) : existingJob.currentStep,
      status: jobStatus,
      isOpen: isOpenState
    },
    include: { client: { select: { id: true, fullName: true, email: true } } }
  });

  return res.json({
    message: jobStatus === "DRAFT" ? "Draft updated successfully" : "Job published successfully",
    job: updatedJob
  });
}

const job = await prisma.job.create({
  data: {
    clientId: req.user.id,
    title: title || "Untitled Draft",
    category: category || "Web Development",
    subcategory: subcategory || "",
    projectType: projectType || "FIXED",
    description: description || "",
    deliverables: deliverables || [],
    requirements: requirements || null,
    skills: skills || [],
    experienceLevel: experienceLevel || "INTERMEDIATE",
    budget: budget ? parseFloat(budget) || 0 : 0,
    timeline: timeline || "1_MONTH",
    reviewWindow: reviewWindow ? parseInt(reviewWindow, 10) : 5,
    attachmentUrls: attachmentUrls || [],
    externalLinks: externalLinks || [],
    referenceLinks: referenceLinks || [],
    visibility: visibility || "PUBLIC",
    locationPreferences: locationPreferences || "",
    languagePreferences: languagePreferences || "",
    screeningQuestions: screeningQuestions || [],
    currentStep: currentStep ? parseInt(currentStep, 10) : 1,
    status: jobStatus,
    isOpen: isOpenState
  },
  include: { client: { select: { id: true, fullName: true, email: true } } }
});

res.status(201).json({
  message: jobStatus === "DRAFT" ? "Draft saved successfully" : "Job created successfully",
  job
});


} catch (err) {
console.error("Error in createJob:", err);
res.status(500).json({ error: err.message });
}
};

// 2. HARDENED SUBMIT BID (POST /api/jobs/:jobId/bids)
exports.submitBid = async (req, res) => {
try {
if (req.user.role !== "STUDENT_FREELANCER" && req.user.role !== "ADMIN") {
return res.status(403).json({ error: "Only registered Student Freelancers can submit proposals." });
}

const { proposedAmount, deliveryDays, coverLetter } = req.body;
const jobId = req.params.jobId;

if (!proposedAmount || parseFloat(proposedAmount) <= 0) {
  return res.status(400).json({ error: "Proposed amount must be greater than zero." });
}

const result = await prisma.$transaction(async (tx) => {
  const targetJob = await tx.job.findUnique({ where: { id: jobId } });
  if (!targetJob || targetJob.status === "DRAFT" || !targetJob.isOpen) {
    throw new Error("This job is not accepting public proposals.");
  }

  const freshUser = await tx.user.findUnique({ where: { id: req.user.id } });
  if (freshUser.freeBidsRemaining <= 0) {
    throw new Error("No free bids remaining this month.");
  }

  if (freshUser.age && freshUser.age < 18 && !freshUser.parentConsentDeclared) {
    throw new Error("Sec 11 Compliance: Minor freelancers must have guardian consent affirmed to submit bids.");
  }

  const existingBid = await tx.bid.findUnique({
    where: { jobId_studentId: { jobId, studentId: req.user.id } }
  });
  if (existingBid) {
    throw new Error("You have already submitted a proposal for this job. Only 1 bid per applicant is permitted.");
  }

  const bid = await tx.bid.create({
    data: {
      jobId,
      studentId: req.user.id,
      proposedAmount: parseFloat(proposedAmount),
      deliveryDays: parseInt(deliveryDays, 10),
      coverLetter: coverLetter || "Looking forward to working on this project!"
    }
  });

  const updatedUser = await tx.user.update({
    where: { id: req.user.id },
    data: { freeBidsRemaining: { decrement: 1 } }
  });

  return { bid, remainingBids: updatedUser.freeBidsRemaining };
}, {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable
});

return res.status(201).json({
  message: "Proposal submitted successfully",
  bid: result.bid,
  remainingBids: result.remainingBids
});


} catch (err) {
console.error("Error in submitBid:", err);
return res.status(400).json({ error: err.message });
}
};

// 3. HARDENED ACCEPT BID (POST /api/jobs/:jobId/bids/:bidId/accept)
exports.acceptBid = async (req, res) => {
try {
const { jobId, bidId } = req.params;

const job = await prisma.job.findUnique({ where: { id: jobId } });
if (!job) return res.status(404).json({ error: "Job not found" });
if (job.clientId !== req.user.id) return res.status(403).json({ error: "Only project owner can hire." });

const bid = await prisma.bid.findUnique({ where: { id: bidId } });
if (!bid || bid.jobId !== jobId) return res.status(404).json({ error: "Bid not found" });
if (!job.isOpen) return res.status(400).json({ error: "This project already has a hired student." });

if (bid.proposedAmount <= 0) return res.status(400).json({ error: "Invalid bid amount." });

const platformFee = Number((bid.proposedAmount * 0.10).toFixed(2));
const sellerEarnings = Number((bid.proposedAmount - platformFee).toFixed(2));

const deadline = new Date();
deadline.setDate(deadline.getDate() + bid.deliveryDays);

const [order] = await prisma.$transaction([
  prisma.order.create({
    data: {
      clientId: job.clientId,
      sellerId: bid.studentId,
      jobId: job.id,
      totalAmount: bid.proposedAmount,
      platformFee,
      sellerEarnings,
      status: "PENDING_PAYMENT",
      deadline
    }
  }),
  prisma.bid.update({
    where: { id: bid.id },
    data: { status: "SHORTLISTED" }
  })
]);

return res.json({
  success: true,
  message: "Student selected! Please complete payment to fund escrow and lock hiring.",
  order,
  checkoutRequired: true
});


} catch (err) {
return res.status(500).json({ error: err.message });
}
};

exports.getJobs = async (req, res) => {
try {
const { q, minBudget, maxBudget, type, skills, location, language, page = 1, limit = 20 } = req.query;
let where = { isOpen: true, status: "OPEN" };

if (q) {
  where.OR = [
    { title: { contains: q, mode: "insensitive" } },
    { description: { contains: q, mode: "insensitive" } }
  ];
}
if (minBudget || maxBudget) {
  where.budget = {};
  if (minBudget) where.budget.gte = parseFloat(minBudget);
  if (maxBudget) where.budget.lte = parseFloat(maxBudget);
}
if (type) where.projectType = { in: type.split(",").map(t => t.trim()) };
if (skills) where.skills = { hasSome: skills.split(",").map(s => s.trim()) };
if (location) where.locationPreferences = location;

const pageNumber = parseInt(page, 10);
const pageSize = parseInt(limit, 10);
const skip = (pageNumber - 1) * pageSize;

const [jobs, totalJobs] = await Promise.all([
  prisma.job.findMany({
    where,
    include: {
      client: { select: { id: true, fullName: true } },
      bids: { select: { id: true } }
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize
  }),
  prisma.job.count({ where })
]);

res.json({
  jobs,
  pagination: {
    total: totalJobs, page: pageNumber, limit: pageSize, totalPages: Math.ceil(totalJobs / pageSize)
  }
});


} catch (err) {
res.status(500).json({ error: err.message });
}
};

exports.getMyDrafts = async (req, res) => {
try {
const drafts = await prisma.job.findMany({
where: { clientId: req.user.id, status: "DRAFT" },
orderBy: { updatedAt: "desc" }
});
res.json(drafts);
} catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getMyProjects = async (req, res) => {
try {
const projects = await prisma.job.findMany({
where: { clientId: req.user.id },
include: { client: { select: { id: true, fullName: true } }, bids: { select: { id: true, studentId: true } } },
orderBy: { createdAt: "desc" }
});
res.json(projects);
} catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getJobById = async (req, res) => {
try {
const { jobId } = req.params;
const job = await prisma.job.findUnique({
where: { id: jobId },
include: { client: { select: { id: true, fullName: true } }, bids: { include: { student: { select: { id: true, fullName: true } } } } }
});
if (!job) return res.status(404).json({ error: "Job not found" });
if (job.clientId !== req.user.id && req.user.role !== "ADMIN") {
return res.status(403).json({ error: "Access Denied: You cannot view this project." });
}
res.json(job);
} catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteJob = async (req, res) => {
try {
const { jobId } = req.params;
const job = await prisma.job.findUnique({ where: { id: jobId } });
if (!job) return res.status(404).json({ error: "Job not found" });
if (job.clientId !== req.user.id && req.user.role !== "ADMIN") {
return res.status(403).json({ error: "You do not have permission to delete this job." });
}
await prisma.job.delete({ where: { id: jobId } });
res.json({ message: "Job deleted successfully" });
} catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getPublicJobById = async (req, res) => {
try {
const { jobId } = req.params;
const job = await prisma.job.findUnique({
where: { id: jobId },
include: { client: { select: { id: true, fullName: true } }, bids: { select: { id: true } } }
});
if (!job || job.status === "DRAFT" || !job.isOpen) return res.status(404).json({ error: "Job not available" });
return res.json(job);
} catch (err) { return res.status(500).json({ error: err.message }); }
};

exports.shortlistBid = async (req, res) => {
try {
const { jobId, bidId } = req.params;
const job = await prisma.job.findUnique({ where: { id: jobId } });
if (!job || job.clientId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
const updatedBid = await prisma.bid.update({ where: { id: bidId }, data: { status: "SHORTLISTED" } });
return res.json({ success: true, message: "Proposal shortlisted", bid: updatedBid });
} catch (err) { return res.status(500).json({ error: err.message }); }
};

exports.rejectBid = async (req, res) => {
try {
const { jobId, bidId } = req.params;
const job = await prisma.job.findUnique({ where: { id: jobId } });
if (!job || job.clientId !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
const updatedBid = await prisma.bid.update({ where: { id: bidId }, data: { status: "REJECTED" } });
return res.json({ success: true, message: "Proposal rejected", bid: updatedBid });
} catch (err) { return res.status(500).json({ error: err.message }); }
};`;

fs.writeFileSync(path.join(targetDir, "src/controllers/jobController.js"), jobCode);
console.log("[+] jobController.js written successfully!");
' "$TARGET_DIR"

3. Write Hardened orderController.js

node -e '
const fs = require("fs");
const path = require("path");

const targetDir = process.argv[1];
const orderCode = `const prisma = require("../config/db");
const crypto = require("crypto");

// 1. HARDENED CREATE ORDER (POST /api/orders)
exports.createOrder = async (req, res) => {
try {
const { sellerId, gigId, jobId, totalAmount, deliveryDays, requirements } = req.body;
const amount = parseFloat(totalAmount);
if (!amount || amount <= 0) {
return res.status(400).json({ error: "Invalid order amount." });
}

const platformFee = Number((amount * 0.06).toFixed(2));
const sellerEarnings = Number((amount * 0.94).toFixed(2));
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
    status: "PENDING_PAYMENT",
    deadline,
    requirements: requirements || "Standard project deliverables."
  },
  include: {
    client: { select: { id: true, fullName: true, email: true } },
    seller: { select: { id: true, fullName: true, email: true } }
  }
});

res.status(201).json({
  message: "Order created. Payment required to lock funds in escrow.",
  order,
  requiresPayment: true
});


} catch (err) {
res.status(500).json({ error: err.message });
}
};

// 2. HARDENED APPROVE ORDER (POST /api/orders/:orderId/approve)
exports.approveOrder = async (req, res) => {
try {
const { orderId } = req.params;

const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  if (order.clientId !== req.user.id && req.user.role !== "ADMIN") {
    throw new Error("Only the client can approve this order.");
  }

  if (order.status === "COMPLETED") {
    throw new Error("This order has already been completed and paid out.");
  }
  if (order.status !== "DELIVERED" && order.status !== "FUNDED_IN_ESCROW") {
    throw new Error(\`Cannot approve order in current state: \${order.status}\`);
  }

  const updatedOrder = await tx.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED" }
  });

  const updatedWallet = await tx.wallet.upsert({
    where: { userId: order.sellerId },
    create: {
      userId: order.sellerId,
      availableBalance: order.sellerEarnings
    },
    update: {
      availableBalance: { increment: order.sellerEarnings }
    }
  });

  await tx.user.update({
    where: { id: order.sellerId },
    data: { points: { increment: 50 } }
  });

  await tx.notification.create({
    data: {
      userId: order.sellerId,
      title: "Order Approved",
      message: \`Order approved! ₹\${order.sellerEarnings} credited to your wallet.\`,
      type: "ORDER_APPROVED"
    }
  });

  return { updatedOrder, updatedWallet };
});

res.json({
  message: "Order approved! ₹" + result.updatedOrder.sellerEarnings + " released to wallet.",
  order: result.updatedOrder,
  wallet: result.updatedWallet
});


} catch (err) {
res.status(400).json({ error: err.message });
}
};

// 3. HARDENED SUBMIT DELIVERABLE (POST /api/orders/:orderId/deliverable)
exports.submitDeliverable = async (req, res) => {
try {
const { orderId } = req.params;
const { fileUrls, driveLinks, message } = req.body;

const order = await prisma.order.findUnique({ where: { id: orderId } });
if (!order) return res.status(404).json({ error: "Order not found" });
if (order.sellerId !== req.user.id) {
  return res.status(403).json({ error: "Only assigned freelancer can submit deliverables." });
}
if (order.status !== "FUNDED_IN_ESCROW" && order.status !== "DELIVERED") {
  return res.status(400).json({ error: "Order is not in an active funded state." });
}

const autoApproveAt = new Date();
autoApproveAt.setDate(autoApproveAt.getDate() + 5);

const [deliverable, updatedOrder] = await prisma.$transaction([
  prisma.deliverable.create({
    data: {
      orderId,
      fileUrls: fileUrls || [],
      driveLinks: driveLinks || [],
      message: message || "Work completed and submitted for review."
    }
  }),
  prisma.order.update({
    where: { id: orderId },
    data: { status: "DELIVERED", autoApproveAt }
  }),
  prisma.notification.create({
    data: {
      userId: order.clientId,
      title: "Deliverable Submitted",
      message: "Freelancer submitted work. 5-day review timer started.",
      type: "DELIVERABLE_SUBMITTED"
    }
  })
]);

res.json({ message: "Deliverable submitted. 5-day review timer active.", deliverable, order: updatedOrder });


} catch (err) {
res.status(500).json({ error: err.message });
}
};

// 4. RAZORPAY WEBHOOK HANDLER
exports.handleRazorpayWebhook = async (req, res) => {
try {
const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
const signature = req.headers["x-razorpay-signature"];
const eventId = req.headers["x-razorpay-event-id"];

if (!signature || !secret) {
  return res.status(400).json({ error: "Missing webhook signature or secret" });
}

const expectedSignature = crypto
  .createHmac("sha256", secret)
  .update(req.body)
  .digest("hex");

if (expectedSignature !== signature) {
  return res.status(400).json({ error: "Invalid HMAC signature" });
}

const payload = JSON.parse(req.body.toString());

try {
  await prisma.webhookLog.create({
    data: { eventId, eventType: payload.event }
  });
} catch (e) {
  return res.status(200).json({ message: "Event already processed (Idempotent bypass)" });
}

if (payload.event === "payment.captured") {
  const { notes } = payload.payload.payment.entity;
  const internalOrderId = notes?.internalOrderId;

  if (internalOrderId) {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: internalOrderId },
        data: { status: "FUNDED_IN_ESCROW" }
      }),
      prisma.job.updateMany({
        where: { orders: { some: { id: internalOrderId } } },
        data: { status: "IN_PROGRESS", isOpen: false }
      })
    ]);
  }
}

res.status(200).json({ status: "ok" });


} catch (err) {
res.status(500).json({ error: err.message });
}
};

exports.getMyOrders = async (req, res) => {
try {
const orders = await prisma.order.findMany({
where: { OR: [{ clientId: req.user.id }, { sellerId: req.user.id }] },
include: { client: { select: { id: true, fullName: true } }, seller: { select: { id: true, fullName: true } }, deliverables: true },
orderBy: { createdAt: "desc" }
});
res.json(orders);
} catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getMessages = async (req, res) => {
try {
const { orderId } = req.params;
const order = await prisma.order.findUnique({ where: { id: orderId } });
if (!order) return res.status(404).json({ error: "Order not found" });
if (order.clientId !== req.user.id && order.sellerId !== req.user.id && req.user.role !== "ADMIN") {
return res.status(403).json({ error: "Access denied" });
}
const messages = await prisma.message.findMany({
where: { orderId },
include: { sender: { select: { id: true, fullName: true } } },
orderBy: { createdAt: "asc" }
});
res.json(messages);
} catch (err) { res.status(500).json({ error: err.message }); }
};

exports.sendMessage = async (req, res) => {
try {
const { orderId } = req.params;
const { content } = req.body;
if (!content?.trim()) return res.status(400).json({ error: "Message required" });

const order = await prisma.order.findUnique({ where: { id: orderId } });
if (!order) return res.status(404).json({ error: "Order not found" });

const isClient = order.clientId === req.user.id;
const isSeller = order.sellerId === req.user.id;
if (!isClient && !isSeller) return res.status(403).json({ error: "Access denied" });

const message = await prisma.message.create({
  data: { orderId, senderId: req.user.id, recipientId: isClient ? order.sellerId : order.clientId, content: content.trim() },
  include: { sender: { select: { id: true, fullName: true } } }
});
res.status(201).json(message);


} catch (err) { res.status(500).json({ error: err.message }); }
};`;

fs.writeFileSync(path.join(targetDir, "src/controllers/orderController.js"), orderCode);
console.log("[+] orderController.js written successfully!");
' "$TARGET_DIR"

4. Write Updated schema.prisma

node -e '
const fs = require("fs");
const path = require("path");

const targetDir = process.argv[1];
const schemaCode = `generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}

enum Role {
CLIENT
STUDENT_FREELANCER
ADMIN
}

enum OrderStatus {
PENDING_PAYMENT
FUNDED_IN_ESCROW
DELIVERED
COMPLETED
DISPUTED
REFUNDED
}

model User {
id                    String         @id @default(uuid())
email                 String         @unique
fullName              String
role                  Role           @default(STUDENT_FREELANCER)
age                   Int?
parentConsentDeclared Boolean        @default(false)
freeBidsRemaining     Int            @default(10)
points                Int            @default(0)
strikesCount          Int            @default(0)
razorpayAccountId     String?
createdAt             DateTime       @default(now())
updatedAt             DateTime       @updatedAt

jobs                  Job[]
bids                  Bid[]
clientOrders          Order[]        @relation("ClientOrders")
sellerOrders          Order[]        @relation("SellerOrders")
wallet                Wallet?
strikes               StrikeLog[]
notifications         Notification[]
}

model Job {
id                  String   @id @default(uuid())
clientId            String
title               String
category            String
subcategory         String?
projectType         String   @default("FIXED")
description         String
deliverables        String[]
requirements        String?
skills              String[]
experienceLevel     String   @default("INTERMEDIATE")
budget              Float    @default(0)
timeline            String   @default("1_MONTH")
reviewWindow        Int      @default(5)
attachmentUrls      String[]
externalLinks       String[]
referenceLinks      String[]
visibility          String   @default("PUBLIC")
locationPreferences String?
languagePreferences String?
screeningQuestions  String[]
currentStep         Int      @default(1)
status              String   @default("OPEN")
isOpen              Boolean  @default(true)
createdAt           DateTime @default(now())
updatedAt           DateTime @updatedAt

client              User     @relation(fields: [clientId], references: [id])
bids                Bid[]
orders              Order[]
}

model Bid {
id             String   @id @default(uuid())
jobId          String
studentId      String
proposedAmount Float
deliveryDays   Int
coverLetter    String
status         String   @default("PENDING")
createdAt      DateTime @default(now())

job            Job      @relation(fields: [jobId], references: [id])
student        User     @relation(fields: [studentId], references: [id])

@@unique([jobId, studentId])
}

model Order {
id             String        @id @default(uuid())
clientId       String
sellerId       String
gigId          String?
jobId          String?
totalAmount    Float
platformFee    Float
sellerEarnings Float
status         OrderStatus   @default(PENDING_PAYMENT)
deadline       DateTime
autoApproveAt  DateTime?
requirements   String?
createdAt      DateTime      @default(now())
updatedAt      DateTime      @updatedAt

client         User          @relation("ClientOrders", fields: [clientId], references: [id])
seller         User          @relation("SellerOrders", fields: [sellerId], references: [id])
job            Job?          @relation(fields: [jobId], references: [id])
deliverables   Deliverable[]
messages       Message[]
}

model Deliverable {
id          String   @id @default(uuid())
orderId     String
fileUrls    String[]
driveLinks  String[]
message     String
submittedAt DateTime @default(now())

order       Order    @relation(fields: [orderId], references: [id])
}

model WebhookLog {
id          String   @id @default(uuid())
eventId     String   @unique
eventType   String
processedAt DateTime @default(now())
}

model StrikeLog {
id        String   @id @default(uuid())
userId    String
reason    String
severity  Int      @default(1)
createdAt DateTime @default(now())

user      User     @relation(fields: [userId], references: [id])
}

model Notification {
id        String   @id @default(uuid())
userId    String
title     String
message   String
type      String
read      Boolean  @default(false)
createdAt DateTime @default(now())

user      User     @relation(fields: [userId], references: [id])
}

model Wallet {
id               String   @id @default(uuid())
userId           String   @unique
availableBalance Float    @default(0)
updatedAt        DateTime @updatedAt

user             User     @relation(fields: [userId], references: [id])
}

model Message {
id          String   @id @default(uuid())
orderId     String
senderId    String
recipientId String
content     String
createdAt   DateTime @default(now())

order       Order    @relation(fields: [orderId], references: [id])
};`;

fs.writeFileSync(path.join(targetDir, "prisma/schema.prisma"), schemaCode);
console.log("[+] schema.prisma written successfully!");
' "$TARGET_DIR"

5. Database Sync & Prisma Client Generation

cd "$TARGET_DIR" || exit 1
npx prisma generate
npx prisma db push --skip-generate

echo ""
echo ""
echo " 🎉 ALL CONTROLLERS & SCHEMAS SUCCESSFULLY FIXED! "
echo ""
