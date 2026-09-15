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

const STAR_PALETTE = [
  { name: 'white', rgb: [238, 246, 255] },
  { name: 'green', rgb: [148, 255, 191] },
  { name: 'mint', rgb: [193, 255, 222] },
  { name: 'purple', rgb: [208, 156, 255] },
  { name: 'pink', rgb: [255, 152, 203] },
  { name: 'orange', rgb: [255, 183, 105] },
  { name: 'blue', rgb: [140, 198, 255] },
];

function createCosmicStar(width, height, bandBias = 0.62) {
  const useBand = Math.random() < bandBias;
  const angle = -0.27;
  const bandThickness = height * 0.17;
  const centerX = width * 0.60;
  const centerY = height * 0.53;

  let x;
  let y;

  if (useBand) {
    const along = (Math.random() - 0.5) * width * 1.25;
    const across = (Math.random() - 0.5) * bandThickness * (0.45 + Math.random() * 1.8);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    x = centerX + along * cos - across * sin;
    y = centerY + along * sin + across * cos;
  } else {
    x = Math.random() * width;
    y = Math.random() * height;
  }

  const palette = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
  const large = Math.random() < 0.045;

  return {
    baseX: x,
    baseY: y,
    x,
    y,
    radius: large ? randomBetween(1.05, 1.9) : randomBetween(0.35, 1.05),
    alpha: large ? randomBetween(0.52, 0.92) : randomBetween(0.24, 0.78),
    twinkle: randomBetween(0.45, 1.7),
    phase: Math.random() * Math.PI * 2,
    drift: randomBetween(0.000008, 0.000028),
    hue: palette,
    inBand: useBand,
    swirl: randomBetween(-1, 1),
  };
}

function createDustGrain(width, height) {
  const angle = -0.27;
  const centerX = width * 0.60;
  const centerY = height * 0.53;
  const along = (Math.random() - 0.5) * width * 1.22;
  const across = (Math.random() - 0.5) * height * 0.26;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const palette = STAR_PALETTE[1 + Math.floor(Math.random() * (STAR_PALETTE.length - 1))];

  return {
    baseX: centerX + along * cos - across * sin,
    baseY: centerY + along * sin + across * cos,
    x: 0,
    y: 0,
    size: randomBetween(0.4, 1.25),
    alpha: randomBetween(0.08, 0.34),
    phase: Math.random() * Math.PI * 2,
    drift: randomBetween(0.000004, 0.000018),
    hue: palette,
    wave: randomBetween(0.7, 1.8),
  };
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function drawNebula(ctx, width, height, time) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const nebulae = [
    { x: 0.58, y: 0.52, rx: 0.48, ry: 0.17, color: [52, 255, 155], alpha: 0.075, pulse: 0.010, drift: 0.000018 },
    { x: 0.74, y: 0.34, rx: 0.25, ry: 0.16, color: [144, 88, 255], alpha: 0.035, pulse: 0.008, drift: -0.000014 },
    { x: 0.39, y: 0.63, rx: 0.23, ry: 0.16, color: [255, 92, 174], alpha: 0.032, pulse: 0.009, drift: 0.000012 },
    { x: 0.69, y: 0.70, rx: 0.24, ry: 0.14, color: [255, 165, 82], alpha: 0.024, pulse: 0.008, drift: -0.000011 },
    { x: 0.18, y: 0.30, rx: 0.20, ry: 0.15, color: [93, 169, 255], alpha: 0.018, pulse: 0.007, drift: 0.00001 },
  ];

  for (const cloud of nebulae) {
    const driftX = Math.sin(time * cloud.drift + cloud.y * 8) * width * 0.008;
    const driftY = Math.cos(time * cloud.drift * 0.8 + cloud.x * 7) * height * 0.006;
    const pulse = 1 + Math.sin(time * cloud.pulse + cloud.x * 12) * 0.08;
    const centerX = width * cloud.x + driftX;
    const centerY = height * cloud.y + driftY;
    const radius = Math.max(width, height) * cloud.rx * pulse;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, rgba(cloud.color, cloud.alpha));
    gradient.addColorStop(0.38, rgba(cloud.color, cloud.alpha * 0.48));
    gradient.addColorStop(0.72, rgba(cloud.color, cloud.alpha * 0.10));
    gradient.addColorStop(1, rgba(cloud.color, 0));
    ctx.fillStyle = gradient;
    ctx.filter = 'blur(18px)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, Math.max(radius * cloud.ry / cloud.rx, 1), -0.27, 0, Math.PI * 2);
    ctx.fill();
  }

  const laneCenterX = width * 0.60;
  const laneCenterY = height * 0.53;
  const laneGradient = ctx.createRadialGradient(laneCenterX, laneCenterY, 0, laneCenterX, laneCenterY, width * 0.48);
  laneGradient.addColorStop(0, 'rgba(182, 255, 211, 0.045)');
  laneGradient.addColorStop(0.18, 'rgba(84, 245, 153, 0.035)');
  laneGradient.addColorStop(0.44, 'rgba(43, 184, 116, 0.018)');
  laneGradient.addColorStop(0.76, 'rgba(15, 75, 55, 0.008)');
  laneGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = laneGradient;
  ctx.filter = 'blur(22px)';
  ctx.save();
  ctx.translate(laneCenterX, laneCenterY);
  ctx.rotate(-0.27);
  ctx.fillRect(-width * 0.60, -height * 0.19, width * 1.20, height * 0.38);
  ctx.restore();

  ctx.restore();
}

