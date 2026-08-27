const fs = require('fs');

// Locate the Prisma schema file
const paths = ['prisma/schema.prisma', 'backend/prisma/schema.prisma', '../prisma/schema.prisma'];
let targetPath = paths.find(p => fs.existsSync(p));

if (!targetPath) {
  console.error("Error: Could not find schema.prisma. Please run this command from the root or backend directory.");
  process.exit(1);
}

let schema = fs.readFileSync(targetPath, 'utf8');

// 1. Upgrade Job <-> Skill relationship to Many-to-Many
schema = schema.replace(
  /Skill\s+Skill\?\s+@relation\(fields:\s*\[skillId\],\s*references:\s*\[id\]\)\s*skillId\s+String\?/g,
  'taxonomySkills Skill[] @relation("JobTaxonomySkills")'
);

// 2. Add Performance Indexes to the Job model
if (!schema.includes('@@index([createdAt])')) {
  schema = schema.replace(
    /@@index\(\[clientId\]\)/g,
    '@@index([clientId])\n  @@index([createdAt])\n  @@index([budgetType, minimumBudget, maximumBudget])'
  );
}

// 3. Map the inverse relationship in the Skill model
schema = schema.replace(
  /jobs\s+Job\[\]/g,
  'jobs        Job[] @relation("JobTaxonomySkills")'
);

fs.writeFileSync(targetPath, schema);
console.log(`✅ Successfully patched ${targetPath} for enterprise filtering!`);
