// Compounding, fee growth and long-run simulation helpers.
/* ============================== SIM HELPERS ============================== */
function compoundMonthly(monthlyC, years, rate){ let bal=0; const r=rate/12; const path=[0]; for(let m=1;m<=years*12;m++){ bal=Math.round(bal*(1+r))+monthlyC; if(m%12===0) path.push(bal);} return {bal,path}; }
function internSim(seedStart){
  for(let s=seedStart; s<seedStart+500; s++){
    const r=rng(s*977+13), g=()=>gaussFrom(r); const yrs=[];
    for(let y=0;y<10;y++){ const idx=0.075+0.16*g(); yrs.push({sav:0.02, bond:0.04+0.05*g(), idx, hot:0.05+1.4*idx+0.38*g()}); }
    const grow=(k)=>{ let v=toC(1000); const p=[v]; yrs.forEach(y=>{ v=Math.round(v*(1+Math.max(y[k],-0.85))); p.push(v);}); return p; };
    const path={sav:grow('sav'),bond:grow('bond'),idx:grow('idx'),hot:grow('hot')};
    const worst=Math.min(...yrs.map(y=>y.idx));
    if(worst<=-0.09 && path.idx[10]>path.bond[10]*1.15 && path.idx[10]>path.sav[10]*1.3) return {seed:s,yrs,path};
  }
}
function exposures(alloc){ const ex={}; SECTORS.forEach(s=>ex[s]=0); let tot=0;
  for(const [k,v] of Object.entries(alloc)){ tot+=v; if(k==='INDEX'){ COMPANIES.forEach(c=>ex[c.sector]+=v/COMPANIES.length); } else ex[CO[k].sector]+=v; }
  return {ex,tot}; }
const JR_EVENTS=[{id:'rateHike',start:70},{id:'earnings',start:200,target:'ZAPP'},{id:'recession',start:250}];
const JR_DAYS=504, JR_DECIDE=345, JR_SEED=2026;
function feeGrowth(amountC, years, ret, fee){ const p=[amountC]; let v=amountC; for(let y=1;y<=years;y++){ v=Math.round(v*(1+ret-fee)); p.push(v);} return p; }
function seniorSim({cashC, stockPct, fee, rebalance, seed=88}){
  const r=rng(seed), g=()=>gaussFrom(r); const months=240; const total=toC(20000);
  let cash=cashC, inv=total-cashC; let st=Math.round(inv*stockPct/100), bd=inv-st; const contrib=toC(150);
  const path=[st+bd+cash], real=[st+bd+cash]; let cpi=1; const evs=[]; let emergency=null; let unit=1, unitAt=null;
  for(let m=1;m<=months;m++){
    let sr=0.07/12+0.15/Math.sqrt(12)*g(), br=0.04/12+0.05/Math.sqrt(12)*g(), infl=0.025/12;
    if(m>=54&&m<60){ sr+=-0.05/6; infl=0.085/12; } if(m>=60&&m<68){ sr+=-0.10/8; br+=-0.10/8; }
    if(m>=126&&m<138){ sr+=-0.36/12; br+=0.04/12; } if(m>=138&&m<160){ sr+=0.30/22; }
    st=Math.round(st*(1+sr-fee/12)); bd=Math.round(bd*(1+br-fee/12)); cash=Math.round(cash*(1+0.02/12));
    unit*=1+(stockPct/100)*sr+(1-stockPct/100)*br-fee/12;
    st+=Math.round(contrib*stockPct/100); bd+=contrib-Math.round(contrib*stockPct/100);
    cpi*=1+infl;
    if(m===54) evs.push({m,id:'inflation'}); if(m===60) evs.push({m,id:'rateHike'}); if(m===126) evs.push({m,id:'recession'});
    if(m===137){ let need=toC(3000); const fromCash=Math.min(cash,need); cash-=fromCash; need-=fromCash; let sold=0;
      if(need>0){ const tot=st+bd; const fs=Math.round(need*st/tot); st-=fs; bd-=need-fs; sold=need; }
      emergency={m,fromCash,sold}; unitAt=unit; }
    if(rebalance && m%12===0){ const t=st+bd; st=Math.round(t*stockPct/100); bd=t-st; }
    path.push(st+bd+cash); real.push(Math.round((st+bd+cash)/cpi));
  }
  if(emergency && emergency.sold) emergency.soldWouldBe=Math.round(emergency.sold*unit/unitAt);
  // without rebalancing, drift shows up as the final stock share
  const fin=path[months]; return {path,real,fin,finReal:real[months],evs,emergency,stockShare:(st/(st+bd))};
}
const FUNDS={low:{name:'LowCost Total Market Index',fee:0.0005,blurb:'0.05% per year. Owns the whole market. No star managers.'},high:{name:'Premier Active Growth Fund',fee:0.012,blurb:'1.20% per year. "Our star managers aim to beat the market!"'}};
