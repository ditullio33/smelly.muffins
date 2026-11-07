// "Change focus": a focus bar on My plan (tap a track to focus on it) and a picker to swap topics and levels in one place.
// Progress is stored per lesson, so swapping a track out and back in keeps everything you finished.

function focusTrack() { const ids = S.profile.tracks.map(p => p.id); return ids.includes(S.focus) ? S.focus : null; }

function focusBar(picks, curT) {
  const bar = h(`<div class="focus-bar" role="group" aria-label="Focus"><span class="eyebrow">Focus on</span><div class="focus-pills"></div></div>`);
  const box = bar.querySelector('.focus-pills');
  picks.forEach(t => { const on = t === curT;
    const b = h(`<button class="f-pill ${on ? 'on' : ''}" style="--uc:var(${t.color})" aria-pressed="${on}"><span aria-hidden="true">${t.emoji}</span>${esc(t.title)}<span class="lv" aria-hidden="true">${LEVELS[trackLevel(t.id)].emoji}</span></button>`);
    b.onclick = () => { if (on) return; S.focus = t.id; S.openT = [t.id]; save(); render(); window.scrollTo({ top: 0 }); toast(`Focusing on ${t.title}.`); };
    box.append(b); });
  const ch = h(`<button class="f-pill add" aria-haspopup="dialog">✎ Change focus</button>`); ch.onclick = openFocusPicker; box.append(ch);
  return bar;
}

function openFocusPicker() {
  const prev = document.activeElement;
  const draft = S.profile.tracks.map(p => ({ id: p.id, level: p.level, placed: p.placed }));
  const sc = h(`<div class="dlg-scrim"><div class="dlg focus-dlg" role="dialog" aria-modal="true" aria-labelledby="fp-t">
    <div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div><h3 id="fp-t">What do you want to focus on?</h3><p class="muted" style="margin:4px 0 0">Pick up to 3 topics and a level for each. Your finished lessons stay saved.</p></div><button class="x" data-a="x" aria-label="Close">${I.x}</button></div>
    <div class="fp-body"></div>
    <div class="fp-foot"><p class="pick-msg" role="status" aria-live="polite"></p><div class="row" style="gap:10px"><button class="btn ghost" data-a="x">Cancel</button><button class="btn" data-a="save">Save focus</button></div></div></div></div>`);
  const body = sc.querySelector('.fp-body'), msg = sc.querySelector('.pick-msg'), saveB = sc.querySelector('[data-a=save]');
  const draw = () => {
    body.innerHTML = '';
    // chosen topics first, each with its level
    const mine = h(`<section><h4>Your focus (${draft.length}/3)</h4><div class="stack" style="gap:8px"></div></section>`);
    draft.forEach((p, i) => { const t = TRACK[p.id];
      const r = h(`<div class="fp-row" style="--uc:var(${t.color})"><span class="t-emoji" aria-hidden="true">${t.emoji}</span><b>${t.title}</b>
        <div class="seg" role="radiogroup" aria-label="${t.title} level">${['beginner', 'intermediate', 'advanced', 'unsure'].map(k => `<button role="radio" aria-checked="${p.level === k}" data-k="${k}" class="${p.level === k ? 'on' : ''}" title="${esc(LEVELS[k].does)}">${LEVELS[k].emoji} ${LEVELS[k].name}</button>`).join('')}</div>
        <div class="row" style="gap:4px">${i ? `<button class="linkbtn" data-a="up" aria-label="Move ${t.title} up">↑ Move up</button>` : '<span class="muted" style="font-size:13px">First up</span>'}<button class="linkbtn danger" data-a="rm" ${draft.length < 2 ? 'disabled' : ''}>Remove</button></div></div>`);
      r.querySelectorAll('.seg button').forEach(b => b.onclick = () => { p.level = b.dataset.k; p.placed = null; r.querySelectorAll('.seg button').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); }); sync(); });
      r.querySelector('[data-a=up]')?.addEventListener('click', () => { draft.splice(i - 1, 0, draft.splice(i, 1)[0]); draw(); });
      r.querySelector('[data-a=rm]').onclick = () => { draft.splice(i, 1); draw(); };
      mine.querySelector('.stack').append(r); });
    body.append(mine);
    TRACK_GROUPS.forEach((g, gi) => {
      const sec = h(`<section class="topic-group"><h3>${g.name}</h3><div class="topic-grid"></div></section>`);
      TRACKS.filter(t => t.group === gi).forEach(t => { const on = draft.some(p => p.id === t.id);
        const c = h(`<button class="topic ${on ? "on" : ""}" style="--uc:var(${t.color})" role="checkbox" aria-checked="${on}" ${(!on && draft.length >= MAX_PICKS) || (!on && !hasLessons(t)) ? 'disabled' : ''}><span class="t-emoji" aria-hidden="true">${t.emoji}</span><span><b>${t.title}</b><span class="muted">${t.desc}</span>${hasLessons(t) ? '' : '<span class="tag soon">Coming soon</span>'}</span><span class="t-tick" aria-hidden="true">${I.check}</span></button>`);
        c.onclick = () => { const i = draft.findIndex(p => p.id === t.id);
          if (i >= 0) { if (draft.length > 1) draft.splice(i, 1); }
          else if (draft.length < MAX_PICKS && hasLessons(t)) { const old = S.profile.tracks.find(p => p.id === t.id); draft.push(old ? { ...old } : { id: t.id, level: 'beginner', placed: null }); }
          const y = body.scrollTop; draw(); body.scrollTop = y; };
        sec.querySelector('.topic-grid').append(c); });
      body.append(sec); });
    sync();
  };
  const sync = () => { const unsure = draft.filter(p => p.level === 'unsure').length;
    msg.textContent = draft.length >= MAX_PICKS ? "That's 3. Tap one to swap it out." : `${draft.length} of 3 picked`;
    saveB.textContent = unsure ? `Save and take ${unsure > 1 ? unsure + ' quizzes' : 'the quiz'}` : 'Save focus'; };
  const close = () => { sc.remove(); document.removeEventListener('keydown', key, true); prev?.focus?.({ preventScroll: true }); };
  const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  sc.querySelectorAll('[data-a=x]').forEach(b => b.onclick = close);
  sc.onclick = e => { if (e.target === sc) close(); };
  saveB.onclick = () => {
    const unsure = draft.filter(p => p.level === 'unsure').map(p => p.id);
    S.profile.tracks = draft.map(p => ({ id: p.id, level: p.level === 'unsure' ? (S.profile.tracks.find(x => x.id === p.id)?.level || 'beginner') : p.level, placed: p.placed || null }));
    S.focus = draft[0].id; S.openT = [draft[0].id]; save(); close();
    if (unsure.length) { OB = { picks: unsure, levels: {}, placed: {}, step: 1, single: true, returnTo: 'home' }; go('onboard'); }
    else { go('home'); toast(`Focus saved. Up first: ${TRACK[draft[0].id].title}.`); }
  };
  document.addEventListener('keydown', key, true);
  document.body.append(sc); draw(); sc.querySelector('[data-a=x]').focus();
}
