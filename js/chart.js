// Canvas line chart used across the game.
/* ============================== CHART ============================== */
function drawLine(canvas, series, {upto=null, markers=[], money:isMoney=true, xLabel=(i)=>i, xTicks=5}={}){
  const box=canvas.parentElement, dpr=window.devicePixelRatio||1;
  const W=box.clientWidth, H=box.clientHeight; if(!W) return;
  canvas.width=W*dpr; canvas.height=H*dpr; const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);
  const n=Math.max(...series.map(s=>s.values.length)); const last=upto==null?n-1:Math.min(upto,n-1);
  let lo=Infinity, hi=-Infinity; for(const s of series) for(let i=0;i<=Math.min(last,s.values.length-1);i++){ lo=Math.min(lo,s.values[i]); hi=Math.max(hi,s.values[i]); }
  if(!isFinite(lo)){lo=0;hi=1} const pad=(hi-lo)*0.08||1; const nonneg=lo>=0; lo-=pad; hi+=pad; if(nonneg) lo=Math.max(0,lo);
  const L=64,R=12,T=12,B=26, pw=W-L-R, ph=H-T-B;
  const X=i=>L+pw*i/(n-1||1), Y=v=>T+ph*(1-(v-lo)/(hi-lo));
  ctx.font='11px '+css('--f-mono'); ctx.fillStyle=css('--muted'); ctx.strokeStyle=css('--line'); ctx.lineWidth=1;
  for(let k=0;k<=4;k++){ const v=lo+(hi-lo)*k/4, y=Y(v); ctx.globalAlpha=.6; ctx.beginPath(); ctx.moveTo(L,y); ctx.lineTo(W-R,y); ctx.stroke(); ctx.globalAlpha=1;
    ctx.textAlign='right'; ctx.textBaseline='middle'; ctx.fillText(isMoney?money(Math.round(v)):v.toFixed(0), L-6, y); }
  ctx.textAlign='center'; ctx.textBaseline='top';
  for(let k=0;k<=xTicks;k++){ const i=Math.round((n-1)*k/xTicks); ctx.fillText(xLabel(i), clamp(X(i),L+14,W-R-14), H-B+8); }
  markers.forEach((m,mi)=>{ if(m.i>last) return; const x=X(m.i); const ly=T+2+(mi%2)*14; ctx.strokeStyle=css('--hl'); ctx.lineWidth=2; ctx.setLineDash([4,3]); ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,H-B); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=css('--ink'); ctx.textAlign='left'; ctx.textBaseline='top'; const tw=ctx.measureText(m.label).width; const lx=Math.min(x+4,W-R-tw); ctx.fillStyle=css('--surface'); ctx.globalAlpha=.85; ctx.fillRect(lx-2,ly-1,tw+4,13); ctx.globalAlpha=1; ctx.fillStyle=css('--ink'); ctx.fillText(m.label, lx, ly); });
  series.forEach((s,si)=>{
    const col=css(s.color); ctx.strokeStyle=col; ctx.lineWidth=s.width||2.2; ctx.beginPath();
    const m=Math.min(last,s.values.length-1);
    for(let i=0;i<=m;i++){ const x=X(i), y=Y(s.values[i]); i?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.stroke();
    if(si===0 && s.fill){ ctx.lineTo(X(m),H-B); ctx.lineTo(X(0),H-B); ctx.closePath(); ctx.globalAlpha=.08; ctx.fillStyle=col; ctx.fill(); ctx.globalAlpha=1; }
    const x=X(m), y=Y(s.values[m]); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,3.5,0,7); ctx.fill();
  });
}
function legend(series){ return `<div class="legend">${series.map(s=>`<span><i style="background:var(${s.color})"></i>${s.label}</span>`).join('')}</div>`; }
