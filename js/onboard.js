// Onboarding (topics → level per topic → placement quiz if "Not sure" → "Here's your plan") and the settings screen.
let OB = null; // in-progress onboarding: { picks:[], levels:{}, placed:{}, step, single }
const MAX_PICKS = 3;

function obFrame(main, steps, at) {
  document.body.classList.add('focus'); statsBar(' ');
  const el = h(`<div class="lesson ob" style="--uc:var(--u2)">
    <div class="ob-top"><button class="linkbtn" id="ob-back" ${at === 0 && !OB.single ? 'hidden' : ''}>← Back</button>
    <ol class="dots" aria-label="Step ${at + 1} of ${steps}">${Array.from({ length: steps }, (_, i) => `<li class="${i < at ? 'past' : i === at ? 'now' : ''}"></li>`).join('')}</ol><span class="ob-n muted">${at + 1}/${steps}</span></div>
    <div class="l-body" id="lb"></div><div class="l-foot" id="lf"><div class="foot-in" id="lfi"></div></div></div>`);
  main.append(el);
  const ui = { el, body: el.querySelector('#lb'), foot: el.querySelector('#lf'), fin: el.querySelector('#lfi'), footReset() { this.foot.className = 'l-foot'; this.fin.innerHTML = ''; } };
  el.querySelector('#ob-back').onclick = () => { if (OB.single) { const back = OB.returnTo || 'settings'; OB = null; go(back); return; } OB.step = Math.max(0, OB.step - 1); renderOnboard(main); };
  return ui;
}
function startOnboarding(prefill) { OB = { picks: prefill ? prefill.map(p => p.id) : [], levels: Object.fromEntries((prefill || []).map(p => [p.id, p.level])), placed: {}, step: 0 }; }

function renderOnboard(main) {
  if (!OB) startOnboarding();
  main.innerHTML = ''; window.scrollTo({ top: 0 });
  const steps = 1 + OB.picks.length + 1, at = OB.step;
  setMentor('intern'); CTX = { screen: 'onboarding' };
  const ui = obFrame(main, Math.max(steps, 3), at);
  if (at === 0) return obTopics(main, ui);
  if (at <= OB.picks.length) return obLevel(main, ui, TRACK[OB.picks[at - 1]]);
  return obPlan(main, ui);
}

function obTopics(main, ui) {
  ui.body.append(h(`<div class="ob-head"><span class="hero-bull sm">${BULL_LOGO}</span><div><h2 class="l-q" style="margin:0">What do you want to learn?</h2><p class="muted">Pick 1 to 3 topics. You can add more later.</p></div></div>`));
  const msg = h(`<p class="pick-msg" role="status" aria-live="polite"></p>`);
  const go = h(`<button class="btn go big" style="margin-left:auto">Continue</button>`);
  const cards = [];
  const sync = () => { const n = OB.picks.length; cards.forEach(c => { const on = OB.picks.includes(c.dataset.id); c.classList.toggle('on', on); c.setAttribute('aria-checked', on); c.disabled = !hasLessons(TRACK[c.dataset.id]) || (!on && n >= MAX_PICKS); });
    msg.textContent = n >= MAX_PICKS ? "That's 3. Tap one to swap it out." : n ? `${n} of 3 picked` : ''; go.disabled = !n; };
  TRACK_GROUPS.forEach((g, gi) => {
    const sec = h(`<section class="topic-group"><h3>${g.name}</h3><div class="topic-grid" role="group" aria-label="${g.name}"></div></section>`);
    TRACKS.filter(t => t.group === gi).forEach(t => {
      const c = h(`<button class="topic" role="checkbox" aria-checked="false" data-id="${t.id}"><span class="t-emoji" aria-hidden="true">${t.emoji}</span><span><b>${t.title}</b><span class="muted">${t.desc}</span>${hasLessons(t) ? '' : '<span class="tag soon">Coming soon</span>'}</span><span class="t-tick" aria-hidden="true">${I.check}</span></button>`);
      c.onclick = () => { if (!hasLessons(t)) return; const i = OB.picks.indexOf(t.id); if (i >= 0) OB.picks.splice(i, 1); else if (OB.picks.length < MAX_PICKS) OB.picks.push(t.id); sync(); };
      cards.push(c); sec.querySelector('.topic-grid').append(c); });
    ui.body.append(sec); });
  ui.fin.append(msg, go); sync();
  go.onclick = () => { OB.step = 1; renderOnboard(main); };
}

