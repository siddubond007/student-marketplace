import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, 
  Star, Award, Zap, GraduationCap, ChevronRight, TrendingUp, Users, Compass
} from 'lucide-react';

const POPULAR_SEARCHES = [
  'Full-Stack Web', 'Figma UI/UX', 'Shorts/Reels Edit', 
  'Python AI & ML', 'Content Writing', 'React & Node'
];

export default function LightHomeHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // --- Interactive Light Constellation Canvas Engine ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width * 0.5, y: height * 0.4, targetX: width * 0.5, targetY: height * 0.4, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const parentSection = canvas.parentElement;
    parentSection.addEventListener('mousemove', handleMouseMove);
    parentSection.addEventListener('mouseleave', handleMouseLeave);

    // Particle nodes
    const PARTICLE_COUNT = 65;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.2 + 1.2,
      alpha: Math.random() * 0.4 + 0.25,
      color: ['#6366f1', '#ec4899', '#38bdf8', '#8b5cf6'][Math.floor(Math.random() * 4)]
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw particle nodes & connecting constellation lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle cursor attraction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            p.x += (dx / dist) * 0.4;
            p.y += (dy / dist) * 0.4;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Constellation links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#a5b4fc';
            ctx.globalAlpha = (1 - dist / 110) * 0.22;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      parentSection.removeEventListener('mousemove', handleMouseMove);
      parentSection.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/gigs');
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/gigs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Interactive Constellation Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Search Bar */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Top Announcement Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100 shadow-sm text-xs font-semibold text-indigo-700">
              <span className="pulse-green-dot"></span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                India's #1 Student Freelancer Platform (Ages 16–26)
              </span>
              <ChevronRight className="w-3 h-3 text-indigo-400" />
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Hire ambitious <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                  student talent
                </span>{' '}
                for your next big project.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Connect directly with hungry, skilled college students for development, design, editing, and AI tasks. Save up to 70% with guaranteed 5-Day Escrow protection.
              </p>
            </div>

            {/* Interactive Smart Search Box */}
            <form onSubmit={handleSearch} className="max-w-xl">
              <div className="relative flex items-center bg-white rounded-2xl p-2 border border-slate-200/90 shadow-lg shadow-slate-200/50 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition duration-200">
                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Try 'React Developer', 'Logo Design', or 'Video Editor'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-900 text-sm sm:text-base placeholder-slate-400 focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  className="light-btn-primary px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  Popular:
                </span>
                {POPULAR_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100/90 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/60 font-medium transition cursor-pointer text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Platform Trust Highlights */}
            <div className="pt-2 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-xl">
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black text-slate-900">85K+</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Verified Students</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black text-indigo-600">4.9/5</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Client Satisfaction</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black text-emerald-600">100%</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Escrow Protected</div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Interactive Talent Cards Collage */}
          <div className="lg:col-span-5 relative">
            
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 via-pink-200/30 to-violet-200/50 rounded-3xl blur-2xl transform -rotate-1 scale-105 pointer-events-none" />

            <div className="relative space-y-4">
              
              {/* Primary Talent Card 1 */}
              <div className="light-glass-card rounded-2xl p-5 border border-slate-200 relative animate-float-slow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                      alt="Ananya Sharma" 
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">Ananya Sharma</h4>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200/60">
                          PRO
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">UI/UX Designer • BITS Pilani '25</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>5.0</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>24h Avg Delivery</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    From <span className="text-indigo-600 text-sm font-black">₹1,499</span>
                  </div>
                </div>
              </div>

              {/* Secondary Talent Card 2 */}
              <div className="light-glass-card rounded-2xl p-5 border border-slate-200 relative ml-4 sm:ml-8 animate-float-reverse">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" 
                      alt="Rohan Verma" 
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/20 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">Rohan Verma</h4>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/60">
                          TOP TIER
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Full-Stack Dev • IIT Delhi '26</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>4.9</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ID & College Verified</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    From <span className="text-indigo-600 text-sm font-black">₹2,999</span>
                  </div>
                </div>
              </div>

              {/* Mini Interactive Escrow Callout Floating Badge */}
              <div className="light-glass-card rounded-xl p-3.5 border border-slate-200/90 shadow-md flex items-center justify-between -mt-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">5-Day Escrow Protection</div>
                    <div className="text-[10px] text-slate-500">Funds released only after client satisfaction</div>
                  </div>
                </div>
                <Link 
                  to="/register" 
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition shrink-0"
                >
                  Join Free
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
