// Accounts: log in / sign up with Supabase Auth, and sync saved progress to the `progress` table.
// Uses Supabase's REST endpoints with fetch (no extra library). The publishable key is meant to be public;
// row-level security in the database means each player can only read and write their own progress.
const SUPABASE_URL = 'https://ewspjdguxitmnscyjvbk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cP4O2DrOaLr-1ZlXPt5Ufg_v0kjEwTh';
const AUTH_KEY = 'bullpen-auth';

const Auth = {
  session: null, syncT: null, status: 'idle',
  load() { try { this.session = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) { this.session = null; } },
  keep(s) { this.session = s; try { s ? localStorage.setItem(AUTH_KEY, JSON.stringify(s)) : localStorage.removeItem(AUTH_KEY); } catch (e) {} navAuth(); },
  user() { return this.session?.user || null; },
  name() { const u = this.user(); return u ? (u.user_metadata?.display_name || u.email.split('@')[0]) : ''; },

  async call(path, { method = 'GET', body, token, headers = {} } = {}) {
    let res;
    try {
      res = await fetch(SUPABASE_URL + path, { method, headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...headers }, body: body ? JSON.stringify(body) : undefined });
    } catch (e) { throw new Error("Can't reach the account server. Check your internet connection, or keep playing as a guest."); }
    const text = await res.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) {}
    if (!res.ok) throw new Error(friendlyAuthError(data, res.status));
    return data;
  },
  withExpiry(d) { return { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600), user: d.user }; },
  async token() {
    const s = this.session; if (!s) return null;
    if (s.expires_at - 60 > Date.now() / 1000) return s.access_token;
    try { const d = await this.call('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh_token } }); this.keep(this.withExpiry(d)); return this.session.access_token; }
    catch (e) { this.keep(null); return null; }
  },
  async signUp(email, password, name) {
    const redirect = /^https?:/.test(location.origin) ? `?redirect_to=${encodeURIComponent(location.origin + location.pathname)}` : '';
    const d = await this.call('/auth/v1/signup' + redirect, { method: 'POST', body: { email, password, data: { display_name: name } } });
    if (d && d.access_token) { this.keep(this.withExpiry(d)); await this.pull(); return 'in'; }
    return 'confirm'; // email confirmation is on: Supabase sent a link
  },
  async signIn(email, password) {
    const d = await this.call('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } });
    this.keep(this.withExpiry(d)); await this.pull(); return 'in';
  },
  async signOut() { const t = await this.token(); if (t) this.call('/auth/v1/logout', { method: 'POST', token: t }).catch(() => {}); this.keep(null); },
  async reset(email) { await this.call('/auth/v1/recover', { method: 'POST', body: { email } }); },

  // On sign-in: keep whichever copy of progress has more finished work, and save it to both places.
  async pull() {
    const t = await this.token(); if (!t) return;
    const rows = await this.call(`/rest/v1/progress?select=state,updated_at&user_id=eq.${this.user().id}`, { token: t });
    const remote = rows && rows[0] && rows[0].state;
    const score = st => Object.keys(st?.done || {}).length * 1000 + (st?.xp || 0);
    if (remote && score(remote) > score(S)) { S = Object.assign(structuredClone(DEFAULT), remote); saveLocal(); toast('Welcome back! Your saved progress is loaded.'); }
    else { await this.push(); if (remote) toast('Signed in. This device had newer progress, so it was saved to your account.'); }
  },
  async push() {
    const t = await this.token(); if (!t) return;
    this.status = 'saving'; syncBadge();
    try { await this.call('/rest/v1/progress?on_conflict=user_id', { method: 'POST', token: t, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: { user_id: this.user().id, state: S, updated_at: new Date().toISOString() } }); this.status = 'saved'; }
    catch (e) { this.status = 'offline'; }
    syncBadge();
  },
  queue() { if (!this.session) return; clearTimeout(this.syncT); this.syncT = setTimeout(() => this.push(), 1500); },
};

function friendlyAuthError(d, status) {
  const m = (d && (d.msg || d.error_description || d.message || d.error)) || '';
  if (/invalid login credentials/i.test(m)) return 'That email and password don’t match. Try again, or reset your password.';
  if (/email not confirmed/i.test(m)) return 'Please confirm your email first. Check your inbox for the link we sent.';
  if (/already registered|already exists/i.test(m)) return 'An account with that email already exists. Try logging in instead.';
  if (/password/i.test(m) && /least|short|weak/i.test(m)) return 'Pick a stronger password: at least 6 characters.';
  if (/valid email|invalid email|unable to validate email/i.test(m)) return 'That email address doesn’t look right.';
  if (status === 429 || /rate limit/i.test(m)) return 'Too many tries. Wait a minute and try again.';
  return m || 'Something went wrong. Please try again.';
}

// Wrap save(): every local save also queues a cloud save when signed in.
const saveLocal = save;
save = function () { saveLocal(); Auth.queue(); };

function navAuth() {
  const a = document.getElementById('nav-auth'); if (!a) return;
  if (Auth.user()) { a.textContent = Auth.name(); a.setAttribute('href', '#login'); a.setAttribute('aria-label', `Account: ${Auth.name()}`); a.classList.add('signed-in'); }
  else { a.textContent = 'Log in'; a.setAttribute('href', '#login'); a.removeAttribute('aria-label'); a.classList.remove('signed-in'); }
}
function syncBadge() { const el = document.getElementById('sync-state'); if (el) el.textContent = { saving: 'Saving…', saved: 'All progress saved to your account', offline: 'Couldn’t reach the server. Progress is saved on this device and will sync later.', idle: '' }[Auth.status]; }

/* ============================== LOGIN / SIGN UP PAGE ============================== */
function renderLogin(main, mode = 'login') {
  document.body.classList.remove('focus'); statsBar(); CTX = { screen: 'login' };
  if (Auth.user()) return renderAccount(main);
  const wrap = h(`<div class="auth-wrap"><div class="auth-card" role="region" aria-labelledby="auth-t">
    <span class="hero-bull" aria-hidden="true">${BULL_LOGO}</span>
    <h2 id="auth-t">${mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
    <p class="muted">${mode === 'signup' ? 'Save your streak, XP and lessons, and pick up on any device.' : 'Log in to pick up where you left off.'}</p>
    <div class="seg auth-tabs" role="tablist" aria-label="Log in or sign up">
      <button role="tab" aria-selected="${mode === 'login'}" class="${mode === 'login' ? 'on' : ''}" data-m="login">Log in</button>
      <button role="tab" aria-selected="${mode === 'signup'}" class="${mode === 'signup' ? 'on' : ''}" data-m="signup">Sign up</button></div>
    <form class="auth-form" novalidate>
      ${mode === 'signup' ? `<label class="fld"><span>First name or nickname</span><input name="name" autocomplete="nickname" maxlength="40" required></label>` : ''}
      <label class="fld"><span>Email</span><input name="email" type="email" autocomplete="email" inputmode="email" required></label>
      <label class="fld"><span>Password</span><span class="pw"><input name="password" type="password" autocomplete="${mode === 'signup' ? 'new-password' : 'current-password'}" minlength="6" required><button type="button" class="linkbtn" data-a="show" aria-label="Show password">Show</button></span>
        ${mode === 'signup' ? '<small class="muted">At least 6 characters.</small>' : ''}</label>
      <p class="auth-err" role="alert" aria-live="assertive"></p>
      <button class="btn big auth-go" type="submit">${mode === 'signup' ? 'Create account' : 'Log in'}</button>
      ${mode === 'login' ? '<button type="button" class="linkbtn" data-a="forgot">Forgot password?</button>' : ''}
    </form>
    <div class="auth-or"><span>or</span></div>
    <button class="btn ghost" data-a="guest">Continue as guest</button>
    <p class="muted auth-fine">Guests' progress stays on this device only. We only store your email, nickname and game progress.</p>
  </div></div>`);
  const form = wrap.querySelector('form'), err = wrap.querySelector('.auth-err'), goB = wrap.querySelector('.auth-go');
  wrap.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { main.innerHTML = ''; renderLogin(main, b.dataset.m); main.querySelector('input')?.focus(); });
  wrap.querySelector('[data-a=show]').onclick = e => { const i = form.password; const show = i.type === 'password'; i.type = show ? 'text' : 'password'; e.target.textContent = show ? 'Hide' : 'Show'; e.target.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); };
  wrap.querySelector('[data-a=guest]').onclick = () => { S.authSeen = true; saveLocal(); go('home'); };
  const forgot = wrap.querySelector('[data-a=forgot]');
  if (forgot) forgot.onclick = async () => { const email = form.email.value.trim(); if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Type your email above, then tap "Forgot password?" again.'; form.email.focus(); return; }
    try { await Auth.reset(email); err.className = 'auth-err ok'; err.textContent = `If there's an account for ${email}, a reset link is on its way.`; } catch (e) { err.className = 'auth-err'; err.textContent = e.message; } };
  form.onsubmit = async e => {
    e.preventDefault(); err.className = 'auth-err'; err.textContent = '';
    const email = form.email.value.trim(), pw = form.password.value, name = form.name ? form.name.value.trim() : '';
    if (form.name && !name) { err.textContent = 'Add a first name or nickname.'; form.name.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'That email address doesn’t look right.'; form.email.focus(); return; }
    if (pw.length < 6) { err.textContent = 'Passwords need at least 6 characters.'; form.password.focus(); return; }
    goB.disabled = true; goB.textContent = mode === 'signup' ? 'Creating account…' : 'Logging in…';
    try {
      const r = mode === 'signup' ? await Auth.signUp(email, pw, name) : await Auth.signIn(email, pw);
      S.authSeen = true; saveLocal();
      if (r === 'confirm') { main.innerHTML = ''; main.append(h(`<div class="auth-wrap"><div class="auth-card"><span class="t-emoji xl" aria-hidden="true">📬</span><h2>Check your email</h2><p class="muted">We sent a confirmation link to <b>${esc(email)}</b>. Click it, then come back and log in.</p><button class="btn big" data-a="li">Go to log in</button><button class="btn ghost" data-a="g">Keep playing as a guest</button></div></div>`));
        main.querySelector('[data-a=li]').onclick = () => { main.innerHTML = ''; renderLogin(main, 'login'); }; main.querySelector('[data-a=g]').onclick = () => go('home'); return; }
      toast(mode === 'signup' ? `Welcome to The Bullpen, ${Auth.name()}!` : `Welcome back, ${Auth.name()}!`); go('home');
    } catch (e2) { err.textContent = e2.message; goB.disabled = false; goB.textContent = mode === 'signup' ? 'Create account' : 'Log in'; }
  };
  main.append(wrap);
}
function renderAccount(main) {
  const u = Auth.user();
  const wrap = h(`<div class="auth-wrap"><div class="auth-card"><span class="hero-bull" aria-hidden="true">${BULL_LOGO}</span>
    <h2>Hi, ${esc(Auth.name())}</h2><p class="muted">Logged in as <b>${esc(u.email)}</b></p>
    <div class="acct-stats"><div><b>${S.xp}</b><span>XP</span></div><div><b>${Object.keys(S.done).length}</b><span>Lessons done</span></div><div><b>${streakNow()}</b><span>Day streak</span></div></div>
    <p class="muted" id="sync-state" role="status" aria-live="polite"></p>
    <button class="btn big" data-a="home">Back to my plan</button><button class="btn ghost" data-a="out">Log out</button></div></div>`);
  wrap.querySelector('[data-a=home]').onclick = () => go('home');
  wrap.querySelector('[data-a=out]').onclick = async () => { await Auth.push(); await Auth.signOut(); toast('Logged out. Your progress is saved to your account.'); go('login'); };
  main.append(wrap); syncBadge();
}

Auth.load();
