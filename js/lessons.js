// Top bar, lesson path, lesson player, teach widgets.
/* ============================== TOP BAR ============================== */
function statsBar(extra=''){
  const st=streakNow();
  $('#stats').innerHTML = extra || `<span class="stat ${st?'fire':'off'}" role="img" aria-label="${st} day streak" title="Day streak">${I.fire}${st}</span><span class="stat xp" role="img" aria-label="${S.xp} XP" title="Total XP">${I.bolt}${S.xp}</span>`;
}

/* ============================== PATH ============================== */
const ZIG=[0,1,1.6,1,0,-1,-1.6,-1];
function renderPath(main){
  document.body.classList.remove('focus'); statsBar();
  const cur=currentNode(); setMentor(cur?cur.unit.mentor:'senior');
  CTX={screen:'lesson path',current_unit:cur?cur.unit.title:'all done',xp:S.xp,completed:Object.keys(S.done).length+' of '+NODES.length};
  if(!Array.isArray(S.open)||!S.open.length) S.open=[cur?cur.unit.id:UNITS[0].id];
  const wrap=h(`<div class="stack" style="gap:10px"></div>`);
  const totalDone=NODES.filter(n=>S.done[n.id]).length;
  wrap.append(h(`<div class="course-head"><div class="row" style="gap:16px;flex-wrap:nowrap"><span class="hero-bull">${BULL_LOGO}</span><div><span class="eyebrow">Full course · all 12 units</span><h2 style="margin-top:4px">Learn to invest, one lesson at a time</h2><a href="#home" style="font-size:14px">← Back to my plan</a></div></div><div class="course-prog"><b class="mono">${totalDone}/${NODES.length}</b><span class="muted">steps done</span></div></div>`));
  UNITS.forEach(u=>{
    const m=MENTORS[u.mentor]; const nodes=[...u.lessons.map(l=>NODE[l.id]),NODE[u.app.id]];
    const done=nodes.filter(n=>S.done[n.id]).length; const isOpen=S.open.includes(u.id);
    const sec=h(`<section class="unit-sec" style="--uc:var(${u.color})"></section>`);
    const head=h(`<button class="unit ${isOpen?'open':''}" style="background:var(${u.color})" aria-expanded="${isOpen}" aria-controls="path-${u.id}">
      <div style="min-width:0;text-align:left"><span class="eyebrow">Unit ${u.n} · ${done}/${nodes.length} done</span><h2 style="margin-top:4px">${u.title}</h2>
      <div class="unit-bar" aria-hidden="true"><span style="width:${Math.round(done/nodes.length*100)}%"></span></div></div>
      <div class="row" style="gap:10px;flex-wrap:nowrap"><span class="who">${avatar(u.mentor)}<span>Mentor: <b>${m.name}</b></span></span><span class="chev" aria-hidden="true">${isOpen?'▴':'▾'}</span></div></button>`);
    // Toggle in place: no full re-render (that emptied the page and then scrolled to the START node).
    head.onclick=()=>keepView(head,()=>{ const open=!S.open.includes(u.id); S.open=open?[...S.open,u.id]:S.open.filter(x=>x!==u.id); save();
      head.classList.toggle('open',open); head.setAttribute('aria-expanded',open); head.querySelector('.chev').textContent=open?'▴':'▾';
      if(open) sec.append(buildPath()); else sec.querySelector('.path')?.remove(); });
    sec.append(head);
    function buildPath(){
      const path=h(`<div class="path" id="path-${u.id}"></div>`); let k=0;
      nodes.forEach(n=>{
        const dn=!!S.done[n.id], open=isUnlocked(n.id), here=cur&&cur.id===n.id;
        const icon= dn? I.check : !open? I.lock : n.kind==='app'? I.chart : I.star;
        const w=h(`<div class="node-wrap ${n.kind==='app'?'is-app':''}" style="--o:${ZIG[k++%ZIG.length]};--uc:var(${u.color})">
          ${here?`<span class="ring"></span><span class="start-bubble">${n.kind==='app'?'SIMULATE':'START'}</span>`:''}
          <button class="node ${n.kind==='app'?'app':''} ${dn?'done':''} ${open?'':'locked'}" aria-label="${esc(n.title)}${dn?' (complete)':open?'':' (locked)'}">${icon}</button>
          <span class="node-label ${open?'':'locked'}">${n.kind==='app'?'<span class="eyebrow">Application</span><br>':''}${n.title}</span></div>`);
        w.querySelector('.node').onclick=()=>{ if(!open){ toast(`Finish "${prevTitle(n.id)}" to unlock this.`); return; } location.hash=n.id; };
        path.append(w);
      });
      return path;
    }
    if(isOpen) sec.append(buildPath());
    wrap.append(sec);
  });
  const lab=h(`<div class="lab-cta"><div><span class="eyebrow" style="color:var(--hl)">Practice anytime</span><h3 style="margin-top:4px;color:var(--tape-fg)">Scenario Lab: what happens when the Fed hikes rates, or before a midterm election?</h3></div><button class="btn">Open the lab</button></div>`);
  lab.querySelector('button').onclick=()=>location.hash='lab'; wrap.append(lab);
  wrap.append(h(`<p class="muted" style="font-size:13px;text-align:center;padding-block:6px">Lesson content adapted from OpenStax Principles of Finance 2e (CC BY-NC-SA 4.0). Historical returns: Ken French Data Library.</p>`));
  main.append(wrap);
  if(!chat.length) say('Hey, I\'m Maya. There are 12 units. Each one is a few short lessons, then an application at a 3D desk. Tap a unit to open it. Ask me anything, anytime.');
  mentorTools(['What is a stock?','Why invest instead of save?','What is compound interest?']);
  requestAnimationFrame(()=>{ const r=main.querySelector('.ring'); if(r) r.closest('.node-wrap').scrollIntoView({block:'center',behavior:'auto'}); });
}
// Runs a DOM change and keeps `anchor` at the same spot on screen, so content above or below changing height never moves the view.
function keepView(anchor, change){ const before=anchor.getBoundingClientRect().top; change(); const d=anchor.getBoundingClientRect().top-before; if(Math.abs(d)>0.5) window.scrollBy(0,d); }
function prevTitle(id){ const i=NODES.findIndex(n=>n.id===id); const p=NODES.slice(0,i).find(n=>!S.done[n.id]); return p?p.title:''; }
let toastT; function toast(t){ let el=$('#toast'); if(!el){ el=h(`<div id="toast" role="status" style="position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:10px;z-index:60;font-weight:600;max-width:calc(100% - 32px)"></div>`); document.body.append(el);} el.textContent=t; el.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>el.hidden=true,2600); }

