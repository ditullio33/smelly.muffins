// Shared helpers: DOM, money in cents, seeded random numbers.
/* ============================== UTILITIES ============================== */
const $ = (s, el=document) => el.querySelector(s);
const h = (html) => { const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
// money is stored in integer cents
const toC = (d) => Math.round(d*100);
const money = (c, cents=false) => { const n=c/100; return (n<0?'-':'')+'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:cents?2:0,maximumFractionDigits:cents?2:0}); };
const pct = (x, d=1) => (x>0?'+':'')+(x*100).toFixed(d)+'%';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function rng(seed){ let a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function gaussFrom(r){ let u=0,v=0; while(u===0)u=r(); while(v===0)v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
