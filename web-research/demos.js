// Interactive demo slides for the web search and research session.
function safe(name, fn) { try { fn(); } catch (e) { console.error('Could not start ' + name, e); } }
const on = (id, fn) => { const s = document.getElementById(id); if (s) { s.addEventListener('slide:step', e => fn(s, e.detail.step)); s.addEventListener('slide:enter', e => fn(s, e.detail.step, true)); } };
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Radio-style button group: [[value, label]], calls pick(value).
function radios(host, items, value, pick) {
  host.insertAdjacentHTML('beforeend', items.map(([v, l]) => `<button type="button" role="radio" data-v="${v}">${l}</button>`).join(''));
  const set = v => host.querySelectorAll('button').forEach(b => { const on = b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
  host.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; set(b.dataset.v); pick(b.dataset.v); });
  set(value);
  return set;
}

/* ---------- title: research trace ---------- */
safe('title trace', function () {
  const card = document.getElementById('title-trace'); if (!card) return;
  const L = [
    ['think', 'Plan: national total first, then the company figure'],
    ['search', '"heat pump installations 2026 official statistics"'],
    ['open', 'National statistics release, table 2.1'],
    ['check', 'Table covers England only. Changing the plan'],
    ['search', '"Scotland heat pump installations 2026"'],
    ['search', '"Wales heat pump installations 2026"'],
    ['open', 'Two devolved government datasets'],
    ['search', '"Northwind Energy installations annual report"'],
    ['open', 'Annual report, page 14'],
    ['check', 'Company reports the UK and Ireland together'],
    ['open', 'Investor presentation, slide 9'],
    ['answer', 'Share estimated, 5 sources cited, 1 assumption flagged'],
  ];
  const counts = { s: document.getElementById('tm-s'), p: document.getElementById('tm-p'), c: document.getElementById('tm-c') };
  let timers = [];
  function play() {
    timers.forEach(clearTimeout); timers = [];
    card.querySelectorAll('.tl').forEach(e => e.remove());
    let s = 0, p = 0, c = 0;
    Object.values(counts).forEach(e => (e.textContent = 0));
    L.forEach(([k, t], i) => timers.push(setTimeout(() => {
      card.insertAdjacentHTML('beforeend', `<div class="tl ${k === 'answer' ? 'answer' : ''}"><span class="k ${k}">${k}</span><span>${esc(t)}</span></div>`);
      const el = card.lastElementChild; void el.offsetWidth; el.classList.add('in');
      if (k === 'search') s++; if (k === 'open') p += /Two/.test(t) ? 2 : 1; if (k === 'check') c++;
      counts.s.textContent = s; counts.p.textContent = p; counts.c.textContent = c;
    }, reduced ? 0 : 600 + i * 650)));
  }
  document.getElementById('title').addEventListener('slide:enter', play);
  play();
});

/* ---------- search engine: inverted index, BM25 and meaning-based ranking ---------- */
safe('search engine demo', function () {
  const s = document.getElementById('search-engine'); if (!s) return;
  // topic dims: grants, heat pumps, boilers, cost, news, how-it-works, local trade, home warmth
  const D = [
    ['D1', 'Boiler Upgrade Scheme: apply for a heat pump grant', 'The Boiler Upgrade Scheme gives a grant towards replacing a gas boiler with a heat pump. Check if your home is eligible and how to apply for the scheme.', [1, .9, .5, .5, 0, 0, 0, .3]],
    ['D2', 'Cheapest ways to heat your home this winter', 'Compare the cheapest ways to heat your home: thermostats, insulation, gas boilers and heat pumps. Small changes cut bills.', [.1, .4, .4, 1, 0, .2, 0, .9]],
    ['D3', 'Heat pump installations rise in the North of England', 'Installers report more heat pump installations this year, helped by government grants and falling equipment prices.', [.4, 1, 0, .2, 1, 0, .2, 0]],
    ['D4', 'How an air source heat pump works', 'An air source heat pump moves heat from outside air into your home, like a fridge in reverse. It works best in an insulated home.', [0, 1, 0, .1, 0, 1, 0, .4]],
    ['D5', 'Boiler repair and servicing in Leeds', 'Gas boiler repair, boiler servicing and emergency callouts across Leeds. Book a boiler engineer today.', [0, 0, 1, .2, 0, 0, 1, .1]],
    ['D6', 'Grants and loans to make your home warmer', 'Find funding to make your house warmer and cheaper to run: insulation grants, energy efficiency loans and help with bills.', [1, .3, .1, .7, 0, 0, 0, 1]],
  ];
  const Q = [
    ['boiler upgrade scheme', 'Exact name', [.8, .6, .7, .2, 0, 0, 0, .1]],
    ['money off a heat pump', 'Paraphrase', [.9, 1, 0, .6, 0, 0, 0, .1]],
    ['cheapest way to keep my house warm', 'Paraphrase', [.3, .2, .2, 1, 0, 0, 0, 1]],
  ];
  const STOP = new Set('a an the to of for and your my is it in this how way off with from like into its best ways check if apply'.split(' '));
  const tok = t => t.toLowerCase().match(/[a-z0-9]+/g).filter(w => !STOP.has(w));
  const docs = D.map(([id, title, body, vec]) => ({ id, title, terms: tok(title + ' ' + body), vec }));
  const N = docs.length, avg = docs.reduce((a, d) => a + d.terms.length, 0) / N;
  function bm25(q) {
    const qt = [...new Set(tok(q))], k1 = 1.2, b = 0.75;
    return docs.map(d => {
      let sc = 0;
      qt.forEach(t => {
        const n = docs.filter(x => x.terms.includes(t)).length; if (!n) return;
        const f = d.terms.filter(x => x === t).length;
        sc += Math.log(1 + (N - n + .5) / (n + .5)) * f * (k1 + 1) / (f + k1 * (1 - b + b * d.terms.length / avg));
      });
      return { d, sc };
    }).sort((a, c) => c.sc - a.sc);
  }
  const cos = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0) / Math.hypot(...a) / Math.hypot(...b);
  const dense = v => docs.map(d => ({ d, sc: cos(v, d.vec) })).sort((a, c) => c.sc - a.sc);
  document.getElementById('se-docs').innerHTML = D.map(([id, t]) => `<div><span>${id}</span>${t}</div>`).join('');
  const list = (rows, max, fmt) => rows.map((r, i) => `<div class="r ${r.sc <= 0 ? 'zero' : ''}"><span class="n">${i + 1}</span><span>${r.d.title}</span><span class="s">${r.sc > 0 ? fmt(r.sc) : 'no match'}</span>${r.sc > 0 ? `<span class="bar" style="width:${r.sc / max * 100}%"></span>` : ''}</div>`).join('');
  function run(qi) {
    const [q, , v] = Q[qi];
    const qt = [...new Set(tok(q))];
    document.getElementById('se-post').innerHTML = qt.map(t => {
      const hits = docs.filter(d => d.terms.includes(t));
      return `<div class="${hits.length ? '' : 'miss'}"><b>${t}</b> → ${hits.length ? hits.map(d => `${d.id}<sup>×${d.terms.filter(x => x === t).length}</sup>`).join(', ') : 'no pages'}</div>`;
    }).join('');
    const b = bm25(q), dn = dense(v);
    document.getElementById('se-bm25').innerHTML = list(b, b[0].sc || 1, x => x.toFixed(2));
    document.getElementById('se-dense').innerHTML = list(dn, dn[0].sc, x => x.toFixed(2));
  }
  radios(document.getElementById('se-q'), Q.map((q, i) => [String(i), `"${q[0]}"`]), '0', v => run(+v));
  run(0);
});

