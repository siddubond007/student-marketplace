import React, { useEffect, useRef } from 'react';

const STAR_COUNT = 90;
const TRAIL_LIMIT = 34;
const REDUCED_STAR_COUNT = 42;

function createStar(width, height, index, reduced) {
  const base = {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.02,
    vy: (Math.random() - 0.5) * 0.02,
    radius: 0.45 + Math.random() * 1.4,
    alpha: 0.2 + Math.random() * 0.6,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.004 + Math.random() * 0.01,
    depth: 0.35 + Math.random() * 0.9,
    seed: index
  };

  if (reduced) {
    base.radius *= 0.78;
    base.alpha *= 0.8;
  }

  return base;
}

export default function HomeHeroAtmosphere() {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef(0);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const stars = [];
    const trail = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = performance.now();
    let trailAccumulator = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const desiredCount = reducedMotion ? REDUCED_STAR_COUNT : STAR_COUNT;
      stars.length = 0;
      for (let index = 0; index < desiredCount; index += 1) {
        stars.push(createStar(width, height, index, reducedMotion));
      }
      trail.length = 0;
    };

    const drawGlow = (x, y, radius, opacity) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(236, 72, 153, ${0.34 * opacity})`);
      gradient.addColorStop(0.35, `rgba(129, 140, 248, ${0.17 * opacity})`);
      gradient.addColorStop(0.7, `rgba(56, 189, 248, ${0.06 * opacity})`);
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const drawStar = (star, time) => {
      const pulse = 0.78 + Math.sin(time * star.twinkleSpeed + star.twinkle) * 0.22;
      const alpha = star.alpha * pulse;
      ctx.beginPath();
      ctx.fillStyle = `rgba(238, 242, 255, ${alpha})`;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      if (star.radius > 1.15 && alpha > 0.42) {
        const flare = star.radius * 3.2;
        ctx.strokeStyle = `rgba(196, 181, 253, ${alpha * 0.38})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(star.x - flare, star.y);
        ctx.lineTo(star.x + flare, star.y);
        ctx.moveTo(star.x, star.y - flare);
        ctx.lineTo(star.x, star.y + flare);
        ctx.stroke();
      }
    };

    const drawTrail = () => {
      for (let index = 1; index < trail.length; index += 1) {
        const point = trail[index];
        const previous = trail[index - 1];
        const progress = index / trail.length;
        const alpha = (1 - progress) * 0.42;
        ctx.strokeStyle = `rgba(244, 114, 182, ${alpha})`;
        ctx.lineWidth = 0.5 + (1 - progress) * 1.35;
        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }

      trail.forEach((point, index) => {
        const progress = index / Math.max(1, trail.length);
        const size = (1 - progress) * 2.8;
        const alpha = (1 - progress) * 0.72;
        if (size <= 0.15) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const draw = (now) => {
      const delta = Math.min(40, now - lastTime);
      lastTime = now;
      const seconds = now / 1000;

      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      if (pointer.active && finePointer && !reducedMotion) {
        drawGlow(pointer.x, pointer.y, Math.min(width, height) * 0.29, 1);
        trailAccumulator += delta;
        if (trailAccumulator >= 24) {
          trail.unshift({ x: pointer.x, y: pointer.y, life: 1 });
          trail.splice(TRAIL_LIMIT);
          trailAccumulator = 0;
        }
      }

      for (const star of stars) {
        if (!reducedMotion) {
          star.x += star.vx * delta;
          star.y += star.vy * delta;
        }

        if (pointer.active && finePointer && !reducedMotion) {
          const dx = pointer.x - star.x;
          const dy = pointer.y - star.y;
          const distanceSquared = dx * dx + dy * dy;
          const attractionRadius = 245;
          if (distanceSquared > 12 && distanceSquared < attractionRadius * attractionRadius) {
            const distance = Math.sqrt(distanceSquared);
            const falloff = 1 - distance / attractionRadius;
            const force = 0.00085 * falloff * falloff * delta * star.depth;
            star.vx += (dx / distance) * force;
            star.vy += (dy / distance) * force;
          }
        }

        star.vx *= reducedMotion ? 1 : 0.996;
        star.vy *= reducedMotion ? 1 : 0.996;

        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        drawStar(star, seconds * 1000);
      }

      if (trail.length) {
        trail.forEach((point, index) => {
          point.life *= 0.9;
          if (index > TRAIL_LIMIT - 5) point.life *= 0.85;
        });
        drawTrail();
      }

      if (pointer.active && finePointer && !reducedMotion) {
        const sparkle = 6 + Math.sin(seconds * 7) * 1.2;
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(pointer.x - sparkle, pointer.y);
        ctx.lineTo(pointer.x + sparkle, pointer.y);
        ctx.moveTo(pointer.x, pointer.y - sparkle);
        ctx.lineTo(pointer.x, pointer.y + sparkle);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      if (!finePointer) return;
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointerRef.current = { x, y, active: true };

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x - 150}px, ${y - 150}px, 0)`;
        glowRef.current.style.opacity = '1';
      }
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      if (glowRef.current) glowRef.current.style.opacity = '0';
      trail.length = 0;
    };

    resize();
    resizeObserverRef.current = new ResizeObserver(resize);
    resizeObserverRef.current.observe(host);
    host.addEventListener('pointermove', handlePointerMove, { passive: true });
    host.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserverRef.current?.disconnect();
      host.removeEventListener('pointermove', handlePointerMove);
      host.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className="home-hero-atmosphere" aria-hidden="true">
      <canvas ref={canvasRef} className="home-hero-atmosphere__canvas" />
      <div ref={glowRef} className="home-hero-atmosphere__cursor-glow" />
      <div className="home-hero-atmosphere__horizon" />
    </div>
  );
}
