import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Layers3,
  Palette,
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
  const textColor = templateIndex === 1 ? '#F8FAFC' : '#172033';
  const mutedColor = templateIndex === 1 ? '#CBD5E1' : '#5B6B7C';

  const showCursor = field => isTyping && activeField === field;

  if (templateIndex === 1) {
    return (
      <svg viewBox="0 0 1200 760" className="block h-auto w-full" role="img" aria-label="Animated visiting card template">
        <defs>
          <linearGradient id="pixelCardDark" x1="70" y1="40" x2="1150" y2="710" gradientUnits="userSpaceOnUse">
            <stop stopColor="#101426" />
            <stop offset="0.52" stopColor="#3730A3" />
            <stop offset="1" stopColor="#BE185D" />
          </linearGradient>
          <linearGradient id="pixelGlowDark" x1="180" y1="620" x2="1010" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22D3EE" stopOpacity="0.1" />
            <stop offset="1" stopColor="#C084FC" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="760" rx="28" fill="url(#pixelCardDark)" />
        <circle cx="1020" cy="145" r="120" fill="#FFFFFF" fillOpacity="0.08" />
        <circle cx="1020" cy="145" r="72" fill="#FFFFFF" fillOpacity="0.05" />
        <path d="M0 618C220 538 390 720 615 644C782 587 876 459 1200 500V760H0V618Z" fill="url(#pixelGlowDark)" />
        <path d="M0 676C260 606 426 762 694 671C886 606 985 526 1200 570V760H0V676Z" fill="#020617" fillOpacity="0.42" />
        <rect x="72" y="72" width="158" height="6" rx="3" fill="#A5B4FC" />
        <text x="72" y="126" fill={textColor} fontFamily="Inter, Arial, sans-serif" fontSize="27" fontWeight="800" letterSpacing="2.4">NOVA STUDIO</text>
        <text x="72" y="174" fill="#C7D2FE" fontFamily="Inter, Arial, sans-serif" fontSize="15" fontWeight="700" letterSpacing="2.8">CREATIVE BUSINESS CARD</text>

        <text x="72" y="337" fill={textColor} fontFamily="Inter, Arial, sans-serif" fontSize="56" fontWeight="850">{data.name}</text>
        {showCursor('name') && <rect x={72 + Math.max(15, data.name.length * 29)} y="288" width="3" height="58" rx="1.5" fill="#C4B5FD" />}
        <text x="72" y="382" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="24" fontWeight="600">{data.role}</text>
        {showCursor('role') && <rect x={72 + Math.max(15, data.role.length * 12.5)} y="354" width="3" height="34" rx="1.5" fill="#C4B5FD" />}

        <line x1="72" y1="422" x2="380" y2="422" stroke="#C4B5FD" strokeOpacity="0.5" strokeWidth="3" />
        <circle cx="90" cy="485" r="15" fill="#C4B5FD" fillOpacity="0.18" />
        <circle cx="90" cy="545" r="15" fill="#C4B5FD" fillOpacity="0.18" />
        <circle cx="90" cy="605" r="15" fill="#C4B5FD" fillOpacity="0.18" />
        <text x="122" y="492" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="600">{data.phone}</text>
        {showCursor('phone') && <rect x={122 + Math.max(10, data.phone.length * 9)} y="469" width="2" height="24" rx="1" fill="#C4B5FD" />}
        <text x="122" y="552" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="600">{data.email}</text>
        {showCursor('email') && <rect x={122 + Math.max(10, data.email.length * 8.4)} y="529" width="2" height="24" rx="1" fill="#C4B5FD" />}
        <text x="122" y="612" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="17" fontWeight="600">{data.address}</text>
        {showCursor('address') && <rect x={122 + Math.max(10, data.address.length * 7.9)} y="590" width="2" height="23" rx="1" fill="#C4B5FD" />}
        <text x="900" y="692" fill="#E0E7FF" fillOpacity="0.7" fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="700" letterSpacing="2">EDITABLE • REUSABLE • PRINT-READY</text>
      </svg>
    );
  }

  if (templateIndex === 2) {
    return (
      <svg viewBox="0 0 1200 760" className="block h-auto w-full" role="img" aria-label="Animated visiting card template">
        <defs>
          <linearGradient id="pixelCardViolet" x1="0" y1="0" x2="1200" y2="760" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF7ED" />
            <stop offset="0.5" stopColor="#F5F3FF" />
            <stop offset="1" stopColor="#EDE9FE" />
          </linearGradient>
          <linearGradient id="pixelRibbon" x1="620" y1="610" x2="1180" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#DB2777" />
          </linearGradient>
        </defs>
        <rect width="1200" height="760" rx="28" fill="url(#pixelCardViolet)" />
        <circle cx="1042" cy="116" r="88" fill="#7C3AED" fillOpacity="0.08" />
        <circle cx="1042" cy="116" r="54" fill="#DB2777" fillOpacity="0.12" />
        <path d="M630 760C716 648 844 620 986 632C1070 639 1131 620 1200 570V760H630Z" fill="url(#pixelRibbon)" opacity="0.95" />
        <path d="M764 760C850 694 940 680 1045 689C1114 695 1158 676 1200 642V760H764Z" fill="#312E81" opacity="0.88" />
        <text x="76" y="110" fill={textColor} fontFamily="Inter, Arial, sans-serif" fontSize="23" fontWeight="850" letterSpacing="2.2">PIXEL HOUSE</text>
        <text x="76" y="145" fill="#7C3AED" fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="800" letterSpacing="2.5">DESIGN • BRAND • DIGITAL</text>
        <rect x="76" y="192" width="118" height="8" rx="4" fill="#7C3AED" />
        <rect x="76" y="208" width="68" height="5" rx="2.5" fill="#DB2777" />
        <text x="76" y="350" fill={textColor} fontFamily="Inter, Arial, sans-serif" fontSize="56" fontWeight="850">{data.name}</text>
        {showCursor('name') && <rect x={76 + Math.max(15, data.name.length * 29)} y="301" width="3" height="58" rx="1.5" fill="#7C3AED" />}
        <text x="76" y="394" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="23" fontWeight="650">{data.role}</text>
        {showCursor('role') && <rect x={76 + Math.max(15, data.role.length * 12)} y="367" width="3" height="34" rx="1.5" fill="#7C3AED" />}

        <g fill="#7C3AED" fillOpacity="0.88">
          <circle cx="92" cy="492" r="6" />
          <circle cx="92" cy="548" r="6" />
          <circle cx="92" cy="604" r="6" />
        </g>
        <text x="116" y="499" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="600">{data.phone}</text>
        {showCursor('phone') && <rect x={116 + Math.max(10, data.phone.length * 9)} y="476" width="2" height="24" rx="1" fill="#7C3AED" />}
        <text x="116" y="555" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="600">{data.email}</text>
        {showCursor('email') && <rect x={116 + Math.max(10, data.email.length * 8.4)} y="532" width="2" height="24" rx="1" fill="#7C3AED" />}
        <text x="116" y="611" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="17" fontWeight="600">{data.address}</text>
        {showCursor('address') && <rect x={116 + Math.max(10, data.address.length * 7.8)} y="589" width="2" height="23" rx="1" fill="#7C3AED" />}
        <text x="812" y="88" fill="#312E81" fontFamily="Inter, Arial, sans-serif" fontSize="15" fontWeight="800" letterSpacing="2.2">CREATIVE PROFILE</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 1200 760" className="block h-auto w-full" role="img" aria-label="Animated visiting card template">
      <defs>
        <linearGradient id="pixelCardLight" x1="0" y1="0" x2="1200" y2="760" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FBFF" />
          <stop offset="0.58" stopColor="#F3F8FC" />
          <stop offset="1" stopColor="#E8F4FA" />
        </linearGradient>
        <linearGradient id="pixelWave" x1="780" y1="640" x2="1140" y2="560" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8FD3F4" />
          <stop offset="1" stopColor="#0B84C5" />
        </linearGradient>
      </defs>
      <rect width="1200" height="760" rx="28" fill="url(#pixelCardLight)" />
      <circle cx="1044" cy="116" r="92" fill="#0B84C5" fillOpacity="0.08" />
      <circle cx="1044" cy="116" r="58" fill="#0B84C5" fillOpacity="0.08" />
      <path d="M700 760C776 652 882 610 1008 624C1088 634 1146 612 1200 574V760H700Z" fill="url(#pixelWave)" />
      <path d="M840 760C916 694 1000 672 1076 682C1120 688 1158 670 1200 644V760H840Z" fill="#143857" opacity="0.9" />
      <text x="76" y="110" fill={textColor} fontFamily="Inter, Arial, sans-serif" fontSize="24" fontWeight="850" letterSpacing="2.4">THYNK UNLIMITED</text>
      <text x="76" y="144" fill="#6B7C8C" fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="800" letterSpacing="2.4">PROFESSIONAL BUSINESS CARD</text>
      <rect x="76" y="191" width="148" height="7" rx="3.5" fill="#0B84C5" />
      <text x="76" y="349" fill={textColor} fontFamily="Inter, Arial, sans-serif" fontSize="56" fontWeight="850">{data.name}</text>
      {showCursor('name') && <rect x={76 + Math.max(15, data.name.length * 29)} y="300" width="3" height="58" rx="1.5" fill="#0B84C5" />}
      <text x="76" y="392" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="23" fontWeight="650">{data.role}</text>
      {showCursor('role') && <rect x={76 + Math.max(15, data.role.length * 12)} y="365" width="3" height="34" rx="1.5" fill="#0B84C5" />}

      <circle cx="93" cy="490" r="15" fill="#0B84C5" fillOpacity="0.1" />
      <circle cx="93" cy="547" r="15" fill="#0B84C5" fillOpacity="0.1" />
      <circle cx="93" cy="604" r="15" fill="#0B84C5" fillOpacity="0.1" />
      <text x="118" y="497" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="600">{data.phone}</text>
      {showCursor('phone') && <rect x={118 + Math.max(10, data.phone.length * 9)} y="474" width="2" height="24" rx="1" fill="#0B84C5" />}
      <text x="118" y="554" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="600">{data.email}</text>
      {showCursor('email') && <rect x={118 + Math.max(10, data.email.length * 8.4)} y="531" width="2" height="24" rx="1" fill="#0B84C5" />}
      <text x="118" y="611" fill={mutedColor} fontFamily="Inter, Arial, sans-serif" fontSize="17" fontWeight="600">{data.address}</text>
      {showCursor('address') && <rect x={118 + Math.max(10, data.address.length * 7.8)} y="588" width="2" height="23" rx="1" fill="#0B84C5" />}
      <text x="874" y="90" fill="#0B84C5" fontFamily="Inter, Arial, sans-serif" fontSize="15" fontWeight="800" letterSpacing="2.2">SMART TEMPLATE</text>
    </svg>
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
  const activeSegment = [...DEMO_SEGMENTS].reverse().find(segment => cycleElapsed >= segment.start) || DEMO_SEGMENTS[0];
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
                      <span className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300">Live template demo</span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">Type • replace • publish</span>
                  </div>

                  <div className="relative overflow-visible">
                    <div
                      key={demoIndex}
                      className={`relative overflow-hidden rounded-2xl ${isEntering ? 'pixel-template-enter' : ''} ${isExiting ? 'pixel-template-exit' : ''}`}
                    >
                      <BusinessCardTemplate
                        templateIndex={demoIndex % 3}
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
                        Template fields are typed automatically • card dissolves into particles • next design loads
                      </div>
                    </div>
                    <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.14em] text-indigo-300">
                      {isExiting ? 'Replacing template' : `Editing ${activeFieldLabel}`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {DEMO_SEGMENTS.map(segment => {
                    const label = DEMO_FIELD_LABELS[segment.field];
                    const done = cycleElapsed >= segment.start + segment.duration;
                    const active = activeDemoField === segment.field && !isExiting;
                    return (
                      <div
                        key={segment.field}
                        className={`rounded-xl border px-2.5 py-2 transition-all duration-300 ${
                          active
                            ? 'border-indigo-400/40 bg-indigo-500/10 ring-1 ring-indigo-400/20'
                            : dark
                              ? 'border-white/10 bg-white/5'
                              : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className={`text-[7px] uppercase tracking-wider font-black ${
                          active ? 'text-indigo-300' : muted
                        }`}>{label}</div>
                        <div className={`mt-1 text-[8px] font-bold ${
                          done ? dark ? 'text-emerald-300' : 'text-emerald-600'
                            : dark ? 'text-slate-200' : 'text-slate-700'
                        }`}>{done ? 'Updated' : 'Typing'}</div>
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
