// Personalized path view, the card-lesson runner and the interactive card types (calc, slider, sort, plan, timed questions).

/* ============================== FEEDBACK (shared) ============================== */
function showFeedback(ui, ok, { title, correct, why, src }, done, extra) {
  ui.foot.className = 'l-foot ' + (ok ? 'good' : 'bad'); ui.fin.innerHTML = '';
  const left = h(`<div style="min-width:0" role="status" aria-live="polite"><div class="fb-title">${esc(title || (ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : 'Not quite'))}</div>${!ok && correct ? `<div class="fb-text"><b>Correct answer:</b> ${esc(correct)}</div>` : ''}${why ? `<div class="fb-text">${esc(why)}</div>` : ''}${src ? `<div class="fb-src">Source: ${esc(src)}</div>` : ''}</div>`);
  const go = h(`<button class="btn go big">Continue</button>`); go.onclick = () => done(ok);
  ui.fin.append(left); if (extra) ui.fin.append(extra); ui.fin.append(go); go.focus({ preventScroll: true });
}
function checkButton(ui, label = 'Check') { const b = h(`<button class="btn go big" style="margin-left:auto" disabled>${label}</button>`); ui.fin.append(b); return b; }
function choiceList(opts) {
  const order = opts.map((o, i) => [o, i, Math.random()]).sort((a, b) => a[2] - b[2]); let sel = null;
  const box = h(`<div class="choices"></div>`);
  order.forEach(([text, i], k) => { const c = h(`<button class="choice"><span class="k">${k + 1}</span><span>${esc(text)}</span></button>`); c.dataset.i = i;
    c.onclick = () => { box.querySelectorAll('.choice').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); sel = i; box.dispatchEvent(new Event('pick')); }; box.append(c); });
  box.value = () => sel;
  box.reveal = a => { box.querySelectorAll('.choice').forEach(x => { x.disabled = true; if (+x.dataset.i === a) x.classList.add('right'); else if (+x.dataset.i === sel) x.classList.add('wrong'); }); };
  return box;
}

