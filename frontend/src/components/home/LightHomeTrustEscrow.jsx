import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, CheckCircle2, Clock, 
  Sparkles, Award, ArrowRight, FileCheck, RefreshCw, University
} from 'lucide-react';

const UNIVERSITIES = [
  'IIT Delhi', 'BITS Pilani', 'IIT Bombay', 'NIT Trichy', 
  'Delhi University', 'IIIT Hyderabad', 'VIT Vellore', 'SRM University'
];

export default function LightHomeTrustEscrow() {
  return (
    <section className="py-16 sm:py-20 relative z-10 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Campus Network Trust Banner */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Trusted by students across India's premier engineering & arts institutions
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 opacity-75">
            {UNIVERSITIES.map((uni) => (
              <span
                key={uni}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 shadow-sm"
              >
                🎓 {uni}
              </span>
            ))}
          </div>
        </div>

        {/* 5-Day Escrow Security Visual Card */}
        <div className="light-glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Col: Explainer */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Buyer & Seller Protection</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                How Our 5-Day Escrow Keeps Your Money Safe
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                When you hire on SkillLaunch, funds are deposited into a secure Razorpay Escrow vault. The freelancer only gets paid when you receive your deliverables and approve the work.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">5 Full Days for Deliverable Review</h4>
                    <p className="text-xs text-slate-500">Inspect code, design files, or video renders with unlimited revision requests.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dedicated Dispute Resolution Support</h4>
                    <p className="text-xs text-slate-500">Neutral admin intervention with instant refund protection if criteria are not met.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Direct UPI & Bank Settlements for Students</h4>
                    <p className="text-xs text-slate-500">Instant payout releases into student bank accounts upon milestone completion.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="light-btn-primary px-7 py-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Get Started Risk-Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

            {/* Right Col: Interactive Visual Steps */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">Fund Milestone into Escrow</h5>
                    <p className="text-[11px] text-slate-500">Money is safely locked before student begins work</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                  Funded
                </span>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">Student Delivers Project</h5>
                    <p className="text-[11px] text-slate-500">Files and project assets uploaded to Workspace</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 text-[10px] font-bold">
                  Delivered
                </span>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200 shadow-md ring-2 ring-indigo-500/10 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">5-Day Review & Feedback Period</h5>
                    <p className="text-[11px] text-indigo-600 font-semibold">Inspect quality or request instant revision</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  In Review
                </span>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">Approval & Payout Release</h5>
                    <p className="text-[11px] text-slate-500">Funds transferred securely to student's account</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  Completed
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
