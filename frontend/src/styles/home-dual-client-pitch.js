const STYLE_ID = 'home-dual-client-pitch';
const ENHANCED_CLASS = 'home-dual__client-pitch-body--enhanced';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
.home-dual__client-pitch-body--enhanced {
  width: 100% !important;
  max-width: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.home-dual__client-pitch-body--enhanced > :not(.home-dual__client-pitch) {
  display: none !important;
}

.home-dual__client-pitch {
  width: 100%;
  color: #edf5fb;
}

.home-dual__client-pitch-headline {
  margin: 0;
  max-width: 980px;
  color: #f5f8fc;
  font-family: var(--home-font-display, 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif);
  font-size: clamp(2rem, 3.25vw, 3.15rem);
  line-height: 1.05;
  letter-spacing: -0.042em;
  font-weight: 900;
  text-wrap: balance;
}

.home-dual__client-pitch-subtext {
  max-width: 980px;
  margin: 0.9rem 0 0;
  color: #b8c6d2;
  font-size: clamp(0.86rem, 1vw, 1rem);
  line-height: 1.68;
}

.home-dual__client-pitch-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1.55rem;
}

.home-dual__client-pitch-card {
  min-width: 0;
  padding: 1rem 1rem 1.05rem;
  border: 1px solid rgba(190, 214, 231, 0.105);
  border-radius: 0.95rem;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.038), rgba(255, 255, 255, 0.012));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025), 0 10px 24px rgba(0, 0, 0, 0.08);
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
}

.home-dual__client-pitch-card:nth-child(-n+3) { grid-column: span 2; }
.home-dual__client-pitch-card:nth-child(4) { grid-column: 2 / span 2; }
.home-dual__client-pitch-card:nth-child(5) { grid-column: 4 / span 2; }

.home-dual__client-pitch-card:hover {
  transform: translateY(-3px);
  border-color: rgba(215, 233, 247, 0.19);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035), 0 14px 30px rgba(0, 0, 0, 0.12);
}

.home-dual__client-pitch-card-icon {
  width: 2rem;
  height: 2rem;
  display: inline-grid;
  place-items: center;
  border: 1px solid rgba(214, 233, 247, 0.12);
  border-radius: 0.7rem;
  background: rgba(218, 237, 249, 0.05);
  color: #dff1ff;
}

.home-dual__client-pitch-card-icon svg {
  width: 0.98rem;
  height: 0.98rem;
}

.home-dual__client-pitch-card h4 {
  margin: 0.7rem 0 0;
  color: #edf5fb;
  font-size: 0.86rem;
  line-height: 1.3;
  font-weight: 850;
}

.home-dual__client-pitch-card p {
  margin: 0.42rem 0 0;
  color: #96a8b8;
  font-size: 0.73rem;
  line-height: 1.58;
}

.home-dual__client-pitch-card--wide {
  grid-column: 2 / span 4 !important;
}

.home-dual__client-trust-banner {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1rem;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(194, 216, 232, 0.11);
  border-radius: 0.95rem;
  background: linear-gradient(110deg, rgba(19, 32, 45, 0.52), rgba(9, 18, 29, 0.54));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.022);
}

.home-dual__client-trust-item {
  min-width: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  align-items: start;
}

.home-dual__client-trust-icon {
  width: 1.95rem;
  height: 1.95rem;
  display: inline-grid;
  place-items: center;
  border-radius: 0.68rem;
  color: #ffe17a;
  background: rgba(255, 216, 103, 0.075);
  border: 1px solid rgba(255, 216, 103, 0.12);
}

.home-dual__client-trust-icon svg {
  width: 0.95rem;
  height: 0.95rem;
}

.home-dual__client-trust-item strong {
  display: block;
  color: #f2f7fb;
  font-size: 0.74rem;
  line-height: 1.35;
  font-weight: 850;
}

.home-dual__client-trust-item span {
  display: block;
  margin-top: 0.28rem;
  color: #91a5b5;
  font-size: 0.69rem;
  line-height: 1.55;
}

.home-dual__client-pitch-actions {
  margin-top: 1.05rem;
}

.home-dual__client-pitch-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.78rem 1rem;
  border: 1px solid rgba(201, 225, 243, 0.15);
  border-radius: 0.82rem;
  color: #e8f3fb;
  background: rgba(212, 234, 248, 0.055);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), background 220ms ease, border-color 220ms ease;
}

.home-dual__client-pitch-cta:hover {
  transform: translateY(-2px);
  border-color: rgba(210, 231, 246, 0.3);
  background: rgba(214, 235, 249, 0.09);
}

.home-dual__client-pitch-cta:focus-visible {
  outline: 3px solid rgba(220, 236, 255, 0.9);
  outline-offset: 3px;
}

