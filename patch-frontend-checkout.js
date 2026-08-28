const fs = require('fs');
const file = 'frontend/src/pages/ClientProposalsPage.jsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add Razorpay Script Loading Hook
if (!code.includes('loadRazorpay')) {
  const loadScriptCode = `
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
`;
  code = code.replace(
    "const [loading, setLoading] = useState(true);",
    "const [loading, setLoading] = useState(true);\n" + loadScriptCode
  );
}

// 2. Rewrite hireStudent to handle Gateway Checkout
const hireStudentRegex = /const hireStudent\s*=\s*async\s*\(bidId\)\s*=>\s*\{([\s\S]*?)\n\s*\};\n/;
const hireStudentMatch = code.match(hireStudentRegex);

if (hireStudentMatch) {
  const newHireStudent = `const hireStudent = async (bidId, amount) => {
    try {
      const confirmHire = window.confirm(\`You are about to hire this freelancer for ₹\${amount}. This will redirect you to secure the funds in escrow. Proceed?\`);
      if (!confirmHire) return;

      const res = await API.post(\`/jobs/\${projectId}/accept-bid/\${bidId}\`);
      
      if (res.data?.checkoutRequired && res.data?.order?.razorpayOrderId) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          alert('Failed to load payment gateway. Please check your connection.');
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // Ensure this is in frontend/.env
          amount: Math.round(res.data.order.totalAmount * 100), // convert to paise
          currency: 'INR',
          name: 'SkillLaunch Escrow',
          description: \`Project Funding: \${job?.title || 'Deliverables'}\`,
          order_id: res.data.order.razorpayOrderId,
          handler: function (response) {
             // Webhook handles backend status, frontend just updates UI
             alert('Escrow funded successfully! The freelancer has been hired.');
             API.get(\`/jobs/\${projectId}\`).then(refreshed => setJob(refreshed.data));
          },
          prefill: {
            name: 'Client Account',
            email: 'client@skilllaunch.com'
          },
          theme: {
            color: '#4f46e5' // Indigo
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
           alert('Payment Failed: ' + response.error.description);
        });
        rzp.open();
      } else {
         // Fallback if no checkout required (e.g., zero amount or testing)
         alert(res.data?.message || 'Student hired successfully');
         const refreshed = await API.get(\`/jobs/\${projectId}\`);
         setJob(refreshed.data);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err?.response?.data?.error || 'Failed to initialize escrow funding');
    }
  };
`;
  code = code.replace(hireStudentMatch[0], newHireStudent);
}

// 3. Update the Hire button to pass the amount
if (code.includes("onClick={() => hireStudent(bid.id)}")) {
  code = code.replace(
    /onClick=\{\(\)\s*=>\s*hireStudent\(bid\.id\)\}/g,
    "onClick={() => hireStudent(bid.id, bid.proposedAmount)}"
  );
}

fs.writeFileSync(file, code);
console.log("✅ Razorpay checkout modal integrated into Client Proposals page.");
