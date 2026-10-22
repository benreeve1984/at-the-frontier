// Interactive demo slides for the document extraction session.
function safe(name, fn) { try { fn(); } catch (e) { console.error('Could not start ' + name, e); } }
const on = (id, fn) => { const s = document.getElementById(id); if (s) { s.addEventListener('slide:step', e => fn(s, e.detail.step)); s.addEventListener('slide:enter', e => fn(s, e.detail.step, true)); } };

/* ---------- PDF internals ---------- */
safe('pdf demo', function () {
  const s = document.getElementById('pdf-inside'); if (!s) return;
  const paper = s.querySelector('.paper');
  const L = [
    ['1. Payment', 46, 40, true], ['The Client shall pay all', 46, 70], ['invoices within 30 days', 46, 94], ['of the invoice date.', 46, 118],
    ['2. Termination', 290, 40, true], ['Either party may end this', 290, 70], ['agreement with 90 days\'', 290, 94], ['written notice.', 290, 118],
  ];
  L.forEach(([t, x, y, bold], i) => {
    const d = document.createElement('div');
    d.className = 'glyph'; d.dataset.i = i;
    d.style.cssText = `left:${x}px;top:${y + 160}px;${bold ? 'font-weight:700;font-size:17px' : ''}`;
    d.innerHTML = [...t].map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    paper.appendChild(d);
  });
  // faux surrounding page furniture
  paper.insertAdjacentHTML('afterbegin', `<div style="position:absolute;left:46px;top:46px;font:700 24px 'Times New Roman';">SERVICES AGREEMENT</div>
    <div style="position:absolute;left:46px;top:86px;width:430px;font:15px/1.5 'Times New Roman';color:#333">This agreement is made between Acme Ltd ("the Client") and Example Services LLC.</div>
    <div style="position:absolute;left:46px;right:46px;top:146px;border-top:1px solid #999"></div>
    <div style="position:absolute;left:46px;bottom:30px;font:12px 'Times New Roman';color:#666">Page 1 of 12</div>`);
  const style = document.createElement('style');
  style.textContent = `#pdf-inside .paper.boxes .glyph span{outline:1px solid rgba(26,47,208,.55);background:rgba(26,47,208,.07)}
    #pdf-inside .glyph.hl{background:rgba(255,158,100,.25)}`;
  document.head.appendChild(style);
  const lines = [...s.querySelectorAll('.code .ln2')];
  lines.forEach(l => l.addEventListener('mouseenter', () => { const t = l.dataset.t; paper.querySelectorAll('.glyph').forEach(g => g.classList.toggle('hl', g.dataset.i === t)); }));
  on('pdf-inside', (sl, st) => { paper.classList.toggle('boxes', st >= 1); });
});

/* ---------- OCR pipeline ---------- */
safe('ocr demo', function () {
  const s = document.getElementById('ocr-pipeline'); if (!s) return;
  const scan = s.querySelector('.scan'), txt = s.querySelector('.txt');
  const text = 'The tenant shall keep the premises in good and substantial repair and condition, fair wear and tear excepted, and shall permit the landlord to enter and inspect the premises at reasonable times upon giving not less than 48 hours written notice. Rent of £4,250 is payable quarterly in advance on the usual quarter days.';
  const misreads = { substantial: ['substantiaI', 0.61], '£4,250': ['£4.250', 0.54], modern: ['rnodern', .5] };
  txt.innerHTML = text.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
  let built = false;
  function build() {
    if (built) return; built = true;
    const ws = [...txt.querySelectorAll('.w')];
    const rows = [];
    ws.forEach(w => {
      const r = { l: w.offsetLeft, t: w.offsetTop, w: w.offsetWidth, h: w.offsetHeight, el: w };
      let row = rows.find(x => Math.abs(x.t - r.t) < 5); if (!row) rows.push(row = { t: r.t, items: [] }); row.items.push(r);
      const b = document.createElement('div'); b.className = 'wb';
      b.style.cssText = `left:${r.l - 2}px;top:${r.t + 1}px;width:${r.w + 4}px;height:${r.h - 2}px`;
      txt.appendChild(b);
      const key = w.textContent.replace(/[,.]$/, '');
      const mis = misreads[key];
      const conf = mis ? mis[1] : (0.9 + ((key.length * 37) % 10) / 100);
      const c = document.createElement('div'); c.className = 'conf' + (conf < .8 ? ' low' : '');
      c.textContent = conf.toFixed(2); c.style.cssText = `left:${r.l - 2}px;top:${r.t - 9}px`;
      txt.appendChild(c);
    });
    rows.forEach(row => {
      const l = Math.min(...row.items.map(i => i.l)), r = Math.max(...row.items.map(i => i.l + i.w));
      const b = document.createElement('div'); b.className = 'lb';
      b.style.cssText = `left:${l - 6}px;top:${row.t - 2}px;width:${r - l + 12}px;height:${row.items[0].h + 4}px`;
      txt.appendChild(b);
    });
    const out = s.querySelector('.ocr-out');
    out.innerHTML = text.split(' ').map(w => { const k = w.replace(/[,.]$/, ''); const m = misreads[k]; return m ? `<span class="bad">${w.replace(k, m[0])}</span>` : w; }).join(' ');
  }
  const steps = [...s.querySelectorAll('.pipe-steps > div')];
  on('ocr-pipeline', (sl, st) => {
    build();
    scan.classList.toggle('clean', st >= 1);
    scan.classList.toggle('straight', st >= 2);
    scan.classList.toggle('lines', st === 3);
    scan.classList.toggle('words', st >= 4);
    scan.classList.toggle('read', st >= 5);
    steps.forEach((d, i) => { d.classList.toggle('on', i + 1 <= st); d.classList.toggle('cur', i + 1 === st); });
  });
});