function drawCosmicField(ctx, width, height, stars, dust, mouse, time) {
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#02060b');
  background.addColorStop(0.45, '#03100c');
  background.addColorStop(1, '#02050a');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  drawNebula(ctx, width, height, time);

  const interactionRadius = Math.min(250, Math.max(150, width * 0.14));
  const interactionStrength = 56;
  const relax = 0.032;
  const ambientTime = time * 0.00008;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (const star of stars) {
    const ambientX = star.baseX + Math.sin(time * star.drift + star.phase) * (star.inBand ? 5 : 2.2);
    const ambientY = star.baseY + Math.cos(time * star.drift * 0.82 + star.phase) * (star.inBand ? 2.4 : 1.3);

    let targetX = ambientX;
    let targetY = ambientY;

    if (mouse.active) {
      const dx = ambientX - mouse.x;
      const dy = ambientY - mouse.y;
      const distance = Math.hypot(dx, dy);
      if (distance < interactionRadius && distance > 0.001) {
        const falloff = 1 - distance / interactionRadius;
        const force = falloff * falloff * interactionStrength;
        const nx = dx / distance;
        const ny = dy / distance;
        const tx = -ny * star.swirl * force * 0.32;
        const ty = nx * star.swirl * force * 0.32;
        targetX += nx * force + tx;
        targetY += ny * force + ty;
      }
    }

    star.x += (targetX - star.x) * relax;
    star.y += (targetY - star.y) * relax;

    const pulse = 0.76 + Math.sin(time * star.twinkle * 0.0025 + star.phase) * 0.24;
    const alpha = Math.max(0.05, star.alpha * pulse);
    const main = rgba(star.hue.rgb, alpha);

    if (star.radius > 1.15) {
      ctx.shadowBlur = 13;
      ctx.shadowColor = rgba(star.hue.rgb, alpha * 0.7);
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = main;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(width * 0.60, height * 0.53);
  ctx.rotate(-0.27);
  const dustInteractionRadius = Math.min(280, Math.max(170, width * 0.17));

  for (const grain of dust) {
    const dx = Math.sin(time * grain.drift + grain.phase) * (10 + grain.wave * 4);
    const dy = Math.cos(time * grain.drift * 0.72 + grain.phase) * 2.6;
    let px = grain.baseX - width * 0.60 + dx;
    let py = grain.baseY - height * 0.53 + dy;

    if (mouse.active) {
      const worldDx = px + width * 0.60 - mouse.x;
      const worldDy = py + height * 0.53 - mouse.y;
      const distance = Math.hypot(worldDx, worldDy);
      if (distance < dustInteractionRadius && distance > 0.001) {
        const falloff = 1 - distance / dustInteractionRadius;
        const force = falloff * falloff * 42;
        px += (worldDx / distance) * force;
        py += (worldDy / distance) * force;
      }
    }

    const pulse = 0.65 + Math.sin(time * grain.wave * 0.0017 + grain.phase) * 0.35;
    ctx.fillStyle = rgba(grain.hue.rgb, grain.alpha * pulse);
    ctx.beginPath();
    ctx.arc(px, py, grain.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Very subtle flowing dust threads; these are deliberately dim so the copy remains dominant.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.lineWidth = 0.45;
  for (let i = 0; i < 48; i += 1) {
    const p = i / 48;
    const flow = (ambientTime * (0.55 + p * 0.25) + p) % 1;
    const x = -width * 0.1 + flow * width * 1.2;
    const y = height * (0.46 + Math.sin(flow * Math.PI * 2.2 + i) * 0.06);
    const length = 12 + (i % 5) * 4;
    const hue = STAR_PALETTE[1 + (i % (STAR_PALETTE.length - 1))];
    ctx.strokeStyle = rgba(hue.rgb, 0.035 + (i % 4) * 0.008);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y - 1.3);
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
  const mouseRef = useRef({ x: 0, y: 0, active: false });
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
    let dpr = 1;
    let frame = 0;
    let stars = [];
    let dust = [];
    let disposed = false;
    let lastDraw = 0;

    const rebuild = () => {
      const rect = section.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.min(2200, Math.max(1200, Math.floor((width * height) / 3400)));
      const dustCount = Math.min(1250, Math.max(700, Math.floor((width * height) / 5200)));
      stars = Array.from({ length: starCount }, () => createCosmicStar(width, height, 0.67));
      dust = Array.from({ length: dustCount }, () => createDustGrain(width, height));
    };

    const updateMouse = (event) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const clearMouse = () => {
      mouseRef.current.active = false;
    };

    const draw = (time) => {
      if (disposed) return;
      if (time - lastDraw < 16) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      drawCosmicField(ctx, width, height, stars, dust, mouseRef.current, time);
      frame = window.requestAnimationFrame(draw);
    };

    rebuild();
    section.addEventListener('pointermove', updateMouse, { passive: true });
    section.addEventListener('pointerleave', clearMouse, { passive: true });
    window.addEventListener('resize', rebuild);
    frame = window.requestAnimationFrame(draw);

    return () => {
      disposed = true;
      section.removeEventListener('pointermove', updateMouse);
      section.removeEventListener('pointerleave', clearMouse);
      window.removeEventListener('resize', rebuild);
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
