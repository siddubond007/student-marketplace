import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers3,
  Palette,
  Sparkles,
  WalletCards,
  WandSparkles
} from 'lucide-react';

export default function PartTimeProjectsPromo({ themeMode = 'light' }) {
  const dark = themeMode === 'dark';

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className={`max-w-7xl mx-auto overflow-hidden rounded-[2rem] border ${dark
        ? 'border-indigo-400/20 bg-gradient-to-br from-slate-950 via-indigo-950/70 to-violet-950/50 shadow-[0_24px_80px_rgba(79,70,229,0.16)]'
        : 'border-indigo-100 bg-gradient-to-br from-white via-indigo-50/80 to-violet-50 shadow-[0_24px_70px_rgba(79,70,229,0.10)]'
      }`}>
        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-center p-6 sm:p-8 lg:p-10">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${dark
              ? 'border-indigo-400/20 bg-indigo-500/10 text-indigo-300'
              : 'border-indigo-200 bg-indigo-50 text-indigo-700'
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
              Part-Time Projects
            </div>

            <h2 className={`mt-5 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
              Create once. Keep earning.
            </h2>

            <p className={`mt-3 max-w-2xl text-sm sm:text-base leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              Create reusable banners, visiting cards, invitations, posters and other printable designs that customers can personalize whenever they need them.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/part-time-projects"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5"
              >
                Explore Part-Time Projects
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/register"
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-bold transition ${dark
                  ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Become a Template Creator
                <Palette className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: WandSparkles, title: 'Create', copy: 'Build reusable assets.' },
              { icon: Layers3, title: 'Publish', copy: 'List them in the marketplace.' },
              { icon: WalletCards, title: 'Earn', copy: 'Track repeat usage later.' }
            ].map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className={`rounded-2xl border p-4 sm:p-5 ${dark
                  ? 'border-white/10 bg-white/[0.035]'
                  : 'border-slate-200 bg-white/80'
                }`}
              >
                <Icon className={`h-5 w-5 ${dark ? 'text-indigo-300' : 'text-indigo-600'}`} />
                <div className={`mt-3 text-xs font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</div>
                <div className={`mt-1 text-[10px] leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{copy}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`border-t px-6 sm:px-8 lg:px-10 py-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between ${dark ? 'border-white/10' : 'border-indigo-100'}`}>
          <span className={`text-[11px] font-medium ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            A permanent SkillLaunch space for reusable digital and printable products.
          </span>
          <span className={`text-[11px] font-black ${dark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Templates • Projects • Earnings
          </span>
        </div>
      </div>
    </section>
  );
}
