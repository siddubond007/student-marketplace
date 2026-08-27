const fs = require('fs');
const file = 'backend/prisma/schema.prisma';
let data = fs.readFileSync(file, 'utf8');

// Check if we already applied this fix
if (!data.includes('gigPackageId')) {
  // 1. Inject gigPackageId into the Order model
  data = data.replace(
    'gig            Gig?         @relation(fields: [gigId], references: [id])',
    'gig            Gig?         @relation(fields: [gigId], references: [id])\n  gigPackageId   String?\n  gigPackage     GigPackage?  @relation(fields: [gigPackageId], references: [id])'
  );
  
  // 2. Add the reverse relation to the GigPackage model
  data = data.replace(
    'description  String\n}',
    'description  String\n  orders       Order[]\n}'
  );

  fs.writeFileSync(file, data);
  
  // 3. Update the Master Blueprint
  const blueprintFile = 'SKILLLAUNCH_BLUEPRINT.md';
  if (fs.existsSync(blueprintFile)) {
      let bp = fs.readFileSync(blueprintFile, 'utf8');
      bp = bp.replace(
        '- [ ] **Tiered Gig Packages:**', 
        '- [x] **Tiered Gig Packages (Database Core):**'
      );
      fs.writeFileSync(blueprintFile, bp);
  }
  
  console.log('\n✅ SUCCESS: Order model upgraded to support Tiered Gig Packages!');
} else {
  console.log('\n✅ Tiered Gig relations already exist in schema.');
}
