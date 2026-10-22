// Interactive Pareto chart (needs d3 v7).
// ParetoChart(el, {points, families, filters, xLabel, yLabel, yDomain, state, onState, tolerance})
// point: {id, name, family, deploy: {hosted, billing, private, weights, saas, note}, cost, score, n, raw: [{bench, score}], costBasis}
// filters: [{id, label, test(point)}]. state ({filter, multiOnly}) is shared by the caller so it survives view switches.
window.ParetoChart = function (el, opts) {
  el.classList.add('pareto');
  if (!window.d3) {
    el.innerHTML = '<div class="pc-missing">This chart needs the D3 library, which did not load. The data behind it is in the research files linked on the Sources slide.</div>';
    return { replay() {} };
  }
  const W = opts.width || 1180, H = opts.height || 560;
  const m = { l: 64, r: W < 1000 ? 130 : 200, t: 20, b: 52 };
  const fam = opts.families, tol = opts.tolerance ?? 1;
  const state = opts.state || { filter: 'all', multiOnly: false };
  const filterOf = id => opts.filters.find(f => f.id === id) || opts.filters[0];

  el.innerHTML = `
    <div class="pc-bar">
      <div class="pc-filters" role="group" aria-label="Show options that can run">${opts.filters.map(f => `<button type="button" data-f="${f.id}" aria-pressed="false">${f.label}</button>`).join('')}
        ${opts.multiToggle ? '<label class="pc-multi"><input type="checkbox"> Both benchmarks only</label>' : ''}</div>
    </div>
    <div class="pc-plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${opts.yLabel} against cost per 1,000 pages"></svg><div class="pc-tip" role="status"></div>
      <button type="button" class="pc-reset">Reset zoom</button></div>
    <div class="pc-legend">${Object.entries(fam).filter(([k]) => opts.points.some(p => p.family === k)).map(([k, v]) => `<span><i style="background:${v.color}"></i>${v.label}</span>`).join('')}
      ${opts.noHollow ? '' : '<span><i class="hollow"></i>One benchmark only</span>'}<span><i class="near"></i>Within ${tol} point of the frontier</span>
      <span class="pc-hint">Hover or tab to a point for details · scroll to zoom · drag to pan</span></div>`;
  const svg = d3.select(el).select('svg');
  const tip = el.querySelector('.pc-tip');

  const pts = opts.points.filter(p => p.cost != null && p.score != null);
  const xExt = d3.extent(pts, p => p.cost);
  const x0 = d3.scaleLog().domain([xExt[0] / 2.5, xExt[1] * 2.5]).range([m.l, W - m.r]);
  const yExt = opts.yDomain || [Math.floor(d3.min(pts, p => p.score) / 5) * 5 - 2, Math.min(100, Math.ceil(d3.max(pts, p => p.score) / 5) * 5 + 2)];
  const y0 = d3.scaleLinear().domain(yExt).range([H - m.b, m.t]);
  let x = x0, y = y0;

  svg.append('defs').append('clipPath').attr('id', el.id + '-clip')
    .append('rect').attr('x', m.l).attr('y', m.t).attr('width', W - m.l - m.r + 150).attr('height', H - m.t - m.b);
  const gx = svg.append('g').attr('class', 'pc-axis').attr('transform', `translate(0,${H - m.b})`);
  const gy = svg.append('g').attr('class', 'pc-axis').attr('transform', `translate(${m.l},0)`);
  svg.append('text').attr('class', 'pc-title').attr('x', W - m.r).attr('y', H - 12).attr('text-anchor', 'end').text(opts.xLabel);
  svg.append('text').attr('class', 'pc-title').attr('transform', `translate(18,${m.t}) rotate(-90)`).attr('text-anchor', 'end').text(opts.yLabel + ' →');
  const plot = svg.append('g').attr('clip-path', `url(#${el.id}-clip)`);
  const front = plot.append('path').attr('class', 'pc-front');
  const dotsG = plot.append('g');
  const labG = plot.append('g');

  const visible = p => (!state.multiOnly || (p.n || 1) > 1) && filterOf(state.filter).test(p);
  function frontier(list) {
    const s = list.slice().sort((a, b) => a.cost - b.cost || b.score - a.score);
    const f = []; let best = -Infinity;
    s.forEach(p => { if (p.score > best) { f.push(p); best = p.score; } });
    return f;
  }
  // best frontier score available at or below a given cost
  const bestAt = (f, cost) => f.reduce((b, q) => q.cost <= cost ? Math.max(b, q.score) : b, -Infinity);

  let near = new Set();
  function draw(animate) {
    const vis = pts.filter(visible), f = frontier(vis), fid = new Set(f.map(p => p.id));
    near = new Set(vis.filter(p => !fid.has(p.id) && bestAt(f, p.cost) - p.score <= tol).map(p => p.id));
    gx.call(d3.axisBottom(x).ticks(8, d => '$' + d3.format(d >= 1 ? ',.0f' : '.2~f')(d)).tickSize(-(H - m.t - m.b)));
    gy.call(d3.axisLeft(y).ticks(6).tickSize(-(W - m.l - m.r)));
    // staircase frontier: hold score until a cheaper-to-better step
    const stepPts = [];
    f.forEach((p, i) => { if (i) stepPts.push([x(p.cost), y(f[i - 1].score)]); stepPts.push([x(p.cost), y(p.score)]); });
    if (f.length) stepPts.push([W - m.r + 150, y(f[f.length - 1].score)]);
    front.attr('d', stepPts.length ? d3.line()(stepPts) : null);
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const len = front.node().getTotalLength ? front.node().getTotalLength() : 0;
      front.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len)
        .transition().duration(1400).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0)
        .on('end', () => front.attr('stroke-dasharray', null));
    }

    const d = dotsG.selectAll('g.pc-dot').data(pts, p => p.id);
    const de = d.enter().append('g').attr('class', 'pc-dot').attr('tabindex', 0).attr('role', 'button');
    de.append('circle').attr('class', 'ring').attr('r', 11);
    de.append('circle').attr('class', 'core').attr('r', 0);
    de.on('mouseenter focus', (ev, p) => showTip(p)).on('mouseleave blur', hideTip)
      .on('click', (ev, p) => tip.classList.contains('on') && tip.dataset.id === p.id ? hideTip() : showTip(p));
    const all = d.merge(de)
      .classed('off', p => !visible(p))
      .classed('front', p => fid.has(p.id))
      .classed('near', p => near.has(p.id))
      .attr('tabindex', p => visible(p) ? 0 : -1)
      .attr('aria-label', p => `${p.name}: score ${p.score.toFixed(1)}, $${p.cost} per 1,000 pages${fid.has(p.id) ? ', on the frontier' : near.has(p.id) ? ', near the frontier' : ''}`)
      .attr('transform', p => `translate(${x(p.cost)},${y(p.score)})`);
    all.select('circle.core')
      .attr('fill', p => (p.n || 1) > 1 || opts.noHollow ? fam[p.family].color : '#fff')
      .attr('stroke', p => fam[p.family].color)
      .transition().duration(animate ? 500 : 250).delay((p, i) => animate ? 300 + i * 25 : 0)
      .attr('r', p => fid.has(p.id) ? 8 : 6);

    // alternate labels above/below when neighbouring frontier points crowd each other
    const labelDy = new Map(); let prev = null;
    vis.filter(p => fid.has(p.id)).sort((a, b) => a.cost - b.cost).forEach(p => {
      const px = x(p.cost), py = y(p.score);
      const crowded = prev && px - prev.x < 150 && Math.abs(py - prev.y) < 26 && labelDy.get(prev.id) === -9;
      labelDy.set(p.id, crowded ? 20 : -9);
      prev = { id: p.id, x: px, y: py };
    });
    const lab = labG.selectAll('text').data(vis.filter(p => fid.has(p.id)), p => p.id);
    lab.exit().remove();
    lab.enter().append('text').attr('class', 'pc-lab').merge(lab)
      .attr('x', p => x(p.cost) + 11).attr('y', p => y(p.score) + (labelDy.get(p.id) ?? -9))
      .text(p => p.name);
    el.querySelectorAll('.pc-filters button').forEach(b => { const on = b.dataset.f === state.filter; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    if (opts.onDraw) opts.onDraw({ visible: vis, frontier: f, near });
  }

  function where(dep) {
    const parts = [];
    if (dep.hosted && dep.hosted.length) parts.push(`Hosted on: ${dep.hosted.join(', ')}`);
    if (dep.billing) parts.push(`Billing route only: ${dep.billing}`);
    if (dep.weights) parts.push('Self-host: downloadable weights or library');
    if (dep.private) parts.push('Private deployment available (enterprise contract)');
    if (dep.saas) parts.push('Vendor-hosted API');
    return parts.join('<br>') + (dep.note ? `<br><em>${dep.note}</em>` : '');
  }
  function showTip(p) {
    const fmt = v => '$' + (v >= 10 ? d3.format(',.0f')(v) : d3.format('.2~f')(v));
    tip.dataset.id = p.id;
    tip.innerHTML = `<b>${p.name}</b><span class="pc-fam" style="color:${fam[p.family].color}">${fam[p.family].label}</span>
      <div class="pc-kv"><span>${opts.yLabel}</span><span>${p.score.toFixed(1)}${opts.noHollow ? '' : ` <em>(${p.n} benchmark${p.n > 1 ? 's' : ''})</em>`}</span></div>
      <div class="pc-kv"><span>Cost / 1k pages</span><span>${fmt(p.cost)}</span></div>
      ${near.has(p.id) ? `<div class="pc-basis">Within ${tol} point of the frontier: treat as a tie with the frontier option at this cost.</div>` : ''}
      ${p.raw && p.raw.length ? `<div class="pc-raw">${p.raw.map(r => `<div><span>${r.bench}</span><span>${r.score}</span></div>`).join('')}</div>` : ''}
      ${p.costBasis ? `<div class="pc-basis">${p.costBasis}</div>` : ''}
      <div class="pc-basis">${where(p.deploy)}</div>`;
    const px = x(p.cost) / W * 100, py = y(p.score) / H * 100;
    tip.style.left = px > 60 ? '' : `calc(${px}% + 16px)`;
    tip.style.right = px > 60 ? `calc(${100 - px}% + 16px)` : '';
    tip.style.top = `${Math.min(py, 45)}%`;
    tip.classList.add('on');
  }
  function hideTip() { tip.classList.remove('on'); }

  const zoom = d3.zoom().scaleExtent([1, 20]).translateExtent([[m.l, m.t], [W - m.r, H - m.b]]).extent([[m.l, m.t], [W - m.r, H - m.b]])
    .on('zoom', ev => { x = ev.transform.rescaleX(x0); y = ev.transform.rescaleY(y0); draw(false); });
  svg.call(zoom).on('dblclick.zoom', null);
  el.querySelector('.pc-reset').addEventListener('click', () => svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity));
  el.querySelectorAll('.pc-filters button').forEach(b => b.addEventListener('click', () => {
    state.filter = b.dataset.f; hideTip(); draw(false); opts.onState && opts.onState(state);
  }));
  const mt = el.querySelector('.pc-multi input');
  if (mt) {
    mt.checked = !!state.multiOnly;
    mt.addEventListener('change', () => { state.multiOnly = mt.checked; draw(false); opts.onState && opts.onState(state); });
  }
  const off = pts.filter(p => p.score < yExt[0]);
  if (off.length) el.insertAdjacentHTML('beforeend', `<div class="pc-off">Below the chart: ${off.map(p => `${p.name} (${p.score.toFixed(0)})`).join(', ')}</div>`);
  draw(false);
  return { replay: () => draw(true) };
};