/* ---------- How a VLM reads a page ---------- */
safe('vlm demo', function () {
  const s = document.getElementById('vlm-reads'); if (!s) return;
  const grid = s.querySelector('.vgrid');
  const cols = 16, rows = 21;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  grid.innerHTML = '<i></i>'.repeat(cols * rows);
  const cells = [...grid.children];
  const tok = s.querySelector('.tokens');
  const out = s.querySelector('.typing');
  const md = '# Quarterly report\n\nRevenue rose 12% to $48.2m, driven by ...\n\n| Region | Q1 | Q2 | Q3 |\n|---|---|---|---|\n| North | 12.1 | 13.4 | 14.0 |\n| South | 9.8 | 10.2 | 11.5 |\n\nThe chart shows margin improving in every region ...';
  let timers = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  on('vlm-reads', (sl, st, enter) => {
    clear();
    grid.classList.toggle('on', st >= 1);
    cells.forEach(c => c.classList.remove('hot'));
    tok.innerHTML = '';
    out.innerHTML = '<span class="cursor"></span>';
    if (st >= 2) {
      cells.forEach((c, i) => timers.push(setTimeout(() => { c.classList.add('hot'); if (i % 2 === 0) tok.insertAdjacentHTML('beforeend', '<i></i>'); }, i * 4)));
    }
    if (st >= 3) {
      let k = 0;
      const type = () => { if (k > md.length) return; out.innerHTML = md.slice(0, k).replace(/</g, '&lt;') + '<span class="cursor"></span>'; k += 2; timers.push(setTimeout(type, 18)); };
      timers.push(setTimeout(type, st === 3 && !enter ? 200 : 0));
    }
  });
});

/* ---------- generic: image steppers and step lists ---------- */
document.querySelectorAll('.slide').forEach(s => {
  const imgs = s.querySelectorAll('.stepimgs .si');
  const walk = s.querySelectorAll('.pipe-steps.walk > div');
  if (!imgs.length && !walk.length) return;
  const upd = st => {
    let cur = 0;
    imgs.forEach((f, i) => { if (!f.dataset.step || +f.dataset.step <= st) cur = i; });
    imgs.forEach((f, i) => f.classList.toggle('cur', i === cur));
    walk.forEach((d, i) => { d.classList.toggle('on', i <= st); d.classList.toggle('cur', i === st); });
  };
  s.addEventListener('slide:step', e => upd(e.detail.step));
  upd(0);
});

const fmt$ = v => v == null ? '–' : v === 0 ? '$0' : v < 0.1 ? '<$0.10' : v < 10 ? '$' + v.toFixed(2) : '$' + Math.round(v).toLocaleString();

/* ---------- cost calculator ---------- */
safe('calculator', function () {
  const sel = document.getElementById('calc-model'); if (!sel || !window.DX) return;
  const ms = DX.calcModels;
  sel.innerHTML = ms.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  sel.value = 'gemini-3.8-flash';
  const pages = document.getElementById('calc-pages'), out = document.getElementById('calc-out'), batch = document.getElementById('calc-batch');
  const note = document.getElementById('calc-note');
  let touched = false; // keep a deliberate output-token choice when the model changes
  out.addEventListener('input', () => (touched = true));
  sel.addEventListener('change', () => { if (!touched) out.value = ms.find(x => x.id === sel.value).tok.output; });
  out.value = ms.find(x => x.id === sel.value).tok.output;
  function run() {
    const m = ms.find(x => x.id === sel.value), n = Math.round(10 ** +pages.value), o = +out.value, b = batch.checked;
    const pin = b ? m.price.batch_input ?? m.price.input / 2 : m.price.input, pout = b ? m.price.batch_output ?? m.price.output / 2 : m.price.output;
    const cin = m.tok.input * pin / 1e6, cout = o * pout / 1e6, per = (cin + cout) * 1000;
    document.getElementById('calc-pages-v').textContent = n.toLocaleString();
    document.getElementById('calc-out-v').textContent = o.toLocaleString();
    document.getElementById('calc-per').textContent = per < 10 ? '$' + per.toFixed(2) : fmt$(per);
    document.getElementById('calc-total').textContent = fmt$(per * n / 1000);
    document.getElementById('calc-in-bar').style.width = (cin / (cin + cout) * 100) + '%';
    document.getElementById('calc-out-bar').style.width = (cout / (cin + cout) * 100) + '%';
    note.textContent = `This model's catalogue estimate is ${m.tok.output.toLocaleString()} output tokens per page` +
      (m.tok.output !== 800 ? ' (its tokenizer counts about 30% more tokens for the same text)' : '') +
      (o !== m.tok.output ? `. You have set ${o.toLocaleString()}.` : '.');
    document.getElementById('calc-compare').textContent = `For comparison, the same ${n.toLocaleString()} pages: Azure DI Layout ${fmt$(10 * n / 1000)} · self-hosted olmOCR about ${fmt$(0.2 * n / 1000)} in GPU time only. Input ${m.tok.input.toLocaleString()} tokens per page (image + prompt).`;
  }
  [sel, pages, out, batch].forEach(e => e.addEventListener('input', run));
  sel.addEventListener('change', run);
  run();
});

/* ---------- where each option can run (shared by the product map and the charts) ---------- */
const HOST_FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'azure', label: 'Hosted on Azure', test: p => p.deploy.hosted.includes('Azure') },
  { id: 'aws', label: 'Hosted on AWS', test: p => p.deploy.hosted.includes('AWS') },
  { id: 'gcp', label: 'Hosted on Google Cloud', test: p => p.deploy.hosted.includes('GCP') },
  { id: 'self', label: 'Self-host or private', test: p => p.deploy.weights || p.deploy.private },
];
function whereText(d) {
  const parts = [];
  if (d.hosted.length) parts.push('Hosted on ' + d.hosted.join(', '));
  if (d.billing) parts.push('Billing route only: ' + d.billing + '. The vendor processes the documents.');
  if (d.weights) parts.push('Self-host: downloadable weights or library');
  if (d.private) parts.push('Private deployment available under an enterprise contract');
  if (d.saas) parts.push('Vendor-hosted API');
  return parts.join('. ') + (d.note ? '. ' + d.note : '');
}

