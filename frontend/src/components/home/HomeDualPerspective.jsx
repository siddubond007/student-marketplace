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

function isQuietContentZone(width, height, x, y) {
  return (
    x > width * 0.28 &&
    x < width * 0.84 &&
    y > height * 0.08 &&
    y < height * 0.76
  );
}

function createCosmicStar(width, height, bandBias = 0.52) {
  const useBand = Math.random() < bandBias;
  const angle = -0.27;
  const bandThickness = height * 0.23;
  const centerX = width * 0.60;
  const centerY = height * 0.53;

  let x;
  let y;

  if (useBand) {
    const along = (Math.random() - 0.5) * width * 1.38;
    const across = (Math.random() - 0.5) * bandThickness * (0.5 + Math.random() * 1.9);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    x = centerX + along * cos - across * sin;
    y = centerY + along * sin + across * cos;
  } else {
    x = Math.random() * width;
    y = Math.random() * height;
  }

  x = Math.max(-40, Math.min(width + 40, x));
  y = Math.max(-40, Math.min(height + 40, y));

  const palette = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
  const quiet = isQuietContentZone(width, height, x, y);
  const hero = Math.random() < (quiet ? 0.012 : 0.085);
  const visibility = quiet ? randomBetween(0.25, 0.52) : 1;

  return {
    baseX: x,
    baseY: y,
    x,
    y,
    radius: hero
      ? randomBetween(1.4, 2.7)
      : quiet
        ? randomBetween(0.30, 0.72)
        : randomBetween(0.48, 1.48),
    alpha: hero
      ? randomBetween(0.62, 1)
      : quiet
        ? randomBetween(0.15, 0.42)
        : randomBetween(0.34, 0.92),
    twinkle: randomBetween(0.55, 1.8),
    phase: Math.random() * Math.PI * 2,
    drift: randomBetween(0.000008, 0.000032),
    hue: palette,
    inBand: useBand,
    swirl: randomBetween(-1, 1),
    quiet,
    visibility,
    hero,
  };
}

function createDustGrain(width, height) {
  const angle = -0.27;
  const centerX = width * 0.60;
  const centerY = height * 0.53;
  const along = (Math.random() - 0.5) * width * 1.38;
  const across = (Math.random() - 0.5) * height * 0.34;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const palette = STAR_PALETTE[1 + Math.floor(Math.random() * (STAR_PALETTE.length - 1))];

  const baseX = centerX + along * cos - across * sin;
  const baseY = centerY + along * sin + across * cos;
  const quiet = isQuietContentZone(width, height, baseX, baseY);

  return {
    baseX,
    baseY,
    x: 0,
    y: 0,
    size: quiet ? randomBetween(0.28, 0.62) : randomBetween(0.45, 1.45),
    alpha: quiet ? randomBetween(0.025, 0.08) : randomBetween(0.07, 0.28),
    phase: Math.random() * Math.PI * 2,
    drift: randomBetween(0.000004, 0.00002),
    hue: palette,
    wave: randomBetween(0.7, 1.8),
    quiet,
  };
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function drawNebula(ctx, width, height, time) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const nebulae = [
    { x: 0.56, y: 0.52, rx: 0.50, ry: 0.20, color: [45, 238, 139], alpha: 0.052, pulse: 0.009, drift: 0.000015 },
    { x: 0.76, y: 0.30, rx: 0.28, ry: 0.16, color: [133, 78, 235], alpha: 0.024, pulse: 0.008, drift: -0.000012 },
    { x: 0.38, y: 0.66, rx: 0.25, ry: 0.18, color: [239, 78, 160], alpha: 0.022, pulse: 0.009, drift: 0.00001 },
    { x: 0.72, y: 0.72, rx: 0.25, ry: 0.15, color: [249, 151, 80], alpha: 0.018, pulse: 0.007, drift: -0.00001 },
    { x: 0.14, y: 0.30, rx: 0.22, ry: 0.18, color: [76, 150, 247], alpha: 0.015, pulse: 0.006, drift: 0.000009 },
  ];

  for (const cloud of nebulae) {
    const driftX = Math.sin(time * cloud.drift + cloud.y * 8) * width * 0.009;
    const driftY = Math.cos(time * cloud.drift * 0.8 + cloud.x * 7) * height * 0.007;
    const pulse = 1 + Math.sin(time * cloud.pulse + cloud.x * 12) * 0.07;
    const centerX = width * cloud.x + driftX;
    const centerY = height * cloud.y + driftY;
    const radius = Math.max(width, height) * cloud.rx * pulse;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, rgba(cloud.color, cloud.alpha));
    gradient.addColorStop(0.36, rgba(cloud.color, cloud.alpha * 0.44));
    gradient.addColorStop(0.72, rgba(cloud.color, cloud.alpha * 0.08));
    gradient.addColorStop(1, rgba(cloud.color, 0));
    ctx.fillStyle = gradient;
    ctx.filter = 'blur(22px)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, Math.max(radius * cloud.ry / cloud.rx, 1), -0.27, 0, Math.PI * 2);
    ctx.fill();
  }

  const laneCenterX = width * 0.60;
  const laneCenterY = height * 0.53;
  const laneGradient = ctx.createRadialGradient(laneCenterX, laneCenterY, 0, laneCenterX, laneCenterY, width * 0.53);
  laneGradient.addColorStop(0, 'rgba(188, 255, 216, 0.025)');
  laneGradient.addColorStop(0.20, 'rgba(68, 241, 151, 0.021)');
  laneGradient.addColorStop(0.48, 'rgba(33, 156, 101, 0.012)');
  laneGradient.addColorStop(0.78, 'rgba(15, 70, 50, 0.005)');
  laneGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = laneGradient;
  ctx.filter = 'blur(28px)';
  ctx.save();
  ctx.translate(laneCenterX, laneCenterY);
  ctx.rotate(-0.27);
  ctx.fillRect(-width * 0.64, -height * 0.20, width * 1.28, height * 0.40);
  ctx.restore();

  ctx.restore();
}

