// IT'S PROBABLY FINE — minimal VN engine
const S = {node:'start', flags:{}, typing:null, hist:[], started:false, pending:'', sound:true};
const $ = id => document.getElementById(id);

/* ---------- ending collection (persisted) ---------- */
const ENDINGS = Object.entries(SCRIPT).filter(([,n]) => n.ending).map(([id,n]) => ({
  id, label: (n.text.split('\n')[0] || '').replace(/^ENDING:\s*/,'').replace(/\.$/,'')
}));
const SAVE = 'ipf.endings';
function found(){ try { return new Set(JSON.parse(localStorage.getItem(SAVE) || '[]')); } catch { return new Set(); } }
function mark(id){ const f = found(); f.add(id); try { localStorage.setItem(SAVE, JSON.stringify([...f])); } catch {} }
function renderCollection(){
  const f = found(), el = $('collection');
  if (!el) return;
  el.innerHTML = `<div class="coll-head">${f.size} / ${ENDINGS.length} endings found</div>` +
    ENDINGS.map(e => `<div class="coll-row ${f.has(e.id)?'got':''}">${f.has(e.id) ? e.label : '— — —'}</div>`).join('');
}

/* ---------- sound: synthesised, no assets ---------- */
let AC = null;
function blip(freq, dur, type, gain){
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.02, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + dur);
  } catch {}
}

/* ---------- presentation ---------- */
function setBg(name){
  const el = $('bg');
  const url = name ? `assets/bg-${name}.png` : '';
  if (el.dataset.cur === url) return;
  el.dataset.cur = url;
  el.classList.add('fading');
  setTimeout(() => {
    el.style.backgroundImage = url ? `url(${url})` : 'none';
    el.classList.remove('fading');
  }, 140);
}
function setSprite(slot, name){
  const el = $(slot);
  if (!name){ el.style.display = 'none'; el.dataset.cur = ''; return; }
  const url = `assets/${name}.png`;
  if (el.dataset.cur !== url){
    el.dataset.cur = url; el.src = url;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  }
  el.style.display = 'block';
}
function type(text){
  const box = $('text');
  box.textContent = '';
  let i = 0;
  clearInterval(S.typing);
  S.typing = setInterval(() => {
    const ch = text[i];
    box.textContent = text.slice(0, ++i);
    if (ch && ch !== ' ' && i % 3 === 0) blip(150 + (i % 5) * 18, 0.012, 'square', 0.012);
    if (i >= text.length){ clearInterval(S.typing); S.typing = null; }
  }, 16);
}
function finishTyping(){
  if (S.typing){ clearInterval(S.typing); S.typing = null; $('text').textContent = S.pending; return true; }
  return false;
}

function render(){
  const n = SCRIPT[S.node];
  if (!n){ $('text').textContent = 'MISSING NODE: ' + S.node; return; }
  if (n.set) Object.assign(S.flags, n.set);
  setBg(n.bg === undefined ? null : n.bg);
  setSprite('left', n.left || null);
  setSprite('right', n.right || null);
  $('name').textContent = n.who || '';
  $('name').style.visibility = n.who ? 'visible' : 'hidden';
  S.pending = n.text || '';
  type(S.pending);

  const cb = $('choices'); cb.innerHTML = '';
  $('hint').style.display = (n.choices || n.ending) ? 'none' : 'block';
  document.body.classList.toggle('ending', !!n.ending);

  if (n.ending){ mark(S.node); blip(70, 0.9, 'sawtooth', 0.05); }

  const opts = [];
  if (n.choices) n.choices.forEach(c => {
    if (c.if && !S.flags[c.if]) return;
    if (c.not && S.flags[c.not]) return;
    opts.push(c);
  });
  opts.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'choice'; b.type = 'button';
    b.innerHTML = `<span class="num">${i+1}</span>${c.t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}`;
    b.onclick = e => { e.stopPropagation(); blip(420, 0.05, 'square', 0.03);
                       if (c.set) Object.assign(S.flags, c.set); go(c.to); };
    cb.appendChild(b);
  });
  if (n.ending){
    const b = document.createElement('button');
    b.className = 'choice ending-btn'; b.type = 'button';
    b.innerHTML = '<span class="num">1</span>START OVER';
    b.onclick = e => { e.stopPropagation(); restart(); };
    cb.appendChild(b);
    const coll = document.createElement('div');
    coll.className = 'ending-coll';
    const f = found();
    coll.textContent = `${f.size} of ${ENDINGS.length} endings found`;
    cb.appendChild(coll);
  }
  S.opts = n.ending ? [{__restart:true}] : opts;
  if (cb.firstChild) cb.firstChild.focus({preventScroll:true});
}

function restart(){ S.flags = {}; S.hist = []; S.node = 'start'; render(); }
function go(id){ S.hist.push(S.node); S.node = id; render(); }
function advance(){
  if (!S.started) return;
  if (finishTyping()) return;
  const n = SCRIPT[S.node];
  if (n.choices || n.ending) return;
  if (n.next) go(n.next);
}
function pick(i){
  const btns = $('choices').querySelectorAll('button');
  if (btns[i]) btns[i].click();
}

document.addEventListener('click', advance);
document.addEventListener('keydown', e => {
  if (!S.started){
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); $('start-btn').click(); }
    return;
  }
  if (e.key >= '1' && e.key <= '9'){ e.preventDefault(); pick(+e.key - 1); return; }
  if (e.key === ' ' || e.key === 'Enter'){
    if (document.activeElement && document.activeElement.classList.contains('choice')) return;
    e.preventDefault(); advance();
  }
  if (e.key.toLowerCase() === 'm'){ toggleSound(); }
});

function toggleSound(){
  S.sound = !S.sound;
  try { localStorage.setItem('ipf.sound', S.sound ? '1' : '0'); } catch {}
  $('mute').textContent = S.sound ? '♪ ON' : '♪ OFF';
  $('mute').setAttribute('aria-pressed', String(!S.sound));
}

window.addEventListener('DOMContentLoaded', () => {
  try { S.sound = localStorage.getItem('ipf.sound') !== '0'; } catch {}
  $('mute').textContent = S.sound ? '♪ ON' : '♪ OFF';
  $('mute').onclick = e => { e.stopPropagation(); toggleSound(); };
  renderCollection();
  $('start-btn').onclick = e => {
    e.stopPropagation(); $('title').style.display = 'none'; S.started = true; render();
  };
  // preload every asset the script can reach, so scenes never flash blank
  const want = new Set();
  for (const n of Object.values(SCRIPT)){
    if (n.bg) want.add('assets/bg-' + n.bg + '.png');
    if (n.left) want.add('assets/' + n.left + '.png');
    if (n.right) want.add('assets/' + n.right + '.png');
  }
  want.forEach(u => { const i = new Image(); i.src = u; });
});