/* ---------- player map ---------- */
safe('player map', function () {
  const grid = document.getElementById('pl-grid'); if (!grid || !window.DX) return;
  const slide = grid.closest('.slide');
  grid.style.gridTemplateColumns = `repeat(${DX.columns.length}, 1fr)`;
  const tags = d => [d.hosted.length && '<i style="background:var(--blue)"></i>', (d.weights || d.private) && '<i style="background:var(--green)"></i>', d.saas && '<i style="background:var(--orange)"></i>'].filter(Boolean).join('');
  grid.innerHTML = DX.columns.map(c => `<div class="pl-col" style="--c:${c.color}"><h4>${c.label}</h4>` + c.items.map(p =>
    `<div class="pl" tabindex="0" data-id="${p.id}"><span>${p.name}<span class="tags">${tags(p.deploy)}</span></span><span class="pr">${p.cost == null ? 'quote' : fmt$(p.cost)}</span></div>`).join('') + '</div>').join('');
  grid.insertAdjacentHTML('afterend', `<div class="pl-legend"><span><i style="background:var(--blue)"></i>Hosted on Azure, AWS or Google Cloud</span><span><i style="background:var(--green)"></i>Self-host or private deployment</span><span><i style="background:var(--orange)"></i>Vendor-hosted API</span><span style="margin-left:auto">Price = list $ per 1,000 pages · hover or tab for details</span></div>`);
  const tip = document.createElement('div'); tip.className = 'pl-tip'; tip.setAttribute('role', 'status'); slide.appendChild(tip);
  const all = DX.columns.flatMap(c => c.items);
  const show = el => {
    const p = all.find(x => x.id === el.dataset.id);
    tip.innerHTML = `<b>${p.name}</b>${p.notes}<span class="k">Where it runs</span>${whereText(p.deploy)}${p.licence ? `<span class="k">Licence</span>${p.licence}` : ''}<span class="k">Price basis</span>${p.basis}`;
    const r = el.getBoundingClientRect(), sr = slide.getBoundingClientRect(), sc = sr.width / 1440;
    let x = (r.right - sr.left) / sc + 8, y = (r.top - sr.top) / sc - 10;
    if (x > 1080) x = (r.left - sr.left) / sc - 330;
    tip.style.left = x + 'px'; tip.style.top = Math.min(y, 520) + 'px'; tip.style.display = 'block';
  };
  grid.addEventListener('mouseover', e => { const el = e.target.closest('.pl'); el ? show(el) : (tip.style.display = 'none'); });
  grid.addEventListener('focusin', e => { const el = e.target.closest('.pl'); if (el) show(el); });
  grid.addEventListener('mouseleave', () => (tip.style.display = 'none'));
  grid.addEventListener('focusout', () => (tip.style.display = 'none'));
  const bar = slide.querySelector('.pl-filters');
  bar.innerHTML = '<span class="label">Show</span>' + HOST_FILTERS.map(f => `<button type="button" data-f="${f.id}" aria-pressed="${f.id === 'all'}" class="${f.id === 'all' ? 'on' : ''}">${f.label}</button>`).join('');
  bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    bar.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    const f = HOST_FILTERS.find(x => x.id === b.dataset.f);
    grid.querySelectorAll('.pl').forEach(el => el.classList.toggle('dim', !f.test(all.find(x => x.id === el.dataset.id))));
  }));
});

