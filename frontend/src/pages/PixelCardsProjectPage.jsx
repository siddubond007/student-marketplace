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

function ProfileRing({ templateIndex, initials, large = false }) {
  const compact = !large;
  const darkCenter = [1, 2, 3, 6, 8].includes(templateIndex);
  const styles = [
    ['from-cyan-300 via-sky-400 to-indigo-500', 'from-sky-100 to-cyan-200', 'bg-amber-200', 'bg-slate-900', 'bg-sky-500', 'bg-cyan-300/30'],
    ['from-cyan-300 via-violet-500 to-fuchsia-500', 'from-slate-800 to-indigo-950', 'bg-amber-100', 'bg-slate-950', 'bg-fuchsia-500', 'bg-fuchsia-400/25'],
    ['from-amber-200 via-orange-400 to-rose-500', 'from-stone-800 to-stone-950', 'bg-orange-200', 'bg-stone-950', 'bg-amber-500', 'bg-amber-300/25'],
    ['from-cyan-200 via-teal-400 to-blue-500', 'from-slate-800 to-cyan-950', 'bg-amber-200', 'bg-slate-950', 'bg-cyan-500', 'bg-cyan-300/25'],
    ['from-pink-300 via-fuchsia-400 to-violet-500', 'from-rose-50 to-amber-50', 'bg-rose-200', 'bg-stone-700', 'bg-pink-500', 'bg-pink-400/25'],
    ['from-violet-300 via-fuchsia-400 to-cyan-400', 'from-violet-50 to-cyan-50', 'bg-amber-200', 'bg-slate-800', 'bg-violet-500', 'bg-violet-400/25'],
    ['from-indigo-300 via-blue-400 to-violet-500', 'from-slate-800 to-indigo-950', 'bg-amber-200', 'bg-slate-950', 'bg-indigo-500', 'bg-indigo-400/25'],
    ['from-amber-200 via-rose-300 to-violet-400', 'from-orange-50 to-rose-50', 'bg-amber-200', 'bg-stone-700', 'bg-orange-400', 'bg-amber-300/25'],
    ['from-cyan-300 via-white to-violet-500', 'from-slate-800 to-violet-950', 'bg-amber-200', 'bg-slate-950', 'bg-cyan-400', 'bg-cyan-300/25']
  ];
  const style = styles[templateIndex % styles.length];
  const shellSize = compact ? 'h-20 w-20' : 'h-28 w-28';
  const portraitSize = compact ? 'h-14 w-14' : 'h-20 w-20';
  const core = darkCenter ? 'bg-[#070B16]' : 'bg-white';
  return (
    <div className={['relative flex items-center justify-center', shellSize].join(' ')}>
      <div className={['absolute inset-0 rounded-full bg-gradient-to-br p-[2px] shadow-[0_0_30px_rgba(99,102,241,0.28)]', style[0]].join(' ')}>
        <div className={['h-full w-full rounded-full', core].join(' ')} />
      </div>
      <div className={['absolute inset-[5px] rounded-full border', darkCenter ? 'border-white/10' : 'border-slate-900/10'].join(' ')} />
      <div className={['relative overflow-hidden rounded-full border-2 border-white/80 bg-gradient-to-b shadow-inner', portraitSize, style[1]].join(' ')}>
        <div className={['absolute -top-3 left-1/2 -translate-x-1/2 rounded-full blur-xl', compact ? 'h-8 w-8' : 'h-12 w-12', style[5]].join(' ')} />
        <div className={['absolute left-1/2 top-[16%] -translate-x-1/2 rounded-t-full', compact ? 'h-4 w-8' : 'h-6 w-11', style[3]].join(' ')} />
        <div className={['absolute left-1/2 top-[25%] -translate-x-1/2 rounded-full shadow-sm', compact ? 'h-4 w-4' : 'h-6 w-6', style[2]].join(' ')} />
        <div className={['absolute left-1/2 top-[42%] -translate-x-1/2 rounded-t-[45%] rounded-b-[34%]', compact ? 'h-8 w-7' : 'h-12 w-10', style[2]].join(' ')} />
        <div className={['absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[55%]', compact ? 'h-5 w-11' : 'h-7 w-16', style[4]].join(' ')} />
        <div className={['absolute left-[28%] top-[53%] h-1 w-1 rounded-full', darkCenter ? 'bg-white/50' : 'bg-slate-900/35'].join(' ')} />
        <div className={['absolute right-[28%] top-[53%] h-1 w-1 rounded-full', darkCenter ? 'bg-white/50' : 'bg-slate-900/35'].join(' ')} />
        <div className="absolute left-1/2 top-[61%] h-px w-3 -translate-x-1/2 bg-current opacity-20" />
      </div>
      <span className={['absolute bottom-1 right-1 rounded-full border-2 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]', compact ? 'h-3 w-3' : 'h-4 w-4', darkCenter ? 'border-slate-900' : 'border-white'].join(' ')} />
      <span className={['absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full', style[4]].join(' ')} />
      <span className="sr-only">Creator profile</span>
    </div>
  );
}

