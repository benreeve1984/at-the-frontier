// Interactive demo slides for the document extraction session.
const on = (id, fn) => { const s = document.getElementById(id); if (s) { s.addEventListener('slide:step', e => fn(s, e.detail.step)); s.addEventListener('slide:enter', e => fn(s, e.detail.step, true)); } };

/* ---------- PDF internals ---------- */
(function () {
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
})();

/* ---------- OCR pipeline ---------- */
(function () {
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
})();

/* ---------- How a VLM reads a page ---------- */
(function () {
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
})();

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
(function () {
  const sel = document.getElementById('calc-model'); if (!sel || !window.DX) return;
  const ms = DX.calcModels;
  sel.innerHTML = ms.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  sel.value = 'gemini-3.8-flash';
  const pages = document.getElementById('calc-pages'), out = document.getElementById('calc-out'), batch = document.getElementById('calc-batch');
  function run() {
    const m = ms.find(x => x.id === sel.value), n = Math.round(10 ** +pages.value), o = +out.value, b = batch.checked;
    const pin = b ? m.price.batch_input ?? m.price.input / 2 : m.price.input, pout = b ? m.price.batch_output ?? m.price.output / 2 : m.price.output;
    const cin = m.tok.input * pin / 1e6, cout = o * pout / 1e6, per = (cin + cout) * 1000;
    document.getElementById('calc-pages-v').textContent = n.toLocaleString();
    document.getElementById('calc-out-v').textContent = o.toLocaleString();
    document.getElementById('calc-per').textContent = fmt$(per);
    document.getElementById('calc-total').textContent = fmt$(per * n / 1000);
    document.getElementById('calc-in-bar').style.width = (cin / (cin + cout) * 100) + '%';
    document.getElementById('calc-out-bar').style.width = (cout / (cin + cout) * 100) + '%';
    document.getElementById('calc-compare').textContent = `For comparison, the same ${n.toLocaleString()} pages: Azure DI Layout ${fmt$(10 * n / 1000)} · self-hosted olmOCR about ${fmt$(0.2 * n / 1000)} in GPU time. Input ${m.tok.input.toLocaleString()} tokens per page (image + prompt).`;
  }
  [sel, pages, out, batch].forEach(e => e.addEventListener('input', run));
  run();
})();

/* ---------- player map ---------- */
(function () {
  const grid = document.getElementById('pl-grid'); if (!grid || !window.DX) return;
  const slide = grid.closest('.slide');
  grid.style.gridTemplateColumns = `repeat(${DX.columns.length}, 1fr)`;
  const dotC = { cloud: 'var(--blue)', self: 'var(--green)', saas: 'var(--orange)' };
  grid.innerHTML = DX.columns.map(c => `<div class="pl-col" style="--c:${c.color}"><h4>${c.label}</h4>` + c.items.map(p =>
    `<div class="pl" data-id="${p.id}"><span>${p.name}<span class="tags">${['cloud', 'self', 'saas'].filter(k => p.deploy[k]).map(k => `<i style="background:${dotC[k]}"></i>`).join('')}</span></span><span class="pr">${p.cost == null ? 'quote' : fmt$(p.cost)}</span></div>`).join('') + '</div>').join('');
  grid.insertAdjacentHTML('afterend', `<div class="pl-legend"><span><i style="background:var(--blue)"></i>On Azure, GCP or AWS</span><span><i style="background:var(--green)"></i>Self-host</span><span><i style="background:var(--orange)"></i>Vendor API</span><span style="margin-left:auto">Price = list $ per 1,000 pages</span></div>`);
  const tip = document.createElement('div'); tip.className = 'pl-tip'; slide.appendChild(tip);
  const all = DX.columns.flatMap(c => c.items);
  grid.addEventListener('mouseover', e => {
    const el = e.target.closest('.pl'); if (!el) { tip.style.display = 'none'; return; }
    const p = all.find(x => x.id === el.dataset.id);
    const where = [p.deploy.cloud && `Cloud: ${p.deploy.cloud}`, p.deploy.self && 'Self-host', p.deploy.saas && 'Vendor API'].filter(Boolean).join(' · ');
    tip.innerHTML = `<b>${p.name}</b>${p.notes}<span class="k">Where it runs</span>${where}${p.licence ? `<span class="k">Licence</span>${p.licence}` : ''}<span class="k">Price basis</span>${p.basis}`;
    const r = el.getBoundingClientRect(), sr = slide.getBoundingClientRect(), sc = sr.width / 1440;
    let x = (r.right - sr.left) / sc + 8, y = (r.top - sr.top) / sc - 10;
    if (x > 1080) x = (r.left - sr.left) / sc - 330;
    tip.style.left = x + 'px'; tip.style.top = Math.min(y, 560) + 'px'; tip.style.display = 'block';
  });
  grid.addEventListener('mouseleave', () => (tip.style.display = 'none'));
  slide.querySelectorAll('.pl-filters button').forEach(b => b.addEventListener('click', () => {
    slide.querySelectorAll('.pl-filters button').forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    grid.querySelectorAll('.pl').forEach(el => { const p = all.find(x => x.id === el.dataset.id); el.classList.toggle('dim', f !== 'all' && !p.deploy[f]); });
  }));
})();

