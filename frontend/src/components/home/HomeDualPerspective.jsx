import React, { useId, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Extend the timeline so the lower perspective content can finish its
    // entrance only after the upper heading has naturally moved toward/out of view.
    offset: ['start 92%', 'end 5%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 24,
    mass: 0.9,
    restSpeed: 0.001,
    restDelta: 0.001,
  });

  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  const railX = useTransform(progress, [0, 0.14, 0.30, 0.48], [-90, -52, -14, 0]);
  const railOpacity = useTransform(progress, [0, 0.08, 0.20, 0.38, 0.48], [0, 0.08, 0.38, 0.82, 1]);
  const railScale = useTransform(progress, [0, 0.28, 0.48], [0.97, 0.985, 1]);

  const introY = useTransform(progress, [0, 0.09, 0.22, 0.38], [150, 104, 32, 0]);
  const introOpacity = useTransform(progress, [0, 0.07, 0.18, 0.32, 0.38], [0, 0.06, 0.32, 0.82, 1]);

  const switcherY = useTransform(progress, [0.12, 0.23, 0.40, 0.58], [135, 88, 24, 0]);
  const switcherOpacity = useTransform(progress, [0.12, 0.20, 0.32, 0.52, 0.58], [0, 0.06, 0.32, 0.86, 1]);

  // The lower content intentionally completes later than the heading and switcher.
  // This lets the user keep scrolling until the main perspective is fully revealed,
  // while the upper copy has already moved naturally out of the viewport.
  const stageY = useTransform(progress, [0.30, 0.44, 0.68, 0.92], [220, 145, 42, 0]);
  const stageOpacity = useTransform(progress, [0.30, 0.40, 0.58, 0.80, 0.92], [0, 0.06, 0.32, 0.86, 1]);
  const stageScale = useTransform(progress, [0.30, 0.60, 0.92], [0.965, 0.99, 1]);

  return (
    <section ref={sectionRef} className="home-dual" aria-labelledby={`${groupId}-title`}>
      <div className="home-dual__layout">
        <motion.aside
          className="home-dual__rail"
          aria-label="Why this platform"
          style={{ x: railX, opacity: railOpacity, scale: railScale }}
        >
          <Sparkles aria-hidden="true" />
          <span className="home-dual__rail-word">WHY</span>
          <span className="home-dual__rail-word">THIS</span>
          <span className="home-dual__rail-word">PLATFORM?</span>
        </motion.aside>

        <div className="home-dual__main">
          <motion.div className="home-dual__intro" style={{ y: introY, opacity: introOpacity }}>
            <h2 id={`${groupId}-title`}>One marketplace. Two ways to grow.</h2>
            <p>
              Built for the people hiring for real needs and the students ready to
              turn practical skills into meaningful opportunities.
            </p>
          </motion.div>

          <motion.div
            className="home-dual__switcher"
            role="group"
            aria-label="Choose your perspective"
            style={{ y: switcherY, opacity: switcherOpacity }}
          >
            <button type="button" className={`home-dual__switch ${active === 'client' ? 'is-active' : ''}`} aria-pressed={active === 'client'} onClick={() => setActive('client')}>
              <BriefcaseBusiness aria-hidden="true" />
              <span>I’m Hiring</span>
            </button>
            <button type="button" className={`home-dual__switch ${active === 'student' ? 'is-active' : ''}`} aria-pressed={active === 'student'} onClick={() => setActive('student')}>
              <GraduationCap aria-hidden="true" />
              <span>I’m a Student</span>
            </button>
          </motion.div>

          <motion.div className="home-dual__stage" style={{ y: stageY, opacity: stageOpacity, scale: stageScale }}>
            <div className={`home-dual__card is-${active}`} aria-live="polite">
              <div className="home-dual__card-glow" aria-hidden="true" />
              <div className="home-dual__card-layer home-dual__card-layer--client"><PerspectiveContent perspective={PERSPECTIVES.client} /></div>
              <div className="home-dual__card-layer home-dual__card-layer--student"><PerspectiveContent perspective={PERSPECTIVES.student} /></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