function obLevel(main, ui, t) {
  ui.body.append(h(`<div class="ob-head"><span class="t-emoji lg" aria-hidden="true">${t.emoji}</span><h2 class="l-q" style="margin:0">How much do you already know about ${t.title}?</h2></div>`));
  const box = h(`<div class="level-grid" role="radiogroup" aria-label="Your level"></div>`); let sel = OB.levels[t.id] && !OB.placed[t.id] ? OB.levels[t.id] : null;
  const go = h(`<button class="btn go big" style="margin-left:auto" ${sel ? '' : 'disabled'}>Continue</button>`);
  Object.entries(LEVELS).forEach(([k, lv]) => {
    const c = h(`<button class="level-card ${sel === k ? 'on' : ''}" role="radio" aria-checked="${sel === k}"><span class="t-emoji" aria-hidden="true">${lv.emoji}</span><span><b>${lv.name}</b><span>"${esc(lv.line)}"</span><span class="muted">${lv.does}</span></span></button>`);
    c.onclick = () => { sel = k; box.querySelectorAll('.level-card').forEach(x => { x.classList.toggle('on', x === c); x.setAttribute('aria-checked', x === c); }); go.disabled = false; go.textContent = k === 'unsure' ? 'Start the quiz' : 'Continue'; };
    box.append(c); });
  ui.body.append(box); ui.fin.append(go);
  go.onclick = () => {
    if (sel !== 'unsure') { OB.levels[t.id] = sel; delete OB.placed[t.id]; return advance(main); }
    setMentor(t.mentor);
    runPlacement(ui, t.id, r => { OB.levels[t.id] = r.level; OB.placed[t.id] = r; const lv = LEVELS[r.level];
      ui.body.innerHTML = ''; ui.footReset();
      ui.body.append(h(`<div class="stack done-screen"><span class="t-emoji xl" aria-hidden="true">${lv.emoji}</span><span class="eyebrow">Your ${t.title} level</span><h2 style="font-size:32px">${lv.name}</h2><p class="muted" style="max-width:44ch">${esc(r.why)}</p><p class="muted" style="font-size:14px">You can change this anytime in your plan settings.</p></div>`));
      const nx = h(`<button class="btn go big" style="margin-left:auto">Continue</button>`); nx.onclick = () => advance(main); ui.fin.append(nx); nx.focus({ preventScroll: true }); });
  };
}
function advance(main) {
  if (OB.single && OB.step < OB.picks.length) { OB.step++; return renderOnboard(main); }
  if (OB.single) { const back = OB.returnTo || 'settings'; saveProfile(); OB = null; go(back); return; }
  OB.step++; if (OB.step > OB.picks.length) saveProfile(); renderOnboard(main);
}
function saveProfile() {
  const old = S.profile?.tracks || [];
  const ids = OB.single ? old.map(p => p.id) : OB.picks;
  S.profile = { tracks: ids.map(id => ({ id, level: OB.levels[id] || old.find(p => p.id === id)?.level || 'beginner', placed: OB.placed[id] ? { right: OB.placed[id].right, n: OB.placed[id].n } : old.find(p => p.id === id)?.placed || null })), at: dayKey() };
  S.openT = null; save();
}

