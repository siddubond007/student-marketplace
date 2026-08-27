const fs = require('fs');
const file = 'backend/prisma/schema.prisma';
let data = fs.readFileSync(file, 'utf8');

if (!data.includes('@@index([status, isOpen])')) {
  data = data.replace(/model Job \{[\s\S]*?\n\}/, (match) => {
    return match.replace('\n}', '\n  @@index([status, isOpen])\n  @@index([category])\n  @@index([clientId])\n}');
  });
  fs.writeFileSync(file, data);
  console.log('\n✅ SUCCESS: Indexes safely added to Job model!');
} else {
  console.log('\n✅ Indexes already exist!');
}
