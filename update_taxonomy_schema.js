const fs = require('fs');
const path = './backend/prisma/schema.prisma';
let schema = fs.readFileSync(path, 'utf8');

if (!schema.includes('model Category {')) {
  schema += `\n
model Category {
  id            String        @id @default(uuid())
  name          String        @unique
  slug          String        @unique
  isRestricted  Boolean       @default(false)
  subcategories Subcategory[]
  gigs          Gig[]
  jobs          Job[]
}

model Subcategory {
  id         String       @id @default(uuid())
  categoryId String
  category   Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name       String
  slug       String       @unique
  skills     Skill[]
  gigs       Gig[]
  jobs       Job[]
}

model Skill {
  id            String       @id @default(uuid())
  subcategoryId String
  subcategory   Subcategory  @relation(fields: [subcategoryId], references: [id], onDelete: Cascade)
  name          String
  slug          String       @unique
  gigs          Gig[]
  jobs          Job[]
}
`;
}

if (schema.includes('model Gig {') && !schema.includes('categoryId    String?')) {
  schema = schema.replace(
    /(model Gig \{[\s\S]*?)(\n\})/,
    `$1\n  categoryId    String?\n  categoryRef   Category?    @relation(fields: [categoryId], references: [id])\n  subcategoryId String?\n  subcategoryRef Subcategory? @relation(fields: [subcategoryId], references: [id])\n  skills        Skill[]$2`
  );
}

if (schema.includes('model Job {') && !schema.includes('categoryId    String?')) {
  schema = schema.replace(
    /(model Job \{[\s\S]*?)(\n\})/,
    `$1\n  categoryId    String?\n  categoryRef   Category?    @relation(fields: [categoryId], references: [id])\n  subcategoryId String?\n  subcategoryRef Subcategory? @relation(fields: [subcategoryId], references: [id])\n  skills        Skill[]$2`
  );
}

fs.writeFileSync(path, schema);
console.log("Database schema patched successfully.");
