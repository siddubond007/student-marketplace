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

function ProfileRing({ templateIndex, initials, theme }) {
  const darkCenter = templateIndex === 1 || templateIndex === 3 || templateIndex === 4 || templateIndex === 5;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${theme.ring} p-[2px] shadow-[0_0_34px_rgba(99,102,241,0.28)]`}>
        <div className={`h-full w-full rounded-full ${darkCenter ? 'bg-[#070B16]' : 'bg-white'}`} />
      </div>
      <div className={`relative flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-full border-2 ${theme.avatarBorder} ${darkCenter ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <div className={`absolute -top-7 h-12 w-12 rounded-full blur-lg ${theme.avatarGlow}`} />
        <div className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${theme.avatarGradient} text-[11px] font-black text-white shadow-lg`}>
          {initials}
        </div>
        <span className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 ${darkCenter ? 'border-slate-900' : 'border-white'} bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]`} />
      </div>
      <div className={`absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${theme.node}`} />
    </div>
  );
}

function FieldLine({ field, icon: Icon, data, isActive, theme, size = 'normal' }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${isActive ? 'text-white' : ''}`}>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${theme.iconShell}`}>
        <Icon className={`h-2.5 w-2.5 ${theme.icon}`} />
      </span>
      <span className={`min-w-0 truncate font-semibold ${size === 'small' ? 'text-[9px]' : 'text-[10px]'} ${theme.body}`}>
        {data || '\u00A0'}
        {isActive && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-current opacity-80" />}
      </span>
    </div>
  );
}

