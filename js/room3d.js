// Three.js desk: geometry, textures, camera, picking.
/* ============================== 3D ROOM ============================== */
const OBJ_NAMES={monitor:'Monitor',phone:'Phone',inbox:'Inbox tray',jar:'Emergency jar',calendar:'Calendar',corkboard:'Corkboard',window:'Window',lamp:'Desk lamp'};
function makeCanvas(w,hh){ const c=document.createElement('canvas'); c.width=w; c.height=hh; return c; }
function rr(ctx,x,y,w,hh,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+hh,r); ctx.arcTo(x+w,y+hh,x,y+hh,r); ctx.arcTo(x,y+hh,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
const DRAW={
  monitor(ctx,W,H,d){
    ctx.fillStyle='#0D1820'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#F2A541'; ctx.font='700 30px "JetBrains Mono", monospace'; ctx.fillText('BULLPEN TERMINAL',36,56);
    ctx.fillStyle='#7F95A3'; ctx.font='22px "JetBrains Mono", monospace'; ctx.textAlign='right'; ctx.fillText(d.clock||'',W-36,56); ctx.textAlign='left';
    ctx.fillStyle='#7F95A3'; ctx.font='20px "JetBrains Mono", monospace'; ctx.fillText(d.label||'PORTFOLIO VALUE',36,112);
    const up=(d.total||0)>=(d.start||0); ctx.fillStyle= d.total==null?'#E7EDF1': up?'#3FC08A':'#FF6B72'; ctx.font='800 76px "Bricolage Grotesque", sans-serif'; ctx.fillText(d.total==null?'—':money(d.total),36,190);
    if(d.start&&d.total!=null){ ctx.font='26px "JetBrains Mono", monospace'; ctx.fillText(fmtPct(pctOf(d.total,d.start))+' since start',36,232); }
    const hist=d.hist||[]; if(hist.length>1){ const x0=36,y0=260,w=560,hh=220; const lo=Math.min(...hist)*0.97, hi=Math.max(...hist)*1.03;
      ctx.strokeStyle='#22323D'; ctx.lineWidth=2; for(let k=0;k<=3;k++){ const y=y0+hh*k/3; ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x0+w,y); ctx.stroke(); }
      ctx.strokeStyle=up?'#3FC08A':'#FF6B72'; ctx.lineWidth=5; ctx.beginPath(); hist.forEach((v,i)=>{ const x=x0+w*i/(hist.length-1), y=y0+hh*(1-(v-lo)/(hi-lo||1)); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke(); }
    const hs=(d.holdings||[]).slice(0,7); ctx.font='22px "JetBrains Mono", monospace';
    hs.forEach(([n,v],i)=>{ const y=130+i*50; ctx.fillStyle='#9AA8B2'; ctx.fillText(n.slice(0,18),650,y); ctx.fillStyle='#E7EDF1'; ctx.textAlign='right'; ctx.fillText(money(v),W-36,y); ctx.textAlign='left'; });
    if(d.headline){ ctx.fillStyle='#F2A541'; ctx.fillRect(0,H-74,W,74); ctx.fillStyle='#140F0A'; ctx.font='700 24px "JetBrains Mono", monospace'; const t=d.headline.length>70?d.headline.slice(0,68)+'…':d.headline; ctx.fillText(t,28,H-28); }
    if(d.alert){ ctx.fillStyle='#FF6B72'; rr(ctx,W-260,80,224,46,10); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='700 22px "JetBrains Mono", monospace'; ctx.fillText('NEW TASK  ▸',W-238,111); }
  },
  phone(ctx,W,H,d){
    const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#2B2140'); g.addColorStop(1,'#0E0B16'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='800 92px "Bricolage Grotesque", sans-serif'; ctx.fillText(d.clock||'7:00',W/2,170); ctx.font='26px Figtree, sans-serif'; ctx.fillStyle='#C8C0DA'; ctx.fillText('Bullpen Markets',W/2,212); ctx.textAlign='left';
    if(d.notif){ ctx.fillStyle='rgba(255,255,255,.92)'; rr(ctx,24,250,W-48,150,22); ctx.fill(); ctx.fillStyle='#E8762B'; ctx.font='700 22px Figtree, sans-serif'; ctx.fillText('NOW',48,290); ctx.fillStyle='#140F0A'; ctx.font='700 28px Figtree, sans-serif'; wrapText(ctx,d.notif,48,330,W-96,34,2); }
  },
  calendar(ctx,W,H,d){
    ctx.fillStyle='#FBF8F2'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#C2353D'; ctx.fillRect(0,0,W,90); ctx.fillStyle='#fff'; ctx.font='800 46px "Bricolage Grotesque", sans-serif'; ctx.textAlign='center'; ctx.fillText(d.month||'MONTH 1',W/2,62);
    ctx.fillStyle='#14212B'; ctx.font='26px Figtree, sans-serif'; for(let i=0;i<30;i++){ const x=40+(i%7)*(W-80)/6.5, y=150+Math.floor(i/7)*72; if(i===d.day){ ctx.fillStyle='#F2A541'; ctx.beginPath(); ctx.arc(x,y-9,26,0,7); ctx.fill(); ctx.fillStyle='#14212B'; } ctx.fillText(i+1,x,y); } ctx.textAlign='left';
  },
  cork(ctx,W,H,d){
    ctx.fillStyle='#B88A5A'; ctx.fillRect(0,0,W,H); for(let i=0;i<1800;i++){ ctx.fillStyle=`rgba(${80+Math.random()*60},${50+Math.random()*40},20,.25)`; ctx.fillRect(Math.random()*W,Math.random()*H,3,3); }
    ctx.strokeStyle='#6B4A2B'; ctx.lineWidth=18; ctx.strokeRect(9,9,W-18,H-18);
    const cols=['#F6E27A','#9FE0C1','#F5B5A8','#A9C4FF','#F6E27A','#C9B6F2'];
    (d.notes||[]).slice(0,6).forEach((n,i)=>{ const x=40+(i%3)*(W-80)/3, y=40+Math.floor(i/3)*((H-80)/2); ctx.save(); ctx.translate(x+100,y+70); ctx.rotate((i%2?1:-1)*0.04); ctx.fillStyle=cols[i]; ctx.fillRect(-95,-65,190,140); ctx.fillStyle='#C2353D'; ctx.beginPath(); ctx.arc(0,-55,8,0,7); ctx.fill(); ctx.fillStyle='#14212B'; ctx.font='700 22px Figtree, sans-serif'; wrapText(ctx,n,-80,-20,160,26,4); ctx.restore(); });
    if(d.alert){ ctx.save(); ctx.translate(W-170,H-110); ctx.rotate(-0.05); ctx.fillStyle='#fff'; ctx.fillRect(-10,-10,180,100); ctx.fillStyle='#C2353D'; ctx.font='800 26px Figtree, sans-serif'; ctx.fillText('FROM DANA',4,30); ctx.fillStyle='#14212B'; ctx.font='22px Figtree, sans-serif'; ctx.fillText('Check your mix',4,64); ctx.restore(); }
  },
  window(ctx,W,H,d){
    const t=d.t??0.2; const day=[[0.0,'#F7C68B','#9ED2F0'],[0.35,'#BFE3F7','#5FA8DA'],[0.7,'#F59E62','#5B4E8C'],[1.0,'#1B1F3B','#05060F']];
    let a=day[0], b=day[day.length-1]; for(let i=0;i<day.length-1;i++) if(t>=day[i][0]&&t<=day[i+1][0]){ a=day[i]; b=day[i+1]; }
    const f=(t-a[0])/((b[0]-a[0])||1), mix=(c1,c2)=>{ const p=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)); const A=p(c1),B=p(c2); return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')})`; };
    const g=ctx.createLinearGradient(0,H,0,0); g.addColorStop(0,mix(a[1],b[1])); g.addColorStop(1,mix(a[2],b[2])); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    const r=rng(42); const night=t>0.72; for(let x=0;x<W;){ const bw=40+r()*70, bh=H*(0.25+r()*0.45)*(d.tall?1.25:1); ctx.fillStyle=night?'#0B0E1C':'#3A4660'; ctx.fillRect(x,H-bh,bw,bh);
      ctx.fillStyle=night?'#F6D58A':'rgba(255,255,255,.25)'; for(let yy=H-bh+10;yy<H-8;yy+=18) for(let xx=x+6;xx<x+bw-8;xx+=14) if(r()<(night?0.45:0.3)) ctx.fillRect(xx,yy,7,9); x+=bw+4; }
  },
  keys(ctx,W,H){ ctx.fillStyle='#22262B'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#3A4048'; for(let row=0;row<5;row++) for(let i=0;i<15;i++){ const kw=(W-40)/15; ctx.fillRect(20+i*kw+2,14+row*((H-28)/5)+2,kw-4,(H-28)/5-4); } },
  jarLabel(ctx,W,H,d){ ctx.fillStyle='#F6F1E6'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#14212B'; ctx.font='800 34px "Bricolage Grotesque", sans-serif'; ctx.textAlign='center'; ctx.fillText('EMERGENCY',W/2,52); ctx.font='700 30px "JetBrains Mono", monospace'; ctx.fillStyle='#23856A'; ctx.fillText(d.amt||'$0',W/2,100); ctx.textAlign='left'; },
  plate(ctx,W,H,d){ ctx.fillStyle='#2A1E14'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#E9C27A'; ctx.font='800 44px "Bricolage Grotesque", sans-serif'; ctx.textAlign='center'; ctx.fillText(d.text,W/2,H/2+15); ctx.textAlign='left'; },
};
function wrapText(ctx,text,x,y,maxW,lh,maxLines=3){ const words=String(text).split(' '); let line='', n=0; for(const w of words){ const test=line?line+' '+w:w; if(ctx.measureText(test).width>maxW&&line){ ctx.fillText(line,x,y); y+=lh; line=w; if(++n>=maxLines-1){ } } else line=test; if(n>=maxLines) return; } ctx.fillText(line,x,y); }

function Room3D(host, opts){
  const api={ ok:false, focus:(n,cb)=>cb&&cb(), sitBack:()=>{}, setAlert:()=>{}, update:()=>{}, setTime:()=>{}, dispose:()=>{}, onPick:null };
  let gl; try{ if(!window.THREE) throw 0; gl=new THREE.WebGLRenderer({antialias:true}); }catch(e){ host.classList.add('no3d'); return api; }
  const T=THREE; api.ok=true;
  gl.setPixelRatio(Math.min(devicePixelRatio||1,2)); gl.outputEncoding=T.sRGBEncoding; gl.toneMapping=T.ACESFilmicToneMapping; gl.toneMappingExposure=1.05; gl.shadowMap.enabled=true; gl.shadowMap.type=T.PCFSoftShadowMap;
  gl.domElement.className='gl'; host.prepend(gl.domElement);
  const scene=new T.Scene(); const cam=new T.PerspectiveCamera(58,1,0.03,40);
  const HOME=new T.Vector3(0,1.32,0.62); let yaw=0, pitch=-0.3, fovBase=58; cam.position.copy(HOME);
  const mat=(c,o={})=>new T.MeshStandardMaterial({color:c,roughness:o.r??0.75,metalness:o.m??0,transparent:!!o.op,opacity:o.op??1,...(o.extra||{})});
  const box=(w,hh,d,m)=>{ const x=new T.Mesh(new T.BoxGeometry(w,hh,d),m); x.castShadow=true; x.receiveShadow=true; return x; };
  const cyl=(rt,rb,hh,m,seg=32)=>{ const x=new T.Mesh(new T.CylinderGeometry(rt,rb,hh,seg),m); x.castShadow=true; x.receiveShadow=true; return x; };
  const tex=(w,hh,draw,d={})=>{ const c=makeCanvas(w,hh); const t=new T.CanvasTexture(c); t.encoding=T.sRGBEncoding; t.anisotropy=4; const o={c,t,ctx:c.getContext('2d'),draw:(dd)=>{ draw(o.ctx,w,hh,dd); t.needsUpdate=true; }}; o.draw(d); return o; };
  const at=(o,x,y,z)=>{ o.position.set(x,y,z); scene.add(o); return o; };
  const groups={}; const pickables=[];
  const grp=(name)=>{ const g=new T.Group(); g.userData.name=name; scene.add(g); groups[name]={g,mats:[]}; return g; };
  const reg=(name,mesh)=>{ mesh.userData.pick=name; pickables.push(mesh); const m=mesh.material; if(m&&m.emissive){ groups[name].mats.push(m); } return mesh; };

  // room shell
  const wallC=0x8A7461, floorM=mat(0x5B4330,{r:0.9});
  at(new T.Mesh(new T.PlaneGeometry(10,10),floorM),0,0,0).rotation.x=-Math.PI/2; scene.children[scene.children.length-1].receiveShadow=true;
  const wallM=mat(wallC,{r:0.95}); const back=at(new T.Mesh(new T.PlaneGeometry(6,3.4),wallM),0,1.7,-1.25); back.receiveShadow=true;
  const left=at(new T.Mesh(new T.PlaneGeometry(4,3.4),wallM),-1.7,1.7,0.6); left.rotation.y=Math.PI/2; left.receiveShadow=true;
  const right=at(new T.Mesh(new T.PlaneGeometry(4,3.4),mat(0x7E6A58,{r:0.95})),1.9,1.7,0.6); right.rotation.y=-Math.PI/2;
  at(box(6,0.1,0.04,mat(0x3B2C20)),0,0.05,-1.23);
  // window (left wall)
  const wg=grp('window'); const winTex=tex(512,384,DRAW.window,{t:0.1,tall:opts.tall});
  const pane=new T.Mesh(new T.PlaneGeometry(1.3,0.95),new T.MeshBasicMaterial({map:winTex.t})); pane.position.set(-1.69,1.62,-0.35); pane.rotation.y=Math.PI/2; wg.add(pane); reg('window',pane);
  const frameM=mat(0xEDE6DA,{r:0.6}); [[0,0.5,1.42,0.05],[0,-0.5,1.42,0.05],[0.68,0,0.05,1.05],[-0.68,0,0.05,1.05],[0,0,0.03,0.95]].forEach(([z,y,w,hh])=>{ const f=box(0.05,hh,w,frameM); f.position.set(-1.67,1.62+y,-0.35+z); wg.add(f); });
  const sill=box(0.16,0.04,1.5,frameM); sill.position.set(-1.62,1.12,-0.35); wg.add(sill);
  // desk
  const deskM=mat(0xA2714A,{r:0.55}); const top=at(box(2.3,0.05,1.0,deskM),0,0.76,-0.62);
  const legM=mat(0x2A2420,{r:0.4,m:0.3}); [[-1.08,-1.05],[1.08,-1.05],[-1.08,-0.2],[1.08,-0.2]].forEach(([x,z])=>at(box(0.05,0.74,0.05,legM),x,0.37,z));
  at(box(0.45,0.5,0.85,mat(0x8E6240,{r:0.6})),-0.8,0.48,-0.65);
  // monitor
  const mg=grp('monitor'); const darkM=mat(0x16191C,{r:0.35,m:0.2}); const monM=mat(0x16191C,{r:0.35,m:0.2,extra:{emissive:new T.Color(0)}});
  const base=cyl(0.13,0.15,0.02,darkM); base.position.set(0,0.795,-0.95); mg.add(base); const neck=box(0.05,0.32,0.04,darkM); neck.position.set(0,0.95,-0.98); mg.add(neck);
  const bezel=box(1.0,0.6,0.035,monM); bezel.position.set(0,1.2,-0.96); mg.add(bezel); reg('monitor',bezel);
  const monTex=tex(1280,720,DRAW.monitor,{}); const screen=new T.Mesh(new T.PlaneGeometry(0.95,0.534),new T.MeshBasicMaterial({map:monTex.t,toneMapped:false})); screen.position.set(0,1.2,-0.941); mg.add(screen); reg('monitor',screen);
  const glow=new T.PointLight(0x7FB6FF,0.35,1.6); glow.position.set(0,1.2,-0.7); scene.add(glow);
  // keyboard + mouse
  const kTex=tex(512,160,DRAW.keys,{}); const kb=at(box(0.56,0.02,0.18,new T.MeshStandardMaterial({map:kTex.t,roughness:0.6})),0,0.795,-0.42);
  at(new T.Mesh(new T.SphereGeometry(0.035,24,16),mat(0x22262B,{r:0.4})),0.42,0.8,-0.42).scale.set(1,0.5,1.5);
  // phone
  const pg=grp('phone'); const phM=mat(0x101114,{r:0.3,m:0.3,extra:{emissive:new T.Color(0)}}); const ph=box(0.085,0.012,0.17,phM); pg.add(ph); reg('phone',ph);
  const phTex=tex(360,720,DRAW.phone,{clock:'7:00'}); const phS=new T.Mesh(new T.PlaneGeometry(0.077,0.155),new T.MeshBasicMaterial({map:phTex.t,toneMapped:false})); phS.rotation.x=-Math.PI/2; phS.position.y=0.0065; pg.add(phS); reg('phone',phS);
  pg.position.set(0.66,0.791,-0.42); pg.rotation.y=-0.35;
  // emergency jar
  const jg=grp('jar'); const glass=new T.Mesh(new T.CylinderGeometry(0.085,0.085,0.21,40,1,true),new T.MeshStandardMaterial({color:0xDDEEF2,roughness:0.08,metalness:0,transparent:true,opacity:0.3,side:T.DoubleSide,emissive:new T.Color(0)})); glass.position.y=0.105; jg.add(glass); reg('jar',glass);
  const lid=cyl(0.09,0.09,0.03,mat(0x3E2A1E,{r:0.5,extra:{emissive:new T.Color(0)}})); lid.position.y=0.225; jg.add(lid); reg('jar',lid);
  const jl=tex(256,128,DRAW.jarLabel,{amt:'$0'}); const lbl=new T.Mesh(new T.CylinderGeometry(0.087,0.087,0.08,40,1,true,-0.8,1.6),new T.MeshStandardMaterial({map:jl.t,roughness:0.8})); lbl.position.y=0.1; lbl.rotation.y=Math.PI*0.5+0.6; jg.add(lbl); reg('jar',lbl);
  const coinM=mat(0xD9A21B,{r:0.35,m:0.7}); const coins=new T.Group(); jg.add(coins);
  jg.position.set(0.95,0.785,-0.78);
  // inbox tray
  const ig=grp('inbox'); const trayM=mat(0x2C2C30,{r:0.5,m:0.3,extra:{emissive:new T.Color(0)}});
  [[0,0,0,0.34,0.012,0.26],[0,0.03,0.13,0.34,0.06,0.01],[0,0.03,-0.13,0.34,0.06,0.01],[0.17,0.03,0,0.01,0.06,0.26],[-0.17,0.03,0,0.01,0.06,0.26]].forEach(([x,y,z,w,hh,d])=>{ const b=box(w,hh,d,trayM); b.position.set(x,y,z); ig.add(b); reg('inbox',b); });
  const papers=[]; for(let i=0;i<4;i++){ const p=box(0.3,0.003,0.22,mat(i===3?0xFFFFFF:0xEFEAE0,{r:0.9,extra:{emissive:new T.Color(0)}})); p.position.set((i%2)*0.01,0.01+i*0.004,(i%2)*-0.008); p.rotation.y=(i-1.5)*0.03; ig.add(p); reg('inbox',p); papers.push(p); }
  const tag=box(0.06,0.004,0.03,mat(0xC2353D)); tag.position.set(0.1,0.03,0.1); ig.add(tag);
  ig.position.set(-0.78,0.786,-0.62); ig.rotation.y=0.15;
  // lamp
  const lg=grp('lamp'); const lampM=mat(0xE0B07A,{r:0.4,m:0.4,extra:{emissive:new T.Color(0)}});
  const lb=cyl(0.08,0.09,0.02,lampM); lg.add(lb); reg('lamp',lb); const a1=cyl(0.01,0.01,0.42,lampM); a1.position.set(0,0.2,0); a1.rotation.z=0.25; lg.add(a1); reg('lamp',a1);
  const a2=cyl(0.01,0.01,0.3,lampM); a2.position.set(-0.11,0.44,0.0); a2.rotation.z=1.2; lg.add(a2);
  const shade=new T.Mesh(new T.ConeGeometry(0.09,0.12,32,1,true),new T.MeshStandardMaterial({color:0xE0B07A,roughness:0.4,metalness:0.3,side:T.DoubleSide,emissive:new T.Color(0)})); shade.position.set(-0.26,0.42,0); shade.rotation.z=0.6; lg.add(shade); reg('lamp',shade);
  const bulb=new T.Mesh(new T.SphereGeometry(0.03,16,12),new T.MeshBasicMaterial({color:0xFFE2A8})); bulb.position.set(-0.27,0.38,0); lg.add(bulb);
  const lampLight=new T.PointLight(0xFFC27A,0,2.6,1.6); lampLight.position.set(-0.27,0.35,0); lampLight.castShadow=true; lampLight.shadow.mapSize.set(512,512); lg.add(lampLight);
  lg.position.set(-0.55,0.785,-0.98);
  // plant + mug + nameplate
  const pot=at(cyl(0.07,0.055,0.13,mat(0xC8643C,{r:0.8})),-1.0,0.85,-1.0); const leafM=mat(0x3E7D4A,{r:0.8});
  for(let i=0;i<7;i++){ const l=new T.Mesh(new T.SphereGeometry(0.06,12,10),leafM); l.scale.set(0.5,1.6,0.25); l.position.set(-1.0+Math.cos(i)*0.04,0.98,-1.0+Math.sin(i)*0.04); l.rotation.set(Math.sin(i)*0.6,i,Math.cos(i)*0.6); l.castShadow=true; scene.add(l); }
  const mug=at(cyl(0.04,0.036,0.09,mat(0xF0EDE6,{r:0.5})),-0.42,0.83,-0.5); const coffee=at(cyl(0.036,0.036,0.005,mat(0x3B2416)),-0.42,0.87,-0.5);
  const plTex=tex(512,96,DRAW.plate,{text:opts.plate||'INTERN'}); const plate=at(new T.Mesh(new T.BoxGeometry(0.3,0.06,0.02),[mat(0x2A1E14),mat(0x2A1E14),mat(0x2A1E14),mat(0x2A1E14),new T.MeshStandardMaterial({map:plTex.t,roughness:0.5}),mat(0x2A1E14)]),0.32,0.815,-0.2); plate.rotation.x=-0.25;
  // calendar + corkboard on back wall
  const cg=grp('calendar'); const calTex=tex(420,560,DRAW.calendar,{month:'MONTH 1',day:0}); const cal=new T.Mesh(new T.PlaneGeometry(0.38,0.5),new T.MeshStandardMaterial({map:calTex.t,roughness:0.9,emissive:new T.Color(0)})); cal.position.set(-1.05,1.6,-1.24); cg.add(cal); reg('calendar',cal);
  const kg=grp('corkboard'); const corkTex=tex(900,600,DRAW.cork,{notes:opts.notes||[]}); const cork=new T.Mesh(new T.BoxGeometry(0.9,0.6,0.025),[mat(0x6B4A2B),mat(0x6B4A2B),mat(0x6B4A2B),mat(0x6B4A2B),new T.MeshStandardMaterial({map:corkTex.t,roughness:0.95,emissive:new T.Color(0)}),mat(0x6B4A2B)]); cork.position.set(0.95,1.68,-1.235); kg.add(cork); reg('corkboard',cork); groups.corkboard.mats.push(cork.material[4]);
  // lights
  const hemi=new T.HemisphereLight(0xFFF1DD,0x3A2A1E,0.55); scene.add(hemi);
  const sun=new T.DirectionalLight(0xFFE2B8,1.4); sun.position.set(-3,3.2,0.2); sun.target.position.set(0,0.8,-0.6); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); Object.assign(sun.shadow.camera,{left:-2,right:2,top:2,bottom:-2,near:0.5,far:8}); sun.shadow.bias=-0.0008; scene.add(sun,sun.target);
  const fill=new T.AmbientLight(0xffffff,0.12); scene.add(fill);
  // alert marker
  const mk=makeCanvas(128,128), mctx=mk.getContext('2d'); mctx.fillStyle='#F2A541'; mctx.beginPath(); mctx.arc(64,64,56,0,7); mctx.fill(); mctx.fillStyle='#140F0A'; mctx.font='900 84px Figtree, sans-serif'; mctx.textAlign='center'; mctx.fillText('!',64,94);
  const mkT=new T.CanvasTexture(mk); const marker=new T.Sprite(new T.SpriteMaterial({map:mkT,depthTest:false})); marker.scale.set(0.09,0.09,0.09); marker.visible=false; marker.renderOrder=10; scene.add(marker);
  const MARK={monitor:[0,1.58,-0.95],phone:[0.66,0.92,-0.42],jar:[0.95,1.1,-0.78],inbox:[-0.78,0.95,-0.62],calendar:[-1.05,1.93,-1.2],corkboard:[0.95,2.06,-1.2]};
  // focus poses
  const FOCUS={monitor:[[0,1.2,-0.18],[0,1.2,-0.95]],phone:[[0.6,1.12,-0.2],[0.66,0.79,-0.43]],jar:[[0.78,1.02,-0.4],[0.95,0.88,-0.78]],inbox:[[-0.66,1.2,-0.2],[-0.78,0.79,-0.62]],calendar:[[-0.9,1.6,-0.45],[-1.05,1.6,-1.24]],corkboard:[[0.9,1.66,-0.3],[0.95,1.68,-1.24]],window:[[-0.6,1.55,-0.3],[-1.7,1.6,-0.35]]};

  let alerted=null, hover=null, focused=null, tween=null, lampOn=false, timeT=0.1, raf=0, disposed=false;
  const lookQ=(pos,target)=>{ const o=new T.PerspectiveCamera(); o.position.copy(pos); o.lookAt(target); return o.quaternion.clone(); };
  const homeQ=()=>{ const f=new T.Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)); return lookQ(HOME,HOME.clone().add(f)); };
  cam.quaternion.copy(homeQ());
  const go=(pos,q,cb,dur=700)=>{ tween={p0:cam.position.clone(),q0:cam.quaternion.clone(),p1:pos,q1:q,t0:performance.now(),dur:reduceMotion?1:dur,cb}; };
  api.focus=(name,cb)=>{ if(!FOCUS[name]){ cb&&cb(); return; } focused=name; marker.visible=false; const [p,t]=FOCUS[name]; go(new T.Vector3(...p),lookQ(new T.Vector3(...p),new T.Vector3(...t)),cb); };
  api.sitBack=(cb)=>{ focused=null; marker.visible=!!alerted&&!!MARK[alerted]; go(HOME.clone(),homeQ(),cb,600); };
  api.setAlert=(name)=>{ alerted=name; marker.visible=!!name&&!!MARK[name]; if(marker.visible) marker.position.set(...MARK[name]); };
  api.update=(what,data)=>{ ({monitor:monTex,phone:phTex,calendar:calTex,cork:corkTex,window:winTex,jar:jl})[what]?.draw(data);
    if(what==='jar'){ while(coins.children.length) coins.remove(coins.children[0]); const n=Math.min(40,Math.round((data.cents||0)/50000)); for(let i=0;i<n;i++){ const c=new T.Mesh(new T.CylinderGeometry(0.022,0.022,0.006,20),coinM); c.position.set(Math.cos(i*2.4)*0.035,0.006+i*0.0052,Math.sin(i*2.4)*0.035); c.rotation.set((i%3)*0.08,0,(i%2)*0.08); coins.add(c);} } };
  api.setTime=(t)=>{ timeT=t; winTex.draw({t,tall:opts.tall}); const dayAmt=Math.max(0,1-Math.abs(t-0.35)*1.6); sun.intensity=0.25+1.5*dayAmt; sun.color.setHSL(0.08,0.6,0.5+0.25*dayAmt); hemi.intensity=0.25+0.4*dayAmt; lampLight.intensity=(lampOn||t>0.62)?1.6:0; bulb.material.color.set((lampOn||t>0.62)?0xFFE2A8:0x8A7A66); scene.background=new T.Color().setHSL(0.07,0.25,0.06+0.1*dayAmt); };
  api.lamp=()=>{ lampOn=!lampOn; api.setTime(timeT); };
  api.setTime(0.1);
  // input
  const el=gl.domElement; let down=null, pinch=null; const ptrs=new Map();
  const ray=new T.Raycaster(), v2=new T.Vector2();
  const pick=(e)=>{ const r=el.getBoundingClientRect(); v2.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1); ray.setFromCamera(v2,cam); const hit=ray.intersectObjects(pickables,false)[0]; return hit?hit.object.userData.pick:null; };
  el.addEventListener('pointerdown',e=>{ ptrs.set(e.pointerId,e); el.setPointerCapture(e.pointerId); if(ptrs.size===2){ const [a,b]=[...ptrs.values()]; pinch={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),f:fovBase}; } down={x:e.clientX,y:e.clientY,yaw,pitch,moved:0}; el.style.cursor='grabbing'; });
  el.addEventListener('pointermove',e=>{ if(ptrs.has(e.pointerId)) ptrs.set(e.pointerId,e);
    if(pinch&&ptrs.size===2){ const [a,b]=[...ptrs.values()]; const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY); fovBase=clamp(pinch.f*pinch.d/d,32,95); return; }
    if(down){ const dx=e.clientX-down.x, dy=e.clientY-down.y; down.moved=Math.max(down.moved,Math.hypot(dx,dy)); if(!focused&&!tween){ yaw=clamp(down.yaw-dx*0.0045,-1.15,1.0); pitch=clamp(down.pitch-dy*0.0045,-0.75,0.3); cam.quaternion.copy(homeQ()); } return; }
    const n=pick(e); if(n!==hover){ hover=n; el.style.cursor=n?'pointer':'grab'; api.onHover?.(n,e); } else if(n) api.onHover?.(n,e); });
  const up=e=>{ ptrs.delete(e.pointerId); if(ptrs.size<2) pinch=null; if(down&&down.moved<6){ const n=pick(e); if(n){ if(n==='lamp') api.lamp(); else api.onPick?.(n); } } down=null; el.style.cursor=hover?'pointer':'grab'; };
  el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up);
  el.addEventListener('pointerleave',()=>{ if(!down){ hover=null; api.onHover?.(null); } });
  el.addEventListener('wheel',e=>{ e.preventDefault(); if(!focused) fovBase=clamp(fovBase+e.deltaY*0.03,32,95); },{passive:false});
  let focusFov=42; const resize=()=>{ const w=host.clientWidth, hh=host.clientHeight; gl.setSize(w,hh,false); cam.aspect=w/hh; const a=w/hh; if(a<1.25){ fovBase=clamp(2*Math.atan(Math.tan(32*Math.PI/180)/a)*180/Math.PI,58,92); focusFov=clamp(fovBase*0.72,42,72); } else { focusFov=42; } cam.updateProjectionMatrix(); };
  const ro=new ResizeObserver(resize); ro.observe(host); resize();
  const loop=(now)=>{ if(disposed) return; raf=requestAnimationFrame(loop);
    if(tween){ const k=Math.min(1,(now-tween.t0)/tween.dur), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; cam.position.lerpVectors(tween.p0,tween.p1,e); cam.quaternion.copy(tween.q0).slerp(tween.q1,e); if(k>=1){ const cb=tween.cb; tween=null; cb&&cb(); } }
    const targetFov=focused?focusFov:fovBase; if(Math.abs(cam.fov-targetFov)>0.05){ cam.fov+=(targetFov-cam.fov)*0.12; cam.updateProjectionMatrix(); }
    const pulse=0.5+0.5*Math.sin(now/260);
    for(const [n,g] of Object.entries(groups)){ const on= n===hover ? 0.22 : n===alerted ? 0.08+0.22*pulse : 0; for(const m of g.mats){ m.emissive.setRGB(on*1.0,on*0.62,on*0.25); } }
    if(marker.visible){ const b=MARK[alerted]; marker.position.y=b[1]+Math.sin(now/300)*0.015; }
    gl.render(scene,cam); };
  raf=requestAnimationFrame(loop);
  api.dispose=()=>{ disposed=true; cancelAnimationFrame(raf); ro.disconnect(); gl.dispose(); gl.forceContextLoss?.(); };
  return api;
}
