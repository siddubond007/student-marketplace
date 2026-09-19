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
    email: 'aarav@thynkstudio.in',
    address: 'Bengaluru, Karnataka, India'
  },
  {
    name: 'Ishita Rao',
    role: 'Brand Strategist',
    phone: '+91 98765 43210',
    email: 'ishita@novacreative.in',
    address: 'Hyderabad, Telangana, India'
  },
  {
    name: 'Kiran Varma',
    role: 'Founder & Designer',
    phone: '+91 91234 56789',
    email: 'kiran@pixelhouse.in',
    address: 'Bengaluru, Karnataka, India'
  },
  {
    name: 'Rohit Sen',
    role: 'Product Developer',
    phone: '+91 99887 76655',
    email: 'rohit@cyberlabs.dev',
    address: 'Pune, Maharashtra, India'
  },
  {
    name: 'Sneha Kapoor',
    role: 'UI/UX Designer',
    phone: '+91 99887 77665',
    email: 'sneha@orbitstudio.in',
    address: 'Delhi, India'
  },
  {
    name: 'Aditya Nair',
    role: 'Full Stack Developer',
    phone: '+91 70123 45678',
    email: 'aditya@quantumworks.io',
    address: 'Chennai, Tamil Nadu, India'
  },
  {
    name: 'Priyansh Kumar',
    role: 'AI/ML Engineer',
    phone: '+91 99876 54321',
    email: 'priyansh@skilllaunch.in',
    address: 'Noida, Uttar Pradesh, India'
  },
  {
    name: 'Meera Iyer',
    role: 'Content Creator',
    phone: '+91 98765 12345',
    email: 'meera@wanderwork.in',
    address: 'Kerala, India'
  },
  {
    name: 'Arjun Das',
    role: 'Game Developer',
    phone: '+91 98765 66778',
    email: 'arjun@nextgen.dev',
    address: 'Mumbai, Maharashtra, India'
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

function ProfileRing({ templateIndex, initials, theme, size = 'normal' }) {
  const compact = size === 'compact';
  const darkCenter = [1, 2, 3, 6, 8].includes(templateIndex);
  const styles = [
    { ring: 'from-cyan-400 via-sky-400 to-indigo-500', bg: 'from-sky-100 to-cyan-200', face: 'bg-amber-200', hair: 'bg-slate-900', shirt: 'bg-sky-500', glow: 'bg-cyan-300/30' },
    { ring: 'from-cyan-300 via-violet-400 to-fuchsia-500', bg: 'from-slate-800 to-indigo-950', face: 'bg-amber-100', hair: 'bg-slate-950', shirt: 'bg-fuchsia-500', glow: 'bg-fuchsia-400/25' },
    { ring: 'from-amber-300 via-orange-400 to-violet-500', bg: 'from-stone-800 to-[#261A0D]', face: 'bg-orange-200', hair: 'bg-stone-950', shirt: 'bg-amber-500', glow: 'bg-amber-300/25' },
    { ring: 'from-cyan-300 via-teal-300 to-blue-500', bg: 'from-slate-700 to-cyan-950', face: 'bg-amber-200', hair: 'bg-slate-950', shirt: 'bg-cyan-500', glow: 'bg-cyan-300/25' },
    { ring: 'from-pink-300 via-fuchsia-400 to-violet-500', bg: 'from-rose-50 to-amber-50', face: 'bg-rose-200', hair: 'bg-stone-700', shirt: 'bg-pink-500', glow: 'bg-pink-400/25' },
    { ring: 'from-sky-300 via-violet-400 to-pink-400', bg: 'from-violet-50 to-cyan-50', face: 'bg-amber-200', hair: 'bg-slate-800', shirt: 'bg-violet-500', glow: 'bg-violet-400/25' },
    { ring: 'from-indigo-300 via-blue-400 to-violet-500', bg: 'from-slate-800 to-indigo-950', face: 'bg-amber-200', hair: 'bg-slate-950', shirt: 'bg-indigo-500', glow: 'bg-indigo-400/25' },
    { ring: 'from-amber-300 via-pink-300 to-violet-400', bg: 'from-orange-50 to-rose-50', face: 'bg-amber-200', hair: 'bg-stone-700', shirt: 'bg-orange-400', glow: 'bg-amber-300/25' },
    { ring: 'from-cyan-300 via-white to-violet-400', bg: 'from-slate-800 to-violet-950', face: 'bg-amber-200', hair: 'bg-slate-950', shirt: 'bg-cyan-400', glow: 'bg-cyan-300/25' }
  ];
  const style = styles[templateIndex % styles.length];

  return (
    <div className={`relative flex ${compact ? 'h-20 w-20' : 'h-28 w-28'} items-center justify-center`}>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.ring} p-[2px] ${compact ? 'shadow-[0_0_24px_rgba(99,102,241,0.26)]' : 'shadow-[0_0_38px_rgba(99,102,241,0.3)]'}`}>
        <div className={`h-full w-full rounded-full ${darkCenter ? 'bg-[#070B16]' : 'bg-white'}`} />
      </div>

      <div className={`absolute inset-[7px] rounded-full border ${darkCenter ? 'border-white/10' : 'border-slate-900/10'}`} />

      <div className={`relative ${compact ? 'h-14 w-14' : 'h-[78px] w-[78px]'} overflow-hidden rounded-full border-2 ${theme.avatarBorder || 'border-white/70'} bg-gradient-to-b ${style.bg}`}>
        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 ${compact ? 'h-9 w-9' : 'h-12 w-12'} rounded-full blur-xl ${style.glow}`} />
        <div className={`absolute left-1/2 top-[17%] -translate-x-1/2 ${compact ? 'h-4 w-4' : 'h-6 w-6'} rounded-full ${style.hair}`} />
        <div className={`absolute left-1/2 top-[25%] -translate-x-1/2 ${compact ? 'h-4 w-4' : 'h-6 w-6'} rounded-full ${style.face} shadow-sm`} />
        <div className={`absolute left-1/2 top-[42%] -translate-x-1/2 ${compact ? 'h-8 w-7' : 'h-12 w-10'} rounded-t-[48%] rounded-b-[34%] ${style.face}`} />
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${compact ? 'h-5 w-12' : 'h-7 w-16'} rounded-t-[55%] ${style.shirt}`} />
        <div className={`absolute left-1/2 top-[56%] -translate-x-1/2 ${compact ? 'w-7 text-[4px]' : 'w-10 text-[5px]'} truncate text-center font-black text-white/80`}>{initials}</div>
      </div>

      <span className={`absolute bottom-2 right-2 ${compact ? 'h-3 w-3' : 'h-4 w-4'} rounded-full border-2 ${darkCenter ? 'border-slate-900' : 'border-white'} bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]`} />
      <div className={`absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${theme.node}`} />
    </div>
  );
}

function FieldLine({ icon: Icon, data, isActive, theme, size = 'normal' }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${isActive ? 'brightness-110' : ''}`}>
      <span className={`flex ${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'} shrink-0 items-center justify-center rounded-full border ${theme.iconShell}`}>
        <Icon className={`${size === 'small' ? 'h-2 w-2' : 'h-2.5 w-2.5'} ${theme.icon}`} />
      </span>
      <span className={`min-w-0 truncate font-semibold ${size === 'small' ? 'text-[8.5px]' : 'text-[9.5px]'} ${theme.body}`}>
        {data || '\u00A0'}
        {isActive && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-current opacity-80" />}
      </span>
    </div>
  );
}

