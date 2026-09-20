import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, BriefcaseBusiness, CalendarDays, Clock3, ExternalLink, Search, Sparkles, Trash2, UserRound } from 'lucide-react';
import API from '../services/api';

const formatBudget = (job) => {
  const currency = job?.currency || 'INR';
  if (job?.budgetType === 'FIXED') return `${currency} ${Number(job.fixedBudget ?? job.budget ?? 0).toLocaleString('en-IN')}`;
  if (job?.minimumBudget != null && job?.maximumBudget != null) return `${currency} ${Number(job.minimumBudget).toLocaleString('en-IN')} - ${Number(job.maximumBudget).toLocaleString('en-IN')}`;
  return `${currency} ${Number(job?.budget ?? 0).toLocaleString('en-IN')}`;
};
const formatSavedDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Saved recently' : `Saved ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};
const gigPrice = (gig) => {
  const price = gig?.packages?.[0]?.price;
  return Number.isFinite(Number(price)) ? `₹${Number(price).toLocaleString('en-IN')}` : 'Custom quote';
};

export default function SavedLibraryPage({ currentUser }) {
  const navigate = useNavigate();
  const canSeeJobs = currentUser?.role === 'STUDENT_FREELANCER' || currentUser?.role === 'ADMIN';
  const canSeeGigs = currentUser?.role === 'CLIENT' || currentUser?.role === 'ADMIN';
  const [library, setLibrary] = useState({ jobs: [], gigs: [] });
  const [activeTab, setActiveTab] = useState(canSeeJobs ? 'jobs' : 'gigs');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (canSeeJobs && !canSeeGigs) setActiveTab('jobs');
    if (canSeeGigs && !canSeeJobs) setActiveTab('gigs');
  }, [canSeeJobs, canSeeGigs]);
  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    let cancelled = false;
    API.get('/saved').then(response => {
      if (!cancelled) setLibrary({ jobs: Array.isArray(response.data?.jobs) ? response.data.jobs : [], gigs: Array.isArray(response.data?.gigs) ? response.data.gigs : [] });
    }).catch(error => {
      if (!cancelled) setErrorMessage(error.response?.data?.error || 'Unable to load your Saved Library.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [currentUser, canSeeJobs, canSeeGigs]);

  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const source = activeTab === 'jobs' ? library.jobs : library.gigs;
    const filtered = source.filter(entry => {
      const item = activeTab === 'jobs' ? entry.job : entry.gig;
      if (!query) return true;
      const text = activeTab === 'jobs'
        ? [item?.title, item?.category, item?.subcategory, item?.client?.fullName, ...(Array.isArray(item?.skills) ? item.skills : [])].filter(Boolean).join(' ')
        : [item?.title, item?.category, item?.seller?.fullName, item?.seller?.profile?.tagline].filter(Boolean).join(' ');
      return text.toLowerCase().includes(query);
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        const aItem = activeTab === 'jobs' ? a.job : a.gig;
        const bItem = activeTab === 'jobs' ? b.job : b.gig;
        return String(aItem?.title || '').localeCompare(String(bItem?.title || ''));
      }
      const diff = new Date(b.savedAt) - new Date(a.savedAt);
      return sortBy === 'oldest' ? -diff : diff;
    });
  }, [activeTab, library, searchQuery, sortBy]);

  const removeJob = async (jobId) => {
    setBusyId(jobId);
    try { await API.delete(`/saved/jobs/${jobId}`); setLibrary(prev => ({ ...prev, jobs: prev.jobs.filter(entry => entry.job?.id !== jobId) })); }
    catch (error) { setErrorMessage(error.response?.data?.error || 'Unable to remove the saved project.'); }
    finally { setBusyId(null); }
  };
  const removeGig = async (gigId) => {
    setBusyId(gigId);
    try { await API.post(`/gigs/${gigId}/favorite`); setLibrary(prev => ({ ...prev, gigs: prev.gigs.filter(entry => entry.gig?.id !== gigId) })); }
    catch (error) { setErrorMessage(error.response?.data?.error || 'Unable to remove the saved service.'); }
    finally { setBusyId(null); }
  };

  if (!currentUser) return <div className="min-h-[65vh] flex items-center justify-center"><div className="max-w-xl w-full text-center bg-slate-900/80 border border-slate-800 rounded-[2rem] p-10 shadow-2xl"><div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"><Bookmark className="w-8 h-8 text-indigo-300" /></div><h1 className="mt-6 text-3xl font-black text-white">Your Saved Library</h1><p className="mt-3 text-sm text-slate-400 leading-relaxed">Keep useful projects and favorite services together so you can return to them without searching again.</p><button type="button" onClick={() => navigate('/login')} className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black transition">Log in to continue<ArrowRight className="w-4 h-4" /></button></div></div>;

  return <div className="max-w-7xl mx-auto pb-20 space-y-8">
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 p-7 sm:p-9">
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="relative z-10"><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div><div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-indigo-300"><Sparkles className="w-4 h-4" />Personal workspace</div><h1 className="mt-2 text-3xl sm:text-4xl font-black text-white">Saved Library</h1><p className="mt-3 max-w-2xl text-sm text-slate-400 leading-relaxed">Projects you want to revisit and services you have favorited, organized in one place.</p></div>
        <div className="grid grid-cols-2 gap-3 min-w-[220px]">
          {canSeeJobs && <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"><div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Saved projects</div><div className="mt-1 text-2xl font-black text-white">{library.jobs.length}</div></div>}
          {canSeeGigs && <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"><div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Favorite services</div><div className="mt-1 text-2xl font-black text-white">{library.gigs.length}</div></div>}
        </div>
      </div>
      {canSeeJobs && canSeeGigs && <div className="mt-7 flex flex-wrap gap-2"><button type="button" onClick={() => setActiveTab('jobs')} className={'px-4 py-2.5 rounded-xl text-xs font-black border transition ' + (activeTab === 'jobs' ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white')}>Projects</button><button type="button" onClick={() => setActiveTab('gigs')} className={'px-4 py-2.5 rounded-xl text-xs font-black border transition ' + (activeTab === 'gigs' ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white')}>Services</button></div>}
      </div>
    </section>
    {errorMessage && <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{errorMessage}</div>}
    <section className="flex flex-col lg:flex-row gap-3"><div className="flex-1 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4"><Search className="w-4 h-4 text-slate-500 shrink-0" /><input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder={activeTab === 'jobs' ? 'Search saved projects...' : 'Search favorite services...'} className="w-full py-3.5 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" /></div><select value={sortBy} onChange={event => setSortBy(event.target.value)} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-bold text-white outline-none"><option value="recent">Recently saved</option><option value="oldest">Oldest saved</option><option value="title">Title A-Z</option></select></section>
    {loading ? <div className="min-h-[30vh] flex items-center justify-center"><div className="w-9 h-9 border-4 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" /></div> : visibleItems.length === 0 ? <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-12 text-center"><div className="w-14 h-14 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center"><Bookmark className="w-7 h-7 text-slate-500" /></div><h2 className="mt-5 text-xl font-black text-white">{searchQuery ? 'Nothing matches your search' : 'Your library is empty'}</h2><p className="mt-2 text-sm text-slate-400">{searchQuery ? 'Try a different keyword or clear your search.' : activeTab === 'jobs' ? 'Save promising client projects while you explore the marketplace.' : 'Favorite services you may want to hire later.'}</p>{!searchQuery && <Link to={activeTab === 'jobs' ? '/jobs' : '/'} className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black transition">Browse {activeTab === 'jobs' ? 'Projects' : 'SkillLaunch'}<ArrowRight className="w-4 h-4" /></Link>}</div> : <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {visibleItems.map(entry => {
        const item = activeTab === 'jobs' ? entry.job : entry.gig;
        if (activeTab === 'jobs') return <article key={entry.id} className="group rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 hover:border-indigo-500/30 transition-all">
          <div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 mb-3"><span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-wider text-indigo-300">{item.category || 'Project'}</span><span className={'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ' + (item.status === 'OPEN' && item.isOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400')}>{item.status === 'OPEN' && item.isOpen ? 'Open' : 'Unavailable'}</span></div><h2 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors line-clamp-2">{item.title}</h2><p className="mt-2 text-sm text-slate-400 line-clamp-2">{item.description || 'No description provided.'}</p></div><button type="button" onClick={() => removeJob(item.id)} disabled={busyId === item.id} className="shrink-0 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-300 hover:border-rose-500/30 transition disabled:opacity-50" aria-label="Remove project from Saved Library"><Trash2 className="w-4 h-4" /></button></div>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5"><div className="text-[10px] uppercase tracking-widest font-black text-slate-500">Budget</div><div className="mt-1 text-sm font-black text-white">{formatBudget(item)}</div></div><div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5"><div className="text-[10px] uppercase tracking-widest font-black text-slate-500">Timeline</div><div className="mt-1 text-sm font-black text-white">{item.timeline || 'Flexible'}</div></div></div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><UserRound className="w-3.5 h-3.5" />{item.client?.fullName || 'Client'}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{formatSavedDate(entry.savedAt)}</span></div>
          <div className="mt-5"><Link to={`/jobs/${item.id}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition">Open Project <ExternalLink className="w-3.5 h-3.5" /></Link></div>
        </article>;
        return <article key={entry.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/80 hover:border-indigo-500/30 transition-all">
          <div className="h-44 bg-slate-950 overflow-hidden">{item.coverImage ? <img src={item.coverImage} alt={item.title || 'Saved service'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><BriefcaseBusiness className="w-10 h-10" /></div>}</div>
          <div className="p-6"><div className="flex items-start justify-between gap-4"><div><div className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{item.category || 'Service'}</div><h2 className="mt-2 text-xl font-black text-white line-clamp-2">{item.title}</h2></div><button type="button" onClick={() => removeGig(item.gig?.id || item.id)} disabled={busyId === (item.gig?.id || item.id)} className="shrink-0 p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-300 hover:border-rose-500/30 transition disabled:opacity-50" aria-label="Remove service from favorites"><Trash2 className="w-4 h-4" /></button></div>
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">{item.seller?.profile?.avatarUrl ? <img src={item.seller.profile.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-700" /> : <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-200"><UserRound className="w-4 h-4" /></div>}<div><div className="font-bold text-slate-200">{item.seller?.fullName || 'Student Freelancer'}</div><div>{item.seller?.profile?.college || item.seller?.profile?.tagline || 'Verified creator profile'}</div></div></div>
          <div className="mt-5 flex items-center justify-between gap-4"><div><div className="text-[10px] uppercase tracking-widest font-black text-slate-500">Starting from</div><div className="mt-1 text-lg font-black text-white">{gigPrice(item)}</div></div><div className="inline-flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="w-3.5 h-3.5" />{item.packages?.[0]?.deliveryDays ?? 'Flexible'} days</div></div>
          <div className="mt-5 flex items-center justify-between gap-3"><span className={'text-[10px] font-black uppercase tracking-widest ' + (item.status === 'PUBLISHED' && !item.isDeleted ? 'text-emerald-300' : 'text-slate-500')}>{item.status === 'PUBLISHED' && !item.isDeleted ? 'Available' : 'Unavailable'}</span><Link to={`/gigs/${item.id}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition">Open Service <ExternalLink className="w-3.5 h-3.5" /></Link></div>
          <div className="mt-3 text-xs text-slate-500">{formatSavedDate(entry.savedAt)}</div></div>
        </article>;
      })}
    </div>}
    {(library.jobs.length + library.gigs.length) > 0 && <div className="text-center text-xs text-slate-500">Your Saved Library is stored with your account so it stays available across sessions.</div>}
  </div>;
}
