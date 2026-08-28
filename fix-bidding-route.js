const fs = require('fs');
const file = 'frontend/src/pages/PublicJobDetailsPage.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the plural /bids with singular /bid
code = code.replace(
  /await API\.post\(\`\/jobs\/\$\{jobId\}\/bids\`/,
  "await API.post(`/jobs/${jobId}/bid`"
);

fs.writeFileSync(file, code);
console.log("✅ Frontend route corrected to /jobs/:jobId/bid");
