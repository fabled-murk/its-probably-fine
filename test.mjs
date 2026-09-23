import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync('docs/index.html','utf8');
const dom = new JSDOM(html, { runScripts:'outside-only', url:'https://example.com/' });
const w = dom.window;
w.AudioContext = class { get currentTime(){return 0} createOscillator(){return {frequency:{},connect(){},start(){},stop(){}}} createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}} get destination(){return {}} };
w.Image = class { set src(v){ this._s=v; } };
const src = fs.readFileSync('docs/script.js','utf8') + '\n' + fs.readFileSync('docs/engine.js','utf8') +
  '\n;window.SCRIPT=SCRIPT;window.S=S;window.render=render;window.go=go;';
w.eval(src);
w.document.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));
const d = w.document;
const errors = [];

// every asset the script names must exist on disk
const assets = new Set();
for (const n of Object.values(w.SCRIPT)){
  if (n.bg) assets.add('bg-'+n.bg); if (n.left) assets.add(n.left); if (n.right) assets.add(n.right);
}
for (const a of assets) if (!fs.existsSync(`docs/assets/${a}.png`)) errors.push('missing asset '+a);

d.getElementById('start-btn').click();

// render every node under two flag regimes and check the buttons match the gating rules
const ALL = {};
for (const n of Object.values(w.SCRIPT)){
  (n.choices||[]).forEach(c => { if (c.if) ALL[c.if]=true; if (c.not) ALL[c.not]=true; });
  if (n.set) Object.assign(ALL, n.set);
}
let rendered = 0;
for (const regime of [{}, ALL]){
  for (const id of Object.keys(w.SCRIPT)){
    w.S.flags = Object.assign({}, regime);
    w.S.node = id;
    try { w.render(); rendered++; } catch(e){ errors.push(id+': render threw '+e.message); continue; }
    const n = w.SCRIPT[id];
    const btns = d.getElementById('choices').querySelectorAll('button');
    const visible = (n.choices||[]).filter(c => (!c.if || w.S.flags[c.if]) && !(c.not && w.S.flags[c.not]));
    const expect = n.ending ? 1 : visible.length;
    if (btns.length !== expect) errors.push(`${id}: ${btns.length} buttons, expected ${expect}`);
    if (n.ending && !d.body.classList.contains('ending')) errors.push(id+': ending class missing');
    if (!n.ending && !n.next && !n.choices) errors.push(id+': dead end');
  }
}
// graph reachability, flag-aware over-approximation
const S = w.SCRIPT;
let reach = new Set(['start']), q=['start'];
while(q.length){ const n=S[q.pop()]; if(!n)continue;
  [n.next,...(n.choices||[]).map(c=>c.to)].filter(Boolean).forEach(x=>{ if(!S[x]) return; if(!reach.has(x)){reach.add(x);q.push(x);} }); }
const orphan = Object.keys(S).filter(k=>!reach.has(k));
if (orphan.length) errors.push('unreachable: '+orphan.join(','));
const endings = Object.keys(S).filter(k=>S[k].ending);
const unreachableEnd = endings.filter(e=>!reach.has(e));
if (unreachableEnd.length) errors.push('unreachable endings: '+unreachableEnd.join(','));

// endings persist to the collection
w.localStorage.clear();
for (const e of endings){ w.S.flags={}; w.S.node=e; w.render(); }
const saved = JSON.parse(w.localStorage.getItem('ipf.endings')||'[]');
if (saved.length !== endings.length) errors.push(`collection saved ${saved.length}/${endings.length}`);

// keyboard + mute
w.S.flags={}; w.S.node='s4'; w.render();
const before = w.S.node;
d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'1',bubbles:true}));
if (w.S.node === before) errors.push('number-key choice did not fire');
const m0 = d.getElementById('mute').textContent;
d.getElementById('mute').click();
if (d.getElementById('mute').textContent === m0) errors.push('mute toggle did not change');

console.log('nodes:', Object.keys(S).length, '| endings:', endings.length, '| assets referenced:', assets.size);
console.log('renders performed:', rendered);
console.log('ERRORS:', errors.length ? errors : 'none');
process.exit(errors.length ? 1 : 0);
