// Interactive demo slides for the speech to text session.
function safe(name, fn) { try { fn(); } catch (e) { console.error('Could not start ' + name, e); } }
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

/* ---------- title: a live call transcript, partial results then finals ---------- */
safe('title transcript', function () {
  const card = document.getElementById('title-live'); if (!card) return;
  // speaker, partial results as they arrive, final result, ms from end of speech to final
  const U = [
    ['Caller', ['hi', "hi I'm calling", "hi I'm calling about my clean", "hi I'm calling about my claim number", "hi I'm calling about my claim number four seven two nine"], "Hi, I'm calling about my claim, number 4729.", 320],
    ['Agent', ['thanks', 'thanks can I take', 'thanks can I take your date of', 'thanks can I take your date of birth'], 'Thanks. Can I take your date of birth?', 270],
    ['Caller', ["it's the", "it's the fourteenth of", "it's the fourteenth of march nineteen", "it's the fourteenth of march nineteen eighty two"], "It's the 14th of March 1982.", 360],
    ['Agent', ['thank you', 'thank you I can see the claim', 'thank you I can see the claim for the water leak in leads', 'thank you I can see the claim for the water leak in Leeds'], 'Thank you. I can see the claim for the water leak in Leeds.', 300],
    ['Caller', ["yes that's", "yes that's the one", "yes that's the one perfect oh", "yes that's the one perfecto"], "Yes, that's the one. Perfecto.", 410],
  ];
  const m = { rev: document.getElementById('tl-rev'), lat: document.getElementById('tl-lat'), spk: document.getElementById('tl-spk') };
  let timers = [];
  const at = (ms, f) => timers.push(setTimeout(f, reduced ? 0 : ms));
  function play() {
    timers.forEach(clearTimeout); timers = [];
    card.querySelectorAll('.ut').forEach(e => e.remove());
    let t = 500, revs = 0; const lats = [], spk = new Set();
    m.rev.textContent = 0; m.lat.textContent = '–'; m.spk.textContent = 0;
    U.forEach(([who, parts, fin, lat]) => {
      let row;
      at(t, () => {
        card.insertAdjacentHTML('beforeend', `<div class="ut ${who === 'Agent' ? 'a' : 'c'}"><span class="who">${who}</span><span class="tx p"></span><span class="ms"></span></div>`);
        row = card.lastElementChild; void row.offsetWidth; row.classList.add('in');
        spk.add(who); m.spk.textContent = spk.size;
      });
      parts.forEach((p, i) => {
        at(t += 420, () => {
          const tx = row.querySelector('.tx'), prev = tx.textContent.split(' ');
          const words = p.split(' ');
          const changed = words.some((w, j) => j < prev.length && prev[j] && prev[j] !== w);
          if (changed) { revs++; m.rev.textContent = revs; }
          tx.innerHTML = words.map((w, j) => j < prev.length && prev[j] && prev[j] !== w ? `<mark>${esc(w)}</mark>` : esc(w)).join(' ');
        });
      });
      at(t += lat + 200, () => {
        const tx = row.querySelector('.tx');
        tx.classList.remove('p'); tx.textContent = fin;
        row.querySelector('.ms').textContent = `final +${lat} ms`;
        lats.push(lat); const s = lats.slice().sort((a, b) => a - b);
        m.lat.textContent = s[Math.floor((s.length - 1) / 2)] + ' ms';
      });
      t += 500;
    });
  }
  document.getElementById('title').addEventListener('slide:enter', play);
  play();
});

/* ---------- generic: step lists ---------- */
document.querySelectorAll('.slide').forEach(s => {
  const walk = s.querySelectorAll('.pipe-steps.walk > div');
  if (!walk.length) return;
  const upd = st => walk.forEach((d, i) => { d.classList.toggle('on', i <= st); d.classList.toggle('cur', i === st); });
  s.addEventListener('slide:step', e => upd(e.detail.step));
  upd(0);
});

/* ---------- from sound to spectrogram: synthetic "seven six", phone band, microphone ---------- */
const SR = 16000;
function fft(re, im) { // in place, radix 2
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const ur = re[i + j], ui = im[i + j], k = i + j + len / 2;
        const vr = re[k] * cr - im[k] * ci, vi = re[k] * ci + im[k] * cr;
        re[i + j] = ur + vr; im[i + j] = ui + vi; re[k] = ur - vr; im[k] = ui - vi;
        [cr, ci] = [cr * wr - ci * wi, cr * wi + ci * wr];
      }
    }
  }
}
const mel = f => 2595 * Math.log10(1 + f / 700), imel = m => 700 * (10 ** (m / 2595) - 1);

