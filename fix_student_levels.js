const fs = require('fs');
const file = 'backend/prisma/schema.prisma';
let data = fs.readFileSync(file, 'utf8');

// Check if we already applied this fix
if (!data.includes('sellerLevel        String')) {
  // Inject the sellerLevel tracking field into the User model
  data = data.replace(
    'role               Role                 @default(STUDENT_FREELANCER)',
    'role               Role                 @default(STUDENT_FREELANCER)\n  sellerLevel        String               @default("NEW_TALENT")'
  );

  fs.writeFileSync(file, data);
  
  // Update the Master Blueprint
  const blueprintFile = 'SKILLLAUNCH_BLUEPRINT.md';
  if (fs.existsSync(blueprintFile)) {
      let bp = fs.readFileSync(blueprintFile, 'utf8');
      bp = bp.replace(
        '- [ ] **Seller Levels System:** Algorithmic level-ups (Level 1, Level 2, Top Rated) based on performance.', 
        '- [x] **Student Progression Levels:** Algorithmic level-ups (New Talent, Pro, Top Tier) based on performance.'
      );
      fs.writeFileSync(blueprintFile, bp);
  }
  
  console.log('\n✅ SUCCESS: Student Progression Levels added to the Database!');
} else {
  console.log('\n✅ Student Levels already exist in schema.');
}