/* ============================== CARD TYPES ============================== */
// ui = { body, foot, fin, footReset() }. done(ok) with ok = true/false, or null for cards that aren't graded.
function mountCard(ui, card, done, meta = '') {
  const head = () => `<div class="card-meta">${card.stage ? stageChip(card.stage, card.stageAuto) : ''}${meta ? `<span class="muted">${esc(meta)}</span>` : ''}${card.timer ? `<span class="timer" aria-live="off">${I.fire}<b>${card.timer}</b>s</span>` : ''}</div>`;
  if (['teach', 'mc', 'tf', 'fill', 'match'].includes(card.t)) {
    ui.noMeta = true; mountItem(ui, card, done); ui.noMeta = false; ui.body.prepend(h(head()));
    if (card.timer) startTimer(ui, card, done);
    return;
  }
  const b = ui.body; b.innerHTML = ''; ui.footReset(); b.append(h(head()), h(`<h2 class="l-q">${esc(card.q)}</h2>`));
  if (card.html) b.append(h(`<div class="card-html">${card.html}</div>`));
  CTX = { screen: 'lesson', lesson: CTX.lesson, question: card.q };
  ({ calc: mountCalc, slider: mountSlider, sort: mountSort, plan: mountPlan })[card.t](ui, card, done);
}
function startTimer(ui, card, done) {
  let left = card.timer; const el = ui.body.querySelector('.timer b'); const chk = ui.fin.querySelector('.btn.go');
  const iv = setInterval(() => { if (!document.contains(el)) return clearInterval(iv); left--; el.textContent = left; el.parentElement.classList.toggle('low', left <= 5);
    if (left <= 0) { clearInterval(iv); ui.body.querySelectorAll('.choice').forEach(x => { x.disabled = true; if (x.textContent.trim().endsWith(card.opts[card.a])) x.classList.add('right'); });
      showFeedback(ui, false, { title: "Time's up", correct: card.opts[card.a], why: card.why, src: card.src }, done); } }, 1000);
  chk?.addEventListener('click', () => clearInterval(iv));
}
function mountCalc(ui, c, done) {
  const f = h(`<label class="calc"><span class="sr">Your answer</span>${c.prefix ? `<span class="aff">${esc(c.prefix)}</span>` : ''}<input inputmode="decimal" autocomplete="off" placeholder="?">${c.suffix ? `<span class="aff">${esc(c.suffix)}</span>` : ''}</label>`);
  ui.body.append(f); const inp = f.querySelector('input'); const chk = checkButton(ui);
  inp.oninput = () => { chk.disabled = !inp.value.trim(); }; inp.onkeydown = e => { if (e.key === 'Enter' && !chk.disabled) chk.click(); };
  setTimeout(() => inp.focus({ preventScroll: true }), 30);
  chk.onclick = () => { const v = parseFloat(inp.value.replace(/[$,%\s]/g, '')); const ok = Math.abs(v - c.a) <= (c.tol || 0) + 1e-9; inp.disabled = true; f.classList.add(ok ? 'right' : 'wrong');
    showFeedback(ui, ok, { correct: `${c.prefix || ''}${c.a.toLocaleString()}${c.suffix ? ' ' + c.suffix : ''}`, why: c.why, src: c.src }, done); };
}
function mountSlider(ui, c, done) {
  const v = Object.fromEntries(c.sliders.map(s => [s.k, s.val]));
  const box = h(`<div class="sim-box"></div>`), out = h(`<div class="sim-out" aria-live="polite"></div>`);
  c.sliders.forEach(s => { const r = h(`<label class="sl"><span>${esc(s.label)}</span><b>${s.fmt(s.val)}</b><input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}"></label>`);
    r.querySelector('input').oninput = e => { v[s.k] = +e.target.value; r.querySelector('b').textContent = s.fmt(v[s.k]); out.innerHTML = c.out(v); }; box.append(r); });
  out.innerHTML = c.out(v); box.append(out); ui.body.append(box);
  if (!c.opts) { const go = h(`<button class="btn go big" style="margin-left:auto">Continue</button>`); go.onclick = () => done(null); ui.fin.append(go); return; }
  const list = choiceList(c.opts); ui.body.append(list); const chk = checkButton(ui); list.addEventListener('pick', () => chk.disabled = false);
  chk.onclick = () => { const ok = list.value() === c.a; list.reveal(c.a); showFeedback(ui, ok, { correct: c.opts[c.a], why: c.why, src: c.src }, done); };
}
function mountSort(ui, c, done) {
  ui.body.append(h(`<p class="muted hint">Tap an item, then tap where it goes. On a computer you can also drag.</p>`));
  const pool = h(`<div class="sort-pool" aria-label="Items to sort"></div>`), zones = h(`<div class="sort-zones" style="--n:${c.buckets.length}"></div>`); let held = null;
  const chk = checkButton(ui);
  const refresh = () => { chk.disabled = pool.children.length > 0; };
  const hold = chip => { pool.parentElement.querySelectorAll('.sort-chip').forEach(x => x.classList.remove('sel')); held = held === chip ? null : chip; if (held) held.classList.add('sel'); };
  const place = (chip, zone) => { (zone ? zone.querySelector('.zone-items') : pool).append(chip); chip.classList.remove('sel'); held = null; refresh(); };
  c.items.map((x, i) => [x, Math.random()]).sort((a, b) => a[1] - b[1]).forEach(([[text, bucket]], k) => {
    const chip = h(`<button class="sort-chip" draggable="true">${esc(text)}</button>`); chip.dataset.b = bucket; chip.id = 'sc' + k;
    chip.onclick = () => { if (chip.disabled) return; if (chip.parentElement === pool) return hold(chip); if (held) place(held, chip.closest('.zone')); else place(chip, null); };
    chip.ondragstart = e => { e.dataTransfer.setData('text/plain', chip.id); }; pool.append(chip); });
  c.buckets.forEach((name, bi) => { const z = h(`<div class="zone" role="button" tabindex="0" aria-label="Put the selected item in ${esc(name)}"><div class="zone-name">${esc(name)}</div><div class="zone-items"></div></div>`); z.dataset.b = bi;
    const drop = () => { if (held) place(held, z); };
    z.onclick = e => { if (e.target === z || e.target.classList.contains('zone-name') || e.target.classList.contains('zone-items')) drop(); };
    z.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(); } };
    z.ondragover = e => { e.preventDefault(); z.classList.add('over'); }; z.ondragleave = () => z.classList.remove('over');
    z.ondrop = e => { e.preventDefault(); z.classList.remove('over'); const chip = document.getElementById(e.dataTransfer.getData('text/plain')); if (chip) place(chip, z); };
    zones.append(z); });
  ui.body.append(pool, zones);
  chk.onclick = () => { let wrong = 0; zones.querySelectorAll('.zone').forEach(z => z.querySelectorAll('.sort-chip').forEach(ch => { const ok = ch.dataset.b === z.dataset.b; ch.classList.add(ok ? 'right' : 'wrong'); ch.disabled = true; if (!ok) wrong++; }));
    showFeedback(ui, wrong === 0, { title: wrong ? `${wrong} in the wrong place` : null, why: c.why, src: c.src }, done); };
}
function mountPlan(ui, c, done) {
  const v = c.cats.map(x => x[1]); const box = h(`<div class="sim-box"></div>`), rem = h(`<div class="remain" aria-live="polite"></div>`);
  const chk = checkButton(ui, 'Submit plan');
  const upd = () => { const left = c.total - v.reduce((a, b) => a + b, 0); rem.innerHTML = left === 0 ? `<b>Every dollar has a job.</b>` : left > 0 ? `<b>${money(toC(left))}</b> left to assign` : `<b>${money(toC(-left))}</b> over. Lower something.`; rem.className = 'remain ' + (left === 0 ? 'ok' : left < 0 ? 'over' : ''); chk.disabled = left !== 0; };
  const rows = c.cats.map(([name], i) => { const r = h(`<label class="sl"><span>${esc(name)}</span><b>${money(toC(v[i]))}</b><input type="range" min="0" max="${c.total}" step="${c.step}" value="${v[i]}"></label>`);
    r.querySelector('input').oninput = e => { v[i] = +e.target.value; r.querySelector('b').textContent = money(toC(v[i])); upd(); }; box.append(r); return r; });
  box.append(rem); ui.body.append(box); upd();
  chk.onclick = () => { const g = c.grade(v); rows.forEach(r => r.querySelector('input').disabled = true);
    const revise = g.ok ? null : h(`<button class="btn ghost">Revise</button>`);
    if (revise) revise.onclick = () => { ui.footReset(); ui.fin.append(chk); rows.forEach(r => r.querySelector('input').disabled = false); upd(); };
    showFeedback(ui, g.ok, { title: g.ok ? 'Plan saved!' : 'Almost there', why: g.msg }, done, revise); };
}

