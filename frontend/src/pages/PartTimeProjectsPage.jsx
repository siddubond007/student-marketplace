import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  Handshake,
  Layers3,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards
} from 'lucide-react';

const PROJECT_CATEGORIES = [
  '24/7 Student Opportunities',
  'Design & Creative',
  'Printable Products',
  'Partner Collaborations'
];

function PixelCardsVisual({ dark }) {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-indigo-400/20 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(99,102,241,.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,.20),transparent_26%),radial-gradient(circle_at_70%_90%,rgba(16,185,129,.17),transparent_30%)]" />
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full border border-indigo-400/20 bg-indigo-500/10 blur-2xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full border border-pink-400/20 bg-pink-500/10 blur-3xl" />

      <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" />
            Partner collaboration
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">SL • PC</span>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap gap-2 max-w-lg">
            {['Visiting Cards', 'Banners', 'Invitations', 'Posters', 'Certificates'].map((item, index) => (
              <div
                key={item}
                className={`rounded-xl border px-3 py-2 text-[10px] font-bold backdrop-blur ${index % 2 === 0
                  ? 'border-white/10 bg-white/[0.06] text-slate-200'
                  : 'border-indigo-300/20 bg-indigo-400/10 text-indigo-200'
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 max-w-lg">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.14em] text-indigo-300">Student side</div>
              <div className="mt-1 text-sm font-black text-white">Create reusable assets</div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Build once, publish after review.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.14em] text-pink-300">Customer side</div>
              <div className="mt-1 text-sm font-black text-white">Customize & use</div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Update supported details quickly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartTimeProjectsPage({ themeMode = 'light' }) {
  const dark = themeMode === 'dark';
  const page = dark ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900';
  const muted = dark ? 'text-slate-400' : 'text-slate-600';
  const panel = dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-white';

  return (
    <div className={`-mx-6 sm:-mx-8 lg:-mx-10 -my-8 min-h-[calc(100vh-5rem)] ${page}`}>
      <section className="relative overflow-hidden">
        {dark && (
          <>
            <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-600/15 blur-[130px]" />
            <div className="absolute top-16 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-18 pb-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div className="max-w-4xl">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${dark
                ? 'border-indigo-400/20 bg-indigo-500/10 text-indigo-300'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700'
              }`}>
                <Clock3 className="h-3.5 w-3.5" />
                24/7 Student Opportunities
              </span>

              <h1 className={`mt-5 text-4xl sm:text-6xl font-black tracking-tight leading-[1.02] ${dark ? 'text-white' : 'text-slate-950'}`}>
                Part-Time Projects
                <span className="block bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                  built to grow with SkillLaunch.
                </span>
              </h1>

              <p className={`mt-5 max-w-3xl text-base sm:text-lg leading-relaxed ${muted}`}>
                Discover flexible opportunities, explore permanent partner collaborations, and enter student-led projects that can evolve into long-term product ecosystems.
              </p>
            </div>

            <div className={`hidden sm:block rounded-3xl border p-5 min-w-[240px] ${panel}`}>
              <div className={`text-[9px] font-black uppercase tracking-[0.18em] ${muted}`}>Product structure</div>
              <div className={`mt-2 text-sm font-black ${dark ? 'text-white' : 'text-slate-950'}`}>Jobs → Collaborations → Products</div>
              <div className={`mt-1 text-[10px] leading-relaxed ${muted}`}>A scalable home for future SkillLaunch partnerships.</div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PROJECT_CATEGORIES.map((category, index) => (
              <span
                key={category}
                className={`shrink-0 rounded-full border px-4 py-2 text-[10px] font-black ${index === 0
                  ? dark
                    ? 'border-indigo-400/30 bg-indigo-500/15 text-indigo-200'
                    : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : dark
                    ? 'border-white/10 bg-white/5 text-slate-400'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}>
              Collaborated projects
            </span>
            <h2 className={`mt-2 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
              Discover partner-led opportunities
            </h2>
            <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${muted}`}>
              Each collaboration is a project ecosystem of its own. PixelCards is the first featured collaboration; additional partner projects can be added here later without changing the marketplace structure.
            </p>
          </div>

          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-xs font-black ${dark ? 'text-indigo-300 hover:text-white' : 'text-indigo-700 hover:text-indigo-900'}`}
          >
            Back to SkillLaunch home
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <Link
          to="/part-time-projects/pixelcards"
          className={`group block mt-8 rounded-[2rem] border overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${dark
            ? 'border-indigo-400/20 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-violet-950/30'
            : 'border-indigo-100 bg-gradient-to-br from-white via-indigo-50/70 to-violet-50'
          }`}
        >
          <div className="grid lg:grid-cols-[1.08fr_.92fr]">
            <PixelCardsVisual dark={dark} />

            <div className="p-7 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-4">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] ${dark
                  ? 'border-violet-400/20 bg-violet-500/10 text-violet-200'
                  : 'border-violet-200 bg-violet-50 text-violet-700'
                }`}>
                  <Handshake className="h-3.5 w-3.5" />
                  Featured collaboration
                </span>
                <span className={`text-[9px] font-black uppercase tracking-[0.16em] ${muted}`}>Project 01</span>
              </div>

              <h3 className={`mt-5 text-4xl sm:text-5xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
                PixelCards
              </h3>

              <p className={`mt-4 text-sm sm:text-base leading-relaxed ${muted}`}>
                A collaborative template ecosystem for banners, visiting cards, invitations and other printable designs. Students contribute reusable assets; customers can personalize supported fields through the connected template studio.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  [Users, 'Student creators', 'Build reusable designs'],
                  [Layers3, 'Template ecosystem', 'Many products under one project'],
                  [BriefcaseBusiness, 'Flexible work', 'Project-based student participation'],
                  [WalletCards, 'Future earnings', 'Designed for usage-based accounting']
                ].map(([Icon, title, copy]) => (
                  <div key={title} className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-white/75'}`}>
                    <Icon className={`h-4 w-4 ${dark ? 'text-indigo-300' : 'text-indigo-600'}`} />
                    <div className={`mt-2 text-[11px] font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</div>
                    <div className={`mt-1 text-[10px] leading-relaxed ${muted}`}>{copy}</div>
                  </div>
                ))}
              </div>

              <div className={`mt-7 inline-flex w-fit items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 shadow-lg shadow-indigo-600/20`}>
                Explore PixelCards project
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className={`rounded-3xl border p-6 sm:p-8 ${panel}`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${dark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className={`mt-5 text-2xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>24/7 opportunity model</h3>
            <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
              The part-time area can grow beyond one collaboration: regular student opportunities can live alongside partner projects while following the same SkillLaunch discovery pattern.
            </p>
          </div>

          <div className={`rounded-3xl border p-6 sm:p-8 ${panel}`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${dark ? 'bg-pink-500/10 text-pink-300' : 'bg-pink-50 text-pink-600'}`}>
              <Layers3 className="h-5 w-5" />
            </div>
            <h3 className={`mt-5 text-2xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>Built for future collaborations</h3>
            <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
              New partner products can be added as large project cards with their own detail pages, without mixing their internal templates into this top-level directory.
            </p>
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className={`rounded-3xl border p-6 sm:p-8 ${panel}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Plus className="h-4 w-4" />
                Future collaboration slot
              </div>
              <h3 className={`mt-2 text-xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
                Add the next partner project without redesigning this page.
              </h3>
              <p className={`mt-1 text-xs leading-relaxed max-w-2xl ${muted}`}>
                This reserved structure is intentionally generic so future collaborations can be introduced later with the same navigation and project-detail model.
              </p>
            </div>
            <div className={`shrink-0 rounded-2xl border px-4 py-3 text-[10px] font-black ${dark ? 'border-white/10 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              Ready for Project 02+
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
