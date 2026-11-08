// Confirm dialog, router and boot. Load last.
/* ============================== CONFIRM DIALOG ============================== */
function confirmDialog({title,body,stay='Cancel',leave='Leave',onLeave}){
  const prev=document.activeElement;
  const sc=h(`<div class="dlg-scrim"><div class="dlg" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-b"><h3 id="dlg-t">${esc(title)}</h3><p id="dlg-b" class="muted">${esc(body)}</p><div class="row"><button class="btn ghost" data-a="leave">${esc(leave)}</button><button class="btn" data-a="stay">${esc(stay)}</button></div></div></div>`);
  const close=()=>{ sc.remove(); prev?.focus?.({preventScroll:true}); };
  sc.querySelector('[data-a=stay]').onclick=close;
  sc.querySelector('[data-a=leave]').onclick=()=>{ sc.remove(); onLeave(); };
  sc.onclick=e=>{ if(e.target===sc) close(); };
  sc.addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.stopPropagation(); close(); } if(e.key==='Tab'){ const b=[...sc.querySelectorAll('button')]; const i=b.indexOf(document.activeElement); e.preventDefault(); b[(i+(e.shiftKey?-1:1)+b.length)%b.length].focus(); } });
  document.body.append(sc); sc.querySelector('[data-a=stay]').focus();
}
/* ============================== ROUTER & BOOT ============================== */
const PAGES=['lab','course','onboard','settings','library','login'];
let BACK='home'; // last browsing page; lessons and desks return here
function route(){ const v=decodeURIComponent(location.hash.slice(1)); return NODE[v]||PAGES.includes(v)||(v.startsWith('t:')&&findCardLesson(v.slice(2)))?v:'home'; }
function findCardLesson(id){ for(const t of TRACKS){ const l=t.lessons.find(x=>x.id===id&&built(x)&&!x.ref); if(l) return [t,l]; } return null; }
function render(){
  const v=route(); if(v==='home'||v==='course'||v==='lab'||v==='library'||v==='settings') BACK=v; const main=$('#main'); main.innerHTML=''; closeMentor(true); if(ROOM){ ROOM.dispose(); ROOM=null; }
  document.body.classList.toggle('onboarding', v==='onboard'||v==='login'||(v==='home'&&!S.profile));
  if(v==='login') renderLogin(main);
  else if(v==='home'&&!S.profile&&!S.authSeen&&!Auth.user()) renderLogin(main, 'signup');
  else if(v==='home') S.profile ? renderMyPath(main) : renderOnboard(main);
  else if(v==='onboard') renderOnboard(main);
  else if(v==='settings') S.profile ? renderSettings(main) : renderOnboard(main);
  else if(v==='course') renderPath(main);
  else if(v==='library') renderLibrary(main);
  else if(v==='lab') renderLab(main);
  else if(v.startsWith('t:')) { const [t,l]=findCardLesson(v.slice(2)); renderTrackLesson(main,t,l); }
  else { const n=NODE[v]; if(!isUnlocked(n.id)&&!pathAllows(n.id)){ location.hash='home'; return; } n.kind==='lesson'?renderLesson(main,n):renderRoom(main,n); }
  save();
}
window.addEventListener('hashchange',()=>{ render(); window.scrollTo({top:0}); });
// All in-app links go through here. Plain href="#..." links don't navigate on the hosted page (the host page sets a different base URL),
// and clicking the page you're already on fires no hashchange, so both cases re-render directly.
function go(v){ if(decodeURIComponent(location.hash.slice(1))===v){ render(); window.scrollTo({top:0}); } else location.hash=v; }
document.addEventListener('click',e=>{ const a=e.target.closest('a[href^="#"]'); if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey) return;
  const v=a.getAttribute('href').slice(1); e.preventDefault(); if(v==='main'){ $('#main').focus(); return; } go(v); });
function tape(){
  const sim=simulateDaily({days:30,seed:7,events:[]});
  const items=COMPANIES.map(c=>{ const a=sim.P[c.id][29], b=sim.P[c.id][30]; const ch=b/a-1; return `<span><b>${c.id}</b>${b.toFixed(2)} <span style="color:${ch>=0?'#4FD39A':'#FF7A80'}">${pct(ch,2)}</span></span>`; }).join('');
  $('#tape').innerHTML=items+items+`<span>FICTIONAL MARKET · FOR LEARNING ONLY</span>`;
}
S = load();
const hotData = window.claude?.hot?.data; if(hotData && hotData.S) S = hotData.S;
save();
try{ window.claude?.hot?.snapshot?.(()=>({S})); }catch(e){}
tape(); navAuth(); render();
// Signed-in players: fetch the account copy of progress (another device may be ahead), then redraw.
if(Auth.user()) Auth.pull().then(()=>render()).catch(()=>{});