/* ---------- price ladder ---------- */
(function () {
  const el = document.getElementById('ladder-chart'); if (!el || !window.DX || !window.d3) return;
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
})();

/* ---------- OmniParseBench easy vs hard dot plot ---------- */
(function () {
  const el = document.getElementById('dumbbell'); if (!el || !window.d3) return;
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
})();

/* ---------- Pareto frontier slides ---------- */
(function () {
  if (!window.DX || !DX.pareto || !window.ParetoChart) return;
  const fams = { saas: { label: 'Specialist API', color: '#1a2fd0' }, cloud: { label: 'Cloud service', color: '#12909a' }, open: { label: 'Open model (self-host)', color: '#2c9a58' }, vlm: { label: 'General model', color: '#7b4fd6' }, libs: { label: 'Library / OCR', color: '#5b5f6a' } };
  const filters = [{ id: 'all', label: 'All' }, { id: 'cloud', label: 'On Azure, GCP or AWS' }, { id: 'cloudself', label: 'Cloud or self-host' }, { id: 'self', label: 'Self-host' }];
  const Y = { everyday: [62, 95], hard: [50, 96], extraction: [72, 98] };
  function mount(slideId, key) {
    const slide = document.getElementById(slideId); if (!slide) return;
    const fam = DX.pareto[key], tabs = slide.querySelector('.pf-tabs'), host = slide.querySelector('.pf-chart');
    const views = [{ label: fam.rawViews ? 'Blended' : fam.benches[0], points: fam.points, multi: !!fam.rawViews }, ...(fam.rawViews || []).map(v => ({ ...v, multi: false }))];
    let chart, cur = 0;
    const render = i => {
      cur = i;
      host.innerHTML = '';
      const div = document.createElement('div'); div.id = `${slideId}-c${i}`; host.appendChild(div);
      chart = ParetoChart(div, {
        points: views[i].points, families: fams, filters, multiToggle: views[i].multi, noHollow: !views[i].multi,
        xLabel: 'Cost per 1,000 pages (log scale) →', yLabel: views[i].multi ? 'Blended score ↑' : 'Score ↑', yDomain: Y[key],
        width: key === 'extraction' ? 820 : 1240, height: key === 'extraction' ? 590 : 470,
      });
      if (tabs) tabs.querySelectorAll('.bt').forEach((b, j) => b.classList.toggle('on', j === i));
    };
    if (tabs && views.length > 1) {
      tabs.innerHTML = '<span class="lbl">View</span>' + views.map((v, i) => `<button class="bt">${v.label}</button>`).join('') + `<span class="lbl" style="margin-left:auto">${fam.method}</span>`;
      tabs.querySelectorAll('.bt').forEach((b, i) => b.addEventListener('click', () => render(i)));
    }
    render(0);
    slide.addEventListener('slide:enter', () => chart && chart.replay());
  }
  mount('pf-everyday', 'everyday'); mount('pf-hard', 'hard'); mount('pf-extract', 'extraction');
})();

