const fs = require('fs');

// 1. Patch Auth Middleware (Progressive Strike Enforcement)
const middlewareFile = 'backend/src/middlewares/authMiddleware.js';
let mwCode = fs.readFileSync(middlewareFile, 'utf8');

if (!mwCode.includes('suspendedUntil: true')) {
  // Add suspendedUntil to the Prisma select
  mwCode = mwCode.replace(
    "isSuspended: true",
    "isSuspended: true,\n        suspendedUntil: true"
  );
}

if (!mwCode.includes('user.suspendedUntil) > new Date()')) {
  // Add the temporal ban check
  mwCode = mwCode.replace(
    "if (user.isSuspended) return res.status(403).json({ error: 'Your account has been suspended.' });",
    "if (user.isSuspended) return res.status(403).json({ error: 'Your account has been permanently suspended.' });\n    if (user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {\n      return res.status(403).json({ error: `Account suspended due to platform violations until ${new Date(user.suspendedUntil).toLocaleString()}` });\n    }"
  );
  fs.writeFileSync(middlewareFile, mwCode);
  console.log("✅ Auth Middleware securely patched for Progressive Strikes.");
}

// 2. Patch Auth Controller (Section 11 Legal Capacity Barrier)
const controllerFile = 'backend/src/controllers/authController.js';
let ctrlCode = fs.readFileSync(controllerFile, 'utf8');

if (!ctrlCode.includes('Legal Capacity Error')) {
  ctrlCode = ctrlCode.replace(
    "const isMinor = parsedAge < 18;",
    `const isMinor = parsedAge < 18;\n\n    // Indian Contract Act Sec 11 Safeguard\n    const requestedRole = isOwnerAdmin ? 'ADMIN' : (role || 'STUDENT_FREELANCER');\n    if (isMinor && requestedRole === 'CLIENT') {\n      return res.status(403).json({ error: 'Legal Capacity Error: Users under 18 cannot legally enter into employment contracts or act as a Client.' });\n    }`
  );
  fs.writeFileSync(controllerFile, ctrlCode);
  console.log("✅ Auth Controller securely patched for Minor Contract Capacity.");
}