/* ============================== LESSON SHELL ============================== */
function shell(main, node, {hearts=true}={}){
  document.body.classList.add('focus'); setMentor(node.unit.mentor);
  const el=h(`<div class="lesson" style="--uc:var(${node.unit.color})">
    <div class="l-top"><button class="x" id="quit" aria-label="Quit lesson">${I.x}</button><div class="pbar" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="fill" style="width:0%"></div></div>
    ${hearts?`<span class="stat heart" id="hearts" role="img" aria-label="5 hearts left">${I.heart}<span>5</span></span>`:''}<button class="btn ghost sm" id="askm">${avatar(node.unit.mentor,'24px')}Ask ${MENTORS[node.unit.mentor].name.split(' ')[0]}</button></div>
    <div class="l-body" id="lb"></div><div class="l-foot" id="lf"><div class="foot-in" id="lfi"></div></div></div>`);
  main.append(el);
  el.querySelector('#quit').onclick=()=>{ if(el.querySelector('.done-screen')){ location.hash='home'; return; } confirmDialog({title:'Quit this lesson?',body:'Your progress in this lesson will be lost.',stay:'Keep learning',leave:'Quit',onLeave:()=>location.hash='home'}); };
  el.querySelector('#askm').onclick=openMentor;
  statsBar(`<span class="stat xp">${I.bolt}${S.xp}</span>`);
  return {
    el, body:el.querySelector('#lb'), foot:el.querySelector('#lf'), fin:el.querySelector('#lfi'),
    progress(p){ el.querySelector('.pbar .fill').style.width=(p*100)+'%'; el.querySelector('.pbar').setAttribute('aria-valuenow',Math.round(p*100)); },
    hearts(n){ const hh=el.querySelector('#hearts span'); if(hh){ hh.textContent=n; el.querySelector('#hearts').setAttribute('aria-label',n+' hearts left'); } },
    footReset(){ this.foot.className='l-foot'; this.fin.innerHTML=''; },
  };
}
const PRAISE=['Nice!','Great job!','Correct!','You got it!','Exactly!','Sharp thinking!'];
function mountItem(sh, item, done){
  const b=sh.body; b.innerHTML=''; sh.footReset();
  if(item.stage&&!sh.noMeta) b.append(h(`<div class="card-meta">${stageChip(item.stage,item.stageAuto)}</div>`));
  const m=MENTORS[mentorKey];
  CTX={screen:'lesson',lesson:CTX.lesson,question:item.q||item.title,answer_options:item.opts||item.bank||null};
  if(item.t==='teach'){
    b.append(h(`<div class="speech">${avatar(mentorKey,'52px')}<div class="bubble"><h3 style="margin-bottom:8px">${item.title}</h3><div class="teach-body">${item.body}</div>${item.src?`<p class="src-line">Source: ${esc(item.src)}</p>`:''}</div></div>`));
    if(item.card) b.append(h(`<div style="max-width:380px">${card(CO[item.card]||RC[item.card])}</div>`));
    if(item.widget) WIDGETS[item.widget](b);
    const go=h(`<button class="btn go big" style="margin-left:auto">Continue</button>`); go.onclick=()=>done(null); sh.fin.append(go); go.focus({preventScroll:true});
    return;
  }
  let sel=null, check;
  b.append(h(`<h2 class="l-q">${esc(item.q)}</h2>`));
  if(item.card) b.append(h(`<div style="max-width:380px">${card(CO[item.card]||RC[item.card])}</div>`));
  const checkBtn=h(`<button class="btn go big" style="margin-left:auto" disabled>Check</button>`); sh.fin.append(checkBtn);
  const enable=v=>{ checkBtn.disabled=!v; };
  let correctText='';
  if(item.t==='mc'||item.t==='tf'){
    const opts = item.t==='tf' ? [['True',true],['False',false]] : item.opts.map((o,i)=>[o,i]);
    const order = item.t==='tf' ? opts : opts.map(x=>[x,Math.random()]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
    correctText = item.t==='tf' ? (item.a?'True':'False') : item.opts[item.a];
    const box=h(`<div class="choices ${item.t==='tf'?'tf':''}"></div>`);
    order.forEach(([text,val],i)=>{ const c=h(`<button class="choice"><span class="k">${i+1}</span><span>${esc(text)}</span></button>`); c.onclick=()=>{ box.querySelectorAll('.choice').forEach(x=>x.classList.remove('sel')); c.classList.add('sel'); sel={val,c}; enable(true); }; box.append(c); });
    b.append(box);
    check=()=>{ const ok= sel.val===item.a; box.querySelectorAll('.choice').forEach(x=>x.disabled=true); sel.c.classList.add(ok?'right':'wrong'); if(!ok){ [...box.children].find((x,i)=>order[i][1]===item.a)?.classList.add('right'); } return ok; };
  }
  if(item.t==='fill'){
    correctText=item.a; const [pre,post]=item.q.split('___');
    b.querySelector('.l-q').textContent='Fill in the blank';
    const sent=h(`<p class="sentence">${esc(pre)}<span class="blank" id="blank">&nbsp;</span>${esc(post||'')}</p>`);
    const bank=h(`<div class="bank"></div>`);
    [...item.bank].sort(()=>Math.random()-.5).forEach(w=>{ const c=h(`<button class="chip">${esc(w)}</button>`); c.onclick=()=>{ if(sel) sel.c.classList.remove('used'); sel={val:w,c}; c.classList.add('used'); const bl=sent.querySelector('#blank'); bl.innerHTML=''; const put=h(`<button class="chip on">${esc(w)}</button>`); put.onclick=()=>{ c.classList.remove('used'); sel=null; bl.innerHTML='&nbsp;'; enable(false); }; bl.append(put); enable(true); }; bank.append(c); });
    b.append(sent,bank);
    check=()=>{ const ok=sel.val===item.a; bank.querySelectorAll('button').forEach(x=>x.disabled=true); const bl=sent.querySelector('#blank button'); if(bl){ bl.disabled=true; bl.style.background=`var(${ok?'--gain':'--loss'})`; bl.style.borderColor=bl.style.background; } return ok; };
  }
  if(item.t==='match'){
    checkBtn.remove(); let left=null, mistakes=0, matched=0;
    const L=item.pairs.map((p,i)=>({t:p[0],i})).sort(()=>Math.random()-.5), R=item.pairs.map((p,i)=>({t:p[1],i})).sort(()=>Math.random()-.5);
    const grid=h(`<div class="match"></div>`);
    const mk=(o,side)=>{ const c=h(`<button class="choice">${esc(o.t)}</button>`); c.dataset.i=o.i; c.dataset.side=side; c.onclick=()=>pick(c); return c; };
    for(let k=0;k<L.length;k++){ grid.append(mk(L[k],'L'), mk(R[k],'R')); }
    const pick=(c)=>{ if(c.classList.contains('gone')) return;
      if(!left || left.dataset.side===c.dataset.side){ grid.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel')); c.classList.add('sel'); left=c; return; }
      if(left.dataset.i===c.dataset.i){ [left,c].forEach(x=>{x.classList.remove('sel');x.classList.add('gone');x.disabled=true}); left=null; matched++;
        if(matched===item.pairs.length) feedback(mistakes===0, mistakes?`${mistakes} wrong ${mistakes===1?'match':'matches'}. Review the pairs above.`:''); }
      else { mistakes++; [left,c].forEach(x=>{x.classList.remove('sel');x.classList.add('wrong','shake'); setTimeout(()=>x.classList.remove('wrong','shake'),450)}); left=null; } };
    b.querySelector('.l-q').textContent=item.q; b.append(grid);
  }
  const feedback=(ok, extra='')=>{
    sh.foot.className='l-foot '+(ok?'good':'bad'); sh.fin.innerHTML='';
    const why=item.why||extra;
    const left=h(`<div style="min-width:0" role="status" aria-live="polite"><div class="fb-title">${ok?PRAISE[Math.floor(Math.random()*PRAISE.length)]:item.t==='match'?'Almost!':'Not quite'}</div>${!ok&&correctText?`<div class="fb-text"><b>Correct answer:</b> ${esc(correctText)}</div>`:''}${why?`<div class="fb-text">${esc(why)}</div>`:''}${item.src?`<div class="fb-src">Source: ${esc(item.src)}</div>`:''}<button class="linkbtn" style="margin-top:4px">Ask ${m.name.split(' ')[0]} why</button></div>`);
    left.querySelector('.linkbtn').onclick=()=>{ openMentor(); ask(`Can you explain why "${correctText||'these matches'}" is right for: "${item.q}"?`, why||faq(item.q)); };
    const go=h(`<button class="btn go big">Continue</button>`); go.onclick=()=>done(ok); sh.fin.append(left,go); go.focus({preventScroll:true});
  };
  checkBtn.onclick=()=>{ if(checkBtn.disabled) return; const ok=check(); feedback(ok); };
}
// number keys pick options, Enter presses the main button
document.addEventListener('keydown',e=>{ if(!document.body.classList.contains('focus')||e.target.matches('input,textarea,select')||document.querySelector('.dlg-scrim,.room')) return;
  if(/^[1-9]$/.test(e.key)){ const c=document.querySelectorAll('#lb .choices .choice')[+e.key-1]; if(c&&!c.disabled) c.click(); }
  if(e.key==='Enter'){ const b=document.querySelector('#lfi .btn.go'); if(b&&!b.disabled){ e.preventDefault(); b.click(); } } });

/* ============================== LESSON RUNNER ============================== */
function renderLesson(main, node){
  const sh=shell(main,node); CTX={screen:'lesson',lesson:node.title};
  const items=node.items; let queue=items.map((_,i)=>i), pos=0, hearts=5, mistakes=0, requeued=new Set(), cleared=0;
  const total=items.length;
  const nextItem=()=>{
    if(hearts<=0) return outOfHearts();
    if(pos>=queue.length) return finish();
    const idx=queue[pos];
    mountItem(sh, items[idx], ok=>{
      recordStage(items[idx].stage, ok);
      if(ok===false){ mistakes++; hearts--; sh.hearts(hearts); if(!requeued.has(idx)){ requeued.add(idx); queue.push(idx); } }
      else cleared++;
      sh.progress(Math.min(cleared/total,1)); pos++; nextItem();
    });
  };
  const outOfHearts=()=>{ sh.body.innerHTML=''; sh.footReset();
    sh.body.append(h(`<div class="stack done-screen"><span class="stat heart" style="font-size:28px">${I.heart}0</span><h2>Out of hearts</h2><p class="muted" style="max-width:44ch">No problem. Every mistake is a lesson. Ask ${MENTORS[mentorKey].name.split(' ')[0]} about anything that confused you, then try again.</p></div>`));
    const r=h(`<button class="btn go big" style="margin-left:auto">Try again</button>`); r.onclick=()=>render(); sh.fin.append(r); };
  const finish=()=>{
    const first=!S.done[node.id]; const xp=10+(mistakes===0?5:0);
    S.done[node.id]=true; S.best[node.id]=Math.max(S.best[node.id]||0, Math.round(100*total/(total+mistakes))); addXP(xp); save();
    celebrate(sh, {title:'Lesson complete!', tiles:[['XP earned',xp,'#946000'],['Accuracy',Math.round(100*total/(total+mistakes))+'%','#187A55'],['Day streak',streakNow(),'#B4530F']], msg: mistakes===0?'Perfect lesson. No mistakes!':`You fixed ${mistakes} ${mistakes===1?'mistake':'mistakes'} along the way. That's how it sticks.`});
  };
  nextItem();
}
function celebrate(sh,{title,tiles,msg,extraBtn}){
  sh.body.innerHTML=''; sh.footReset(); sh.progress(1);
  sh.body.append(h(`<div class="stack done-screen">${avatar(mentorKey,'84px')}<h2 style="font-size:34px">${title}</h2><p class="muted">${msg}</p>
    <div class="done-tiles">${tiles.map(([t,v,c])=>`<div class="dt" style="--tc:${c}"><div class="t">${t}</div><div class="v">${v}</div></div>`).join('')}</div></div>`));
  const go=h(`<button class="btn go big" style="margin-left:auto">Continue</button>`); go.onclick=()=>{ location.hash='home'; };
  if(extraBtn) sh.fin.append(extraBtn); sh.fin.append(go); go.focus({preventScroll:true}); confetti(); say(msg);
}
function confetti(){
  if(reduceMotion) return; const c=$('#confetti'), ctx=c.getContext('2d'); const W=c.width=innerWidth, H=c.height=innerHeight;
  const cols=[css('--u1'),css('--u2'),css('--u3'),'#F3C34D','#E8762B']; const P=Array.from({length:110},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*13-4,r:Math.random()*6+4,c:cols[Math.floor(Math.random()*cols.length)],a:Math.random()*6}));
  let t=0; const tick=()=>{ ctx.clearRect(0,0,W,H); P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.38; p.a+=0.2; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle=p.c; ctx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2); ctx.restore(); }); if(++t<110) requestAnimationFrame(tick); else ctx.clearRect(0,0,W,H); }; tick();
}

