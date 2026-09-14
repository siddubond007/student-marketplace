import React, { useId, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, GraduationCap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HomeDualPerspective.css';

const PERSPECTIVES = {
  client: {
    eyebrow: 'FOR CLIENTS',
    title: 'Find student talent that fits the work.',
    body:
      'Explore practical skills, review profiles, and choose the student whose capabilities match your project. The marketplace is built to make discovering student talent feel clear and focused.',
    items: [
      ['Discover relevant skills', 'Start with the kind of work you need and narrow your search around practical capabilities.'],
      ['Compare before choosing', 'Use profiles, portfolios, and project context to understand fit before you move forward.'],
      ['Turn needs into opportunities', 'Create project opportunities that let students apply what they already know to real work.'],
    ],
    action: 'Explore Student Talent',
    to: '/gigs',
    icon: BriefcaseBusiness,
  },
  student: {
    eyebrow: 'FOR STUDENTS',
    title: 'Turn your skills into experience and opportunity.',
    body:
      'Show what you can do, discover work that matches your strengths, and build practical experience that adds substance to your portfolio and professional journey.',
    items: [
      ['Showcase your skills', 'Present your capabilities through your profile, portfolio work, and the services you can offer.'],
      ['Find work that fits', 'Discover project opportunities where your current skills can solve real problems.'],
      ['Grow your professional story', 'Use each relevant opportunity to build experience, portfolio evidence, visibility, and confidence.'],
    ],
    action: 'Start Building Your Profile',
    to: '/register',
    icon: GraduationCap,
  },
};

function PerspectiveContent({ perspective, className = '' }) {
  const Icon = perspective.icon;

  return (
    <div className={`home-dual__card-content ${className}`}>
      <div className="home-dual__card-top">
        <div className="home-dual__role-icon">
          <Icon aria-hidden="true" />
        </div>
        <span>{perspective.eyebrow}</span>
      </div>

      <div className="home-dual__card-body">
        <h3>{perspective.title}</h3>
        <p>{perspective.body}</p>

        <div className="home-dual__items">
          {perspective.items.map(([title, text]) => (
            <div className="home-dual__item" key={title}>
              <span className="home-dual__item-number" aria-hidden="true" />
              <div>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to={perspective.to} className="home-dual__cta">
          <span>{perspective.action}</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="home-dual__card-footer">
        <span className="home-dual__footer-line" aria-hidden="true" />
        <span>
          {perspective === PERSPECTIVES.client
            ? 'A clearer way to discover student capability.'
            : 'A clearer way to turn capability into opportunity.'}
        </span>
      </div>
    </div>
  );
}

export default function HomeDualPerspective() {
  const [active, setActive] = useState('client');
  const groupId = useId();

  const selectPerspective = (next) => {
    if (next === active) return;
    setActive(next);
  };

  return (
    <section className="home-dual" aria-labelledby={`${groupId}-title`}>
      <div className="home-dual__intro">
        <div className="home-dual__eyebrow">
          <Sparkles aria-hidden="true" />
          <span>WHY THIS PLATFORM?</span>
        </div>
        <h2 id={`${groupId}-title`}>One marketplace. Two ways to grow.</h2>
        <p>
          Built for the people hiring for real needs and the students ready to
          turn practical skills into meaningful opportunities.
        </p>
      </div>

      <div className="home-dual__switcher" role="group" aria-label="Choose your perspective">
        <button
          type="button"
          className={`home-dual__switch ${active === 'client' ? 'is-active' : ''}`}
          aria-pressed={active === 'client'}
          onClick={() => selectPerspective('client')}
        >
          <BriefcaseBusiness aria-hidden="true" />
          <span>I’m Hiring</span>
        </button>

        <button
          type="button"
          className={`home-dual__switch ${active === 'student' ? 'is-active' : ''}`}
          aria-pressed={active === 'student'}
          onClick={() => selectPerspective('student')}
        >
          <GraduationCap aria-hidden="true" />
          <span>I’m a Student</span>
        </button>
      </div>

      <div className="home-dual__stage">
        <div className={`home-dual__card is-${active}`} aria-live="polite">
          <div className="home-dual__card-glow" aria-hidden="true" />

          <div className="home-dual__card-layer home-dual__card-layer--client">
            <PerspectiveContent perspective={PERSPECTIVES.client} />
          </div>

          <div className="home-dual__card-layer home-dual__card-layer--student">
            <PerspectiveContent perspective={PERSPECTIVES.student} />
          </div>
        </div>
      </div>
    </section>
  );
}