function TemplateShell({ templateIndex, data, activeField, isTyping, children, className = '' }) {
  const themes = [
    { ring: 'from-sky-400 via-cyan-300 to-indigo-500', avatarGradient: 'from-sky-500 to-indigo-600', avatarBorder: 'border-white/80', avatarGlow: 'bg-sky-400/30', node: 'bg-cyan-300', iconShell: 'bg-sky-500/10 border-sky-200', icon: 'text-sky-700', body: 'text-slate-700' },
    { ring: 'from-cyan-300 via-indigo-400 to-fuchsia-400', avatarGradient: 'from-fuchsia-500 to-violet-600', avatarBorder: 'border-white/15', avatarGlow: 'bg-fuchsia-400/25', node: 'bg-cyan-300', iconShell: 'bg-white/5 border-white/10', icon: 'text-fuchsia-200', body: 'text-slate-100' },
    { ring: 'from-amber-300 via-orange-400 to-violet-500', avatarGradient: 'from-amber-500 to-rose-500', avatarBorder: 'border-white/20', avatarGlow: 'bg-amber-300/25', node: 'bg-amber-300', iconShell: 'bg-amber-300/10 border-amber-200/20', icon: 'text-amber-100', body: 'text-stone-100' },
    { ring: 'from-cyan-300 via-teal-300 to-blue-500', avatarGradient: 'from-cyan-400 to-teal-500', avatarBorder: 'border-cyan-200/30', avatarGlow: 'bg-cyan-300/20', node: 'bg-emerald-300', iconShell: 'bg-cyan-300/10 border-cyan-200/20', icon: 'text-cyan-200', body: 'text-cyan-50' },
    { ring: 'from-pink-300 via-fuchsia-400 to-violet-500', avatarGradient: 'from-pink-500 to-violet-600', avatarBorder: 'border-white', avatarGlow: 'bg-pink-400/20', node: 'bg-pink-300', iconShell: 'bg-pink-400/10 border-pink-200/20', icon: 'text-pink-200', body: 'text-slate-700' },
    { ring: 'from-cyan-300 via-violet-400 to-rose-400', avatarGradient: 'from-indigo-500 to-fuchsia-500', avatarBorder: 'border-white', avatarGlow: 'bg-violet-400/25', node: 'bg-cyan-300', iconShell: 'bg-violet-500/10 border-violet-200', icon: 'text-violet-700', body: 'text-slate-700' },
    { ring: 'from-blue-300 via-indigo-400 to-violet-500', avatarGradient: 'from-indigo-500 to-blue-700', avatarBorder: 'border-indigo-200/20', avatarGlow: 'bg-indigo-400/20', node: 'bg-blue-300', iconShell: 'bg-white/5 border-white/10', icon: 'text-indigo-200', body: 'text-slate-100' },
    { ring: 'from-amber-300 via-pink-300 to-violet-400', avatarGradient: 'from-amber-500 to-pink-500', avatarBorder: 'border-white/80', avatarGlow: 'bg-amber-300/25', node: 'bg-pink-300', iconShell: 'bg-white/50 border-white/60', icon: 'text-slate-700', body: 'text-slate-700' },
    { ring: 'from-cyan-300 via-white to-violet-400', avatarGradient: 'from-violet-500 to-cyan-400', avatarBorder: 'border-white/20', avatarGlow: 'bg-cyan-300/20', node: 'bg-violet-300', iconShell: 'bg-white/5 border-white/10', icon: 'text-violet-200', body: 'text-slate-100' }
  ];

  const theme = themes[templateIndex % themes.length];
  const isActive = field => isTyping && activeField === field;
  const initials = data.name.split(' ').map(part => part[0]).slice(0, 2).join('');

  return children({ theme, isActive, initials });
}