function planCard(t) {
  const s = trackStates(t), lv = LEVELS[s.lvl], first = s.current?.l.title;
  const soon = s.rows.filter(r => r.st === 'soon').length;
  const p = S.profile.tracks.find(x => x.id === t.id);
  return `<div class="plan-card" style="--uc:var(${t.color})"><span class="t-emoji" aria-hidden="true">${t.emoji}</span><div style="min-width:0"><b>${t.title}</b>
    <div class="lvl-pill">${lv.emoji} ${lv.name}${p?.placed ? ` · placed by quiz (${p.placed.right}/${p.placed.n})` : ''}</div>
    <ul class="plan-facts"><li>${first ? `Starts with: <b>${esc(first)}</b>` : s.complete ? '<b>All done!</b>' : 'Lessons for this track are <b>coming soon</b>. They will use the same card template.'}</li><li>${s.rows.length} ${lv.name.toLowerCase()} lessons${soon ? ` (${soon} coming soon)` : ''}${t.check ? ` · checkpoint: <b>${esc(NODE[t.check].title)}</b>` : ''}</li><li>Readings: ${(READINGS[t.id] || []).map(r => esc(r.title)).join(' · ')}</li></ul></div></div>`;
}
function obPlan(main, ui) {
  ui.body.append(h(`<div class="ob-head"><span class="hero-bull sm">${BULL_LOGO}</span><div><h2 class="l-q" style="margin:0">Here's your plan</h2><p class="muted">Lessons are 5–10 minutes, one idea per screen.</p></div></div>`));
  ui.body.append(h(`<div class="stack" style="gap:12px">${S.profile.tracks.map(p => planCard(TRACK[p.id])).join('')}</div>`));
  const go = h(`<button class="btn go big" style="margin-left:auto">Start learning</button>`); go.onclick = () => { OB = null; location.hash = 'home'; };
  ui.fin.append(go); go.focus({ preventScroll: true });
}

