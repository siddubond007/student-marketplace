import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Code2, GraduationCap, Palette, Search, ShieldCheck, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import HomeScrollCue from './HomeScrollCue.svg';
import './HomeHero.css';

const STAR_COUNT = 360;
const ASTEROID_COUNT = 7;
const ASTRONAUT_COUNT = 6;
const PLANET_COUNT = 4;
const TRAIL_LENGTH = 28;

const randomBetween = (min, max) => min + Math.random() * (max - min);

const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

function makeStar(width, height) {
  const shapeRoll = Math.random();
  const colorRoll = Math.random();

  let kind = 'dot';
  if (shapeRoll > 0.91) kind = 'sparkle';
  else if (shapeRoll > 0.79) kind = 'cross';
  else if (shapeRoll > 0.63) kind = 'diamond';

  let color = 'white';
  if (colorRoll > 0.94) color = 'orange';
  else if (colorRoll > 0.84) color = 'blue';
  else if (colorRoll > 0.71) color = 'ice';

  const x = Math.random() * width;
  const y = Math.random() * height;

  return {
    x,
    y,
    homeX: x,
    homeY: y,
    radius: randomBetween(0.35, 1.5),
    alpha: randomBetween(0.22, 0.92),
    phase: Math.random() * Math.PI * 2,
    speed: randomBetween(0.0008, 0.0028),
    driftX: randomBetween(-0.018, 0.018),
    driftY: randomBetween(-0.012, 0.012),
    kind,
    color,
    twinkle: randomBetween(0.75, 1.8),
    rotation: Math.random() * Math.PI * 2,
  };
}

function makeAsteroid(width, height) {
  const fromLeft = Math.random() < 0.55;
  const speed = randomBetween(0.045, 0.14);

  return {
    x: fromLeft ? -randomBetween(20, 150) : Math.random() * width,
    y: Math.random() * height,
    vx: fromLeft ? speed : randomBetween(-0.035, 0.055),
    vy: randomBetween(0.008, 0.035),
    size: randomBetween(5, 15),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: randomBetween(-0.002, 0.002),
    opacity: randomBetween(0.3, 0.72),
    points: Array.from({ length: Math.floor(randomBetween(6, 10)) }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: randomBetween(0.65, 1.2),
    })),
  };
}

function makeAstronaut(width, height) {
  return {
    x: randomBetween(width * 0.46, width * 0.97),
    y: randomBetween(height * 0.12, height * 0.88),
    vx: randomBetween(-0.018, 0.018),
    vy: randomBetween(-0.014, 0.014),
    rotation: randomBetween(-0.08, 0.08),
    rotationSpeed: randomBetween(-0.00045, 0.00045),
    size: randomBetween(13, 20),
    attraction: 0,
    releaseTimer: 0,
    driftPhase: Math.random() * Math.PI * 2,
  };
}

function makePlanet(width, height, index) {
  const presets = [
    { size: 38, speed: 0.0028 },
    { size: 22, speed: 0.0038 },
    { size: 13, speed: 0.0052 },
    { size: 8, speed: 0.0065 },
  ];

  const preset = presets[index % presets.length];

  return {
    x: randomBetween(width * 0.5, width * 1.08),
    y: randomBetween(height * 0.08, height * 0.92),
    baseX: 0,
    baseY: 0,
    size: preset.size,
    speed: preset.speed,
    phase: Math.random() * Math.PI * 2,
    ring: index === 0 || index === 2,
    orbit: randomBetween(8, 30),
    opacity: randomBetween(0.4, 0.78),
  };
}

