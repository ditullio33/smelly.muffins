// Scenario Lab practice screen.
/* ============================== SCENARIO LAB ============================== */
function renderLab(main){
  document.body.classList.remove('focus'); statsBar(); setMentor('intern');
  const p=h(`<div class="stack"><div><a href="#home" class="linkbtn">← Back to the path</a><div style="margin-top:10px"><span class="badge">Scenario Lab</span></div><h2 style="margin-top:8px">What moves the market?</h2><p class="muted" style="margin-top:6px;max-width:62ch">Pick a news event and see how each fictional company reacts. Sizes are scaled from real episodes in history. Real markets add a lot more noise.</p></div>
    <div class="row" id="sc">${Object.entries(SCEN).map(([k,s])=>`<button class="chip ${S.lab===k?'on':''}" data-s="${k}">${s.name}</button>`).join('')}</div><div class="panel stack" id="out"></div></div>`);
  main.append(p);
  const show=()=>{
    const s=SCEN[S.lab]; const ph=s.phases[0]; CTX={screen:'scenario lab',scenario:s.name};
    let rows = S.lab==='earnings' ? COMPANIES.map(c=>[c, c.id==='ZAPP'?earningsMove(c):0]) : COMPANIES.map(c=>[c, impact(c,ph)]);
    rows.sort((a,b)=>b[1]-a[1]);
    const extra = S.lab==='earnings'?[]:[['Bond fund',impact(BOND,ph)],['Index fund',rows.reduce((a,r)=>a+r[1],0)/rows.length]];
    const all=[...rows.map(([c,v])=>[c.name,v]),...extra]; const mx=Math.max(0.05,...all.map(r=>Math.abs(r[1])));
    const bar=([n,v])=>`<div class="dbar"><span>${n}</span><span class="track"><span class="mid"></span><span class="fill" style="background:var(${v>=0?'--gain':'--loss'});${v>=0?`left:50%;width:${v/mx*50}%`:`right:50%;width:${-v/mx*50}%`}"></span></span><span class="mono ${v>=0?'gain':'loss'}" style="text-align:right">${pct(v,0)}</span></div>`;
    const ph2=s.phases[1];
    $('#out').innerHTML=`<div class="news"><span class="flag ${S.lab==='rateCut'?'up':''}">BREAKING</span><span>${s.headline}</span></div>
      <div class="row" style="justify-content:space-between"><span class="eyebrow">First ${Math.max(1,Math.round((ph?.days||21)/21))} month(s)</span><span class="muted" style="font-size:12px">Based on ${s.basedOn}</span></div>
      <div class="bars">${rows.map(([c,v])=>bar([c.name,v])).join('')}${extra.length?'<div style="height:6px"></div>'+extra.map(bar).join(''):''}</div>
      <div class="callout"><b>Savings account:</b> ${s.savings}</div>
      ${ph2?`<p class="muted"><b>What comes next:</b> ${S.lab==='inflation'?'the Fed responds by raising rates, which drags on growth stocks and bonds.':S.lab==='midterm'?'once results are in, uncertainty fades and the market has historically rebounded.':'the economy heals and stocks begin a long recovery. Investors who sold at the bottom miss it.'}</p>`:''}
      <div class="callout good"><b>Why:</b> ${s.why}</div>`;
  };
  p.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ S.lab=b.dataset.s; p.querySelectorAll('[data-s]').forEach(x=>x.classList.toggle('on',x===b)); show(); save(); say(SCEN[S.lab].why.split('. ')[0]+'.'); });
  show(); mentorTools(['Why do banks like rate hikes?','Do elections crash the market?','What is a defensive stock?']);
}
