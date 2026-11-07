// Fictional companies, scenario factors (rate hikes, recessions...), and the daily market engine.
/* ============================== COMPANIES ============================== */
// Card stats are what players see. Sensitivities are hidden engine inputs.
const COMPANIES = [
 {id:'NMBS',name:'Nimbus Cloud',sector:'Tech',what:'Rents computer servers and storage to other businesses.',growth:22,margin:26,debt:'low',pe:34,edge:'Companies hate switching cloud providers once their data lives there.',
  how:['Businesses pay a monthly fee to use its servers','It sells ads on its website','It makes and sells laptops'],beta:1.25,rate:-1.5,rec:-0.6,inf:-0.3,vol:0.30,q:0.03},
 {id:'ZAPP',name:'ZipZap Social',sector:'Tech',what:'A short-video app that makes money from ads.',growth:38,margin:6,debt:'med',pe:85,edge:'Huge user base, but apps go out of style fast.',
  how:['Companies pay to show ads to its users','Users pay $20 a month','It sells phones'],beta:1.5,rate:-2.2,rec:-1.0,inf:-0.5,vol:0.48,q:-0.01},
 {id:'STRM',name:'StreamVerse',sector:'Media',what:'Streams movies and shows for a monthly subscription.',growth:15,margin:5,debt:'high',pe:60,edge:'A few hit shows, but lots of rivals fighting for the same viewers.',
  how:['Viewers pay a monthly subscription','It sells movie theater tickets','It builds TVs'],beta:1.3,rate:-1.8,rec:-0.7,inf:-0.4,vol:0.40,q:-0.035},
 {id:'HLBK',name:'Heartland Bank',sector:'Banks',what:'Takes deposits and lends money for homes, cars and businesses.',growth:5,margin:24,debt:'high',pe:11,edge:'Trusted local branches. Banks always carry lots of debt (your deposits!).',
  how:['It charges more interest on loans than it pays on savings','It charges an entry fee at branches','It sells insurance only'],beta:1.0,rate:0.6,rec:-1.4,inf:0.1,vol:0.22,q:0.01},
 {id:'BGPW',name:'BrightGrid Power',sector:'Utilities',what:'Sells electricity to homes in three states at prices set by regulators.',growth:3,margin:14,debt:'high',pe:17,edge:'It is the only power company in its area.',
  how:['Customers pay a monthly electric bill','It sells solar panels to other countries','It runs gas stations'],beta:0.45,rate:-0.9,rec:-0.1,inf:-0.2,vol:0.14,q:0.012},
 {id:'PTRA',name:'Petra Energy',sector:'Energy',what:'Drills for oil and natural gas and sells it.',growth:9,margin:16,debt:'med',pe:9,edge:'Low-cost wells, but profits swing with oil prices.',
  how:['It sells the oil and gas it pulls from the ground','It charges drivers a monthly membership','It sells ads'],beta:0.9,rate:0,rec:-1.1,inf:1.8,vol:0.32,q:0},
 {id:'FRSH',name:'FreshCart Grocers',sector:'Staples',what:'Runs 900 grocery stores across the Midwest.',growth:4,margin:3,debt:'low',pe:20,edge:'People buy food in good times and bad.',
  how:['It sells groceries for a little more than it pays for them','It charges shoppers to enter','It lends money'],beta:0.55,rate:-0.3,rec:0.2,inf:-0.3,vol:0.15,q:0.015},
 {id:'VTLS',name:'Vitalis Health',sector:'Healthcare',what:'Invents and sells medicines for heart disease.',growth:11,margin:22,debt:'low',pe:19,edge:'Patents stop anyone from copying its drugs for years.',
  how:['Hospitals and pharmacies buy its medicines','It runs gyms','It sells health ads'],beta:0.7,rate:-0.4,rec:0,inf:-0.1,vol:0.20,q:0.03},
 {id:'IRON',name:'Ironclad Machines',sector:'Industrials',what:'Builds tractors and construction equipment.',growth:7,margin:12,debt:'med',pe:15,edge:'Dealers everywhere and steady money from repair parts.',
  how:['Farms and builders buy its machines and parts','It rents apartments','It sells video games'],beta:1.1,rate:-0.6,rec:-1.5,inf:0.3,vol:0.25,q:0.01},
 {id:'SMIT',name:'Summit Outdoor',sector:'Retail',what:'Sells hiking and camping gear online.',growth:18,margin:10,debt:'med',pe:25,edge:'Loyal fans, but people skip new gear when money is tight.',
  how:['Shoppers buy gear from its website','It charges park entry fees','It makes cars'],beta:1.2,rate:-1.0,rec:-1.3,inf:-0.4,vol:0.30,q:0.02},
];
const CO = Object.fromEntries(COMPANIES.map(c=>[c.id,c]));
const BOND = {id:'BOND',name:'Bond fund',beta:0.05,rate:-1.6,rec:0.25,inf:-0.6,vol:0.05};
const SECTORS = [...new Set(COMPANIES.map(c=>c.sector))];

