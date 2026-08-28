const fs = require('fs');
const { execSync } = require('child_process');

console.log("📦 Installing OWASP security dependencies...");
execSync('npm install helmet express-rate-limit', { cwd: './backend', stdio: 'inherit' });

const schemaPath = './backend/prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

// Helper function to inject performance indexes safely
function addIndex(modelName, indexes) {
    const regex = new RegExp(`(model ${modelName} \\{[\\s\\S]*?)(^\\})`, 'm');
    if (regex.test(schema)) {
        let indexString = '';
        for (const idx of indexes) {
            if (!schema.includes(idx)) {
                indexString += `  ${idx}\n`;
            }
        }
        if (indexString) {
            schema = schema.replace(regex, `$1${indexString}$2`);
        }
    }
}

console.log("🛠️ Injecting foreign key indexes into Prisma Schema...");
addIndex('Gig', ['@@index([sellerId])', '@@index([categoryId])', '@@index([subcategoryId])']);
addIndex('GigPackage', ['@@index([gigId])']);
addIndex('Order', ['@@index([clientId])', '@@index([sellerId])', '@@index([status])', '@@index([gigId])', '@@index([jobId])']);
addIndex('Deliverable', ['@@index([orderId])']);
addIndex('PayoutRequest', ['@@index([userId])', '@@index([status])']);
addIndex('Message', ['@@index([orderId])', '@@index([senderId])', '@@index([recipientId])']);
addIndex('Review', ['@@index([orderId])', '@@index([reviewerId])', '@@index([revieweeId])']);

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log("✅ Schema updated with performance indexes!");

console.log("🔄 Formatting schema and generating Prisma client...");
execSync('npx prisma format', { cwd: './backend', stdio: 'inherit' });
execSync('npx prisma generate', { cwd: './backend', stdio: 'inherit' });

console.log("✅ Phase 1 & 2 Patches Applied Successfully.");
