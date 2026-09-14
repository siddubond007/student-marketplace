import React from 'react';
import { ArrowRight, BadgeCheck, BriefcaseBusiness, GraduationCap, LockKeyhole, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeButton, HomeCard, HomePageSection, HomeReveal } from './HomeFoundation';

const REASONS = [
  {
    icon: GraduationCap,
    title: 'Turn student skills into real opportunity',
    description:
      'Students can present the skills they are building, discover work that matches those skills, and grow through real project experience.'
  },
  {
    icon: BriefcaseBusiness,
    title: 'Give clients a focused way to get work done',
    description:
      'Clients can move from a project need to student talent, proposals, conversations, and delivery without relying on a generic social feed.'
  },
  {
    icon: Sparkles,
    title: 'Keep the marketplace student-first',
    description:
      'The experience is designed around early-career talent: skills, portfolios, projects, communication, and practical outcomes.'
  }
];

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: 'Skill-led discovery',
    description: 'Find work and talent through the skills, gigs, and project paths already supported by the platform.'
  },
  {
    icon: MessageCircle,
    title: 'Clear project communication',
    description: 'Keep the people involved in a project aligned through the platform communication and delivery flow.'
  },
  {
    icon: LockKeyhole,
    title: 'Structured payment protection',
    description: 'Use the platform’s escrow and approval flow where supported instead of treating payment as an external afterthought.'
  }
];

function IconBadge({ icon: Icon }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/25 bg-indigo-400/10 text-indigo-300">
      <Icon aria-hidden="true" className="h-5 w-5" />
    </span>
  );
}

export default function HomeReasonsBenefits() {
  return (
    <HomePageSection
      id="home-reasons-benefits"
      className="px-0"
      eyebrow="Why SkillLaunch exists"
      title="A student marketplace built around capability, not noise."
      description="SkillLaunch connects students who are developing practical skills with people and teams who need project work. The homepage should explain that purpose before asking visitors to browse the marketplace."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {REASONS.map((reason, index) => (
          <HomeReveal key={reason.title} delay={index * 70}>
            <HomeCard className="h-full p-6 sm:p-7">
              <IconBadge icon={reason.icon} />
              <h3 className="mt-6 text-xl font-extrabold tracking-tight text-white">{reason.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{reason.description}</p>
            </HomeCard>
          </HomeReveal>
        ))}
      </div>

      <HomeReveal className="mt-10" delay={120}>
        <HomeCard className="overflow-hidden p-0">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-slate-700/60 bg-slate-900/60 p-7 sm:p-9 lg:border-b-0 lg:border-r">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fuchsia-300">Why choose us</p>
              <h3 className="mt-3 max-w-md text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                The useful parts of a marketplace, focused on getting the project forward.
              </h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                Instead of relying on inflated marketplace claims, the experience is centered on capabilities that can be verified in the product itself.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <HomeButton to="/gigs" variant="primary">
                  Explore student skills
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </HomeButton>
                <HomeButton to="/jobs" variant="secondary">
                  Browse projects
                </HomeButton>
              </div>
            </div>

            <div className="grid gap-px bg-slate-700/30 sm:grid-cols-3 lg:bg-transparent">
              {BENEFITS.map((benefit, index) => (
                <HomeReveal key={benefit.title} delay={170 + index * 70}>
                  <article className="h-full bg-slate-950/30 p-6 sm:p-7 lg:bg-transparent">
                    <IconBadge icon={benefit.icon} />
                    <h4 className="mt-5 text-base font-extrabold text-white">{benefit.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{benefit.description}</p>
                  </article>
                </HomeReveal>
              ))}
            </div>
          </div>
        </HomeCard>
      </HomeReveal>

      <HomeReveal className="mt-6" delay={220}>
        <div className="flex flex-col gap-3 rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.06] px-5 py-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Start with the path that matches your goal: hire for a project or build your student freelancing profile.
          </p>
          <Link to="/register" className="inline-flex shrink-0 items-center gap-2 font-extrabold text-indigo-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
            Get started
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </HomeReveal>
    </HomePageSection>
  );
}
