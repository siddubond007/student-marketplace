import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, GraduationCap, CheckCircle2, ShieldCheck, 
  ArrowRight, DollarSign, Clock, Award, Zap, Layers, Sparkles
} from 'lucide-react';

export default function LightHomeDualRole() {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'students'

  return (
    <section className="py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Role Switcher */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Tailored Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Built for Clients. Powered by Students.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Choose your journey on SkillLaunch. Experience frictionless hiring or launch your freelance career right from campus.
          </p>

          {/* Segmented Pill Switcher */}
          <div className="pt-2">
            <div className="light-role-pill shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('clients')}
                className={`light-role-btn flex items-center gap-2 ${activeTab === 'clients' ? 'active' : ''}`}
              >
                <Briefcase className="w-4 h-4" />
                <span>I Want to Hire Talent</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className={`light-role-btn flex items-center gap-2 ${activeTab === 'students' ? 'active' : ''}`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>I Want to Work & Earn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content based on Active Tab */}
        {activeTab === 'clients' ? (
          /* CLIENT VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="light-glass-card rounded-2xl p-7 border border-slate-200/90 relative group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6 font-black text-lg group-hover:scale-110 transition duration-300">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Post Projects or Browse Gigs
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Publish your task in under 2 minutes with budget criteria or instantly buy pre-packaged student gigs starting at ₹499.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Receive custom bids from verified students</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Transparent portfolios & college verified badges</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="light-glass-card rounded-2xl p-7 border border-slate-200/90 relative group">
              <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center mb-6 font-black text-lg group-hover:scale-110 transition duration-300">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Zero-Risk 5-Day Escrow
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Fund milestones securely via Razorpay. Your money stays locked in escrow and is only released after you inspect and approve work.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>5 full days to review deliverables or request revisions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>Integrated dispute & resolution center</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="light-glass-card rounded-2xl p-7 border border-slate-200/90 relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-6 font-black text-lg group-hover:scale-110 transition duration-300">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Top Quality, 70% Less Cost
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Avoid agency overheads. Work with motivated students from top universities bringing cutting-edge modern tools and rapid turnaround.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Average initial bid response within 15 minutes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct real-time chat & file workspace</span>
                </li>
              </ul>
            </div>

          </div>
        ) : (
          /* STUDENT FREELANCER VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Student Step 1 */}
            <div className="light-glass-card rounded-2xl p-7 border border-slate-200/90 relative group">
              <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center mb-6 font-black text-lg group-hover:scale-110 transition duration-300">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Showcase Gigs & Verify College ID
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Create 3-tiered gig packages (Basic, Standard, Premium) in minutes. Add your college credentials for an instant trust boost.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>Build algorithmic reputation & level up (Pro, Top Tier)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>Custom offer generator for chat negotiations</span>
                </li>
              </ul>
            </div>

            {/* Student Step 2 */}
            <div className="light-glass-card rounded-2xl p-7 border border-slate-200/90 relative group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-6 font-black text-lg group-hover:scale-110 transition duration-300">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Work on Flexible Campus Timings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Take projects on weekends, after lectures, or during vacations. You define your scope, deadlines, and delivery schedule.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Gain real industry experience before graduating</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Verified client ratings & portfolio endorsements</span>
                </li>
              </ul>
            </div>

            {/* Student Step 3 */}
            <div className="light-glass-card rounded-2xl p-7 border border-slate-200/90 relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-6 font-black text-lg group-hover:scale-110 transition duration-300">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Guaranteed Escrow Payouts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Never chase unpaid client invoices again. Funds are deposited in escrow before work begins and transferred directly to your bank account.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct UPI / Bank account settlement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Minor/Student financial safety protection</span>
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* Dynamic CTA Footer for Role */}
        <div className="mt-12 text-center">
          {activeTab === 'clients' ? (
            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 light-btn-primary px-8 py-3.5 rounded-2xl text-sm font-bold shadow-md"
            >
              <span>Post a Project for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 light-btn-primary px-8 py-3.5 rounded-2xl text-sm font-bold shadow-md"
            >
              <span>Join as Student Freelancer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}