/* ---------- price ladder ---------- */
safe('price ladder', function () {
  const el = document.getElementById('ladder-chart'); if (!el || !window.DX) return;
  if (!window.d3) { el.innerHTML = '<div class="viz-missing">This chart needs the D3 library, which did not load.</div>'; return; }
  el.classList.add('lad');
  const famC = { libs: '#5b5f6a', cloud: '#12909a', saas: '#1a2fd0', open: '#2c9a58', vlm: '#7b4fd6' };
  const famL = { libs: 'PDF libraries and OCR', cloud: 'Cloud services', saas: 'Specialist APIs', open: 'Open models (GPU time)', vlm: 'General models (estimate)' };
  const data = DX.ladder.map(d => ({ ...d, c: Math.max(d.cost, 0.03) })).sort((a, b) => a.c - b.c);
  const W = 1248, H = 600, m = { l: 20, r: 20, t: 34, b: 30 };
  const x = d3.scaleLog().domain([0.025, 120]).range([m.l, W - m.r]);
  const y = d3.scaleBand().domain(data.map(d => d.id)).range([m.t, H - m.b]).padding(0.2);
  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`);
  [[0.025, 1, 'Under $1'], [1, 15, '$1–15'], [15, 120, '$15–80+']].forEach(([a, b, t], i) => {
    const g = svg.append('g').attr('class', 'band');
    g.append('rect').attr('x', x(a)).attr('width', x(b) - x(a)).attr('y', m.t - 26).attr('height', H - m.t - m.b + 26).attr('fill', i % 2 ? '#f4f5f8' : '#fff');
    g.append('text').attr('x', x(a) + 8).attr('y', m.t - 10).attr('fill', '#8b8f99').text(t);
  });
  const ax = svg.append('g').attr('class', 'ax').attr('transform', `translate(0,${H - m.b})`)
    .call(d3.axisBottom(x).tickValues([0.03, 0.1, 0.3, 1, 3, 10, 30, 100]).tickFormat(v => v === 0.03 ? '≈$0' : '$' + v).tickSize(-(H - m.t - m.b)));
  ax.selectAll('line').attr('stroke', '#eceef2'); ax.select('.domain').remove();
  const row = svg.append('g').selectAll('g').data(data).join('g').attr('transform', d => `translate(0,${y(d.id) + y.bandwidth() / 2})`);
  row.append('line').attr('x1', x(0.025)).attr('x2', d => x(d.c)).attr('stroke', d => famC[d.fam]).attr('stroke-opacity', .25).attr('stroke-width', 2);
  row.append('circle').attr('cx', d => x(d.c)).attr('r', 5).attr('fill', d => famC[d.fam]);
  row.append('text').attr('x', d => x(d.c) + (x(d.c) > 900 ? -10 : 10)).attr('text-anchor', d => x(d.c) > 900 ? 'end' : 'start').attr('dy', '0.35em')
    .text(d => `${d.name}  ${d.cost === 0 ? 'free' : fmt$(d.cost)}`);
  const lg = d3.select(el).append('div').attr('class', 'pl-legend');
  Object.keys(famC).forEach(k => lg.append('span').html(`<i style="background:${famC[k]}"></i>${famL[k]}`));
});

/* ---------- OmniParseBench easy vs hard dot plot ---------- */
safe('benchmark dot plot', function () {
  const el = document.getElementById('dumbbell'); if (!el) return;
  if (!window.d3) { el.innerHTML = '<div class="viz-missing">This chart needs the D3 library, which did not load.</div>'; return; }
  el.classList.add('dumb');
  const S = [['plain', 'Plain pages', '#1a2fd0'], ['hard', 'Hard rendering', '#e5892a'], ['hw', 'Handwriting', '#d6453b'], ['nl', 'Non-Latin script', '#7b4fd6']];
  const D = [
    ['Datalab accurate', 93.0, 87.6, 76.2, 89.3], ['Gemini 3.8 Flash *', 89.5, 89.2, 81.4, 88.1], ['Datalab balanced', 92.6, 81.3, 72.2, 87.1],
    ['Reducto', 91.1, 82.4, 69.6, 64.3], ['LlamaParse', 90.4, 85.7, 75.3, 84.4], ['Chandra 2 (open)', 90.9, 80.1, 70.3, 80.9],
    ['Mistral OCR', 87.6, 76.3, 67.5, 81.5], ['Claude Sonnet 5.5 *', 83.4, 88.4, 77.9, 84.7], ['GPT-5.6 Sol', 85.2, 80.3, 70.2, 76.3],
    ['Extend', 85.3, 84.5, 75.9, 71.5], ['Azure DI Layout', 85.6, 68.9, 42.3, 49.6], ['DeepSeek-OCR 2 (open)', 77.9, 38.5, 34.8, 55.9],
  ];
  const W = 860, H = 560, m = { l: 170, r: 20, t: 34, b: 30 };
  const x = d3.scaleLinear().domain([30, 100]).range([m.l, W - m.r]);
  const y = d3.scaleBand().domain(D.map(d => d[0])).range([m.t, H - m.b]).padding(0.35);
  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`);
  const ax = svg.append('g').attr('class', 'ax').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(7).tickSize(-(H - m.t - m.b)).tickFormat(v => v + '%'));
  ax.selectAll('line').attr('stroke', '#eceef2'); ax.select('.domain').remove();
  const g = svg.append('g').selectAll('g').data(D).join('g').attr('transform', d => `translate(0,${y(d[0]) + y.bandwidth() / 2})`);
  g.append('text').attr('x', m.l - 12).attr('text-anchor', 'end').attr('dy', '0.35em').text(d => d[0]);
  g.append('line').attr('x1', d => x(Math.min(...d.slice(1)))).attr('x2', d => x(Math.max(...d.slice(1)))).attr('stroke', '#cfd2d9').attr('stroke-width', 2);
  S.forEach(([k, lab, c], i) => g.append('circle').attr('cx', d => x(d[i + 1])).attr('r', 6).attr('fill', c).attr('opacity', .9).append('title').text(d => `${d[0]} · ${lab}: ${d[i + 1]}%`));
  const lg = svg.append('g').attr('transform', `translate(${m.l},14)`);
  S.forEach(([k, lab, c], i) => { lg.append('circle').attr('cx', i * 150).attr('r', 5).attr('fill', c); lg.append('text').attr('x', i * 150 + 10).attr('dy', '0.35em').style('font-size', '12px').text(lab); });
});