/* ---------- decision guide ---------- */
(function () {
  const qs = document.getElementById('g-qs'), out = document.getElementById('g-out'); if (!qs) return;
  const Q = [
    ['docs', 'What are the documents?', [['digital', 'Digital PDFs'], ['scans', 'Scans or photos'], ['mixed', 'A mix']]],
    ['hard', 'What is the hardest content?', [['plain', 'Mostly plain text'], ['tables', 'Complex tables'], ['messy', 'Handwriting, poor scans or charts']]],
    ['output', 'What do we need out?', [['text', 'Text for search or RAG'], ['fields', 'Specific fields as JSON']]],
    ['length', 'How long are they?', [['short', 'Under about 20 pages'], ['long', '100+ pages']]],
    ['where', 'Where can the data go?', [['any', 'Anywhere'], ['azure', 'Azure only'], ['aws', 'AWS only'], ['gcp', 'Google Cloud only'], ['local', 'Own machines only']]],
    ['volume', 'How many pages a year?', [['low', 'Under 100,000'], ['high', 'Millions']]],
    ['audit', 'Must we show where each value came from?', [['no', 'No'], ['yes', 'Yes']]],
  ];
  const A = { docs: 'mixed', hard: 'tables', output: 'text', length: 'short', where: 'any', volume: 'low', audit: 'no' };
  qs.innerHTML = Q.map(([k, q, os]) => `<div class="g-q" data-k="${k}"><span class="label">${q}</span><div class="opts">${os.map(([v, l]) => `<button data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
  qs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; A[b.closest('.g-q').dataset.k] = b.dataset.v; run(); });

  function pick(a) {
    const W = a.where, r = { test: [], watch: [] };
    const by = (o) => o[W] || o.any;
    if (a.output === 'fields') {
      if (a.length === 'long') {
        r.start = by({ any: 'A vendor extraction pipeline: LlamaExtract, Reducto Deep Extract or Datalab', aws: 'Reducto Deep Extract or LlamaExtract through AWS Marketplace', azure: 'Claude Sonnet 5.5 in Foundry, inside a split, extract and check pipeline', gcp: 'Gemini 3.8 Flash inside a split, extract and check pipeline', local: 'A self-hosted model (Qwen3.8 27B) inside a split, extract and check pipeline' });
        r.why = 'Single model calls score 5–38 on long documents. Pipelines that split and check score above 90.';
        r.test.push(W === 'local' ? 'A second open model on the same pipeline' : 'A coding agent (Claude Code or Codex) on a sample, for unusual layouts');
        r.cost = '$30–75 per 1,000 pages for vendor pipelines';
      } else {
        r.start = by({ any: 'Gemini 3.8 Flash with low thinking and a JSON schema', aws: 'Claude Haiku 5.5 or Sonnet 5.5 on Bedrock with a JSON schema', azure: 'GPT-6 Luna or Claude Sonnet 5.5 in Foundry with a JSON schema', gcp: 'Gemini 3.8 Flash with low thinking and a JSON schema', local: 'A self-hosted model (Qwen3.8 27B) with a JSON schema' });
        r.why = 'Most established systems score 93–97 on short documents.';
        if (W !== 'local') r.test.push('Reducto Extract, LlamaExtract or Datalab extract');
        r.cost = '$1–10 per 1,000 pages';
      }
      r.watch.push('Valid JSON may still contain wrong values. Add checks on totals, dates and required fields.');
    } else if (a.docs === 'digital' && a.hard === 'plain') {
      r.start = 'Text-layer extraction (pymupdf4llm or Docling), sending only failed pages to a model';
      r.why = 'The PDF already contains exact text. Use it, and apply a model only where the text layer is missing or broken.';
      r.test.push(by({ any: 'Mistral OCR 4 or Datalab balanced ($4)', aws: 'Claude Haiku 5.5 on Bedrock', azure: 'Mistral OCR 4 in Foundry ($4)', gcp: 'Gemini 3.1 Flash-Lite', local: 'Marker or MinerU, self-hosted' }));
      r.cost = 'Close to $0, plus the cost of the failed pages';
      r.watch.push('Multi-column layouts and headers can come out in the wrong order. PyMuPDF is AGPL.');
    } else if (a.hard === 'messy') {
      r.start = by({ any: 'Datalab accurate ($10)', aws: 'Claude Sonnet 5.5 on Bedrock', azure: 'Claude Sonnet 5.5 in Foundry', gcp: 'Gemini 3.8 Flash', local: 'Chandra 2 (licence needed) or dots.mocr' });
      r.why = 'Difficult pages separate systems by 10–30 points. These options are at the top of the hard-pages frontier.';
      r.test.push(by({ any: 'Gemini 3.8 Flash or Claude Sonnet 5.5', aws: 'Reducto via AWS Marketplace', azure: 'Mistral OCR 4 in Foundry', gcp: 'Claude Sonnet 5.5 on Vertex', local: 'MinerU2.5-Pro' }));
      r.cost = W === 'local' ? 'Under $2 per 1,000 pages in GPU time' : '$10–35 per 1,000 pages';
      r.watch.push('Request word-level confidence scores and send low-confidence results for human review.');
    } else {
      r.start = by({ any: a.volume === 'high' ? 'Datalab balanced or Mistral OCR 4 ($4)' : 'Datalab balanced ($4) or Claude Haiku 5.5', aws: 'Claude Haiku 5.5 on Bedrock', azure: 'Mistral OCR 4 in Foundry ($4)', gcp: 'Gemini 3.8 Flash with low thinking', local: 'MinerU2.5-Pro or dots.mocr' });
      r.why = 'Low-cost options on or near the frontier for typical pages and tables.';
      r.test.push(by({ any: 'Reducto ($10)', aws: 'Textract Tables ($15)', azure: 'Azure DI Layout ($10)', gcp: 'Document AI Layout Parser ($10)', local: 'PaddleOCR-VL 1.6' }));
      r.cost = W === 'local' ? 'Under $1 per 1,000 pages in GPU time' : '$1–10 per 1,000 pages';
    }
    if (a.volume === 'high' && W !== 'local' && a.output === 'text') r.test.push('A self-hosted small model (LightOnOCR, MinerU) for 10–30× lower cost on easy pages');
    if (a.audit === 'yes') { r.watch.push('Choose an option that returns boxes and confidence (Azure DI, Textract, Datalab, Mistral OCR 4, Docling). Locations returned by general models are approximate and should not be relied on for audit.'); }
    if (a.docs !== 'digital' && W === 'azure') r.watch.push('Azure DI Layout scores 42% on handwriting and 50% on non-Latin text in OmniParseBench.');
    if (W === 'gcp' || /Gemini 3.8/.test(r.start)) r.watch.push('Gemini 3.8 Flash prices double on 1 January 2027.');
    if (W === 'local') r.watch.push('Check model licences: Chandra, Marker and Surya need a licence above $2–5M revenue.');
    return r;
  }
  function run() {
    qs.querySelectorAll('.g-q').forEach(q => q.querySelectorAll('button').forEach(b => b.classList.toggle('on', A[q.dataset.k] === b.dataset.v)));
    qs.querySelector('[data-k="length"]').style.opacity = A.output === 'fields' ? 1 : .35;
    const r = pick(A);
    out.innerHTML = `<h4>Start with</h4><div class="pick">${r.start}</div><div class="why">${r.why}</div>
      <h4>Test it against</h4><ul>${r.test.map(t => `<li>${t}</li>`).join('')}</ul>
      <h4>Rough cost</h4><div class="why" style="color:var(--ink-2)">${r.cost}</div>
      ${r.watch.length ? `<h4>Watch out for</h4><ul>${r.watch.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      <p class="src" style="margin-top:16px">Picks dated 22 Oct 2026. A starting point for a test on the client's documents, not a final answer.</p>`;
  }
  run();
})();