/* ---------- page anatomy: source, DOM, accessibility tree, markdown, marks ---------- */
safe('page anatomy demo', function () {
  const s = document.getElementById('anatomy'); if (!s) return;
  const page = document.getElementById('anat-page'), browser = document.getElementById('anat-browser');
  // each line: [region or '', text, boilerplate?]
  const V = {
    source: ['HTML source', 'Source', [
      ['', '<!doctype html><html lang="en"><head>', 1], ['', '<meta charset="utf-8"><meta name="viewport" content="width=device-width">', 1],
      ['', '<link rel="stylesheet" href="/_next/static/css/4e1a2c.css">', 1], ['', '<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"></script>', 1],
      ['', '<script src="/_next/static/chunks/main-7f3b9e.js" defer></script>', 1], ['', '<script type="application/ld+json">{"@type":"NewsArticle","headline":"Northwind Energy reports third-quarter results","datePublished":"2026-10-21"}</script>', 0],
      ['', '</head><body class="theme--light page-news">', 1],
      ['nav', '<header class="site-header css-1q2w3e"><a class="logo" href="/">Northwind Energy</a>', 1], ['nav', '<nav aria-label="Main"><ul class="nav__list"><li class="nav__item"><a href="/products">Products</a></li><li class="nav__item"><a href="/investors">Investors</a></li><li class="nav__item"><a href="/careers">Careers</a></li></ul></nav>', 1],
      ['nav', '<form role="search" action="/search"><input type="search" name="q" placeholder="Search…" aria-label="Search"></form></header>', 1],
      ['article', '<main id="content"><article class="article css-8u7y6t">', 0], ['h1', '<h1 class="article__title">Northwind Energy reports third-quarter results</h1>', 0],
      ['article', '<p class="byline"><time datetime="2026-10-21">21 October 2026</time> · Investor news</p>', 0],
      ['p1', '<p>Revenue rose 8% to £412m in the three months to September, driven by heat pump installations in the North of England.</p>', 0],
      ['table', '<table class="tbl"><thead><tr><th>Segment</th><th>Q3 2026</th><th>Q3 2025</th></tr></thead><tbody><tr><td>Retail supply</td><td>£251m</td><td>£238m</td></tr><tr><td>Heat pumps</td><td>£97m</td><td>£74m</td></tr><tr><td>Services</td><td>£64m</td><td>£69m</td></tr></tbody></table>', 0],
      ['p2', '<p>The company kept its full-year guidance and will report again on 20 January 2027.</p></article>', 0],
      ['side', '<aside class="related"><h2 class="visually-hidden">Related</h2><a href="/investors/h1-2026">Half-year results</a><a href="/investors/ar-2025">Annual report 2025</a><a href="/alerts">Sign up for alerts</a><div class="ad-slot" data-ad-unit="/1234/news_mpu"><iframe src="https://ads.example.net/…" title="Advertisement"></iframe></div></aside></main>', 1],
      ['foot', '<footer class="site-footer"><span>© 2026 Northwind Energy plc</span><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/accessibility">Accessibility</a></footer>', 1],
      ['cookie', '<div id="consent-banner" role="dialog" aria-label="Cookie consent"><p>We use cookies to improve your experience.</p><button>Reject</button><button class="primary">Accept all</button></div>', 1],
      ['', '<script>window.__NEXT_DATA__={"props":{"pageProps":{"article":{"id":88231,"slug":"q3-2026-results","tags":["results","investors"],"related":[…]}}},"buildId":"a8Xk2"}</script>', 1],
      ['', '<script>(function(w,d){w.dataLayer=w.dataLayer||[];w.dataLayer.push({event:"page_view",section:"news"})})(window,document);</script>', 1],
      ['', '</body></html>', 1],
    ]],
    dom: ['DOM tree', 'DOM', [
      ['', 'html', 1], ['', '├─ head  (meta ×2, link, script ×3)', 1], ['', '└─ body.theme--light', 1],
      ['nav', '   ├─ header.site-header', 1], ['nav', '   │  ├─ a.logo  "Northwind Energy"', 1], ['nav', '   │  ├─ nav > ul > li ×3 > a', 1], ['nav', '   │  └─ form > input[type=search]', 1],
      ['article', '   ├─ main#content', 0], ['article', '   │  ├─ article', 0], ['h1', '   │  │  ├─ h1  "Northwind Energy reports third-quarter…"', 0], ['article', '   │  │  ├─ p.byline > time', 0],
      ['p1', '   │  │  ├─ p  "Revenue rose 8% to £412m…"', 0], ['table', '   │  │  ├─ table > thead, tbody > tr ×3 > td ×3', 0], ['p2', '   │  │  └─ p  "The company kept its full-year…"', 0],
      ['side', '   │  └─ aside.related > h2, a ×3, div.ad-slot > iframe', 1], ['foot', '   ├─ footer > span, a ×3', 1], ['cookie', '   ├─ div#consent-banner [role=dialog] > p, button ×2', 1], ['', '   └─ script ×2', 1],
    ]],
    a11y: ['Accessibility tree', 'Accessibility', [
      ['nav', '- banner:', 1], ['nav', '  - link "Northwind Energy" [ref=e1]', 1], ['nav', '  - navigation "Main":', 1], ['nav', '    - link "Products" [ref=e2]', 1], ['nav', '    - link "Investors" [ref=e3]', 1], ['nav', '    - link "Careers" [ref=e4]', 1], ['nav', '  - searchbox "Search" [ref=e5]', 1],
      ['article', '- main:', 0], ['article', '  - article:', 0], ['h1', '    - heading "Northwind Energy reports third-quarter results" [level=1]', 0], ['article', '    - paragraph: 21 October 2026 · Investor news', 0],
      ['p1', '    - paragraph: Revenue rose 8% to £412m in the three months…', 0], ['table', '    - table:', 0], ['table', '      - row "Segment Q3 2026 Q3 2025"', 0], ['table', '      - row "Retail supply £251m £238m"', 0], ['table', '      - row "Heat pumps £97m £74m"', 0], ['table', '      - row "Services £64m £69m"', 0],
      ['p2', '    - paragraph: The company kept its full-year guidance…', 0], ['side', '  - complementary:', 1], ['side', '    - link "Half-year results" [ref=e6] … (3 links, 1 frame)', 1],
      ['foot', '- contentinfo: © 2026 Northwind Energy plc … (3 links)', 1], ['cookie', '- dialog "Cookie consent":', 1], ['cookie', '  - button "Reject" [ref=e12]', 1], ['cookie', '  - button "Accept all" [ref=e13]', 1],
    ]],
    md: ['Clean markdown', 'Markdown', [
      ['h1', '# Northwind Energy reports third-quarter results', 0], ['', '', 0], ['article', '21 October 2026 · Investor news', 0], ['', '', 0],
      ['p1', 'Revenue rose 8% to £412m in the three months to September, driven by heat pump installations in the North of England.', 0], ['', '', 0],
      ['table', '| Segment | Q3 2026 | Q3 2025 |', 0], ['table', '|---|---|---|', 0], ['table', '| Retail supply | £251m | £238m |', 0], ['table', '| Heat pumps | £97m | £74m |', 0], ['table', '| Services | £64m | £69m |', 0], ['', '', 0],
      ['p2', 'The company kept its full-year guidance and will report again on 20 January 2027.', 0], ['', '', 0],
      ['', '<!-- navigation, related links, advert, footer, cookie banner and scripts removed -->', 1],
    ]],
    marks: ['Screenshot with marks', 'Screenshot', [
      ['', 'The model receives the screenshot as an image,', 1], ['', 'with a number drawn on every element it can use:', 1], ['', '', 1],
      ['nav', '[1] link "Northwind Energy"     [2] link "Products"', 0], ['nav', '[3] link "Investors"            [4] link "Careers"', 0], ['nav', '[5] searchbox "Search"', 0],
      ['side', '[6] link "Half-year results"   [7] link "Annual report 2025"', 0], ['side', '[8] link "Sign up for alerts"', 0], ['cookie', '[9] button "Reject"            [10] button "Accept all"', 0], ['', '', 1],
      ['', 'It replies with an action:', 1], ['cookie', '→ click(9)            # dismiss the cookie banner first', 0], ['', '→ scroll(down)        # or click(x=412, y=388) without marks', 1],
    ]],
  };
  const order = ['source', 'dom', 'a11y', 'md', 'marks'];
  const view = document.getElementById('anat-view');
  view.innerHTML = order.map(k => `<div class="code" data-v="${k}">${V[k][2].map(([r, t, boil]) => `<span class="ln2 ${boil ? 'boil' : ''}" data-r="${r}">${esc(t) || '&nbsp;'}</span>`).join('')}</div>`).join('');
  // approximate tokens as characters / 4 for text; image tokens at one per 28 x 28 pixels
  const toks = order.map(k => k === 'marks' ? Math.round(1280 * 800 / 784) : Math.round(V[k][2].map(l => l[1]).join('\n').length / 4));
  const max = Math.max(...toks);
  const tb = document.getElementById('anat-tok');
  tb.innerHTML = order.map((k, i) => `<div class="tb" data-v="${k}"><span>${V[k][0]}</span><i style="width:${toks[i] / max * 100}%"></i><b>${toks[i].toLocaleString()}</b></div>`).join('') +
    `<p class="src" style="margin-top:6px">Approximate tokens for this small page (characters ÷ 4; screenshot at one token per 28 × 28 pixels). Grey lines are not the article. On real pages raw HTML is 3–40 times the tokens of clean markdown (research pack A).</p>`;
  // set-of-marks boxes over interactive elements
  const marks = [['.w-nav .logo', 1], ['.w-nav span:nth-child(2)', 2], ['.w-nav span:nth-child(3)', 3], ['.w-nav span:nth-child(4)', 4], ['.w-nav .sb', 5], ['.w-side a:nth-of-type(1)', 6], ['.w-side a:nth-of-type(2)', 7], ['.w-side a:nth-of-type(3)', 8], ['.w-cookie b:not(.p)', 9], ['.w-cookie b.p', 10]];
  let placed = false;
  function placeMarks() {
    if (placed) return; placed = true;
    const pr = page.getBoundingClientRect(), sc = pr.width / page.offsetWidth;
    marks.forEach(([sel, n]) => {
      const el = page.querySelector(sel); if (!el) return;
      const r = el.getBoundingClientRect();
      page.insertAdjacentHTML('beforeend', `<div class="som" style="left:${(r.left - pr.left) / sc - 3}px;top:${(r.top - pr.top) / sc - 3}px;width:${r.width / sc + 6}px;height:${r.height / sc + 6}px"><i>${n}</i></div>`);
    });
  }
  const tabs = document.getElementById('anat-tabs');
  const show = k => {
    view.querySelectorAll('.code').forEach(c => c.classList.toggle('cur', c.dataset.v === k));
    tb.querySelectorAll('.tb').forEach(c => c.classList.toggle('cur', c.dataset.v === k));
    tabs.querySelectorAll('.bt').forEach(b => { const on = b.dataset.v === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    if (k === 'marks') placeMarks();
    browser.classList.toggle('marks', k === 'marks');
  };
  tabs.innerHTML = order.map(k => `<button type="button" class="bt" data-v="${k}">${V[k][1]}</button>`).join('');
  tabs.addEventListener('click', e => { const b = e.target.closest('.bt'); if (b) show(b.dataset.v); });
  view.addEventListener('mouseover', e => {
    const l = e.target.closest('.ln2'); const r = l && l.dataset.r;
    page.querySelectorAll('[data-r]').forEach(el => el.classList.toggle('hl', !!r && el.dataset.r === r));
  });
  view.addEventListener('mouseleave', () => page.querySelectorAll('.hl').forEach(el => el.classList.remove('hl')));
  [1, 2, 3, 4].forEach(n => s.insertAdjacentHTML('beforeend', `<i data-step="${n}"></i>`));
  on('anatomy', (sl, st) => show(order[Math.min(st, 4)]));
  show('source');
});

/* ---------- bot controls: layered checks ---------- */
safe('bot controls demo', function () {
  const s = document.getElementById('bots'); if (!s) return;
  const LAYERS = [
    ['robots.txt', 'A text file asking bots to stay out of some paths. Voluntary: nothing enforces it.'],
    ['Declared identity', 'The user agent string, checked against published addresses or a cryptographic signature.'],
    ['Network', 'The reputation of the IP address, and whether it belongs to a data centre or a home connection.'],
    ['Connection fingerprint', 'How the encrypted connection is set up (TLS and HTTP/2 details). Scripts rarely connect exactly like the browser they claim to be.'],
    ['Browser challenge', 'JavaScript that checks for a real browser. Turnstile replaces picture puzzles for most visitors.'],
    ['Behaviour and models', 'Request patterns, input timing and models trained on traffic across many sites give a bot score from 1 (bot) to 99 (person).'],
  ];
  const P = 'pass', F = 'flag', C = 'caught', K = 'skip';
  const skip = t => [K, t];
  const V = {
    person: { label: 'Person in Chrome', run: () => ({ l: [skip('Not used. People do not read robots.txt.'), [P, 'An ordinary Chrome user agent.'], [P, 'Home broadband address with a clean history.'], [P, 'Matches real Chrome.'], [P, 'Passes in the background. No puzzle shown.'], [P, 'Human patterns. High score.']], o: ['Served', 'ok', 'The page loads normally.'] }) },
    google: { label: 'Googlebot', run: () => ({ l: [[P, 'Reads robots.txt and follows it.'], [P, 'Says it is Googlebot. Verified against Google\'s published addresses.'], skip('Skipped for verified bots.'), skip('Skipped.'), skip('Skipped.'), skip('Skipped.')], o: ['Served', 'ok', 'Indexed for Google Search.'] }), note: 'Googlebot crawls for Search and for Google\'s AI features. Since September 2026, Google, Microsoft and Apple have agreed through Cloudflare to honour a training opt-out without affecting search ranking.' },
    ai: { label: 'Declared AI crawler', run: pol => {
      const base = [[P, 'Reads robots.txt. If a path is disallowed, the crawler chooses to stop.']];
      if (pol === 'allow') return { l: [...base, [P, 'Says it is GPTBot or ClaudeBot. Verified as that company\'s crawler.'], skip('Skipped for verified bots.'), skip('Skipped.'), skip('Skipped.'), skip('Skipped.')], o: ['Served', 'ok', 'The site has chosen to allow AI crawlers.'] };
      if (pol === 'block') return { l: [...base, [C, 'Verified as an AI crawler. The site blocks this category.'], skip(''), skip(''), skip(''), skip('')], o: ['Blocked', 'no', 'HTTP 403. The crawler receives nothing.'] };
      return { l: [...base, [F, 'Verified as an AI crawler. The site charges this category.'], skip(''), skip(''), skip(''), skip('')], o: ['Payment required', 'pay', 'HTTP 402 with a price per request. A crawler with a payment account can pay and retry.'] };
    } },
    script: { label: 'Python script', run: () => ({ l: [skip('Up to whoever wrote it.'), [F, 'Says "python-requests", or pretends to be Chrome.'], [F, 'Cloud data centre address.'], [C, 'Its encrypted connection does not match the browser it claims to be.'], skip('Cannot run JavaScript.'), skip('')], o: ['Blocked or challenged', 'no', 'A challenge it cannot solve, or a block.'] }) },
    headless: { label: 'Headless browser in a data centre', run: () => ({ l: [skip('Up to the operator.'), [F, 'Pretends to be Chrome.'], [F, 'Data centre address.'], [P, 'A real browser, so the connection looks right.'], [F, 'Automation leaves traces that the checks look for.'], [C, 'No human-like input. Low score.']], o: ['Challenged', 'mid', 'Shown a Turnstile challenge, or blocked.'] }), note: 'Tools exist to hide the traces of automation, and detection vendors keep updating their checks. Reliability changes month by month.' },
    stealth: { label: 'Disguised crawler', run: () => ({ l: [[F, 'Ignores robots.txt.'], [F, 'Pretends to be an ordinary browser on a laptop.'], [P, 'Rotates through home broadband addresses, so each one looks clean.'], [P, 'A real browser.'], [P, 'Can pass.'], [C, 'Patterns across many sites give it away. Once fingerprinted, it is blocked everywhere.']], o: ['Blocked once identified', 'no', 'Detection works across all sites behind the same provider.'] }), note: 'In August 2025 Cloudflare said Perplexity used undeclared crawlers like this to get around blocks. Perplexity disputed the claim.' },
    signed: { label: 'Signed agent (cloud)', run: () => ({ l: [skip('Fetches pages for a user, not for an index.'), [P, 'Signs each request cryptographically (Web Bot Auth), so the site can verify the operator.'], skip('Skipped once verified.'), skip('Skipped.'), skip('Skipped.'), skip('Skipped.')], o: ['Served, unless blocked', 'ok', 'Sites set rules for agents separately from crawlers.'] }), note: 'ChatGPT agent, Browserbase and AWS AgentCore Browser sign their requests. A signature proves who is asking, not that the site must agree: the site still chooses to allow, charge or block.' },
    browser: { label: 'Agent in the user\'s browser', run: () => ({ l: [skip('Not used. It acts for a person, as the person\'s browser would.'), [P, 'The user\'s real browser.'], [P, 'The user\'s own connection.'], [P, 'A real browser.'], [F, 'If a puzzle appears, the agent stops and asks the user to solve it.'], [P, 'Mostly human-like.']], o: ['Served, as the user', 'ok', 'Logins, subscriptions and cookies all work.'] }), note: 'This is why research tools are moving into the browser. Since July 2026 Cloudflare sites can set separate rules for agents. The risk: the agent holds the user\'s logged-in sessions, so instructions hidden in a page (prompt injection) can misuse them.' },
  };
  const who = document.getElementById('bots-who'), pol = document.getElementById('bots-pol'), lay = document.getElementById('bots-layers'), note = document.getElementById('bots-note');
  lay.innerHTML = LAYERS.map(([t, d], i) => `<div class="layer"><span class="ln">LAYER ${i + 1}</span><b>${t}</b><p>${d}</p><div class="st"></div></div>`).join('') + '<div class="layer outc"><span class="ln">RESULT</span><div class="res"></div><p class="ot"></p></div>';
  let cur = 'person', policy = 'block';
  const VW = { pass: 'Passes', flag: 'Suspicious', caught: 'Caught here', skip: 'Not applied' };
  function run() {
    const r = V[cur].run(policy), cards = lay.querySelectorAll('.layer:not(.outc)');
    const stop = r.l.findIndex(x => x[0] === C);
    cards.forEach((c, i) => {
      const [st, t] = r.l[i];
      c.className = 'layer ' + st + (stop >= 0 && i > stop ? ' after' : '');
      c.querySelector('.st').innerHTML = (stop >= 0 && i > stop) ? '' : `<span class="v">${VW[st]}</span>${t}`;
    });
    const o = lay.querySelector('.outc');
    o.querySelector('.res').className = 'res ' + r.o[1]; o.querySelector('.res').textContent = r.o[0];
    o.querySelector('.ot').textContent = r.o[2];
    note.textContent = V[cur].note || '';
    pol.style.opacity = cur === 'ai' ? 1 : .4;
  }
  radios(who, Object.entries(V).map(([k, v]) => [k, v.label]), cur, v => { cur = v; run(); });
  radios(pol, [['allow', 'Allow'], ['block', 'Block'], ['charge', 'Charge per crawl']], policy, v => { policy = v; run(); });
  run();
});

/* ---------- research loop trace ---------- */
safe('research loop', function () {
  const s = document.getElementById('loop'); if (!s) return;
  const T = [
    [0, 'think', 'Plan: find the national total, then the company\'s figure, then divide.'],
    [1, 'search', '"heat pump installations 2026 official statistics"'],
    [2, 'open', 'National statistics release, table 2.1'],
    [3, 'check', 'Table 2.1 covers England only. Change the plan: add Scotland, Wales and Northern Ireland.'],
    [1, 'search', '"Scotland heat pump installations 2026" · "Wales …" · "Northern Ireland …"'],
    [2, 'open', 'Three devolved government datasets'],
    [1, 'search', '"Northwind Energy heat pump installations 2026"'],
    [2, 'open', 'Northwind annual report, page 14'],
    [3, 'check', 'The company reports the UK and Ireland together. Find the Ireland figure.'],
    [2, 'open', 'Investor presentation, slide 9: share of installations by country'],
    [4, 'answer', 'Estimate with five cited sources. Assumption flagged: the Ireland share is from a presentation, not audited accounts.'],
  ];
  const box = document.getElementById('ltrace');
  box.innerHTML = '<div class="tl"><span class="k think">task</span><span style="color:#fff">What share of UK heat pump installations did Northwind Energy carry out in 2026? (Fictional example.)</span></div>' +
    T.map(([n, k, t], i) => `<div class="tl" data-step="${i + 1}" data-n="${n}"><span class="k ${k}">${k === 'think' ? 'plan' : k === 'check' ? 'reflect' : k === 'answer' ? 'write' : k}</span><span>${esc(t)}</span></div>`).join('');
  const nodes = [...s.querySelectorAll('.nd')];
  on('loop', (sl, st) => {
    const n = st ? T[st - 1][0] : 0;
    nodes.forEach(g => g.classList.toggle('on', +g.dataset.n === n));
  });
});

/* ---------- one agent in sequence vs many in parallel ---------- */
safe('parallel demo', function () {
  const s = document.getElementById('parallel'); if (!s) return;
  // blocks: [start minute, duration, lane 0-4, kind]; markers: [minute, label]
  const seq = (from, n, dur, lane = 0, kind = '') => Array.from({ length: n }, (_, i) => [from + i * dur, dur * .85, lane, kind]);
  const TASKS = {
    chain: {
      label: 'Steps that depend on each other',
      text: 'Estimate Northwind\'s share of UK heat pump installations. Each step depends on the last: the national figure turns out to cover England only, and the company reports the UK and Ireland together.',
      notes: '<p>On a task with dependent steps, a single agent that reads, reflects and changes its plan gets the right answer. A plan fixed at the start runs fast but combines two figures with different definitions. A lead agent with subagents recovers, but only when it combines the results, so it needs a second round.</p>',
      rows: [
        { b: [[0, 1, 0, 'lead'], [1, 1.8, 0], [3, 1.8, 0], [5.2, 1.8, 0], [7.2, 1.8, 0], [9.4, 1.8, 0], [11.4, 1.8, 0], [13.6, 1.8, 0], [15.6, 1.8, 0], [17.6, 1.6, 0, 'lead']], m: [[5, 'plan changed'], [13.4, 'definition differs']], r: ['Correct', 'ok', '19 minutes · 7 searches · adapted twice'] },
        { b: [[0, 1.5, 0, 'lead'], [1.5, 3.5, 0, 'waste'], [1.5, 3.5, 1], [1.5, 3.5, 2, 'waste'], [1.5, 3.5, 3], [1.5, 3.5, 4], [5.2, 1.6, 0, 'lead']], m: [], r: ['Wrong, but fast', 'no', '7 minutes · plan fixed at the start · combined an England-only total with a UK-and-Ireland count'] },
        { b: [[0, 1.5, 0, 'lead'], [1.5, 4.5, 1, 'waste'], [1.5, 4.5, 2], [1.5, 4.5, 3, 'waste'], [1.5, 4.5, 4], [6.2, 1.5, 0, 'lead'], [7.9, 4, 1, 'fix'], [7.9, 4, 3, 'fix'], [12.1, 1.6, 0, 'lead']], m: [[7.8, 'lead finds mismatch']], r: ['Correct after a second round', 'mid', '14 minutes · most tokens · error found only when results were combined'] },
      ],
    },
    breadth: {
      label: 'Independent items',
      text: 'Find the chief executive and head office city of 40 listed utilities. Each item can be researched without knowing anything about the others.',
      notes: '<p>On a breadth task the items do not depend on each other, so parallel search is faster and each worker keeps a short, clean context. A single agent works through the list one by one, takes far longer, and its context fills up with earlier pages.</p>',
      rows: [
        { b: [[0, .8, 0, 'lead'], ...seq(1, 40, .7)], m: [[20, 'context filling up']], r: ['Slow; later items less reliable', 'mid', '29 minutes · 40 searches in sequence'] },
        { b: [[0, 1, 0, 'lead'], ...[0, 1, 2, 3, 4].flatMap(l => seq(1.2, 8, .55, l)), [5.8, 1.2, 0, 'lead']], m: [], r: ['Fast and complete', 'ok', '7 minutes · 40 searches, 5 at a time'] },
        { b: [[0, 1, 0, 'lead'], ...[1, 2, 3, 4].flatMap(l => seq(1.2, 10, .5, l)), [6.4, 1.2, 0, 'lead']], m: [], r: ['Fast and complete', 'ok', '8 minutes · more tokens · each subagent has a short context'] },
      ],
    },
  };
  const DESIGNS = [['One agent, step by step', 'Reads, reflects and changes course'], ['Plan first, then search in parallel', 'A fixed plan runs as simultaneous searches'], ['Lead agent with subagents', 'Subagents work in parallel and report back']];
  const rowsEl = document.getElementById('par-rows'), taskEl = document.getElementById('par-task'), notesEl = document.getElementById('par-notes');
  const X = 30, LH = 18; // minutes across the lane; lane height in px
  let timers = [], cur = 'chain';
  function draw() {
    timers.forEach(clearTimeout); timers = [];
    const t = TASKS[cur];
    taskEl.textContent = t.text; notesEl.innerHTML = t.notes;
    rowsEl.innerHTML = t.rows.map((r, i) => `<div class="par-row"><h4>${DESIGNS[i][0]}<small>${DESIGNS[i][1]}</small></h4><div class="lane">${r.b.map(([a, d, l, k]) => `<i class="blk ${k || ''}" data-a="${a}" style="left:${a / X * 100}%;width:${d / X * 100}%;top:${l * LH + 2}px"></i>`).join('')}${r.m.map(([a, lab]) => `<span class="mk" data-a="${a}" style="left:${a / X * 100}%"><span>${lab}</span></span>`).join('')}</div><div class="par-out" style="opacity:0"><span class="res ${r.r[1]}">${r.r[0]}</span>${r.r[2]}</div></div>`).join('');
    rowsEl.insertAdjacentHTML('beforeend', `<div class="par-axis"><i></i><div>${[0, 5, 10, 15, 20, 25, 30].map(m => `<span style="left:${m / X * 100}%">${m}${m === 30 ? ' min' : ''}</span>`).join('')}</div><i></i></div>`);
    const all = [...rowsEl.querySelectorAll('.blk, .mk')];
    all.forEach(el => timers.push(setTimeout(() => el.classList.add('on'), reduced ? 0 : 200 + +el.dataset.a * 110)));
    rowsEl.querySelectorAll('.par-out').forEach(el => timers.push(setTimeout(() => (el.style.opacity = 1), reduced ? 0 : 200 + 31 * 110)));
  }
  radios(document.getElementById('par-tabs'), Object.entries(TASKS).map(([k, v]) => [k, v.label]), cur, v => { cur = v; draw(); });
  s.addEventListener('slide:enter', draw);
  draw();
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

/* ---------- crawl-to-referral ratios (log-scaled bars) ---------- */
safe('crawl ratio chart', function () {
  const el = document.getElementById('ratio-chart'); if (!el) return;
  const R = [['Anthropic', 38066], ['OpenAI', 1091], ['Perplexity', 195], ['Microsoft', 40.7], ['Yandex', 21.4], ['Google', 5.4], ['ByteDance', 0.9]];
  const lmax = Math.log10(100000), lmin = Math.log10(0.5);
  el.innerHTML = R.map(([n, v]) => `<div class="rr ${v > 1000 ? 'hi' : ''}"><span>${n}</span><i data-w="${(Math.log10(v) - lmin) / (lmax - lmin) * 100}" style="width:0"></i><b>${v.toLocaleString()} : 1</b></div>`).join('') +
    '<p class="src" style="margin-top:4px">Bar length on a log scale.</p>';
  const grow = () => el.querySelectorAll('i').forEach(i => (i.style.width = i.dataset.w + '%'));
  const s = el.closest('.slide');
  s.addEventListener('slide:enter', () => { el.querySelectorAll('i').forEach(i => (i.style.width = 0)); setTimeout(grow, 300); });
  grow();
});

/* ---------- BrowseComp scores over time ---------- */
safe('browsecomp chart', function () {
  const el = document.getElementById('bc-chart'); if (!el) return;
  if (!window.d3) { el.innerHTML = '<div class="viz-missing">This chart needs the D3 library, which did not load. The scores are listed in research pack D.</div>'; return; }
  el.classList.add('bc');
  // date, system, score, open weights?, several attempts in parallel?, label offset [dx, dy], label anchor
  const P = [
    ['2025-04-10', 'GPT-4o with browsing', 1.9, 0, 0, [8, -6]],
    ['2025-04-10', 'OpenAI deep research', 51.5, 0, 0, [8, 14]],
    ['2025-07-17', 'ChatGPT agent', 68.9, 0, 0, [-8, -8], 'end'],
    ['2025-09-16', 'Tongyi DeepResearch 30B', 43.4, 1, 0, [8, 14]],
    ['2025-11-06', 'Kimi K2 Thinking', 60.2, 1, 0, [8, 14]],
    ['2025-12-11', 'GPT-5.2 Pro', 77.9, 0, 1, [-8, 4], 'end'],
    ['2026-01-27', 'Kimi K2.5 Agent Swarm', 78.4, 1, 1, [8, 16]],
    ['2026-02-05', 'Claude Opus 4.6', 83.7, 0, 0, [8, 16]],
    ['2026-02-05', 'Claude Opus 4.6, multi-agent', 86.6, 0, 1, [-8, -8], 'end'],
    ['2026-02-19', 'Gemini 3.1 Pro', 85.9, 0, 0],
    ['2026-03-05', 'GPT-5.4 Pro', 89.3, 0, 1],
    ['2026-04-23', 'GPT-5.5 Pro', 90.1, 0, 1],
    ['2026-06-09', 'Claude Mythos 5, subagents', 93.3, 0, 1],
    ['2026-07-09', 'GPT-5.6 Sol', 90.4, 0, 0],
    ['2026-07-09', 'GPT-5.6 Sol, 16 agents', 93.4, 0, 1],
    ['2026-07-16', 'Kimi K3', 91.2, 1, 0],
    ['2026-07-24', 'Claude Opus 5, 10 agents', 93.6, 0, 1, [-8, -12], 'end'],
    ['2026-09-03', 'GPT-6 Astra', 91.5, 0, 0],
    ['2026-09-11', 'Atria Dawn Preview', 92.5, 1, 0, [-8, 20], 'end'],
  ].map(([d, n, v, o, par, off, anc]) => ({ d: new Date(d), n, v, o, par, off, anc }));
  const W = 860, H = 520, m = { l: 50, r: 24, t: 20, b: 36 };
  const x = d3.scaleTime().domain([new Date('2025-03-01'), new Date('2026-11-01')]).range([m.l, W - m.r]);
  const y = d3.scaleLinear().domain([0, 100]).range([H - m.b, m.t]);
  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'BrowseComp scores over time against the human baseline of 29.2%');
  const ax = svg.append('g').attr('class', 'ax').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(d3.timeMonth.every(3)).tickFormat(d3.timeFormat('%b %Y')).tickSize(-(H - m.t - m.b)));
  ax.selectAll('line').attr('stroke', '#eef0f3'); ax.select('.domain').attr('stroke', '#cfd2d9');
  const ay = svg.append('g').attr('class', 'ax').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickFormat(v => v + '%').tickSize(-(W - m.l - m.r)));
  ay.selectAll('line').attr('stroke', '#eef0f3'); ay.select('.domain').remove();
  svg.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', y(29.2)).attr('y2', y(29.2)).attr('stroke', '#d6453b').attr('stroke-width', 2).attr('stroke-dasharray', '6 4');
  svg.append('text').attr('x', W - m.r - 4).attr('y', y(29.2) - 8).attr('text-anchor', 'end').style('fill', '#d6453b').style('font-weight', 600).text('Human trainers, about 2 hours each: 29.2%');
  // best score so far, as a staircase
  let best = -1; const st = [];
  P.slice().sort((a, b) => a.d - b.d).forEach(p => { if (p.v > best) { if (st.length) st.push([x(p.d), y(best)]); st.push([x(p.d), y(p.v)]); best = p.v; } });
  st.push([W - m.r, y(best)]);
  svg.append('path').attr('d', d3.line()(st)).attr('fill', 'none').attr('stroke', '#1a2fd0').attr('stroke-width', 2).attr('opacity', .35);
  const g = svg.append('g').selectAll('g').data(P).join('g').attr('transform', p => `translate(${x(p.d)},${y(p.v)})`);
  g.append('circle').attr('r', 6).attr('fill', p => p.o ? '#fff' : p.par ? '#7b4fd6' : '#1a2fd0').attr('stroke', p => p.o ? '#2c9a58' : p.par ? '#7b4fd6' : '#1a2fd0').attr('stroke-width', 2)
    .append('title').text(p => `${p.n}: ${p.v}% (${d3.timeFormat('%b %Y')(p.d)})${p.par ? ', several attempts in parallel' : ''}${p.o ? ', open weights' : ''}`);
  g.filter(p => p.off).append('text').attr('x', p => p.off[0]).attr('y', p => p.off[1]).attr('text-anchor', p => p.anc || 'start').style('paint-order', 'stroke').style('stroke', '#fff').style('stroke-width', '4px').text(p => `${p.n} ${p.v}%`);
  const lg = d3.select(el).append('div').attr('class', 'pl-legend');
  [['#1a2fd0', 'Single run, closed model', 0], ['#7b4fd6', 'Several agents or attempts in parallel', 0], ['#2c9a58', 'Open weights', 1]].forEach(([c, t, h]) => lg.append('span').html(`<i style="background:${h ? '#fff' : c};border:1.5px solid ${c}"></i>${t}`));
  lg.append('span').style('margin-left', 'auto').text('Vendor-reported scores');
});

const fmt$ = v => v == null ? '–' : v === 0 ? '$0' : v < 0.01 ? '$' + v.toFixed(4) : v < 1 ? '$' + v.toFixed(3) : v < 100 ? '$' + v.toFixed(2) : '$' + Math.round(v).toLocaleString();

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
  if (d.hosted.length) parts.push('Runs on ' + d.hosted.join(', ') + ' infrastructure');
  if (d.billing) parts.push('Bought through: ' + d.billing);
  if (d.weights) parts.push('Self-host: open weights or open-source code');
  if (d.private) parts.push('Private deployment available under an enterprise contract');
  if (d.saas && !d.hosted.length) parts.push('Run by the vendor');
  return parts.join('. ') + (d.note ? '. ' + d.note : '');
}

