const fs = require('fs');

const paths = ['prisma/schema.prisma', 'backend/prisma/schema.prisma', '../prisma/schema.prisma'];
let targetPath = paths.find(p => fs.existsSync(p));

if (!targetPath) {
  console.error("Error: Could not find schema.prisma.");
  process.exit(1);
}

let schema = fs.readFileSync(targetPath, 'utf8');

// Strip the accidental relation tag from Category
schema = schema.replace(
  /(model Category\s*\{[\s\S]*?)jobs\s+Job\[\]\s+@relation\("JobTaxonomySkills"\)/,
  '$1jobs          Job[]'
);

// Strip the accidental relation tag from Subcategory
schema = schema.replace(
  /(model Subcategory\s*\{[\s\S]*?)jobs\s+Job\[\]\s+@relation\("JobTaxonomySkills"\)/,
  '$1jobs          Job[]'
);

fs.writeFileSync(targetPath, schema);
console.log(`✅ Fixed schema relation mismatch in ${targetPath}!`);
