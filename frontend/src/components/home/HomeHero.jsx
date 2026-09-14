import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
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
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: randomBetween(0.35, 1.45),
    alpha: randomBetween(0.2, 0.9),
    phase: Math.random() * Math.PI * 2,
    speed: randomBetween(0.0008, 0.0028),
    driftX: randomBetween(-0.018, 0.018),
    driftY: randomBetween(-0.012, 0.012),
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
    star.alpha * (0.72 + Math.sin(time * star.speed + star.phase) * 0.22);

  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(235,245,255,${Math.max(0.08, pulse)})`;
  ctx.fill();

  if (star.radius > 1.05) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius * 3.1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(175,215,255,${pulse * 0.035})`;
    ctx.fill();
  }
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
  const canvasRef = useRef(null);

  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;

    if (!hero || !canvas) return undefined;

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

    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      pointer.active = true;

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

    const onPointerLeave = () => {
      pointer.active = false;
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

    const drawPointerField = (time) => {
      if (!pointer.active) return;

      const outer = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        175
      );

      outer.addColorStop(0, 'rgba(235,246,255,0.042)');
      outer.addColorStop(0.22, 'rgba(196,220,240,0.022)');
      outer.addColorStop(0.48, 'rgba(145,180,210,0.012)');
      outer.addColorStop(0.72, 'rgba(110,150,185,0.009)');
      outer.addColorStop(1, 'rgba(80,120,155,0)');

      ctx.fillStyle = outer;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 260, 0, Math.PI * 2);
      ctx.fill();

      const inner = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        82
      );

      inner.addColorStop(0, 'rgba(248,252,255,0.052)');
      inner.addColorStop(0.35, 'rgba(210,230,246,0.018)');
      inner.addColorStop(1, 'rgba(210,230,246,0)');

      ctx.fillStyle = inner;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 105, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(pointer.x, pointer.y);

      const slowRotation = -0.42 + Math.sin(time * 0.00005) * 0.035;
      ctx.rotate(slowRotation);

      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        175,
        46,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = 'rgba(180,212,237,0.035)';
      ctx.lineWidth = 11;
      ctx.filter = 'blur(12px)';
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        132,
        34,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = 'rgba(222,238,249,0.03)';
      ctx.lineWidth = 5;
      ctx.filter = 'blur(5px)';
      ctx.stroke();

      ctx.restore();

      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(246,251,255,0.94)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(207,228,244,0.075)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);

      pointer.x += (pointer.targetX - pointer.x) * 0.11;
      pointer.y += (pointer.targetY - pointer.y) * 0.11;

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

            if (d < 165) {
              const dx = pointer.x - star.x;
              const dy = pointer.y - star.y;
              const pull = (1 - d / 165) * 0.018;

              star.x += dx * pull;
              star.y += dy * pull;
            }
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

      drawPointerField(time);

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);

    hero.addEventListener('pointermove', onPointerMove, {
      passive: true,
    });

    hero.addEventListener('pointerleave', onPointerLeave, {
      passive: true,
    });

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="home-hero home-hero--space"
      aria-labelledby="home-hero-title"
    >
      <canvas
        ref={canvasRef}
        className="home-hero__canvas"
        aria-hidden="true"
      />

      <div className="home-hero__content">
        <div className="home-hero__copy">
          <div className="home-hero__eyebrow">
            <Sparkles aria-hidden="true" />
            <span>STUDENT TALENT • REAL OPPORTUNITIES</span>
          </div>

          <h1 id="home-hero-title">
            Hire the best student freelancers for any project, online.
          </h1>

          <p className="home-hero__lede">
            A student-focused marketplace where real skills become real
            opportunities.
          </p>

          <ul className="home-hero__points">
            <li>
              <span aria-hidden="true" />
              <span>
                Explore skills across design, development, content, and more.
              </span>
            </li>

            <li>
              <span aria-hidden="true" />
              <span>
                Compare capabilities, profiles, and project fit before you
                choose.
              </span>
            </li>

            <li>
              <span aria-hidden="true" />
              <span>
                Post a project when you need talent, or showcase what you can
                do.
              </span>
            </li>

            <li>
              <span aria-hidden="true" />
              <span>
                Turn practical student skills into real project opportunities.
              </span>
            </li>
          </ul>

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
      </div>
    </section>
  );
}
