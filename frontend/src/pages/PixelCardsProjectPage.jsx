import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Mail,
  MapPin,
  Palette,
  Phone,
  Sparkles,
  Users,
  WalletCards,
  WandSparkles
} from 'lucide-react';

const CATEGORIES = [
  { title: 'Visiting Cards', copy: 'Professional cards with editable names, roles and contact details.' },
  { title: 'Business Cards', copy: 'Reusable business layouts for shops, brands and professionals.' },
  { title: 'Banners & Posters', copy: 'Promotional formats designed for digital and print use.' },
  { title: 'Invitations', copy: 'Occasion-ready layouts with replaceable event details.' },
  { title: 'Certificates', copy: 'Structured certificate designs for events and recognitions.' },
  { title: 'Social Designs', copy: 'Reusable promotional creatives for online campaigns.' }
];

const WORKFLOW = [
  ['01', 'Create', 'A student builds a reusable template asset for the collaboration.'],
  ['02', 'Review', 'The submitted design goes through the required quality and policy checks.'],
  ['03', 'Publish', 'Approved work becomes part of the PixelCards project ecosystem.'],
  ['04', 'Customize', 'Customers update supported fields such as names, logos and dates.'],
  ['05', 'Use', 'The final design can be prepared for digital use or printing.'],
  ['06', 'Earn', 'Future usage and revenue accounting can connect back to eligible creators.']
];

const TEMPLATE_DEMO_CARDS = [
  {
    name: 'Aarav Mehta',
    role: 'Marketing Manager',
    phone: '+91 90000 00000',
    email: 'aarav@example.com',
    address: '23 MG Road, Bengaluru, KA 560001'
  },
  {
    name: 'Ishita Rao',
    role: 'Brand Strategist',
    phone: '+91 98765 43210',
    email: 'ishita@novaworks.in',
    address: '14 Lake View Road, Hyderabad, TS 500034'
  },
  {
    name: 'Kiran Varma',
    role: 'Founder & Designer',
    phone: '+91 91234 56789',
    email: 'kiran@pixelhouse.in',
    address: '88 Jubilee Hills, Hyderabad, TS 500033'
  },
  {
    name: 'Ananya Reddy',
    role: 'Visual Designer',
    phone: '+91 99887 66554',
    email: 'ananya@orbitcreative.in',
    address: '7 Residency Road, Chennai, TN 600002'
  },
  {
    name: 'Vihaan Kapoor',
    role: 'Product Designer',
    phone: '+91 98111 22334',
    email: 'vihaan@futuregrid.io',
    address: '18 Cyber Park, Gurugram, HR 122002'
  },
  {
    name: 'Meera Shah',
    role: 'Creative Technologist',
    phone: '+91 97654 11223',
    email: 'meera@quantumstudio.ai',
    address: '42 Indiranagar, Bengaluru, KA 560038'
  }
];

const DEMO_SEGMENTS = [
  { field: 'name', start: 700, duration: 1100 },
  { field: 'role', start: 1800, duration: 1000 },
  { field: 'phone', start: 2800, duration: 950 },
  { field: 'email', start: 3750, duration: 1000 },
  { field: 'address', start: 4750, duration: 1050 }
];

const DEMO_FIELD_LABELS = {
  name: 'NAME',
  role: 'ROLE',
  phone: 'PHONE',
  email: 'EMAIL',
  address: 'ADDRESS'
};

const DEMO_CYCLE_MS = 7200;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getTypedText = (value, elapsed, start, duration) => {
  const progress = clamp((elapsed - start) / duration, 0, 1);
  return value.slice(0, Math.floor(progress * value.length));
};

const PARTICLES = Array.from({ length: 48 }, (_, index) => ({
  left: ((index * 37) % 92) + 4,
  top: ((index * 53) % 84) + 8,
  x: ((index * 61) % 300) - 150,
  y: ((index * 47) % 220) - 110,
  rotate: ((index * 17) % 180) - 90,
  scale: 0.55 + ((index % 5) * 0.13),
  delay: (index % 12) * 22
}));

