const fs = require('fs');
const file = 'backend/prisma/schema.prisma';
let data = fs.readFileSync(file, 'utf8');

// Check if we already applied this fix
if (!data.includes('isDeleted Boolean')) {
  // 1. Add Soft Deletes to User
  data = data.replace(/model User \{[\s\S]*?\n\}/, (match) => {
    return match.replace('\n}', '\n  isDeleted          Boolean              @default(false)\n  deletedAt          DateTime?\n}');
  });
  
  // 2. Add Soft Deletes to Job
  data = data.replace(/model Job \{[\s\S]*?\n\}/, (match) => {
    return match.replace('\n}', '\n  isDeleted          Boolean              @default(false)\n  deletedAt          DateTime?\n}');
  });
  
  // 3. Add Soft Deletes to Gig
  data = data.replace(/model Gig \{[\s\S]*?\n\}/, (match) => {
    return match.replace('\n}', '\n  isDeleted          Boolean              @default(false)\n  deletedAt          DateTime?\n}');
  });

  fs.writeFileSync(file, data);
  
  // 4. Update the Master Blueprint
  const blueprintFile = 'SKILLLAUNCH_BLUEPRINT.md';
  if (fs.existsSync(blueprintFile)) {
      let bp = fs.readFileSync(blueprintFile, 'utf8');
      bp = bp.replace(
        '- [ ] **Soft Deletes:** Prevent users from permanently deleting financial or order history.', 
        '- [x] **Soft Deletes:** Prevent users from permanently deleting financial or order history.'
      );
      // Also mark Phase 1 as complete!
      bp = bp.replace(
        '**Currently Working On:** Phase 1 - Securing the backend API to ensure the database can handle Fiverr-level mechanics.',
        '**Currently Working On:** Phase 2 - Building out the Fiverr marketplace mechanics (Seller Levels, Disputes, Custom Offers).'
      );
      fs.writeFileSync(blueprintFile, bp);
  }
  
  console.log('\n✅ SUCCESS: Soft Deletes added to Database & Phase 1 is officially complete!');
} else {
  console.log('\n✅ Soft Deletes already exist in schema.');
}
