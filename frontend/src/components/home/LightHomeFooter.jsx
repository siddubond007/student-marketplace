import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Globe, ShieldCheck, Heart, 
  ArrowUpRight 
} from 'lucide-react';

export default function LightHomeFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-lg font-black text-white tracking-tight">SkillLaunch</span>
            </Link>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              India's premier student freelance marketplace connecting ambitious college talent with startups and enterprises.
            </p>

            <div className="flex items-center space-x-3 text-slate-400 pt-1">
              <div className="flex items-center space-x-1.5 text-[11px] text-white font-bold bg-slate-800 px-2.5 py-1 rounded-lg">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>India (INR ₹)</span>
              </div>
            </div>
          </div>

          {/* Col 2: For Clients */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              For Clients
            </span>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/post-job" className="hover:text-white transition">Post a Project</Link></li>
              <li><Link to="/gigs" className="hover:text-white transition">Explore Student Gigs</Link></li>
              <li><Link to="/gigs" className="hover:text-white transition">Tiered Packages</Link></li>
              <li><Link to="/register" className="hover:text-white transition">5-Day Escrow Security</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Enterprise Talent Pool</Link></li>
            </ul>
          </div>

          {/* Col 3: For Students */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              For Students
            </span>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/register" className="hover:text-white transition">Join as Freelancer</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition">Browse Open Jobs</Link></li>
              <li><Link to="/register" className="hover:text-white transition">College ID Verification</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Seller Levels & Badges</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Student Creator Grants</Link></li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Popular Skills
            </span>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/gigs" className="hover:text-white transition">Full-Stack Development</Link></li>
              <li><Link to="/gigs" className="hover:text-white transition">UI/UX & Figma Design</Link></li>
              <li><Link to="/gigs" className="hover:text-white transition">Reels & Video Editing</Link></li>
              <li><Link to="/gigs" className="hover:text-white transition">AI & Machine Learning</Link></li>
              <li><Link to="/gigs" className="hover:text-white transition">SEO & Technical Writing</Link></li>
            </ul>
          </div>

          {/* Col 5: Security & Trust */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Security & Legal
            </span>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-white transition">Escrow Rules & Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition">Minor / Student Safety</Link></li>
              <li><Link to="/" className="hover:text-white transition">Dispute Resolution</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Counters & Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center space-x-6 font-bold text-slate-200">
            <div>
              <span className="text-indigo-400 font-black">85,000+</span> Verified Students
            </div>
            <div>
              <span className="text-emerald-400 font-black">25,000+</span> Projects Delivered
            </div>
          </div>

          <div>
            © 2026 SkillLaunch Marketplace Technologies Pvt Ltd. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