/* ---------- player map ---------- */
safe('player map', function () {
  const grid = document.getElementById('pl-grid'); if (!grid || !window.WX || !WX.columns) return;
  const slide = grid.closest('.slide');
  const tags = d => [d.hosted.length && '<i style="background:var(--blue)"></i>', (d.weights || d.private) && '<i style="background:var(--green)"></i>', d.saas && !d.hosted.length && '<i style="background:var(--orange)"></i>'].filter(Boolean).join('');
  grid.innerHTML = WX.columns.map(c => `<div class="pl-col" style="--c:${c.color}"><h4>${c.label}<small>${c.unit}</small></h4>` + c.items.map(p =>
    `<div class="pl" tabindex="0" data-id="${p.id}"><span>${p.name}${p.verified ? '' : '<span class="unv" title="Price not confirmed on the vendor page">*</span>'}<span class="tags">${tags(p.deploy)}</span></span><span class="pr">${p.price}</span></div>`).join('') + '</div>').join('');
  grid.insertAdjacentHTML('afterend', `<div class="pl-legend"><span><i style="background:var(--blue)"></i>Runs on Azure, AWS or Google Cloud infrastructure</span><span><i style="background:var(--green)"></i>Self-host or private deployment</span><span><i style="background:var(--orange)"></i>Run by the vendor</span><span style="margin-left:auto">* price not confirmed · hover or tab for details</span></div>`);
  const tip = document.createElement('div'); tip.className = 'pl-tip'; tip.setAttribute('role', 'status'); slide.appendChild(tip);
  const all = WX.columns.flatMap(c => c.items);
  const show = el => {
    const p = all.find(x => x.id === el.dataset.id);
    tip.innerHTML = `<b>${p.name}</b>${esc(p.notes)}<span class="k">Where it runs</span>${esc(whereText(p.deploy))}${p.data ? `<span class="k">Data handling</span>${esc(p.data)}` : ''}${p.index ? `<span class="k">Index</span>${esc(p.index)}` : ''}<span class="k">Price basis</span>${esc(p.basis)}`;
    const r = el.getBoundingClientRect(), sr = slide.getBoundingClientRect(), sc = sr.width / 1440;
    let x = (r.right - sr.left) / sc + 8, y = (r.top - sr.top) / sc - 10;
    if (x > 1080) x = (r.left - sr.left) / sc - 330;
    tip.style.left = x + 'px'; tip.style.top = Math.min(y, 480) + 'px'; tip.style.display = 'block';
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

/* ---------- price ladder on one scale ---------- */
safe('price ladder', function () {
  const el = document.getElementById('ladder-chart'); if (!el || !window.WX || !WX.ladder) return;
  if (!window.d3) { el.innerHTML = '<div class="viz-missing">This chart needs the D3 library, which did not load. Prices are listed in research pack B.</div>'; return; }
  el.classList.add('lad');
  const famC = { search: '#5b5f6a', answer: '#12909a', tool: '#7b4fd6', research: '#1a2fd0' };
  const famL = { search: 'Search API, per 1,000 searches', answer: 'Answer API, per 1,000 answers', tool: 'Model + search tool, per 1,000 answers', research: 'Research task, per 1,000 tasks' };
  const data = WX.ladder.map((d, i) => ({ ...d, id: 'l' + i })).sort((a, b) => a.cost - b.cost);
  const W = 1248, H = 560, m = { l: 20, r: 20, t: 34, b: 30 };
  const x = d3.scaleLog().domain([0.6, 30000]).range([m.l, W - m.r]);
  const y = d3.scaleBand().domain(data.map(d => d.id)).range([m.t, H - m.b]).padding(0.2);
  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Price per 1,000 searches, answers or research tasks, log scale');
  [[0.6, 30, 'Plain search · dollars'], [30, 300, 'Grounded answers · cents each'], [300, 30000, 'Research tasks · cents to dollars each']].forEach(([a, b, t], i) => {
    const g = svg.append('g').attr('class', 'band');
    g.append('rect').attr('x', x(a)).attr('width', x(b) - x(a)).attr('y', m.t - 26).attr('height', H - m.t - m.b + 26).attr('fill', i % 2 ? '#f4f5f8' : '#fff');
    g.append('text').attr('x', x(a) + 8).attr('y', m.t - 10).attr('fill', '#8b8f99').text(t);
  });
  const ax = svg.append('g').attr('class', 'ax').attr('transform', `translate(0,${H - m.b})`)
    .call(d3.axisBottom(x).tickValues([1, 3, 10, 30, 100, 300, 1000, 3000, 10000]).tickFormat(v => '$' + d3.format(',')(v)).tickSize(-(H - m.t - m.b)));
  ax.selectAll('line').attr('stroke', '#eceef2'); ax.select('.domain').remove();
  const row = svg.append('g').selectAll('g').data(data).join('g').attr('transform', d => `translate(0,${y(d.id) + y.bandwidth() / 2})`);
  row.append('line').attr('x1', x(0.6)).attr('x2', d => x(d.cost)).attr('stroke', d => famC[d.fam]).attr('stroke-opacity', .25).attr('stroke-width', 2);
  row.append('circle').attr('cx', d => x(d.cost)).attr('r', 5).attr('fill', d => famC[d.fam]);
  row.append('text').attr('x', d => x(d.cost) + (x(d.cost) > 900 ? -10 : 10)).attr('text-anchor', d => x(d.cost) > 900 ? 'end' : 'start').attr('dy', '0.35em')
    .text(d => `${d.name}  ${fmt$(d.cost)}`);
  const lg = d3.select(el).append('div').attr('class', 'pl-legend');
  Object.keys(famC).forEach(k => lg.append('span').html(`<i style="background:${famC[k]}"></i>${famL[k]}`));
});

/* ---------- grounded answer and research task calculator ---------- */
safe('search calculator', function () {
  const sel = document.getElementById('gc-model'); if (!sel || !window.WX || !WX.calc) return;
  const ms = WX.calc, $ = id => document.getElementById(id);
  sel.innerHTML = ms.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  sel.value = 'claude-sonnet-5.5';
  const n = $('gc-n'), res = $('gc-res'), out = $('gc-out'), q = $('gc-q');
  const PRESETS = [['Quick answer', 2, 5000, 500], ['Research task', 80, 3100, 60000]];
  $('gc-presets').innerHTML = PRESETS.map((p, i) => `<button type="button" data-i="${i}">${p[0]}</button>`).join('');
  $('gc-presets').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const [, s, r, o] = PRESETS[+b.dataset.i];
    n.value = Math.log10(s); res.value = r; out.value = Math.log10(o); run();
  });
  function run() {
    const m = ms.find(x => x.id === sel.value);
    const searches = Math.max(1, Math.round(10 ** +n.value)), r = +res.value, o = Math.round(10 ** +out.value / 10) * 10, qs = Math.round(10 ** +q.value);
    const fee = searches * m.fee / 1000;
    const inTok = ((m.free ? 0 : searches * r) + 1000) * m.tok, outTok = o * m.tok;
    const cin = inTok * m.input / 1e6, cout = outTok * m.output / 1e6, per = fee + cin + cout;
    $('gc-n-v').textContent = searches.toLocaleString(); $('gc-res-v').textContent = r.toLocaleString();
    $('gc-out-v').textContent = o.toLocaleString(); $('gc-q-v').textContent = qs.toLocaleString();
    $('gc-per').textContent = fmt$(per); $('gc-total').textContent = fmt$(per * qs);
    $('gc-b1').style.width = fee / per * 100 + '%'; $('gc-b2').style.width = cin / per * 100 + '%'; $('gc-b3').style.width = cout / per * 100 + '%';
    $('gc-note').textContent = `$${m.fee} per 1,000 searches; $${m.input} / $${m.output} per million input / output tokens.` +
      (m.free ? ' Search result tokens are not billed on Vertex grounding.' : '') + (m.tok > 1 ? ' Tokens × 1.3 for the newer Claude tokenizer.' : '') + (m.note ? ' ' + m.note : '');
  }
  [sel, n, res, out, q].forEach(e => e.addEventListener('input', run));
  sel.addEventListener('change', run);
  run();
});

/* ---------- Pareto frontier slides: one board per view ---------- */
safe('frontier charts', function () {
  if (!window.WX || !WX.pareto || !window.ParetoChart) return;
  const FAM = {
    search: { api: { label: 'Search API', color: '#1a2fd0' }, tool: { label: "Model provider's search tool", color: '#7b4fd6' }, none: { label: 'No search', color: '#8b8f99' } },
    models: { anthropic: { label: 'Anthropic', color: '#d97757' }, openai: { label: 'OpenAI', color: '#12909a' }, google: { label: 'Google', color: '#1a2fd0' }, open: { label: 'Open weights', color: '#2c9a58' }, other: { label: 'Other', color: '#8b8f99' } },
    browsecomp: { single: { label: 'One agent', color: '#1a2fd0' }, multi: { label: 'Several agents in parallel', color: '#7b4fd6' } },
  };
  const MODEL_FILTERS = [
    { id: 'all', label: 'All', test: () => true },
    { id: 'azure', label: 'Model on Azure', test: p => p.deploy.hosted.includes('Azure') },
    { id: 'aws', label: 'Model on AWS', test: p => p.deploy.hosted.includes('AWS') },
    { id: 'gcp', label: 'Model on Google Cloud', test: p => p.deploy.hosted.includes('GCP') },
    { id: 'self', label: 'Open weights', test: p => p.deploy.weights },
  ];
  function mount(slideId, key, filters, size) {
    const slide = document.getElementById(slideId); if (!slide) return;
    const views = WX.pareto[key].views, tabs = slide.querySelector('.pf-tabs'), host = slide.querySelector('.pf-chart');
    const state = { filter: 'all', multiOnly: false };
    let chart;
    const render = i => {
      host.innerHTML = '';
      const div = document.createElement('div'); div.id = `${slideId}-c${i}`; host.appendChild(div);
      chart = ParetoChart(div, {
        points: views[i].points, families: FAM[key], filters, noHollow: true, state, unit: 'tasks', declutter: true,
        xLabel: 'Cost per 1,000 tasks (log scale) →', yLabel: views[i].metric, width: size[0], height: size[1],
      });
      tabs.querySelectorAll('.bt').forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', j === i); });
      tabs.querySelector('.lbl.m').textContent = views[i].method;
    };
    tabs.innerHTML = '<span class="lbl">View</span>' + views.map(v => `<button type="button" class="bt">${v.label}</button>`).join('') + '<span class="lbl m" style="margin-left:auto"></span>';
    tabs.querySelectorAll('.bt').forEach((b, i) => b.addEventListener('click', () => render(i)));
    render(0);
    slide.addEventListener('slide:enter', () => chart && chart.replay());
  }
  mount('pf-search', 'search', HOST_FILTERS.slice(0, 1), [1240, 470]);
  mount('pf-models', 'models', MODEL_FILTERS, [1240, 470]);
  mount('pf-browsecomp', 'browsecomp', MODEL_FILTERS.slice(0, 4), [1240, 470]);
});

/* ---------- decision guide ---------- */
safe('decision guide', function () {
  const qs = document.getElementById('g-qs'), out = document.getElementById('g-out'); if (!qs) return;
  const Q = [
    ['task', 'What is the task?', [['fact', 'Single facts'], ['hard', 'Hard-to-find facts'], ['list', 'A list or table of many items'], ['report', 'A written report'], ['act', 'Operating a website']]],
    ['volume', 'How many?', [['few', 'A few at a time'], ['many', 'Hundreds or more']]],
    ['where', 'Where may the queries be processed?', [['any', 'Approved providers anywhere'], ['azure', 'Azure only'], ['aws', 'AWS only'], ['gcp', 'Google Cloud only'], ['local', 'No external search services']]],
    ['method', 'Who sets the method?', [['tool', 'The tool may choose'], ['fixed', 'We must follow our method']]],
    ['evidence', 'What evidence is needed?', [['links', 'Links to sources'], ['passage', 'The supporting passage for each claim']]],
    ['sources', 'Which sources?', [['open', 'The open web'], ['paid', 'Also logged-in or paywalled sites'], ['internal', "Also the client's own files"]]],
  ];
  const A = { task: 'hard', volume: 'few', where: 'any', method: 'tool', evidence: 'links', sources: 'open' };
  qs.innerHTML = Q.map(([k, q, os]) => `<div class="g-q" data-k="${k}" role="radiogroup" aria-label="${q}"><span class="label">${q}</span><div class="opts">${os.map(([v, l]) => `<button type="button" role="radio" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
  qs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; A[b.closest('.g-q').dataset.k] = b.dataset.v; run(); });

  // Reading tasks in each constrained setting use the search route that stays there (research pack B).
  const AZURE_NOTE = 'No Microsoft web search stays inside Azure: every route goes through Bing, which sends queries outside the Azure compliance boundary, and the data protection addendum does not apply.';
  function pick(a) {
    const W = a.where, many = a.volume === 'many';
    const r = { start: '', why: '', test: [], cost: '', watch: [] };
    const blocked = (W === 'azure' || W === 'local') && a.task !== 'act';
    if (blocked) {
      r.start = W === 'azure'
        ? 'With the client\'s written agreement: GPT-6.1 Sol in Azure OpenAI with its web search tool (Bing). Without it: fetch only known pages from a crawler you run in Azure, and read them with a model in Azure OpenAI.'
        : 'Fetch only pages you already know about, with a crawler you run yourself (Crawl4AI, Apache-2.0), and read them with a self-hosted model.';
      r.why = W === 'azure' ? AZURE_NOTE : 'Any web search sends the query to the search provider. Without one, the tool cannot discover new sources.';
      r.test.push(W === 'azure' ? 'Running this work in AWS or Google Cloud instead, where web search can stay inside the cloud, if the client allows' : 'Tongyi DeepResearch 30B (open weights, Apache-2.0) with a search API, if one is later approved');
      r.cost = W === 'azure' ? '$14 per 1,000 Bing searches plus tokens; a self-run crawler costs only compute' : 'Compute only, plus engineering effort';
      if (a.task === 'list' || a.task === 'fact') r.watch.push('Fetching known pages works for lists of known companies or sites. It cannot find sources you have not named.');
    } else if (a.task === 'act') {
      r.start = ({
        any: many ? 'A browser agent model in a cloud browser: Gemini Computer Use or Claude computer use, with Browserbase or a similar service' : 'Claude in Chrome or ChatGPT agent, in a separate browser profile with only the logins it needs',
        azure: 'The Foundry Browser Automation tool, with browsers in Playwright Workspaces inside Azure',
        aws: 'Claude computer use on Bedrock, with AgentCore Browser inside AWS',
        gcp: 'Gemini Computer Use on Vertex AI',
        local: 'Browser Use or Stagehand (open source) with a self-hosted model',
      })[W];
      r.why = 'Public browsing benchmarks are near their ceiling (97% on Online-Mind2Web), but real tasks take minutes each and fail on unusual sites. Use a browser only for the steps that need one.';
      r.test.push('A search API or page fetch for any step that only reads public pages: faster, cheaper and repeatable');
      r.cost = 'Model tokens (often $0.10–1.30 per task) plus $0.02–0.60 per browser-hour';
      r.watch.push('Pages can contain instructions aimed at the agent (prompt injection). Keep agents away from email, banking and client systems, and require confirmation before anything is sent or changed.');
      r.watch.push('Agents stop and hand back to the user at CAPTCHAs and payments, by design.');
    } else {
      const S = { // search route and a small and a large model, per setting
        any: { small: 'Claude Haiku 5.5 or Gemini 3.8 Flash', large: 'Claude Sonnet 5.5 or Gemini 3.8 Flash', api: 'Exa or Parallel Search ($4–5 per 1,000 searches)', tool: 'with its built-in web search' },
        aws: { small: 'Claude Haiku 5.5 on Bedrock', large: 'Claude Sonnet 5.5 on Bedrock', api: 'AgentCore Web Search ($7 per 1,000 searches)', tool: 'with AgentCore Web Search' },
        gcp: { small: 'Gemini 3.8 Flash', large: 'Gemini 4 Argon', api: 'Web Grounding for Enterprise ($14 per 1,000 searches)', tool: 'with Web Grounding for Enterprise' },
      }[W];
      if (a.task === 'fact') {
        r.start = many ? `A search API in your own code, ${S.api}, with ${S.small} reading the results` : `${S.large} ${S.tool}`;
        r.why = 'Short factual lookups are saturated: the top systems score 91–98%. Choose on cost, citations and terms.';
        r.test.push(W === 'any' ? (many ? 'TinyFish or Octen, the cheapest options on the independent Artificial Analysis board (check their terms)' : "Perplexity's or Exa's answer APIs, under 1 cent an answer") : `${S.small} ${S.tool}, to see if the smaller model is enough`);
        r.cost = many ? (W === 'gcp' ? 'About $30 per 1,000 questions' : 'About $5–30 per 1,000 questions') : 'About 3–6 cents an answer';
      } else if (a.task === 'hard') {
        r.start = ({
          any: many ? 'Parallel Task API, pro or ultra tier ($0.10–0.30 a task)' : 'Gemini Deep Research ($1–3 a task), or GPT-5.5 with high reasoning and web search (about $3)',
          aws: 'An agent on Bedrock: Claude Opus 5.5 or Sonnet 5.5 at high effort, with AgentCore Web Search',
          gcp: 'Gemini 4 Argon in an agent loop with Web Grounding for Enterprise. Gemini Deep Research is in the Gemini API; confirm whether it is available on Vertex AI',
        })[W];
        r.why = 'A single deep agent reaches about 84–91% on BrowseComp. The last few points cost 10–20 times more, mostly from running several agents at once.';
        r.test.push(W === 'any' ? (many ? 'Gemini Deep Research on a sample, as the quality reference' : 'Parallel Task API, ultra ($0.30 a task)') : 'The same agent with a smaller model, to measure what the larger one adds');
        r.test.push('Running each question twice: disagreement is a cheap signal for review');
        r.cost = W === 'any' ? (many ? '$100–300 per 1,000 tasks' : '$1–3 a task') : 'About $1–5 a task, depending on effort';
      } else if (a.task === 'list') {
        r.start = `If the list is known: loop over it in code with ${S.api} and ${S.small} filling a fixed table. If the list must be discovered: ` +
          (W === 'any' ? 'a research API that returns a table, such as Parallel Task API or Exa Agent' : `an agent with ${S.large} ${S.tool}, asked for one row per item with a source for each cell`);
        r.why = 'Single research runs miss items: the best agent filled 5% of WideSearch tables completely. Code that loops over a known list cannot skip an item.';
        r.test.push('One deep research run on the same list, to measure what it misses');
        r.cost = 'About $5–35 per 1,000 items with a search API; $0.10–1 per discovery task';
      } else {
        r.start = ({
          any: many ? 'The Gemini Deep Research API with a fixed plan and prompt' : 'Gemini Deep Research or ChatGPT deep research',
          aws: 'An agent on Bedrock: Claude Opus 5.5 with AgentCore Web Search, writing to a fixed outline',
          gcp: 'Gemini Deep Research if available on Vertex AI for the client; otherwise Gemini 4 Argon with Web Grounding for Enterprise, writing to a fixed outline',
        })[W];
        r.why = 'No benchmark compares these reports with an expert\'s. Citations support 40–80% of claims, so the report needs checking.';
        r.test.push(W === 'any' ? 'Claude Research' : 'A second model on the same outline');
        r.cost = W === 'any' ? (many ? '$1–7 per report through the API' : 'Included in $20–200 per seat a month apps, or $1–7 per report through the API') : 'About $1–7 per report';
      }
      if (W === 'gcp' && /Gemini 3\.8/.test(r.start + r.test.join(' '))) r.watch.push('Gemini 3.8 Flash prices double on 1 January 2027.');
      if (W === 'aws') r.watch.push('AgentCore Web Search is not yet on public benchmarks. Test it on the client\'s questions.');
      if (W === 'gcp') r.watch.push('Web Grounding for Enterprise works only with Gemini models.');
      if (W === 'any') r.watch.push('Queries go to the search provider. Check its retention and storage terms; zero data retention is usually an enterprise add-on.');
    }
    if (a.method === 'fixed' && a.task !== 'fact') r.watch.push('Write the method into the plan before the run' + (W === 'any' ? ' (Gemini and ChatGPT deep research both allow plan editing)' : '') + ', run dependent stages as separate tasks, and avoid splitting one question across parallel agents.');
    if (a.evidence === 'passage') r.watch.push('Ask for a table with a source and a quoted passage for each cell' + (W === 'any' ? ' (Claude\'s search tool returns the cited text; Parallel\'s Task API returns a source per field)' : '') + ', and check that each quote appears on the cited page. Then check a sample by hand: 20–60% of citations may not support their claim.');
    if (a.sources === 'paid') r.watch.push('Search APIs and research agents cannot get past logins or paywalls. Use the client\'s licensed databases through connectors, or a browser agent in a logged-in browser.');
    if (a.sources === 'internal') r.watch.push('Connect the client\'s files through the tool\'s connectors (MCP) and check that both the files and the web queries go only to approved providers.');
    if (many && a.task === 'report') r.watch.push('At volume, use the API with a fixed plan and prompt, not the chat apps, so runs are consistent and logged.');
    return r;
  }
  function run() {
    qs.querySelectorAll('.g-q').forEach(q => q.querySelectorAll('button').forEach(b => { const on = A[q.dataset.k] === b.dataset.v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }));
    const r = pick(A);
    out.innerHTML = `<h4>Start with</h4><div class="pick">${r.start}</div><div class="why">${r.why}</div>
      <h4>Test it against</h4><ul>${r.test.map(t => `<li>${t}</li>`).join('')}</ul>
      <h4>Rough cost (list price)</h4><div class="why" style="color:var(--ink-2)">${r.cost}</div>
      ${r.watch.length ? `<h4>Watch out for</h4><ul>${r.watch.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      <p class="src" style="margin-top:12px">Picks dated 25 Oct 2026. A starting point for a test on the client's questions, not a final answer.</p>`;
  }
  window.__guidePick = pick; // used by the automated combination checks
  run();
});
