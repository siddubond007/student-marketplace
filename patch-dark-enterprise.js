const fs = require('fs');

const targetPath = 'frontend/src/pages/StudentMarketplacePage.jsx';

const newComponentCode = `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, Filter, DollarSign, Clock, Briefcase, ChevronLeft, ChevronRight, X, CheckCircle2, AlertCircle, Bookmark, Star } from 'lucide-react';

export default function StudentMarketplacePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');

  // Search input isolated for typing
  const [searchInput, setSearchInput] = useState('');

  // Auto-triggering filters
  const [filters, setFilters] = useState({
    q: '',
    minBudget: '',
    maxBudget: '',
    type: [],
    skills: []
  });

  // Skills Toggle Logic
  const [showAllSkills, setShowAllSkills] = useState(false);
  const allSkills = [
    'React.js', 'Node.js', 'UI/UX Design', 'Graphic Design', 'Python', 
    'Copywriting', 'Digital Marketing', 'SEO', 'Video Editing', 'Data Analysis', 
    'Java', 'C++', 'Mobile App Dev', 'WordPress', 'Shopify', 
    'AWS', 'Docker', 'Machine Learning', 'Blockchain', 'Content Writing', 
    'Photography', 'Virtual Assistant', 'Customer Support', 'Translation'
  ];
  const displayedSkills = showAllSkills ? allSkills : allSkills.slice(0, 15);

  // Bidding Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposedAmount, setProposedAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState(null);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [filters, page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.q) query.append('q', filters.q);
      if (filters.minBudget) query.append('minBudget', filters.minBudget);
      if (filters.maxBudget) query.append('maxBudget', filters.maxBudget);
      if (filters.type.length > 0) query.append('type', filters.type.join(','));
      if (filters.skills.length > 0) query.append('skills', filters.skills.join(','));
      query.append('page', page);
      query.append('limit', 20);

      const res = await API.get(\`/jobs?\${query.toString()}\`);
      if (res.data.jobs) {
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
      } else {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    setPage(1);
    setFilters(prev => ({ ...prev, q: searchInput }));
  };

  const toggleType = (val) => {
    setPage(1);
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(val) ? prev.type.filter(t => t !== val) : [...prev.type, val]
    }));
  };

  const toggleSkill = (val) => {
    setPage(1);
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(val) ? prev.skills.filter(s => s !== val) : [...prev.skills, val]
    }));
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
      setTimeout(() => {
        setSelectedJob(null);
        setMessage(null);
        setProposedAmount('');
        setDeliveryDays('');
        setCoverLetter('');
        fetchJobs();
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.error || 'Failed to submit proposal' });
    }
  };

  // Frontend Sorting Logic
  let sortedJobs = [...jobs];
  if (sortBy === 'lowest') {
    sortedJobs.sort((a, b) => (a.budget || 0) - (b.budget || 0));
  } else if (sortBy === 'highest') {
    sortedJobs.sort((a, b) => (b.budget || 0) - (a.budget || 0));
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 pb-20">
      
      {/* Top Search Header */}
      <div className="bg-slate-900 border-b border-slate-800 pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white mb-6">Discover Projects</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for projects by title or keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <button 
              onClick={handleSearchSubmit} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Setup */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (Filters) */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-500" /> Filters
              </h2>
            </div>

            {/* Project Type */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-200">Project type</h3>
                <button onClick={() => setFilters({...filters, type: []})} className="text-emerald-500 text-xs hover:underline">Clear</button>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  <input type="checkbox" checked={filters.type.includes('HOURLY')} onChange={() => toggleType('HOURLY')} className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900" />
                  Hourly Rate
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  <input type="checkbox" checked={filters.type.includes('FIXED')} onChange={() => toggleType('FIXED')} className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900" />
                  Fixed Price
                </label>
              </div>
            </div>

            {/* Budget Range */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-200">Budget Range</h3>
                <button onClick={() => setFilters({...filters, minBudget: '', maxBudget: ''})} className="text-emerald-500 text-xs hover:underline">Clear</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                  <input 
                    type="number" 
                    value={filters.minBudget} 
                    onChange={(e) => { setPage(1); setFilters({...filters, minBudget: e.target.value}); }} 
                    className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" 
                    placeholder="Min" 
                  />
                </div>
                <span className="text-slate-600">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                  <input 
                    type="number" 
                    value={filters.maxBudget} 
                    onChange={(e) => { setPage(1); setFilters({...filters, maxBudget: e.target.value}); }} 
                    className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" 
                    placeholder="Max" 
                  />
                </div>
              </div>
            </div>

            {/* Skills Array with Top 15 Toggle */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-200">Required Skills</h3>
                <button onClick={() => setFilters({...filters, skills: []})} className="text-emerald-500 text-xs hover:underline">Clear</button>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {displayedSkills.map(skill => (
                  <label key={skill} className="flex items-center gap-3 cursor-pointer text-sm text-slate-400 hover:text-slate-200 transition-colors">
                    <input type="checkbox" checked={filters.skills.includes(skill)} onChange={() => toggleSkill(skill)} className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900" />
                    {skill}
                  </label>
                ))}
              </div>
              {!showAllSkills && allSkills.length > 15 && (
                <button 
                  onClick={() => setShowAllSkills(true)}
                  className="text-emerald-500 text-sm hover:underline mt-4 font-medium"
                >
                  View all (+{allSkills.length - 15} skills)
                </button>
              )}
              {showAllSkills && (
                <button 
                  onClick={() => setShowAllSkills(false)}
                  className="text-emerald-500 text-sm hover:underline mt-4 font-medium"
                >
                  Show less
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Content (Job Feed) */}
        <div className="md:col-span-9">
          
          {/* Top Info & Sorting Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-2xl p-4 flex flex-col sm:flex-row justify-between items-center text-sm shadow-sm">
            <div className="font-medium text-slate-300">
              Showing {jobs.length > 0 ? \`1-\${jobs.length}\` : '0'} of {pagination.total > 1000 ? '1K+' : pagination.total} results
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <span className="text-slate-400">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-3 outline-none focus:border-emerald-500 text-white"
              >
                <option value="latest">Latest Projects</option>
                <option value="lowest">Lowest Price</option>
                <option value="highest">Highest Price</option>
              </select>
            </div>
          </div>

          {/* Job List Container */}
          <div className="bg-slate-900 border-x border-b border-slate-800 rounded-b-2xl divide-y divide-slate-800/50 shadow-sm">
            {loading ? (
              <div className="p-16 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                <p className="text-lg font-medium text-slate-300">No projects found.</p>
                <p className="text-sm mt-1">Try clearing some filters or adjusting your search.</p>
              </div>
            ) : (
              sortedJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-6">
                      <Link to={\`/jobs/\${job.id}\`} className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors block leading-tight">
                        {job.title}
                      </Link>
                      <div className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                          {job.projectType === 'HOURLY' ? 'Hourly' : 'Fixed Price'}
                        </span>
                        <span>•</span>
                        <span>{job.experienceLevel || 'Intermediate'} Level</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-4 mb-3">
                        <span className="text-sm font-medium text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                          {job.bids?.length || 0} bids
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-emerald-400 block leading-none">₹{job.budget}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
                      >
                        BID NOW
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mt-4 line-clamp-2 leading-relaxed">
                    {job.description || 'No detailed description provided for this project.'}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills && job.skills.length > 0 ? (
                      job.skills.map((skill, index) => (
                        <span key={index} className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md border border-blue-400/20">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">General Work</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-800/50 text-slate-500">
                    <div className="flex items-center gap-2 text-xs">
                       <span className="text-slate-400">Client: <span className="text-slate-200 font-medium">{job.client?.fullName || 'Verified'}</span></span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span>Posted {timeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 disabled:opacity-50 hover:bg-slate-800 transition-colors font-medium flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-400 text-sm font-medium">
                Page <span className="text-white">{page}</span> of {pagination.totalPages}
              </span>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 disabled:opacity-50 hover:bg-slate-800 transition-colors font-medium flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bidding Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
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
                <h3 className="text-lg font-semibold text-white mb-1">{selectedJob.title}</h3>
                <p className="text-emerald-400 text-sm font-medium">Client Budget: ₹{selectedJob.budget} {selectedJob.projectType === 'HOURLY' ? 'per hour' : 'Fixed Price'}</p>
              </div>

              {message && (
                <div className={\`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium \${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}\`}>
                  {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Rate (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      value={proposedAmount}
                      onChange={(e) => setProposedAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. 5000"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="Days (e.g. 5)"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Cover Letter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                  placeholder="Detail your approach and why you are the best fit for this project..."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitProposal}
                disabled={!proposedAmount || !deliveryDays || !coverLetter}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
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
console.log('✅ UI overwritten! Dark mode restored, buttons fixed, skills constrained to top 15, and sorting operational.');