/* ---------- Pareto frontier slides ---------- */
safe('frontier charts', function () {
  if (!window.DX || !DX.pareto || !window.ParetoChart) return;
  const fams = { saas: { label: 'Specialist API', color: '#1a2fd0' }, cloud: { label: 'Cloud service', color: '#12909a' }, open: { label: 'Open model (self-host)', color: '#2c9a58' }, vlm: { label: 'General model', color: '#7b4fd6' }, agent: { label: 'Coding agent', color: '#d64f97' }, libs: { label: 'Library / OCR', color: '#5b5f6a' } };
  const Y = { everyday: [62, 95], hard: [50, 96], extraction: [72, 98] };
  function mount(slideId, key) {
    const slide = document.getElementById(slideId); if (!slide) return;
    const fam = DX.pareto[key], tabs = slide.querySelector('.pf-tabs'), host = slide.querySelector('.pf-chart');
    const blended = key !== 'extraction';
    const views = [{ label: blended ? 'Blended index' : 'All documents', points: fam.points, multi: blended, metric: blended ? 'Blended index' : fam.metricLabel },
      ...(fam.rawViews || []).map(v => ({ ...v, multi: false, metric: v.metricLabel || 'Pass rate or score (%)' }))];
    const state = { filter: 'all', multiOnly: false }; // shared across views so a client constraint survives switching
    let chart;
    const render = i => {
      host.innerHTML = '';
      const div = document.createElement('div'); div.id = `${slideId}-c${i}`; host.appendChild(div);
      chart = ParetoChart(div, {
        points: views[i].points, families: fams, filters: HOST_FILTERS, multiToggle: views[i].multi, noHollow: !views[i].multi, state,
        xLabel: 'Cost per 1,000 pages (log scale) →', yLabel: views[i].metric, yDomain: i === 0 ? Y[key] : undefined,
        width: key === 'extraction' ? 820 : 1240, height: key === 'extraction' ? 560 : 450,
      });
      if (tabs) tabs.querySelectorAll('.bt').forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', j === i); });
    };
    if (tabs && views.length > 1) {
      tabs.innerHTML = '<span class="lbl">View</span>' + views.map(v => `<button type="button" class="bt">${v.label}</button>`).join('') + `<span class="lbl" style="margin-left:auto">${fam.method}</span>`;
      tabs.querySelectorAll('.bt').forEach((b, i) => b.addEventListener('click', () => render(i)));
    }
    render(0);
    slide.addEventListener('slide:enter', () => chart && chart.replay());
  }
  mount('pf-everyday', 'everyday'); mount('pf-hard', 'hard'); mount('pf-extract', 'extraction');
});