safe('spectrogram demo', function () {
  const s = document.getElementById('spectro'); if (!s) return;
  const cv = document.getElementById('sp-canvas'), ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  // label, seconds, kind, formants or noise band (Hz)
  const SEG = [['', .12, 'sil'], ['s', .17, 'fric', [4300, 7800]], ['e', .13, 'vowel', [560, 1850, 2600]], ['v', .07, 'vfric', [2200, 6500]],
    ['e', .1, 'vowel', [560, 1850, 2600]], ['n', .13, 'nasal', [280, 1300, 2500]], ['', .12, 'sil'], ['s', .15, 'fric', [4500, 7800]],
    ['i', .15, 'vowel', [330, 2250, 2950]], ['', .05, 'sil'], ['k', .04, 'burst', [1800, 4200]], ['s', .16, 'fric', [4500, 7800]], ['', .14, 'sil']];
  const total = SEG.reduce((a, g) => a + g[1], 0), N = Math.round(total * SR);
  const x = new Float32Array(N);
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const banks = {};
  const bank = (lo, hi) => banks[lo + '-' + hi] || (banks[lo + '-' + hi] = Array.from({ length: 160 }, () => [lo + rnd() * (hi - lo), rnd() * 6.283]));
  let pos = 0, phase = 0;
  SEG.forEach(([, dur, kind, p]) => {
    const n = Math.round(dur * SR);
    for (let i = 0; i < n; i++) {
      const t = (pos + i) / SR, env = Math.min(1, i / 160, (n - i) / 160);
      let v = 0;
      if (kind === 'vowel' || kind === 'nasal' || kind === 'vfric') {
        const f0 = 128 - 18 * (pos + i) / N; phase += f0 / SR;
        const F = kind === 'vfric' ? [250, 1500] : p, gain = kind === 'vowel' ? 1 : kind === 'nasal' ? .45 : .2;
        for (let h = 1; h * f0 < 7900; h++) {
          const f = h * f0;
          const a = F.reduce((s, Fi) => s + 1 / (1 + ((f - Fi) / (60 + .07 * Fi)) ** 2), 0) / (1 + f / 900);
          v += gain * a * Math.sin(6.2832 * h * phase);
        }
      }
      if (kind === 'fric' || kind === 'vfric' || kind === 'burst') {
        const g = kind === 'fric' ? .05 : kind === 'vfric' ? .02 : .08;
        bank(p[0], p[1]).forEach(([f, ph]) => { v += g * Math.sin(6.2832 * f * t + ph); });
      }
      x[pos + i] = v * env;
    }
    pos += n;
  });
  const peak = x.reduce((m, v) => Math.max(m, Math.abs(v)), 0); x.forEach((v, i) => (x[i] = v / peak * .8));

  // short-time Fourier transform: 25 ms frames every 10 ms
  const FR = 400, HOP = 160, NF = 512, frames = [];
  for (let st = 0; st + FR <= N; st += HOP) {
    const re = new Float32Array(NF), im = new Float32Array(NF);
    for (let i = 0; i < FR; i++) re[i] = x[st + i] * (.5 - .5 * Math.cos(6.2832 * i / (FR - 1)));
    fft(re, im);
    const p = new Float32Array(NF / 2 + 1);
    for (let k = 0; k <= NF / 2; k++) p[k] = 10 * Math.log10(re[k] * re[k] + im[k] * im[k] + 1e-9);
    frames.push(p);
  }
  const NM = 80, mEdges = Array.from({ length: NM + 2 }, (_, i) => imel(mel(8000) * i / (NM + 1)));
  const toMel = p => Array.from({ length: NM }, (_, b) => {
    const lo = mEdges[b] / 8000 * 256, hi = mEdges[b + 2] / 8000 * 256; let s = -200;
    for (let k = Math.floor(lo); k <= Math.ceil(hi); k++) s = Math.max(s, p[Math.min(256, k)]);
    return s;
  });
  const melFrames = frames.map(toMel);
  const col = v => { // white → blue → ink
    const t = Math.max(0, Math.min(1, v));
    const c = t < .5 ? [255 - t * 2 * (255 - 61), 255 - t * 2 * (255 - 80), 255 - t * 2 * (255 - 230)] : [61 - (t - .5) * 2 * 49, 80 - (t - .5) * 2 * 67, 230 - (t - .5) * 2 * 212];
    return `rgb(${c.map(Math.round).join(',')})`;
  };
  const L = 52, B = 30, PW = W - L - 10, PH = H - B - 14;
  let step = 0, live = null;
  function axes(isMel, phone) {
    ctx.fillStyle = '#8b8f99'; ctx.font = '11px "Geist Mono", monospace'; ctx.textAlign = 'right';
    const yOf = f => 14 + PH - (isMel ? mel(f) / mel(8000) : f / 8000) * PH;
    [0, 500, 1000, 2000, 4000, 8000].forEach(f => { ctx.fillText(f >= 1000 ? f / 1000 + ' kHz' : f + ' Hz', L - 6, yOf(f) + 4); ctx.fillStyle = '#eceef2'; ctx.fillRect(L, yOf(f), PW, 1); ctx.fillStyle = '#8b8f99'; });
    if (phone) {
      const y4 = yOf(4000);
      ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.fillRect(L, 14, PW, y4 - 14);
      ctx.fillStyle = 'rgba(214,69,59,.10)'; ctx.fillRect(L, 14, PW, y4 - 14);
      ctx.strokeStyle = '#d6453b'; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(L, y4); ctx.lineTo(L + PW, y4); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#d6453b'; ctx.textAlign = 'left'; ctx.font = '600 13px Manrope, sans-serif';
      const msg = 'Lost on a phone line: 8 kHz sampling keeps only 0–4 kHz';
      ctx.fillStyle = '#fff'; ctx.fillRect(L + 6, 20, ctx.measureText(msg).width + 10, 20);
      ctx.fillStyle = '#d6453b'; ctx.fillText(msg, L + 11, 35);
    }
  }
  function labels() {
    ctx.font = '600 13px Manrope, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#2f323a';
    let t = 0;
    SEG.forEach(([l, d]) => { if (l) ctx.fillText(l, L + (t + d / 2) / total * PW, H - 10); t += d; });
    ctx.fillStyle = '#8b8f99'; ctx.font = '11px "Geist Mono", monospace'; ctx.textAlign = 'right';
    ctx.fillText('"seven six" · ' + Math.round(total * 1000) + ' ms', W - 12, H - 10);
  }
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    if (step <= 1) { // waveform, then frames
      const mid = 14 + PH / 2;
      ctx.strokeStyle = '#1a2fd0'; ctx.lineWidth = 1; ctx.beginPath();
      for (let px = 0; px < PW; px++) {
        const a = Math.floor(px / PW * N), b = Math.floor((px + 1) / PW * N);
        let lo = 0, hi = 0; for (let i = a; i < b; i++) { lo = Math.min(lo, x[i]); hi = Math.max(hi, x[i]); }
        ctx.moveTo(L + px + .5, mid - hi * PH / 2); ctx.lineTo(L + px + .5, mid - lo * PH / 2);
      }
      ctx.stroke();
      if (step === 1) {
        const f0 = Math.floor(frames.length * .38);
        for (let f = f0; f < f0 + 6; f++) {
          const xa = L + f * HOP / N * PW, w = FR / N * PW;
          ctx.strokeStyle = f % 2 ? '#e5892a' : '#7b4fd6'; ctx.lineWidth = 1.5;
          ctx.strokeRect(xa, 14 + (f - f0) * 6, w, PH - (f - f0) * 12);
        }
        ctx.fillStyle = '#2f323a'; ctx.font = '600 13px Manrope, sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Each frame: 25 ms of audio, overlapping, one every 10 ms (100 a second)', L + 8, 30);
      }
      ctx.fillStyle = '#8b8f99'; ctx.font = '11px "Geist Mono", monospace'; ctx.textAlign = 'right'; ctx.fillText('pressure', L - 6, 14 + PH / 2 + 4);
    } else {
      const isMel = step >= 3, rows = isMel ? NM : 257, data = isMel ? melFrames : frames;
      const mx = Math.max(...data.map(f => Math.max(...f))), mn = mx - 55;
      const cw = PW / data.length, rh = PH / rows;
      data.forEach((f, i) => { for (let k = 0; k < rows; k++) { ctx.fillStyle = col((f[k] - mn) / 55); ctx.fillRect(L + i * cw, 14 + PH - (k + 1) * rh, cw + .6, rh + .6); } });
      axes(isMel, step >= 4);
    }
    labels();
  }
  function liveDraw(an, buf) {
    // scroll left by one column and paint the newest spectrum at the right edge
    const img = ctx.getImageData(L + 2, 14, PW - 2, PH); ctx.putImageData(img, L, 14);
    an.getFloatFrequencyData(buf);
    const isMel = step >= 3, rows = isMel ? NM : 257, rh = PH / rows, nyq = an.context.sampleRate / 2;
    for (let k = 0; k < rows; k++) {
      const f = isMel ? imel(mel(8000) * (k + .5) / rows) : (k + .5) / rows * 8000;
      const v = buf[Math.min(buf.length - 1, Math.round(f / nyq * buf.length))];
      ctx.fillStyle = step >= 4 && f > 4000 ? '#f6dcda' : col((v + 100) / 70);
      ctx.fillRect(L + PW - 2, 14 + PH - (k + 1) * rh, 2, rh + .6);
    }
  }
  const micBtn = document.getElementById('sp-mic'), playBtn = document.getElementById('sp-play');
  async function startMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ac = new AudioContext(), an = ac.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = 0;
      ac.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.frequencyBinCount);
      if (step < 2) { step = 2; }
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); axes(step >= 3, step >= 4);
      ctx.fillStyle = '#8b8f99'; ctx.font = '11px "Geist Mono", monospace'; ctx.textAlign = 'left'; ctx.fillText('Live from your microphone. Nothing is recorded or sent anywhere.', L, H - 10);
      live = { stream, ac, raf: 0 };
      const loop = () => { liveDraw(an, buf); live.raf = requestAnimationFrame(loop); };
      loop(); micBtn.textContent = 'Stop microphone';
    } catch (e) { micBtn.textContent = 'Microphone not available'; }
  }
  function stopMic() {
    if (!live) return;
    cancelAnimationFrame(live.raf); live.stream.getTracks().forEach(t => t.stop()); live.ac.close(); live = null;
    micBtn.textContent = 'Try your own voice'; draw();
  }
  micBtn.addEventListener('click', () => (live ? stopMic() : startMic()));
  playBtn.addEventListener('click', () => {
    const ac = new AudioContext(), buf = ac.createBuffer(1, N, SR); buf.copyToChannel(x, 0);
    const src = ac.createBufferSource(); src.buffer = buf;
    if (step >= 4) { // telephone: band-limit to 300–3,400 Hz
      const hp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300; lp.type = 'lowpass'; lp.frequency.value = 3400;
      src.connect(hp).connect(lp).connect(ac.destination);
    } else src.connect(ac.destination);
    src.start(); src.onended = () => ac.close();
  });
  s.addEventListener('slide:step', e => { step = e.detail.step; playBtn.textContent = step >= 4 ? 'Play as a phone line' : 'Play the sound'; if (!live) draw(); });
  s.addEventListener('slide:enter', () => {});
  document.addEventListener('keydown', () => { if (live && !s.classList.contains('active')) stopMic(); });
  draw();
});

