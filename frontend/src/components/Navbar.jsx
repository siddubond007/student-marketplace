import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { 
  Sparkles, ChevronDown, Globe, ShieldCheck, ArrowRight, 
  Code, Palette, Video, Smartphone, Box, PenTool, Layout, 
  Terminal, Database, FileCode, CheckCircle2, Zap, LogOut, LayoutDashboard, Bell,
  Sun, Moon
} from 'lucide-react';

export default function Navbar({ currentUser, onLogout, themeMode = 'light', onToggleTheme }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const loadNotificationStats = async () => {
      try {
        const res = await API.get('/notifications/stats');
        setUnreadCount(res.data?.unread || 0);
      } catch (err) {
        console.error(err);
      }
    };

    loadNotificationStats();
  }, [currentUser]);

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-800/80 w-full">
      <div className="w-full px-6 sm:px-8 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo & Mega-Menus */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                SkillLaunch
              </span>
              <span className="block text-[9px] font-bold text-indigo-400 tracking-widest uppercase">
                Student Freelance Platform
              </span>
            </div>
          </Link>

          {/* Mega-Menu Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-black">
            
            {/* 1. HIRE STUDENTS */}
            <div 
              className="relative py-6 cursor-pointer"
              onMouseEnter={() => setActiveMenu('hire')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center space-x-1.5 text-slate-200 hover:text-white transition font-bold">
                <span>Hire students</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>

              {activeMenu === 'hire' && (
                <div className="absolute top-16 -left-12 w-[860px] bg-slate-900 border border-slate-700 shadow-2xl p-6 rounded-3xl grid grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="col-span-3 space-y-2.5 border-r border-slate-800 pr-4">
                    <Link to="/skills" className="p-3.5 bg-indigo-950/80 hover:bg-indigo-900/90 rounded-2xl border border-indigo-500/40 block transition">
                      <div className="text-xs font-black text-white flex items-center justify-between">
                        <span>By skill</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                      </div>
                      <p className="text-[11px] text-indigo-200 font-medium mt-1">Search talent by 1,000+ specific skills.</p>
                    </Link>

                    <Link to="/skills" className="p-3.5 bg-slate-800/70 hover:bg-slate-800 rounded-2xl border border-slate-700/60 transition block">
                      <div className="text-xs font-bold text-white">By college / campus</div>
                      <p className="text-[11px] text-slate-300 font-medium mt-0.5">Find student coders by university.</p>
                    </Link>

                    <Link to="/gigs" className="p-3.5 bg-slate-800/70 hover:bg-slate-800 rounded-2xl border border-slate-700/60 transition block">
                      <div className="text-xs font-bold text-white">By category</div>
                      <p className="text-[11px] text-slate-300 font-medium mt-0.5">Explore general service fields.</p>
                    </Link>
                  </div>

                  {/* Clean Specific Category Links */}
                  <div className="col-span-6 grid grid-cols-3 gap-3">
                    {[
                      { title: 'Graphic designers', path: '/graphic-design', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=300&q=80' },
                      { title: 'Website designers', path: '/webdeveloper', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80' },
                      { title: 'Mobile developers', path: '/mobile-apps', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=300&q=80' },
                      { title: 'Software coders', path: '/python-scripting', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80' },
                      { title: '3D Blender artists', path: '/3d-artists', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
                      { title: 'Video & Reel editors', path: '/editing', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&q=80' }
                    ].map((card, idx) => (
                      <Link to={card.path} key={idx} className="group relative h-28 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-indigo-400 transition">
                        <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                        <span className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] font-black text-white leading-tight drop-shadow">{card.title}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="col-span-3 space-y-2 text-[11px]">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block mb-2">Other Student Skills</span>
                    <Link to="/skills?skill=Python" className="block text-slate-200 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition font-medium">Python Scripting</Link>
                    <Link to="/skills?skill=Figma" className="block text-slate-200 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition font-medium">Figma UI/UX Kits</Link>
                    <Link to="/skills?skill=Video+Editing" className="block text-slate-200 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition font-medium">Video Subtitles & FX</Link>
                    <Link to="/skills?skill=React.js" className="block text-slate-200 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition font-medium">Full-Stack React Apps</Link>
                    <Link to="/skills" className="text-indigo-300 hover:text-indigo-200 font-bold block pt-2 px-2">View all skills →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. FIND WORK */}
            <div 
              className="relative py-6 cursor-pointer"
              onMouseEnter={() => setActiveMenu('work')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center space-x-1.5 text-slate-200 hover:text-white transition font-bold">
                <span>Find work</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>

              {activeMenu === 'work' && (
                <div className="absolute top-16 -left-36 w-[860px] bg-slate-900 border border-slate-700 shadow-2xl p-6 rounded-3xl grid grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="col-span-3 space-y-2.5 border-r border-slate-800 pr-4">
                    <Link to="/jobs" className="p-3.5 bg-indigo-950/80 hover:bg-indigo-900/90 rounded-2xl border border-indigo-500/40 block transition">
                      <div className="text-xs font-black text-white flex items-center justify-between">
                        <span>By skill</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                      </div>
                      <p className="text-[11px] text-indigo-200 font-medium mt-1">Browse open client tasks matching your stack.</p>
                    </Link>

                    <Link to="/jobs" className="p-3.5 bg-slate-800/70 hover:bg-slate-800 rounded-2xl border border-slate-700/60 transition block">
                      <div className="text-xs font-bold text-white">All Open Projects</div>
                      <p className="text-[11px] text-slate-300 font-medium mt-0.5">Explore active client contracts.</p>
                    </Link>
                  </div>

                  <div className="col-span-6 grid grid-cols-3 gap-3">
                    {[
                      { title: 'Website jobs', path: '/webdeveloper', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80' },
                      { title: 'Graphic tasks', path: '/graphic-design', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=300&q=80' },
                      { title: 'Python & AI', path: '/python-scripting', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80' }
                    ].map((card, idx) => (
                      <Link to={card.path} key={idx} className="group relative h-28 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-indigo-400 transition">
                        <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                        <span className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] font-black text-white leading-tight drop-shadow">{card.title}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="col-span-3 space-y-2 text-[11px]">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block mb-2">Live Briefs</span>
                    <Link to="/webdeveloper" className="block text-slate-200 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition font-medium">React & Frontend</Link>
                    <Link to="/editing" className="block text-slate-200 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition font-medium">Reels Editing</Link>
                    <Link to="/jobs" className="text-indigo-300 hover:text-indigo-200 font-bold block pt-2 px-2">View all jobs →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. SOLUTIONS */}
            <div 
              className="relative py-6 cursor-pointer"
              onMouseEnter={() => setActiveMenu('solutions')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center space-x-1.5 text-slate-200 hover:text-white transition font-bold">
                <span>Solutions</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>

              {activeMenu === 'solutions' && (
                <div className="absolute top-16 -left-72 w-[760px] bg-slate-900 border border-slate-700 shadow-2xl p-6 rounded-3xl grid grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <div className="text-xs font-black text-white">Campus Enterprise</div>
                    <p className="text-[11px] text-slate-300 font-medium">Hire vetted student teams from top engineering & design institutes.</p>
                  </div>
                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <div className="text-xs font-black text-white">5-Day Escrow Protection</div>
                    <p className="text-[11px] text-slate-300 font-medium">Funds released only after 100% client satisfaction.</p>
                  </div>
                </div>
              )}
            </div>

            {/* 4. PART-TIME PROJECTS */}
            <Link
              to="/part-time-projects"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/25 bg-indigo-950/30 text-indigo-200 hover:text-white hover:border-indigo-400/50 hover:bg-indigo-900/50 transition font-black"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Part-Time Projects</span>
            </Link>
          </nav>
        </div>

        {/* Right Auth Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              type="button"
              className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80 hover:bg-indigo-900 hover:text-white'
              }`}
              title={themeMode === 'light' ? 'Switch to Dark Mode (Cosmic Space Theme)' : 'Switch to Light Mode (Daylight Modern Theme)'}
              aria-label="Toggle Dark/Light Mode"
            >
              {themeMode === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-1 text-slate-400 text-xs font-bold">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </div>

          {currentUser ? (
            <div className="flex items-center space-x-3">
              <Link 
                to={currentUser.role === 'STUDENT_FREELANCER' ? '/student/portal' : '/client/portal'}
                className="text-right hidden sm:block cursor-pointer group"
              >
                <div className="text-sm font-black text-white group-hover:text-indigo-400 transition">{currentUser.fullName}</div>
                <div className="text-xs text-indigo-400 font-bold">
                  {currentUser.role === 'STUDENT_FREELANCER' ? 'Student Workspace' : 'Client Portal'}
                </div>
              </Link>
                <Link
                  to="/notifications"
                  className="relative p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              <button onClick={onLogout} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 rounded-xl" title="Log Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-xs font-black text-slate-300 hover:text-white">Log In</Link>
              <Link to="/post-job" className="text-xs font-black text-slate-300 hover:text-white">Sign Up</Link>
              <Link 
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 text-white text-xs font-black rounded-2xl shadow-xl shadow-pink-600/30 uppercase tracking-wider"
              >
                Post a Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