/* ---------- decision guide ---------- */
safe('decision guide', function () {
  const qs = document.getElementById('g-qs'), out = document.getElementById('g-out'); if (!qs) return;
  const Q = [
    ['docs', 'What are the documents?', [['digital', 'Digital PDFs'], ['scans', 'Scans or photos'], ['mixed', 'A mix']]],
    ['hard', 'What is the hardest content?', [['plain', 'Mostly plain text'], ['tables', 'Complex tables'], ['messy', 'Handwriting or poor scans'], ['charts', 'Charts and diagrams']]],
    ['lang', 'Which languages?', [['latin', 'Latin-script languages only'], ['other', 'Other scripts too']]],
    ['output', 'What do we need out?', [['text', 'Text for search or RAG'], ['fields', 'Specific fields as JSON']]],
    ['length', 'How long are the documents?', [['short', 'Under 20 pages'], ['long', '20 pages or more']]],
    ['where', 'Where may the documents be processed?', [['any', 'Anywhere'], ['azure', 'Azure only'], ['aws', 'AWS only'], ['gcp', 'Google Cloud only'], ['local', 'Own machines only']]],
    ['volume', 'How many pages a year?', [['low', 'Under 100,000'], ['high', '100,000 or more']]],
    ['audit', 'Must each value link to its source on the page?', [['no', 'No'], ['yes', 'Yes']]],
  ];
  const A = { docs: 'mixed', hard: 'tables', lang: 'latin', output: 'text', length: 'short', where: 'any', volume: 'low', audit: 'no' };
  qs.innerHTML = Q.map(([k, q, os]) => `<div class="g-q" data-k="${k}" role="radiogroup" aria-label="${q}"><span class="label">${q}</span><div class="opts">${os.map(([v, l]) => `<button type="button" role="radio" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
  qs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; A[b.closest('.g-q').dataset.k] = b.dataset.v; run(); });

  // Each option: text, whether it returns source positions, and whether it returns confidence scores.
  // Hosting follows the deployment records: marketplace billing alone does not count as running in that cloud.
  const opt = (t, pos = false, conf = false) => ({ t, pos, conf });
  const FOUNDRY_CLAUDE = 'in Foundry (hosted-on-Azure option)';
  const vendorExtract = { any: 'Reducto Extract, LlamaExtract or Datalab extract', azure: 'Azure DI custom extraction or prebuilt models (invoices, receipts)', aws: 'Bedrock Data Automation or Textract Queries', gcp: 'Document AI Custom Extractor', local: 'The same model reading page images, to check nothing is lost from tables or layout' };
  const grounded = {
    any: opt('LandingAI ADE or Reducto Extract, which link each value to a page region', true, true),
    azure: opt('Azure DI custom extraction or prebuilt models, which return each field with its page region and confidence score', true, true),
    aws: opt('Bedrock Data Automation (custom blueprint) or Textract Queries, which return each field with its page region', true, true),
    gcp: opt('Document AI Custom Extractor, which returns each field with its page region and confidence score', true, true),
    local: opt('Docling to parse with positions, a self-hosted model to extract, then match each value to its source text and flag values with no match', true, false),
  };
  const groundedCost = { any: '$15–64 per 1,000 pages', azure: 'About $30 per 1,000 pages', aws: '$15–40 per 1,000 pages', gcp: 'About $30 per 1,000 pages', local: 'Under $2 per 1,000 pages in GPU time, plus engineering effort' };
  const boxes = {
    any: opt('Datalab with word boxes (about $13 per 1,000 pages)', true, true),
    azure: opt('Azure DI Layout ($10), which returns boxes and confidence scores', true, true),
    aws: opt('Textract ($1.50–15), which returns boxes and confidence scores', true, true),
    gcp: opt('Document AI OCR or Layout Parser, which return boxes and confidence scores', true, true),
    local: opt('Docling or Surya, which return block positions and confidence scores', true, true),
  };

  function pick(a) {
    const W = a.where, by = o => o[W] ?? o.any, other = a.lang === 'other';
    const r = { start: null, why: '', test: [], cost: '', watch: [] };
    const hardContent = a.hard === 'messy' || a.hard === 'charts';

    if (a.output === 'fields') {
      if (a.length === 'long') {
        r.start = by({
          any: opt('A vendor extraction pipeline: LlamaExtract Agentic or Reducto Deep Extract'),
          azure: opt('A pipeline on Azure: Azure DI Layout to parse, GPT-6 Sol in Azure OpenAI to extract each section, then a reconciliation step', true, true),
          aws: opt('Bedrock Data Automation (custom blueprint), or a pipeline: Textract Layout to parse, Claude Sonnet 5.5 on Bedrock to extract, then a reconciliation step', true, true),
          gcp: opt('A pipeline on Google Cloud: Document AI Layout Parser to parse, Gemini 3.8 Flash to extract, then a reconciliation step', true, true),
          local: opt('A self-hosted pipeline: Docling to parse, Qwen3.8 27B to extract, then a reconciliation step', true),
        });
        r.why = "Plain model calls score 5–38 on ExtractBench's long documents. Pipelines that split, extract, reconcile and check score above 90.";
        r.test.push(by({ any: 'A coding agent (Claude Code or Codex) for unusual one-off jobs', azure: 'Azure Content Understanding', aws: 'Claude Code configured to use Bedrock, for unusual one-off jobs', gcp: 'Document AI Custom Extractor', local: 'A second open model on the same pipeline' }));
        r.cost = by({ any: '$31–64 per 1,000 pages (ExtractBench-reported)', azure: 'About $10 per 1,000 pages to parse, plus model costs for each extraction pass', aws: 'About $40 per 1,000 pages for Bedrock Data Automation custom output', gcp: 'About $10 per 1,000 pages to parse, plus about $4–7 for each extraction pass', local: 'Under $2 per 1,000 pages in GPU time, plus engineering effort' });
        r.watch.push('Add a reconciliation step for values that depend on definitions, amendments or tables that span pages. Evaluate on whole documents, not single pages.');
        if (W === 'aws') r.watch.push('Reducto and LlamaExtract on AWS Marketplace are vendor-hosted. They qualify only under a private deployment inside your account.');
      } else if (a.docs === 'digital' && a.hard === 'plain') {
        const m = by({ any: 'Gemini 3.8 Flash', azure: 'GPT-6 Luna in Azure OpenAI', aws: 'Claude Haiku 5.5 on Bedrock', gcp: 'Gemini 3.8 Flash', local: 'a self-hosted model (Qwen3.8 27B)' });
        r.start = opt(`Extract the PDF text layer, then pass the text to ${m} with a structured-output mode`);
        r.why = 'This avoids a new recognition step, provided the text layer is complete and readable. No published benchmark covers this exact setup; measure it on your sample.';
        r.test.push(by(vendorExtract));
        r.cost = by({ any: 'About $1–3 per 1,000 pages', azure: 'Under $1 per 1,000 pages', aws: 'Under $1 per 1,000 pages', gcp: 'About $1–3 per 1,000 pages', local: 'Under $1 per 1,000 pages in GPU time' });
      } else if (hardContent) {
        r.start = by({
          any: opt('Gemini 3.8 Flash with thinking enabled, or Claude Sonnet 5.5, with a structured-output mode'),
          azure: opt(`Claude Sonnet 5.5 ${FOUNDRY_CLAUDE} with a structured-output mode`),
          aws: opt('Claude Sonnet 5.5 on Bedrock with a structured-output mode'),
          gcp: opt('Gemini 3.8 Flash with thinking enabled and a structured-output mode'),
          local: opt('Qwen3.8 27B, self-hosted, with a JSON schema'),
        });
        r.why = W === 'local' ? 'Expect lower accuracy than the best hosted models on difficult pages. Measure the gap on your sample.'
          : "Difficult pages need stronger reading than the cheapest models give. These models lead OmniParseBench's hard-rendering slice (88–89). No published field-extraction result covers these exact settings.";
        r.test.push(by(vendorExtract));
        r.cost = by({ any: 'About $7–35 per 1,000 pages, depending on the model and thinking setting', azure: 'About $17–34 per 1,000 pages', aws: 'About $17–34 per 1,000 pages', gcp: 'About $7–37 per 1,000 pages, depending on the thinking setting', local: 'Under $2 per 1,000 pages in GPU time' });
      } else {
        r.start = by({
          any: opt('Gemini 3.8 Flash with low thinking and a structured-output mode'),
          azure: opt('GPT-6 Luna in Azure OpenAI with a structured-output mode'),
          aws: opt('Claude Haiku 5.5 on Bedrock with a structured-output mode'),
          gcp: opt('Gemini 3.8 Flash with low thinking and a structured-output mode'),
          local: opt('Qwen3.8 27B, self-hosted, with a JSON schema'),
        });
        r.why = by({
          any: 'Low cost. On ExtractBench it scores 88.1 on short documents (80.7 overall), against 94–96 for vendor extraction products costing $10–75 per 1,000 pages.',
          gcp: 'Low cost. On ExtractBench it scores 88.1 on short documents (80.7 overall), against 94–96 for vendor extraction products.',
          azure: 'Low cost and hosted on Azure. No published extraction benchmark covers this model; measure it on your sample.',
          aws: 'Low cost and hosted on AWS. No published extraction benchmark covers this model; measure it on your sample.',
          local: 'One of the strongest open models on ExtractBench (89.8 overall).',
        });
        r.test.push(W === 'local' ? 'A second open model (GLM-5.3 Flash, 80.8 on ExtractBench)' : by(vendorExtract));
        r.cost = by({ any: 'About $4–7 per 1,000 pages', azure: 'About $1 per 1,000 pages', aws: 'About $1–2 per 1,000 pages', gcp: 'About $4–7 per 1,000 pages', local: 'Under $2 per 1,000 pages in GPU time' });
      }
      r.watch.push('Use the provider’s structured-output mode, then validate the result: the mode constrains the format, not the values. Handle refusals and truncated responses. Record missing fields as missing, not as false or zero.');
    } else if (a.docs === 'digital' && a.hard === 'plain') {
      r.start = opt('Text-layer extraction (pymupdf4llm or Docling), after checking the text layer is complete and readable', true);
      r.why = "Reading the PDF's own text avoids a new recognition step. It is not automatically correct: check for missing or garbled text and send those pages to OCR.";
      r.test.push(by({ any: 'Mistral OCR 4 or Datalab balanced ($4)', azure: 'Azure DI Layout ($10), or Mistral OCR 4 in Foundry ($4)', aws: 'Textract Layout ($4)', gcp: 'Document AI Layout Parser ($10)', local: 'MinerU2.5-Pro or PaddleOCR-VL 1.6, self-hosted' }));
      r.cost = 'Close to $0 for the text layer, plus OCR for the pages that fail';
      r.watch.push('Multi-column layouts and headers can come out in the wrong order. PyMuPDF is AGPL; Docling is MIT.');
    } else if (a.hard === 'charts') {
      r.start = by({
        any: opt('LlamaParse Agentic ($12.50)', true),
        azure: opt(`Claude Opus 5.5 ${FOUNDRY_CLAUDE}`),
        aws: opt('Claude Opus 5.5 on Bedrock'),
        gcp: opt('Claude Opus 5.5 on Vertex AI'),
        local: opt('dots.mocr, self-hosted, which converts charts to code'),
      });
      r.why = W === 'local' ? 'No published chart benchmark covers self-hosted models. Measure on sample charts.'
        : "The hard-pages chart in this deck does not measure charts. On ParseBench's chart test (run by LlamaIndex): LlamaParse Agentic 88.7, Claude Opus 5.5 70.9, Claude Sonnet 5.5 37.7, most parsers without a chart step 1–10.";
      r.test.push(by({ any: 'Claude Opus 5.5', azure: 'GPT-6 Sol in Azure OpenAI', aws: 'Claude Sonnet 5.5 on Bedrock', gcp: 'Gemini 3.8 Flash with high thinking', local: 'Qwen3.8 27B, self-hosted' }));
      r.cost = by({ any: 'About $12.50 per 1,000 pages', azure: 'About $33–60 per 1,000 pages', aws: 'About $33–60 per 1,000 pages', gcp: 'About $33–60 per 1,000 pages', local: 'Under $2 per 1,000 pages in GPU time' });
      r.watch.push('Values read off chart axes are estimates. Check them against the source data where it exists.');
    } else if (a.hard === 'messy') {
      r.start = by({
        any: opt('Datalab accurate ($10)', true, true),
        azure: opt(`Claude Sonnet 5.5 ${FOUNDRY_CLAUDE}`),
        aws: opt('Claude Sonnet 5.5 on Bedrock'),
        gcp: opt('Gemini 3.8 Flash'),
        local: other ? opt('Chandra 2, self-hosted (licence needed above $2M revenue)', true) : opt('LightOnOCR-3 4B (Apache-2.0) or Chandra 2 (licence needed above $2M revenue), self-hosted', true),
      });
      r.why = by({
        any: 'OmniParseBench hard rendering 87.6, handwriting 76.2. Gemini 3.8 Flash reads handwriting best (81.4) at a higher benchmarked cost.',
        azure: 'OmniParseBench hard rendering 88.4, handwriting 77.9.',
        aws: 'OmniParseBench hard rendering 88.4, handwriting 77.9.',
        gcp: 'Best handwriting result on OmniParseBench (81.4); hard rendering 89.2.',
        local: other ? 'The strongest self-hosted model on non-Latin text in OmniParseBench (80.9).' : 'Best self-hosted handwriting results on OmniParseBench (about 70), roughly 10 points below the best hosted models.',
      });
      r.test.push(by({ any: 'Gemini 3.8 Flash', azure: 'GPT-6 Sol in Azure OpenAI (no published handwriting result; measure it)', aws: 'Textract, which supports handwriting and returns confidence scores', gcp: 'Claude Sonnet 5.5 on Vertex AI', local: 'dots.mocr, self-hosted' }));
      r.cost = by({ any: a.audit === 'yes' ? 'About $13 per 1,000 pages including word boxes' : 'About $10 per 1,000 pages', azure: 'About $17–34 per 1,000 pages', aws: 'About $17–34 per 1,000 pages', gcp: 'About $4 per 1,000 pages with thinking off, up to $37 as benchmarked', local: 'Under $2 per 1,000 pages in GPU time' });
      if (a.volume === 'high' && W !== 'local') r.watch.push('At this volume, send only the difficult pages to this option and process the rest with a cheaper one.');
    } else {
      r.start = by({
        any: opt('Datalab balanced ($4) or Mistral OCR 4 ($4)', true, true),
        azure: other ? opt('Mistral OCR 4 in Foundry ($4)', true, true) : opt('Azure DI Layout ($10)', true, true),
        aws: opt('Claude Haiku 5.5 on Bedrock'),
        gcp: opt('Gemini 3.8 Flash with low thinking'),
        local: other ? opt('Chandra 2, self-hosted (licence needed above $2M revenue)', true) : opt('MinerU2.5-Pro or dots.mocr, self-hosted', true),
      });
      r.why = by({
        any: 'Both are on or near the blended frontiers at about $4 per 1,000 pages (OmniParseBench tables 89.2 and 91.9).',
        azure: other ? 'Mistral OCR scores 81.5 on non-Latin text in OmniParseBench; Azure DI Layout scores 49.6.' : 'First-party Azure service. ParseBench tables 86.0; returns boxes and confidence scores.',
        aws: 'Hosted on AWS. ParseBench tables 86.9 at about $1.40 per 1,000 pages.',
        gcp: 'Hosted on Vertex AI. ParseBench tables 88.2 at about $7 per 1,000 pages.',
        local: other ? 'The strongest self-hosted model on non-Latin text in OmniParseBench (80.9).' : 'OmniParseBench tables 92.1 (MinerU) and 88.6 (dots.mocr).',
      });
      r.test.push(by({ any: 'Reducto ($10)', azure: other ? 'Azure DI Layout ($10)' : 'Mistral OCR 4 in Foundry ($4)', aws: 'Textract Tables ($15)', gcp: 'Document AI Layout Parser ($10)', local: 'PaddleOCR-VL 1.6 (Apache-2.0)' }));
      if (a.docs === 'digital') r.test.push('Docling (free; takes table cell text from the PDF itself)');
      if (a.volume === 'high' && W !== 'local' && !other) r.test.push('A small open model (LightOnOCR-3, PaddleOCR-VL) on GPUs in your own account, for simple pages');
      r.cost = by({ any: 'About $4 per 1,000 pages', azure: other ? 'About $4 per 1,000 pages' : 'About $10 per 1,000 pages', aws: 'About $1–2 per 1,000 pages', gcp: 'About $4–7 per 1,000 pages', local: 'Under $1 per 1,000 pages in GPU time' });
    }

    // Source evidence: for fields, the primary workflow must link each value to its page region.
    if (a.audit === 'yes') {
      if (a.output === 'fields') {
        r.test.unshift(r.start.t);
        r.start = by(grounded);
        if (W === 'azure' || W === 'aws' || W === 'gcp') r.test = r.test.filter(t => t !== by(vendorExtract)); // already the starting option
        r.why = 'Each accepted value must link to the page region that supports it. These options return that link; the general-model approach is kept as a comparison.';
        r.cost = by(groundedCost);
      } else if (a.output === 'text' && !r.start.pos) {
        r.test.unshift(r.start.t);
        r.start = by(boxes);
        r.why = 'Every passage must link back to its position on the page. This option returns positions; the general model is kept as a comparison.';
        r.cost = by({ any: 'About $13 per 1,000 pages including word boxes', azure: 'About $10 per 1,000 pages', aws: '$1.50–15 per 1,000 pages, depending on the features used', gcp: '$1.50–10 per 1,000 pages', local: 'Under $1 per 1,000 pages in GPU time' });
      }
      if (a.output === 'fields') r.watch.push('Check how repeated values, reformatted dates and inferred fields are linked to evidence. Values with no supporting region should go to review, not into the dataset.');
    }

    // Review signals: name one the chosen workflow actually produces.
    if (hardContent || a.audit === 'yes') {
      r.watch.push(r.start.conf
        ? (/to parse/.test(r.start.t) ? 'Use the confidence scores from the parsing step' : 'Use the confidence scores it returns') + ' to route uncertain text for review. They measure how sure it is of the reading, not whether a value is correct for its field.'
        : 'General models return no reliable confidence scores. Decide what to review using validation rules, a second extraction pass, or an OCR engine’s confidence scores.');
    }

    const named = r.start.t + ' ' + r.test.join(' ');
    if (other) {
      const weak = [['Reducto', 64.3], ['Azure DI', 49.6], ['MinerU', 51.3], ['LightOnOCR', 53.7], ['PaddleOCR', 52.3]].filter(([n]) => named.includes(n));
      if (weak.length) r.watch.push('Weak on non-Latin text in OmniParseBench: ' + weak.map(([n, v]) => `${n} ${v}%`).join(', ') + '.');
    }
    if (/Azure DI/.test(named) && a.hard === 'messy') r.watch.push('Azure DI Layout scores 42% on handwriting in OmniParseBench.');
    if (/Foundry \(hosted-on-Azure option\)/.test(named)) r.watch.push('In Foundry, choose the hosted-on-Azure option for Claude: an Anthropic-operated service on Azure infrastructure. Confirm the region.');
    if (/Mistral OCR 4 in Foundry/.test(named)) r.watch.push('Confirm the hosting option and region for Mistral OCR in Foundry before relying on it for an Azure-only requirement.');
    if (/Layout Parser/.test(named)) r.watch.push('Some Gemini-based Layout Parser versions route through a global endpoint. Choose a processor version that meets the data-residency requirement.');
    if (/Gemini 3\.8/.test(named)) r.watch.push('Gemini 3.8 Flash prices double on 1 January 2027.');
    if (/Chandra|Marker|Surya/.test(named)) r.watch.push('Chandra, Marker and Surya model weights need a commercial licence above $2–5M revenue.');
    if (/MinerU/.test(named)) r.watch.push('MinerU needs a commercial licence above $20M monthly revenue or 100M monthly users.');
    return { ...r, start: r.start.t };
  }
  function run() {
    qs.querySelectorAll('.g-q').forEach(q => q.querySelectorAll('button').forEach(b => { const on = A[q.dataset.k] === b.dataset.v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }));
    const lenQ = qs.querySelector('[data-k="length"]'), fields = A.output === 'fields';
    lenQ.style.opacity = fields ? 1 : .35;
    lenQ.querySelectorAll('button').forEach(b => (b.disabled = !fields));
    lenQ.querySelector('.label').textContent = fields ? 'How long are the documents?' : 'How long are the documents? (only affects field extraction)';
    const r = pick(A);
    out.innerHTML = `<h4>Start with</h4><div class="pick">${r.start}</div><div class="why">${r.why}</div>
      <h4>Test it against</h4><ul>${r.test.map(t => `<li>${t}</li>`).join('')}</ul>
      <h4>Rough cost (list price)</h4><div class="why" style="color:var(--ink-2)">${r.cost}</div>
      ${r.watch.length ? `<h4>Watch out for</h4><ul>${r.watch.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      <p class="src" style="margin-top:12px">Picks dated 22 Oct 2026. A starting point for a test on the client's documents, not a final answer.</p>`;
  }
  window.__guidePick = pick; // used by the automated combination checks
  run();
});