/* ---------- four decoder families on the same audio ---------- */
safe('decoder demo', function () {
  const s = document.getElementById('decoders'); if (!s) return;
  const frames = 'ss_eev_enn__sii_kss_'.split('');
  const D = {
    ctc: { t: 'CTC', what: 'One label per frame, each chosen on its own. Merge repeats, then drop the blanks.',
      good: 'Fast and simple. Streams naturally. Cannot invent words where there is no sound.', bad: 'Each frame ignores the words already written, so spelling and names suffer without a language model on top.', eg: 'NVIDIA Parakeet CTC, wav2vec 2.0, Meta MMS and Omnilingual ASR (CTC versions)' },
    rnnt: { t: 'Transducer', what: 'Reads frames as they arrive and writes a word piece whenever it is confident, taking the text so far into account.',
      good: 'Streams with low delay and uses context. The usual design for live transcription on phones and in the cloud.', bad: 'Harder to train. Accuracy drops a little when it can look only a short way ahead.', eg: 'Google on-device and Chirp streaming, NVIDIA Parakeet TDT, Amazon Transcribe streaming, most live APIs' },
    aed: { t: 'Encoder–decoder', what: 'Listens to a whole window (30 seconds for Whisper), then writes the text word by word, like a translator.',
      good: 'Very accurate, handles punctuation and formatting, and can translate.', bad: 'Must wait for the window, so it does not stream without tricks. Can invent fluent text in silence or noise.', eg: 'OpenAI Whisper, NVIDIA Canary' },
    llm: { t: 'Speech LLM', what: 'An audio encoder turns sound into tokens that a language model reads with a text prompt, then writes the transcript.',
      good: 'Follows instructions: names to expect, output format, summaries. Strong on context and rare words.', bad: 'Slower and dearer per minute. Shares the encoder–decoder risk of inventing text. Streaming needs extra engineering.', eg: 'OpenAI gpt-4o-transcribe, Gemini, Mistral Voxtral, Qwen3-ASR, IBM Granite Speech' },
  };
  const tabs = document.getElementById('dc-tabs'), grid = document.getElementById('dc-frames'), out = document.getElementById('dc-out'), note = document.getElementById('dc-note');
  grid.innerHTML = frames.map((_, i) => `<i data-i="${i}"></i>`).join('');
  let timers = [], mode = 'ctc';
  const at = (ms, f) => timers.push(setTimeout(f, reduced ? 0 : ms));
  function lit(n) { grid.querySelectorAll('i').forEach((e, i) => e.classList.toggle('on', i < n)); }
  function run(k) {
    mode = k; timers.forEach(clearTimeout); timers = []; out.innerHTML = ''; lit(0);
    const d = D[k];
    note.innerHTML = `<p><b>How it works.</b> ${d.what}</p><p class="ok-t"><b>Good:</b> ${d.good}</p><p class="bad-t"><b>Watch:</b> ${d.bad}</p><p class="src">${d.eg}</p>`;
    const F = 140;
    if (k === 'ctc') {
      frames.forEach((c, i) => at(i * F, () => { lit(i + 1); out.insertAdjacentHTML('beforeend', `<span class="tk ${c === '_' ? 'blank' : ''}">${c === '_' ? '∅' : c}</span>`); }));
      at(frames.length * F + 500, () => { out.insertAdjacentHTML('beforeend', '<div class="arrow">merge repeats → <b>s_ev_en_si_ks_</b> &nbsp; drop blanks → <b>seven six</b></div>'); });
    } else if (k === 'rnnt') {
      const emit = { 6: 'sev', 10: 'en', 16: '▁six' };
      frames.forEach((_, i) => at(i * F, () => { lit(i + 1); if (emit[i]) out.insertAdjacentHTML('beforeend', `<span class="tk wp">${emit[i]}<small>after frame ${i + 1}</small></span>`); }));
      at(frames.length * F + 300, () => out.insertAdjacentHTML('beforeend', '<div class="arrow">text appears while the person is still speaking → <b>seven six</b></div>'));
    } else if (k === 'aed') {
      frames.forEach((_, i) => at(i * 60, () => lit(i + 1)));
      at(frames.length * 60 + 200, () => out.insertAdjacentHTML('beforeend', '<div class="arrow wait">waits for the whole window, then writes:</div>'));
      ['Seven', 'six.'].forEach((w, i) => at(frames.length * 60 + 700 + i * 380, () => out.insertAdjacentHTML('beforeend', `<span class="tk wp">${w}</span>`)));
      at(frames.length * 60 + 1700, () => out.insertAdjacentHTML('beforeend', '<span class="tk hall">Thank you for watching.</span><div class="arrow bad-t">in trailing silence, a model trained on subtitles may add a line that was never said</div>'));
    } else {
      out.insertAdjacentHTML('beforeend', '<div class="prompt">Prompt: <i>"Transcribe this call. Write numbers as digits. Expect the names Northwind and Leeds."</i></div>');
      frames.forEach((_, i) => at(i * 60, () => lit(i + 1)));
      at(frames.length * 60 + 500, () => out.insertAdjacentHTML('beforeend', '<span class="tk wp">76</span><div class="arrow">the instruction changes the output format; the same prompt can carry names, jargon and the context of the call</div>'));
    }
  }
  radios(tabs, Object.entries(D).map(([k, v]) => [k, v.t]), 'ctc', run);
  s.addEventListener('slide:enter', () => run(mode));
  run('ctc');
});

/* ---------- WER: align a transcript against the reference ---------- */
function wordAlign(r, h) { // Levenshtein over words; returns ops [type, ref, hyp]
  const n = r.length, m = h.length, d = Array.from({ length: n + 1 }, (_, i) => [i, ...Array(m).fill(0)]);
  for (let j = 1; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (r[i - 1] === h[j - 1] ? 0 : 1));
  const ops = []; let i = n, j = m;
  while (i || j) {
    if (i && j && d[i][j] === d[i - 1][j - 1] + (r[i - 1] === h[j - 1] ? 0 : 1)) { ops.unshift([r[i - 1] === h[j - 1] ? 'ok' : 'S', r[i - 1], h[j - 1]]); i--; j--; }
    else if (i && d[i][j] === d[i - 1][j] + 1) { ops.unshift(['D', r[i - 1], '']); i--; }
    else { ops.unshift(['I', '', h[j - 1]]); j--; }
  }
  return ops;
}
safe('wer demo', function () {
  const s = document.getElementById('wer'); if (!s) return;
  const EX = [
    ['Wrong words', "My claim number is 4729 and I'm calling from Leeds.", "my clean number is four seven two nine and i'm calling from leads"],
    ['Formatting only', "It's the 14th of March, 1982.", 'it is the fourteenth of march nineteen eighty two'],
    ['Invented text', 'Thanks, bye.', 'thanks bye thank you for watching'],
    ['Overlapping speech', 'Sorry, could you repeat the postcode for me?', 'sorry could you the postcode'],
  ];
  // a small normaliser in the spirit of Whisper's: case, punctuation, contractions and numbers written as words
  const NUM = { '4729': 'four seven two nine', '14th': 'fourteenth', '1982': 'nineteen eighty two', "it's": 'it is', "i'm": 'i am' };
  const norm = t => t.toLowerCase().replace(/[.,?!]/g, '').split(/\s+/).filter(Boolean).flatMap(w => (NUM[w] || w).split(' '));
  const raw = t => t.split(/\s+/).filter(Boolean);
  const ref = document.getElementById('wer-ref'), hyp = document.getElementById('wer-hyp'), nb = document.getElementById('wer-norm');
  const al = document.getElementById('wer-align'), res = document.getElementById('wer-res');
  let ex = 0;
  function run() {
    const f = nb.checked ? norm : raw;
    const R = f(ref.textContent), H = f(hyp.value), ops = wordAlign(R, H);
    const c = { S: 0, D: 0, I: 0 }; ops.forEach(o => o[0] !== 'ok' && c[o[0]]++);
    al.innerHTML = ops.map(([t, a, b]) => `<span class="w ${t}"><b>${esc(a || '·')}</b><i>${esc(b || '·')}</i></span>`).join('');
    const wer = R.length ? (c.S + c.D + c.I) / R.length * 100 : 0;
    res.innerHTML = `<div><span class="label">Substitutions</span><b class="S">${c.S}</b></div><div><span class="label">Deletions</span><b class="D">${c.D}</b></div><div><span class="label">Insertions</span><b class="I">${c.I}</b></div><div><span class="label">Reference words</span><b>${R.length}</b></div>
      <div class="tot"><span class="label">Word error rate</span><b>${wer.toFixed(0)}%</b><small>(${c.S} + ${c.D} + ${c.I}) ÷ ${R.length}</small></div>`;
  }
  radios(document.getElementById('wer-ex'), EX.map((e, i) => [String(i), e[0]]), '0', v => { ex = +v; ref.textContent = EX[ex][1]; hyp.value = EX[ex][2]; run(); });
  ref.textContent = EX[0][1]; hyp.value = EX[0][2];
  hyp.addEventListener('input', run); nb.addEventListener('change', run);
  run();
});

