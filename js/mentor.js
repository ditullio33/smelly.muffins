// AI mentor chat: personas, fallback answers, Claude sample() hookup.
/* ============================== MENTOR ============================== */
const MENTORS = {
  intern:{name:'Maya Chen',role:'Junior Analyst · your mentor',init:'MC',color:'#23856A',style:'warm and encouraging. Explain step by step using everyday examples (like a part-time job or buying sneakers). Celebrate good thinking.'},
  junior:{name:'Marcus Reed',role:'Associate · your mentor',init:'MR',color:'#2B47D4',style:'friendly but direct. Ask the player to explain their reasoning before giving the answer.'},
  senior:{name:'Dana Okafor',role:'Senior Analyst · your mentor',init:'DO',color:'#7A3E9D',style:'brief and Socratic, with a high bar. Push back on weak reasoning with a pointed question, but stay respectful. Two or three sentences.'},
};
let mentorKey='intern'; const chat=[]; let voiceOn=false; let CTX={screen:'path'};
function setMentor(k){
  if(mentorKey===k && chat.length) return; const changed=mentorKey!==k && chat.length; mentorKey=k; const m=MENTORS[k];
  $('#m-av').textContent=m.init; $('#m-av').style.background=m.color; $('#m-name').textContent=m.name; $('#m-role').textContent=m.role;
  $('#m-fab-av').textContent=m.init; $('#m-fab-av').style.background=m.color; $('#m-fab-name').textContent=m.name.split(' ')[0];
  if(changed) $('#m-log').appendChild(h(`<div class="eyebrow" style="text-align:center;padding-block:4px">Now with ${esc(m.name)}</div>`));
}
function avatar(k,size=''){ const m=MENTORS[k]; return `<span class="avatar" style="background:${m.color}${size?`;width:${size};height:${size};font-size:calc(${size} * .38)`:''}">${m.init}</span>`; }
function say(text, who='m', src=''){
  if(who==='m' && chat.length && chat[chat.length-1].text===text) return null;
  chat.push({who,text}); const el=h(`<div class="msg ${who}"></div>`); el.textContent=text;
  if(src) el.appendChild(h(`<span class="src">${esc(src)}</span>`));
  $('#m-log').appendChild(el); $('#m-log').scrollTop=1e9;
  if(who==='m' && voiceOn) speak(text);
  if(who==='m' && text!=='Thinking…' && text!=='Reading your work…') nudge(text);
  return el;
}
function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.rate=1.02; speechSynthesis.speak(u);}catch(e){} }
const FAQ = [
  [/which level|what level|pick a level/i, 'Pick Beginner if the topic is new, Intermediate if you know the vocab and want scenarios, Advanced for case problems and timed decisions. Not sure? Take the 6-question placement quiz. You can change it anytime in plan settings.'],
  [/tested out/i, 'Tested out means your level skips that intro lesson. It still shows on your path with a check, and you can open it anytime for a refresher.'],
  [/credit score/i, 'A credit score (FICO runs 300 to 850) shows lenders how reliably you repay. Paying on time matters most, then keeping balances low compared with your limits.'],
  [/compound|interest on interest|rule of 72|double/i,'Compounding means your gains start earning their own gains. At 7% a year, money doubles about every 10 years (72 ÷ 7 ≈ 10). That is why starting early matters so much.'],
  [/diversif|eggs|basket|spread/i,'Diversifying means spreading money across many companies and sectors so one bad surprise can\'t sink you. An index fund does this in one purchase.'],
  [/index fund|etf/i,'An index fund buys a small slice of many companies at once. You get the average result of the whole market, usually for a tiny fee.'],
  [/p\/?e|price.to.earn|expensive|cheap|valuation/i,'P/E compares a stock\'s price to its yearly profit per share. A P/E of 20 means you pay $20 for every $1 of profit. A high P/E means investors expect big growth, which also means more room to fall if growth slows.'],
  [/margin|profit/i,'Profit margin is how many cents the company keeps from each dollar of sales after paying its costs. Higher margins usually mean a stronger business.'],
  [/debt|borrow|loan/i,'Debt isn\'t always bad, but a company with a lot of it must keep making payments in bad times. High-debt companies get hit harder when interest rates rise.'],
  [/fee|expense ratio/i,'Fees come out every year whether you win or lose. A 1% fee sounds tiny, but over 30 years it can eat about a quarter of your ending balance.'],
  [/rate|fed|interest/i,'When the Fed raises rates, borrowing costs more and safe savings pay more, so stocks (especially fast-growing ones) and bonds usually fall. Cuts usually do the opposite.'],
  [/election|midterm|vote|congress/i,'Elections add uncertainty, and markets dislike uncertainty. Prices can get choppy before a vote and have historically settled down after, no matter who wins.'],
  [/recession|crash|downturn|panic|sell/i,'In a recession most stocks fall, but "defensive" companies selling needs (food, power, medicine) usually fall less. Panic-selling at the bottom locks in the loss.'],
  [/emergency|rainy day|liquid/i,'Keep 3 to 6 months of expenses in cash before investing. Then a surprise bill never forces you to sell stocks at a bad time.'],
  [/inflation/i,'Inflation means prices rise, so each dollar buys less. Cash sitting still slowly loses value. Investing aims to grow faster than inflation.'],
  [/roth|ira|401/i,'A Roth IRA is a retirement account. You put in money you\'ve already paid tax on, and it can grow and come out tax-free in retirement. If you have a job, even a summer one, you can open one.'],
  [/rebalanc/i,'Rebalancing means selling a little of what grew too big and buying what shrank, so your mix stays at the risk level you chose.'],
  [/bond/i,'A bond is a loan you make to a government or company. They pay you interest. Bonds swing less than stocks but usually grow less too.'],
  [/stock|share/i,'A share of stock is a tiny piece of ownership in a company. If the company grows its profits, your piece usually becomes worth more.'],
  [/real|buy .*now|which stock|should i buy|tesla|apple|nvidia/i,'I can\'t tell you which real stock to buy. But you now know how to research one: what does it do, is it growing, does it keep a good share of each dollar, how much debt does it carry, and is the price (P/E) reasonable?'],
];
function faq(q){ for(const [re,a] of FAQ) if(re.test(q)) return a; return 'Good question. Try asking me about compounding, diversification, index funds, P/E ratios, debt, fees, interest rates, recessions, inflation or emergency funds.'; }
let samplePromise=null;
function getSample(){ if(!samplePromise) samplePromise = window.claude?.use ? window.claude.use('sample').catch(()=>null) : Promise.resolve(null); return samplePromise; }
async function ask(q, fallback){
  say(q,'u'); const m=MENTORS[mentorKey]; const sample=await getSample();
  if(!sample){ say(fallback||faq(q),'m','Mentor notes'); return; }
  const el=say('Thinking…','m');
  const sys=`You are ${m.name}, a ${m.role.split(' ·')[0]} at Redhawk Capital, mentoring a high-school student inside "The Bullpen", a lesson-based investing game. Your style: ${m.style}
Rules: 2–4 short sentences, plain language, no jargon without a quick explanation. Use only numbers that appear in the game context; never invent or recalculate figures, and never change scores. All companies in the game are fictional. Do not recommend real stocks, crypto or real products; if asked, explain how to research instead. Keep it age-appropriate and stay neutral on politics (elections matter to markets only through uncertainty). No markdown.
Game context (JSON): ${JSON.stringify(CTX)}`;
  const recent=chat.slice(0,-2).filter(c=>c.text!=='Thinking…').slice(-6).map(c=>(c.who==='u'?'Student: ':'Mentor: ')+c.text).join('\n');
  const prompt=sys+(recent?`\n\nRecent conversation:\n${recent}`:'')+`\n\nStudent's new message: ${q}\n\nReply as the mentor.`;
  try{ const res=await sample(prompt,{cache:false,modelTier:'quick',onText:({text})=>{ el.textContent=text; $('#m-log').scrollTop=1e9; }});
    el.textContent=res.text; el.appendChild(h('<span class="src">AI mentor</span>')); chat[chat.length-1]={who:'m',text:res.text}; if(voiceOn) speak(res.text);
  }catch(e){ el.textContent=fallback||faq(q); el.appendChild(h('<span class="src">Mentor notes</span>')); chat[chat.length-1]={who:'m',text:el.textContent}; }
}
async function aiFeedback(prompt, fallback){
  const sample=await getSample(); if(!sample){ say(fallback,'m','Mentor notes'); return; }
  const m=MENTORS[mentorKey]; const el=say('Reading your work…','m');
  try{ const res=await sample(`You are ${m.name}, ${m.role.split(' ·')[0]} mentoring a high-school student in an investing game with fictional companies. Style: ${m.style} Give feedback in 3–4 sentences, no markdown. Do not change the score; it was computed by the game.\n\n${prompt}`,{cache:false,modelTier:'quick',onText:({text})=>{el.textContent=text}});
    el.textContent=res.text; el.appendChild(h('<span class="src">AI mentor</span>')); chat[chat.length-1]={who:'m',text:res.text};
  }catch(e){ el.textContent=fallback; el.appendChild(h('<span class="src">Mentor notes</span>')); }
}
$('#m-form').addEventListener('submit',e=>{ e.preventDefault(); const v=$('#m-input').value.trim(); if(!v) return; $('#m-input').value=''; ask(v); });
let teaserT;
function hideTeaser(){ clearTimeout(teaserT); $('#m-teaser')?.remove(); }
function openMentor(){ $('#mentor').classList.add('open'); document.body.classList.add('mentor-open'); $('#m-fab').setAttribute('aria-expanded','true'); $('#m-dot').hidden=true; hideTeaser(); $('#m-log').scrollTop=1e9; setTimeout(()=>$('#m-input').focus({preventScroll:true}),60); }
function closeMentor(silent){ const was=$('#mentor').classList.contains('open'); $('#mentor').classList.remove('open'); document.body.classList.remove('mentor-open'); $('#m-fab').setAttribute('aria-expanded','false'); if(was&&!silent) $('#m-fab').focus({preventScroll:true}); }
function nudge(text){ if($('#mentor').classList.contains('open')) return; $('#m-dot').hidden=false; if(document.body.classList.contains('focus')) return;
  hideTeaser(); const t=h(`<div class="m-teaser" id="m-teaser" role="status"></div>`); t.textContent=text.length>120?text.slice(0,117)+'…':text; t.onclick=openMentor; document.body.append(t); teaserT=setTimeout(hideTeaser,7000); }
$('#m-close').onclick=()=>closeMentor();
$('#m-fab').onclick=()=>$('#mentor').classList.contains('open')?closeMentor():openMentor();
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#mentor').classList.contains('open')&&!document.querySelector('.dlg-scrim')){ e.stopPropagation(); closeMentor(); } },true);
function mentorTools(qs){
  const t=$('#m-tools'); t.innerHTML='';
  qs.forEach(q=>{ const b=h(`<button class="chip" type="button"></button>`); b.textContent=q; b.onclick=()=>ask(q); t.appendChild(b); });
  const v=h(`<button class="chip ${voiceOn?'on':''}" type="button" aria-pressed="${voiceOn}">Mentor voice ${voiceOn?'on':'off'}</button>`);
  v.onclick=()=>{ voiceOn=!voiceOn; if(!voiceOn) try{speechSynthesis.cancel()}catch(e){}; mentorTools(qs); }; t.appendChild(v);
}
