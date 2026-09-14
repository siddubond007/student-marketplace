import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  LockKeyhole,
  MessageCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeButton, HomeCard, HomePageSection, HomeReveal } from './HomeFoundation';

const REASONS = [
  {
    icon: GraduationCap,
    index: '01',
    title: 'Student skills deserve a place to be seen',
    description:
      'Students build valuable capabilities every day, but early-career talent needs a focused place to present those skills, work, and growing experience.'
  },
  {
    icon: BriefcaseBusiness,
    index: '02',
    title: 'Real projects need accessible skill-based help',
    description:
      'People, founders, teams, and organizations often need practical project support. A student-first marketplace gives those needs a clearer path to relevant talent.'
  },
  {
    icon: Sparkles,
    index: '03',
    title: 'Skills become more valuable through real work',
    description:
      'The platform is designed to turn developing skills into practical opportunities, completed projects, stronger portfolios, and useful experience.'
  },
  {
    icon: LockKeyhole,
    index: '04',
    title: 'Clear expectations make work easier to trust',
    description:
      'Profiles, project details, communication, marketplace rules, and supported safeguards help reduce uncertainty before people commit to the work.'
  }
];

const BENEFITS = [
  {
    icon: Compass,
    title: 'For students',
    description: 'Showcase skills, discover relevant opportunities, create services, and build a practical portfolio through real marketplace activity.',
    to: '/gigs',
    cta: 'Explore student work'
  },
  {
    icon: BriefcaseBusiness,
    title: 'For clients',
    description: 'Find skills and services, compare options, start projects, and communicate clearly around the work you need completed.',
    to: '/jobs',
    cta: 'Browse projects'
  },
  {
    icon: BadgeCheck,
    title: 'Trust by design',
    description: 'Use platform profiles, marketplace rules, usage-rights guidance, and supported safeguards where those capabilities are implemented.',
    to: '/gigs',
    cta: 'See available work'
  },
  {
    icon: TrendingUp,
    title: 'A simpler next step',
    description: 'Keep the journey focused so visitors can move from understanding the marketplace to taking one useful action without unnecessary friction.',
    to: '/register',
    cta: 'Create an account'
  },
  {
    icon: MessageCircle,
    title: 'Built to grow with the marketplace',
    description: 'The experience can expand with richer discovery, more opportunities, and deeper product workflows without changing the core student-first purpose.',
    to: '/jobs',
    cta: 'See project opportunities'
  }
];

function IconBadge({ icon: Icon }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/25 bg-indigo-400/10 text-indigo-300"
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

export default function HomeReasonsBenefits() {
  return (
    <HomePageSection
      id="home-reasons-benefits"
      className="px-0"
      eyebrow="Why SkillLaunch exists"
      title="A marketplace built to turn developing skills into useful work."
      description="Students need a place to prove what they can do. Clients need a practical way to find capable help. SkillLaunch brings those two needs together through a focused marketplace experience."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason, index) => (
          <HomeReveal key={reason.index} delay={index * 65}>
            <HomeCard className="group h-full p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <IconBadge icon={reason.icon} />
                <span className="pt-1 text-xs font-extrabold tracking-[0.16em] text-slate-500">{reason.index}</span>
              </div>
              <h3 className="mt-7 text-xl font-extrabold tracking-tight text-white">{reason.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{reason.description}</p>
            </HomeCard>
          </HomeReveal>
        ))}
      </div>

      <HomeReveal className="mt-10" delay={100}>
        <div className="grid gap-6 rounded-[1.75rem] border border-indigo-400/15 bg-gradient-to-br from-indigo-400/[0.08] via-slate-900/60 to-fuchsia-400/[0.06] p-6 sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10">
          <div className="max-w-lg">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fuchsia-300">Why choose SkillLaunch</p>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              The value is in the workflow, not in inflated marketplace claims.
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The homepage should make the product easier to understand: clear paths for students and clients, skill-led discovery, supported safeguards, and a direct next step.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <HomeButton to="/gigs" variant="primary">
                Explore student work
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </HomeButton>
              <HomeButton to="/jobs" variant="secondary">
                Browse projects
              </HomeButton>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-700/30 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <HomeReveal key={benefit.title} delay={150 + index * 55}>
                <article className="flex h-full flex-col bg-slate-950/55 p-6 sm:p-7">
                  <IconBadge icon={benefit.icon} />
                  <h4 className="mt-5 text-base font-extrabold text-white">{benefit.title}</h4>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">{benefit.description}</p>
                  <Link
                    to={benefit.to}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-indigo-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    {benefit.cta}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </article>
              </HomeReveal>
            ))}
          </div>
        </div>
      </HomeReveal>

      <HomeReveal className="mt-6" delay={210}>
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/45 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-indigo-300" aria-hidden="true">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <p className="text-sm leading-6 text-slate-300">
              Start with one clear goal: discover student services, explore projects, or create your own marketplace profile.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-2 font-extrabold text-indigo-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Get started
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </HomeReveal>
    </HomePageSection>
  );
}
