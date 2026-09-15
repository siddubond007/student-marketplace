import React, { useEffect, useId, useRef, useState } from 'react';
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

function PerspectiveContent({ perspective }) {
  const Icon = perspective.icon;

  return (
    <div className="home-dual__card-content">
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
  const sectionRef = useRef(null);
  const groupId = useId();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      section.style.setProperty('--home-dual-reveal-intro', '1');
      section.style.setProperty('--home-dual-reveal-switcher', '1');
      section.style.setProperty('--home-dual-reveal-stage', '1');
      return undefined;
    }

    let frame = 0;

    const clamp = (value) => Math.min(1, Math.max(0, value));
    const ease = (value) => {
      const t = clamp(value);
      return t * t * (3 - 2 * t);
    };

    const update = () => {
      frame = 0;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // The section begins its reveal when its top reaches ~90% of the viewport
      // and finishes when it reaches ~22%. This gives the user enough scroll
      // distance to see the content rise and fade in gradually.
      const sectionProgress = clamp(
        (viewportHeight * 0.90 - rect.top) / (viewportHeight * 0.68)
      );

      // Stagger the three layers: title first, controls second, large card last.
      const intro = ease(sectionProgress / 0.45);
      const switcher = ease((sectionProgress - 0.20) / 0.42);
      const stage = ease((sectionProgress - 0.40) / 0.60);

      section.style.setProperty('--home-dual-reveal-intro', intro.toFixed(4));
      section.style.setProperty('--home-dual-reveal-switcher', switcher.toFixed(4));
      section.style.setProperty('--home-dual-reveal-stage', stage.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    document.addEventListener('scroll', requestUpdate, { passive: true, capture: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      document.removeEventListener('scroll', requestUpdate, true);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="home-dual" aria-labelledby={`${groupId}-title`}>
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
          onClick={() => setActive('client')}
        >
          <BriefcaseBusiness aria-hidden="true" />
          <span>I’m Hiring</span>
        </button>

        <button
          type="button"
          className={`home-dual__switch ${active === 'student' ? 'is-active' : ''}`}
          aria-pressed={active === 'student'}
          onClick={() => setActive('student')}
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
