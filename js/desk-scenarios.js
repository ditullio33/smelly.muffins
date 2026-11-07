// Portfolio model shared by every unit's desk shift. The scenarios themselves live in js/content/uXX.js.
/* ============================== DESK SIMULATION: PORTFOLIO MODEL ============================== */
// Holdings are integer cents keyed by asset. Market moves come from the same scenario factors as the Scenario Lab,
// applied deterministically so every outcome can be explained in plain words.
const MKT={beta:1,rate:-1.1,rec:-0.9,inf:-0.2};
function evRet(id,k=0){ const ph=SCEN[id].phases[k]; const r={}; let sum=0; COMPANIES.forEach(c=>{ r[c.id]=impact(c,ph); sum+=r[c.id]; }); r.INDEX=sum/COMPANIES.length; r.bnd=impact(BOND,ph); r.stk=impact(MKT,ph); return r; }
const LABEL={sav:'Savings',cash:'Cash',jar:'Emergency jar',INDEX:'Index fund',stk:'Stock index fund',bnd:'Bond fund',REIT:'REIT fund',COIN:'NewCoin',GOLD:'Gold'};
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

/* ============================== HISTORICAL DATA (Ken French) ============================== */
// FF_DATA comes from js/history-data.js (built by scripts/build-history.mjs). It may be null if the CSV hasn't been added yet.
const FFD = (typeof FF_DATA !== 'undefined' && FF_DATA) ? FF_DATA : null;
const ffMkt = r => (r.mktrf + r.rf) / 100; // US market total return for the period
const ymLabel = ym => new Date(Math.floor(ym / 100), ym % 100 - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
// Cumulative market and cash returns for the months AFTER `from` through `to` (YYYYMM).
function ffCum(from, to) { if (!FFD) return null; let m = 1, c = 1, n = 0; for (const r of FFD.monthly) if (r.ym > from && r.ym <= to) { m *= 1 + ffMkt(r); c *= 1 + r.rf / 100; n++; } return n ? { mkt: m - 1, cash: c - 1, months: n } : null; }
// Moves a desk portfolio through real history (or a labeled simulated fallback) and returns the headline.
function histStep(st, from, to, fallback, label) {
  const r = ffCum(from, to); const mkt = r ? r.mkt : fallback; const cash = r ? r.cash : 0.01;
  for (const k in st.h) st.h[k] = Math.round(st.h[k] * (1 + (SAFE.has(k) ? cash : mkt)));
  const when = label || ymLabel(to);
  return `${when}: US stocks ${mkt >= 0 ? 'gained' : 'lost'} ${Math.abs(mkt * 100).toFixed(0)}% since ${ymLabel(from)}. ${r ? '(Real returns, Ken French Data Library.)' : '(Simulated: add the Ken French data for real history.)'}`;
}
const SHIFTS = {};
function setupJar(st,j){ const t=PF.tot(st); const inv=t-toC(j); st.h={jar:toC(j),stk:Math.round(inv*0.7),bnd:inv-Math.round(inv*0.7)}; }
function rebalance(st,target){ const s=(st.h.stk||0)+(st.h.PTRA||0), b=st.h.bnd||0, t=s+b; st.h.PTRA=0; st.h.stk=Math.round(t*target); st.h.bnd=t-st.h.stk; }
function sectorBars(st){ const al={}; const t=PF.inv(st)||1; for(const k in st.h) if(!SAFE.has(k)) al[k]=st.h[k]/t*100; const {ex}=exposures(al);
  return `<div class="bars" style="margin-top:6px">${Object.entries(ex).filter(([,v])=>v>0.5).sort((a,b)=>b[1]-a[1]).map(([s,v])=>`<div class="bar"><span>${s}</span><span class="track"><span class="fill ${v>25.0001?'over':''}" style="width:${Math.min(v,100)}%"></span><span class="cap" style="left:25%"></span></span><span class="mono" style="text-align:right">${v.toFixed(0)}%</span></div>`).join('')}</div>`; }
function textbookRun(shift){ const st={h:{},month:0,hist:[]}; shift.init(st);
  for(const sc of shift.scenarios){ if(sc.kind==='pitch') continue; sc.before?.(st); const ch=(sc.choicesFn?sc.choicesFn(st):sc.choices).find(c=>c.ok&&!c.disabled); ch?.apply?.(st); sc.after?.(st); } return PF.tot(st); }
