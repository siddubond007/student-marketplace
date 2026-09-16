import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, GraduationCap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HomeDualPerspective.css';

const PERSPECTIVES = {
  client: {
    eyebrow: 'FOR CLIENTS',
    title: 'Find student talent that fits the work.',
    body: 'Explore practical skills, review profiles, and choose the student whose capabilities match your project. The marketplace is built to make discovering student talent feel clear and focused.',
    items: [
      ['Discover relevant skills', 'Start with the kind of work you need and narrow your search around practical capabilities.'],
      ['Compare before choosing', 'Use profiles, portfolios, and project context to understand fit before you move forward.'],
      ['Turn needs into opportunities', 'Create project opportunities that let students apply what they already know to real work.'],
    ],
    action: 'Explore Student Talent', to: '/gigs', icon: BriefcaseBusiness,
  },
  student: {
    eyebrow: 'FOR STUDENTS',
    title: 'Turn your skills into experience and opportunity.',
    body: 'Show what you can do, discover work that matches your strengths, and build practical experience that adds substance to your portfolio and professional journey.',
    items: [
      ['Showcase your skills', 'Present your capabilities through your profile, portfolio work, and the services you can offer.'],
      ['Find work that fits', 'Discover project opportunities where your current skills can solve real problems.'],
      ['Grow your professional story', 'Use each relevant opportunity to build experience, portfolio evidence, visibility, and confidence.'],
    ],
    action: 'Start Building Your Profile', to: '/register', icon: GraduationCap,
  },
};

const STAR_PALETTE = [
  [238, 246, 255], [148, 255, 191], [193, 255, 222],
  [208, 156, 255], [255, 152, 203], [255, 183, 105], [140, 198, 255],
];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const randomBetween = (min, max) => min + Math.random() * (max - min);
const rgba = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

function isQuietContentZone(width, height, x, y) {
  return x > width * 0.28 && x < width * 0.84 && y > height * 0.08 && y < height * 0.76;
}

