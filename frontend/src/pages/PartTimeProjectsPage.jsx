import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Layers3,
  Palette,
  Sparkles,
  TrendingUp,
  WalletCards,
  WandSparkles
} from 'lucide-react';

const CATEGORIES = [
  'Business Cards',
  'Banners & Posters',
  'Invitations',
  'Certificates',
  'Menus & Price Lists',
  'Social Media Kits'
];

const TEMPLATES = [
  {
    title: 'Modern Business Card',
    category: 'Business',
    price: '₹149',
    uses: '1.2K',
    tone: 'indigo'
  },
  {
    title: 'Elegant Wedding Invite',
    category: 'Invitations',
    price: '₹199',
    uses: '840',
    tone: 'pink'
  },
  {
    title: 'Weekend Sale Banner',
    category: 'Marketing',
    price: '₹99',
    uses: '1.5K',
    tone: 'emerald'
  }
];

function PreviewCard({ tone, dark }) {
  const base = dark
    ? 'border-white/10 bg-slate-950/80'
    : 'border-slate-200 bg-white';

  const glow = tone === 'pink'
    ? 'from-pink-500/25 via-transparent to-violet-500/20'
    : tone === 'emerald'
      ? 'from-emerald-500/20 via-transparent to-indigo-500/20'
      : 'from-indigo-500/25 via-transparent to-pink-500/15';

  return (
    <div className={`relative aspect-[1.55/1] overflow-hidden rounded-2xl border ${base}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${glow}`} />
      <div className="relative h-full p-5 flex flex-col justify-between">
        <div className={`text-[8px] font-black tracking-[0.22em] uppercase ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
          SkillLaunch Template
        </div>
        <div>
          <div className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
            {tone === 'pink' ? 'Ananya & Karan' : tone === 'emerald' ? '30% OFF' : 'Aarav Mehta'}
          </div>
          <div className={`text-[9px] mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Replace names, logos, dates and details in your connected template editor.
          </div>
        </div>
        <div className={`text-[8px] font-black tracking-wider ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}>
          CUSTOMIZABLE • PRINT-READY
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
            <div className="absolute -top-36 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[130px]" />
            <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
          <div className="max-w-4xl">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${dark
              ? 'border-indigo-400/20 bg-indigo-500/10 text-indigo-300'
              : 'border-indigo-200 bg-indigo-50 text-indigo-700'
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
              SkillLaunch Creative Marketplace
            </span>

            <h1 className={`mt-5 text-4xl sm:text-6xl font-black tracking-tight leading-[1.02] ${dark ? 'text-white' : 'text-slate-950'}`}>
              Part-Time Projects
              <span className="block bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                that keep creating value.
              </span>
            </h1>

            <p className={`mt-5 max-w-3xl text-base sm:text-lg leading-relaxed ${muted}`}>
              A permanent SkillLaunch space for student-created reusable templates, printable products and future partner-powered customization.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#templates"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-indigo-600/20"
              >
                Explore Templates
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/register"
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-bold ${dark
                  ? 'border-white/10 bg-white/5 text-slate-200'
                  : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                Become a Template Creator
                <TrendingUp className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-3xl border p-3 ${panel}`}>
            {[
              ['01', 'Create', 'Build reusable student-designed assets.'],
              ['02', 'Customize', 'Let customers change supported fields.'],
              ['03', 'Use', 'Prepare digital or printable output.'],
              ['04', 'Earn', 'Prepare the platform for repeat usage income.']
            ].map(([number, title, copy]) => (
              <div key={number} className={`rounded-2xl p-4 sm:p-5 ${dark ? 'bg-black/20' : 'bg-slate-50'}`}>
                <div className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{number}</div>
                <div className={`mt-2 text-sm font-black ${dark ? 'text-indigo-200' : 'text-indigo-700'}`}>{title}</div>
                <p className={`mt-1 text-[11px] leading-relaxed ${muted}`}>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}>
              Marketplace foundation
            </span>
            <h2 className={`mt-2 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
              Featured templates
            </h2>
            <p className={`mt-2 text-sm ${muted}`}>
              UI-only sample listings for the first release.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <span
                key={category}
                className={`rounded-full border px-3 py-2 text-[10px] font-bold ${dark
                  ? 'border-white/10 bg-white/5 text-slate-300'
                  : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {TEMPLATES.map(template => (
            <article
              key={template.title}
              className={`group rounded-3xl border p-4 sm:p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${panel}`}
            >
              <PreviewCard tone={template.tone} dark={dark} />

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.16em] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {template.category}
                  </span>
                  <h3 className={`mt-1 text-lg font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
                    {template.title}
                  </h3>
                  <p className={`mt-1 text-xs ${muted}`}>Created by a SkillLaunch student creator</p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-950'}`}>{template.price}</div>
                  <div className={`text-[10px] ${muted}`}>per use</div>
                </div>
              </div>

              <div className={`mt-4 pt-4 border-t flex items-center justify-between ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${muted}`}>
                  <TrendingUp className="h-3.5 w-3.5" />
                  {template.uses} uses
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-[10px] font-black text-white transition group-hover:bg-indigo-600"
                >
                  Customize
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-14">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className={`rounded-3xl border p-6 sm:p-8 ${panel}`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${dark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
              <WandSparkles className="h-5 w-5" />
            </div>
            <h3 className={`mt-5 text-2xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>For customers</h3>
            <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
              Pick a reusable design, replace names, dates, logos and other supported fields, then hand the design to the connected template engine for final rendering.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Dynamic fields', 'Live preview', 'Print-ready output'].map(item => (
                <span key={item} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold ${dark
                  ? 'border-white/10 bg-white/5 text-slate-300'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}>
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border p-6 sm:p-8 ${panel}`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${dark ? 'bg-pink-500/10 text-pink-300' : 'bg-pink-50 text-pink-600'}`}>
              <WalletCards className="h-5 w-5" />
            </div>
            <h3 className={`mt-5 text-2xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>For student creators</h3>
            <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
              Take a template project, create a reusable asset, submit it for review, and keep it available as a marketplace product after approval.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Project-based work', 'Permanent listing', 'Usage-based earning model'].map(item => (
                <span key={item} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold ${dark
                  ? 'border-white/10 bg-white/5 text-slate-300'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}>
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className={`rounded-[2rem] border p-6 sm:p-10 overflow-hidden relative ${dark
          ? 'border-indigo-400/15 bg-gradient-to-r from-indigo-950/70 via-violet-950/50 to-pink-950/40'
          : 'border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-pink-50'
        }`}>
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] ${dark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                <Palette className="h-4 w-4" />
                SkillLaunch × Partner Template Studio
              </div>
              <h2 className={`mt-3 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
                Marketplace on one side. Template engine on the other.
              </h2>
              <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${muted}`}>
                The UI is designed so SkillLaunch can own discovery, student project workflows, listings and future earnings while the partner application handles template editing, dynamic fields and final rendering.
              </p>
            </div>
            <div className={`rounded-2xl border px-5 py-4 ${dark ? 'border-white/10 bg-black/20' : 'border-white bg-white/80'}`}>
              <div className={`text-[9px] font-black uppercase tracking-[0.16em] ${muted}`}>Planned integration</div>
              <div className={`mt-1 text-sm font-black ${dark ? 'text-white' : 'text-slate-900'}`}>API / deep-link handoff</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20`}>
        <div className={`rounded-3xl border p-6 sm:p-10 text-center ${panel}`}>
          <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] ${dark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            <Layers3 className="h-4 w-4" />
            UI foundation ready
          </div>
          <h2 className={`mt-3 text-3xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
            Create. Publish. Measure. Improve.
          </h2>
          <p className={`mt-2 max-w-2xl mx-auto text-sm ${muted}`}>
            Real template data, approval workflows, partner API calls and student earnings can be connected in later roadmap phases.
          </p>
        </div>
      </section>
    </div>
  );
}
