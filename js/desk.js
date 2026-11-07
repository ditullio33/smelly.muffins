// Runs a desk shift: alerts, panels, choices, shift report.
/* ============================== DESK SIMULATION: CONTROLLER ============================== */
let ROOM=null;
const CLOCKS=['7:42 AM','9:15 AM','11:30 AM','1:50 PM','4:05 PM','6:40 PM','9:10 PM','10:45 PM'];
function renderRoom(main,node){
  document.body.classList.add('focus'); setMentor(node.unit.mentor); statsBar(`<span class="stat xp">${I.bolt}${S.xp}</span>`);
  const shift=SHIFTS[node.id]; const sc=shift.scenarios; const m=MENTORS[shift.who];
  const st={h:{},month:0,hist:[]}; shift.init(st); const book=textbookRun(shift);
  let i=-1, results=[], active=null, answered=false, headline='', panelOpen=false;
  const notes=node.unit.lessons.map(l=>l.title);
  const wrap=h(`<div class="room" style="--uc:var(${node.unit.color})">
    <div class="r-stage" id="stage"><div class="r-fallback"><span>3D view unavailable on this device. Use the buttons below; everything still works.</span></div></div>
    <div class="r-title"><span class="r-logo">${BULL_LOGO}</span><div><b>The Bullpen</b><div class="r-sub">Unit ${node.unit.n} application · ${shift.desk}</div></div></div>
    <div class="r-hud"><div class="r-chip"><span class="r-k">Task</span><b id="r-task">0/${sc.length}</b></div><div class="r-chip"><span class="r-k">Score</span><b id="r-score">0</b></div><div class="r-chip"><span class="r-k">Net worth</span><b id="r-nw">—</b></div>
      <button class="r-btn" id="r-ask">${avatar(shift.who,'22px')}Ask ${m.name.split(' ')[0]}</button><button class="r-btn icon" id="r-exit" aria-label="Leave the desk">${I.x}</button></div>
    <div class="r-flash" id="r-flash" role="status" aria-live="polite" hidden></div>
    <div class="r-tip" id="r-tip" hidden></div>
    <div class="r-intro" id="r-intro"><h3>${node.title}</h3><p>${shift.intro}</p><p class="r-help">Drag to look around. Scroll or pinch to lean in. Click anything on the desk to zoom in.</p><button class="r-go" id="r-start">Start the shift</button></div>
    <div class="r-panel-wrap" id="r-pw" hidden><div class="r-panel" id="r-panel" role="dialog" aria-modal="false" aria-label="Desk object"></div></div>
    <nav class="r-dock" id="r-dock" aria-label="Desk objects"></nav>
  </div>`);
  main.append(wrap);
  ROOM?.dispose(); ROOM=Room3D(wrap.querySelector('#stage'),{plate:node.unit.title.replace(/ \(.*\)/,'').toUpperCase(),notes,tall:node.unit.n>=9});
  const dockItems=[['back','Sit back'],['monitor','Monitor'],['phone','Phone'],['inbox','Inbox'],['jar','Emergency jar'],['calendar','Calendar'],['corkboard','Corkboard'],['window','Window']];
  const dock=wrap.querySelector('#r-dock');
  const drawDock=()=>{ dock.innerHTML=dockItems.map(([k,n])=>`<button class="r-dk ${active&&!answered&&sc[i]?.obj===k?'alert':''}" data-k="${k}">${n}</button>`).join(''); dock.querySelectorAll('button').forEach(b=>b.onclick=()=>b.dataset.k==='back'?sitBack():open(b.dataset.k)); };
  const tip=wrap.querySelector('#r-tip');
  ROOM.onHover=(n,e)=>{ if(!n||panelOpen){ tip.hidden=true; return; } tip.hidden=false; tip.textContent=OBJ_NAMES[n]+(sc[i]?.obj===n&&!answered?' · new':'' ); if(e){ tip.style.left=e.clientX+14+'px'; tip.style.top=e.clientY+14+'px'; } };
  ROOM.onPick=n=>open(n);
  const hud=()=>{ $('#r-task').textContent=`${Math.max(0,Math.min(i+1,sc.length))}/${sc.length}`; $('#r-score').textContent=results.filter(r=>r.ok).length; $('#r-nw').textContent=PF.tot(st)?money(PF.tot(st)):'—'; };
  const holdings=()=>Object.entries(st.h).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([k,v])=>[lab(k),v]);
  const refresh=()=>{ const tt=PF.tot(st);
    ROOM.update('monitor',{clock:CLOCKS[Math.max(0,i)%CLOCKS.length],total:tt||null,start:st.start,hist:st.hist,holdings:holdings(),headline,alert:active&&!answered&&sc[i].obj==='monitor'});
    ROOM.update('phone',{clock:CLOCKS[Math.max(0,i)%CLOCKS.length].replace(/ (AM|PM)/,''),notif:active&&!answered&&sc[i].phone?sc[i].title:null});
    ROOM.update('calendar',{month:`MONTH ${st.month+1}`,day:(st.month*7)%30});
    ROOM.update('cork',{notes,alert:active&&!answered&&sc[i].obj==='corkboard'});
    ROOM.update('jar',{amt:money(st.h.jar||0),cents:st.h.jar||0});
    hud(); drawDock();
    CTX={screen:'3D desk application',unit:node.unit.title,task:sc[i]?.title,portfolio:Object.fromEntries(holdings().map(([n,v])=>[n,money(v)])),net_worth:money(tt),latest_news:headline};
  };
  const flash=(txt)=>{ if(!txt) return; headline=txt; const f=$('#r-flash'); f.textContent=txt; f.hidden=false; clearTimeout(flash.t); flash.t=setTimeout(()=>f.hidden=true,6500); };
  const pw=wrap.querySelector('#r-pw'), panel=wrap.querySelector('#r-panel');
  const showPanel=(cls,html)=>{ $('#r-flash').hidden=true; panel.className='r-panel '+cls; panel.innerHTML=html; pw.hidden=false; panelOpen=true; tip.hidden=true; panel.querySelector('.r-close')?.addEventListener('click',sitBack); panel.scrollTop=0; const t=panel.querySelector('h3'); if(t) panel.setAttribute('aria-label',t.textContent); requestAnimationFrame(()=>(panel.querySelector('.r-choices .choice:not([disabled])')||panel.querySelector('.r-close'))?.focus({preventScroll:true})); };
  const hidePanel=()=>{ pw.hidden=true; panelOpen=false; };
  function sitBack(){ hidePanel(); ROOM.sitBack(); }
  const STYLE={monitor:'term',phone:'phone',inbox:'paper',jar:'glass',calendar:'paper',corkboard:'paper',window:'glass'};
  function open(name){
    hidePanel(); const isTask=active&&!answered&&sc[i].obj===name;
    ROOM.focus(name,()=>{ isTask?taskPanel(name):idlePanel(name); });
  }
  const head=(from,title)=>`<div class="r-ph"><div><span class="r-from">${from}</span><h3>${title}</h3></div><button class="r-close" aria-label="Back to desk">${I.x}</button></div>`;
  function idlePanel(name){
    const tt=PF.tot(st);
    const body={
      monitor:`${head('Terminal','Your portfolio')}<div class="kpis"><div class="kpi"><div class="v">${tt?money(tt):'—'}</div><div class="l">Net worth</div></div><div class="kpi"><div class="v">${tt&&st.start?fmtPct(pctOf(tt,st.start)):'—'}</div><div class="l">Since start</div></div></div><div class="r-hold">${holdings().map(([n,v])=>`<div><span>${n}</span><b class="mono">${money(v)}</b></div>`).join('')||'<p class="muted">Nothing invested yet.</p>'}</div>${headline?`<p class="r-news">${esc(headline)}</p>`:''}`,
      phone:`${head('Phone','Messages')}<div class="bub them">${active&&!answered?'Check your other notifications. Something on your desk needs you.':'No new messages. Enjoy the quiet while it lasts.'}</div>`,
      inbox:`${head('Inbox','No new memos')}<p>Your mentor will drop work here when it's ready.</p>`,
      jar:`${head('Emergency jar','Your cash cushion')}<p>Inside: <b>${money(st.h.jar||0)}</b>.</p><p class="muted">Guideline: 3–6 months of bills in cash before you invest.</p>`,
      calendar:`${head('Calendar',`Month ${st.month+1}`)}<p>${st.month?`${st.month} months have passed since you sat down.`:'Your first day at the desk.'}</p>`,
      corkboard:`${head('Corkboard','What you learned in this unit')}<ul class="r-notes">${node.unit.lessons.map(l=>`<li><b>${l.title}</b></li>`).join('')}</ul><p class="muted">Every task on this desk tests one of these lessons.</p>`,
      window:`${head('Window','The city outside')}<p>${node.id==='a3'?'From the corner office you can see the whole financial district.':'The market never sleeps, but you should.'}</p>`,
    }[name];
    showPanel(STYLE[name],body);
  }
  function choicesFor(s){ return s.choicesFn?s.choicesFn(st):s.choices; }
  function taskPanel(name){
    const s=sc[i]; if(s.kind==='pitch') return pitchPanel(s);
    const chs=choicesFor(s); const order=chs.map((c,k)=>[c,k]);
    showPanel(STYLE[name]+(s.phone?' chat':''),`${head(s.from,s.title)}<div class="r-body">${s.body(st)}</div><div class="r-choices">${order.map(([c,k])=>`<button class="choice" data-k="${k}" ${c.disabled?'disabled':''}><span>${esc(c.t)}${c.disabled?` <span class="muted">(${c.why})</span>`:''}</span></button>`).join('')}</div><div id="r-fb"></div>`);
    panel.querySelectorAll('.r-choices .choice').forEach(b=>b.onclick=()=>choose(s,chs[+b.dataset.k],b,chs));
  }
  function choose(s,c,btn,chs){
    if(answered) return; answered=true; panel.querySelectorAll('.r-choices .choice').forEach(x=>x.disabled=true); btn.classList.add(c.ok?'right':'wrong');
    if(!c.ok){ const best=[...panel.querySelectorAll('.r-choices .choice')].find(x=>chs[+x.dataset.k].ok&&!chs[+x.dataset.k].disabled); best?.classList.add('right'); }
    c.apply?.(st); results.push({title:s.title,ok:!!c.ok,pick:c.t,fb:c.fb,lesson:s.lesson});
    const L=NODE[s.lesson];
    panel.querySelector('#r-fb').innerHTML=`<div class="r-verdict ${c.ok?'good':'bad'}"><b>${c.ok?'Good call.':'Not the best move.'}</b> ${esc(c.fb)}<div class="r-lesson">Lesson: ${L.title}</div><div class="row" style="margin-top:10px;gap:8px"><button class="r-go" id="r-next">Continue</button><button class="linkbtn" id="r-why">Ask ${m.name.split(' ')[0]} why</button></div></div>`;
    $('#r-why').onclick=()=>{ openMentor(); ask(`I chose "${c.t}" for "${s.title}". Why is that ${c.ok?'right':'not the best move'}?`, c.fb); };
    $('#r-next').onclick=()=>{ sitBack(); setTimeout(()=>{ const hl=s.after?.(st); if(hl){ st.hist.push(PF.tot(st)); flash(hl); } active=null; refresh(); setTimeout(next, hl?1400:500); }, ROOM.ok?650:0); };
    $('#r-next').focus({preventScroll:true});
    say(c.ok?c.fb:`${c.fb} Look back at "${L.title}".`); refresh();
  }
  function pitchPanel(s){
    const T={co:'MSFT',dec:'buy',reason:'',risk:''};
    showPanel('term',`${head(s.from,s.title)}<p>Pick a company, decide buy or pass, back it with at least two numbers from the card, and name the biggest risk.</p>
      <div class="grid g2" style="align-items:start"><div class="stack"><label class="field">Company<select id="pco">${REAL.map(c=>`<option value="${c.id}">${c.name} (${c.id})</option>`).join('')}</select></label><div id="pcard"></div></div>
      <div class="stack"><div class="row"><button class="chip on" data-d="buy">Buy</button><button class="chip" data-d="pass">Pass</button></div><label class="field">Why?<textarea id="prs" placeholder="It keeps 41 cents of every dollar as profit and has low debt…"></textarea></label><label class="field">Biggest risk<textarea id="prk" placeholder="At about 28× earnings, if growth slows the price could fall…"></textarea></label><button class="r-go" id="psub">Submit pitch</button><div id="r-fb"></div></div></div>`);
    const sc_=()=>{ $('#pcard').innerHTML=card(RC[T.co]); }; sc_();
    $('#pco').onchange=()=>{ T.co=$('#pco').value; sc_(); };
    panel.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{ T.dec=b.dataset.d; panel.querySelectorAll('[data-d]').forEach(x=>x.classList.toggle('on',x===b)); });
    $('#psub').onclick=()=>{ T.reason=$('#prs').value; T.risk=$('#prk').value; const c=RC[T.co];
      const cats={growth:/grow|sales|revenue/i,profit:/profit|margin|cents|¢|keeps/i,debt:/debt|borrow|owe|loan/i,valuation:/p\/?e|expensive|cheap|price|pricey|valu|cap|\d+\s*x|×/i,dividend:/dividend|yield/i,edge:/edge|moat|copy|competit|switch|patent|brand|loyal|only/i};
      const used=Object.entries(cats).filter(([,re])=>re.test(T.reason)).map(([k])=>k);
      const r1=T.reason.trim().length>=30, r2=used.length>=2, r3=T.risk.trim().length>=15&&/risk|could|if|competit|debt|rate|recession|slow|fall|drop|expensive|pricey|lose|trend|oil|patent/i.test(T.risk);
      const score=[r1,r2,r3].filter(Boolean).length; const ok=score>=2;
      $('#r-fb').innerHTML=`<div class="r-verdict ${ok?'good':'bad'}"><b>Score ${score}/3.</b><ul class="checks" style="margin-top:6px"><li><span class="m">${r1?'✓':'✗'}</span>Clear reason</li><li><span class="m">${r2?'✓':'✗'}</span>Two+ card stats (${used.join(', ')||'none'})</li><li><span class="m">${r3?'✓':'✗'}</span>Specific risk</li></ul><div class="row" style="margin-top:10px;gap:8px">${ok?'<button class="r-go" id="r-next">Finish the shift</button>':'<span class="muted">Revise and resubmit.</span>'}</div></div>`;
      const fb=score===3?`Solid pitch on ${c.name}. Next time, tell me what price you'd pay.`:`${score}/3. ${!r2?'Use at least two numbers from the card. ':''}${!r3?'Name a specific risk. ':''}`;
      aiFeedback(`Student pitch on real company ${c.name} (${c.sector}). Card data (${REAL_SRC}): market cap ${bigMoney(c.mcap)}, P/E ${c.pe}, net margin ${c.margin??'n/a'}%, debt-to-equity ${c.de}, dividend yield ${c.div??'n/a'}%. Do not give buy or sell advice; coach the reasoning only. Decision ${T.dec}. Reason "${T.reason}". Risk "${T.risk}". Game score ${score}/3.`, fb);
      if(ok){ $('#r-next').onclick=()=>{ if(answered) return; answered=true; results.push({title:s.title,ok:true,pick:`${T.dec} ${c.name}`,fb:`Pitch scored ${score}/3.`,lesson:s.lesson}); sitBack(); active=null; refresh(); setTimeout(next,600); }; }
    };
  }
  function next(){
    i++; refresh();
    if(i>=sc.length) return report();
    const s=sc[i]; answered=false; active=s; ROOM.setTime(Math.min(0.95,0.08+i*(0.9/Math.max(1,sc.length-1))));
    const hl=s.before?.(st); if(hl){ st.hist.push(PF.tot(st)); flash(hl); }
    ROOM.setAlert(s.obj); refresh(); toast(s.alert); say(`${s.alert}. Head to the ${OBJ_NAMES[s.obj].toLowerCase()}.`);
  }
  function report(){
    ROOM.setAlert(null); active=null; const right=results.filter(r=>r.ok).length, total=results.length, fin=PF.tot(st); const pass=right>=shift.pass;
    if(pass){ S.done[node.id]=true; addXP(30); save(); confetti(); }
    const nextU=UNITS[UNITS.indexOf(node.unit)+1];
    showPanel('glass report',`<div class="r-ph"><div><span class="r-from">Shift report · ${m.name}</span><h3>${pass?(nextU?`Unit ${node.unit.n} complete! Next: ${nextU.title}`:'You finished the whole course!'):'Not quite yet'}</h3></div></div>
      <div class="kpis"><div class="kpi"><div class="v">${right}/${total}</div><div class="l">Good decisions (need ${shift.pass})</div></div>${(fin||book)?`<div class="kpi"><div class="v ${fin>=book?'gain':'loss'}">${money(fin)}</div><div class="l">Your ending value</div></div><div class="kpi"><div class="v">${money(book)}</div><div class="l">If you'd made every textbook move</div></div>`:''}</div>
      <ul class="r-report">${results.map(r=>`<li class="${r.ok?'ok':'no'}"><span class="m">${r.ok?'✓':'✗'}</span><div><b>${esc(r.title)}</b><div class="muted">You chose: ${esc(r.pick)}</div><div>${esc(r.fb)}</div>${r.ok?'':`<a class="linkbtn" href="#${r.lesson}">Review: ${NODE[r.lesson].title}</a>`}</div></li>`).join('')}</ul>
      <div class="row" style="gap:8px;justify-content:flex-end">${pass?'':'<button class="r-btn" id="r-retry">Retry the shift</button>'}<button class="r-go" id="r-done">${pass?'Back to the path':'Back to lessons'}</button></div>`);
    $('#r-done').onclick=()=>location.hash='home'; $('#r-retry')?.addEventListener('click',()=>render());
    say(pass?`Shift complete: ${right} of ${total} good calls. ${!(fin||book)?'':fin<book?`The textbook path would have ended at ${money(book)}. See which decisions cost you.`:'You matched the textbook path.'}`:`${right} of ${total}. Review the lessons marked on your report, then retry the shift.`);
    CTX={screen:'shift report',decisions:results.map(r=>({task:r.title,good:r.ok,chose:r.pick})),ending:money(fin),textbook_ending:money(book),passed:pass};
  }
  $('#r-exit').onclick=()=>{ if(i<0||i>=sc.length){ location.hash='home'; return; } confirmDialog({title:'Leave the desk?',body:'This shift\'s progress will be lost. You can restart it anytime.',stay:'Keep working',leave:'Leave',onLeave:()=>location.hash='home'}); }; $('#r-ask').onclick=openMentor;
  $('#r-start').onclick=()=>{ $('#r-intro').remove(); next(); };
  wrap.addEventListener('keydown',e=>{ if(e.key==='Escape'&&panelOpen&&!document.querySelector('.dlg-scrim')) sitBack(); });
  refresh(); say(shift.intro);
  mentorTools(['What should I do when the market drops?','How do I know a company is strong?','Why keep an emergency fund?']);
}