/* ---------- clean-up chain: raw tokens to a usable transcript ---------- */
safe('post-processing demo', function () {
  const s = document.getElementById('post'); if (!s) return;
  const S = [
    ['Raw model output', 'hi im calling about my claim number four seven two nine i spoke to sarah at north wind last tuesday my card ends in five five one two'],
    ['Punctuation and capitals', 'Hi, <u>I\'m</u> calling about my claim, number four seven two nine. I spoke to <u>Sarah</u> at <u>North Wind</u> last <u>Tuesday</u>. My card ends in five five one two.'],
    ['Numbers, dates and money (inverse text normalisation)', "Hi, I'm calling about my claim, number <u>4729</u>. I spoke to Sarah at North Wind last Tuesday. My card ends in <u>5512</u>."],
    ['Custom vocabulary', "Hi, I'm calling about my claim, number 4729. I spoke to Sarah at <u>Northwind</u> last Tuesday. My card ends in 5512."],
    ['Redaction of personal data', "Hi, I'm calling about my claim, number 4729. I spoke to <u>[NAME]</u> at Northwind last Tuesday. My card ends in <u>[CARD]</u>."],
    ['Speakers and timestamps', "<span class=\"stamp\">00:00:03 · Caller</span> Hi, I'm calling about my claim, number 4729. I spoke to [NAME] at Northwind last Tuesday. My card ends in [CARD]."],
  ];
  const host = document.getElementById('post-rows');
  host.innerHTML = S.map(([l, t], i) => `<div class="pr" ${i ? `data-step="${i}"` : ''}><span class="label">${String(i).padStart(2, '0')} · ${l}</span><div class="tx ${i ? '' : 'raw'}">${t}</div></div>`).join('');
  s.addEventListener('slide:step', e => host.querySelectorAll('.pr').forEach((r, i) => r.classList.toggle('cur', i === e.detail.step)));
});

/* ---------- turn detection: when has the caller finished? ---------- */
safe('turn detection demo', function () {
  const s = document.getElementById('turns'); if (!s) return;
  const T = 6; // seconds shown
  const SPEECH = [[0.2, 1.5, 'My account number is'], [1.6, 2.6, 'four seven two…'], [3.4, 4.1, '…nine one.']];
  const PAUSE = [2.6, 3.4];
  const ST = [
    ['short', 'Silence timeout, 500 ms', 'Fires 500 ms into the caller\'s pause to think. The agent talks over the caller, who then has to repeat the number.', 3.1, true],
    ['long', 'Silence timeout, 1,200 ms', 'Waits out the pause, but also waits 1.2 seconds after the caller really finishes. The line feels dead.', 5.3, false],
    ['semantic', 'Model-based turn detection', 'A model reads the words and the intonation. "Four seven two…" sounds unfinished, so it waits; "…nine one." sounds complete, so it fires after about 200 ms.', 4.3, false],
  ];
  const lanes = document.getElementById('tn-lanes'), note = document.getElementById('tn-note');
  const pc = t => (t / T * 100) + '%';
  const axis = Array.from({ length: T + 1 }, (_, i) => `<span style="left:${pc(i)}">${i} s</span>`).join('');
  function run(k) {
    const [, label, why, fire, cut] = ST.find(x => x[0] === k);
    const end = SPEECH[SPEECH.length - 1][1];
    lanes.innerHTML = `
      <div class="ln"><span class="label">Caller</span><div class="trk">${SPEECH.map(([a, b, t]) => `<i class="said" style="left:${pc(a)};width:${pc(b - a)}">${t}</i>`).join('')}
        <i class="gap" style="left:${pc(PAUSE[0])};width:${pc(PAUSE[1] - PAUSE[0])}">pause 800 ms</i></div></div>
      <div class="ln"><span class="label">Turn decision</span><div class="trk"><i class="fire ${cut ? 'bad' : ''}" style="left:${pc(fire)}"><b>${cut ? 'Turn ended (wrongly)' : 'Turn ended'}</b></i>
        ${!cut ? `<i class="wait" style="left:${pc(end)};width:${pc(fire - end)}">${Math.round((fire - end) * 1000)} ms</i>` : ''}</div></div>
      <div class="ln"><span class="label">Agent</span><div class="trk"><i class="ag ${cut ? 'bad' : ''}" style="left:${pc(fire + .5)};width:${pc(Math.min(T - fire - .5, 1.6))}">${cut ? 'Sorry, was that 472?' : 'Thanks, that’s 47291.'}</i></div></div>
      <div class="ax">${axis}</div>`;
    note.innerHTML = `<b>${label}.</b> ${why}`;
  }
  radios(document.getElementById('tn-tabs'), ST.map(x => [x[0], x[1]]), 'short', run);
  run('short');
});

/* ---------- diarisation error: who spoke when ---------- */
safe('diarisation demo', function () {
  const s = document.getElementById('der'); if (!s) return;
  const T = 10, C = { A: '#1a2fd0', B: '#e5892a', C: '#2c9a58' };
  const REF = [['A', 0.0, 3.0], ['B', 2.5, 5.4], ['A', 5.8, 7.0], ['C', 7.2, 9.0]];
  const HYP = [['A', 0.0, 2.9], ['B', 2.9, 5.4], ['B', 5.8, 7.0], ['C', 7.2, 9.0], ['C', 9.3, 9.8]];
  const NOISE = [9.3, 9.8];
  // score on a 10 ms grid: per tick, count reference speakers, hypothesis speakers and correct matches
  let refT = 0, miss = 0, fa = 0, conf = 0;
  const err = [];
  for (let k = 0; k < T * 100; k++) {
    const t = (k + .5) / 100;
    const r = REF.filter(([, a, b]) => t >= a && t < b).map(x => x[0]), h = HYP.filter(([, a, b]) => t >= a && t < b).map(x => x[0]);
    const ok = r.filter(x => h.includes(x)).length;
    refT += r.length; const mi = Math.max(0, r.length - h.length), f = Math.max(0, h.length - r.length), c = Math.min(r.length, h.length) - ok;
    miss += mi; fa += f; conf += c;
    err.push(mi ? 'miss' : f ? 'fa' : c ? 'conf' : '');
  }
  const runs = []; err.forEach((e, k) => { if (e && (!runs.length || runs[runs.length - 1][0] !== e || runs[runs.length - 1][2] !== k)) runs.push([e, k, k + 1]); else if (e) runs[runs.length - 1][2] = k + 1; });
  const pc = t => t / T * 100 + '%';
  const seg = list => list.map(([sp, a, b]) => `<i style="left:${pc(a)};width:${pc(b - a)};background:${C[sp]}">${sp}</i>`).join('');
  const lane = (sp, list) => `<div class="trk">${seg(list.filter(x => x[0] === sp))}</div>`;
  document.getElementById('der-ref').innerHTML = ['A', 'B', 'C'].map(sp => lane(sp, REF)).join('') + `<div class="trk"><i class="noise" style="left:${pc(NOISE[0])};width:${pc(NOISE[1] - NOISE[0])}">door</i></div>`;
  document.getElementById('der-hyp').innerHTML = ['A', 'B', 'C'].map(sp => lane(sp, HYP)).join('');
  const lab = { miss: 'Missed speech', fa: 'False alarm', conf: 'Speaker confusion' };
  document.getElementById('der-err').innerHTML = runs.map(([e, a, b]) => `<i class="${e}" style="left:${a / T}%;width:${(b - a) / T}%"></i>`).join('');
  const p = v => (v / refT * 100).toFixed(1) + '%';
  document.getElementById('der-res').innerHTML = `
    <div data-step="3"><span class="label">${lab.miss}</span><b class="miss">${p(miss)}</b><small>B starts while A is still talking; the overlap is missed</small></div>
    <div data-step="4"><span class="label">${lab.fa}</span><b class="fa">${p(fa)}</b><small>A door closing is labelled as speaker C</small></div>
    <div data-step="5"><span class="label">${lab.conf}</span><b class="conf">${p(conf)}</b><small>A's second turn is given to B</small></div>
    <div data-step="6" class="tot"><span class="label">Diarisation error rate</span><b>${p(miss + fa + conf)}</b><small>of ${(refT / 100).toFixed(1)} s of reference speech</small></div>`;
  document.getElementById('der-axis').innerHTML = Array.from({ length: T + 1 }, (_, i) => `<span style="left:${pc(i)}">${i} s</span>`).join('');
  s.addEventListener('slide:step', e => s.querySelectorAll('#der-err i').forEach(i => i.classList.toggle('show', (i.classList.contains('miss') && e.detail.step >= 3) || (i.classList.contains('fa') && e.detail.step >= 4) || (i.classList.contains('conf') && e.detail.step >= 5))));
});