function drawStar(ctx, star, time) {
  const pulse =
    star.alpha *
    (0.68 + Math.sin(time * star.speed * star.twinkle + star.phase) * 0.3);

  const alpha = Math.max(0.07, pulse);

  let main = `rgba(240,248,255,${alpha})`;
  let glow = `rgba(235,246,255,${alpha * 0.22})`;

  if (star.color === 'ice') {
    main = `rgba(205,232,249,${alpha})`;
    glow = `rgba(190,225,248,${alpha * 0.25})`;
  } else if (star.color === 'blue') {
    main = `rgba(145,199,239,${alpha})`;
    glow = `rgba(130,190,239,${alpha * 0.27})`;
  } else if (star.color === 'orange') {
    main = `rgba(255,188,108,${alpha})`;
    glow = `rgba(255,178,92,${alpha * 0.30})`;
  }

  ctx.save();
  ctx.translate(star.x, star.y);
  ctx.rotate(star.rotation);

  if (star.kind === 'dot') {
    ctx.beginPath();
    ctx.arc(0, 0, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = main;
    ctx.fill();

    if (star.radius > 1.0) {
      ctx.beginPath();
      ctx.arc(0, 0, star.radius * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
  } else if (star.kind === 'diamond') {
    const r = Math.max(1.0, star.radius * 1.7);

    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.62, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.62, 0);
    ctx.closePath();
    ctx.fillStyle = main;
    ctx.fill();
  } else if (star.kind === 'cross') {
    const r = Math.max(1.3, star.radius * 2.8);

    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.strokeStyle = main;
    ctx.lineWidth = Math.max(0.55, star.radius * 0.55);
    ctx.stroke();
  } else {
    const r = Math.max(1.8, star.radius * 3.5);

    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.25, -r * 0.25);
    ctx.lineTo(r, 0);
    ctx.lineTo(r * 0.25, r * 0.25);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.25, r * 0.25);
    ctx.lineTo(-r, 0);
    ctx.lineTo(-r * 0.25, -r * 0.25);
    ctx.closePath();
    ctx.fillStyle = main;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  ctx.restore();
}

function drawAsteroid(ctx, asteroid) {
  ctx.save();
  ctx.translate(asteroid.x, asteroid.y);
  ctx.rotate(asteroid.rotation);

  ctx.beginPath();

  asteroid.points.forEach((point, index) => {
    const x = Math.cos(point.angle) * asteroid.size * point.radius;
    const y = Math.sin(point.angle) * asteroid.size * point.radius;

    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.closePath();
  ctx.fillStyle = `rgba(110,125,142,${asteroid.opacity})`;
  ctx.fill();

  ctx.strokeStyle = `rgba(190,205,220,${asteroid.opacity * 0.28})`;
  ctx.lineWidth = 0.7;
  ctx.stroke();

  ctx.restore();
}

function drawPlanet(ctx, planet) {
  ctx.save();
  ctx.translate(planet.x, planet.y);

  ctx.beginPath();
  ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(92,116,142,${planet.opacity * 0.32})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    -planet.size * 0.18,
    -planet.size * 0.16,
    planet.size * 0.78,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = `rgba(179,201,222,${planet.opacity * 0.17})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    planet.size * 0.2,
    planet.size * 0.16,
    planet.size * 0.56,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = `rgba(20,42,67,${planet.opacity * 0.52})`;
  ctx.fill();

  if (planet.ring) {
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      planet.size * 1.55,
      planet.size * 0.42,
      -0.18,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = `rgba(184,207,228,${planet.opacity * 0.28})`;
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawAstronaut(ctx, astronaut) {
  ctx.save();
  ctx.translate(astronaut.x, astronaut.y);
  ctx.rotate(astronaut.rotation);

  const s = astronaut.size;

  ctx.fillStyle = 'rgba(210,220,232,0.86)';
  ctx.strokeStyle = 'rgba(245,250,255,0.72)';
  ctx.lineWidth = 0.8;

  ctx.fillRect(-s * 0.38, -s * 0.08, s * 0.76, s * 0.82);
  ctx.strokeRect(-s * 0.38, -s * 0.08, s * 0.76, s * 0.82);

  ctx.beginPath();
  ctx.arc(0, -s * 0.55, s * 0.43, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -s * 0.55, s * 0.27, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(16,34,54,0.94)';
  ctx.fill();

  ctx.fillStyle = 'rgba(160,184,208,0.82)';
  ctx.fillRect(-s * 0.18, s * 0.74, s * 0.12, s * 0.38);
  ctx.fillRect(s * 0.06, s * 0.74, s * 0.12, s * 0.38);

  ctx.strokeStyle = 'rgba(205,220,235,0.72)';
  ctx.beginPath();
  ctx.moveTo(-s * 0.38, s * 0.12);
  ctx.lineTo(-s * 0.7, s * 0.38);
  ctx.moveTo(s * 0.38, s * 0.12);
  ctx.lineTo(s * 0.7, s * 0.38);
  ctx.stroke();

  ctx.fillStyle = 'rgba(120,155,190,0.72)';
  ctx.fillRect(s * 0.2, -s * 0.08, s * 0.16, s * 0.34);

  ctx.restore();
}

export default function HomeHero() {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const canvasRef = useRef(null);
  const milkyWayRef = useRef(null);

  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    lastMoveAt: 0,
  });

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const milkyWay = milkyWayRef.current;

    if (!hero || !canvas || !milkyWay) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    let stars = [];
    let asteroids = [];
    let astronauts = [];
    let planets = [];
    let trail = [];

    const pointer = pointerRef.current;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!stars.length) {
        stars = Array.from({ length: STAR_COUNT }, () =>
          makeStar(width, height)
        );

        asteroids = Array.from({ length: ASTEROID_COUNT }, () =>
          makeAsteroid(width, height)
        );

        astronauts = Array.from({ length: ASTRONAUT_COUNT }, () =>
          makeAstronaut(width, height)
        );

        planets = Array.from({ length: PLANET_COUNT }, (_, index) =>
          makePlanet(width, height, index)
        );
      } else {
        stars.forEach((star) => {
          if (star.x > width) star.x = width * 0.5;
          if (star.y > height) star.y = height * 0.9;
        });

        asteroids.forEach((asteroid) => {
          if (asteroid.x > width + 120) asteroid.x = -60;
        });

        planets.forEach((planet) => {
          if (!planet.baseX) {
            planet.baseX = planet.x;
            planet.baseY = planet.y;
          }
        });
      }
    };

    const updateMilkyWay = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      milkyWay.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(-28deg)`;
      milkyWay.style.opacity = '1';

      pointer.targetX = x;
      pointer.targetY = y;
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      pointer.lastMoveAt = performance.now();
    };

    const onPointerMove = (event) => {
      updateMilkyWay(event);

      trail.push({
        x: pointer.targetX,
        y: pointer.targetY,
        life: 1,
        size: randomBetween(0.7, 2.2),
      });

      if (trail.length > TRAIL_LENGTH) {
        trail.shift();
      }
    };

    const onPointerRawUpdate = (event) => {
      updateMilkyWay(event);
    };

    const onPointerLeave = () => {
      pointer.active = false;
      milkyWay.style.opacity = '0';
    };

    const recycleAsteroid = (asteroid) => {
      if (asteroid.x > width + 80 || asteroid.y > height + 80) {
        asteroid.x = -randomBetween(20, 140);
        asteroid.y = randomBetween(0, height * 0.9);
      }
    };

    const updateAstronaut = (astronaut, time) => {
      astronaut.rotation += astronaut.rotationSpeed;

      if (reducedMotion) {
        astronaut.x += astronaut.vx;
        astronaut.y += astronaut.vy;
        return;
      }

      if (astronaut.releaseTimer > 0) {
        astronaut.releaseTimer -= 1;
        astronaut.x += astronaut.vx;
        astronaut.y += astronaut.vy;

        astronaut.vx *= 0.992;
        astronaut.vy *= 0.992;
      } else {
        const driftX =
          Math.sin(time * 0.00045 + astronaut.driftPhase) * 0.00034;
        const driftY =
          Math.cos(time * 0.00038 + astronaut.driftPhase) * 0.00028;

        astronaut.vx += driftX;
        astronaut.vy += driftY;

        if (pointer.active) {
          const d = distance(astronaut, pointer);

          if (d < 240) {
            const dx = pointer.x - astronaut.x;
            const dy = pointer.y - astronaut.y;

            const strength = Math.max(0, 1 - d / 240) * 0.0052;

            astronaut.vx += dx * strength;
            astronaut.vy += dy * strength;
            astronaut.attraction = Math.max(
              0,
              Math.min(1, 1 - d / 240)
            );

            if (d < 32) {
              const safe = Math.max(d, 1);
              const nx = (astronaut.x - pointer.x) / safe;
              const ny = (astronaut.y - pointer.y) / safe;

              astronaut.vx += nx * 0.22;
              astronaut.vy += ny * 0.22;
              astronaut.releaseTimer = 155;
              astronaut.attraction = 0;
            }
          }
        }

        astronaut.x += astronaut.vx;
        astronaut.y += astronaut.vy;

        astronaut.vx *= 0.996;
        astronaut.vy *= 0.996;

        if (
          astronaut.x < -80 ||
          astronaut.x > width + 80 ||
          astronaut.y < -80 ||
          astronaut.y > height + 80
        ) {
          const replacement = makeAstronaut(width, height);
          Object.assign(astronaut, replacement);
        }
      }
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#020811';
      ctx.fillRect(0, 0, width, height);

      const dust = ctx.createRadialGradient(
        width * 0.78,
        height * 0.38,
        0,
        width * 0.78,
        height * 0.38,
        Math.max(width, height) * 0.55
      );

      dust.addColorStop(0, 'rgba(72,119,164,0.055)');
      dust.addColorStop(1, 'rgba(72,119,164,0)');

      ctx.fillStyle = dust;
      ctx.fillRect(0, 0, width, height);

      const idleFor = performance.now() - pointer.lastMoveAt;
      const releasingStars = pointer.active && idleFor >= 500;

      stars.forEach((star) => {
        if (!reducedMotion) {
          star.x += star.driftX;
          star.y += star.driftY;

          if (star.x < -3) star.x = width + 3;
          if (star.x > width + 3) star.x = -3;
          if (star.y < -3) star.y = height + 3;
          if (star.y > height + 3) star.y = -3;

          if (pointer.active) {
            const d = distance(star, pointer);

            if (!releasingStars && d < 165) {
              const dx = pointer.x - star.x;
              const dy = pointer.y - star.y;
              const pull = (1 - d / 165) * 0.018;

              star.x += dx * pull;
              star.y += dy * pull;
            }

            if (releasingStars && d < 185) {
              const safe = Math.max(d, 1);
              const nx = (star.x - pointer.x) / safe;
              const ny = (star.y - pointer.y) / safe;
              const nearFactor = Math.max(0, 1 - d / 185);

              star.x += nx * (2.2 + nearFactor * 5.2);
              star.y += ny * (2.2 + nearFactor * 5.2);

              star.x += (star.homeX - star.x) * 0.018;
              star.y += (star.homeY - star.y) * 0.018;
            } else if (!releasingStars) {
              star.x += (star.homeX - star.x) * 0.0015;
              star.y += (star.homeY - star.y) * 0.0015;
            }
          } else {
            star.x += (star.homeX - star.x) * 0.0015;
            star.y += (star.homeY - star.y) * 0.0015;
          }
        }

        drawStar(ctx, star, time);
      });

      planets.forEach((planet) => {
        if (!planet.baseX) {
          planet.baseX = planet.x;
          planet.baseY = planet.y;
        }

        if (!reducedMotion) {
          planet.x =
            planet.baseX +
            Math.sin(time * planet.speed + planet.phase) * planet.orbit;

          planet.y =
            planet.baseY +
            Math.cos(time * planet.speed * 0.74 + planet.phase) *
              planet.orbit *
              0.52;
        }

        drawPlanet(ctx, planet);
      });

      asteroids.forEach((asteroid) => {
        if (!reducedMotion) {
          asteroid.x += asteroid.vx;
          asteroid.y += asteroid.vy;
          asteroid.rotation += asteroid.rotationSpeed;
          recycleAsteroid(asteroid);
        }

        drawAsteroid(ctx, asteroid);
      });

      astronauts.forEach((astronaut) => {
        updateAstronaut(astronaut, time);
        drawAstronaut(ctx, astronaut);
      });

      trail.forEach((particle, index) => {
        if (!reducedMotion) {
          particle.life -= 0.04;
        }

        const fade = particle.life * (index / Math.max(1, trail.length));
        if (fade <= 0) return;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size * (0.6 + fade),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(210,232,250,${fade * 0.8})`;
        ctx.fill();
      });

      trail = trail.filter((particle) => particle.life > 0.02);

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);

    hero.addEventListener('pointermove', onPointerMove, {
      passive: true,
    });

    if ('onpointerrawupdate' in window) {
      hero.addEventListener('pointerrawupdate', onPointerRawUpdate, {
        passive: true,
      });
    }

    hero.addEventListener('pointerleave', onPointerLeave, {
      passive: true,
    });

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      hero.removeEventListener('pointermove', onPointerMove);

      if ('onpointerrawupdate' in window) {
        hero.removeEventListener('pointerrawupdate', onPointerRawUpdate);
      }

      hero.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/gigs?search=${encodeURIComponent(query)}` : '/gigs');
  };

  const handlePopularSearch = (tag) => {
    navigate(`/gigs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section
      ref={heroRef}
      className="home-hero home-hero--space"
      aria-labelledby="home-hero-title"
    >
      <div
        ref={milkyWayRef}
        className="home-hero__milky-way"
        aria-hidden="true"
      >
        <span className="home-hero__milky-way-core" />
        <span className="home-hero__milky-way-band home-hero__milky-way-band--one" />
        <span className="home-hero__milky-way-band home-hero__milky-way-band--two" />
        <span className="home-hero__milky-way-specks" />
      </div>

      <canvas
        ref={canvasRef}
        className="home-hero__canvas"
        aria-hidden="true"
      />

      <div className="home-hero__planet-arc" aria-hidden="true" />

      <div className="home-hero__content home-hero__content--hybrid">
        <div className="home-hero__hybrid-layout">
          <div className="home-hero__hybrid-copy">
            <div className="home-hero__announcement">
              <span className="home-hero__announcement-dot" aria-hidden="true" />
              <GraduationCap aria-hidden="true" />
              <span>Student-first freelance marketplace • Ages 16–26</span>
              <ChevronRight aria-hidden="true" />
            </div>

            <h1 id="home-hero-title" className="home-hero__hybrid-title">
              Hire ambitious{' '}
              <span className="home-hero__hybrid-accent">student talent</span>{' '}
              for your next big project.
            </h1>

            <p className="home-hero__hybrid-lede">
              Connect directly with motivated students and freshers for development,
              design, editing, AI, and other practical tasks.
            </p>

            <form onSubmit={handleSearch} className="home-hero__search" role="search">
              <Search aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Try ‘React Developer’, ‘Logo Design’, or ‘Video Editor’..."
                aria-label="Search student services"
              />
              <button type="submit">
                <span>Search</span>
                <ArrowRight aria-hidden="true" />
              </button>
            </form>

            <div className="home-hero__popular" aria-label="Popular searches">
              <span className="home-hero__popular-label">
                <TrendingUp aria-hidden="true" />
                Popular:
              </span>
              {[
                'Full-Stack Web',
                'Figma UI/UX',
                'Shorts/Reels Edit',
                'Python AI & ML',
                'Content Writing',
                'React & Node'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handlePopularSearch(tag)}
                  className="home-hero__popular-chip"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="home-hero__trust-row">
              <div>
                <strong>Student-first talent</strong>
                <span>Practical skills and portfolio-led work</span>
              </div>
              <div>
                <strong>Flexible project fit</strong>
                <span>Fixed-price services or custom briefs</span>
              </div>
              <div>
                <strong>Protected workflow</strong>
                <span>5-day review window after delivery</span>
              </div>
            </div>

            <div className="home-hero__actions">
              <Link
                to="/register"
                className="home-hero__button home-hero__button--primary"
              >
                Hire a Student
                <ArrowRight aria-hidden="true" />
              </Link>

              <Link
                to="/register"
                className="home-hero__button home-hero__button--secondary"
              >
                Earn Money Freelancing
              </Link>
            </div>
          </div>

          <div className="home-hero__hybrid-visual" aria-label="Student talent and workflow highlights">
            <div className="home-hero__hybrid-glow" aria-hidden="true" />

            <article className="home-hero__talent-card home-hero__talent-card--one">
              <div className="home-hero__talent-topline">
                <div className="home-hero__talent-icon">
                  <Code2 aria-hidden="true" />
                </div>
                <span className="home-hero__talent-badge">PORTFOLIO-LED</span>
              </div>
              <h2>Student talent for practical work</h2>
              <p>Development, AI and technical tasks from students building real project experience.</p>
              <div className="home-hero__talent-meta">
                <span><Zap aria-hidden="true" /> Modular tasks</span>
                <span>Explore gigs <ArrowRight aria-hidden="true" /></span>
              </div>
            </article>

            <article className="home-hero__talent-card home-hero__talent-card--two">
              <div className="home-hero__talent-topline">
                <div className="home-hero__talent-icon home-hero__talent-icon--violet">
                  <Palette aria-hidden="true" />
                </div>
                <span className="home-hero__talent-badge home-hero__talent-badge--violet">FLEXIBLE HIRING</span>
              </div>
              <h2>Choose how you hire</h2>
              <p>Buy predefined service packages or post a custom project and receive targeted bids.</p>
              <div className="home-hero__talent-meta">
                <span><Star aria-hidden="true" /> Fixed-price or custom</span>
                <span>Start <ArrowRight aria-hidden="true" /></span>
              </div>
            </article>

            <div className="home-hero__protection-card">
              <div className="home-hero__protection-icon">
                <ShieldCheck aria-hidden="true" />
              </div>
              <div>
                <strong>5-Day Review Window</strong>
                <span>Review the final delivery before funds move through the protected workflow.</span>
              </div>
              <ChevronRight aria-hidden="true" />
            </div>
          </div>
        </div>

        <img
          src={HomeScrollCue}
          alt="Scroll to explore"
          className="home-hero__scroll-cue"
          draggable="false"
        />
      </div>
    </section>
  );
}