/* ============================== REAL COMPANIES (research only) ============================== */
// Real, dated figures used in lessons and the stock pitch. Simulations keep the fictional companies above,
// so the game never invents news or prices for a real company. No logos; no buy/sell advice.
// Source: stockanalysis.com statistics pages (trailing twelve months), checked Nov 7, 2026. Update before reuse.
const REAL_SRC = 'stockanalysis.com company statistics, late Oct–early Nov 2026';
const REAL = [
  {id:'AAPL',name:'Apple',exchange:'Nasdaq',sector:'Technology',what:'Designs iPhones, Macs and other devices, and sells services like the App Store and iCloud.',mcap:4.57e12,pe:35.9,margin:27.6,de:0.78,div:0.34,asOf:'Nov 2026',edge:'Hundreds of millions of loyal users locked into its devices, apps and services.'},
  {id:'MSFT',name:'Microsoft',exchange:'Nasdaq',sector:'Technology',what:'Makes Windows, Office and the Azure cloud that businesses rent.',mcap:3.94e12,pe:27.7,margin:41.2,de:0.28,div:0.74,asOf:'Nov 6, 2026',edge:'Businesses run on its software and cloud, and switching is painful.'},
  {id:'NVDA',name:'Nvidia',exchange:'Nasdaq',sector:'Technology',what:'Designs the chips that power most AI data centers and many gaming PCs.',mcap:5.09e12,pe:26.7,margin:null,de:0.17,div:null,asOf:'Oct 23, 2026',edge:'The leading maker of AI chips; revenue more than doubled in each of fiscal 2024 and 2025.'},
  {id:'JPM',name:'JPMorgan Chase',exchange:'NYSE',sector:'Banks',what:'The largest US bank: checking and savings accounts, loans, credit cards and investment banking.',mcap:895e9,pe:14.2,margin:34.6,de:3.56,div:1.96,asOf:'Oct 30, 2026',edge:'Huge size and trust. Like all banks, it carries lots of debt, because your deposits count as money it owes.'},
  {id:'NEE',name:'NextEra Energy',exchange:'NYSE',sector:'Utilities',what:'Sells electricity through Florida Power & Light and builds wind and solar farms.',mcap:171.9e9,pe:14.8,margin:40.4,de:1.53,div:3.04,asOf:'Oct 27, 2026',edge:'A regulated utility with steady customers, plus one of the largest renewable energy businesses.'},
  {id:'XOM',name:'ExxonMobil',exchange:'NYSE',sector:'Energy',what:'Finds, pumps and refines oil and natural gas around the world.',mcap:676.6e9,pe:17.1,margin:10.5,de:0.13,div:2.58,asOf:'Nov 6, 2026',edge:'One of the largest oil and gas companies; profits rise and fall with oil prices.'},
  {id:'WMT',name:'Walmart',exchange:'NYSE',sector:'Consumer staples',what:'Runs the largest chain of stores in the US, selling groceries and everyday goods.',mcap:995.8e9,pe:45.5,margin:3.0,de:0.72,div:0.79,asOf:'Nov 6, 2026',edge:'Massive scale lets it charge low prices, and people shop for necessities in good times and bad.'},
  {id:'JNJ',name:'Johnson & Johnson',exchange:'NYSE',sector:'Healthcare',what:'Develops prescription medicines and medical devices.',mcap:641.1e9,pe:40.4,margin:16.2,de:0.55,div:2.01,asOf:'Oct 26, 2026',edge:'Patents protect its medicines, and it has raised its dividend for decades.'},
  {id:'CAT',name:'Caterpillar',exchange:'NYSE',sector:'Industrials',what:'Builds construction and mining equipment like bulldozers and excavators.',mcap:286.3e9,pe:24.5,margin:15.2,de:2.10,div:1.05,asOf:'Oct 30, 2026',edge:'A worldwide dealer network and steady sales of replacement parts.'},
  {id:'NKE',name:'Nike',exchange:'NYSE',sector:'Consumer discretionary',what:'Designs and sells athletic shoes, clothing and gear.',mcap:57.4e9,pe:18.5,margin:6.7,de:0.73,div:4.24,asOf:'Oct 30, 2026',edge:'One of the best-known brands in the world, but people buy fewer sneakers when money is tight.'},
];
const RC = Object.fromEntries(REAL.map(c=>[c.id,c]));
const bigMoney = x => x>=1e12 ? '$'+(x/1e12).toFixed(2).replace(/\.?0+$/,'')+' trillion' : '$'+Math.round(x/1e9)+' billion';
const deLevel = de => de==null?null: de<0.5?'low': de<1.5?'med':'high';
function card(c, {pick=false, sel=false}={}){
  if(c.mcap){ const dl=deLevel(c.de);
    return `<div class="cc real ${pick?'pick':''} ${sel?'sel':''}" data-id="${c.id}" ${pick?'role="button" tabindex="0"':''}>
    <div class="cc-top"><span class="cc-name">${c.name}</span><span class="tick">${c.id}</span></div>
    <div class="cc-tag">Real company · ${c.exchange} · data ${c.asOf}</div>
    <div class="muted" style="font-size:13px">${c.sector} · ${c.what}</div>
    <dl class="stats">
      <dt>Market cap</dt><dd>${bigMoney(c.mcap)}</dd>
      <dt>P/E ratio</dt><dd>${c.pe.toFixed(1)}×</dd>
      ${c.margin!=null?`<dt>Profit margin</dt><dd>keeps ${Math.round(c.margin)}¢ per $1</dd>`:''}
      <dt>Debt-to-equity</dt><dd>${c.de.toFixed(2)} <span class="lvl ${dl}">${{low:'Low',med:'Medium',high:'High'}[dl]}</span></dd>
      ${c.div!=null?`<dt>Dividend yield</dt><dd>${c.div.toFixed(2)}%</dd>`:''}
    </dl>
    <div class="edge"><span class="eyebrow">Edge</span><br>${c.edge}</div>
    <div class="cc-src">Source: ${REAL_SRC}. For learning only, not a recommendation.</div>
  </div>`; }
  const dl={low:'Low',med:'Medium',high:'High'}[c.debt];
  return `<div class="cc ${pick?'pick':''} ${sel?'sel':''}" data-id="${c.id}" ${pick?'role="button" tabindex="0"':''}>
    <div class="cc-top"><span class="cc-name">${c.name}</span><span class="tick">${c.id}</span></div>
    <div class="cc-tag fake">Practice-market company (fictional)</div>
    <div class="muted" style="font-size:13px">${c.sector} · ${c.what}</div>
    <dl class="stats">
      <dt>Sales growth</dt><dd>${c.growth}% / yr</dd>
      <dt>Profit margin</dt><dd>keeps ${c.margin}¢ per $1</dd>
      <dt>Debt</dt><dd><span class="lvl ${dl}">${dl}</span></dd>
      <dt>P/E ratio</dt><dd>${c.pe}× ${c.pe>=50?'<span class="lvl high">pricey</span>':c.pe<=12?'<span class="lvl low">cheap</span>':''}</dd>
    </dl>
    <div class="edge"><span class="eyebrow">Edge</span><br>${c.edge}</div>
  </div>`;
}

