const STYLE_ID = 'home-motion-performance';

function installPerformanceStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .home-dual,
    .home-hero {
      contain: layout paint style;
    }

    .home-dual__rail,
    .home-dual__intro,
    .home-dual__switcher,
    .home-dual__stage,
    .home-dual__card-layer,
    .home-dual__separator,
    .home-dual__separator-fill,
    .home-dual__separator-ember {
      backface-visibility: hidden;
    }

    .home-dual__separator-fill,
    .home-dual__separator-ember {
      will-change: transform;
    }

    .home-dual__card-layer {
      will-change: opacity, transform;
    }

    .home-dual__separator-fill {
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
}

function initHomeMotionPerformance() {
  installPerformanceStyles();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let raf = 0;
  let running = true;
  let lastFrame = 0;

  const paint = (time) => {
    if (!running) return;

    raf = 0;
    const delta = time - lastFrame;
    if (delta < 16) return;
    lastFrame = time;

    const sections = document.querySelectorAll('.home-dual');
    const vh = Math.max(window.innerHeight || 1, 1);
    const start = vh * 0.92;
    const end = vh * 0.34;
    const span = Math.max(start - end, 1);

    sections.forEach((section) => {
      const separator = section.querySelector('.home-dual__separator');
      if (!separator) return;

      const rect = section.getBoundingClientRect();
      const target = Math.min(1, Math.max(0, (start - rect.top) / span));
      const current = Number(separator.dataset.performanceProgress || 0);
      const next = current + (target - current) * 0.16;
      separator.dataset.performanceProgress = String(next);
      separator.style.setProperty('--separator-progress', next.toFixed(4));
    });

    schedule();
  };

  const schedule = () => {
    if (!raf) raf = window.requestAnimationFrame(paint);
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting);
    running = visible;
    if (visible) schedule();
  }, { rootMargin: '12% 0px 12% 0px' });

  const observe = () => {
    document.querySelectorAll('.home-dual').forEach((section) => {
      if (!section.dataset.motionObserved) {
        section.dataset.motionObserved = 'true';
        observer.observe(section);
      }
    });
  };

  const mutationObserver = new MutationObserver(() => {
    observe();
    schedule();
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  observe();
  schedule();

  window.addEventListener('pagehide', () => {
    running = false;
    mutationObserver.disconnect();
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (raf) window.cancelAnimationFrame(raf);
  }, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomeMotionPerformance, { once: true });
} else {
  initHomeMotionPerformance();
}