/* ============================== SETTINGS ============================== */
function renderSettings(main) {
  document.body.classList.remove('focus'); statsBar(); CTX = { screen: 'plan settings' };
  const wrap = h(`<div class="stack settings" style="gap:16px;max-width:760px;margin:0 auto"></div>`);
  wrap.append(h(`<div><span class="eyebrow">Settings</span><h2 style="margin-top:4px">Your learning plan</h2></div>`));
  const list = h(`<div class="stack" style="gap:12px"></div>`);
  const draw = () => { list.innerHTML = '';
    S.profile.tracks.forEach(p => { const t = TRACK[p.id], s = trackStates(t);
      const row = h(`<div class="set-row" style="--uc:var(${t.color})"><div class="row" style="gap:12px;flex-wrap:nowrap;min-width:0"><span class="t-emoji" aria-hidden="true">${t.emoji}</span><div style="min-width:0"><b>${t.title}</b><div class="muted" style="font-size:14px">${s.doneN}/${s.totalN} done${s.complete ? ' · complete' : ''}</div></div></div>
        <div class="seg" role="radiogroup" aria-label="${t.title} level">${['beginner', 'intermediate', 'advanced'].map(k => `<button role="radio" aria-checked="${p.level === k}" data-k="${k}" class="${p.level === k ? 'on' : ''}">${LEVELS[k].emoji} ${LEVELS[k].name}</button>`).join('')}</div>
        <div class="row" style="gap:18px"><button class="linkbtn" data-a="quiz">Retake placement</button>${S.profile.tracks.length > 1 ? '<button class="linkbtn danger" data-a="rm">Remove</button>' : ''}</div></div>`);
      row.querySelectorAll('.seg button').forEach(b => b.onclick = () => { // update this row in place (a full redraw would collapse the page and jump the scroll)
        p.level = b.dataset.k; p.placed = null; save(); const ns = trackStates(t);
        row.querySelectorAll('.seg button').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
        row.querySelector('.muted').textContent = `${ns.doneN}/${ns.totalN} done${ns.complete ? ' · complete' : ''}`; drawAdd(); });
      row.querySelector('[data-a=quiz]').onclick = () => { OB = { picks: [p.id], levels: {}, placed: {}, step: 1, single: true }; location.hash = 'onboard'; };
      const rm = row.querySelector('[data-a=rm]'); if (rm) rm.onclick = () => confirmDialog({ title: `Remove ${t.title}?`, body: 'Your finished lessons stay saved. You can add it back later.', stay: 'Keep it', leave: 'Remove', onLeave: () => { S.profile.tracks = S.profile.tracks.filter(x => x !== p); S.openT = null; save(); draw(); drawAdd(); } });
      list.append(row); }); };
  wrap.append(list);
  const addBox = h(`<section class="stack" style="gap:10px"></section>`);
  const drawAdd = () => { addBox.innerHTML = '<h3>Add a track</h3>';
    const finished = S.profile.tracks.some(p => trackStates(TRACK[p.id]).complete);
    const left = TRACKS.filter(t => hasLessons(t) && !S.profile.tracks.some(p => p.id === t.id));
    if (!finished) { addBox.append(h(`<p class="muted">Finish one of your tracks to add another. Want different topics now? Use <b>Change focus</b> below to swap one.</p>`)); return; }
    const g = h(`<div class="topic-grid"></div>`);
    left.forEach(t => { const c = h(`<button class="topic"><span class="t-emoji" aria-hidden="true">${t.emoji}</span><span><b>${t.title}</b><span class="muted">${t.desc}</span></span></button>`);
      c.onclick = () => { S.profile.tracks.push({ id: t.id, level: 'beginner', placed: null }); save(); OB = { picks: [t.id], levels: {}, placed: {}, step: 1, single: true }; location.hash = 'onboard'; }; g.append(c); });
    addBox.append(g); };
  drawAdd(); draw(); wrap.append(addBox);
  // Progress by learning stage (every graded card is tagged with one of the six stages).
  const st = S.stages || {};
  wrap.append(h(`<section class="stack" style="gap:10px"><h3>Your skills by stage</h3><div class="stage-bars">${STAGES.map(([k, n, c]) => { const v = st[k] || { n: 0, c: 0 }, p = v.n ? Math.round(100 * v.c / v.n) : 0;
    return `<div class="sb" style="--sc:${c}"><span>${STAGE[k].n}. ${n}</span><span class="sbar"><span style="width:${p}%"></span></span><span class="mono">${v.n ? p + '%' : '–'}</span></div>`; }).join('')}</div><p class="muted" style="font-size:13px">Percent right on questions at each stage, across every lesson you've taken.</p></section>`));
  const again = h(`<div class="row" style="gap:10px"><button class="btn ghost">Change focus</button><a class="btn ghost" href="#home">Back to my path</a></div>`);
  again.querySelector('button').onclick = openFocusPicker;
  wrap.append(again); main.append(wrap);
  mentorTools(['Which level should I pick?', 'How are the levels different?']);
}

/* ============================== LIBRARY ============================== */
function renderLibrary(main) {
  document.body.classList.remove('focus'); statsBar(); CTX = { screen: 'library of readings' };
  const mine = (S.profile?.tracks || []).map(p => p.id);
  const order = [...TRACKS].sort((a, b) => (mine.includes(b.id) - mine.includes(a.id)));
  const wrap = h(`<div class="stack" style="gap:16px;max-width:860px;margin:0 auto"><div><span class="eyebrow">Library</span><h2 style="margin-top:4px">Free readings for every track</h2><p class="muted">Open textbooks and official guides behind our lessons. All free; links open in a new tab.</p></div></div>`);
  order.forEach(t => wrap.append(h(`<section class="lib-sec" style="--uc:var(${t.color})"><h3><span aria-hidden="true">${t.emoji}</span> ${t.title}${mine.includes(t.id) ? ' <span class="tag">In your plan</span>' : ''}</h3>${readingList(t.id)}</section>`)));
  wrap.append(h(`<section class="stack" style="gap:8px"><h3>All sources and licenses</h3><ul class="lib-all">${Object.values(BOOKS).map(b => `<li><a href="${b.url}" target="_blank" rel="noopener">${esc(b.title)}</a> <span class="muted">· ${esc(b.by)} · ${esc(b.kind)} · ${esc(b.lic)}</span></li>`).join('')}</ul></section>`));
  main.append(wrap);
}