/* ---------- voice agent latency budget: published budgets on one scale ---------- */
safe('latency budget', function () {
  const s = document.getElementById('budget'); if (!s) return;
  const K = { in: ['Audio in', '#8b8f99', 'Microphone, encoding, network and jitter buffer'], turn: ['End of turn and final transcript', '#7b4fd6', 'Deciding the caller has finished, then the final text'],
    hop: ['Hops between services', '#cfd2d9', 'Orchestration, session data, service-to-service calls'], llm: ['LLM first token', '#d64f97', 'Time for the language model to start its reply'],
    tts: ['TTS first audio', '#d9a90f', 'Time for text to speech to produce the first sound'], s2s: ['Speech-to-speech model', '#12909a', 'One model listens and speaks: time to first audio'], out: ['Audio out', '#5b5f6a', 'Network, jitter buffer, decoding and speaker'] };
  const P = [
    ['Silence timeout', 'A typical cascade that waits for 800 ms of silence before treating the turn as over.', [['in', 114], ['turn', 900], ['llm', 670], ['tts', 120], ['out', 89]], 'Pipecat primer budget with its 800 ms VAD default in place of a turn model (our adaptation).'],
    ['Typical cascade', 'Pipecat\'s "fairly typical" WebRTC agent, with model-based turn detection.', [['in', 114], ['turn', 300], ['llm', 670], ['tts', 120], ['out', 89]], 'Voice AI & Voice Agents primer (Daily / Pipecat), 2026. LLM includes 20 ms sentence buffering.'],
    ['Twilio targets', 'Twilio\'s median targets for launching a cascaded agent, measured mouth to ear.', [['in', 125], ['turn', 350], ['hop', 40], ['llm', 375], ['tts', 100], ['out', 125]], 'Twilio, "Core latency in AI voice agents", Nov 2025. Upper limit 1,400 ms.'],
    ['Best parts today', 'A cascade built from the fastest published components, in one region.', [['in', 115], ['turn', 250], ['llm', 370], ['tts', 120], ['out', 90]], 'Our sum of best published figures: Smart Turn and Flux (~250 ms), Twilio LLM target, primer audio legs. Not one measured system.'],
    ['Speech-to-speech', 'One model that hears and speaks, such as GPT-Realtime-1.5, plus the parts its benchmark leaves out.', [['in', 115], ['turn', 250], ['s2s', 810], ['out', 90]], 'Artificial Analysis time to first audio (0.81 s, Nov 2026), plus turn detection and audio legs from the primer (our sum).'],
  ];
  const MAX = 2100, pc = v => v / MAX * 100 + '%';
  const bar = document.getElementById('bg-bar'), list = document.getElementById('bg-list'), tot = document.getElementById('bg-total'), why = document.getElementById('bg-why');
  document.getElementById('bg-marks').innerHTML =
    `<i class="mk" style="left:${pc(208)}"><b>Human reply gap, ~200 ms</b></i><i class="mk t" style="left:${pc(1115)}"><b>Twilio target 1,115 ms</b></i>` +
    `<i class="band" style="left:${pc(1400)};width:${pc(300)}"><b>Typical production median 1.4–1.7 s</b></i>`;
  document.getElementById('bg-axis').innerHTML = [0, 500, 1000, 1500, 2000].map(v => `<span style="left:${pc(v)}">${v.toLocaleString()} ms</span>`).join('');
  function run(i) {
    const [, desc, parts, src] = P[+i];
    let x = 0;
    bar.innerHTML = parts.map(([k, v]) => { const h = `<i style="left:${pc(x)};width:${pc(v)};background:${K[k][1]}" title="${K[k][0]}: ${v} ms">${v >= 180 ? v : ''}</i>`; x += v; return h; }).join('');
    tot.textContent = x.toLocaleString() + ' ms';
    why.innerHTML = `${desc}<span class="src" style="display:block;margin-top:6px">${src}</span>`;
    list.innerHTML = parts.map(([k, v]) => `<div><i style="background:${K[k][1]}"></i><span><b>${K[k][0]}</b>${K[k][2]}</span><em>${v} ms</em></div>`).join('');
  }
  radios(document.getElementById('bg-tabs'), P.map((p, i) => [String(i), p[0]]), '0', run);
  run(0);
});