/* ============================== SCENARIOS ============================== */
// Factor totals are returns spread across each phase. Magnitudes are scaled from real episodes:
// 2022: S&P 500 fell about 19% and the Nasdaq about 33% as the Fed raised rates from near 0% to 4.25–4.50%; the US aggregate bond index lost about 13%.
// 2008: S&P 500 fell about 38% for the year. Midterm years: average peak-to-trough drop of about 17% since 1950 (LPL Research), with stocks higher 12 months after every midterm since 1950.
// 2021–22: US CPI inflation peaked at 9.1% (June 2022). Past patterns never guarantee future results.
const SCEN = {
  rateHike:{name:'Fed raises interest rates',headline:'FED HIKES RATES AGAIN to fight inflation. Borrowing just got more expensive.',basedOn:'2022, when the Fed raised rates seven times',
    phases:[{days:160,mkt:-0.12,rate:0.08,vol:1.5}],savings:'Savings accounts start paying MORE interest.',
    why:'Higher rates are like gravity on stock prices. Fast-growing companies get hit hardest because most of their profits are far in the future, and money later is worth less when you can earn more safely today. Bonds fall too, because new bonds pay more than old ones. Banks hold up better since they earn more on loans.'},
  rateCut:{name:'Fed cuts interest rates',headline:'FED CUTS RATES to boost a slowing economy.',basedOn:'rate-cut cycles like 2019 and 2024',
    phases:[{days:120,mkt:0.06,rate:-0.06,vol:1.0}],savings:'Savings accounts pay LESS interest.',
    why:'Cheaper borrowing helps companies and makes future profits worth more today, so growth stocks and bonds usually rise. Savers earn less on cash.'},
  midterm:{name:'Midterm elections',headline:'MIDTERM ELECTIONS AHEAD. Polls are close and nobody knows which way Congress will go.',basedOn:'midterm years since 1950 (average drop of about 17% from the high)',
    phases:[{days:60,mkt:-0.10,vol:1.8},{days:120,mkt:0.14,vol:1.0}],savings:'No change.',
    why:'Markets dislike uncertainty more than they dislike any particular result. Before the vote, investors guess at new laws and taxes, so prices get choppy. Once results are in, the uncertainty clears and prices have historically recovered. This is about uncertainty, not about which party wins.'},
  recession:{name:'Recession',headline:'RECESSION CONFIRMED. Layoffs rise and shoppers cut back.',basedOn:'2008, when the S&P 500 fell about 38%',
    phases:[{days:110,mkt:-0.30,rec:0.15,vol:2.2},{days:250,mkt:0.22,rec:-0.06,vol:1.3}],savings:'Safe, but pays little.',
    why:'In a recession people buy fewer tractors, camping gear and vacations, so "cyclical" companies fall hard. Groceries, electricity and medicine are needs, so those "defensive" companies fall much less. Bonds often rise as investors look for safety.'},
  inflation:{name:'Inflation spike',headline:'PRICES SURGE. Inflation hits a 40-year high.',basedOn:'2021–22, when inflation peaked at 9.1%',
    phases:[{days:120,mkt:-0.05,inf:0.10,vol:1.3},{days:150,mkt:-0.08,rate:0.06,vol:1.4}],savings:'Cash quietly loses about 8% of its buying power.',
    why:'When prices rise fast, oil and gas companies earn more, so energy stocks climb. Cash loses buying power. And events chain together: high inflation usually makes the Fed raise rates next, which hurts growth stocks and bonds.'},
  earnings:{name:'Earnings surprise',headline:'EARNINGS SHOCK. One company just reported results nobody expected.',basedOn:'typical single-day moves after earnings reports',
    phases:[],savings:'No change.',
    why:'A single report can move one stock 20% or more in a day. That is single-stock risk. A diversified portfolio barely notices, because one company is only a small slice.'},
};
function impact(asset, ph){ return (ph.mkt||0)*(asset.beta) + (ph.rate||0)*asset.rate + (ph.rec||0)*asset.rec + (ph.inf||0)*asset.inf; }
function earningsMove(c){ return c.q>=0.015 ? 0.22 : -0.28; }

