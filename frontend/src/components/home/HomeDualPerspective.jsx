import React, { useEffect, useId, useRef, useState } from 'react';
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

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createGalaxyParticle(width, height) {
  const bandY = height * 0.54;
  const bandSpread = height * 0.16;
  const inBand = Math.random() < 0.72;
  const x = Math.random() * width;
  const normalizedX = x / Math.max(width, 1);
  const centerLine = bandY + Math.sin(normalizedX * Math.PI * 2.2) * height * 0.05;
  const y = inBand
    ? centerLine + (Math.random() - 0.5) * bandSpread * (0.45 + Math.random() * 1.35)
    : Math.random() * height;

  const roll = Math.random();
  let tint = 'white';
  if (roll > 0.91) tint = 'warm';
  else if (roll > 0.79) tint = 'blue';
  else if (roll > 0.60) tint = 'ice';

  return {
    x,
    y,
    baseX: x,
    baseY: y,
    radius: randomBetween(0.35, 1.35),
    alpha: randomBetween(0.18, inBand ? 0.9 : 0.58),
    twinkle: randomBetween(0.45, 1.9),
    phase: Math.random() * Math.PI * 2,
    drift: randomBetween(0.00015, 0.0008),
    hue: tint,
    inBand,
  };
}

function drawGalaxyBackdrop(ctx, width, height, particles, time) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(1, 5, 12, 0.98)');
  gradient.addColorStop(0.5, 'rgba(2, 8, 17, 0.93)');
  gradient.addColorStop(1, 'rgba(1, 4, 10, 0.98)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(width * 0.61, height * 0.51);
  ctx.rotate(-0.17);

  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.55);
  halo.addColorStop(0, 'rgba(230, 240, 250, 0.13)');
  halo.addColorStop(0.18, 'rgba(188, 214, 234, 0.09)');
  halo.addColorStop(0.42, 'rgba(100, 145, 182, 0.045)');
  halo.addColorStop(0.76, 'rgba(34, 67, 96, 0.014)');
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = halo;
  ctx.filter = 'blur(10px)';
  ctx.fillRect(-width * 0.62, -height * 0.35, width * 1.24, height * 0.70);

  const dust = ctx.createLinearGradient(-width * 0.55, 0, width * 0.55, 0);
  dust.addColorStop(0, 'rgba(195, 221, 240, 0)');
  dust.addColorStop(0.19, 'rgba(203, 227, 243, 0.035)');
  dust.addColorStop(0.48, 'rgba(245, 249, 253, 0.12)');
  dust.addColorStop(0.72, 'rgba(170, 204, 228, 0.045)');
  dust.addColorStop(1, 'rgba(195, 221, 240, 0)');
  ctx.fillStyle = dust;
  ctx.filter = 'blur(18px)';
  ctx.fillRect(-width * 0.58, -height * 0.11, width * 1.16, height * 0.22);

  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.27);
  core.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  core.addColorStop(0.18, 'rgba(234, 245, 253, 0.075)');
  core.addColorStop(0.44, 'rgba(167, 203, 229, 0.025)');
  core.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = core;
  ctx.filter = 'blur(7px)';
  ctx.fillRect(-width * 0.3, -height * 0.17, width * 0.6, height * 0.34);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const particle of particles) {
    const dx = Math.sin(time * particle.drift + particle.phase) * (particle.inBand ? 3.5 : 1.7);
    const dy = Math.cos(time * particle.drift * 0.72 + particle.phase) * (particle.inBand ? 1.8 : 1.1);
    const x = particle.baseX + dx;
    const y = particle.baseY + dy;
    const pulse = 0.72 + Math.sin(time * particle.twinkle + particle.phase) * 0.28;
    const alpha = Math.max(0.06, particle.alpha * pulse);

    let main = `rgba(239,247,255,${alpha})`;
    let glow = `rgba(226,242,252,${alpha * 0.22})`;
    if (particle.hue === 'warm') {
      main = `rgba(255,195,132,${alpha * 0.86})`;
      glow = `rgba(255,186,112,${alpha * 0.18})`;
    } else if (particle.hue === 'blue') {
      main = `rgba(148,198,236,${alpha * 0.9})`;
      glow = `rgba(126,189,236,${alpha * 0.18})`;
    } else if (particle.hue === 'ice') {
      main = `rgba(206,231,246,${alpha})`;
      glow = `rgba(188,220,241,${alpha * 0.20})`;
    }

    ctx.beginPath();
    ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = main;
    ctx.fill();

    if (particle.radius > 1.02) {
      ctx.beginPath();
      ctx.arc(x, y, particle.radius * 3.6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
  }
  ctx.restore();

  // A few slow, elongated dust streaks to make the backdrop feel like a living deep field.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.lineWidth = 0.55;
  const streakCount = 26;
  for (let i = 0; i < streakCount; i += 1) {
    const t = i / streakCount;
    const x = ((t * 1.17 + time * 0.000012 * (i % 2 ? 1 : -1)) % 1) * width;
    const y = height * (0.44 + Math.sin(t * Math.PI * 2.6) * 0.11);
    ctx.strokeStyle = `rgba(210,227,240,${0.035 + (i % 5) * 0.008})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10 + (i % 4) * 3, y - 1.2);
    ctx.stroke();
  }
  ctx.restore();
}

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
  const galaxyCanvasRef = useRef(null);
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

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = galaxyCanvasRef.current;
    if (!section || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let particles = [];
    let disposed = false;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particles.length) {
        const count = Math.min(980, Math.max(520, Math.floor((width * height) / 6200)));
        particles = Array.from({ length: count }, () => createGalaxyParticle(width, height));
      } else {
        particles.forEach((particle) => {
          particle.baseX = Math.min(Math.max(particle.baseX, 0), width);
          particle.baseY = Math.min(Math.max(particle.baseY, 0), height);
          particle.x = particle.baseX;
          particle.y = particle.baseY;
        });
      }
    };

    const draw = (time) => {
      if (disposed) return;
      drawGalaxyBackdrop(ctx, width, height, particles, time);
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(draw);

    return () => {
      disposed = true;
      window.removeEventListener('resize', resize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="home-dual" aria-labelledby={`${groupId}-title`}>
      <canvas
        ref={galaxyCanvasRef}
        className="home-dual__galaxy-canvas"
        aria-hidden="true"
      />

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
