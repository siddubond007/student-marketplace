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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 112,
    damping: 27,
    mass: 0.72,
    restSpeed: 0.001,
    restDelta: 0.001,
  });

  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  const railX = useTransform(progress, [0, 0.16, 0.34, 0.52], [-56, -30, -8, 0]);
  const railOpacity = useTransform(progress, [0, 0.08, 0.20, 0.35, 0.48], [0, 0.08, 0.38, 0.82, 1]);
  const railScale = useTransform(progress, [0, 0.25, 0.48], [0.98, 0.995, 1]);

  const introY = useTransform(progress, [0, 0.08, 0.20, 0.35], [150, 92, 24, 0]);
  const introOpacity = useTransform(progress, [0, 0.06, 0.16, 0.28, 0.35], [0, 0.06, 0.32, 0.82, 1]);

  const switcherY = useTransform(progress, [0.11, 0.20, 0.32, 0.43], [135, 82, 22, 0]);
  const switcherOpacity = useTransform(progress, [0.11, 0.18, 0.28, 0.40, 0.43], [0, 0.06, 0.34, 0.86, 1]);

  const stageY = useTransform(progress, [0.20, 0.29, 0.43, 0.60], [220, 118, 28, 0]);
  const stageOpacity = useTransform(progress, [0.20, 0.27, 0.38, 0.52, 0.60], [0, 0.06, 0.34, 0.86, 1]);
  const stageScale = useTransform(progress, [0.20, 0.40, 0.60], [0.965, 0.99, 1]);

  return (
    <section ref={sectionRef} className="home-dual" aria-labelledby={`${groupId}-title`}>
      <style>{`
        .home-dual {
          isolation: isolate !important;
        }

        /* Deep-field universe behind the whole HP-02 scene. */
        .home-dual::before {
          z-index: 0 !important;
          opacity: 0.62 !important;
          background-image:
            radial-gradient(circle at 7% 14%, rgba(241, 247, 255, 0.62) 0 1.1px, transparent 1.8px),
            radial-gradient(circle at 14% 72%, rgba(203, 228, 250, 0.38) 0 0.9px, transparent 1.6px),
            radial-gradient(circle at 24% 34%, rgba(255, 199, 128, 0.34) 0 0.9px, transparent 1.7px),
            radial-gradient(circle at 31% 82%, rgba(220, 235, 248, 0.32) 0 1px, transparent 1.7px),
            radial-gradient(circle at 42% 17%, rgba(193, 219, 242, 0.42) 0 0.9px, transparent 1.6px),
            radial-gradient(circle at 52% 73%, rgba(245, 247, 255, 0.42) 0 1px, transparent 1.7px),
            radial-gradient(circle at 63% 29%, rgba(221, 235, 248, 0.34) 0 0.9px, transparent 1.6px),
            radial-gradient(circle at 72% 81%, rgba(255, 195, 126, 0.30) 0 0.9px, transparent 1.6px),
            radial-gradient(circle at 82% 20%, rgba(210, 231, 247, 0.44) 0 1px, transparent 1.7px),
            radial-gradient(circle at 91% 61%, rgba(237, 245, 253, 0.40) 0 0.9px, transparent 1.7px),
            radial-gradient(circle at 97% 31%, rgba(177, 210, 237, 0.30) 0 0.9px, transparent 1.6px),
            radial-gradient(circle at 54% 46%, rgba(250, 250, 255, 0.20) 0 0.8px, transparent 1.4px),
            radial-gradient(circle at 18% 49%, rgba(250, 250, 255, 0.22) 0 0.8px, transparent 1.4px),
            radial-gradient(circle at 78% 48%, rgba(250, 250, 255, 0.22) 0 0.8px, transparent 1.4px),
            radial-gradient(ellipse 60% 32% at 64% 51%, rgba(93, 129, 164, 0.10), transparent 70%),
            radial-gradient(ellipse 28% 18% at 38% 66%, rgba(58, 92, 124, 0.08), transparent 74%);
          background-size: auto;
          animation: home-dual-deep-space 42s ease-in-out infinite alternate;
        }

        /* Large sleeping Milky-Way / dust lane, kept behind every readable layer. */
        .home-dual::after {
          content: "";
          position: absolute;
          inset: -18%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 58% 16% at 64% 50%, rgba(248, 250, 255, 0.105) 0%, rgba(218, 232, 246, 0.060) 28%, rgba(131, 168, 198, 0.028) 52%, transparent 74%),
            radial-gradient(ellipse 47% 8% at 64% 50%, rgba(255, 255, 255, 0.09) 0%, rgba(215, 233, 247, 0.034) 48%, transparent 78%),
            radial-gradient(ellipse 75% 10% at 64% 50%, rgba(98, 132, 165, 0.040), transparent 76%);
          filter: blur(8px);
          opacity: 0.82;
          mix-blend-mode: screen;
          transform: rotate(-15deg) scale(1.08);
          transform-origin: center;
          animation: home-dual-milky-drift 38s ease-in-out infinite alternate;
        }

        @keyframes home-dual-deep-space {
          0% { transform: translate3d(-0.5%, -0.4%, 0) scale(1.01); }
          100% { transform: translate3d(0.6%, 0.5%, 0) scale(1.04); }
        }

        @keyframes home-dual-milky-drift {
          0% { transform: rotate(-15deg) translate3d(-1.5%, 0, 0) scale(1.08); }
          100% { transform: rotate(-12deg) translate3d(1.5%, 1%, 0) scale(1.11); }
        }

        /* Keep the left rail clear of its own column edge so PLATFORM? and ? stay intact. */
        .home-dual__rail {
          overflow: visible !important;
          padding-right: 1rem !important;
          box-sizing: content-box !important;
        }
        .home-dual__rail-word {
          width: max-content !important;
          max-width: none !important;
          overflow: visible !important;
          padding-right: 0.18em !important;
          box-sizing: content-box !important;
          transform: translateZ(0);
        }
        .home-dual__layout,
        .home-dual__main,
        .home-dual__intro,
        .home-dual__switcher,
        .home-dual__stage {
          position: relative;
          z-index: 2;
        }

        .home-dual__layout {
          display: block !important;
          position: relative !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          overflow: visible !important;
        }
        .home-dual__rail {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 255px !important;
          min-width: 0 !important;
          min-height: 560px !important;
          gap: 1.65rem !important;
          padding-top: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
        }
        .home-dual__rail-word {
          width: max-content !important;
          max-width: none !important;
          font-size: clamp(3.15rem, 3.8vw, 3.9rem) !important;
          line-height: 0.86 !important;
          letter-spacing: -0.055em !important;
          padding-right: 0.18em !important;
        }
        .home-dual__main {
          width: min(900px, calc(100% - 2rem)) !important;
          max-width: 900px !important;
          margin: 0 auto !important;
        }
        .home-dual__intro-copy { width: 100%; }
        @media (max-width: 780px) {
          .home-dual__rail {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            width: auto !important;
            min-height: 0 !important;
            gap: 1rem !important;
            margin: 0 0 3rem !important;
            align-items: center !important;
            text-align: center !important;
          }
          .home-dual__rail-word {
            font-size: clamp(3rem, 12vw, 4.5rem) !important;
            line-height: 0.88 !important;
          }
          .home-dual__main {
            width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>

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
            <div className="home-dual__intro-copy">
              <h2 id={`${groupId}-title`}>One marketplace. Two ways to grow.</h2>
              <p>
                Built for the people hiring for real needs and the students ready to
                turn practical skills into meaningful opportunities.
              </p>
            </div>
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