.home-dual__client-pitch-cta svg {
  width: 0.95rem;
  height: 0.95rem;
}

@media (max-width: 940px) {
  .home-dual__client-pitch-grid { grid-template-columns: 1fr; }
  .home-dual__client-pitch-card,
  .home-dual__client-pitch-card:nth-child(n) { grid-column: auto; }
  .home-dual__client-trust-banner { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .home-dual__client-pitch-card,
  .home-dual__client-pitch-cta { transition: none; }
}
`;
  document.head.appendChild(style);
}

function iconMarkup(type) {
  const icons = {
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.67 6.2.9-4.5 4.39 1.06 6.2L12 17.23 6.44 20.16l1.06-6.2L3 9.57l6.2-.9L12 3Z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  };
  return icons[type] || '';
}

function createPitch() {
  const pitch = document.createElement('div');
  pitch.className = 'home-dual__client-pitch';
  pitch.innerHTML = `
    <h3 class="home-dual__client-pitch-headline">Hire Student Talent Without the Enterprise Overhead.</h3>
    <p class="home-dual__client-pitch-subtext">Bring capable students and freshers into modular work through a flexible marketplace built around practical skills, accountable delivery, protected budgets, and hiring options that fit the job.</p>

    <div class="home-dual__client-pitch-grid">
      <article class="home-dual__client-pitch-card">
        <span class="home-dual__client-pitch-card-icon">${iconMarkup('bolt')}</span>
        <h4>Cost-Effective Execution</h4>
        <p>Skip the enterprise markup and get modular tasks completed affordably through focused student talent.</p>
      </article>
      <article class="home-dual__client-pitch-card">
        <span class="home-dual__client-pitch-card-icon">${iconMarkup('users')}</span>
        <h4>Portfolio-Driven Talent</h4>
        <p>Tap into students and freshers building authentic portfolios through practical project work and real opportunities.</p>
      </article>
      <article class="home-dual__client-pitch-card">
        <span class="home-dual__client-pitch-card-icon">${iconMarkup('shield')}</span>
        <h4>Ironclad Accountability</h4>
        <p>Built-in progressive strikes penalize missed deadlines and can suspend freelancers who repeatedly fail to deliver.</p>
      </article>
      <article class="home-dual__client-pitch-card">
        <span class="home-dual__client-pitch-card-icon">${iconMarkup('star')}</span>
        <h4>Zero-Risk Escrow</h4>
        <p>Budgets are held in escrow and released only after the 5-day review window begins once the final deliverable is received.</p>
      </article>
      <article class="home-dual__client-pitch-card">
        <span class="home-dual__client-pitch-card-icon">${iconMarkup('sliders')}</span>
        <h4>Flexible Hiring Options</h4>
        <p>Buy predefined fixed-price service packages instantly, or post a custom job and receive targeted freelancer bids.</p>
      </article>
    </div>

    <div class="home-dual__client-trust-banner" role="note" aria-label="Trust and accountability">
      <div class="home-dual__client-trust-item">
        <span class="home-dual__client-trust-icon">${iconMarkup('shield')}</span>
        <div><strong>Built for accountable delivery</strong><span>Clear platform rules, deadline controls, and structured workflows help keep project execution visible.</span></div>
      </div>
      <div class="home-dual__client-trust-item">
        <span class="home-dual__client-trust-icon">${iconMarkup('star')}</span>
        <div><strong>Detailed performance signals</strong><span>Moderated sub-ratings for Communication, Quality, and Timeliness give clients more context when reviewing work.</span></div>
      </div>
    </div>

    <div class="home-dual__client-pitch-actions">
      <button class="home-dual__client-pitch-cta" type="button">Explore Student Talent ${iconMarkup('arrow')}</button>
    </div>
  `;
  return pitch;
}

function enhanceClientPerspective(root) {
  const body = root.querySelector('.home-dual__card-layer--client .home-dual__card-body');
  if (!body) return false;
  if (!body.classList.contains(ENHANCED_CLASS)) body.classList.add(ENHANCED_CLASS);
  if (body.querySelector('.home-dual__client-pitch')) return true;

  const pitch = createPitch();
  const originalCta = body.querySelector('.home-dual__cta');
  pitch.querySelector('.home-dual__client-pitch-cta')?.addEventListener('click', () => {
    originalCta?.click();
  });
  body.appendChild(pitch);
  return true;
}

function init() {
  injectStyles();

  const attach = () => {
    const root = document.querySelector('.home-dual');
    if (!root) return false;
    enhanceClientPerspective(root);
    return true;
  };

  if (attach()) return;

  const observer = new MutationObserver(() => {
    if (attach()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
