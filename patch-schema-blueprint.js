const fs = require('fs');
const file = 'backend/prisma/schema.prisma';
let code = fs.readFileSync(file, 'utf8');

// 1. Safely add IN_REVIEW to OrderStatus
if (!code.includes('IN_REVIEW')) {
    const enumMatch = code.match(/enum OrderStatus\s*\{([\s\S]*?)\}/);
    if (enumMatch) {
        let enumBody = enumMatch[1];
        enumBody = enumBody.replace(/COMPLETED/, "IN_REVIEW\n  COMPLETED");
        code = code.replace(enumMatch[0], `enum OrderStatus {${enumBody}}`);
    }
}

// 2. Add Age Consent and Escrow fields to User
if (!code.includes('razorpayAccountId')) {
    const userMatch = code.match(/model User\s*\{([\s\S]*?)\}/);
    if (userMatch) {
        let userBody = userMatch[1];
        userBody = userBody.replace(/isDeleted\s+Boolean/, "parentConsentDeclaration Boolean @default(false)\n  razorpayAccountId String?\n  strikeLogs StrikeLog[]\n  isDeleted Boolean");
        code = code.replace(userMatch[0], `model User {${userBody}}`);
    }
}

// 3. Add Razorpay Tracking to Order
if (!code.includes('razorpayOrderId')) {
    const orderMatch = code.match(/model Order\s*\{([\s\S]*?)\}/);
    if (orderMatch) {
        let orderBody = orderMatch[1];
        orderBody = orderBody.replace(/createdAt\s+DateTime/, "razorpayOrderId String?\n  razorpayPaymentId String?\n  transfer Transfer?\n  createdAt DateTime");
        code = code.replace(orderMatch[0], `model Order {${orderBody}}`);
    }
}

// 4. Append New Tables (Transfer, WebhookLog, StrikeLog)
if (!code.includes('model WebhookLog')) {
    code += `\nmodel Transfer {\n  id                 String   @id @default(uuid())\n  orderId            String   @unique\n  order              Order    @relation(fields: [orderId], references: [id])\n  razorpayTransferId String?  @unique\n  amount             Float\n  onHold             Boolean  @default(true)\n  status             String   @default("PENDING")\n  createdAt          DateTime @default(now())\n  updatedAt          DateTime @updatedAt\n}\n\nmodel WebhookLog {\n  id          String   @id @default(uuid())\n  eventId     String   @unique\n  eventType   String\n  processedAt DateTime @default(now())\n}\n\nmodel StrikeLog {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  orderId   String?\n  reason    String\n  issuedAt  DateTime @default(now())\n}\n`;
}

fs.writeFileSync(file, code);
console.log("✅ schema.prisma successfully patched!");