function BusinessCardTemplate({ templateIndex, data, activeField, isTyping }) {
  const themes = [
    {
      shell: 'bg-gradient-to-br from-white via-sky-50 to-cyan-100 text-slate-950 border-sky-200',
      body: 'text-slate-600',
      muted: 'text-slate-500',
      brand: 'text-slate-950',
      accentText: 'text-sky-700',
      line: 'bg-sky-500',
      icon: 'text-sky-700',
      iconShell: 'bg-sky-500/10 border-sky-200',
      ring: 'from-sky-400 via-cyan-400 to-indigo-500',
      avatarGradient: 'from-sky-500 to-indigo-600',
      avatarBorder: 'border-white/80',
      avatarGlow: 'bg-sky-400/30',
      node: 'bg-cyan-300',
      badge: 'bg-sky-600 text-white',
      label: 'THYNK SKY'
    },
    {
      shell: 'bg-gradient-to-br from-[#050816] via-[#17153A] to-[#3A104B] text-white border-indigo-400/30',
      body: 'text-slate-200',
      muted: 'text-indigo-200/60',
      brand: 'text-white',
      accentText: 'text-fuchsia-300',
      line: 'bg-fuchsia-400',
      icon: 'text-fuchsia-200',
      iconShell: 'bg-white/5 border-white/10',
      ring: 'from-cyan-300 via-indigo-400 to-fuchsia-400',
      avatarGradient: 'from-fuchsia-500 to-violet-600',
      avatarBorder: 'border-white/15',
      avatarGlow: 'bg-fuchsia-400/25',
      node: 'bg-cyan-300',
      badge: 'bg-fuchsia-400 text-slate-950',
      label: 'NOVA PULSE'
    },
    {
      shell: 'bg-gradient-to-br from-amber-50 via-white to-violet-100 text-slate-950 border-violet-200',
      body: 'text-slate-600',
      muted: 'text-slate-500',
      brand: 'text-slate-950',
      accentText: 'text-violet-700',
      line: 'bg-violet-600',
      icon: 'text-violet-700',
      iconShell: 'bg-violet-500/10 border-violet-200',
      ring: 'from-violet-500 via-fuchsia-400 to-amber-300',
      avatarGradient: 'from-violet-600 to-fuchsia-500',
      avatarBorder: 'border-white',
      avatarGlow: 'bg-violet-400/25',
      node: 'bg-amber-300',
      badge: 'bg-violet-600 text-white',
      label: 'PIXEL PRISM'
    },
    {
      shell: 'bg-gradient-to-br from-[#04131A] via-[#082832] to-[#071A31] text-white border-cyan-300/25',
      body: 'text-cyan-50',
      muted: 'text-cyan-200/55',
      brand: 'text-white',
      accentText: 'text-cyan-200',
      line: 'bg-cyan-300',
      icon: 'text-cyan-200',
      iconShell: 'bg-cyan-300/10 border-cyan-200/20',
      ring: 'from-cyan-300 via-emerald-300 to-blue-500',
      avatarGradient: 'from-cyan-400 to-emerald-500',
      avatarBorder: 'border-cyan-200/30',
      avatarGlow: 'bg-cyan-300/20',
      node: 'bg-emerald-300',
      badge: 'bg-cyan-300 text-slate-950',
      label: 'CYBER GLASS'
    },
    {
      shell: 'bg-gradient-to-br from-[#160915] via-[#26112E] to-[#42112B] text-white border-pink-300/25',
      body: 'text-pink-50',
      muted: 'text-pink-100/55',
      brand: 'text-white',
      accentText: 'text-pink-200',
      line: 'bg-orange-300',
      icon: 'text-pink-200',
      iconShell: 'bg-pink-400/10 border-pink-200/20',
      ring: 'from-pink-400 via-orange-300 to-violet-500',
      avatarGradient: 'from-orange-400 to-pink-500',
      avatarBorder: 'border-pink-200/20',
      avatarGlow: 'bg-pink-400/20',
      node: 'bg-orange-300',
      badge: 'bg-pink-400 text-slate-950',
      label: 'ORBIT NEON'
    },
    {
      shell: 'bg-gradient-to-br from-[#070A0C] via-[#11171B] to-[#1D2528] text-white border-lime-300/20',
      body: 'text-slate-200',
      muted: 'text-slate-400',
      brand: 'text-white',
      accentText: 'text-lime-200',
      line: 'bg-lime-300',
      icon: 'text-lime-200',
      iconShell: 'bg-lime-300/10 border-lime-200/20',
      ring: 'from-lime-300 via-white to-cyan-300',
      avatarGradient: 'from-lime-300 to-emerald-500',
      avatarBorder: 'border-lime-200/25',
      avatarGlow: 'bg-lime-300/15',
      node: 'bg-lime-300',
      badge: 'bg-lime-300 text-slate-950',
      label: 'QUANTUM MONO'
    }
  ];

  const theme = themes[templateIndex % themes.length];
  const isActive = field => isTyping && activeField === field;
  const initials = data.name.split(' ').map(part => part[0]).slice(0, 2).join('');
  const dark = templateIndex === 1 || templateIndex === 3 || templateIndex === 4 || templateIndex === 5;

  if (templateIndex === 0) {
    return (
      <div className={`relative aspect-[1.58/1] overflow-hidden rounded-2xl border shadow-xl ${theme.shell}`}>
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute -left-16 bottom-[-3rem] h-32 w-64 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-28 w-1/2 rounded-tl-[5rem] bg-gradient-to-r from-cyan-300/25 to-sky-500/35" />
        <div className="relative flex h-full p-5">
          <div className="flex min-w-0 flex-1 flex-col pr-3">
            <div className="flex items-start justify-between">
              <div>
                <div className={`text-[8px] font-black uppercase tracking-[0.25em] ${theme.accentText}`}>{theme.label}</div>
                <div className={`mt-1 text-[6px] font-bold uppercase tracking-[0.16em] ${theme.muted}`}>Creative identity / 01</div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[6px] font-black uppercase tracking-[0.14em] ${theme.badge}`}>SMART</span>
            </div>
            <div className="mt-7">
              <div className={`h-1 w-16 rounded-full ${theme.line}`} />
              <div className={`mt-3 min-h-[2rem] text-[clamp(1rem,3.35vw,1.7rem)] font-black leading-none tracking-tight ${theme.brand}`}>
                {data.name || '\u00A0'}{isActive('name') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-sky-600" />}
              </div>
              <div className={`mt-1 text-[clamp(0.55rem,1.7vw,0.8rem)] font-semibold ${theme.accentText}`}>
                {data.role || '\u00A0'}{isActive('role') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-sky-600" />}
              </div>
            </div>
            <div className="mt-auto grid gap-1.5">
              <FieldLine field="phone" icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} />
              <FieldLine field="email" icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
              <FieldLine field="address" icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
            </div>
          </div>
          <div className="relative flex w-[31%] min-w-[82px] flex-col items-end justify-center">
            <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
            <div className={`mt-1 text-center text-[6px] font-black uppercase tracking-[0.16em] ${theme.muted}`}>Verified Creator</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 1) {
    return (
      <div className={`relative aspect-[1.58/1] overflow-hidden rounded-2xl border shadow-2xl ${theme.shell}`}>
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_15%_20%,rgba(129,140,248,.22),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(236,72,153,.16),transparent_28%)]" />
        <div className="absolute -left-12 top-8 h-40 w-40 rounded-full border border-indigo-300/15" />
        <div className="absolute left-4 top-12 h-32 w-32 rounded-full border border-fuchsia-300/10" />
        <div className="absolute -right-8 bottom-[-2rem] h-44 w-44 rounded-full border-[18px] border-fuchsia-400/10" />
        <div className="relative flex h-full p-5">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-[8px] font-black uppercase tracking-[0.26em] ${theme.accentText}`}>{theme.label}</div>
                <div className={`mt-1 text-[6px] uppercase tracking-[0.18em] ${theme.muted}`}>Ideas that move</div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[6px] font-black uppercase ${theme.badge}`}>02 / 06</span>
            </div>
            <div className="mt-8 max-w-[68%]">
              <div className={`text-[clamp(1.05rem,3.25vw,1.7rem)] font-black tracking-tight ${theme.brand}`}>
                {data.name || '\u00A0'}{isActive('name') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-fuchsia-300" />}
              </div>
              <div className={`mt-1 text-[clamp(0.56rem,1.7vw,0.8rem)] font-semibold ${theme.accentText}`}>
                {data.role || '\u00A0'}{isActive('role') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-fuchsia-300" />}
              </div>
            </div>
            <div className="mt-auto grid w-[68%] gap-1.5">
              <FieldLine field="phone" icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
              <FieldLine field="email" icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
              <FieldLine field="address" icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
            </div>
          </div>
          <div className="relative flex w-[31%] min-w-[82px] items-center justify-center">
            <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
            <div className="absolute bottom-2 right-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[6px] font-black uppercase tracking-[0.14em] text-fuchsia-200">Neon ID</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 2) {
    return (
      <div className={`relative aspect-[1.58/1] overflow-hidden rounded-2xl border shadow-xl ${theme.shell}`}>
        <div className="absolute right-0 top-0 h-full w-[38%] bg-gradient-to-b from-amber-200/20 via-transparent to-violet-300/30" />
        <div className="absolute right-[-2rem] bottom-[-3rem] h-40 w-64 rotate-[-12deg] rounded-tl-[6rem] bg-gradient-to-r from-violet-500/15 to-amber-300/20" />
        <div className="absolute right-8 top-6 h-8 w-28 rounded-full bg-gradient-to-r from-violet-500/15 to-amber-300/25 blur-xl" />
        <div className="relative flex h-full p-5">
          <div className="flex min-w-0 flex-1 flex-col pr-2">
            <div className="flex items-start justify-between">
              <div>
                <div className={`text-[8px] font-black uppercase tracking-[0.24em] ${theme.accentText}`}>{theme.label}</div>
                <div className={`mt-1 text-[6px] font-bold uppercase tracking-[0.16em] ${theme.muted}`}>Design / brand / digital</div>
              </div>
              <div className="h-2 w-8 rounded-full bg-gradient-to-r from-violet-600 to-pink-500" />
            </div>
            <div className="mt-9">
              <div className={`text-[clamp(1.08rem,3.35vw,1.75rem)] font-black tracking-tight ${theme.brand}`}>
                {data.name || '\u00A0'}{isActive('name') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-violet-600" />}
              </div>
              <div className={`mt-1 text-[clamp(0.56rem,1.68vw,0.8rem)] font-semibold ${theme.accentText}`}>
                {data.role || '\u00A0'}{isActive('role') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-violet-600" />}
              </div>
            </div>
            <div className="mt-auto grid gap-1.5">
              <FieldLine field="phone" icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
              <FieldLine field="email" icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
              <FieldLine field="address" icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
            </div>
          </div>
          <div className="relative flex w-[34%] min-w-[94px] flex-col items-center justify-center">
            <div className="absolute top-3 h-28 w-28 rounded-full border border-violet-300/30" />
            <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
            <span className={`mt-1 rounded-full border px-2 py-1 text-[6px] font-black uppercase tracking-[0.12em] ${theme.chip || 'border-violet-200 bg-white/50 text-violet-700'}`}>Verified</span>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 3) {
    return (
      <div className={`relative aspect-[1.58/1] overflow-hidden rounded-2xl border shadow-2xl ${theme.shell}`}>
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(103,232,249,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.08)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full border-[16px] border-cyan-300/10" />
        <div className="absolute right-12 top-10 h-20 w-20 rounded-full border border-cyan-300/20" />
        <div className="absolute left-0 bottom-0 h-20 w-1/2 skew-x-[-25deg] bg-cyan-300/5" />
        <div className="relative flex h-full p-5">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-[8px] font-black uppercase tracking-[0.3em] ${theme.accentText}`}>{theme.label}</div>
                <div className={`mt-1 text-[6px] uppercase tracking-[0.18em] ${theme.muted}`}>Tech / AI / innovation</div>
              </div>
              <div className="text-[7px] font-black uppercase tracking-[0.18em] text-cyan-300/70">GRID 04</div>
            </div>
            <div className="mt-7">
              <div className={`text-[clamp(1rem,3.2vw,1.65rem)] font-black tracking-tight ${theme.brand}`}>
                {data.name || '\u00A0'}{isActive('name') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-cyan-300" />}
              </div>
              <div className={`mt-1 text-[clamp(0.56rem,1.65vw,0.78rem)] font-semibold ${theme.accentText}`}>
                {data.role || '\u00A0'}{isActive('role') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-cyan-300" />}
              </div>
            </div>
            <div className="mt-auto grid w-[74%] gap-1.5">
              <FieldLine field="phone" icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
              <FieldLine field="email" icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
              <FieldLine field="address" icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
            </div>
          </div>
          <div className="relative flex w-[29%] min-w-[86px] items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full border border-cyan-300/10" />
            <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 4) {
    return (
      <div className={`relative aspect-[1.58/1] overflow-hidden rounded-2xl border shadow-2xl ${theme.shell}`}>
        <div className="absolute -right-10 -top-8 h-44 w-44 rounded-full bg-pink-400/15 blur-3xl" />
        <div className="absolute left-[-2rem] bottom-[-4rem] h-32 w-72 rounded-full bg-orange-300/10 blur-2xl" />
        <div className="absolute right-20 top-12 h-24 w-24 rounded-full border border-pink-300/15" />
        <div className="absolute right-16 top-8 h-32 w-32 rounded-full border border-orange-300/10" />
        <div className="relative flex h-full p-5">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between">
              <div>
                <div className={`text-[8px] font-black uppercase tracking-[0.25em] ${theme.accentText}`}>{theme.label}</div>
                <div className={`mt-1 text-[6px] uppercase tracking-[0.18em] ${theme.muted}`}>People / ideas / growth</div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[6px] font-black uppercase tracking-[0.14em] ${theme.badge}`}>05</span>
            </div>
            <div className="mt-7">
              <div className={`text-[clamp(1rem,3.25vw,1.7rem)] font-black tracking-tight ${theme.brand}`}>
                {data.name || '\u00A0'}{isActive('name') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-orange-300" />}
              </div>
              <div className={`mt-1 text-[clamp(0.56rem,1.65vw,0.78rem)] font-semibold ${theme.accentText}`}>
                {data.role || '\u00A0'}{isActive('role') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-orange-300" />}
              </div>
            </div>
            <div className="mt-auto grid gap-1.5">
              <FieldLine field="phone" icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
              <FieldLine field="email" icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
              <FieldLine field="address" icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
            </div>
          </div>
          <div className="relative flex w-[35%] min-w-[94px] items-center justify-center">
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 160 180" aria-hidden="true">
              <ellipse cx="80" cy="90" rx="58" ry="22" fill="none" stroke="rgba(251,146,60,.45)" strokeWidth="1.5" transform="rotate(-18 80 90)" />
              <circle cx="80" cy="90" r="68" fill="none" stroke="rgba(236,72,153,.16)" strokeWidth="1" />
              <circle cx="30" cy="73" r="4" fill="#FDBA74" />
              <circle cx="128" cy="106" r="4" fill="#F9A8D4" />
            </svg>
            <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-[1.58/1] overflow-hidden rounded-2xl border shadow-2xl ${theme.shell}`}>
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(135deg,rgba(163,230,53,.08)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute right-[-3rem] bottom-[-3rem] h-44 w-44 rounded-full border-[16px] border-lime-300/10" />
      <div className="absolute right-10 top-8 h-24 w-24 rounded-full border border-lime-300/15" />
      <div className="absolute left-0 bottom-0 h-px w-full bg-lime-300/40" />
      <div className="relative flex h-full p-5">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-[8px] font-black uppercase tracking-[0.28em] ${theme.accentText}`}>{theme.label}</div>
              <div className={`mt-1 text-[6px] uppercase tracking-[0.18em] ${theme.muted}`}>Strategy / product / scale</div>
            </div>
            <span className={`rounded-full px-2 py-1 text-[6px] font-black uppercase tracking-[0.14em] ${theme.badge}`}>QNTM</span>
          </div>
          <div className="mt-7">
            <div className={`text-[clamp(1rem,3.25vw,1.7rem)] font-black tracking-tight ${theme.brand}`}>
              {data.name || '\u00A0'}{isActive('name') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-lime-300" />}
            </div>
            <div className={`mt-1 text-[clamp(0.56rem,1.65vw,0.78rem)] font-semibold ${theme.accentText}`}>
              {data.role || '\u00A0'}{isActive('role') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-lime-300" />}
            </div>
          </div>
          <div className="mt-auto grid w-[70%] gap-1.5">
            <FieldLine field="phone" icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
            <FieldLine field="email" icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
            <FieldLine field="address" icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
          </div>
        </div>
        <div className="relative flex w-[32%] min-w-[90px] items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full border border-lime-300/20" />
          <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
          <div className={`absolute bottom-3 right-0 rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-1 text-[6px] font-black uppercase tracking-[0.14em] ${theme.accentText}`}>Verified Creator</div>
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