const fmt$ = v => v == null ? '–' : v < 10 ? '$' + v.toFixed(2) : '$' + Math.round(v).toLocaleString();
const fmtBig = v => v >= 1e6 ? '$' + (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + 'm' : v >= 1e3 ? '$' + Math.round(v / 1e3) + 'k' : '$' + Math.round(v);

/* ---------- where each option can run (shared by the player map and the charts) ---------- */
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
  const grid = document.getElementById('pl-grid'); if (!grid || !window.SX || !SX.columns) return;
  const slide = grid.closest('.slide');
  const tags = d => [d.hosted.length && '<i style="background:var(--blue)"></i>', (d.weights || d.private) && '<i style="background:var(--green)"></i>', d.saas && !d.hosted.length && '<i style="background:var(--orange)"></i>'].filter(Boolean).join('');
  grid.innerHTML = SX.columns.map(c => `<div class="pl-col" style="--c:${c.color}"><h4>${c.label}<small>${c.unit}</small></h4>` + c.items.map(p =>
    `<div class="pl" tabindex="0" data-id="${p.id}"><span>${p.name}${p.verified ? '' : '<span class="unv" title="Price or detail not confirmed on the vendor page">*</span>'}<span class="tags">${tags(p.deploy)}</span></span><span class="pr">${p.price}</span></div>`).join('') + '</div>').join('');
  grid.insertAdjacentHTML('afterend', `<div class="pl-legend"><span><i style="background:var(--blue)"></i>Runs on Azure, AWS or Google Cloud infrastructure</span><span><i style="background:var(--green)"></i>Self-host or private deployment</span><span><i style="background:var(--orange)"></i>Run by the vendor</span><span style="margin-left:auto">* not fully confirmed · hover or tab for details</span></div>`);
  const tip = document.createElement('div'); tip.className = 'pl-tip'; tip.setAttribute('role', 'status'); slide.appendChild(tip);
  const all = SX.columns.flatMap(c => c.items);
  const show = el => {
    const p = all.find(x => x.id === el.dataset.id);
    tip.innerHTML = `<b>${esc(p.name)}</b>${esc(p.notes)}${p.langs ? `<span class="k">Languages</span>${esc(p.langs)}` : ''}<span class="k">Speaker labels</span>${esc(p.dia)}<span class="k">Where it runs</span>${esc(whereText(p.deploy))}${p.data ? `<span class="k">Data handling</span>${esc(p.data)}` : ''}${p.basis ? `<span class="k">Price basis</span>${esc(p.basis)}` : ''}`;
    const r = el.getBoundingClientRect(), sr = slide.getBoundingClientRect(), sc = sr.width / 1440;
    let x = (r.right - sr.left) / sc + 8, y = (r.top - sr.top) / sc - 10;
    if (x > 1060) x = (r.left - sr.left) / sc - 350;
    tip.style.left = x + 'px'; tip.style.top = Math.min(y, 420) + 'px'; tip.style.display = 'block';
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

/* ---------- price ladder: batch and live on one log scale ---------- */
const FAMC = { cloud: '#1a2fd0', lab: '#7b4fd6', spec: '#e5892a', open: '#2c9a58', s2s: '#12909a' };
const FAML = { cloud: 'Cloud speech service', lab: 'AI lab model', spec: 'Specialist provider', open: 'Open model', s2s: 'Speech-to-speech' };
safe('price ladder', function () {
  const el = document.getElementById('ladder-chart'); if (!el || !window.SX) return;
  if (!window.d3) { el.innerHTML = '<div class="viz-missing">This chart needs the D3 library, which did not load. Prices are listed in research pack B.</div>'; return; }
  el.classList.add('lad');
  const data = SX.ladder.map((d, i) => ({ ...d, id: 'l' + i })).sort((a, b) => (a.batch ?? a.live) - (b.batch ?? b.live));
  const W = 1248, H = 590, m = { l: 20, r: 20, t: 10, b: 30 };
  const x = d3.scaleLog().domain([0.0007, 8]).range([m.l, W - m.r]);
  const y = d3.scaleBand().domain(data.map(d => d.id)).range([m.t, H - m.b]).padding(0.2);
  const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Batch and live price per audio hour, log scale');
  const ax = svg.append('g').attr('class', 'ax').attr('transform', `translate(0,${H - m.b})`)
    .call(d3.axisBottom(x).tickValues([0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3]).tickFormat(v => '$' + (v < 0.1 ? v : v.toFixed(v < 1 ? 1 : 0))).tickSize(-(H - m.t - m.b)));
  ax.selectAll('line').attr('stroke', '#eceef2'); ax.select('.domain').remove();
  const row = svg.append('g').selectAll('g').data(data).join('g').attr('transform', d => `translate(0,${y(d.id) + y.bandwidth() / 2})`);
  row.filter(d => d.batch != null && d.live != null && d.batch !== d.live).append('line').attr('x1', d => x(d.batch)).attr('x2', d => x(d.live)).attr('stroke', d => FAMC[d.fam]).attr('stroke-opacity', .35).attr('stroke-width', 3);
  row.filter(d => d.batch != null).append('circle').attr('cx', d => x(d.batch)).attr('r', 6).attr('fill', d => FAMC[d.fam]).append('title').text(d => `${d.name}: batch ${fmt$(d.batch)} an hour`);
  row.filter(d => d.live != null).append('circle').attr('cx', d => x(d.live)).attr('r', 6).attr('fill', '#fff').attr('stroke', d => FAMC[d.fam]).attr('stroke-width', 2.5).append('title').text(d => `${d.name}: live ${fmt$(d.live)} an hour`);
  const right = d => x(Math.max(d.batch ?? 0, d.live ?? 0)), left = d => x(Math.min(d.batch ?? 9, d.live ?? 9)), flip = d => right(d) > 860;
  row.append('text').attr('x', d => flip(d) ? left(d) - 12 : right(d) + 12).attr('text-anchor', d => flip(d) ? 'end' : 'start').attr('dy', '0.35em')
    .text(d => `${d.name}  ${d.batch != null ? fmt$(d.batch) : '–'} / ${d.live != null ? fmt$(d.live) : '–'}`);
  const lg = d3.select(el).append('div').attr('class', 'pl-legend');
  Object.keys(FAMC).forEach(k => lg.append('span').html(`<i style="background:${FAMC[k]}"></i>${FAML[k]}`));
  lg.append('span').style('margin-left', 'auto').html('<i style="background:#5b5f6a"></i>Batch &nbsp; <i style="background:#fff;border:2px solid #5b5f6a"></i>Live');
});

/* ---------- contact-centre cost calculator ---------- */
safe('cost calculator', function () {
  const host = document.getElementById('cc-chart'); if (!host || !window.SX) return;
  const $ = id => document.getElementById(id);
  const ag = $('cc-agents'), hr = $('cc-hours'), lv = $('cc-live'), ch = $('cc-ch'), di = $('cc-dia');
  function run() {
    const agents = Math.round(10 ** +ag.value / 10) * 10 || 10, h = +hr.value, live = +lv.value / 100, chans = ch.checked ? 2 : 1, wantDia = di.checked && chans === 1;
    di.disabled = chans === 2; di.closest('.calc-row').style.opacity = chans === 2 ? .45 : 1;
    const hours = agents * h * 250 * chans;
    $('cc-agents-v').textContent = agents.toLocaleString(); $('cc-hours-v').textContent = h; $('cc-live-v').textContent = Math.round(live * 100) + '%';
    $('cc-ch-v').textContent = chans === 2 ? '×2 hours' : '';
    $('cc-total').textContent = hours >= 1e6 ? (hours / 1e6).toFixed(1) + 'm' : Math.round(hours / 1e3) + 'k';
    const rows = SX.calc.map(o => {
      const [db, dl, eb, el] = o.dia;
      const cost = hours * ((1 - live) * (o.batch + (wantDia ? eb : 0)) + live * (o.live + (wantDia ? el : 0)));
      const gap = wantDia && ((live > 0 && !dl) || (live < 1 && !db));
      return { ...o, cost, gap };
    }).sort((a, b) => a.cost - b.cost);
    const max = Math.max(...rows.map(r => r.cost));
    host.innerHTML = `<span class="label">Annual cost at list price</span>` + rows.map(r => `<div class="ccr ${r.gap ? 'gap' : ''}"><span>${r.name}${r.cloud ? `<small>${r.cloud === 'any' ? 'any cloud, plus engineering' : 'runs in ' + r.cloud}</small>` : ''}</span><i style="width:${Math.max(.4, r.cost / max * 100)}%"></i><b>${fmtBig(r.cost)}</b></div>`).join('') +
      (wantDia ? '<p class="src" style="margin-top:8px">Hatched: no speaker labels in the mode you need. Add-on prices included where charged.</p>' : '');
  }
  [ag, hr, lv, ch, di].forEach(e => e.addEventListener('input', run));
  run();
});

/* ---------- error rates by language: heatmap ---------- */
safe('language heatmap', function () {
  const el = document.getElementById('lang-heat'); if (!el || !window.SX || !SX.langs) return;
  const C = [['best', 'Best of 7, 2026'], ['gpt', 'OpenAI GPT-Transcribe'], ['v3', 'Whisper large-v3'], ['v2', 'Whisper large-v2, 2022']];
  const shade = v => { // green under 5%, amber to 10%, red above
    if (v == null) return ['#f3f4f6', '#8b8f99'];
    const t = Math.min(1, Math.log(v / 1.5) / Math.log(40 / 1.5));
    const hue = 140 - t * 140;
    return [`hsl(${hue} 60% ${92 - t * 30}%)`, t > .7 ? '#fff' : '#2f323a'];
  };
  el.innerHTML = `<div class="lh"><div class="lh-h"><span></span>${C.map(c => `<span>${c[1]}</span>`).join('')}</div>` + SX.langs.map(r =>
    `<div class="lh-r"><span>${r.lang}${r.metric === 'CER' ? ' <small>CER</small>' : ''}</span>` + C.map(([k]) => {
      const v = r[k], [bg, fg] = shade(v);
      return `<i style="background:${bg};color:${fg}" title="${r.lang}, ${C.find(c => c[0] === k)[1]}: ${v == null ? 'not tested' : v + '%'}${k === 'best' ? ' (' + r.who + ')' : ''}">${v == null ? '–' : v}</i>`;
    }).join('') + '</div>').join('') + '</div>';
});

/* ---------- Pareto frontier slides: one board per view ---------- */
safe('frontier charts', function () {
  if (!window.SX || !SX.pareto || !window.ParetoChart) return;
  const TYPE = { cloud: { label: 'Cloud speech service', color: '#1a2fd0' }, lab: { label: 'AI lab model', color: '#7b4fd6' }, spec: { label: 'Specialist provider', color: '#e5892a' }, open: { label: 'Open weights, hosted', color: '#2c9a58' } };
  const OPEN = { nvidia: { label: 'NVIDIA', color: '#2c9a58' }, whisper: { label: 'OpenAI Whisper', color: '#12909a' }, qwen: { label: 'Alibaba Qwen', color: '#7b4fd6' }, ibm: { label: 'IBM Granite', color: '#1a2fd0' }, mistral: { label: 'Mistral Voxtral', color: '#e5892a' }, other: { label: 'Other', color: '#8b8f99' } };
  const per$ = v => '$' + (v >= 1 ? v.toFixed(2) : v >= 0.01 ? v.toFixed(3).replace(/0$/, '') : v.toPrecision(2));
  const tick$ = v => { const m = v / 10 ** Math.floor(Math.log10(v) + 1e-9); return [1, 2, 5].some(k => Math.abs(m - k) < 1e-6) ? '$' + (v < 1 ? d3.format('.2~')(v) : d3.format(',~')(v)) : ''; };
  const X = {
    price: { xLabel: 'List price per audio hour (log scale) →', xName: 'Price per audio hour', xFmt: per$, xTick: tick$ },
    gpu: { xLabel: 'GPU cost per 1,000 audio hours at full load, our estimate (log scale) →', xName: 'GPU cost per 1,000 audio hours', xFmt: per$, xTick: tick$ },
    ms: { xLabel: 'Time to final transcript, ms (log scale) →', xName: 'Time to final', xFmt: v => Math.round(v).toLocaleString() + ' ms', xTick: v => d3.format(',')(v) },
  };
  function mount(slideId, key, fams, filters, xKind) {
    const slide = document.getElementById(slideId); if (!slide) return;
    const views = SX.pareto[key].views, tabs = slide.querySelector('.pf-tabs'), host = slide.querySelector('.pf-chart');
    const state = { filter: 'all', multiOnly: false };
    let chart;
    const render = i => {
      host.innerHTML = '';
      const div = document.createElement('div'); div.id = `${slideId}-c${i}`; host.appendChild(div);
      const v = views[i], xk = v.x || xKind;
      const ys = v.points.map(p => p.score).sort((a, b) => a - b);
      const top = v.yMax || Math.min(ys[ys.length - 1], ys[Math.floor(ys.length * .92)] * 1.15);
      chart = ParetoChart(div, {
        points: v.points, families: fams, filters, noHollow: true, state, declutter: true, lowerIsBetter: true, tolerance: 0.25,
        yDomain: [Math.ceil(top) + .5, Math.max(0, Math.floor(ys[0]) - .5)], yLabel: v.metric, width: 1240, height: 470, ...X[xk],
      });
      tabs.querySelectorAll('.bt').forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', j === i); });
      tabs.querySelector('.lbl.m').textContent = v.method;
    };
    tabs.innerHTML = '<span class="lbl">View</span>' + views.map(v => `<button type="button" class="bt">${v.label}</button>`).join('') + '<span class="lbl m" style="margin-left:auto"></span>';
    tabs.querySelectorAll('.bt').forEach((b, i) => b.addEventListener('click', () => render(i)));
    render(0);
    slide.addEventListener('slide:enter', () => chart && chart.replay());
  }
  mount('pf-batch', 'batch', TYPE, HOST_FILTERS, 'price');
  mount('pf-live', 'live', TYPE, HOST_FILTERS, 'price');
  mount('pf-open', 'open', OPEN, HOST_FILTERS.slice(0, 1), 'gpu');
});

/* ---------- decision guide ---------- */
safe('decision guide', function () {
  const qs = document.getElementById('g-qs'), out = document.getElementById('g-out'); if (!qs) return;
  const Q = [
    ['when', 'When must the text arrive?', [['batch', 'After the recording'], ['assist', 'Within a few seconds'], ['agent', 'Mid-conversation (voice agent)']]],
    ['audio', 'What is the audio?', [['phone2', 'Calls, one channel per speaker'], ['phone1', 'Calls, one mixed channel'], ['meeting', 'Meetings or rooms'], ['media', 'Interviews or media']]],
    ['speakers', 'Are speaker labels needed?', [['no', 'No'], ['yes', 'Yes']]],
    ['lang', 'Which languages?', [['en', 'English'], ['eu', 'Major European'], ['major', 'Other major languages'], ['mixed', 'Mixed in one call'], ['tail', 'Less common languages']]],
    ['where', 'Where may the audio be processed?', [['any', 'Approved providers anywhere'], ['azure', 'Azure only'], ['aws', 'AWS only'], ['gcp', 'Google Cloud only'], ['self', 'Own environment only']]],
    ['vocab', 'Specialist vocabulary?', [['general', 'General'], ['medical', 'Medical'], ['jargon', 'Names, products, jargon']]],
  ];
  const A = { when: 'assist', audio: 'phone2', speakers: 'yes', lang: 'en', where: 'any', vocab: 'general' };
  qs.innerHTML = Q.map(([k, q, os]) => `<div class="g-q" data-k="${k}" role="radiogroup" aria-label="${q}"><span class="label">${q}</span><div class="opts">${os.map(([v, l]) => `<button type="button" role="radio" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
  qs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; A[b.closest('.g-q').dataset.k] = b.dataset.v; run(); });

  function pick(a) {
    const r = { start: '', why: '', test: [], cost: '', watch: [] };
    const W = a.where, mode = a.when, needDia = a.speakers === 'yes' && a.audio !== 'phone2' && mode !== 'agent';
    const S = {
      any: {
        batch: needDia ? ['AssemblyAI Universal-3.5 Pro or ElevenLabs Scribe v2, both with speaker labels included', 'A dedicated diarisation model alongside: NVIDIA Nemotron 3 Diarization (open) or pyannoteAI Precision-3', '$0.21–0.22 an hour']
          : ['Microsoft MAI-Transcribe-2 (Azure, preview) or ElevenLabs Scribe v2', 'Soniox v5 ($0.10 an hour), on the price frontier', 'About $0.10–0.22 an hour'],
        assist: needDia ? ['Speechmatics Melia or Soniox v5, with live speaker labels included', 'AssemblyAI Universal-3.6 Pro Realtime (live speaker labels in beta, +$0.12 an hour)', '$0.12–0.57 an hour']
          : ['ElevenLabs Scribe v2 Realtime or AssemblyAI Universal-3.6 Pro Realtime', 'Speechmatics Melia ($0.20) or Soniox v5 ($0.12)', '$0.39–0.45 an hour'],
        agent: ['Deepgram Flux (turn detection in the model) or AssemblyAI Universal-3.6 Pro Realtime', 'ElevenLabs Scribe v2 Realtime with Pipecat Smart Turn, or MAI-Transcribe-2 Streaming', 'About $0.39–0.46 an hour for transcription, plus the language model and speech synthesis'],
      },
      azure: {
        batch: ['Microsoft MAI-Transcribe-2 (preview), or Azure Speech batch for a generally available service', 'OpenAI GPT-Transcribe in Azure ($0.27, no speaker labels)', '$0.10–0.54 an hour (MAI promotion ends 31 Dec 2026); Azure Speech batch $0.18'],
        assist: ['Azure Speech real-time' + (needDia ? ' with live speaker labels (+$0.30 an hour)' : ''), 'MAI-Transcribe-2 Streaming (preview) or GPT-Live-Transcribe in Azure (no speaker labels)', needDia ? '$1.30 an hour at list price; $0.40–0.80 with commitment tiers' : '$1.00 an hour at list price; $0.40–0.80 with commitment tiers'],
        agent: ['MAI-Transcribe-2 Streaming (preview, top of the independent live board), or Azure Speech real-time', 'GPT-Live-Transcribe in Azure, or Azure Voice Live for a full speech-to-speech pipeline', '$0.54–1.02 an hour for transcription'],
      },
      aws: {
        batch: ['Amazon Transcribe' + (a.audio.startsWith('phone') ? ', or Transcribe Call Analytics for summaries and sentiment' : ''), 'Voxtral or Whisper on SageMaker in the client\'s account', '$0.36 an hour (Call Analytics $1.80)'],
        assist: ['Amazon Transcribe streaming, with partial-result stabilisation on', 'Voxtral Realtime on SageMaker, or Deepgram\'s SageMaker package', '$0.60 an hour'],
        agent: ['Deepgram\'s SageMaker package (Nova-3 or Flux) in the client\'s account', 'Amazon Transcribe streaming (slower: about 1.1 s median to final on Pipecat), or Nova 2.5 Sonic speech-to-speech', 'Deepgram by contract; Transcribe $0.60 an hour'],
      },
      gcp: {
        batch: ['Gemini 3.5 Transcribe on Vertex AI' + (needDia ? ' (speaker labels for up to 8 speakers)' : ''), 'Chirp 3' + (needDia ? ' (batch speaker labels in 14 locales)' : ''), '$0.31 an hour; Chirp 3 $0.96 ($0.18 for slow dynamic batch)'],
        assist: ['Gemini 3.5 Transcribe Live on Vertex AI', 'Chirp 3 streaming (about 1.2 s to final on Artificial Analysis)', '$0.54 an hour'],
        agent: ['Gemini 3.5 Transcribe Live on Vertex AI', 'Gemini 3.8 Live as a speech-to-speech alternative', '$0.54 an hour for transcription'],
      },
      self: {
        batch: [needDia ? 'NVIDIA Nemotron 3.5 Transcribe (open, speaker-attributed, 40 languages)' : 'NVIDIA Parakeet TDT 0.6B v3 for European languages, or Nemotron 3.5 Transcribe for accuracy', 'Whisper large-v3 turbo for language breadth; commercial containers (Deepgram, Speechmatics, Azure Speech)', 'Under 1 cent an hour in GPU time at full load, plus engineering'],
        assist: ['NVIDIA Nemotron 3.5 ASR Streaming' + (needDia ? ' with Streaming Sortformer (up to 4 speakers)' : ''), 'Self-hosted containers from Deepgram, Speechmatics or AssemblyAI', 'About $0.02–0.05 an hour in GPU time with headroom, plus engineering'],
        agent: ['NVIDIA Nemotron 3.5 ASR Streaming with Pipecat Smart Turn, all models on one GPU cluster', 'Deepgram or Speechmatics self-hosted containers', 'About $0.02–0.05 an hour in GPU time with headroom, plus engineering'],
      },
    }[W][mode];
    [r.start, , r.cost] = S; r.test.push(S[1]);
    r.why = {
      batch: 'On the independent board, recorded English reaches about 2% error for about 10 cents an hour, and higher prices buy no extra accuracy.',
      assist: 'The best live models are within about half a point of batch accuracy. For captions and agent assist, stable partial results and correct speakers matter more than milliseconds.',
      agent: 'The best models give a final transcript in 100–300 ms. Deciding when the caller has finished is the bigger delay: use model-based turn detection, not a silence timeout.',
    }[mode];
    if (mode !== 'batch') r.test.push('Re-transcribing the recording in batch afterwards for the record: cheaper and more accurate');
    // audio and speakers
    if (a.audio === 'phone2') r.watch.push('Transcribe each channel separately: speaker labels come for free, and no voiceprints are created. Most providers bill each channel.');
    if (a.audio === 'phone1' && a.speakers === 'yes') r.watch.push('One-channel calls need diarisation (about 7% error on two-person calls). Ask whether the platform can record two channels instead.');
    if (a.audio === 'meeting' && a.speakers === 'yes') r.watch.push('From one room microphone, expect 40–55% diarisation error in busy meetings. Capture a stream per participant through a meeting bot where possible.');
    if (a.audio.startsWith('phone')) r.watch.push('Phone audio is 8 kHz: test on the client\'s real call recordings, not on clean samples.');
    if (needDia && mode !== 'batch' && ['gcp'].includes(W)) r.watch.push('Google\'s live services return no speaker labels. Use two-channel audio, or label speakers in a batch pass afterwards.');
    if (needDia && W === 'azure' && mode === 'batch') r.watch.push('OpenAI\'s models in Azure return no speaker labels; MAI-Transcribe-2 labels mono audio only.');
    // languages
    if (a.lang === 'eu' && mode === 'agent' && W === 'any') r.watch.push('Deepgram Flux covers English and 10 other languages; AssemblyAI\'s live model 32. Check each language in live mode.');
    if (a.lang === 'major') r.watch.push('Quality varies most here: Arabic is about 9% error at best, Swahili 9–20%, Hindi 4–6%. Test each language, and consider a regional specialist (Sarvam for India, Cohere Transcribe Arabic).');
    if (a.lang === 'mixed') r.watch.push('Mixed-language speech is widely claimed and rarely measured. Give the expected languages, and include mixed-language calls in the test. Speechmatics Melia, Soniox and Deepgram Nova-3 multilingual handle switching without a language choice.');
    if (a.lang === 'tail') { r.test.push('Meta Omnilingual ASR (open, 1,600+ languages) where commercial services do not cover the language'); r.watch.push('Only 36% of low-resource languages reach a character error rate under 10% even in Omnilingual. Check the live language list separately.'); }
    if ((a.lang === 'major' || a.lang === 'tail') && W === 'any' && mode === 'batch') r.watch.push('OpenAI GPT-Transcribe trails the leaders outside Western Europe (Swahili 19.8% against 9.2%).');
    // vocabulary
    if (a.vocab === 'medical') { r.test.push('Gemini 3 Pro, which had the lowest medical-term error on PriMock57 (1.4%)'); r.watch.push('Keep the audio, check for text invented in pauses, and sign a HIPAA or equivalent agreement. Specialist "medical" models did not beat general frontier models on PriMock57.'); }
    if (a.vocab === 'jargon') r.watch.push('Use custom vocabulary or a prompt with names and products, and test for false positives: too strong a bias makes the model hear terms that were not said.');
    if (mode === 'agent') r.watch.push('Measure interruptions, dead air and the slowest 5% of replies on real calls. A phone line adds a few hundred milliseconds you cannot tune away.');
    if (W === 'any') r.watch.push('Audio goes to the provider. Check region, retention and whether audio is used for training; some self-serve plans train on it by default.');
    return r;
  }
  function run() {
    qs.querySelectorAll('.g-q').forEach(q => q.querySelectorAll('button').forEach(b => { const on = A[q.dataset.k] === b.dataset.v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }));
    const r = pick(A);
    out.innerHTML = `<h4>Start with</h4><div class="pick">${r.start}</div><div class="why">${r.why}</div>
      <h4>Test it against</h4><ul>${r.test.map(t => `<li>${t}</li>`).join('')}</ul>
      <h4>Rough cost (list price)</h4><div class="why" style="color:var(--ink-2)">${r.cost}</div>
      ${r.watch.length ? `<h4>Watch out for</h4><ul>${r.watch.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      <p class="src" style="margin-top:12px">Picks dated 3 Nov 2026. A starting point for a test on the client's audio, not a final answer.</p>`;
  }
  window.__guidePick = pick; // used by the automated combination checks
  run();
});