/* ============================== CARD LESSON RUNNER ============================== */
function renderTrackLesson(main, t, l) {
  const code = l.lvl || LEVEL_CODE[trackLevel(t.id)], lvl = CODE_LEVEL[code];
  const cards = LESSON_CARDS[cardSet(l)].filter(c => c.levels.includes(code));
  const sh = shell(main, { unit: t.unit, title: l.title }, { hearts: false }); CTX = { screen: 'lesson', lesson: l.title, level: lvl };
  let i = 0, graded = 0, right = 0; const seen = new Set();
  const next = () => {
    if (i >= cards.length) return finish();
    const c = cards[i]; seen.add(c.stage);
    mountCard(sh, c, ok => { if (ok !== null) { graded++; if (ok) right++; recordStage(c.stage, ok); } i++; sh.progress(i / cards.length); save(); next(); },
      `${LEVELS[lvl].emoji} ${LEVELS[lvl].name} · ${t.title}`);
  };
  const finish = () => {
    const acc = graded ? Math.round(100 * right / graded) : 100, xp = 10 + (acc === 100 ? 5 : 0);
    S.done[l.id] = true; S.best[l.id] = Math.max(S.best[l.id] || 0, acc); (S.tl = S.tl || {})[l.id] = { level: lvl, acc }; addXP(xp); save();
    celebrate(sh, { title: 'Lesson complete!', tiles: [['XP earned', xp, '#946000'], ['Accuracy', acc + '%', '#187A55'], ['Stages', `${seen.size} of 6`, '#2B5FB0']],
      msg: acc === 100 ? 'Every answer right. Nice work!' : `${right} of ${graded} right. The explanations are what make it stick.` });
  };
  next();
}

