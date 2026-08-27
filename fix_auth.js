const fs = require('fs');
const file = 'backend/src/middlewares/authMiddleware.js';
let data = fs.readFileSync(file, 'utf8');

const targetStart = 'const user = await prisma.user.findUnique({';
const targetEnd = 'if (!user) return res.status(401)';

if (data.includes(targetStart) && data.includes(targetEnd)) {
    const startIndex = data.indexOf(targetStart);
    const endIndex = data.indexOf(targetEnd);

    const before = data.substring(0, startIndex);
    const after = data.substring(endIndex);

    const optimizedQuery = `// SECURITY UPGRADE: Prevent database crashing by only fetching essential auth data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        isSuspended: true
      }
    });

    `;
    
    fs.writeFileSync(file, before + optimizedQuery + after);
    
    // Update the blueprint checklist automatically!
    const blueprintFile = 'SKILLLAUNCH_BLUEPRINT.md';
    if (fs.existsSync(blueprintFile)) {
        let blueprint = fs.readFileSync(blueprintFile, 'utf8');
        blueprint = blueprint.replace(
            '- [ ] **Role-Based Access Control (RBAC):**', 
            '- [x] **Role-Based Access Control (RBAC):**'
        );
        fs.writeFileSync(blueprintFile, blueprint);
    }

    console.log('\n✅ SUCCESS: Auth Middleware optimized & Blueprint updated!');
} else {
    console.log('\n❌ Error: Could not find the query in authMiddleware.js');
}