function BusinessCardTemplate({ templateIndex, data, activeField, isTyping }) {
  return (
    <TemplateShell
      templateIndex={templateIndex}
      data={data}
      activeField={activeField}
      isTyping={isTyping}
    >
      {({ theme, isActive, initials }) => {
        const Cursor = ({ field, tone }) => isActive(field)
          ? <span className={`ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse ${tone || 'bg-current'}`} />
          : null;

        if (templateIndex === 0) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-cyan-100 text-slate-950 shadow-xl">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-300/30 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-24 w-1/2 rounded-tl-[5rem] bg-gradient-to-r from-cyan-300/25 to-sky-500/40" />
              <div className="relative flex h-full p-5">
                <div className="flex min-w-0 flex-1 flex-col pr-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.26em] text-sky-700">THYNK STUDIO</div>
                      <div className="mt-1 text-[6px] font-bold uppercase tracking-[0.18em] text-slate-500">Creative solutions</div>
                    </div>
                    <div className="text-[6px] font-black uppercase tracking-[0.16em] text-slate-500">Create • Collaborate • Grow</div>
                  </div>
                  <div className="mt-6 max-w-[68%]">
                    <div className="h-1 w-12 rounded-full bg-sky-600" />
                    <div className="mt-3 text-[clamp(1rem,3.1vw,1.6rem)] font-black leading-none tracking-tight">
                      {data.name || '\u00A0'}<Cursor field="name" tone="bg-sky-600" />
                    </div>
                    <div className="mt-1 text-[clamp(0.55rem,1.55vw,0.78rem)] font-semibold text-sky-700">
                      {data.role || '\u00A0'}<Cursor field="role" tone="bg-sky-600" />
                    </div>
                  </div>
                  <div className="mt-auto grid w-[76%] gap-1">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                </div>
                <div className="flex w-[30%] min-w-[82px] flex-col items-center justify-center">
                  <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
                  <div className="mt-1 text-[6px] font-black uppercase tracking-[0.14em] text-slate-500">Verified Creator</div>
                </div>
              </div>
            </div>
          );
        }

        if (templateIndex === 1) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-fuchsia-300/20 bg-gradient-to-br from-[#060817] via-indigo-950 to-[#341044] text-white shadow-2xl">
              <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_12%_20%,rgba(34,211,238,.2),transparent_20%),radial-gradient(circle_at_85%_35%,rgba(236,72,153,.26),transparent_24%),linear-gradient(125deg,transparent_35%,rgba(129,140,248,.18)_35.2%,transparent_35.5%)]" />
              <div className="relative grid h-full grid-cols-[30%_70%]">
                <div className="flex items-center justify-center border-r border-white/10 bg-white/[0.02]">
                  <div className="flex flex-col items-center">
                    <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} size="compact" />
                    <div className="mt-2 text-center text-[6px] font-black uppercase tracking-[0.16em] text-indigo-200/70">Neon identity</div>
                  </div>
                </div>
                <div className="flex min-w-0 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.26em] text-fuchsia-200">NOVA CREATIVE</div>
                      <div className="mt-1 text-[6px] uppercase tracking-[0.16em] text-indigo-200/60">Ideas that move</div>
                    </div>
                    <span className="rounded-full bg-fuchsia-400 px-2 py-1 text-[6px] font-black text-slate-950">02 / 09</span>
                  </div>
                  <div className="mt-6">
                    <div className="text-[clamp(1.02rem,3vw,1.55rem)] font-black tracking-tight">
                      {data.name || '\u00A0'}<Cursor field="name" tone="bg-fuchsia-300" />
                    </div>
                    <div className="mt-1 text-[clamp(0.54rem,1.55vw,0.76rem)] font-semibold text-fuchsia-200">
                      {data.role || '\u00A0'}<Cursor field="role" tone="bg-fuchsia-300" />
                    </div>
                  </div>
                  <div className="mt-auto grid gap-1.2">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (templateIndex === 2) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-amber-200/30 bg-gradient-to-br from-[#0A0A0D] via-[#1A1612] to-[#2A2217] text-white shadow-2xl">
              <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-amber-300/12 to-transparent" />
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[18px] border-amber-200/10" />
              <div className="relative flex h-full p-5">
                <div className="flex min-w-0 flex-1 flex-col pr-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.24em] text-amber-100">PIXEL HOUSE</div>
                      <div className="mt-1 text-[6px] uppercase tracking-[0.2em] text-stone-400">Digital products</div>
                    </div>
                    <div className="text-[6px] font-black uppercase tracking-[0.18em] text-amber-200">Build • Learn • Grow</div>
                  </div>
                  <div className="mt-7 max-w-[62%]">
                    <div className="text-[clamp(1.02rem,3.1vw,1.6rem)] font-black tracking-tight">
                      {data.name || '\u00A0'}<Cursor field="name" tone="bg-amber-200" />
                    </div>
                    <div className="mt-1 text-[clamp(0.54rem,1.55vw,0.78rem)] font-semibold text-amber-200">
                      {data.role || '\u00A0'}<Cursor field="role" tone="bg-amber-200" />
                    </div>
                    <div className="mt-3 h-px w-16 bg-amber-200/60" />
                  </div>
                  <div className="mt-auto grid w-[70%] gap-1.5">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                </div>
                <div className="flex w-[32%] min-w-[86px] items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-8 rounded-full bg-amber-300/10 blur-2xl" />
                    <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
                    <div className="absolute -right-8 bottom-[-14px] h-28 w-24 rounded-xl border border-amber-200/15 bg-white/[0.03] backdrop-blur-sm" />
                    <div className="absolute -right-3 top-[-10px] grid h-14 w-14 place-items-center rounded-lg border border-amber-200/30 bg-black/30">
                      <div className="grid grid-cols-4 gap-1">
                        {Array.from({ length: 16 }, (_, index) => <span key={index} className={`h-1.5 w-1.5 ${index % 3 === 0 ? 'bg-amber-200' : 'bg-amber-200/20'}`} />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (templateIndex === 3) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-cyan-200/25 bg-gradient-to-br from-[#081419] via-[#0D2530] to-[#081B35] text-white shadow-2xl">
              <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(103,232,249,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.08)_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="relative flex h-full p-4">
                <div className="flex w-[25%] min-w-[72px] flex-col items-center justify-between py-1">
                  <div className="text-center">
                    <div className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-200">CYBERLABS</div>
                    <div className="mt-1 text-[5px] uppercase tracking-[0.12em] text-cyan-200/50">Tech • AI • Innovation</div>
                  </div>
                  <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} size="compact" />
                  <div className="text-center text-[6px] font-black uppercase tracking-[0.15em] text-cyan-200/70">Available</div>
                </div>
                <div className="relative ml-3 flex min-w-0 flex-1 flex-col border-l border-cyan-300/10 pl-4">
                  <div className="ml-auto text-[6px] font-black uppercase tracking-[0.18em] text-cyan-300/60">Innovate • Collaborate</div>
                  <div className="mt-8">
                    <div className="text-[clamp(1rem,3vw,1.55rem)] font-black tracking-tight">{data.name || '\u00A0'}<Cursor field="name" tone="bg-cyan-300" /></div>
                    <div className="mt-1 text-[clamp(0.53rem,1.5vw,0.75rem)] font-semibold text-cyan-200">{data.role || '\u00A0'}<Cursor field="role" tone="bg-cyan-300" /></div>
                  </div>
                  <div className="mt-auto grid gap-1">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (templateIndex === 4) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-pink-200/25 bg-gradient-to-br from-[#F7EFE8] via-white to-pink-50 text-slate-900 shadow-xl">
              <div className="absolute left-[-2rem] bottom-[-3rem] h-44 w-44 rounded-full border border-amber-900/10" />
              <div className="relative flex h-full p-5">
                <div className="flex w-[62%] min-w-0 flex-col">
                  <div className="text-[7px] font-black uppercase tracking-[0.24em] text-slate-500">ORBIT STUDIO</div>
                  <div className="mt-1 text-[5px] uppercase tracking-[0.18em] text-slate-400">Creative solutions</div>
                  <div className="mt-7">
                    <div className="font-serif text-[clamp(1.05rem,3.15vw,1.7rem)] uppercase leading-[0.95] tracking-[0.03em] text-slate-900">
                      {data.name || '\u00A0'}<Cursor field="name" tone="bg-violet-600" />
                    </div>
                    <div className="mt-2 text-[clamp(0.54rem,1.5vw,0.76rem)] font-semibold text-slate-600">
                      {data.role || '\u00A0'}<Cursor field="role" tone="bg-violet-600" />
                    </div>
                    <div className="mt-2 h-px w-10 bg-slate-900" />
                  </div>
                  <div className="mt-auto grid gap-1.5">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                </div>
                <div className="relative flex flex-1 items-center justify-center">
                  <div className="absolute top-3 h-32 w-24 -rotate-12 rounded-full border border-slate-300/50" />
                  <div className="absolute bottom-8 right-2 h-20 w-16 rotate-12 rounded-full border border-amber-900/20" />
                  <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} size="compact" />
                </div>
              </div>
            </div>
          );
        }

        if (templateIndex === 5) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-violet-200/25 bg-gradient-to-br from-white via-violet-50 to-pink-100 text-slate-950 shadow-xl">
              <div className="absolute right-[-5rem] top-[-4rem] h-40 w-40 rounded-full bg-gradient-to-br from-violet-400/30 to-pink-400/25 blur-2xl" />
              <div className="absolute bottom-0 right-0 h-1/2 w-[42%] rounded-tl-[6rem] bg-gradient-to-br from-violet-500/25 via-fuchsia-400/20 to-cyan-300/10" />
              <div className="relative flex h-full p-5">
                <div className="flex min-w-0 flex-1 flex-col pr-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.25em] text-violet-700">QUANTUM WORKS</div>
                      <div className="mt-1 text-[5px] uppercase tracking-[0.18em] text-slate-500">Learn • Build • Earn</div>
                    </div>
                    <div className="text-[6px] font-semibold text-violet-600">Open for opportunities</div>
                  </div>
                  <div className="mt-7 max-w-[70%]">
                    <div className="text-[clamp(1rem,3.15vw,1.62rem)] font-black tracking-tight">{data.name || '\u00A0'}<Cursor field="name" tone="bg-violet-600" /></div>
                    <div className="mt-1 text-[clamp(0.54rem,1.55vw,0.78rem)] font-semibold text-violet-700">{data.role || '\u00A0'}<Cursor field="role" tone="bg-violet-600" /></div>
                  </div>
                  <div className="mt-auto grid gap-1">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                </div>
                <div className="relative flex w-[34%] min-w-[90px] flex-col items-center justify-center">
                  <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
                  <div className="mt-1 rounded-full border border-violet-200 bg-white/70 px-2 py-1 text-[6px] font-black uppercase tracking-[0.12em] text-violet-700">Available for projects</div>
                </div>
              </div>
            </div>
          );
        }

        if (templateIndex === 6) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-indigo-300/20 bg-gradient-to-br from-[#070A14] via-[#11162D] to-[#17112F] text-white shadow-2xl">
              <div className="absolute left-4 top-4 h-28 w-24 rounded-2xl border border-white/10 bg-white/[0.03]" />
              <div className="absolute left-8 top-8 grid grid-cols-5 gap-1 opacity-80">
                {Array.from({ length: 25 }, (_, index) => <span key={index} className={`h-1.5 w-1.5 rounded-sm ${index % 4 === 0 ? 'bg-indigo-300' : 'bg-white/10'}`} />)}
              </div>
              <div className="relative flex h-full p-5">
                <div className="w-[25%] min-w-[76px] pt-2">
                  <div className="text-[7px] font-black uppercase tracking-[0.2em] text-indigo-200">SKILLAUNCH</div>
                  <div className="mt-1 text-[5px] uppercase tracking-[0.15em] text-slate-500">Students • Skills • Opportunities</div>
                  <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-2">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }, (_, index) => <span key={index} className={`h-1.5 w-1.5 rounded-sm ${index % 5 === 0 ? 'bg-indigo-300' : 'bg-white/10'}`} />)}
                    </div>
                    <div className="mt-2 text-center text-[5px] font-black uppercase tracking-[0.12em] text-indigo-200/70">Scan to view profile</div>
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col pl-4">
                  <div className="ml-auto text-[6px] font-black uppercase tracking-[0.18em] text-indigo-200/70">One skill • many possibilities</div>
                  <div className="mt-9">
                    <div className="text-[clamp(1rem,3.1vw,1.6rem)] font-black tracking-tight">{data.name || '\u00A0'}<Cursor field="name" tone="bg-indigo-200" /></div>
                    <div className="mt-1 text-[clamp(0.54rem,1.55vw,0.78rem)] font-semibold text-indigo-300">{data.role || '\u00A0'}<Cursor field="role" tone="bg-indigo-200" /></div>
                    <div className="mt-2 grid grid-cols-2 gap-x-2 text-[6px] font-black uppercase tracking-[0.1em] text-slate-400">
                      <span>AI / ML</span><span>Data Science</span><span>Web Dev</span><span>Open Source</span>
                    </div>
                  </div>
                  <div className="mt-auto grid gap-1">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (templateIndex === 7) {
          return (
            <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-amber-200/40 bg-gradient-to-br from-stone-100 via-orange-50 to-sky-100 text-slate-950 shadow-xl">
              <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-sky-300/55 via-orange-200/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-gradient-to-t from-slate-700/25 to-transparent" />
              <div className="absolute left-[5%] bottom-[20%] h-10 w-24 rotate-[-14deg] rounded-[100%_0_0_0] bg-slate-600/30" />
              <div className="absolute left-[20%] bottom-[19%] h-16 w-32 rotate-[7deg] rounded-[100%_0_0_0] bg-slate-700/20" />
              <div className="relative flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-[0.24em] text-slate-800">WANDER & WORK</div>
                    <div className="mt-1 text-[6px] uppercase tracking-[0.18em] text-slate-600">Remote • Freelance • Freedom</div>
                  </div>
                  <div className="text-[6px] font-black italic text-slate-700">Work from anywhere</div>
                </div>
                <div className="mt-4 max-w-[65%]">
                  <div className="text-[clamp(1rem,3.1vw,1.58rem)] font-black tracking-tight">{data.name || '\u00A0'}<Cursor field="name" tone="bg-slate-800" /></div>
                  <div className="mt-1 text-[clamp(0.54rem,1.55vw,0.78rem)] font-semibold text-slate-700">{data.role || '\u00A0'}<Cursor field="role" tone="bg-slate-800" /></div>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div className="grid gap-1">
                    <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                    <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                    <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                  </div>
                  <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} size="compact" />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-[#081018] via-[#0D1529] to-[#21133D] text-white shadow-2xl">
            <div className="absolute inset-[2px] rounded-[0.9rem] border border-cyan-300/10" />
            <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_20%_25%,rgba(34,211,238,.18),transparent_18%),radial-gradient(circle_at_78%_70%,rgba(217,70,239,.22),transparent_22%)]" />
            <div className="relative flex h-full p-4">
              <div className="flex w-[31%] min-w-[82px] flex-col items-center justify-center border-r border-white/10 pr-3">
                <ProfileRing templateIndex={templateIndex} initials={initials} theme={theme} />
                <div className="mt-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[6px] font-black uppercase tracking-[0.12em] text-cyan-100">Verified Creator</div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-[0.24em] text-cyan-100">NEXT GEN</div>
                    <div className="mt-1 text-[6px] uppercase tracking-[0.18em] text-slate-400">Innovate • Create • Lead</div>
                  </div>
                  <div className="text-[7px] font-black uppercase tracking-[0.18em] text-cyan-200/70">SL • 09</div>
                </div>
                <div className="mt-6">
                  <div className="text-[clamp(1rem,3.1vw,1.62rem)] font-black tracking-tight">{data.name || '\u00A0'}<Cursor field="name" tone="bg-cyan-200" /></div>
                  <div className="mt-1 text-[clamp(0.54rem,1.55vw,0.78rem)] font-semibold text-cyan-100">{data.role || '\u00A0'}<Cursor field="role" tone="bg-cyan-200" /></div>
                </div>
                <div className="mt-auto grid gap-1">
                  <FieldLine icon={Phone} data={data.phone} isActive={isActive('phone')} theme={theme} size="small" />
                  <FieldLine icon={Mail} data={data.email} isActive={isActive('email')} theme={theme} size="small" />
                  <FieldLine icon={MapPin} data={data.address} isActive={isActive('address')} theme={theme} size="small" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-3 h-1 w-20 rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-400 opacity-80" />
          </div>
        );
      }}
    </TemplateShell>
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
                        templateIndex={demoIndex % 9}
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