/* ============================== MY PATH ============================== */
function lessonHref(l) { return l.check || l.ref ? '#' + (l.check ? l.id : l.ref) : '#t:' + l.id; }
function renderMyPath(main) {
  document.body.classList.remove('focus'); statsBar();
  const picks = S.profile.tracks.map(p => TRACK[p.id]).filter(Boolean);
  const fid = focusTrack(); if (fid) picks.sort((a, b) => (b.id === fid) - (a.id === fid));
  const states = Object.fromEntries(picks.map(t => [t.id, trackStates(t)]));
  const curT = TRACK[focusTrack()] || picks.find(t => !states[t.id].complete) || picks[0];
  if (!Array.isArray(S.openT)) S.openT = [curT.id];
  setMentor(curT.mentor); CTX = { screen: 'my learning path', tracks: picks.map(t => `${t.title} (${trackLevel(t.id)})`).join(', ') };
  const wrap = h(`<div class="stack" style="gap:14px"></div>`);
  wrap.append(h(`<div class="course-head"><div class="row" style="gap:16px;flex-wrap:nowrap"><span class="hero-bull">${BULL_LOGO}</span><div><span class="eyebrow">Your plan</span><h2 style="margin-top:4px">One track at a time</h2></div></div><a class="btn ghost sm" href="#settings">Edit plan</a></div>`));
  wrap.append(focusBar(picks, curT));
  picks.forEach((t, ti) => {
    const s = states[t.id], lv = LEVELS[s.lvl]; const sec = h(`<section class="track-sec" style="--uc:var(${t.color})"></section>`);
    const isOpen = () => S.openT.includes(t.id);
    const head = h(`<button class="track-head ${isOpen() ? 'open' : ''}" aria-expanded="${isOpen()}" aria-controls="tp-${t.id}">
      <span class="t-emoji" aria-hidden="true">${t.emoji}</span>
      <span class="t-main"><span class="eyebrow">Track ${ti + 1} · ${lv.emoji} ${lv.name}${s.complete ? ' · Complete' : ''}</span><h2>${t.title}</h2>
      <span class="unit-bar" aria-hidden="true"><span style="width:${s.totalN ? Math.round(s.doneN / s.totalN * 100) : 0}%"></span></span></span>
      <span class="t-count"><b>${s.doneN}/${s.totalN}</b><span class="chev" aria-hidden="true">${isOpen() ? '▴' : '▾'}</span></span></button>`);
    // In-place toggle with the header pinned on screen, so nothing jumps.
    head.onclick = () => keepView(head, () => { const open = !isOpen(); S.openT = open ? [...S.openT, t.id] : S.openT.filter(x => x !== t.id); save();
      head.classList.toggle('open', open); head.setAttribute('aria-expanded', open); head.querySelector('.chev').textContent = open ? '▴' : '▾';
      if (open) sec.append(buildPath()); else sec.querySelector('.path')?.remove(); });
    const buildPath = () => {
      const path = h(`<div class="path" id="tp-${t.id}"></div>`); let k = 0;
      [...s.rows, ...(s.ck ? [s.ck] : [])].forEach(r => {
        const here = s.current === r && t === curT, ck = !!r.l.check;
        const icon = r.st === 'done' || r.st === 'tested' ? I.check : r.st === 'locked' ? I.lock : r.st === 'soon' ? I.book : ck ? I.chart : I.star;
        const tag = r.st === 'tested' ? '<span class="tag">Tested out</span>' : r.st === 'soon' ? '<span class="tag soon">Coming soon</span>' : '';
        const w = h(`<div class="node-wrap ${ck ? 'is-app' : ''}" style="--o:${ZIG[k++ % ZIG.length]};--uc:var(${t.color})">
          ${here ? `<span class="ring"></span><span class="start-bubble">${ck ? 'CHECKPOINT' : 'START'}</span>` : ''}
          <button class="node ${ck ? 'app' : ''} st-${r.st}" aria-label="${esc(r.l.title)} (${{ done: 'complete', tested: 'tested out', soon: 'coming soon', locked: 'locked', open: 'open' }[r.st]})">${icon}</button>
          <span class="node-label ${r.st === 'locked' || r.st === 'soon' ? 'locked' : ''}">${ck ? '<span class="eyebrow">Checkpoint challenge</span><br>' : ''}${esc(r.l.title)}${tag ? '<br>' + tag : ''}</span></div>`);
        w.querySelector('.node').onclick = () => {
          if (r.st === 'soon') return toast('This lesson is on the way. It will use the same card template as "What is money?".');
          if (r.st === 'locked') return toast('Finish the lesson before this one to unlock it.');
          location.hash = lessonHref(r.l).slice(1); };
        path.append(w); });
      path.append(h(readingList(t.id)));
      return path; };
    sec.append(head); if (isOpen()) sec.append(buildPath()); wrap.append(sec);
  });
  if (picks.some(t => states[t.id].complete) && picks.length < TRACKS.length) {
    const add = h(`<div class="callout row" style="justify-content:space-between"><span>You finished a track. Ready for another?</span><a class="btn sm" href="#settings">Add a track</a></div>`); wrap.append(add); }
  const lab = h(`<div class="lab-cta"><div><span class="eyebrow" style="color:var(--hl)">Practice anytime</span><h3 style="margin-top:4px;color:var(--tape-fg)">Scenario Lab: what happens when the Fed hikes rates, or before a midterm election?</h3></div><button class="btn">Open the lab</button></div>`);
  lab.querySelector('button').onclick = () => location.hash = 'lab'; wrap.append(lab);
  wrap.append(h(`<p class="muted" style="font-size:13px;text-align:center">Want everything? <a href="#course">Browse all 12 units</a> or open the <a href="#library">Library</a> of free readings.</p>`));
  main.append(wrap);
  if (!chat.length) say(`Hey, I'm ${MENTORS[curT.mentor].name.split(' ')[0]}. Your plan starts with ${curT.title}. One lesson at a time, and ask me anything.`);
  mentorTools(['What is compound interest?', 'How do credit scores work?', 'What is an index fund?']);
  requestAnimationFrame(() => { const r = main.querySelector('.ring'); if (r) r.closest('.node-wrap').scrollIntoView({ block: 'center', behavior: 'auto' }); });
}