/* ============================== TEACH WIDGETS ============================== */
function noData(){ return h(`<div class="callout">Historical data isn't loaded yet. Add the Ken French CSV and run <code>npm run data</code>. The rest of this lesson still works.</div>`); }
const CRASHES=[['Great Depression',192901,193612],['1973–74 bear market',197210,197512],['Dot-com crash',200001,200312],['Financial crisis',200710,201003],['COVID crash',201912,202006]];
function crashTable(){
  const M=FFD.monthly; const lvl=[]; let v=1; M.forEach(r=>{ v*=1+ffMkt(r); lvl.push({ym:r.ym,v}); });
  return CRASHES.map(([name,from,to])=>{ const win=lvl.filter(p=>p.ym>=from&&p.ym<=to); if(!win.length) return null;
    let pk=win[0]; win.forEach(p=>{ if(p.v>pk.v) pk=p; }); const after=win.filter(p=>p.ym>=pk.ym); let tr=after[0]; after.forEach(p=>{ if(p.v<tr.v) tr=p; });
    const i=lvl.findIndex(p=>p.ym===tr.ym); let rec=null; for(let j=i+1;j<lvl.length;j++) if(lvl[j].v>=pk.v){ rec=j-i; break; }
    return {name,dd:tr.v/pk.v-1,peakL:ymLabel(pk.ym).replace(' ',' '),troughL:ymLabel(tr.ym),rec}; }).filter(Boolean);
}

