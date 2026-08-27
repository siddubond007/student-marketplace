const fs = require('fs');

const targetPath = 'frontend/src/pages/StudentMarketplacePage.jsx';

const newComponentCode = `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, Filter, DollarSign, Clock, Briefcase, ChevronLeft, ChevronRight, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StudentMarketplacePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter States
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ q: '', minBudget: '', maxBudget: '', type: '' });
  const [draftFilters, setDraftFilters] = useState({ q: '', minBudget: '', maxBudget: '', type: '' });

  // Bidding Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposedAmount, setProposedAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [activeFilters, page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (activeFilters.q) query.append('q', activeFilters.q);
      if (activeFilters.minBudget) query.append('minBudget', activeFilters.minBudget);
      if (activeFilters.maxBudget) query.append('maxBudget', activeFilters.maxBudget);
      if (activeFilters.type) query.append('type', activeFilters.type);
      query.append('page', page);
      query.append('limit', 10); // Fetch 10 per page for enterprise feel

      const res = await API.get(\`/jobs?\${query.toString()}\`);
      
      if (res.data.jobs) {
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
      } else {
        // Fallback for older API versions
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page on new search
    setActiveFilters(draftFilters);
  };

  const handleClearFilters = () => {
    const reset = { q: '', minBudget: '', maxBudget: '', type: '' };
    setDraftFilters(reset);
    setActiveFilters(reset);
    setPage(1);
  };

  const submitProposal = async () => {
    setMessage(null);
    try {
      const res = await API.post(\`/jobs/\${selectedJob.id}/bid\`, {
        proposedAmount,
        deliveryDays,
        coverLetter
      });

      setMessage({ type: 'success', text: res.data?.message || 'Proposal submitted successfully!' });
      
      // Auto-close modal after success
      setTimeout(() => {
        setSelectedJob(null);
        setMessage(null);
        setProposedAmount('');
        setDeliveryDays('');
        setCoverLetter('');
        fetchJobs(); // Refresh feed to update bid counts
      }, 2000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err?.response?.data?.error || 'Failed to submit proposal' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20">
      {/* Header Section */}
      <div className="bg-slate-900 border-b border-slate-800 pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Discover Opportunities
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Find the perfect freelance projects, submit enterprise-grade proposals, and build your verified student portfolio.
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Enterprise Sidebar Filter */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-500" /> Filters
              </h3>
              <button 
                onClick={handleClearFilters}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Keyword Search */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Search Keywords</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={draftFilters.q}
                    onChange={(e) => setDraftFilters({...draftFilters, q: e.target.value})}
                    placeholder="e.g. React Developer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Type</label>
                <select
                  value={draftFilters.type}
                  onChange={(e) => setDraftFilters({...draftFilters, type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none appearance-none"
                >
                  <option value="">All Types</option>
                  <option value="FIXED">Fixed Price</option>
                  <option value="HOURLY">Hourly Rate</option>
                  <option value="ONE_TIME">One Time</option>
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Budget Range (₹)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={draftFilters.minBudget}
                    onChange={(e) => setDraftFilters({...draftFilters, minBudget: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-emerald-500 outline-none"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={draftFilters.maxBudget}
                    onChange={(e) => setDraftFilters({...draftFilters, maxBudget: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleApplyFilters}
                className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Job Feed */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {pagination.total > 0 ? \`\${pagination.total} Jobs Found\` : 'Latest Jobs'}
            </h2>
            <div className="text-sm text-slate-400">
              Page {pagination.page} of {pagination.totalPages}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No jobs matched your criteria</h3>
              <p className="text-slate-400">Try adjusting your filters or search keywords.</p>
              <button 
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2 border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/10">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    
                    {/* Job Info block */}
                    <div className="flex-1">
                      <Link to={\`/jobs/\${job.id}\`} className="block">
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {job.description}
                      </p>
                      
                      {/* Meta Tags */}
                      <div className="flex flex-wrap gap-4 text-sm font-medium">
                        <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                          <DollarSign className="w-4 h-4" />
                          ₹{job.budget} {job.projectType === 'HOURLY' ? '/ hr' : 'Fixed'}
                        </span>
                        <span className="flex items-center gap-1.5 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                          <Briefcase className="w-4 h-4" />
                          {job.experienceLevel || 'Intermediate'}
                        </span>
                        <span className="flex items-center gap-1.5 text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4" />
                          {job.timeline || '1 Month'}
                        </span>
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="w-full md:w-auto flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right w-full">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Client</div>
                        <div className="font-medium text-white truncate max-w-[150px]">{job.client?.fullName || 'Verified Client'}</div>
                        <div className="text-xs text-slate-400 mt-1">{job.bids?.length || 0} Proposals</div>
                      </div>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="w-full md:w-auto mt-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md"
                      >
                        Bid Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Prev
              </button>
              <span className="text-slate-400 font-medium">
                Page <span className="text-white">{page}</span> of {pagination.totalPages}
              </span>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enterprise Bidding Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden transform transition-all">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                Submit Proposal
              </h2>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-1">Bidding on project:</p>
                <p className="text-lg font-semibold text-white">{selectedJob.title}</p>
                <p className="text-sm text-emerald-400 mt-1">Client Budget: ₹{selectedJob.budget}</p>
              </div>

              {message && (
                <div className={\`mb-6 p-4 rounded-xl flex items-start gap-3 \${message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}\`}>
                  {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Rate (₹)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        value={proposedAmount}
                        onChange={(e) => setProposedAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Delivery Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                        placeholder="Days (e.g. 5)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cover Letter</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why are you the best fit for this project? Detail your approach..."
                    rows="4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-emerald-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitProposal}
                disabled={!proposedAmount || !deliveryDays || !coverLetter}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(targetPath, newComponentCode);
console.log('✅ Successfully upgraded StudentMarketplacePage.jsx with enterprise layout and pagination!');
