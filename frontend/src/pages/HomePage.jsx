import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Star } from 'lucide-react';
import HomeReasonsBenefits from '../components/home/HomeReasonsBenefits';

const SKILL_CATEGORIES_DIR = [
  ['Website Design', 'Mobile Apps', 'Android Apps', 'iPhone Apps', 'Software Architecture', 'Graphic Design', 'Logo Design', 'Public Relations', 'Logistics', 'Proofreading', 'Translation', 'Research'],
  ['Research Writing', 'Article Writing', 'Web Scraping', 'HTML', 'CSS', 'HTML 5', 'Javascript', 'Python', 'Wordpress', 'Web Search', 'Finance', 'C++ Programming'],
  ['Legal', 'Linux', 'Manufacturing', 'Data Entry', 'Content Writing', 'Marketing', 'Excel', 'Ghostwriting', 'Copywriting', 'Accounting', 'MySQL', 'Link Building'],
  ['Banner Design', 'Illustration', 'Link Building', 'C# Programming', 'PHP', '3D Modelling', 'Photoshop', 'Technical Writing', 'Blogging', 'Internet Marketing', 'eCommerce', 'View more →']
];

const LEGACY_MOSAIC = [
  { id: '1', title: 'Website Design', desc: 'Modern responsive web apps built by student coders.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' },
  { id: '2', title: 'Research Writing', desc: 'Detailed academic reports and technical documentation.', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80' },
  { id: '3', title: 'Interior & 3D Design', desc: 'Walk through it before you build it.', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { id: '4', title: 'Banner & Social Design', desc: 'High-converting graphics for your digital brand.', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80' },
  { id: '5', title: 'Mobile App Development', desc: 'Native iOS & Android apps from campus coders.', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80' },
  { id: '6', title: 'Video & Motion Graphics', desc: 'Viral reels and YouTube edits that drive retention.', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80' }
];

export default function HomePage({ currentUser }) {
  const [hoveredMosaic, setHoveredMosaic] = useState(null);

  return (
    <div className="space-y-24 pb-20 -mt-4">
      <section className="relative min-h-[640px] rounded-3xl overflow-hidden border border-slate-800/80 glass-panel flex flex-col justify-between p-8 sm:p-14 shadow-2xl">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-[1px]"
          />
        </div>

        <div className="relative z-20 max-w-2xl space-y-6 pt-4">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Hire the best student freelancers for any project, online.
          </h1>
          <ul className="space-y-2.5 text-sm sm:text-base text-slate-300 font-medium">
            <li className="flex items-center space-x-2.5"><span className="w-2 h-2 rounded-full bg-pink-500" /><span>India's largest student freelancer network (Ages 16–26)</span></li>
            <li className="flex items-center space-x-2.5"><span className="w-2 h-2 rounded-full bg-pink-500" /><span>Any tech, design, editing, or writing task you can think of</span></li>
            <li className="flex items-center space-x-2.5"><span className="w-2 h-2 rounded-full bg-pink-500" /><span>Save up to 70% with hungry freshers & get bids in minutes</span></li>
            <li className="flex items-center space-x-2.5"><span className="w-2 h-2 rounded-full bg-pink-500" /><span>Pay safely with 5-Day Escrow only when you're 100% satisfied</span></li>
          </ul>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-black text-sm rounded-2xl shadow-xl">Hire a Student</Link>
            <Link to="/register" className="px-8 py-4 bg-slate-900/90 border border-slate-700 text-white font-black text-sm rounded-2xl">Earn Money Freelancing</Link>
          </div>
        </div>

        <div className="relative z-20 self-end pt-8">
          <div className="inline-block p-4 glass-panel rounded-2xl border border-slate-700/60 max-w-sm text-left">
            <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs mb-1"><Star className="w-4 h-4 fill-amber-400" /><span>5.0 Star Verified Work</span></div>
            <h4 className="text-sm font-black text-white">Aarav J. <span className="text-slate-400 text-xs font-normal">@aarav_codes (IIT Madras)</span></h4>
            <p className="text-xs text-slate-300 mt-1">"This AI web app & PostgreSQL architecture cost ₹1,500 and took 3 days."</p>
          </div>
        </div>
      </section>

      <HomeReasonsBenefits />

      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">Campaign Spotlight</span>
            <h2 className="text-3xl font-black text-white mt-1">YEAR OF THE LAUNCH</h2>
            <p className="text-xs text-slate-400">The year you finally launch your startup ideas with student builders.</p>
          </div>
          <Link to="/jobs" className="px-6 py-2.5 neon-airflow-btn text-white text-xs font-black rounded-xl shadow-lg">Launch Now &gt;</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: '3D Mechanical Design', cost: '₹1,200', days: '4 days', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
            { title: 'Watch Exploded Render', cost: '₹1,500', days: '3 days', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
            { title: 'Brand Packaging & Cups', cost: '₹800', days: '2 days', img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&q=80' },
            { title: 'Mobile App Figma UI', cost: '₹1,400', days: '3 days', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80' }
          ].map((item, idx) => (
            <div key={idx} className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3"><span className="text-xs font-black text-white block">{item.title}</span><span className="text-[10px] text-emerald-400 font-bold">Delivered for {item.cost} in {item.days}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel p-8 sm:p-14 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-xs font-black text-pink-400"><span>Make it real with SkillLaunch</span></div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Build your dreams with verified student talent.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5"><h4 className="text-base font-black text-white">The best talent</h4><p className="text-xs text-slate-400 leading-relaxed">Discover reliable students by exploring verified portfolios and feedback.</p></div>
            <div className="space-y-1.5"><h4 className="text-base font-black text-white">Fast bids</h4><p className="text-xs text-slate-400 leading-relaxed">Get quick quotes from eager students within 60 seconds of posting.</p></div>
            <div className="space-y-1.5"><h4 className="text-base font-black text-white">Quality work</h4><p className="text-xs text-slate-400 leading-relaxed">Fresh, modern ideas across coding, design, video editing, and AI.</p></div>
            <div className="space-y-1.5"><h4 className="text-base font-black text-white">Be in control</h4><p className="text-xs text-slate-400 leading-relaxed">Stay updated on the go with real-time AI chat and 5-day escrow milestones.</p></div>
          </div>
          <Link to="/register" className="inline-flex items-center space-x-2 text-pink-400 font-black text-sm"><span>Make your dreams a reality. Get started now</span><ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="lg:col-span-6 flex justify-center py-6">
          <div className="relative w-72 sm:w-80 h-[460px] bg-slate-900 border-4 border-slate-800 rounded-[40px] shadow-2xl p-4 overflow-hidden">
            <div className="h-full bg-slate-950 rounded-[30px] p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-2"><span>SkillLaunch App</span><span className="text-emerald-400">Escrow: ₹999</span></div>
              <div className="space-y-3 my-auto"><div className="p-3 bg-slate-900 rounded-2xl text-xs text-slate-200 border border-slate-800"><div className="text-amber-400 text-[10px] font-bold"><Star className="w-3 h-3 inline fill-amber-400" /> 5.0 Rating • Priya P.</div><p className="mt-1 text-[11px]">"I need a reel video editor for our college fest promo!"</p></div><div className="p-3 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl text-xs text-indigo-200 ml-4"><p className="text-[11px]">"I can deliver the edited reel in 24 hours with custom audio!"</p><span className="text-[10px] text-emerald-400 font-bold block mt-1">Quote: ₹499 • Pay securely</span></div></div>
              <button type="button" className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl text-xs font-bold">Approve & Release Funds</button>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel p-8 sm:p-14 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
        <div className="lg:col-span-6 space-y-6"><div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-black text-indigo-400"><span>Tap into a nationwide student network</span></div><h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Connect with top engineering & design campuses.</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2"><div><h4 className="text-sm font-black text-white">1. Post your job</h4><p className="text-xs text-slate-400">It's free! Receive competitive student bids in minutes.</p></div><div><h4 className="text-sm font-black text-white">2. Choose talent</h4><p className="text-xs text-slate-400">Compare portfolios, GitHub projects, and college badges.</p></div><div><h4 className="text-sm font-black text-white">3. Pay safely</h4><p className="text-xs text-slate-400">5-Day Escrow holds your money safely until you approve.</p></div><div><h4 className="text-sm font-black text-white">4. Dedicated support</h4><p className="text-xs text-slate-400">AI chat moderation and fast dispute resolution.</p></div></div><Link to="/jobs" className="text-pink-400 font-black text-xs">Create the future. Get started now →</Link></div>
        <div className="lg:col-span-6 relative h-[360px] bg-slate-950/80 rounded-3xl border border-slate-800 p-4 flex items-center justify-center"><div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" /><div className="space-y-3 relative z-10 w-full max-w-sm">{[
          { name: 'Rohan V.', role: 'Figma UI/UX • B.Des', rating: '5.0 ★★★★★', college: 'NID Ahmedabad' },
          { name: 'Sneha M.', role: 'Python/AI • 3rd Year', rating: '5.0 ★★★★★', college: 'IIT Bombay' },
          { name: 'Karan D.', role: '3D Blender Artist', rating: '4.9 ★★★★★', college: 'BITS Pilani' }
        ].map(st => <div key={st.name} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex justify-between items-center shadow-lg"><div><h5 className="text-xs font-black text-white">{st.name} <span className="text-indigo-400 text-[10px]">({st.college})</span></h5><span className="text-[11px] text-slate-400">{st.role}</span></div><span className="text-xs font-black text-pink-400">{st.rating}</span></div>)}</div></div>
      </section>

      <section className="space-y-10">
        <div className="text-center space-y-4"><div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60"><span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">Student marketplace</span><span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">Project work</span><span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">Student talent</span></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEGACY_MOSAIC.map(tile => <div key={tile.id} onMouseEnter={() => setHoveredMosaic(tile.id)} onMouseLeave={() => setHoveredMosaic(null)} className="relative h-72 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group cursor-pointer"><img src={tile.img} alt={tile.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /><div className={`absolute inset-0 transition-all duration-300 ${hoveredMosaic === tile.id ? 'bg-gradient-to-t from-pink-700/95 via-pink-900/80 to-transparent' : 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent'}`} /><div className="absolute inset-0 p-6 flex flex-col justify-end"><h3 className="text-2xl font-black text-white uppercase tracking-tight">{tile.title}</h3><p className="text-xs text-slate-300 mt-1">{tile.desc}</p>{hoveredMosaic === tile.id && <Link to="/jobs" className="mt-4 inline-flex items-center text-xs font-black text-white bg-slate-950/80 px-4 py-2 rounded-xl self-start">Post a Project &gt;</Link>}</div></div>)}
        </div>
      </section>

      <section className="glass-panel p-8 sm:p-14 rounded-3xl border border-slate-800 space-y-8"><div className="max-w-xl"><span className="text-xs font-black uppercase text-pink-400 tracking-wider">Skill discovery</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-1">Explore the skills and categories available on the platform</h2></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 text-xs text-slate-400">{SKILL_CATEGORIES_DIR.map((col, cIdx) => <div key={cIdx} className="space-y-2.5">{col.map((skill, sIdx) => <Link to="/gigs" key={sIdx} className="block hover:text-white transition">{skill}</Link>)}</div>)}</div></section>

      <section className="p-8 sm:p-12 bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-pink-900/30 border border-slate-800 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6"><div className="max-w-2xl"><h3 className="text-2xl font-black text-white">Bring a project to the student marketplace.</h3><p className="text-xs text-slate-400 mt-1">Start from a real project need and choose the path that fits your goal.</p></div><Link to="/register" className="px-6 py-3 neon-airflow-btn text-white text-xs font-black rounded-2xl shrink-0">Get started →</Link></section>

      <footer className="border-t border-slate-800 pt-16 space-y-12 text-slate-400 text-xs"><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8"><div className="space-y-4 col-span-2 sm:col-span-1"><div className="flex items-center space-x-2"><div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">S</div><span className="text-lg font-black text-white">SkillLaunch</span></div><div className="text-[11px] text-slate-400 space-y-1.5"><div className="flex items-center space-x-1.5 text-white font-bold"><Globe className="w-3.5 h-3.5" /><span>India (English)</span></div><div>Help & Support</div><div>Accessibility</div></div></div><div className="space-y-2.5"><span className="text-xs font-black text-white block uppercase">Network</span><div><Link to="/gigs">Categories</Link></div><div><Link to="/jobs">Projects</Link></div><div><Link to="/gigs">Gigs</Link></div><div><Link to="/gigs">Student Portfolios</Link></div></div><div className="space-y-2.5"><span className="text-xs font-black text-white block uppercase">About</span><div><Link to="/">About Us</Link></div><div><Link to="/">How it Works</Link></div><div><Link to="/">Security & Escrow</Link></div></div><div className="space-y-2.5"><span className="text-xs font-black text-white block uppercase">Terms</span><div><Link to="/">Privacy Policy</Link></div><div><Link to="/">Terms and Conditions</Link></div><div><Link to="/">Escrow Rules</Link></div></div><div className="space-y-2.5"><span className="text-xs font-black text-white block uppercase">Partners</span><div>Payment processing</div><div>Student communities</div><div>University relationships</div></div><div className="space-y-3"><span className="text-xs font-black text-white block uppercase">Get App</span><div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center font-bold text-white text-[11px]">Mobile app</div><div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center font-bold text-white text-[11px]">Web app</div></div></div><div className="border-t border-slate-800/80 pt-8"><span>SkillLaunch • Student marketplace</span></div></footer>
    </div>
  );
}