const WIDGETS = {
  budget(b){
    const w=h(`<div class="panel stack"><label class="field">Monthly take-home pay <b class="mono" data-v></b><input type="range" min="200" max="5000" step="50" value="1200"></label><div class="kpis" data-k></div><div class="bars" data-b></div></div>`); b.append(w);
    const upd=()=>{ const pay=+w.querySelector('input').value; w.querySelector('[data-v]').textContent=money(toC(pay)); const n=toC(pay*0.5), wa=toC(pay*0.3), sv=toC(pay)-n-wa;
      w.querySelector('[data-k]').innerHTML=`<div class="kpi"><div class="v">${money(n)}</div><div class="l">Needs (50%)</div></div><div class="kpi"><div class="v">${money(wa)}</div><div class="l">Wants (30%)</div></div><div class="kpi"><div class="v gain">${money(sv)}</div><div class="l">Savings (20%)</div></div>`;
      CTX.widget={take_home:money(toC(pay)),needs:money(n),wants:money(wa),savings:money(sv)}; };
    w.querySelector('input').oninput=upd; upd();
  },
  simple(b){
    const st={rate:10,yrs:30};
    const w=h(`<div class="panel stack"><div class="grid g2"><label class="field">Interest rate <b class="mono" data-v="rate"></b><input type="range" min="1" max="12" value="10" data-k="rate"></label><label class="field">Years <b class="mono" data-v="yrs"></b><input type="range" min="1" max="40" value="30" data-k="yrs"></label></div><div class="kpis" data-k="k"></div><div class="chart-box" style="height:220px"><canvas></canvas></div><div data-k="lg"></div></div>`); b.append(w);
    const upd=()=>{ w.querySelectorAll('input').forEach(i=>st[i.dataset.k]=+i.value); w.querySelector('[data-v=rate]').textContent=st.rate+'%'; w.querySelector('[data-v=yrs]').textContent=st.yrs;
      const P=toC(1000), r=st.rate/100; const simp=[], comp=[]; let c=P; for(let y=0;y<=st.yrs;y++){ simp.push(Math.round(P*(1+r*y))); comp.push(c); c=Math.round(c*(1+r)); }
      w.querySelector('[data-k=k]').innerHTML=`<div class="kpi"><div class="v">${money(simp[st.yrs])}</div><div class="l">Simple interest</div></div><div class="kpi"><div class="v gain">${money(comp[st.yrs])}</div><div class="l">Compound interest</div></div>`;
      const s=[{label:'Compound',color:'--gain',values:comp,fill:true},{label:'Simple',color:'--accent',values:simp}]; drawLine(w.querySelector('canvas'),s,{xLabel:i=>'Yr '+i}); w.querySelector('[data-k=lg]').innerHTML=legend(s);
      CTX.widget={start:'$1,000',rate:st.rate+'%',years:st.yrs,simple:money(simp[st.yrs]),compound:money(comp[st.yrs])}; };
    w.querySelectorAll('input').forEach(i=>i.oninput=upd); requestAnimationFrame(upd);
  },
  bond(b){
    const price=(face,c,r,n)=>{ let p=0; for(let t=1;t<=n;t++) p+=face*c/Math.pow(1+r,t); return p+face/Math.pow(1+r,n); };
    const w=h(`<div class="panel stack"><p class="muted" style="font-size:14px">You own bonds with a <b>4% coupon</b> and $1,000 face value. Move today's market interest rate.</p><label class="field">Market interest rate <b class="mono" data-v></b><input type="range" min="1" max="9" step="0.25" value="4"></label><div class="kpis" data-k></div></div>`); b.append(w);
    const upd=()=>{ const r=+w.querySelector('input').value/100; w.querySelector('[data-v]').textContent=(r*100).toFixed(2)+'%'; const p2=price(1000,0.04,r,2), p10=price(1000,0.04,r,10), p30=price(1000,0.04,r,30);
      const cls=p=>p>=999.99?'gain':'loss'; w.querySelector('[data-k]').innerHTML=[['2-year bond',p2],['10-year bond',p10],['30-year bond',p30]].map(([n,p])=>`<div class="kpi"><div class="v ${cls(p)}">${money(Math.round(p*100))}</div><div class="l">${n} price</div></div>`).join('');
      CTX.widget={coupon:'4%',market_rate:(r*100).toFixed(2)+'%',price_2yr:money(Math.round(p2*100)),price_10yr:money(Math.round(p10*100)),price_30yr:money(Math.round(p30*100))}; };
    w.querySelector('input').oninput=upd; upd();
  },
  replay(b){
    if(!FFD) return b.append(noData());
    const A=FFD.annual, first=A[0].y, last=A[A.length-1].y; const st={hz:20,start:Math.max(first,last-19)};
    const w=h(`<div class="panel stack"><div class="row" style="gap:8px">${[10,20,30].map(n=>`<button class="chip ${n===20?'on':''}" data-hz="${n}">${n} years</button>`).join('')}</div>
      <label class="field">Start year <b class="mono" data-v></b><input type="range" min="${first}" max="${last-9}" value="${st.start}"></label><div class="kpis" data-k></div><div class="chart-box" style="height:220px"><canvas></canvas></div><div data-lg></div><p class="src-line" data-n></p></div>`); b.append(w);
    const inp=w.querySelector('input');
    const upd=()=>{ inp.max=last-st.hz+1; st.start=Math.min(+inp.value,last-st.hz+1); inp.value=st.start; w.querySelector('[data-v]').textContent=`${st.start}–${st.start+st.hz-1}`;
      const yrs=A.filter(r=>r.y>=st.start&&r.y<st.start+st.hz); let s=toC(1000), c=toC(1000); const sp=[s], cp=[c]; let down=0, worst=null;
      yrs.forEach(r=>{ const m=(r.mktrf+r.rf)/100; if(m<0) down++; if(!worst||m<worst.m) worst={m,y:r.y}; s=Math.round(s*(1+m)); c=Math.round(c*(1+r.rf/100)); sp.push(s); cp.push(c); });
      let wins=0, tot=0; for(let y=first;y<=last-st.hz+1;y++){ let gs=1,gc=1; A.filter(r=>r.y>=y&&r.y<y+st.hz).forEach(r=>{ gs*=1+(r.mktrf+r.rf)/100; gc*=1+r.rf/100; }); tot++; if(gs>gc) wins++; }
      w.querySelector('[data-k]').innerHTML=`<div class="kpi"><div class="v gain">${money(s)}</div><div class="l">$1,000 in US stocks</div></div><div class="kpi"><div class="v">${money(c)}</div><div class="l">$1,000 in Treasury bills</div></div><div class="kpi"><div class="v loss">${down}</div><div class="l">Down years (worst: ${worst.y}, ${pct(worst.m,0)})</div></div><div class="kpi"><div class="v">${wins}/${tot}</div><div class="l">${st.hz}-year stretches where stocks beat T-bills</div></div>`;
      const ser=[{label:'US stocks',color:'--gain',values:sp,fill:true},{label:'Treasury bills',color:'--accent',values:cp}]; drawLine(w.querySelector('canvas'),ser,{xLabel:i=>String(st.start+i)}); w.querySelector('[data-lg]').innerHTML=legend(ser);
      w.querySelector('[data-n]').textContent=`Historical US market returns, Ken French Data Library (${first}–${last}). Past performance does not guarantee future results.`;
      CTX.widget={period:`${st.start}-${st.start+st.hz-1}`,stocks_end:money(s),tbills_end:money(c),down_years:down,worst_year:`${worst.y} (${pct(worst.m,0)})`,stretches_stocks_beat_tbills:`${wins} of ${tot}`}; };
    inp.oninput=upd; w.querySelectorAll('[data-hz]').forEach(x=>x.onclick=()=>{ st.hz=+x.dataset.hz; w.querySelectorAll('[data-hz]').forEach(y=>y.classList.toggle('on',y===x)); upd(); }); requestAnimationFrame(upd);
  },
  crashes(b){
    if(!FFD) return b.append(noData());
    const rows=crashTable();
    const w=h(`<div class="panel stack"><div class="bars">${rows.map(r=>`<div class="bar" style="grid-template-columns:150px minmax(0,1fr) 60px"><span><b>${r.name}</b><br><span class="muted" style="font-size:12px">${r.peakL} → ${r.troughL}</span></span><span class="track" style="height:14px"><span class="fill over" style="width:${Math.min(100,Math.abs(r.dd)*100)}%"></span></span><span class="mono loss" style="text-align:right">${pct(r.dd,0)}</span></div>`).join('')}</div>
      <div class="r-hold">${rows.map(r=>`<div><span>${r.name}: back to the old high</span><b class="mono">${r.rec==null?'not within data':r.rec>=12?(r.rec/12).toFixed(1)+' years':r.rec+' months'}</b></div>`).join('')}</div>
      <p class="src-line">Month-end total returns of the US stock market, Ken French Data Library. Month-end data understates drops that happened within a month. Not adjusted for inflation.</p></div>`); b.append(w);
    CTX.widget={crashes:rows.map(r=>({name:r.name,drop:pct(r.dd,0),months_to_recover:r.rec}))};
  },
  timing(b){
    if(!FFD) return b.append(noData());
    const M=FFD.monthly, fy=Math.floor(M[0].ym/100), ly=Math.floor(M[M.length-1].ym/100);
    const w=h(`<div class="panel stack"><label class="field">Invest $10,000 starting in <b class="mono" data-v></b><input type="range" min="${fy+1}" max="${ly-10}" value="${Math.max(fy+1,ly-29)}"></label><div class="bars" data-b></div><p class="src-line" data-n></p></div>`); b.append(w);
    const upd=()=>{ const y=+w.querySelector('input').value; w.querySelector('[data-v]').textContent=`${y} (held to ${ly})`;
      const rs=M.filter(r=>r.ym>=y*100+1); const sorted=[...rs].sort((a,b)=>ffMkt(b)-ffMkt(a));
      const grow=skip=>{ const set=new Set(sorted.slice(0,skip)); let v=toC(10000); rs.forEach(r=>{ v=Math.round(v*(1+(set.has(r)?r.rf/100:ffMkt(r)))); }); return v; };
      const res=[0,5,10,20].map(k=>[k,grow(k)]); const mx=res[0][1];
      w.querySelector('[data-b]').innerHTML=res.map(([k,v])=>`<div class="bar" style="grid-template-columns:150px minmax(0,1fr) 90px"><span>${k?`Missed best ${k} months`:'Stayed invested'}</span><span class="track" style="height:14px"><span class="fill ${k?'over':''}" style="width:${Math.max(2,v/mx*100)}%"></span></span><span class="mono" style="text-align:right">${money(v)}</span></div>`).join('');
      w.querySelector('[data-n]').textContent=`Missed months earn the Treasury-bill rate instead. US market total returns, Ken French Data Library, ${y}–${ly}. Past performance does not guarantee future results.`;
      CTX.widget={start_year:y,stayed_invested:money(res[0][1]),missed_best_5:money(res[1][1]),missed_best_10:money(res[2][1]),missed_best_20:money(res[3][1])}; };
    w.querySelector('input').oninput=upd; upd();
  },
  value(b){
    if(!FFD) return b.append(noData());
    const A=FFD.annual; let g=1; const pts=[1]; A.forEach(r=>{ g*=1+r.hml/100; pts.push(g); });
    const dec={}; A.forEach(r=>{ const d=Math.floor(r.y/10)*10; dec[d]=(dec[d]||1)*(1+r.hml/100); });
    const w=h(`<div class="panel stack"><div class="chart-box" style="height:200px"><canvas></canvas></div>${legend([{label:'Growth of $1 in value stocks minus growth stocks (HML), cumulative',color:'--accent'}])}
      <div class="bars">${Object.entries(dec).map(([d,v])=>`<div class="dbar"><span>${d}s</span><span class="track"><span class="mid"></span><span class="fill" style="background:var(${v>=1?'--gain':'--loss'});${v>=1?`left:50%;width:${Math.min(50,(v-1)*50)}%`:`right:50%;width:${Math.min(50,(1-v)*50)}%`}"></span></span><span class="mono ${v>=1?'gain':'loss'}" style="text-align:right">${pct(v-1,0)}</span></div>`).join('')}</div>
      <p class="src-line">Fama/French HML factor (value minus growth), annual, Ken French Data Library. Past performance does not guarantee future results.</p></div>`); b.append(w);
    requestAnimationFrame(()=>drawLine(w.querySelector('canvas'),[{label:'HML',color:'--accent',values:pts.map(x=>Math.round(x*100)),fill:true}],{xLabel:i=>String(A[0].y+i-1)}));
    CTX.widget={value_minus_growth_by_decade:Object.fromEntries(Object.entries(dec).map(([d,v])=>[d+'s',pct(v-1,0)]))};
  },
  compound(b){
    const st={age:16,mon:100};
    const w=h(`<div class="panel stack"><div class="grid g2"><label class="field">Start at age <b class="mono" data-v="age"></b><input type="range" min="16" max="45" step="1" value="16" data-k="age"></label><label class="field">Invest each month <b class="mono" data-v="mon"></b><input type="range" min="25" max="500" step="25" value="100" data-k="mon"></label></div>
      <div class="kpis" data-k="k"></div><div class="chart-box" style="height:220px"><canvas></canvas></div><div data-k="lg"></div></div>`);
    b.append(w);
    const upd=()=>{ w.querySelectorAll('input').forEach(i=>st[i.dataset.k]=+i.value); w.querySelector('[data-v=age]').textContent=st.age; w.querySelector('[data-v=mon]').textContent='$'+st.mon;
      const yrs=65-st.age, inv=compoundMonthly(toC(st.mon),yrs,0.07), sav=compoundMonthly(toC(st.mon),yrs,0.02), put=toC(st.mon)*12*yrs;
      w.querySelector('[data-k=k]').innerHTML=`<div class="kpi"><div class="v gain">${money(inv.bal)}</div><div class="l">Invested at 7% by 65</div></div><div class="kpi"><div class="v">${money(sav.bal)}</div><div class="l">Savings at 2%</div></div><div class="kpi"><div class="v">${money(put)}</div><div class="l">You put in</div></div>`;
      const s=[{label:'Invested (7%)',color:'--gain',values:inv.path,fill:true},{label:'Savings (2%)',color:'--accent',values:sav.path},{label:'Put in',color:'--muted',values:inv.path.map((_,i)=>toC(st.mon)*12*i),width:1.5}];
      drawLine(w.querySelector('canvas'),s,{xLabel:i=>'Age '+(st.age+i)}); w.querySelector('[data-k=lg]').innerHTML=legend(s);
      CTX.widget={start_age:st.age,monthly:'$'+st.mon,invested_at_65:money(inv.bal),savings_at_65:money(sav.bal),put_in:money(put)}; };
    w.querySelectorAll('input').forEach(i=>i.oninput=upd); requestAnimationFrame(upd);
  },
  fees(b){
    const st={amt:10000,yrs:30,fee:1};
    const w=h(`<div class="panel stack"><div class="grid g3"><label class="field">Amount <b class="mono" data-v="amt"></b><input type="range" min="1000" max="50000" step="1000" value="10000" data-k="amt"></label><label class="field">Years <b class="mono" data-v="yrs"></b><input type="range" min="5" max="45" value="30" data-k="yrs"></label><label class="field">Fee <b class="mono" data-v="fee"></b><input type="range" min="0.25" max="2" step="0.05" value="1" data-k="fee"></label></div>
      <div class="kpis" data-k="k"></div><div class="chart-box" style="height:220px"><canvas></canvas></div><div data-k="lg"></div></div>`);
    b.append(w);
    const upd=()=>{ w.querySelectorAll('input').forEach(i=>st[i.dataset.k]=+i.value); w.querySelector('[data-v=amt]').textContent=money(toC(st.amt)); w.querySelector('[data-v=yrs]').textContent=st.yrs; w.querySelector('[data-v=fee]').textContent=st.fee.toFixed(2)+'%';
      const a=feeGrowth(toC(st.amt),st.yrs,0.07,0), f=feeGrowth(toC(st.amt),st.yrs,0.07,st.fee/100); const lost=a[st.yrs]-f[st.yrs];
      w.querySelector('[data-k=k]').innerHTML=`<div class="kpi"><div class="v gain">${money(a[st.yrs])}</div><div class="l">No fee, 7% a year</div></div><div class="kpi"><div class="v">${money(f[st.yrs])}</div><div class="l">With ${st.fee.toFixed(2)}% fee</div></div><div class="kpi"><div class="v loss">${money(lost)}</div><div class="l">Lost to fees (${(lost/a[st.yrs]*100).toFixed(0)}%)</div></div>`;
      const s=[{label:'No fee',color:'--gain',values:a,fill:true},{label:st.fee.toFixed(2)+'% fee',color:'--loss',values:f}];
      drawLine(w.querySelector('canvas'),s,{xLabel:i=>'Yr '+i}); w.querySelector('[data-k=lg]').innerHTML=legend(s);
      CTX.widget={amount:money(toC(st.amt)),years:st.yrs,fee:st.fee+'%',no_fee:money(a[st.yrs]),with_fee:money(f[st.yrs]),lost:money(lost)}; };
    w.querySelectorAll('input').forEach(i=>i.oninput=upd); requestAnimationFrame(upd);
  },
};
