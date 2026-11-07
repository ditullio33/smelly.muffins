// Portfolio model + the scenario scripts for each unit's desk shift.
/* ============================== DESK SIMULATION: PORTFOLIO MODEL ============================== */
// Holdings are integer cents keyed by asset. Market moves come from the same scenario factors as the Scenario Lab,
// applied deterministically so every outcome can be explained in plain words.
const MKT={beta:1,rate:-1.1,rec:-0.9,inf:-0.2};
function evRet(id,k=0){ const ph=SCEN[id].phases[k]; const r={}; let sum=0; COMPANIES.forEach(c=>{ r[c.id]=impact(c,ph); sum+=r[c.id]; }); r.INDEX=sum/COMPANIES.length; r.bnd=impact(BOND,ph); r.stk=impact(MKT,ph); return r; }
const LABEL={sav:'Savings',cash:'Cash',jar:'Emergency jar',INDEX:'Index fund',stk:'Stock index fund',bnd:'Bond fund'};
const lab=k=>LABEL[k]||CO[k]?.name||k;
const SAFE=new Set(['sav','cash','jar']);
const PF={
  tot:st=>Object.values(st.h).reduce((a,b)=>a+b,0),
  inv:st=>Object.entries(st.h).filter(([k])=>!SAFE.has(k)).reduce((a,[,v])=>a+v,0),
  set(st,o){ st.h={}; for(const k in o) if(o[k]) st.h[k]=toC(o[k]); },
  move(st,r){ for(const k in st.h) if(r[k]!=null) st.h[k]=Math.round(st.h[k]*(1+r[k])); },
  drift(st,m){ for(const k in st.h){ const y=SAFE.has(k)?0.02:k==='bnd'?0.04:0.07; const fee=SAFE.has(k)?0:(st.fee||0); st.h[k]=Math.round(st.h[k]*Math.pow(1+(y-fee)/12,m)); } st.month+=m; },
  toSafe(st,key='sav'){ let t=0; for(const k in st.h) if(!SAFE.has(k)){ t+=st.h[k]; st.h[k]=0; } st.h[key]=(st.h[key]||0)+t; },
  add(st,k,c){ st.h[k]=(st.h[k]||0)+c; },
  spend(st,c,safeKey,cost=c){ if(st.start) st.start-=cost; const keys=safeKey?[safeKey]:[...SAFE]; let need=c, fromSafe=0; for(const k of keys){ const t=Math.min(st.h[k]||0,need); if(t>0){ st.h[k]-=t; need-=t; fromSafe+=t; } }
    let sold=0; if(need>0){ const inv=PF.inv(st); for(const k in st.h) if(!SAFE.has(k)&&inv>0){ const t=Math.round(need*st.h[k]/inv); st.h[k]-=t; sold+=t; } } return {fromSafe,sold}; },
  mix(st){ const s=(st.h.stk||0)+(st.h.PTRA||0), b=st.h.bnd||0; return s+b? s/(s+b):0; },
};
const pctOf=(a,b)=>b?((a/b-1)*100):0;
const fmtPct=x=>(x>=0?'+':'')+x.toFixed(1)+'%';