function BusinessCardTemplate({ templateIndex, data, activeField, isTyping }) {
  const templates = [
    {
      name: 'Thynk Sky',
      shell: 'bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900 border-sky-100',
      brand: 'text-slate-950',
      eyebrow: 'text-sky-700',
      contact: 'text-slate-700',
      meta: 'text-slate-500',
      accent: 'bg-sky-600',
      accentSoft: 'bg-sky-500/10 border-sky-200',
      badge: 'bg-sky-600 text-white',
      line: 'bg-sky-600',
      ring: 'from-sky-400 via-cyan-300 to-indigo-500',
      glow: 'bg-sky-300/25',
      chip: 'bg-sky-50 text-sky-700 border-sky-100'
    },
    {
      name: 'Nova Pulse',
      shell: 'bg-gradient-to-br from-[#070B16] via-indigo-950 to-[#351047] text-white border-indigo-400/20',
      brand: 'text-white',
      eyebrow: 'text-indigo-200',
      contact: 'text-slate-100',
      meta: 'text-indigo-200/70',
      accent: 'bg-fuchsia-400',
      accentSoft: 'bg-white/5 border-white/10',
      badge: 'bg-fuchsia-400 text-slate-950',
      line: 'bg-fuchsia-400',
      ring: 'from-fuchsia-400 via-violet-400 to-cyan-300',
      glow: 'bg-fuchsia-400/20',
      chip: 'bg-white/5 text-fuchsia-200 border-white/10'
    },
    {
      name: 'Pixel Prism',
      shell: 'bg-gradient-to-br from-amber-50 via-white to-violet-50 text-slate-900 border-violet-100',
      brand: 'text-slate-950',
      eyebrow: 'text-violet-700',
      contact: 'text-slate-700',
      meta: 'text-slate-500',
      accent: 'bg-violet-600',
      accentSoft: 'bg-violet-500/10 border-violet-200',
      badge: 'bg-violet-600 text-white',
      line: 'bg-violet-600',
      ring: 'from-violet-500 via-fuchsia-400 to-amber-300',
      glow: 'bg-violet-300/25',
      chip: 'bg-violet-50 text-violet-700 border-violet-100'
    },
    {
      name: 'Cyber Glass',
      shell: 'bg-gradient-to-br from-[#06131A] via-[#0A2630] to-[#071B34] text-white border-cyan-300/20',
      brand: 'text-white',
      eyebrow: 'text-cyan-200',
      contact: 'text-cyan-50',
      meta: 'text-cyan-200/65',
      accent: 'bg-cyan-300',
      accentSoft: 'bg-cyan-300/10 border-cyan-200/20',
      badge: 'bg-cyan-300 text-slate-950',
      line: 'bg-cyan-300',
      ring: 'from-cyan-300 via-emerald-300 to-blue-400',
      glow: 'bg-cyan-300/20',
      chip: 'bg-cyan-300/10 text-cyan-100 border-cyan-200/20'
    },
    {
      name: 'Orbit Neon',
      shell: 'bg-gradient-to-br from-[#090A13] via-[#12152B] to-[#261040] text-white border-pink-300/20',
      brand: 'text-white',
      eyebrow: 'text-pink-200',
      contact: 'text-pink-50',
      meta: 'text-pink-100/60',
      accent: 'bg-pink-400',
      accentSoft: 'bg-pink-400/10 border-pink-200/20',
      badge: 'bg-pink-400 text-slate-950',
      line: 'bg-pink-400',
      ring: 'from-pink-400 via-orange-300 to-violet-400',
      glow: 'bg-pink-400/20',
      chip: 'bg-pink-400/10 text-pink-100 border-pink-200/20'
    },
    {
      name: 'Quantum Mono',
      shell: 'bg-gradient-to-br from-[#0B0D10] via-[#15181D] to-[#242A31] text-white border-white/15',
      brand: 'text-white',
      eyebrow: 'text-lime-200',
      contact: 'text-slate-100',
      meta: 'text-slate-400',
      accent: 'bg-lime-300',
      accentSoft: 'bg-lime-300/10 border-lime-200/20',
      badge: 'bg-lime-300 text-slate-950',
      line: 'bg-lime-300',
      ring: 'from-lime-300 via-white to-cyan-300',
      glow: 'bg-lime-300/15',
      chip: 'bg-lime-300/10 text-lime-100 border-lime-200/15'
    }
  ];

  const theme = templates[templateIndex % templates.length];
  const fieldIsActive = field => isTyping && activeField === field;
  const fieldClass = field => (
    fieldIsActive(field)
      ? 'px-0.5 py-1 transition-all duration-300'
      : 'px-0.5 py-1'
  );

  const cursor = field => (
    fieldIsActive(field)
      ? <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-current opacity-80" />
      : null
  );

  const initials = data.name.split(' ').map(part => part[0]).slice(0, 2).join('');
  const profileTag = templateIndex === 0 ? 'STUDIO 01' : templateIndex === 1 ? 'NODE 02' : templateIndex === 2 ? 'PRISM 03' : templateIndex === 3 ? 'GRID 04' : templateIndex === 4 ? 'ORBIT 05' : 'QNTM 06';

  return (
    <div className={`relative aspect-[1.58/1] overflow-hidden rounded-2xl border shadow-xl ${theme.shell}`}>
      <div className={`absolute -right-14 -top-14 h-40 w-40 rounded-full blur-2xl ${theme.glow}`} />
      <div className={`absolute right-[18%] top-[18%] h-24 w-24 rounded-full border border-white/10 opacity-50`} />

      <div className="relative flex h-full p-4 sm:p-5">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3 pr-1">
            <div className="min-w-0">
              <div className={`text-[8px] font-black uppercase tracking-[0.24em] ${theme.eyebrow}`}>
                {theme.name}
              </div>
              <div className={`mt-1 text-[6px] font-bold uppercase tracking-[0.18em] ${theme.meta}`}>
                Editable identity card
              </div>
            </div>
            <span className={`shrink-0 rounded-full border px-2 py-1 text-[6px] font-black uppercase tracking-[0.14em] ${theme.badge}`}>
              {profileTag}
            </span>
          </div>

          <div className="mt-4 max-w-[68%]">
            <div className={`h-1 w-14 rounded-full ${theme.line}`} />
            <div className={fieldClass('name')}>
              <div className={`mt-3 min-h-[2rem] text-[clamp(1rem,3.35vw,1.65rem)] font-black leading-none tracking-tight ${theme.brand}`}>
                {data.name || '\u00A0'}{cursor('name')}
              </div>
            </div>
            <div className={fieldClass('role')}>
              <div className={`mt-1 min-h-[1rem] text-[clamp(0.55rem,1.7vw,0.8rem)] font-semibold ${theme.eyebrow}`}>
                {data.role || '\u00A0'}{cursor('role')}
              </div>
            </div>
          </div>

          <div className={`mt-auto w-[70%] grid gap-0.5 ${theme.contact}`}>
            <div className={fieldClass('phone')}>
              <div className="flex min-h-[1rem] items-center gap-2 text-[clamp(0.46rem,1.34vw,0.64rem)] font-semibold">
                <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${theme.accentSoft}`}>
                  <Phone className={`h-2.5 w-2.5 ${theme.eyebrow}`} />
                </span>
                <span className="min-w-0 truncate">{data.phone || '\u00A0'}{cursor('phone')}</span>
              </div>
            </div>

            <div className={fieldClass('email')}>
              <div className="flex min-h-[1rem] items-center gap-2 text-[clamp(0.44rem,1.28vw,0.62rem)] font-semibold">
                <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${theme.accentSoft}`}>
                  <Mail className={`h-2.5 w-2.5 ${theme.eyebrow}`} />
                </span>
                <span className="min-w-0 truncate">{data.email || '\u00A0'}{cursor('email')}</span>
              </div>
            </div>

            <div className={fieldClass('address')}>
              <div className="flex min-h-[1rem] items-center gap-2 text-[clamp(0.42rem,1.2vw,0.59rem)] font-semibold leading-tight">
                <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${theme.accentSoft}`}>
                  <MapPin className={`h-2.5 w-2.5 ${theme.eyebrow}`} />
                </span>
                <span className="min-w-0 truncate">{data.address || '\u00A0'}{cursor('address')}</span>
              </div>
            </div>
          </div>

          <div className={`mt-1 flex items-center justify-between text-[5px] font-black uppercase tracking-[0.12em] ${theme.meta}`}>
            <span>Reusable • editable</span>
            <span>PixelCards</span>
          </div>
        </div>

        <div className="relative w-[31%] min-w-[82px]">
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${theme.ring} p-[2px] shadow-[0_0_32px_rgba(99,102,241,0.22)]`}>
              <div className={`flex h-full w-full items-center justify-center rounded-full ${templateIndex === 1 || templateIndex === 3 || templateIndex === 4 || templateIndex === 5 ? 'bg-[#090D18]' : 'bg-white'}`}>
                <div className={`relative flex h-[58px] w-[58px] items-center justify-center rounded-full border ${theme.accentSoft}`}>
                  <span className={`text-[15px] font-black tracking-tight ${theme.brand}`}>{initials}</span>
                  <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 ${templateIndex === 1 || templateIndex === 3 || templateIndex === 4 || templateIndex === 5 ? 'border-[#090D18] bg-emerald-400' : 'border-white bg-emerald-500'} animate-pulse`} />
                </div>
              </div>
            </div>

            <div className={`mt-2 text-center text-[6px] font-black uppercase tracking-[0.16em] ${theme.meta}`}>
              Profile / Creator
            </div>
          </div>

          <div className={`absolute bottom-1 right-0 rounded-full border px-2 py-1 text-[6px] font-black uppercase tracking-[0.12em] ${theme.chip}`}>
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}


export default function PixelCardsProjectPage({ themeMode = 'light' }) {
  const dark = themeMode === 'dark';
  const [activeSide, setActiveSide] = useState('students');
  const [demoClock, setDemoClock] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDemoClock(current => current + 80);
    }, 80);

    return () => window.clearInterval(timer);
  }, []);

  const cycleElapsed = demoClock % DEMO_CYCLE_MS;
  const demoIndex = Math.floor(demoClock / DEMO_CYCLE_MS) % TEMPLATE_DEMO_CARDS.length;
  const demoCard = TEMPLATE_DEMO_CARDS[demoIndex];

  const isEntering = cycleElapsed < 650;
  const isExiting = cycleElapsed >= 6200;

  const activeSegment = [...DEMO_SEGMENTS]
    .reverse()
    .find(segment => cycleElapsed >= segment.start) || DEMO_SEGMENTS[0];

  const activeDemoField = activeSegment.field;
  const activeFieldLabel = DEMO_FIELD_LABELS[activeDemoField] || 'NAME';

  const typedDemoCard = {
    name: getTypedText(demoCard.name, cycleElapsed, DEMO_SEGMENTS[0].start, DEMO_SEGMENTS[0].duration),
    role: getTypedText(demoCard.role, cycleElapsed, DEMO_SEGMENTS[1].start, DEMO_SEGMENTS[1].duration),
    phone: getTypedText(demoCard.phone, cycleElapsed, DEMO_SEGMENTS[2].start, DEMO_SEGMENTS[2].duration),
    email: getTypedText(demoCard.email, cycleElapsed, DEMO_SEGMENTS[3].start, DEMO_SEGMENTS[3].duration),
    address: getTypedText(demoCard.address, cycleElapsed, DEMO_SEGMENTS[4].start, DEMO_SEGMENTS[4].duration)
  };

  const page = dark ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900';
  const muted = dark ? 'text-slate-400' : 'text-slate-600';
  const panel = dark ? 'border-white/10 bg-white/[0.035]' : 'border-slate-200 bg-white';
  const soft = dark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-white/70';

  return (
    <div className={`-mx-6 sm:-mx-8 lg:-mx-10 -my-8 min-h-[calc(100vh-5rem)] ${page}`}>
      <section className="relative overflow-hidden">
        {dark && (
          <>
            <div className="absolute -top-44 left-1/4 h-[32rem] w-[32rem] rounded-full bg-indigo-600/15 blur-[140px]" />
            <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-pink-600/10 blur-[120px]" />
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <Link to="/part-time-projects" className={dark ? 'text-slate-500 hover:text-indigo-300' : 'text-slate-500 hover:text-indigo-700'}>
              Part-Time Projects
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <span className={dark ? 'text-indigo-300' : 'text-indigo-700'}>PixelCards</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_.8fr] gap-10 items-center py-12 sm:py-16">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${dark
                ? 'border-indigo-400/20 bg-indigo-500/10 text-indigo-300'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700'
              }`}>
                <Sparkles className="h-3.5 w-3.5" />
                SkillLaunch collaboration
              </span>

              <h1 className={`mt-5 text-5xl sm:text-6xl font-black tracking-tight leading-[1.02] ${dark ? 'text-white' : 'text-slate-950'}`}>
                PixelCards
                <span className="block bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                  create once. customize anywhere.
                </span>
              </h1>

              <p className={`mt-5 max-w-2xl text-base sm:text-lg leading-relaxed ${muted}`}>
                A partner-led template project where SkillLaunch can connect student-created reusable designs with customers who need fast, customizable and printable creative assets.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a
                  href="#workflow"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-indigo-600/20"
                >
                  See how it works
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/register"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-bold ${dark
                    ? 'border-white/10 bg-white/5 text-slate-200'
                    : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  Join as a Creator
                  <Users className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                {[
                  [Palette, 'Reusable design'],
                  [WandSparkles, 'Dynamic fields'],
                  [Download, 'Printable output']
                ].map(([Icon, label]) => (
                  <div key={label} className={`rounded-2xl border p-4 ${soft}`}>
                    <Icon className={`h-4 w-4 ${dark ? 'text-indigo-300' : 'text-indigo-600'}`} />
                    <div className={`mt-2 text-[10px] font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative rounded-[2rem] border p-5 sm:p-6 ${dark
              ? 'border-indigo-400/20 bg-gradient-to-br from-slate-950 via-indigo-950/70 to-violet-950/50'
              : 'border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-violet-50'
            }`}>
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-500/15 blur-3xl" />
              <div className={`relative rounded-[1.5rem] border p-5 ${dark ? 'border-white/10 bg-black/20' : 'border-white bg-white/80'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase tracking-[0.16em] ${muted}`}>PixelCards preview</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-500"><BadgeCheck className="h-3.5 w-3.5" /> Print-ready</span>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <span className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300">Template in action</span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">Auto customization</span>
                  </div>

                  <div className="relative overflow-visible">
                    <div
                      key={demoIndex}
                      className={`relative overflow-hidden rounded-2xl ${isEntering ? 'pixel-template-enter' : ''} ${isExiting ? 'pixel-template-exit' : ''}`}
                    >
                      <BusinessCardTemplate
                        templateIndex={demoIndex % 6}
                        data={typedDemoCard}
                        activeField={activeDemoField}
                        isTyping={!isExiting && cycleElapsed >= 600 && cycleElapsed < 5800}
                      />

                      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
                    </div>

                    {isExiting && (
                      <div className="pointer-events-none absolute inset-0 overflow-visible rounded-2xl">
                        {PARTICLES.map((particle, index) => (
                          <span
                            key={index}
                            className="pixel-template-particle"
                            style={{
                              left: `${particle.left}%`,
                              top: `${particle.top}%`,
                              '--particle-x': `${particle.x}px`,
                              '--particle-y': `${particle.y}px`,
                              '--particle-rotate': `${particle.rotate}deg`,
                              '--particle-scale': particle.scale,
                              animationDelay: `${particle.delay}ms`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-indigo-400 to-pink-400 transition-all duration-100"
                          style={{
                            width: `${clamp(((cycleElapsed - 600) / 5200) * 100, 0, 100)}%`
                          }}
                        />
                      </div>
                      <div className="mt-1 text-[8px] font-bold text-slate-500">
                        Watch the template fill, finish, dissolve, and transform
                      </div>
                    </div>
                    <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.14em] text-indigo-300">
                      {isExiting ? 'Replacing template' : `Editing ${activeFieldLabel}`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-1.5">
                  {DEMO_SEGMENTS.map(segment => {
                    const active = activeDemoField === segment.field && !isExiting;
                    const done = cycleElapsed >= segment.start + segment.duration;
                    return (
                      <div key={segment.field} className="flex min-w-0 flex-1 items-center gap-1">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 ${
                          active ? 'bg-indigo-300 shadow-[0_0_8px_rgba(129,140,248,0.7)]'
                            : done ? 'bg-emerald-400'
                            : 'bg-white/15'
                        }`} />
                        <span className={`truncate text-[7px] font-black uppercase tracking-[0.1em] ${
                          active ? 'text-indigo-200' : done ? 'text-emerald-300/80' : 'text-slate-500'
                        }`}>{DEMO_FIELD_LABELS[segment.field]}</span>
                      </div>
                    );
                  })}
                </div>

                <style>{`
                  @keyframes pixel-template-enter {
                    0% { opacity: 0; transform: translateY(18px) scale(0.965); filter: blur(7px); }
                    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                  }

                  @keyframes pixel-template-exit {
                    0% { opacity: 1; transform: scale(1); filter: blur(0); }
                    35% { opacity: 0.9; transform: scale(0.985); filter: blur(1px); }
                    100% { opacity: 0; transform: scale(0.82); filter: blur(7px); }
                  }

                  @keyframes pixel-template-particle {
                    0% {
                      opacity: 0;
                      transform: translate3d(0, 0, 0) rotate(0deg) scale(0.35);
                    }
                    15% {
                      opacity: 1;
                    }
                    100% {
                      opacity: 0;
                      transform: translate3d(var(--particle-x), var(--particle-y), 0)
                        rotate(var(--particle-rotate))
                        scale(var(--particle-scale));
                    }
                  }

                  .pixel-template-enter {
                    animation: pixel-template-enter 650ms cubic-bezier(0.22, 1, 0.36, 1) both;
                  }

                  .pixel-template-exit {
                    animation: pixel-template-exit 900ms cubic-bezier(0.6, 0, 0.84, 1) both;
                  }

                  .pixel-template-particle {
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    border-radius: 9999px;
                    background: linear-gradient(135deg, #67E8F9 0%, #818CF8 45%, #F472B6 100%);
                    box-shadow: 0 0 10px rgba(129, 140, 248, 0.45);
                    animation: pixel-template-particle 900ms cubic-bezier(0.16, 0.8, 0.25, 1) both;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}>Inside the project</span>
          <h2 className={`mt-2 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
            One collaboration. Many creative products.
          </h2>
          <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${muted}`}>
            PixelCards can contain multiple template categories while remaining one clear partner project inside the SkillLaunch Part-Time Projects ecosystem.
          </p>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((category, index) => (
            <div key={category.title} className={`rounded-3xl border p-6 ${panel} hover:-translate-y-1 transition duration-300`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${dark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                0{index + 1}
              </div>
              <h3 className={`mt-5 text-lg font-black ${dark ? 'text-white' : 'text-slate-950'}`}>{category.title}</h3>
              <p className={`mt-2 text-xs leading-relaxed ${muted}`}>{category.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-[2rem] border p-6 sm:p-10 ${panel}`}>
          <div className="max-w-3xl">
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${dark ? 'text-pink-300' : 'text-pink-600'}`}>
              Project workflow
            </span>
            <h2 className={`mt-2 text-3xl sm:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
              From student creation to customer use.
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
              The UI describes the intended collaboration flow now; approval, partner integration, payment and royalty accounting can be connected later.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKFLOW.map(([number, title, copy]) => (
              <div key={number} className={`rounded-2xl border p-5 ${soft}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{number}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <h3 className={`mt-4 text-sm font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`mt-1.5 text-[11px] leading-relaxed ${muted}`}>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-[2rem] border p-6 sm:p-10 ${dark
          ? 'border-indigo-400/15 bg-gradient-to-r from-indigo-950/60 via-violet-950/40 to-pink-950/30'
          : 'border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-pink-50'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              ['students', 'For student creators', Users],
              ['customers', 'For customers', WandSparkles]
            ].map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSide(key)}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black border transition ${activeSide === key
                  ? dark
                    ? 'border-indigo-400/40 bg-indigo-500/15 text-white'
                    : 'border-indigo-200 bg-indigo-50 text-indigo-800'
                  : dark
                    ? 'border-white/10 bg-white/5 text-slate-400'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {activeSide === 'students' ? (
            <div className="mt-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className={`text-3xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>Build work that can outlive a single project.</h2>
                <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${muted}`}>
                  Students can take part in a PixelCards project, create high-quality reusable assets, submit them for review, and keep approved work in the collaboration ecosystem.
                </p>
              </div>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-xs font-black text-white">
                Join as Creator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className={`text-3xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>Start with a ready-made design.</h2>
                <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${muted}`}>
                  Customers can discover a design, replace supported fields, preview the result, and later hand it off to the connected PixelCards studio for final rendering.
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3.5 text-xs font-black ${dark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}>
                <Clock3 className="h-4 w-4" />
                Studio integration later
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className={`rounded-3xl border p-6 sm:p-10 text-center ${panel}`}>
          <WalletCards className={`mx-auto h-6 w-6 ${dark ? 'text-indigo-300' : 'text-indigo-600'}`} />
          <h2 className={`mt-4 text-3xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>Ready for the next collaboration layer.</h2>
          <p className={`mt-2 max-w-2xl mx-auto text-sm leading-relaxed ${muted}`}>
            This project page is intentionally separate from the Part-Time Projects hub so future partner projects can follow the same scalable structure.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/part-time-projects" className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-bold ${dark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
              Back to Collaborated Projects
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-6 py-3.5 text-sm font-black text-white">
              Join SkillLaunch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
