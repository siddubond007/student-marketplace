const STYLE_ID = 'home-dual-motion-polish';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
.home-dual__rail {
  top: 50% !important;
  margin-top: -149px !important;
}

.home-dual__layout::before,
.home-dual__layout::after {
  display: none !important;
}

.home-dual__separator {
  position: absolute;
  top: 2.8rem;
  bottom: 4rem;
  left: 395px;
  width: 1px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.96;
}

.home-dual__separator-fill {
  position: absolute;
  inset: 0;
  transform-origin: top center;
  transform: scaleY(var(--separator-progress, 0));
  background: linear-gradient(
    to bottom,
    rgba(208, 224, 238, 0.12) 0%,
    rgba(255, 228, 176, 0.62) 12%,
    rgba(241, 247, 252, 0.46) 48%,
    rgba(255, 220, 157, 0.54) 84%,
    rgba(208, 224, 238, 0.10) 96%,
    transparent 100%
  );
  box-shadow:
    0 0 5px rgba(255, 224, 166, 0.34),
    0 0 16px rgba(231, 241, 248, 0.13);
}

.home-dual__separator-ember {
  position: absolute;
  left: 50%;
  top: clamp(0px, calc(var(--separator-progress, 0) * 100%), 100%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: #fff7da;
  box-shadow:
    0 0 5px rgba(255, 244, 197, 0.95),
    0 0 13px rgba(255, 216, 137, 0.58),
    0 0 24px rgba(238, 241, 248, 0.25);
}

@media (max-width: 1100px) and (min-width: 781px) {
  .home-dual__separator { left: 275px; }
}

@media (max-width: 780px) {
  .home-dual__separator { display: none; }
}
`;
  document.head.appendChild(style);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function initSeparator() {
  injectStyles();

  const sections = new WeakSet();
  let raf = 0;
  let disposed = false;
  let activeSections = [];
  const values = new WeakMap();

  const collect = () => {
    activeSections = Array.from(document.querySelectorAll('.home-dual'));
    activeSections.forEach((section) => {
      if (sections.has(section)) return;
      sections.add(section);
      values.set(section, 0);
      const layout = section.querySelector('.home-dual__layout');
      if (!layout || layout.querySelector('.home-dual__separator')) return;
      const separator = document.createElement('div');
      separator.className = 'home-dual__separator';
      separator.innerHTML = '<div class="home-dual__separator-fill"></div><span class="home-dual__separator-ember" aria-hidden="true"></span>';
      layout.appendChild(separator);
    });
  };

  const update = () => {
    raf = 0;
    if (disposed) return;
    collect();
    const vh = Math.max(window.innerHeight || 1, 1);
    const start = vh * 0.92;
    const end = vh * 0.34;
    const span = Math.max(start - end, 1);

    activeSections.forEach((section) => {
      const separator = section.querySelector('.home-dual__separator');
      if (!separator) return;
      const rect = section.getBoundingClientRect();
      const target = clamp((start - rect.top) / span, 0, 1);
      const current = values.get(section) ?? 0;
      const next = current + (target - current) * 0.14;
      values.set(section, Math.abs(target - next) < 0.001 ? target : next);
      separator.style.setProperty('--separator-progress', String(values.get(section)));
    });
  };

  const request = () => {
    if (!raf) raf = window.requestAnimationFrame(update);
  };

  const onScroll = () => request();
  const onResize = () => request();
  const observer = new MutationObserver(() => request());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  request();

  const cleanup = () => {
    disposed = true;
    observer.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (raf) window.cancelAnimationFrame(raf);
  };

  window.addEventListener('pagehide', cleanup, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSeparator, { once: true });
} else {
  initSeparator();
}
