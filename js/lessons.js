// Top bar, lesson path, lesson player, teach widgets.
/* ============================== TOP BAR ============================== */
function statsBar(extra=''){
  const st=streakNow();
  $('#stats').innerHTML = extra || `<span class="stat ${st?'fire':'off'}" role="img" aria-label="${st} day streak" title="Day streak">${I.fire}${st}</span><span class="stat xp" role="img" aria-label="${S.xp} XP" title="Total XP">${I.bolt}${S.xp}</span>`;
}

/* ============================== PATH ============================== */
const ZIG=[0,1,1.6,1,0,-1,-1.6,-1];
function renderPath(main){
  document.body.classList.remove('focus'); $('#mentor').classList.remove('open'); statsBar();
  const cur=currentNode(); setMentor(cur?cur.unit.mentor:'senior'); CTX={screen:'lesson path',rank:rank(),xp:S.xp,completed:Object.keys(S.done).length+' of '+NODES.length};
  const wrap=h(`<div class="stack" style="gap:8px"></div>`);
  UNITS.forEach((u,ui)=>{
    const m=MENTORS[u.mentor];
    wrap.append(h(`<div class="unit" style="background:var(${u.color})"><div><span class="eyebrow">Unit ${ui+1} · ${u.rank}</span><h2 style="margin-top:4px">${u.title}</h2></div><div class="who">${avatar(u.mentor)}<span>Mentor: <b>${m.name}</b></span></div></div>`));
    const path=h(`<div class="path"></div>`); let k=0;
    [...u.lessons.map(l=>NODE[l.id]),NODE[u.app.id]].forEach(n=>{
      const done=!!S.done[n.id], open=isUnlocked(n.id), here=cur&&cur.id===n.id;
      const icon= done? I.check : !open? I.lock : n.kind==='app'? I.chart : I.star;
      const w=h(`<div class="node-wrap ${n.kind==='app'?'is-app':''}" style="--o:${ZIG[k++%ZIG.length]};--uc:var(${u.color})">
        ${here?`<span class="ring"></span><span class="start-bubble">${n.kind==='app'?'SIMULATE':'START'}</span>`:''}
        <button class="node ${n.kind==='app'?'app':''} ${done?'done':''} ${open?'':'locked'}" aria-label="${esc(n.title)}${done?' (complete)':open?'':' (locked)'}">${icon}</button>
        <span class="node-label ${open?'':'locked'}">${n.kind==='app'?'<span class="eyebrow">Application</span><br>':''}${n.title}</span></div>`);
      w.querySelector('.node').onclick=()=>{ if(!open){ toast(`Finish "${prevTitle(n.id)}" to unlock this.`); return; } location.hash=n.id; };
      path.append(w);
    });
    wrap.append(path);
  });
  const lab=h(`<div class="lab-cta"><div><span class="eyebrow" style="color:var(--hl)">Practice anytime</span><h3 style="margin-top:4px;color:var(--tape-fg)">Scenario Lab: what happens when the Fed hikes rates, or before a midterm election?</h3></div><button class="btn">Open the lab</button></div>`);
  lab.querySelector('button').onclick=()=>location.hash='lab'; wrap.append(lab);
  const demo=h(`<label class="row muted" style="gap:8px;font-size:13px;justify-content:center;padding-block:10px"><input type="checkbox" ${S.unlockAll?'checked':''}> Demo mode: unlock every lesson (for judges and teammates)</label>`);
  demo.querySelector('input').onchange=e=>{ S.unlockAll=e.target.checked; save(); render(); }; wrap.append(demo);
  main.append(wrap);
  if(!chat.length) say('Hey, I\'m Maya. Each unit is a few short lessons, then an application where you run a simulation with fake money. Tap the glowing node to start. Ask me anything, anytime.');
  mentorTools(['What is a stock?','Why invest instead of save?','What does an analyst do?']);
  requestAnimationFrame(()=>{ const r=main.querySelector('.ring'); if(r) r.closest('.node-wrap').scrollIntoView({block:'center',behavior:'auto'}); });
}
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
  const m=MENTORS[mentorKey];
  CTX={screen:'lesson',lesson:CTX.lesson,question:item.q||item.title,answer_options:item.opts||item.bank||null};
  if(item.t==='teach'){
    b.append(h(`<div class="speech">${avatar(mentorKey,'52px')}<div class="bubble"><h3 style="margin-bottom:8px">${item.title}</h3><div class="teach-body">${item.body}</div></div></div>`));
    if(item.card) b.append(h(`<div style="max-width:380px">${card(CO[item.card])}</div>`));
    if(item.widget) WIDGETS[item.widget](b);
    const go=h(`<button class="btn go big" style="margin-left:auto">Continue</button>`); go.onclick=()=>done(null); sh.fin.append(go); go.focus({preventScroll:true});
    return;
  }
  let sel=null, check;
  b.append(h(`<h2 class="l-q">${esc(item.q)}</h2>`));
  if(item.card) b.append(h(`<div style="max-width:380px">${card(CO[item.card])}</div>`));
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
    const left=h(`<div style="min-width:0" role="status" aria-live="polite"><div class="fb-title">${ok?PRAISE[Math.floor(Math.random()*PRAISE.length)]:item.t==='match'?'Almost!':'Not quite'}</div>${!ok&&correctText?`<div class="fb-text"><b>Correct answer:</b> ${esc(correctText)}</div>`:''}${why?`<div class="fb-text">${esc(why)}</div>`:''}<button class="linkbtn" style="margin-top:4px">Ask ${m.name.split(' ')[0]} why</button></div>`);
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
const WIDGETS = {
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
