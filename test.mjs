import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync('docs/index.html','utf8');
const dom = new JSDOM(html, { runScripts:'outside-only', url:'https://example.com/' });
const w = dom.window;
w.localStorage; // exists
// stub AudioContext + Image
w.AudioContext = class { get currentTime(){return 0} createOscillator(){return {frequency:{},connect(){},start(){},stop(){}}} createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}} get destination(){return {}} };
w.Image = class { set src(v){ this._s=v; } };
const src = fs.readFileSync('docs/script.js','utf8') + '\n' + fs.readFileSync('docs/engine.js','utf8') +
  '\n;window.SCRIPT=SCRIPT;window.S=S;window.render=render;window.go=go;';
w.eval(src);
w.document.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));
const d = w.document;
console.log('title collection:', d.getElementById('collection').textContent.slice(0,40));
d.getElementById('start-btn').click();
// walk: depth-first through every reachable node, clicking choices
const seen = new Set(), endings = new Set();
let errors = [];
function walk(node, depth, path){
  if (depth > 60) { errors.push('too deep: '+path.slice(-3).join('>')); return; }
  w.S.node = node; w.S.flags = Object.assign({}, w.S.flags);
  try { w.render(); } catch(e){ errors.push(node+': render threw '+e.message); return; }
  seen.add(node);
  const n = w.SCRIPT[node];
  if (!d.getElementById('text')) errors.push('no text el');
  if (n.ending){ endings.add(node);
    const btns = d.getElementById('choices').querySelectorAll('button');
    if (btns.length < 1) errors.push(node+': ending has no restart button');
    if (!d.body.classList.contains('ending')) errors.push(node+': ending class missing');
    return; }
  if (n.choices){
    const btns = d.getElementById('choices').querySelectorAll('button');
    const visible = n.choices.filter(c => !c.if || w.S.flags[c.if]);
    if (btns.length !== visible.length) errors.push(`${node}: ${btns.length} buttons vs ${visible.length} expected`);
    visible.forEach(c => { if (!seen.has(c.to)) walk(c.to, depth+1, [...path,node]); });
    return;
  }
  if (n.next && !seen.has(n.next)) walk(n.next, depth+1, [...path,node]);
}
// set every flag so conditional choices are exercised too
w.S.flags = { promotion_warning:true, kevin:true, kevin_along:true, photo:true };
walk('start',0,[]);
console.log('nodes rendered:', seen.size, '/', Object.keys(w.SCRIPT).length);
console.log('endings reached:', endings.size, [...endings].join(','));
console.log('after playthrough, saved endings:', w.localStorage.getItem('ipf.endings'));
// keyboard: number key picks a choice
w.S.node='s4'; w.render();
const before = w.S.node;
w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'1',bubbles:true}));
console.log('number-key choice:', before, '->', w.S.node, w.S.node!==before ? 'OK' : 'FAILED');
// mute toggle
d.getElementById('mute').click();
console.log('mute toggle:', d.getElementById('mute').textContent);
console.log('ERRORS:', errors.length ? errors : 'none');
