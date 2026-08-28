import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Wallet, User, Users, CheckCircle2, Calendar, LayoutTemplate, Paperclip, ExternalLink, Globe } from 'lucide-react';
import API from '../services/api';

export default function PublicJobDetailsPage() {
  const { jobId } = useParams();
  const location = useLocation();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const bidFormRef = useRef(null);

  useEffect(() => {
    API.get(`/jobs/public/${jobId}`)
      .then((res) => setJob(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  // Auto-scroll if the user arrives from the marketplace with the #bid-form hash
  useEffect(() => {
    if (job && location.hash === '#bid-form' && bidFormRef.current) {
      setTimeout(() => {
        bidFormRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [job, location.hash]);

  const scrollToBidForm = (e) => {
    e.preventDefault();
    bidFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (proposalText.length < 100) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await API.post(`/jobs/${jobId}/bid`, {
        proposedAmount: Number(bidAmount),
        deliveryDays: Number(deliveryDays),
        coverLetter: proposalText + (portfolioLink ? `\n\nPortfolio: ${portfolioLink}` : '')
      });

      alert(response.data?.message || 'Bid submitted successfully!');
      
      // Clear form on success
      setProposalText('');
      setBidAmount('');
      setDeliveryDays('');
      setPortfolioLink('');
      
      // Refresh the job data so the proposal count updates
      const refreshedJob = await API.get(`/jobs/public/${jobId}`);
      setJob(refreshedJob.data);
      
    } catch (error) {
      console.error('Bid Error:', error);
      alert(error.response?.data?.error || 'Failed to submit bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <div className="text-slate-400 font-medium tracking-wide">Loading enterprise details...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-gray-200">Project not found</h2>
          <Link to="/jobs" className="mt-4 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-gray-200">
      
      {/* Back Navigation */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Primary Narrative Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Glass Panel */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase">
                {job.category || 'General'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs tracking-wide uppercase">
                {job.experienceLevel || 'INTERMEDIATE'}
              </span>
              {job.timeline && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs">
                  <Calendar size={12} /> {job.timeline}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              {job.title}
            </h1>
          </div>

          {/* Overview Panel */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LayoutTemplate className="text-emerald-400" size={20} /> Overview
            </h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
              {job.description || 'No description provided'}
            </div>
          </div>

          {/* Deliverables & Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-4">Deliverables</h2>
              {Array.isArray(job.deliverables) && job.deliverables.length > 0 ? (
                <ul className="space-y-3">
                  {job.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle2 size={16} className="mt-0.5 text-emerald-400 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-slate-500 italic text-sm">No deliverables specified</div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-4">Requirements</h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                {job.requirements || 'No requirements provided'}
              </div>
            </div>
          </div>

          {/* Attachments & References */}
          {(job.attachmentUrls?.length > 0 || job.externalLinks?.length > 0 || job.referenceLinks?.length > 0) && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl mt-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Paperclip className="text-emerald-400" size={20} /> Attachments & References
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.attachmentUrls?.map((url, i) => {
                  const fileName = url.split('/').pop().split('?')[0] || `Attachment ${i + 1}`;
                  return (
                    <a key={`att-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all group">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Paperclip size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-200 truncate">{decodeURIComponent(fileName)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Click to view/download</div>
                      </div>
                    </a>
                  );
                })}
                
                {job.externalLinks?.map((url, i) => (
                  <a key={`ext-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all group">
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                      <ExternalLink size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-200 truncate">{url}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Cloud Drive Link</div>
                    </div>
                  </a>
                ))}

                {job.referenceLinks?.map((url, i) => (
                  <a key={`ref-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-purple-500/30 rounded-2xl transition-all group">
                    <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                      <Globe size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-200 truncate">{url}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Reference Website</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Place a Bid Form Section */}
          <div id="bid-form" ref={bidFormRef} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl mt-8 scroll-mt-24">
            <h2 className="text-xl font-bold text-white mb-2">Place a bid on this project</h2>
            <p className="text-sm text-gray-400 mb-6">You will be able to edit your bid until the project is awarded to someone.</p>

            <form onSubmit={handleBidSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bid Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Bid Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                      type="number"
                      required
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">This project will be delivered in</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-4 pr-16 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                      placeholder="7"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Days</span>
                  </div>
                </div>
              </div>

              {/* Proposal Description */}
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Describe your proposal</label>
                  <span className={`text-xs ${proposalText.length < 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {proposalText.length}/2000 (Min 100)
                  </span>
                </div>
                <textarea
                  required
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  maxLength={2000}
                  rows={6}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600 resize-y"
                  placeholder="Enter and describe why you will be best suitable for this job and your experiences..."
                />
              </div>

              {/* Portfolio Link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Portfolio / Previous Works Link</label>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                  placeholder="https://your-portfolio.com or Google Drive link"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || proposalText.length < 100}
                  className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  {isSubmitting ? 'Submitting...' : 'Place Bid'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right: Sticky Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            
            {/* Meta Data Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <div className="space-y-6">
                
                {/* Budget */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shrink-0">
                    <Wallet className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Budget</div>
                    <div className="text-2xl font-black text-white">₹{job.budget}</div>
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Client & Proposals */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                      <User size={12} /> Client
                    </div>
                    <div className="text-sm font-medium text-gray-200">
                      {job.client?.fullName || 'Client'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                      <Users size={12} /> Proposals
                    </div>
                    <div className="text-sm font-medium text-amber-400">
                      {job.bids?.length || 0} Submitted
                    </div>
                  </div>
                </div>

                {/* Apply CTA */}
                <div className="pt-4 space-y-3">
                  <a
                    href="#bid-form"
                    onClick={scrollToBidForm}
                    className="flex items-center justify-center w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-900 text-sm font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  >
                    Bid on this project
                  </a>
                </div>
              </div>
            </div>

            {/* Skills Taxonomy Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Required Skills</h3>
              {Array.isArray(job.skills) && job.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-gray-300 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic text-sm">No skills specified</div>
              )}
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
