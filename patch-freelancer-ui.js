const fs = require('fs');

const targetPath = 'frontend/src/pages/StudentMarketplacePage.jsx';

const newComponentCode = `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, Bookmark, Star, X } from 'lucide-react';

export default function StudentMarketplacePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);

  // Search input isolated so it doesn't trigger API on every single keystroke
  const [searchInput, setSearchInput] = useState('');

  // Auto-triggering filters
  const [filters, setFilters] = useState({
    q: '',
    minBudget: '',
    maxBudget: '',
    type: [],
    skills: []
  });

  // Bidding Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposedAmount, setProposedAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState(null);

  // Helper to format "time ago"
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

  // Debounced fetch to instantly filter as user clicks checkboxes
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* Top Black Search Header */}
      <div className="bg-[#0B1014] text-white pt-8 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Browse</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for projects"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="w-full pl-12 pr-4 py-2.5 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
            <button 
              onClick={handleSearchSubmit} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded transition-colors text-sm"
            >
              Search
            </button>
          </div>
          <div className="mt-3 text-right">
            <button className="text-xs text-gray-400 hover:text-white transition-colors">Show advanced options</button>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-8">
          <button className="py-4 text-sm text-gray-500 font-medium hover:text-gray-900">Freelancers</button>
          <button className="py-4 text-sm text-gray-900 font-semibold border-b-2 border-blue-600">Projects</button>
          <button className="py-4 text-sm text-gray-500 font-medium hover:text-gray-900">Contests</button>
        </div>
      </div>

      {/* Main Grid Setup */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (Filters) */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-gray-900">Filters</h2>
            </div>

            {/* Project Type */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Project type</h3>
                <button onClick={() => setFilters({...filters, type: []})} className="text-blue-600 text-xs hover:underline">Clear</button>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                  <input type="checkbox" checked={filters.type.includes('HOURLY')} onChange={() => toggleType('HOURLY')} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  Hourly Rate
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                  <input type="checkbox" checked={filters.type.includes('FIXED')} onChange={() => toggleType('FIXED')} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  Fixed Price
                </label>
              </div>
            </div>

            {/* Budget Range - Fixed */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Fixed price</h3>
                <button onClick={() => setFilters({...filters, minBudget: '', maxBudget: ''})} className="text-blue-600 text-xs hover:underline">Clear</button>
              </div>
              <div className="mb-1 text-xs text-gray-500">min</div>
              <div className="relative mb-3">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">₹</span>
                <input 
                  type="number" 
                  value={filters.minBudget} 
                  onChange={(e) => { setPage(1); setFilters({...filters, minBudget: e.target.value}); }} 
                  className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 text-gray-900" 
                  placeholder="0" 
                />
              </div>
              <div className="mb-1 text-xs text-gray-500">max</div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">₹</span>
                <input 
                  type="number" 
                  value={filters.maxBudget} 
                  onChange={(e) => { setPage(1); setFilters({...filters, maxBudget: e.target.value}); }} 
                  className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 text-gray-900" 
                  placeholder="1500+" 
                />
              </div>
            </div>

            {/* Skills Array */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Skills</h3>
                <button onClick={() => setFilters({...filters, skills: []})} className="text-blue-600 text-xs hover:underline">Clear</button>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search skills" className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 text-gray-900" />
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                {['Graphic Design', 'Website Design', 'React.js', 'Node.js', 'Copywriting', 'Internet Marketing', 'Photography', 'Computer Support'].map(skill => (
                  <label key={skill} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                    <input type="checkbox" checked={filters.skills.includes(skill)} onChange={() => toggleSkill(skill)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    {skill}
                  </label>
                ))}
              </div>
              <button className="text-blue-600 text-sm hover:underline mt-3">View all (13)</button>
            </div>
            
            {/* Listing Type Mock */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Listing type</h3>
              <div className="space-y-2">
                {['Featured', 'Sealed', 'NDA', 'Urgent'].map(type => (
                  <label key={type} className="flex items-center gap-3 text-sm text-gray-400 cursor-not-allowed">
                    <input type="checkbox" disabled className="w-4 h-4 text-gray-300 border-gray-200 rounded" />
                    {type}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Content (Job Feed) */}
        <div className="md:col-span-9">
          
          {/* Top Info Bar */}
          <div className="bg-white border border-gray-200 rounded-t-lg p-4 flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="font-medium text-gray-800">
              Top results {jobs.length > 0 ? \`1-\${jobs.length}\` : '0'} of {pagination.total > 1000 ? '1K' : pagination.total} results
            </div>
            <div className="flex items-center gap-6 mt-3 sm:mt-0">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Receive alerts for this search
              </label>
              <div className="flex items-center gap-2 text-gray-700">
                <span>Sort by</span>
                <select className="border border-gray-300 rounded py-1 px-2 outline-none focus:border-blue-500 text-gray-900">
                  <option>Latest</option>
                  <option>Lowest Price</option>
                  <option>Highest Price</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job List Container */}
          <div className="bg-white border-x border-b border-gray-200 rounded-b-lg divide-y divide-gray-200">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading projects...</div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No projects found. Try clearing some filters.</div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="p-5 hover:bg-[#F9FAFB] transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-4">
                      {/* Job Title - Clickable */}
                      <Link to={\`/jobs/\${job.id}\`} className="text-[17px] font-semibold text-[#0052CC] hover:underline block leading-tight">
                        {job.title}
                      </Link>
                      
                      {/* Budget Subtitle */}
                      <div className="text-[13px] text-gray-500 mt-1">
                        Budget ₹{job.budget} {job.projectType === 'HOURLY' ? 'per hour' : 'Fixed Price'}
                      </div>
                    </div>

                    {/* Right-aligned Stats / Bidding */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-3 mb-2">
                        <span className="text-sm text-gray-600">{job.bids?.length || 0} bids</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900 block leading-none">₹{job.budget} INR</span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide">Average Bid</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-4 rounded shadow-sm"
                      >
                        BE FIRST TO BID
                      </button>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {job.description || 'No detailed description provided for this project.'}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skills && job.skills.length > 0 ? (
                      job.skills.map((skill, index) => (
                        <span key={index} className="text-[13px] text-[#0052CC] hover:underline cursor-pointer">
                          {skill}{index < job.skills.length - 1 ? ' • ' : ''}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] text-[#0052CC] hover:underline cursor-pointer">General Work</span>
                    )}
                  </div>

                  {/* Card Footer (Stars & Time) */}
                  <div className="flex justify-between items-center mt-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1,2,3,4,5].map(star => <Star key={star} className="w-[14px] h-[14px] fill-gray-200 text-gray-200" />)}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">0.0</span>
                      <div className="flex items-center gap-1 ml-3 text-xs text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"></path></svg>
                        0
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span>{timeAgo(job.createdAt)}</span>
                      <Bookmark className="w-[18px] h-[18px] hover:text-gray-600 cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium"
              >
                Previous
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clean White Bidding Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Place a Bid</h2>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 text-gray-900">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{selectedJob.title}</h3>
                <p className="text-gray-500 text-sm">Budget: ₹{selectedJob.budget} {selectedJob.projectType === 'HOURLY' ? 'per hour' : 'Fixed Price'}</p>
              </div>

              {message && (
                <div className={\`mb-6 p-4 rounded text-sm font-medium \${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}\`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bid Amount (₹)</label>
                  <input
                    type="number"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Time</label>
                  <input
                    type="number"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    placeholder="Days (e.g. 5)"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Describe your proposal</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="5"
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm resize-none"
                  placeholder="What makes you the best candidate for this project? Detail your approach..."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2.5 rounded font-semibold text-gray-600 hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submitProposal}
                disabled={!proposedAmount || !deliveryDays || !coverLetter}
                className="px-6 py-2.5 rounded font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 text-sm shadow-sm"
              >
                Submit Proposal
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
console.log('✅ UI overwritten! Check your browser for the bright, enterprise Freelancer clone layout.');
