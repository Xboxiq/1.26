// =============================================================
// SPARK EDGE bootstrap — injects the running-current frame
// into core icon tiles. Additive; remove the <script> to revert.
// =============================================================
(function () {
  'use strict';

  // core icon tiles only — grids of many small icons stay calm
  const TARGETS = '.f-deck__ico, .f-exp__ico, .f-ticker__ico, .fd-hero__ico, .fg-card__ico, .f-h2__icon';
  let phase = 0;

  function sparkify(root) {
    root.querySelectorAll(TARGETS).forEach((el) => {
      if (el.querySelector(':scope > .spark-edge')) return;
      el.classList.add('spark-host');
      const s = document.createElement('span');
      s.className = 'spark-edge';
      s.setAttribute('aria-hidden', 'true');
      s.setAttribute('data-ph', String(phase = (phase + 1) % 4));
      el.appendChild(s);
    });
  }

  function start() {
    sparkify(document);
    const mo = new MutationObserver(() => {
      clearTimeout(start._t);
      start._t = setTimeout(() => sparkify(document), 150);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
