const fs = require('fs');
const file = 'frontend/src/pages/PublicJobDetailsPage.jsx';
let code = fs.readFileSync(file, 'utf8');

const oldFunctionRegex = /const handleBidSubmit = async \(e\) => \{[\s\S]*?finally \{\s*setIsSubmitting\(false\);\s*\}\s*\};/;

const newFunction = `const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (proposalText.length < 100) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await API.post(\`/jobs/\${jobId}/bids\`, {
        proposedAmount: Number(bidAmount),
        deliveryDays: Number(deliveryDays),
        coverLetter: proposalText + (portfolioLink ? \`\\n\\nPortfolio: \${portfolioLink}\` : '')
      });

      alert(response.data?.message || 'Bid submitted successfully!');
      
      // Clear form on success
      setProposalText('');
      setBidAmount('');
      setDeliveryDays('');
      setPortfolioLink('');
      
      // Refresh the job data so the proposal count updates
      const refreshedJob = await API.get(\`/jobs/public/\${jobId}\`);
      setJob(refreshedJob.data);
      
    } catch (error) {
      console.error('Bid Error:', error);
      alert(error.response?.data?.error || 'Failed to submit bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };`;

if (code.match(oldFunctionRegex)) {
  code = code.replace(oldFunctionRegex, newFunction);
  fs.writeFileSync(file, code);
  console.log("✅ Frontend bidding form successfully wired to backend API!");
} else {
  console.log("❌ Could not find the target function to replace.");
}
