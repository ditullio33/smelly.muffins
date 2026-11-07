// Saved progress, XP and streaks.
/* ============================== STATE ============================== */
const DEFAULT = {xp:0, streak:{count:0,last:null}, done:{}, best:{}, unlockAll:false, sims:{}, lab:'rateHike', today:{date:null,xp:0}, open:[], profile:null, openT:null, stages:{}, tl:{}, focus:null};
let S;
function load(){ try{ const raw=localStorage.getItem('bullpen-v3'); if(raw) return Object.assign(structuredClone(DEFAULT), JSON.parse(raw)); }catch(e){} return structuredClone(DEFAULT); }
function save(){ try{ localStorage.setItem('bullpen-v3', JSON.stringify(S)); }catch(e){} }
const dayKey=(d=new Date())=>d.toISOString().slice(0,10);
function addXP(n){ const t=dayKey(); if(S.today.date!==t) S.today={date:t,xp:0}; S.today.xp+=n; S.xp+=n;
  const y=dayKey(new Date(Date.now()-864e5)); if(S.streak.last!==t){ S.streak.count = S.streak.last===y ? S.streak.count+1 : 1; S.streak.last=t; } save(); }
function streakNow(){ const t=dayKey(), y=dayKey(new Date(Date.now()-864e5)); return (S.streak.last===t||S.streak.last===y)?S.streak.count:0; }
const REVIEW_UNLOCK=true; // review mode: every lesson and simulation is open. Set to false before submitting if you want locking back.
function isUnlocked(id){ if(REVIEW_UNLOCK||S.unlockAll) return true; const i=NODES.findIndex(n=>n.id===id); return NODES.slice(0,i).every(n=>S.done[n.id]); }
function currentNode(){ return NODES.find(n=>!S.done[n.id]); }