function drawCosmicField(ctx, width, height, stars, dust, mouse, time) {
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#01050a');
  background.addColorStop(0.45, '#020b0c');
  background.addColorStop(1, '#010408');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  drawNebula(ctx, width, height, time);

  const interactionRadius = Math.min(320, Math.max(190, width * 0.17));
  const interactionStrength = 82;
  const relax = 0.045;
  const ambientTime = time * 0.00008;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (const star of stars) {
    if (star.quiet && star.visibility < 0.36) continue;

    const ambientX = star.baseX + Math.sin(time * star.drift + star.phase) * (star.inBand ? 7 : 2.8);
    const ambientY = star.baseY + Math.cos(time * star.drift * 0.82 + star.phase) * (star.inBand ? 3.2 : 1.6);

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
        const tx = -ny * star.swirl * force * 0.34;
        const ty = nx * star.swirl * force * 0.34;
        targetX += nx * force + tx;
        targetY += ny * force + ty;
      }
    }

    star.x += (targetX - star.x) * relax;
    star.y += (targetY - star.y) * relax;

    const pulse = 0.74 + Math.sin(time * star.twinkle * 0.0025 + star.phase) * 0.26;
    const alpha = Math.max(0.035, star.alpha * pulse);

    ctx.shadowBlur = star.hero ? 18 : star.radius > 1.65 ? 9 : 0;
    ctx.shadowColor = star.hero || star.radius > 1.65
      ? rgba(star.hue.rgb, alpha * 0.72)
      : 'transparent';

    ctx.fillStyle = rgba(star.hue.rgb, alpha);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    if (star.hero) {
      ctx.strokeStyle = rgba(star.hue.rgb, alpha * 0.34);
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.moveTo(star.x - star.radius * 3.5, star.y);
      ctx.lineTo(star.x + star.radius * 3.5, star.y);
      ctx.moveTo(star.x, star.y - star.radius * 3.5);
      ctx.lineTo(star.x, star.y + star.radius * 3.5);
      ctx.stroke();
    }
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(width * 0.60, height * 0.53);
  ctx.rotate(-0.27);
  const dustInteractionRadius = Math.min(340, Math.max(190, width * 0.18));

  for (const grain of dust) {
    const dx = Math.sin(time * grain.drift + grain.phase) * (12 + grain.wave * 5);
    const dy = Math.cos(time * grain.drift * 0.72 + grain.phase) * 3.2;
    let px = grain.baseX - width * 0.60 + dx;
    let py = grain.baseY - height * 0.53 + dy;

    if (mouse.active) {
      const worldDx = px + width * 0.60 - mouse.x;
      const worldDy = py + height * 0.53 - mouse.y;
      const distance = Math.hypot(worldDx, worldDy);
      if (distance < dustInteractionRadius && distance > 0.001) {
        const falloff = 1 - distance / dustInteractionRadius;
        const force = falloff * falloff * 54;
        px += (worldDx / distance) * force;
        py += (worldDy / distance) * force;
      }
    }

    const pulse = 0.64 + Math.sin(time * grain.wave * 0.0017 + grain.phase) * 0.36;
    ctx.fillStyle = rgba(grain.hue.rgb, grain.alpha * pulse);
    ctx.beginPath();
    ctx.arc(px, py, grain.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 64; i += 1) {
    const p = i / 64;
    const flow = (ambientTime * (0.55 + p * 0.32) + p) % 1;
    const x = -width * 0.1 + flow * width * 1.2;
    const y = height * (0.45 + Math.sin(flow * Math.PI * 2.2 + i) * 0.075);
    const length = 14 + (i % 6) * 5;
    const hue = STAR_PALETTE[1 + (i % (STAR_PALETTE.length - 1))];
    ctx.strokeStyle = rgba(hue.rgb, 0.026 + (i % 4) * 0.007);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y - 1.4);
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.min(5200, Math.max(3000, Math.floor((width * height) / 2200)));
      const dustCount = Math.min(1900, Math.max(1100, Math.floor((width * height) / 3900)));
      stars = Array.from({ length: starCount }, () => createCosmicStar(width, height, 0.52));
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
