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
    offset: ['start 92%', 'end 34%'],
  });

  // One spring-smoothed progress value gives the reveal a continuous, liquid
  // feel instead of directly snapping visual properties to wheel events.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 78,
    damping: 22,
    mass: 0.82,
    restSpeed: 0.001,
    restDelta: 0.001,
  });

  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  const introY = useTransform(progress, [0, 0.14, 0.42], [150, 54, 0]);
  const introOpacity = useTransform(progress, [0, 0.12, 0.30, 0.42], [0, 0.20, 0.82, 1]);
  const introBlur = useTransform(progress, [0, 0.18, 0.38], ['7px', '2px', '0px']);

  const switcherY = useTransform(progress, [0.16, 0.28, 0.58], [130, 48, 0]);
  const switcherOpacity = useTransform(progress, [0.16, 0.28, 0.48, 0.58], [0, 0.18, 0.82, 1]);
  const switcherBlur = useTransform(progress, [0.16, 0.34, 0.54], ['5px', '1px', '0px']);

  const stageY = useTransform(progress, [0.34, 0.48, 0.80], [220, 70, 0]);
  const stageOpacity = useTransform(progress, [0.34, 0.48, 0.68, 0.80], [0, 0.14, 0.78, 1]);
  const stageScale = useTransform(progress, [0.34, 0.80], [0.965, 1]);
  const stageBlur = useTransform(progress, [0.34, 0.52, 0.74], ['7px', '2px', '0px']);

  return (
    <section ref={sectionRef} className="home-dual" aria-labelledby={`${groupId}-title`}>
      <motion.div
        className="home-dual__intro"
        style={{ y: introY, opacity: introOpacity, filter: `blur(${introBlur.get()})` }}
      >
        <div className="home-dual__eyebrow">
          <Sparkles aria-hidden="true" />
          <span>WHY THIS PLATFORM?</span>
        </div>
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
        style={{ y: switcherY, opacity: switcherOpacity, filter: `blur(${switcherBlur.get()})` }}
      >
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
      </motion.div>

      <motion.div
        className="home-dual__stage"
        style={{ y: stageY, opacity: stageOpacity, scale: stageScale, filter: `blur(${stageBlur.get()})` }}
      >
        <div className={`home-dual__card is-${active}`} aria-live="polite">
          <div className="home-dual__card-glow" aria-hidden="true" />
          <div className="home-dual__card-layer home-dual__card-layer--client">
            <PerspectiveContent perspective={PERSPECTIVES.client} />
          </div>
          <div className="home-dual__card-layer home-dual__card-layer--student">
            <PerspectiveContent perspective={PERSPECTIVES.student} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
