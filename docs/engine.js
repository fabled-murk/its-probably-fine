// IT'S PROBABLY FINE — minimal VN engine
const S = {node:'start', flags:{}, typing:null, hist:[], started:false};
const $ = id => document.getElementById(id);

function setBg(name){
  const el = $('bg');
  const url = name ? `assets/bg-${name}.png` : '';
  if (el.dataset.cur === url) return;
  el.dataset.cur = url;
  el.style.backgroundImage = url ? `url(${url})` : 'none';
}
function setSprite(slot, name){
  const el = $(slot);
  if (!name){ el.style.display='none'; el.dataset.cur=''; return; }
  const url = `assets/${name}.png`;
  if (el.dataset.cur !== url){ el.dataset.cur = url; el.src = url; }
  el.style.display='block';
}
function type(text){
  const box = $('text');
  box.textContent = '';
  let i = 0;
  clearInterval(S.typing);
  S.typing = setInterval(()=>{
    box.textContent = text.slice(0, ++i);
    if (i >= text.length){ clearInterval(S.typing); S.typing = null; }
  }, 16);
}
function finishTyping(){
  if (S.typing){ clearInterval(S.typing); S.typing=null; $('text').textContent = S.pending; return true; }
  return false;
}
function render(){
  const n = SCRIPT[S.node];
  if (!n){ $('text').textContent = 'MISSING NODE: '+S.node; return; }
  if (n.set) Object.assign(S.flags, n.set);
  setBg(n.bg === undefined ? null : n.bg);
  setSprite('left', n.left || null);
  setSprite('right', n.right || null);
  $('name').textContent = n.who || '';
  $('name').style.visibility = n.who ? 'visible' : 'hidden';
  S.pending = n.text || '';
  type(S.pending);
  const cb = $('choices'); cb.innerHTML = '';
  $('hint').style.display = n.choices ? 'none' : 'block';
  if (n.ending){ document.body.classList.add('ending'); } else { document.body.classList.remove('ending'); }
  if (n.choices){
    n.choices.forEach(c=>{
      if (c.if && !S.flags[c.if]) return;
      const b = document.createElement('button');
      b.className='choice'; b.textContent = c.t;
      b.onclick = e => { e.stopPropagation(); if (c.set) Object.assign(S.flags, c.set); go(c.to); };
      cb.appendChild(b);
    });
  }
  if (n.ending){
    const b = document.createElement('button');
    b.className='choice ending-btn'; b.textContent = '↺ START OVER';
    b.onclick = e => { e.stopPropagation(); S.flags={}; go('start'); };
    cb.appendChild(b);
  }
}
function go(id){ S.hist.push(S.node); S.node = id; render(); }
function advance(){
  if (!S.started) return;
  if (finishTyping()) return;
  const n = SCRIPT[S.node];
  if (n.choices || n.ending) return;
  if (n.next) go(n.next);
}
document.addEventListener('click', advance);
document.addEventListener('keydown', e => { if (e.key===' '||e.key==='Enter') { e.preventDefault(); advance(); } });
window.addEventListener('DOMContentLoaded', ()=>{
  $('start-btn').onclick = e => { e.stopPropagation(); $('title').style.display='none'; S.started=true; render(); };
  // preload every asset the script can reach, so scenes never flash blank
  const want = new Set();
  for (const n of Object.values(SCRIPT)){
    if (n.bg) want.add('assets/bg-'+n.bg+'.png');
    if (n.left) want.add('assets/'+n.left+'.png');
    if (n.right) want.add('assets/'+n.right+'.png');
  }
  want.forEach(u => { const i = new Image(); i.src = u; });
});
