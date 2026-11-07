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
function route(){ const v=location.hash.slice(1); return NODE[v]||v==='lab'?v:'home'; }
function render(){
  const v=route(); const main=$('#main'); main.innerHTML=''; closeMentor(true); if(ROOM){ ROOM.dispose(); ROOM=null; }
  if(v==='home') renderPath(main);
  else if(v==='lab') renderLab(main);
  else { const n=NODE[v]; if(!isUnlocked(n.id)){ location.hash='home'; return; } n.kind==='lesson'?renderLesson(main,n):renderRoom(main,n); }
  save();
}
window.addEventListener('hashchange',()=>{ render(); window.scrollTo({top:0}); });
function tape(){
  const sim=simulateDaily({days:30,seed:7,events:[]});
  const items=COMPANIES.map(c=>{ const a=sim.P[c.id][29], b=sim.P[c.id][30]; const ch=b/a-1; return `<span><b>${c.id}</b>${b.toFixed(2)} <span style="color:${ch>=0?'#4FD39A':'#FF7A80'}">${pct(ch,2)}</span></span>`; }).join('');
  $('#tape').innerHTML=items+items+`<span>FICTIONAL MARKET · FOR LEARNING ONLY</span>`;
}
S = load();
const hotData = window.claude?.hot?.data; if(hotData && hotData.S) S = hotData.S;
S.unlockAll=true; save();
try{ window.claude?.hot?.snapshot?.(()=>({S})); }catch(e){}
tape(); render();
