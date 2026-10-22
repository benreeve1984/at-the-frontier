// Minimal slide engine. Slides are <section class="slide"> inside <main class="stage">.
// Keys: ←/→ space PgUp/PgDn, Home/End, O overview, N notes, F fullscreen, ? help.
// Elements with data-step="n" reveal on the nth press of "next" within a slide.
// Slides receive "slide:enter" and "slide:step" events ({detail: {step}}).
(function () {
  const W = 1440, H = 900;
  const stage = document.querySelector('.stage');
  const slides = [...stage.querySelectorAll(':scope > .slide')];
  const deckTitle = document.body.dataset.title || '';
  let idx = 0, step = 0, overview = false;

  // chrome on every slide
  let section = '';
  slides.forEach((s, i) => {
    if (s.dataset.section) section = s.dataset.section;
    s.dataset.sectionResolved = section;
    if (s.hasAttribute('data-nochrome')) return;
    s.insertAdjacentHTML('beforeend',
      `<div class="chrome tl"><b>At The Frontier</b> &nbsp;·&nbsp; ${deckTitle}</div>` +
      `<div class="chrome tr">${section}</div>` +
      `<div class="chrome br">${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}</div>` +
      `<div class="progress" style="width:${((i + 1) / slides.length) * 100}%"></div>`);
  });

  const maxStep = s => Math.max(0, ...[...s.querySelectorAll('[data-step]')].map(e => +e.dataset.step));

  function fit() {
    if (overview) return layoutOverview();
    const sc = Math.min(innerWidth / W, innerHeight / H);
    stage.style.left = `${(innerWidth - W * sc) / 2}px`;
    stage.style.top = `${(innerHeight - H * sc) / 2}px`;
    stage.style.transform = `scale(${sc})`;
  }

  function applyStep() {
    const s = slides[idx];
    s.querySelectorAll('[data-step]').forEach(e => {
      const n = +e.dataset.step;
      e.classList.toggle('shown', n <= step);
      e.classList.toggle('dimmed', e.classList.contains('dim-after') && n < step);
    });
    s.dispatchEvent(new CustomEvent('slide:step', { detail: { step } }));
  }

  function go(i, st = 0, push = true) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    const changed = i !== idx || !slides[i].classList.contains('active');
    slides.forEach((s, j) => {
      s.classList.toggle('active', j === i);
      s.classList.toggle('past', j < i);
      // hide inactive slides from keyboard and screen readers
      s.inert = j !== i && !overview;
      s.setAttribute('aria-hidden', j !== i && !overview);
    });
    idx = i; step = st === 'end' ? maxStep(slides[i]) : st;
    applyStep();
    if (changed) slides[i].dispatchEvent(new CustomEvent('slide:enter', { detail: { step } }));
    if (push) history.replaceState(null, '', `#${i + 1}`);
    renderNotes();
  }

  function next() { if (step < maxStep(slides[idx])) { step++; applyStep(); } else go(idx + 1); }
  function prev() { if (step > 0) { step--; applyStep(); } else go(idx - 1, 'end'); }

  // notes
  const drawer = document.createElement('div');
  drawer.className = 'notes-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('aria-label', 'Presenter notes');
  document.body.appendChild(drawer);
  function setNotes(open) {
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', !open);
    drawer.inert = !open;
  }
  drawer.inert = true;
  function renderNotes() {
    const n = slides[idx].querySelector('.notes');
    drawer.innerHTML = `<button type="button" class="notes-close" aria-label="Close notes">Close notes ×</button><span class="label">Notes · slide ${idx + 1}</span>` + (n ? n.innerHTML : '<em>No notes.</em>');
    drawer.querySelector('.notes-close').addEventListener('click', () => setNotes(false));
  }

  // overview
  function layoutOverview() {
    const cols = 5, gap = 24, pad = 32;
    const sc = (innerWidth - pad * 2 - gap * (cols - 1)) / cols / W;
    slides.forEach((s, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      s.style.transform = `translate(${pad + c * (W * sc + gap)}px, ${pad + r * (H * sc + gap)}px) scale(${sc})`;
    });
    stage.style.height = `${pad * 2 + Math.ceil(slides.length / cols) * (H * sc + gap)}px`;
  }
  function toggleOverview(on = !overview) {
    overview = on;
    document.body.classList.toggle('overview', on);
    slides.forEach((s, j) => { s.inert = !on && j !== idx; s.setAttribute('aria-hidden', !on && j !== idx); });
    if (on) {
      stage.style.transform = 'none'; stage.style.left = '0'; stage.style.top = '0';
      layoutOverview();
      slides[idx].scrollIntoView({ block: 'center' });
    } else {
      slides.forEach(s => (s.style.transform = ''));
      stage.style.height = '';
      fit();
    }
  }
  slides.forEach((s, i) => s.addEventListener('click', () => { if (overview) { toggleOverview(false); go(i); } }));

  // lightbox for any img.shot or [data-zoom]
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt=""><div class="cap"></div>';
  document.body.appendChild(lb);
  document.addEventListener('click', e => {
    const img = e.target.closest('img.shot, img[data-zoom]');
    if (img && !overview) {
      lb.querySelector('img').src = img.dataset.full || img.src;
      const cap = img.closest('figure')?.querySelector('figcaption');
      lb.querySelector('.cap').textContent = cap ? cap.textContent : '';
      lb.classList.add('open');
    } else if (e.target.closest('.lightbox')) lb.classList.remove('open');
  });

  // help + hud
  const help = document.createElement('div');
  help.className = 'help';
  help.innerHTML = `<table>
    <tr><td><kbd>→</kbd> <kbd>space</kbd></td><td>Next</td></tr>
    <tr><td><kbd>←</kbd></td><td>Previous</td></tr>
    <tr><td><kbd>O</kbd></td><td>Overview of all slides</td></tr>
    <tr><td><kbd>N</kbd></td><td>Presenter notes</td></tr>
    <tr><td><kbd>F</kbd></td><td>Full screen</td></tr>
    <tr><td><kbd>Home</kbd> <kbd>End</kbd></td><td>First / last slide</td></tr>
    <tr><td>Click an image</td><td>Zoom</td></tr></table>`;
  document.body.appendChild(help);
  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = `<button data-a="home">Home</button><button data-a="prev">←</button><button data-a="next">→</button><button data-a="o">Overview</button><button data-a="n">Notes</button><button data-a="help">?</button>`;
  document.body.appendChild(hud);
  hud.addEventListener('click', e => {
    const a = e.target.dataset.a;
    if (a === 'home') location.href = document.body.dataset.home || '../';
    if (a === 'prev') prev();
    if (a === 'next') next();
    if (a === 'o') toggleOverview();
    if (a === 'n') setNotes(!drawer.classList.contains('open'));
    if (a === 'help') help.classList.toggle('open');
  });

  document.addEventListener('keydown', e => {
    const t = e.target instanceof Element ? e.target : document.body;
    if (t.closest('input, select, textarea, [contenteditable]')) return;
    // let focused buttons and links handle their own activation keys
    if ((e.key === ' ' || e.key === 'Enter') && t.closest('button, a, [role="button"], [tabindex]')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (lb.classList.contains('open') && k === 'Escape') { lb.classList.remove('open'); return; }
    if (k === 'Escape') { help.classList.remove('open'); setNotes(false); if (overview) toggleOverview(false); return; }
    if (overview) {
      if (k === 'ArrowRight') { idx = Math.min(slides.length - 1, idx + 1); slides.forEach((s, j) => s.classList.toggle('active', j === idx)); }
      if (k === 'ArrowLeft') { idx = Math.max(0, idx - 1); slides.forEach((s, j) => s.classList.toggle('active', j === idx)); }
      if (k === 'Enter' || k === 'o' || k === 'O') { toggleOverview(false); go(idx); }
      return;
    }
    if (['ArrowRight', 'PageDown', ' '].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'o' || k === 'O') toggleOverview();
    else if (k === 'n' || k === 'N') setNotes(!drawer.classList.contains('open'));
    else if (k === 'f' || k === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    else if (k === '?') help.classList.toggle('open');
  });

  addEventListener('resize', fit);
  addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1)); if (n && n - 1 !== idx) go(n - 1, 0, false); });

  fit();
  const start = parseInt(location.hash.slice(1));
  go(start ? start - 1 : 0, 0, false);
  window.deck = { go, next, prev, get index() { return idx; } };
})();