/* ============================== ENGINE ============================== */
// Daily market: random moves + rare jumps (fat tails) + scenario overlays. Seeded so runs are repeatable.
function simulateDaily({days, seed, events=[]}){
  const r=rng(seed), g=()=>gaussFrom(r), sq=Math.sqrt(252);
  const N=days+1;
  const ov = {mkt:new Float64Array(N),rate:new Float64Array(N),rec:new Float64Array(N),inf:new Float64Array(N),vol:new Float64Array(N).fill(1)};
  const marks=[];
  for(const ev of events){
    const s=SCEN[ev.id]; let d=ev.start; marks.push({day:ev.start,id:ev.id});
    for(const ph of s.phases){ for(let k=0;k<ph.days && d+k<N;k++){ const i=d+k; ov.mkt[i]+=(ph.mkt||0)/ph.days; ov.rate[i]+=(ph.rate||0)/ph.days; ov.rec[i]+=(ph.rec||0)/ph.days; ov.inf[i]+=(ph.inf||0)/ph.days; ov.vol[i]=Math.max(ov.vol[i],ph.vol||1);} d+=ph.days; }
  }
  const earn = {}; events.filter(e=>e.id==='earnings').forEach(e=>{ earn[e.start]=e.target||'ZAPP'; });
  const P={}; for(const c of COMPANIES) P[c.id]=new Float64Array(N); P.INDEX=new Float64Array(N); P.BOND=new Float64Array(N);
  for(const k in P) P[k][0]=100;
  for(let d=1; d<N; d++){
    const vm=ov.vol[d]; const ph={mkt:ov.mkt[d],rate:ov.rate[d],rec:ov.rec[d],inf:ov.inf[d]};
    let mShock = 0.155/sq*g()*vm; if(r()<0.003) mShock += -0.015+0.035*g();
    let sum=0;
    for(const c of COMPANIES){
      const drift=(0.02+c.beta*0.05+c.q)/252;
      let idio=c.vol*0.7/sq*g()*Math.sqrt(vm); if(r()<0.004) idio+=0.07*g();
      let ret = drift + c.beta*mShock + idio + impact(c,ph);
      if(earn[d]===c.id) ret += earningsMove(c);
      ret=clamp(ret,-0.45,0.6); P[c.id][d]=P[c.id][d-1]*(1+ret); sum+=ret;
    }
    P.INDEX[d]=P.INDEX[d-1]*(1+sum/COMPANIES.length-0.0003/252);
    const bret=0.04/252 + 0.05/sq*g() + impact(BOND,ph);
    P.BOND[d]=P.BOND[d-1]*(1+bret);
  }
  return {P, marks, days};
}