function createCosmicStar(width, height, bandBias = 0.48) {
  const useBand = Math.random() < bandBias;
  const angle = -0.27;
  const centerX = width * 0.60;
  const centerY = height * 0.53;
  let x;
  let y;

  if (useBand) {
    const along = (Math.random() - 0.5) * width * 1.38;
    const across = (Math.random() - 0.5) * height * 0.24 * (0.5 + Math.random() * 1.8);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    x = centerX + along * cos - across * sin;
    y = centerY + along * sin + across * cos;
  } else {
    x = Math.random() * width;
    y = Math.random() * height;
  }

  x = clamp(x, -30, width + 30);
  y = clamp(y, -30, height + 30);
  const quiet = isQuietContentZone(width, height, x, y);
  const palette = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
  const bright = Math.random() < (quiet ? 0.008 : 0.055);
  const interactive = !quiet && Math.random() < 0.10;
  const animated = bright || interactive || Math.random() < (quiet ? 0.05 : 0.13);

  return {
    baseX: x, baseY: y, x, y,
    radius: bright ? randomBetween(1.25, 2.25) : quiet ? randomBetween(0.28, 0.70) : randomBetween(0.42, 1.35),
    alpha: bright ? randomBetween(0.58, 0.95) : quiet ? randomBetween(0.14, 0.40) : randomBetween(0.30, 0.88),
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: randomBetween(0.0007, 0.0018),
    driftX: randomBetween(-0.000015, 0.000015),
    driftY: randomBetween(-0.00001, 0.00001),
    hue: palette, bright, interactive, animated, quiet, swirl: randomBetween(-1, 1),
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
  const baseX = centerX + along * cos - across * sin;
  const baseY = centerY + along * sin + across * cos;
  const quiet = isQuietContentZone(width, height, baseX, baseY);
  const palette = STAR_PALETTE[1 + Math.floor(Math.random() * (STAR_PALETTE.length - 1))];
  return {
    baseX, baseY,
    size: quiet ? randomBetween(0.22, 0.52) : randomBetween(0.38, 1.25),
    alpha: quiet ? randomBetween(0.018, 0.055) : randomBetween(0.055, 0.20),
    phase: Math.random() * Math.PI * 2,
    drift: randomBetween(0.000003, 0.000012), hue: palette, quiet,
  };
}

function drawNebulaToCanvas(canvas, width, height) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#01050a');
  background.addColorStop(0.48, '#02090b');
  background.addColorStop(1, '#010408');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'screen';
  const clouds = [
    [0.56, 0.52, 0.50, 0.20, [45, 238, 139], 0.038],
    [0.76, 0.30, 0.28, 0.16, [133, 78, 235], 0.017],
    [0.38, 0.66, 0.25, 0.18, [239, 78, 160], 0.016],
    [0.72, 0.72, 0.25, 0.15, [249, 151, 80], 0.013],
    [0.14, 0.30, 0.22, 0.18, [76, 150, 247], 0.010],
  ];

  clouds.forEach(([x, y, rx, ry, color, alpha]) => {
    const cx = width * x;
    const cy = height * y;
    const radius = Math.max(width, height) * rx;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, rgba(color, alpha));
    gradient.addColorStop(0.42, rgba(color, alpha * 0.42));
    gradient.addColorStop(0.76, rgba(color, alpha * 0.08));
    gradient.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = gradient;
    ctx.filter = 'blur(18px)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, Math.max(radius * ry / rx, 1), -0.27, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';
}

function prepareStaticStars(canvas, width, height, stars, dpr) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'screen';
  ctx.shadowBlur = 0;

  stars.forEach((star) => {
    if (star.animated || star.interactive || star.bright) return;
    ctx.fillStyle = rgba(star.hue, star.alpha * 0.86);
    ctx.beginPath();
    ctx.arc(star.baseX, star.baseY, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = 'source-over';
}

function prepareStaticDust(canvas, width, height, dust, dpr) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'screen';
  ctx.save();
  ctx.translate(width * 0.60, height * 0.53);
  ctx.rotate(-0.27);

  dust.forEach((grain) => {
    if (!grain.quiet || Math.random() > 0.82) return;
    ctx.fillStyle = rgba(grain.hue, grain.alpha * 0.82);
    ctx.beginPath();
    ctx.arc(grain.baseX - width * 0.60, grain.baseY - height * 0.53, grain.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';
}

function drawDynamicStar(ctx, star, time, mouse, interactionRadius) {
  let x = star.baseX;
  let y = star.baseY;

  if (star.animated) {
    x += Math.sin(time * star.driftX + star.phase) * (star.bright ? 4 : 1.7);
    y += Math.cos(time * star.driftY + star.phase) * (star.bright ? 2 : 1.0);
  }

  if (star.interactive && mouse.active) {
    const dx = x - mouse.x;
    const dy = y - mouse.y;
    const distSq = dx * dx + dy * dy;
    const radiusSq = interactionRadius * interactionRadius;
    if (distSq < radiusSq && distSq > 1) {
      const distance = Math.sqrt(distSq);
      const falloff = 1 - distance / interactionRadius;
      const force = falloff * falloff * 58;
      const nx = dx / distance;
      const ny = dy / distance;
      x += nx * force - ny * star.swirl * force * 0.26;
      y += ny * force + nx * star.swirl * force * 0.26;
    }
  }

  const follow = star.interactive ? 0.10 : 0.055;
  star.x += (x - star.x) * follow;
  star.y += (y - star.y) * follow;

  const pulse = star.animated ? 0.78 + Math.sin(time * star.twinkleSpeed + star.phase) * 0.22 : 0.86;
  const alpha = Math.max(0.035, star.alpha * pulse);
  ctx.fillStyle = rgba(star.hue, alpha);
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  ctx.fill();

  if (star.bright) {
    const arm = star.radius * 2.8;
    ctx.strokeStyle = rgba(star.hue, alpha * 0.30);
    ctx.lineWidth = 0.45;
    ctx.beginPath();
    ctx.moveTo(star.x - arm, star.y);
    ctx.lineTo(star.x + arm, star.y);
    ctx.moveTo(star.x, star.y - arm);
    ctx.lineTo(star.x, star.y + arm);
    ctx.stroke();
  }
}

function PerspectiveContent({ perspective }) {
  const Icon = perspective.icon;
  return (
    <div className="home-dual__card-content">
      <div className="home-dual__card-top"><div className="home-dual__role-icon"><Icon aria-hidden="true" /></div><span>{perspective.eyebrow}</span></div>
      <div className="home-dual__card-body">
        <h3>{perspective.title}</h3>
        <p>{perspective.body}</p>
        <div className="home-dual__items">
          {perspective.items.map(([title, text]) => (
            <div className="home-dual__item" key={title}><span className="home-dual__item-number" aria-hidden="true" /><div><h4>{title}</h4><p>{text}</p></div></div>
          ))}
        </div>
        <Link to={perspective.to} className="home-dual__cta"><span>{perspective.action}</span><ArrowRight aria-hidden="true" /></Link>
      </div>
      <div className="home-dual__card-footer"><span className="home-dual__footer-line" aria-hidden="true" /><span>{perspective === PERSPECTIVES.client ? 'A clearer way to discover student capability.' : 'A clearer way to turn capability into opportunity.'}</span></div>
    </div>
  );
}

export default function HomeDualPerspective() {
  const [active, setActive] = useState('client');
  const sectionRef = useRef(null);
  const galaxyCanvasRef = useRef(null);
  const nebulaCanvasRef = useRef(null);
  const staticStarsCanvasRef = useRef(null);
  const staticDustCanvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const groupId = useId();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 92%', 'end 34%'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 112, damping: 27, mass: 0.72, restSpeed: 0.001, restDelta: 0.001 });
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
    const nebulaCanvas = nebulaCanvasRef.current;
    const staticStarsCanvas = staticStarsCanvasRef.current;
    const staticDustCanvas = staticDustCanvasRef.current;
    if (!section || !canvas || !nebulaCanvas || !staticStarsCanvas || !staticDustCanvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let lastDraw = 0;
    let disposed = false;
    let visible = false;
    let stars = [];
    let dynamicStars = [];
    let dust = [];
    let dynamicDust = [];

    const rebuild = () => {
      const rect = section.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const starCount = clamp(Math.floor(area / 3600), 650, 1450);
      const dustCount = clamp(Math.floor(area / 8500), 220, 520);
      stars = Array.from({ length: starCount }, () => createCosmicStar(width, height, 0.48));
      dust = Array.from({ length: dustCount }, () => createDustGrain(width, height));
      dynamicStars = stars.filter((star) => star.animated || star.interactive || star.bright);
      dynamicDust = dust.filter((grain) => !grain.quiet && Math.random() < 0.24);

      drawNebulaToCanvas(nebulaCanvas, width, height);
      prepareStaticStars(staticStarsCanvas, width, height, stars, dpr);
      prepareStaticDust(staticDustCanvas, width, height, dust, dpr);
    };

    const updatePointer = (event) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const clearPointer = () => { mouseRef.current.active = false; };

    const draw = (time) => {
      if (disposed) return;
      frame = 0;
      if (!visible) return;
      if (time - lastDraw < 32) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(nebulaCanvas, 0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(staticStarsCanvas, 0, 0, width, height);
      ctx.drawImage(staticDustCanvas, 0, 0, width, height);

      const mouse = mouseRef.current;
      const interactionRadius = Math.min(280, Math.max(150, width * 0.13));

      for (const star of dynamicStars) {
        drawDynamicStar(ctx, star, time, mouse, interactionRadius);
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.translate(width * 0.60, height * 0.53);
      ctx.rotate(-0.27);
      for (const grain of dynamicDust) {
        const dx = Math.sin(time * grain.drift + grain.phase) * (8 + grain.size * 4);
        const dy = Math.cos(time * grain.drift * 0.7 + grain.phase) * 2;
        let px = grain.baseX - width * 0.60 + dx;
        let py = grain.baseY - height * 0.53 + dy;
        if (mouse.active) {
          const worldDx = px + width * 0.60 - mouse.x;
          const worldDy = py + height * 0.53 - mouse.y;
          const radius = 220;
          const distSq = worldDx * worldDx + worldDy * worldDy;
          if (distSq < radius * radius && distSq > 1) {
            const distance = Math.sqrt(distSq);
            const falloff = 1 - distance / radius;
            const force = falloff * falloff * 30;
            px += (worldDx / distance) * force;
            py += (worldDy / distance) * force;
          }
        }
        ctx.fillStyle = rgba(grain.hue, grain.alpha);
        ctx.beginPath();
        ctx.arc(px, py, grain.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.globalCompositeOperation = 'source-over';
      frame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = window.requestAnimationFrame(draw);
    }, { rootMargin: '180px 0px' });

    rebuild();
    observer.observe(section);
    section.addEventListener('pointermove', updatePointer, { passive: true });
    section.addEventListener('pointerleave', clearPointer, { passive: true });
    window.addEventListener('resize', rebuild);

    return () => {
      disposed = true;
      observer.disconnect();
      section.removeEventListener('pointermove', updatePointer);
      section.removeEventListener('pointerleave', clearPointer);
      window.removeEventListener('resize', rebuild);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="home-dual" aria-labelledby={`${groupId}-title`}>
      <canvas ref={nebulaCanvasRef} className="home-dual__galaxy-canvas" aria-hidden="true" />
      <canvas ref={staticStarsCanvasRef} className="home-dual__galaxy-canvas" aria-hidden="true" />
      <canvas ref={staticDustCanvasRef} className="home-dual__galaxy-canvas" aria-hidden="true" />
      <canvas ref={galaxyCanvasRef} className="home-dual__galaxy-canvas" aria-hidden="true" />
      <div className="home-dual__layout">
        <motion.aside className="home-dual__rail" aria-label="Why this platform" style={{ x: railX, opacity: railOpacity, scale: railScale }}>
          <Sparkles aria-hidden="true" />
          <span className="home-dual__rail-word">WHY</span>
          <span className="home-dual__rail-word">THIS</span>
          <span className="home-dual__rail-word">PLATFORM?</span>
        </motion.aside>
        <div className="home-dual__main">
          <motion.div className="home-dual__intro" style={{ y: introY, opacity: introOpacity }}>
            <div className="home-dual__intro-copy"><h2 id={`${groupId}-title`}>One marketplace. Two ways to grow.</h2><p>Built for the people hiring for real needs and the students ready to turn practical skills into meaningful opportunities.</p></div>
          </motion.div>
          <motion.div className="home-dual__switcher" role="group" aria-label="Choose your perspective" style={{ y: switcherY, opacity: switcherOpacity }}>
            <button type="button" className={`home-dual__switch ${active === 'client' ? 'is-active' : ''}`} aria-pressed={active === 'client'} onClick={() => setActive('client')}><BriefcaseBusiness aria-hidden="true" /><span>I’m Hiring</span></button>
            <button type="button" className={`home-dual__switch ${active === 'student' ? 'is-active' : ''}`} aria-pressed={active === 'student'} onClick={() => setActive('student')}><GraduationCap aria-hidden="true" /><span>I’m a Student</span></button>
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
