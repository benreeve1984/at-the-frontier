// Interactive Pareto chart (needs d3 v7).
// ParetoChart(el, {points, families, filters, xLabel, yLabel, yDomain})
// point: {id, name, family, deploy: {cloud, saas, self}, cost, score, n, raw: [{bench, score, metric}], costBasis}
window.ParetoChart = function (el, opts) {
  const W = opts.width || 1180, H = opts.height || 560;
  const m = { l: 64, r: W < 1000 ? 130 : 200, t: 20, b: 52 };
  const fam = opts.families;
  const state = { filter: 'all', hover: null, multiOnly: false };

  el.classList.add('pareto');
  el.innerHTML = `
    <div class="pc-bar">
      <div class="pc-filters">${opts.filters.map((f, i) => `<button data-f="${f.id}" class="${i ? '' : 'on'}">${f.label}</button>`).join('')}
        ${opts.multiToggle ? '<label class="pc-multi"><input type="checkbox"> Both benchmarks only</label>' : ''}</div>
    </div>
    <div class="pc-plot"><svg viewBox="0 0 ${W} ${H}"></svg><div class="pc-tip"></div>
      <button class="pc-reset" title="Reset zoom">Reset zoom</button></div>
    <div class="pc-legend">${Object.entries(fam).map(([k, v]) => `<span><i style="background:${v.color}"></i>${v.label}</span>`).join('')}
      ${opts.noHollow ? '' : '<span><i class="hollow"></i>One benchmark only</span>'}<span class="pc-hint">Hover for details · scroll to zoom · drag to pan</span></div>`;
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
  svg.append('text').attr('class', 'pc-title').attr('transform', `translate(18,${m.t}) rotate(-90)`).attr('text-anchor', 'end').text(opts.yLabel);
  const plot = svg.append('g').attr('clip-path', `url(#${el.id}-clip)`);
  const front = plot.append('path').attr('class', 'pc-front');
  const dotsG = plot.append('g');
  const labG = plot.append('g');

  const visible = p => (!state.multiOnly || (p.n || 1) > 1) &&
    (state.filter === 'all' ? true : !!p.deploy[state.filter] || (state.filter === 'cloudself' && (p.deploy.cloud || p.deploy.self)));
  function frontier(list) {
    const s = list.slice().sort((a, b) => a.cost - b.cost || b.score - a.score);
    const f = []; let best = -Infinity;
    s.forEach(p => { if (p.score > best) { f.push(p); best = p.score; } });
    return f;
  }

  function draw(animate) {
    const vis = pts.filter(visible), f = frontier(vis), fid = new Set(f.map(p => p.id));
    gx.call(d3.axisBottom(x).ticks(8, d => '$' + d3.format(d >= 1 ? ',.0f' : '.2~f')(d)).tickSize(-(H - m.t - m.b)));
    gy.call(d3.axisLeft(y).ticks(6).tickSize(-(W - m.l - m.r)));
    // staircase frontier: hold score until a cheaper-to-better step
    const stepPts = [];
    f.forEach((p, i) => { if (i) stepPts.push([x(p.cost), y(f[i - 1].score)]); stepPts.push([x(p.cost), y(p.score)]); });
    if (f.length) stepPts.push([W - m.r + 150, y(f[f.length - 1].score)]);
    front.attr('d', stepPts.length ? d3.line()(stepPts) : null);
    if (animate) {
      const len = front.node().getTotalLength ? front.node().getTotalLength() : 0;
      front.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len)
        .transition().duration(1400).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0)
        .on('end', () => front.attr('stroke-dasharray', null));
    }

    const d = dotsG.selectAll('g.pc-dot').data(pts, p => p.id);
    const de = d.enter().append('g').attr('class', 'pc-dot');
    de.append('circle').attr('r', 0);
    de.on('mouseenter', (ev, p) => showTip(p)).on('mouseleave', hideTip);
    d.merge(de)
      .classed('off', p => !visible(p))
      .classed('front', p => fid.has(p.id))
      .attr('transform', p => `translate(${x(p.cost)},${y(p.score)})`)
      .select('circle')
      .attr('fill', p => (p.n || 1) > 1 || opts.noHollow ? fam[p.family].color : '#fff')
      .attr('stroke', p => fam[p.family].color)
      .transition().duration(animate ? 500 : 250).delay((p, i) => animate ? 300 + i * 25 : 0)
      .attr('r', p => fid.has(p.id) ? 8 : 6);

    // alternate labels above/below when neighbouring frontier points crowd each other
    const labelDy = new Map(); let prev = null;
    vis.filter(p => fid.has(p.id) || p.alwaysLabel).sort((a, b) => a.cost - b.cost).forEach(p => {
      const px = x(p.cost), py = y(p.score);
      const crowded = prev && px - prev.x < 150 && Math.abs(py - prev.y) < 26 && labelDy.get(prev.id) === -9;
      labelDy.set(p.id, crowded ? 20 : -9);
      prev = { id: p.id, x: px, y: py };
    });
    const lab = labG.selectAll('text').data(pts.filter(p => visible(p) && (fid.has(p.id) || p.alwaysLabel)), p => p.id);
    lab.exit().remove();
    lab.enter().append('text').attr('class', 'pc-lab').merge(lab)
      .classed('front', p => fid.has(p.id))
      .attr('x', p => x(p.cost) + (p.labelDx ?? 11)).attr('y', p => y(p.score) + (labelDy.get(p.id) ?? -9))
      .attr('text-anchor', p => p.labelAnchor || 'start')
      .text(p => p.name);
    if (opts.onDraw) opts.onDraw({ visible: vis, frontier: f });
  }

  function showTip(p) {
    const fmt = v => '$' + (v >= 10 ? d3.format(',.0f')(v) : d3.format('.2~f')(v));
    const dep = [p.deploy.cloud && `Cloud: ${p.deploy.cloud === true ? 'yes' : p.deploy.cloud}`, p.deploy.saas && 'Vendor API', p.deploy.self && 'Self-host'].filter(Boolean).join(' · ');
    tip.innerHTML = `<b>${p.name}</b><span class="pc-fam" style="color:${fam[p.family].color}">${fam[p.family].label}</span>
      <div class="pc-kv"><span>Score</span><span>${p.score.toFixed(1)}${p.n ? ` <em>(${p.n} benchmark${p.n > 1 ? 's' : ''})</em>` : ''}</span></div>
      <div class="pc-kv"><span>Cost / 1k pages</span><span>${fmt(p.cost)}</span></div>
      ${p.raw && p.raw.length ? `<div class="pc-raw">${p.raw.map(r => `<div><span>${r.bench}</span><span>${r.score}</span></div>`).join('')}</div>` : ''}
      ${p.costBasis ? `<div class="pc-basis">${p.costBasis}</div>` : ''}
      ${dep ? `<div class="pc-basis">${dep}</div>` : ''}`;
    const px = x(p.cost) / W * 100, py = y(p.score) / H * 100;
    tip.style.left = px > 60 ? '' : `calc(${px}% + 16px)`;
    tip.style.right = px > 60 ? `calc(${100 - px}% + 16px)` : '';
    tip.style.top = `${Math.min(py, 55)}%`;
    tip.classList.add('on');
  }
  function hideTip() { tip.classList.remove('on'); }

  const zoom = d3.zoom().scaleExtent([1, 20]).translateExtent([[m.l, m.t], [W - m.r, H - m.b]]).extent([[m.l, m.t], [W - m.r, H - m.b]])
    .on('zoom', ev => { x = ev.transform.rescaleX(x0); y = ev.transform.rescaleY(y0); draw(false); });
  svg.call(zoom).on('dblclick.zoom', null);
  el.querySelector('.pc-reset').addEventListener('click', () => svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity));
  el.querySelectorAll('.pc-filters button').forEach(b => b.addEventListener('click', () => {
    el.querySelectorAll('.pc-filters button').forEach(c => c.classList.toggle('on', c === b));
    state.filter = b.dataset.f; draw(false);
  }));

  const mt = el.querySelector('.pc-multi input');
  if (mt) mt.addEventListener('change', () => { state.multiOnly = mt.checked; draw(false); });
  const off = pts.filter(p => p.score < yExt[0]);
  if (off.length) el.insertAdjacentHTML('beforeend', `<div class="pc-off">Below the chart: ${off.map(p => `${p.name} (${p.score.toFixed(0)})`).join(', ')}</div>`);
  draw(false);
  return { replay: () => draw(true), setFilter: f => el.querySelector(`[data-f="${f}"]`)?.click() };
};
