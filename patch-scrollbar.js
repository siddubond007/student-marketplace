const fs = require('fs');

const targetPath = 'frontend/src/pages/StudentMarketplacePage.jsx';
let code = fs.readFileSync(targetPath, 'utf8');

// Replace the container class to inject scrollbar-hiding CSS rules
const oldClass = 'className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar"';
const newClass = 'className="space-y-2 max-h-80 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"';

if (code.includes(oldClass)) {
  code = code.replace(oldClass, newClass);
  fs.writeFileSync(targetPath, code);
  console.log('✅ Ugly white scrollbar successfully removed!');
} else {
  console.error('❌ Could not find the target container. It may have already been patched.');
}