/* ============================== DESK SIMULATION: SCENARIOS ============================== */
// Each unit's application is a "shift" at the desk. Alerts arrive on an object; you respond; the market reacts.
const SHIFTS = {
 a1:{ desk:'Intern desk', who:'intern', intro:'It\'s your first week. Your mentor will send work to your inbox, your phone will buzz, and the market will move. Use what you learned.',
  init(st){ PF.set(st,{}); st.start=toC(1000); },
  scenarios:[
   {obj:'inbox',alert:'New memo in your inbox',from:'Memo · Maya Chen',title:'Your first paycheck: $1,000',lesson:'l1',
    body:()=>`<p>You just got paid <b>$1,000</b> for your internship.</p><p>Next month you need <b>$400 for textbooks</b>. The other $600 you won't touch for years.</p><p><b>Where does the money go?</b></p>`,
    choices:[
     {t:'$400 in savings for textbooks, $600 in a total market index fund',ok:true,fb:'Short-term money stays safe. Long-term money goes to work.',apply:st=>PF.set(st,{sav:400,INDEX:600})},
     {t:'All $1,000 into ZipZap Social. Everyone\'s talking about it',ok:false,fb:'Money you need next month shouldn\'t ride on one stock. That\'s two mistakes: short-term money in stocks, and no diversification.',apply:st=>PF.set(st,{ZAPP:1000})},
     {t:'All $1,000 in savings. Investing is too risky',ok:false,fb:'Safe for the $400, but the $600 you won\'t need for years would barely grow at 2%.',apply:st=>PF.set(st,{sav:1000})},
    ],
    after:st=>{ PF.drift(st,1); const r=PF.spend(st,toC(400)); return r.sold?`Textbooks: $400. Your savings came up short, so you sold ${money(r.sold)} of investments to cover it.`:'Textbooks paid: $400 from savings. Nothing had to be sold.'; }},
   {obj:'phone',alert:'Your phone buzzed: text from Tyler',from:'Text · Tyler (friend)',title:'"ZipZap DOUBLED last year!!"',lesson:'l3',phone:true,
    body:()=>`<div class="bub them">yo ZipZap doubled last year!!! put EVERYTHING in before it's too late</div><div class="bub them">trust me it can't lose</div>`,
    choices:[
     {t:'"Past gains don\'t guarantee future ones. I\'m keeping my index fund."',ok:true,fb:'Exactly. Last year\'s winner can be next year\'s loser.'},
     {t:'Move everything into ZipZap',ok:false,fb:'You just concentrated all your money in one stock because of its price chart, not the business.',apply:st=>{ const t=PF.inv(st)+(st.h.sav||0); PF.set(st,{}); st.h.ZAPP=t; }},
     {t:'Move half of your investments into ZipZap',ok:false,fb:'Better than all of it, but you\'re still chasing last year\'s winner.',apply:st=>{ const t=Math.round(PF.inv(st)/2); PF.spend(st,0); for(const k in st.h) if(!SAFE.has(k)) st.h[k]=Math.round(st.h[k]/2); PF.add(st,'ZAPP',t); }},
    ],
    after:st=>{ PF.drift(st,1); PF.move(st,{ZAPP:earningsMove(CO.ZAPP),INDEX:0.01}); return `EARNINGS SHOCK: ZipZap reports slowing user growth. The stock plunges ${(Math.abs(earningsMove(CO.ZAPP))*100).toFixed(0)}% overnight.`; }},
   {obj:'monitor',alert:'Research request on your monitor',from:'Terminal · Maya Chen',title:'Know the business',lesson:'l4',
    body:()=>`<p>Maya wants to see if you can research before you buy.</p><p><b>In one sentence: how does Heartland Bank make money?</b></p><div style="max-width:360px">${card(CO.HLBK)}</div>`,
    choices:CO.HLBK.how.map((t,i)=>({t,ok:i===0,fb:i===0?'Right. It pays you a little on savings and charges borrowers more. The gap is its profit.':'Re-read the card. A bank\'s product is money itself: it borrows cheap and lends at a higher rate.'})),
    after:st=>{ PF.drift(st,2); return 'Two quiet months go by. Your money keeps compounding.'; }},
   {obj:'phone',alert:'MARKET ALERT on your phone',from:'Alert · Bullpen Markets',title:'Stocks fall 15% this month',lesson:'l3',phone:true,
    before:st=>{ PF.move(st,{INDEX:-0.15,ZAPP:-0.25}); return 'MARKET DROP: stocks fall 15% in a month as investors panic. Headlines call it "the worst month in years."'; },
    body:st=>`<div class="bub alert"><b>Markets tumble 15%.</b> Your investments are now worth <b>${money(PF.inv(st))}</b>.</div><div class="bub them">Maya: what's your move? You won't need this money for years.</div>`,
    choices:[
     {t:'Hold. Drops are normal and I don\'t need this money for years',ok:true,fb:'Selling would turn a temporary drop into a permanent loss.'},
     {t:'Hold, and invest my next $200 paycheck too while prices are low',ok:true,fb:'Even better. Your $200 buys shares on sale.',apply:st=>PF.add(st,'INDEX',toC(200))},
     {t:'Sell everything and move it to savings until things calm down',ok:false,fb:'You locked in the loss. By the time things "feel safe," prices have usually recovered.',apply:st=>PF.toSafe(st)},
    ],
    after:st=>{ PF.move(st,{INDEX:0.17}); PF.drift(st,120); PF.move(st,{ZAPP:-0.35}); return 'FAST-FORWARD 10 YEARS. The market recovered within a year and kept compounding. ZipZap\'s users moved to a newer app, and its stock never got back to its high.'; }},
  ], pass:3 },

 a2:{ desk:'Junior Analyst desk', who:'junior', intro:'You\'re managing the Patel family\'s $10,000. Marcus will send tasks. News and client calls will come through your phone.',
  init(st){ PF.set(st,{ZAPP:4000,NMBS:3000,STRM:3000}); st.start=toC(10000); },
  scenarios:[
   {obj:'inbox',alert:'Client review in your inbox',from:'Memo · Marcus Reed',title:'The Patels\' portfolio',lesson:'l5',
    body:st=>`<p>The Patels have <b>$10,000</b>: ZipZap 40%, Nimbus 30%, StreamVerse 30%. That's <b>100% tech and media</b>.</p><p>They want growth but can't afford a disaster. <b>What do you recommend?</b></p>${sectorBars(st)}`,
    choices:[
     {t:'Move half into the index fund. Spread the rest across Nimbus, healthcare, groceries, a bank and a utility',ok:true,fb:'Now no sector is more than about 20%. One bad headline can\'t sink them.',apply:st=>PF.set(st,{INDEX:5000,NMBS:1000,VTLS:1000,FRSH:1000,HLBK:1000,BGPW:1000})},
     {t:'Add more ZipZap. It grows fastest',ok:false,fb:'You made the concentration worse. All their money now rides on one sector.',apply:st=>PF.set(st,{ZAPP:6000,NMBS:2000,STRM:2000})},
     {t:'Sell everything and hold cash until markets feel safer',ok:false,fb:'Cash is safe, but $10,000 meant for growth now earns almost nothing.',apply:st=>PF.set(st,{cash:10000})},
    ], after:st=>{ PF.drift(st,2); return 'Two months pass.'; }},
   {obj:'monitor',alert:'Research request on your monitor',from:'Terminal · Marcus Reed',title:'Which tech business is strongest?',lesson:'l7',
    body:()=>`<p>The Patels want to own one strong tech company. Compare the cards.</p><div class="grid g3">${['NMBS','ZAPP','STRM'].map(id=>card(CO[id])).join('')}</div>`,
    choices:[
     {t:'Nimbus Cloud: 22% growth, keeps 26¢ per $1, low debt, customers rarely leave',ok:true,fb:'Profitable growth with low debt. Just remember it isn\'t cheap at 34× profits.'},
     {t:'ZipZap Social: fastest growth at 38%',ok:false,fb:'It keeps only 6¢ per dollar and costs 85× profits. Fast growth without profit is fragile.'},
     {t:'StreamVerse: famous shows',ok:false,fb:'High debt and only 5¢ kept per dollar, in a crowded market.'},
    ], after:st=>{ PF.drift(st,1); return 'Another month passes.'; }},
   {obj:'phone',alert:'BREAKING NEWS on your phone',from:'Alert · Bullpen Markets',title:'The Fed raises interest rates',lesson:'l8',phone:true,
    before:st=>{ PF.move(st,evRet('rateHike')); return `${SCEN.rateHike.headline} (Based on ${SCEN.rateHike.basedOn}.)`; },
    body:st=>`<div class="bub alert"><b>FED HIKES RATES.</b> The Patels' account is now <b>${money(PF.tot(st))}</b> (${fmtPct(pctOf(PF.tot(st),st.start))}).</div><div class="bub them">Mrs. Patel: Which of our investments is hurt most by this? Should we worry?</div>`,
    choices:[
     {t:'"Fast-growing, high-P/E stocks like ZipZap fall most. We\'re diversified, so we stay the course."',ok:true,fb:'Right. Rate hikes act like gravity on growth stocks. Diversification limits the damage.'},
     {t:'"Banks get hurt most. Let\'s sell Heartland."',ok:false,fb:'Banks often hold up better when rates rise. They earn more on loans.'},
     {t:'"Interest rates don\'t affect stocks."',ok:false,fb:'They do. Higher rates make future profits worth less today.'},
    ], after:st=>{ PF.drift(st,3); return 'Three months pass. Markets stay shaky.'; }},
   {obj:'phone',alert:'Incoming call: Mr. Patel',from:'Call · Mr. Patel (client)',title:'"Sell everything!"',lesson:'l8',phone:true,
    before:st=>{ st.peak=Math.max(st.peak||0,PF.tot(st)); PF.move(st,evRet('recession')); return `${SCEN.recession.headline} (Based on ${SCEN.recession.basedOn}.)`; },
    body:st=>`<div class="bub alert"><b>RECESSION.</b> Account: <b>${money(PF.tot(st))}</b>, down ${Math.abs(pctOf(PF.tot(st),st.start)).toFixed(0)}% from where you started.</div><div class="bub them">Mr. Patel: We're losing money every day! Sell everything before it gets worse!</div>`,
    choices:[
     {t:'"Recessions end. Selling now locks in the loss. Our groceries, utilities and healthcare are holding up better."',ok:true,fb:'You kept your client invested for the recovery. That\'s the job.'},
     {t:'"You\'re right. Let\'s sell everything."',ok:false,fb:'You sold at the bottom. The recovery will happen without them.',apply:st=>PF.toSafe(st,'cash')},
     {t:'"Let\'s go all-in on ZipZap to win it back fast."',ok:false,fb:'Doubling down on one risky stock to "win it back" is gambling, not investing.',apply:st=>{ const t=PF.tot(st); PF.set(st,{}); st.h.ZAPP=t; }},
    ]},
   {obj:'calendar',alert:'Calendar reminder',from:'Calendar · Monthly deposit',title:'Monthly contribution: $500',lesson:'l8',
    body:()=>`<p>The Patels add <b>$500 every month</b>. Markets are still down and the news is gloomy.</p><p><b>What do you do with the next six deposits ($3,000)?</b></p>`,
    choices:[
     {t:'Keep investing on schedule. Each $500 buys more shares while prices are low',ok:true,fb:'Dollar-cost averaging. You bought on sale.',apply:st=>PF.add(st,'INDEX',toC(3000))},
     {t:'Pause and keep it in cash until the news gets better',ok:false,fb:'By the time news improves, prices have usually already bounced.',apply:st=>PF.add(st,'cash',toC(3000))},
    ],
    after:st=>{ PF.move(st,evRet('recession',1)); PF.drift(st,12); return 'THE RECOVERY: a year later the economy is growing again and stocks have bounced back.'; }},
  ], pass:4 },

 a3:{ desk:'Senior Analyst office', who:'senior', intro:'You have $20,000, add nothing new, and pay $2,000 a month in bills. Dana will test every decision over the next 20 years.',
  init(st){ PF.set(st,{cash:20000}); st.start=toC(20000); st.fee=0; },
  scenarios:[
   {obj:'inbox',alert:'New memo in your inbox',from:'Memo · Dana Okafor',title:'Pick a fund for your stocks',lesson:'l9',
    body:()=>`<p>Two funds own nearly the same stocks.</p><div class="grid g2"><div class="cc"><b>LowCost Total Market Index</b><span class="muted">Fee: 0.05% a year. Owns the whole market.</span></div><div class="cc"><b>Premier Active Growth Fund</b><span class="muted">Fee: 1.20% a year. "Our star managers aim to beat the market!"</span></div></div>`,
    choices:[
     {t:'LowCost Index at 0.05%',ok:true,fb:'Most active funds trail the index over time, mainly because of fees.',apply:st=>{st.fee=0.0005;st.fund='low'}},
     {t:'Premier Active at 1.20%. Star managers should beat the market',ok:false,fb:'A 1.2% fee comes out every year, win or lose. Over 20 years that\'s a big chunk.',apply:st=>{st.fee=0.012;st.fund='high'}},
    ]},
   {obj:'jar',alert:'Set up your emergency jar',from:'Emergency jar',title:'How much cash do you keep?',lesson:'l10',
    body:()=>`<p>Your bills are <b>$2,000 a month</b>. Whatever you don't keep in the jar gets invested: 70% stocks, 30% bonds.</p>`,
    choices:[
     {t:'$0. Invest everything',ok:false,fb:'No cushion means a surprise bill could force you to sell at a bad time.',apply:st=>setupJar(st,0)},
     {t:'$2,000 (1 month of bills)',ok:false,fb:'Better, but one month isn\'t much of a cushion.',apply:st=>setupJar(st,2000)},
     {t:'$6,000 (3 months of bills)',ok:true,fb:'That\'s the 3–6 month guideline. The rest goes to work.',apply:st=>setupJar(st,6000)},
     {t:'All $20,000. Cash is safest',ok:false,fb:'Too much cash loses to inflation for 20 years.',apply:st=>setupJar(st,20000)},
    ], after:st=>{ PF.drift(st,24); return 'TWO YEARS PASS. Your plan is running.'; }},
   {obj:'phone',alert:'BREAKING NEWS on your phone',from:'Alert · Bullpen Markets',title:'Inflation hits 9%',lesson:'l12',phone:true,
    before:st=>{ PF.move(st,evRet('inflation')); return `${SCEN.inflation.headline} (Based on ${SCEN.inflation.basedOn}.)`; },
    body:st=>`<div class="bub alert"><b>Prices surge. Inflation hits 9%.</b> Your portfolio: <b>${money(PF.tot(st))}</b>.</div><div class="bub them">Dana: What do you expect next, and what do you do?</div>`,
    choices:[
     {t:'Stay balanced. Cash loses buying power, energy may rise, and the Fed will likely raise rates next',ok:true,fb:'You read the chain correctly: inflation leads to rate hikes. No panic moves.'},
     {t:'Move everything to cash until inflation passes',ok:false,fb:'Cash is exactly what inflation eats.',apply:st=>PF.toSafe(st,'jar')},
     {t:'Put all my stocks into Petra Energy',ok:false,fb:'Energy may rise, but betting everything on one company is concentration risk.',apply:st=>{ st.h.PTRA=(st.h.PTRA||0)+(st.h.stk||0); st.h.stk=0; }},
    ],
    after:st=>{ PF.move(st,evRet('inflation',1)); PF.drift(st,24); return 'As expected, the Fed raised rates to fight inflation. Two years later, prices have calmed down.'; }},
   {obj:'corkboard',alert:'Dana pinned a note on your board',from:'Corkboard · Dana Okafor',title:'Your mix drifted',lesson:'l11',
    before:st=>{ PF.move(st,{stk:0.35,PTRA:0.2,bnd:0.02}); PF.drift(st,12); return 'A great year for stocks: up 35%.'; },
    body:st=>`<p>Your target was <b>70% stocks / 30% bonds</b>. After a great year you're at <b>${Math.round(PF.mix(st)*100)}% / ${100-Math.round(PF.mix(st)*100)}%</b>.</p><p><b>What do you do?</b></p>`,
    choices:[
     {t:'Rebalance: sell some stocks and buy bonds to get back to 70/30',ok:true,fb:'You trimmed the winner and put your risk back where you chose it.',apply:st=>rebalance(st,0.7)},
     {t:'Let it ride. Stocks are winning',ok:false,fb:'Your risk grew without you choosing it. The next drop will hurt more.'},
     {t:'Sell the bonds and buy even more stocks',ok:false,fb:'That\'s chasing performance and piling on risk.',apply:st=>rebalance(st,1)},
    ]},
   {obj:'phone',alert:'BREAKING NEWS on your phone',from:'Alert · Bullpen Markets',title:'Midterm elections next month',lesson:'l12',phone:true,
    before:st=>{ PF.move(st,evRet('midterm')); return `${SCEN.midterm.headline} (Based on ${SCEN.midterm.basedOn}.)`; },
    body:st=>`<div class="bub alert"><b>Markets are choppy</b> ahead of the midterms. Portfolio: <b>${money(PF.tot(st))}</b>.</div><div class="bub them">Dana: Do you change anything?</div>`,
    choices:[
     {t:'Stay the course. Markets dislike uncertainty, and it usually clears after the vote',ok:true,fb:'Historically, stocks have tended to recover after midterms, whoever wins.'},
     {t:'Sell now and buy back after the election',ok:false,fb:'You\'d have to guess right twice. Most people miss the rebound.',apply:st=>{ st.parked=PF.inv(st); PF.toSafe(st,'jar'); }},
     {t:'Bet on which party will win and buy the stocks that would help',ok:false,fb:'Guessing elections isn\'t a strategy, and markets care about uncertainty more than the winner.'},
    ],
    after:st=>{ if(st.parked){ PF.move(st,{}); const r=evRet('midterm',1); const back=Math.round(st.parked*(1+r.stk*0.1)); st.h.jar-=st.parked; st.h.stk=(st.h.stk||0)+Math.round(back*0.7); st.h.bnd=(st.h.bnd||0)+Math.round(back*0.3); st.parked=0; return 'The election passed and stocks rebounded, but you bought back in after most of the bounce.'; }
      PF.move(st,evRet('midterm',1)); PF.drift(st,6); return 'The election passed. Uncertainty cleared and stocks rebounded.'; }},
   {obj:'jar',alert:'Emergency! Check your emergency jar',from:'Text · Auto shop',title:'Your car broke down: $3,000',lesson:'l10',
    before:st=>{ PF.drift(st,36); PF.move(st,evRet('recession')); return `Three years later... ${SCEN.recession.headline}`; },
    body:st=>`<p>The transmission is shot. The repair is <b>$3,000</b>, due now, during a recession.</p><p>Emergency jar: <b>${money(st.h.jar||0)}</b>. Investments are down sharply.</p><p><b>Where does the money come from?</b></p>`,
    choicesFn:st=>[
     {t:`From the emergency jar (${money(st.h.jar||0)})`,ok:true,disabled:(st.h.jar||0)<toC(3000),why:'Not enough in the jar',fb:'This is exactly what the jar is for. You didn\'t sell a single share at the bottom.',apply:st=>PF.spend(st,toC(3000),'jar')},
     {t:'Sell investments now, while they\'re down',ok:false,fb:'You sold at a low point. That money misses the whole recovery.',apply:st=>{ const j=st.h.jar||0; st.h.jar=0; PF.spend(st,toC(3000)-0,'cash'); st.h.jar=j; }},
     {t:'Put it on a credit card at 24% interest',ok:false,fb:'24% interest wipes out years of investment gains.',apply:st=>{ PF.spend(st,toC(3600),undefined,toC(3000)); }},
    ],
    after:st=>{ PF.move(st,evRet('recession',1)); PF.drift(st,96); return 'FAST-FORWARD TO YEAR 20. The economy recovered and your plan kept compounding.'; }},
   {obj:'monitor',alert:'Pitch request on your monitor',from:'Terminal · Dana Okafor',title:'Pitch one stock to the desk',lesson:'l13',kind:'pitch'},
  ], pass:5 },
};
function setupJar(st,j){ const t=PF.tot(st); const inv=t-toC(j); st.h={jar:toC(j),stk:Math.round(inv*0.7),bnd:inv-Math.round(inv*0.7)}; }
function rebalance(st,target){ const s=(st.h.stk||0)+(st.h.PTRA||0), b=st.h.bnd||0, t=s+b; st.h.PTRA=0; st.h.stk=Math.round(t*target); st.h.bnd=t-st.h.stk; }
function sectorBars(st){ const al={}; const t=PF.inv(st)||1; for(const k in st.h) if(!SAFE.has(k)) al[k]=st.h[k]/t*100; const {ex}=exposures(al);
  return `<div class="bars" style="margin-top:6px">${Object.entries(ex).filter(([,v])=>v>0.5).sort((a,b)=>b[1]-a[1]).map(([s,v])=>`<div class="bar"><span>${s}</span><span class="track"><span class="fill ${v>25.0001?'over':''}" style="width:${Math.min(v,100)}%"></span><span class="cap" style="left:25%"></span></span><span class="mono" style="text-align:right">${v.toFixed(0)}%</span></div>`).join('')}</div>`; }
function textbookRun(shift){ const st={h:{},month:0,hist:[]}; shift.init(st);
  for(const sc of shift.scenarios){ if(sc.kind==='pitch') continue; sc.before?.(st); const ch=(sc.choicesFn?sc.choicesFn(st):sc.choices).find(c=>c.ok&&!c.disabled); ch?.apply?.(st); sc.after?.(st); } return PF.tot(st); }