function ContactRow({ icon: Icon, data, isActive, tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={['flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70'].join(' ')}>
        <Icon className={['h-2.5 w-2.5', dark ? 'text-white/80' : 'text-slate-600'].join(' ')} />
      </span>
      <span className={['min-w-0 truncate text-[9px] font-semibold', dark ? 'text-slate-100' : 'text-slate-700'].join(' ')}>
        {data || '\u00A0'}
        {isActive && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-current" />}
      </span>
    </div>
  );
}

function CardName({ value, active, tone = 'bg-current', serif = false }) {
  return (
    <div className={['font-black leading-none tracking-tight', serif ? 'font-serif uppercase tracking-[0.03em]' : ''].join(' ')}>
      {value || '\u00A0'}
      {active && <span className={['ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse', tone].join(' ')} />}
    </div>
  );
}

function BusinessCardTemplate({ templateIndex, data, activeField, isTyping }) {
  const active = field => isTyping && activeField === field;
  const initials = data.name.split(' ').map(part => part[0]).slice(0, 2).join('');
  const lightRole = (tone) => <div className={['mt-1 text-[clamp(0.58rem,1.6vw,0.82rem)] font-semibold', tone].join(' ')}>{data.role || '\u00A0'}{active('role') && <span className="ml-1 inline-block h-[1em] w-px align-[-0.12em] animate-pulse bg-current" />}</div>;
  const contact = (tone) => (
    <div className="grid gap-1.5">
      <ContactRow icon={Phone} data={data.phone} isActive={active('phone')} tone={tone} />
      <ContactRow icon={Mail} data={data.email} isActive={active('email')} tone={tone} />
      <ContactRow icon={MapPin} data={data.address} isActive={active('address')} tone={tone} />
    </div>
  );

  if (templateIndex === 0) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-cyan-100 text-slate-950 shadow-xl">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-28 w-1/2 rounded-tl-[6rem] bg-gradient-to-l from-sky-500/35 to-cyan-200/10" />
        <div className="absolute right-6 top-6 text-[6px] font-black uppercase tracking-[0.18em] text-slate-400">Create • Collaborate • Grow</div>
        <div className="relative flex h-full p-5">
          <div className="flex w-[64%] min-w-0 flex-col">
            <div className="text-[8px] font-black uppercase tracking-[0.25em] text-sky-700">THYNK STUDIO</div>
            <div className="mt-1 text-[6px] font-bold uppercase tracking-[0.18em] text-slate-500">Creative identity</div>
            <div className="mt-6">
              <div className="h-1 w-14 rounded-full bg-sky-600" />
              <div className="text-[clamp(1rem,3.25vw,1.62rem)] font-black leading-none"><CardName value={data.name} active={active('name')} tone="bg-sky-600" /></div>
              {lightRole('text-sky-700')}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Ideas', 'Design', 'Impact'].map(item => <span key={item} className="rounded-full border border-sky-200 bg-white/65 px-2 py-1 text-[5px] font-black uppercase tracking-[0.12em] text-sky-700">{item}</span>)}
              </div>
            </div>
            <div className="mt-auto max-w-[92%]">{contact('light')}</div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <ProfileRing templateIndex={0} initials={initials} large />
            <div className="mt-1 text-[6px] font-black uppercase tracking-[0.16em] text-slate-500">Verified creator</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 1) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-fuchsia-300/25 bg-gradient-to-br from-[#040714] via-indigo-950 to-[#3A104B] text-white shadow-2xl">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_32%,rgba(34,211,238,.24),transparent_20%),radial-gradient(circle_at_82%_68%,rgba(236,72,153,.25),transparent_24%)]" />
        <div className="absolute left-7 top-1/2 -translate-y-1/2"><ProfileRing templateIndex={1} initials={initials} large /></div>
        <div className="absolute left-7 bottom-8 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-[6px] font-black uppercase tracking-[0.14em] text-fuchsia-200">Neon identity</div>
        <div className="relative ml-[31%] flex h-full flex-col p-5">
          <div className="flex items-start justify-between">
            <div><div className="text-[8px] font-black uppercase tracking-[0.27em] text-fuchsia-200">NOVA CREATIVE</div><div className="mt-1 text-[5px] uppercase tracking-[0.18em] text-indigo-200/60">Creative minds / brighter tomorrow</div></div>
            <div className="rounded-full bg-fuchsia-400 px-2 py-1 text-[5px] font-black text-slate-950">02</div>
          </div>
          <div className="mt-9">
            <div className="text-[clamp(1.15rem,3.45vw,1.78rem)]"><CardName value={data.name} active={active('name')} tone="bg-fuchsia-300" /></div>
            {lightRole('text-fuchsia-200')}
          </div>
          <div className="mt-auto">{contact('dark')}</div>
        </div>
      </div>
    );
  }

  if (templateIndex === 2) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-amber-200/30 bg-gradient-to-br from-[#08090B] via-[#1B1713] to-[#302518] text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-[36%] bg-gradient-to-l from-amber-200/10 to-transparent" />
        <div className="absolute right-[-3rem] top-[-3rem] h-44 w-44 rounded-full border-[18px] border-amber-100/10" />
        <div className="relative flex h-full p-5">
          <div className="flex w-[60%] min-w-0 flex-col">
            <div className="text-[8px] font-black uppercase tracking-[0.24em] text-amber-100">PIXEL HOUSE</div>
            <div className="mt-1 text-[5px] uppercase tracking-[0.2em] text-stone-400">Digital products • premium identity</div>
            <div className="mt-8 max-w-[92%]">
              <div className="text-[clamp(1.14rem,3.35vw,1.72rem)]"><CardName value={data.name} active={active('name')} tone="bg-amber-200" /></div>
              {lightRole('text-amber-200')}
              <div className="mt-3 h-px w-16 bg-amber-200/60" />
            </div>
            <div className="mt-auto max-w-[90%]">{contact('dark')}</div>
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center">
            <div className="absolute right-0 top-0 rounded-xl border border-amber-100/20 bg-black/30 p-2">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }, (_, index) => <span key={index} className={['h-1.5 w-1.5 rounded-[1px]', index % 4 === 0 ? 'bg-amber-100' : 'bg-amber-100/15'].join(' ')} />)}
              </div>
              <div className="mt-1 text-[4px] font-black uppercase tracking-[0.12em] text-amber-200/80">Scan to connect</div>
            </div>
            <ProfileRing templateIndex={2} initials={initials} large />
            <div className="mt-1 text-[5px] font-black uppercase tracking-[0.14em] text-amber-200/70">Private profile</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 3) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-[#07161D] via-[#0A2530] to-[#081B35] text-white shadow-2xl">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(103,232,249,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.1)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative flex h-full p-4">
          <div className="flex w-[29%] min-w-[84px] flex-col items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <div className="text-center"><div className="text-[7px] font-black uppercase tracking-[0.22em] text-cyan-200">CYBERLABS</div><div className="mt-1 text-[4px] uppercase tracking-[0.12em] text-cyan-100/50">Tech • AI • Innovation</div></div>
            <ProfileRing templateIndex={3} initials={initials} />
            <div className="rounded-full border border-cyan-300/15 bg-cyan-300/5 px-2 py-1 text-[5px] font-black uppercase tracking-[0.12em] text-cyan-200">Available for projects</div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col pl-4">
            <div className="ml-auto rounded-full border border-cyan-300/10 bg-cyan-300/5 px-2 py-1 text-[5px] font-black uppercase tracking-[0.15em] text-cyan-200/70">System profile 04</div>
            <div className="mt-8">
              <div className="text-[clamp(1.12rem,3.3vw,1.68rem)]"><CardName value={data.name} active={active('name')} tone="bg-cyan-300" /></div>
              {lightRole('text-cyan-200')}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['AI / ML', 'Data Science', 'Web Dev', 'Open Source'].map(skill => <span key={skill} className="rounded-full border border-cyan-200/10 bg-cyan-300/5 px-2 py-1 text-[5px] font-black uppercase tracking-[0.1em] text-cyan-100/70">{skill}</span>)}
              </div>
            </div>
            <div className="mt-auto">{contact('dark')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 4) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-rose-200/40 bg-gradient-to-br from-[#F8EFE8] via-white to-rose-50 text-slate-950 shadow-xl">
        <div className="absolute left-[-2rem] bottom-[-3rem] h-44 w-44 rounded-full border border-slate-900/10" />
        <div className="absolute right-10 top-8 h-24 w-20 rotate-12 rounded-[50%] border border-slate-300/50" />
        <div className="relative grid h-full grid-cols-[58%_42%] p-5">
          <div className="flex min-w-0 flex-col">
            <div className="text-[7px] font-black uppercase tracking-[0.24em] text-slate-500">ORBIT STUDIO</div>
            <div className="mt-1 text-[5px] uppercase tracking-[0.16em] text-slate-400">Minimal / artistic identity</div>
            <div className="mt-8">
              <div className="text-[clamp(1.18rem,3.3vw,1.72rem)]"><CardName value={data.name} active={active('name')} tone="bg-violet-600" serif /></div>
              {lightRole('text-slate-600')}
              <div className="mt-2 h-px w-10 bg-slate-900" />
            </div>
            <div className="mt-auto">{contact('light')}</div>
          </div>
          <div className="relative flex flex-col items-center justify-center">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 180" aria-hidden="true"><ellipse cx="80" cy="88" rx="58" ry="23" fill="none" stroke="rgba(120,113,108,.32)" strokeWidth="1.2" transform="rotate(-18 80 88)" /><circle cx="126" cy="44" r="3" fill="#C4B5FD" /><circle cx="30" cy="120" r="3" fill="#F0ABAB" /></svg>
            <ProfileRing templateIndex={4} initials={initials} />
            <div className="mt-1 rounded-full border border-slate-200 bg-white/70 px-2 py-1 text-[5px] font-black uppercase tracking-[0.12em] text-slate-500">Designed to feel human</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 5) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-white via-violet-50 to-pink-100 text-slate-950 shadow-xl">
        <div className="absolute right-[-4rem] top-[-3rem] h-44 w-44 rounded-full bg-violet-400/20 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-[56%] w-[46%] rounded-tl-[7rem] bg-gradient-to-br from-violet-500/25 via-fuchsia-400/20 to-cyan-300/15" />
        <div className="relative flex h-full p-5">
          <div className="flex min-w-0 flex-1 flex-col pr-2">
            <div className="flex items-start justify-between gap-2"><div><div className="text-[8px] font-black uppercase tracking-[0.24em] text-violet-700">QUANTUM WORKS</div><div className="mt-1 text-[5px] uppercase tracking-[0.18em] text-slate-500">Learn • Build • Earn</div></div><div className="rounded-full border border-violet-200 bg-white/60 px-2 py-1 text-[5px] font-black uppercase tracking-[0.1em] text-violet-700">Open</div></div>
            <div className="mt-8 max-w-[76%]">
              <div className="text-[clamp(1.08rem,3.15vw,1.62rem)]"><CardName value={data.name} active={active('name')} tone="bg-violet-600" /></div>
              {lightRole('text-violet-700')}
            </div>
            <div className="mt-auto max-w-[78%]">{contact('light')}</div>
          </div>
          <div className="flex w-[34%] min-w-[100px] flex-col items-center justify-end pb-2"><ProfileRing templateIndex={5} initials={initials} large /><div className="mt-1 rounded-full border border-violet-200 bg-white/80 px-2 py-1 text-[5px] font-black uppercase tracking-[0.12em] text-violet-700">Available for projects</div></div>
        </div>
      </div>
    );
  }

  if (templateIndex === 6) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-indigo-300/20 bg-gradient-to-br from-[#060913] via-[#11162B] to-[#1A1231] text-white shadow-2xl">
        <div className="absolute left-0 top-0 h-full w-[29%] border-r border-white/10 bg-white/[0.02]" />
        <div className="relative flex h-full p-4">
          <div className="flex w-[30%] min-w-[96px] flex-col items-center justify-between py-1">
            <div className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-2"><div className="grid grid-cols-5 gap-1">{Array.from({ length: 25 }, (_, index) => <span key={index} className={['h-1.5 w-1.5 rounded-sm', index % 5 === 0 ? 'bg-indigo-300' : 'bg-white/10'].join(' ')} />)}</div><div className="mt-2 text-center text-[5px] font-black uppercase tracking-[0.11em] text-indigo-200/70">Scan to view profile</div></div>
            <ProfileRing templateIndex={6} initials={initials} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col pl-4">
            <div className="ml-auto text-[5px] font-black uppercase tracking-[0.18em] text-indigo-200/60">Skill profile / 07</div>
            <div className="mt-8">
              <div className="text-[clamp(1.05rem,3.1vw,1.6rem)]"><CardName value={data.name} active={active('name')} tone="bg-indigo-200" /></div>
              {lightRole('text-indigo-300')}
              <div className="mt-3 flex flex-wrap gap-1.5">{['AI / ML', 'Data Science', 'Web Development', 'Technical Writing'].map(skill => <span key={skill} className="rounded-lg border border-indigo-200/10 bg-indigo-300/5 px-2 py-1 text-[5px] font-black uppercase tracking-[0.08em] text-indigo-100/70">{skill}</span>)}</div>
            </div>
            <div className="mt-auto">{contact('dark')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateIndex === 7) {
    return (
      <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-sky-100 via-orange-50 to-slate-100 text-slate-950 shadow-xl">
        <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-sky-300/55 via-orange-200/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-gradient-to-t from-slate-600/20 to-transparent" />
        <div className="absolute left-[8%] bottom-[18%] h-14 w-36 rotate-[-10deg] rounded-t-[100%] bg-slate-500/20" />
        <div className="absolute right-[10%] bottom-[16%] h-12 w-28 rotate-[8deg] rounded-t-[100%] bg-slate-700/20" />
        <div className="relative flex h-full flex-col p-5">
          <div className="flex items-start justify-between"><div><div className="text-[8px] font-black uppercase tracking-[0.24em] text-slate-800">WANDER & WORK</div><div className="mt-1 text-[5px] uppercase tracking-[0.18em] text-slate-600">Remote • Freelance • Freedom</div></div><div className="text-[5px] font-black italic text-slate-700">Work from anywhere</div></div>
          <div className="mt-6 max-w-[62%]"><div className="text-[clamp(1.05rem,3.1vw,1.58rem)]"><CardName value={data.name} active={active('name')} tone="bg-slate-800" /></div>{lightRole('text-slate-700')}</div>
          <div className="mt-auto flex items-end justify-between gap-3"><div className="min-w-0 max-w-[68%]">{contact('light')}</div><div className="pb-1"><ProfileRing templateIndex={7} initials={initials} /></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[1.58/1] overflow-hidden rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-[#071019] via-[#11162B] to-[#27113A] text-white shadow-2xl">
      <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_22%_22%,rgba(34,211,238,.18),transparent_18%),radial-gradient(circle_at_80%_74%,rgba(217,70,239,.2),transparent_22%)]" />
      <div className="absolute inset-[2px] rounded-[0.9rem] border border-white/10" />
      <div className="absolute right-5 top-14 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-300 via-white to-pink-400 opacity-85 blur-[1px]" />
      <div className="absolute bottom-5 right-5 flex items-end gap-[2px] opacity-70">
        {Array.from({ length: 18 }, (_, index) => <span key={index} className={['w-[2px] rounded-full', index % 4 === 0 ? 'h-5 bg-cyan-200' : 'h-3 bg-white/30'].join(' ')} />)}
      </div>
      <div className="relative flex h-full p-4">
        <div className="flex w-[34%] min-w-[104px] flex-col items-center justify-center border-r border-white/10 pr-3"><ProfileRing templateIndex={8} initials={initials} large /><div className="mt-1 rounded-full border border-cyan-200/10 bg-white/5 px-2 py-1 text-[5px] font-black uppercase tracking-[0.12em] text-cyan-100">Verified Creator</div></div>
        <div className="flex min-w-0 flex-1 flex-col pl-4">
          <div className="flex items-start justify-between"><div><div className="text-[8px] font-black uppercase tracking-[0.25em] text-cyan-100">NEXT GEN</div><div className="mt-1 text-[5px] uppercase tracking-[0.18em] text-slate-400">Innovate • Create • Lead</div></div><div className="text-[6px] font-black uppercase tracking-[0.16em] text-cyan-200/70">SL • 09</div></div>
          <div className="mt-7"><div className="text-[clamp(1.05rem,3.15vw,1.62rem)]"><CardName value={data.name} active={active('name')} tone="bg-cyan-200" /></div>{lightRole('text-cyan-100')}</div>
          <div className="mt-auto">{contact('dark')}</div>
        </div>
      </div>
      <div className="absolute bottom-2 right-3 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-400" />
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
