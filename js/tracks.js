// Personalized learning: levels, Bloom stages, the 13 tracks and the card template. Load after course-index.js.
//
// DATA SHAPE (reusable template)
//   TRACKS[]  → { id, group, emoji, title, desc, color, mentor, check, lessons[] }
//   lesson    → { id, title, ref?, skip?, cards? }
//      ref   : id of an existing 12-unit lesson to reuse (e.g. 'u1l3'); its items get stage tags automatically.
//      cards : true when LESSON_CARDS[id] holds a level-aware card lesson (see js/content/t-budget-money.js).
//      skip  : 'i' = tested out for Intermediate and Advanced, 'a' = tested out for Advanced only.
//      neither ref nor cards → not written yet; shown on the path as "Coming soon" and never blocks progress.
//   card      → { stage, levels, t, ... }   built with C(stage, 'BIA', {...})
//      stage : remember | understand | apply | analyze | evaluate | create (Bloom's taxonomy)
//      levels: which levels see the card: B = Beginner, I = Intermediate, A = Advanced
//      t     : teach | mc | tf | calc | slider | sort | plan   (+ timer: seconds on any question card)

const LEVELS = {
  beginner:     { emoji: '🌱', name: 'Beginner',     line: "I'm new to this.",                       does: 'Start from zero: vocab and core concepts.' },
  intermediate: { emoji: '📊', name: 'Intermediate', line: 'I know the basics and want to apply them.', does: 'Skip intro lessons and start with scenarios.' },
  advanced:     { emoji: '🚀', name: 'Advanced',     line: "I'm comfortable and want a challenge.",    does: 'Case problems, real data, decisions under pressure.' },
  unsure:       { emoji: '🎯', name: 'Not sure',     line: 'Test me.',                                 does: 'A quick 6-question placement quiz picks your level.' },
};
const LEVEL_CODE = { beginner: 'B', intermediate: 'I', advanced: 'A' };

const STAGES = [
  ['remember', 'Remember', '#2B7A5B'], ['understand', 'Understand', '#2B5FB0'], ['apply', 'Apply', '#7A4FB8'],
  ['analyze', 'Analyze', '#A4521C'], ['evaluate', 'Evaluate', '#B03A55'], ['create', 'Create', '#946000'],
];
const STAGE = Object.fromEntries(STAGES.map(([k, n, c], i) => [k, { n: i + 1, name: n, color: c }]));

const C = (stage, levels, card) => ({ stage, levels, ...card });
const L = (id, title, o = {}) => ({ id, title, ...o });
const LESSON_CARDS = {}; // filled by js/content/t-*.js

const TRACK_GROUPS = [
  { name: 'Everyday Money', mentor: 'intern' },
  { name: 'Investing', mentor: 'junior' },
  { name: 'Career-Track Finance', mentor: 'senior' },
];

const TRACKS = [
  { id: 'budget', group: 0, emoji: '💵', title: 'Budgeting & Saving', desc: 'paychecks, emergency funds, spending habits', check: 'a1', lessons: [
    L('bs-money', 'What is money?', { cards: true }), L('bs-paycheck', 'Reading a paycheck'),
    L('bs-budget', 'Budgeting 101', { ref: 'u1l3', skip: 'i' }), L('bs-habits', 'Spending habits', { ref: 'u1l2', skip: 'i' }),
    L('bs-efund', 'Emergency funds', { ref: 'u1l5', skip: 'a' }), L('bs-infl', 'Inflation', { ref: 'u1l4', skip: 'a' }),
    L('bs-save', 'Saving vs. investing', { ref: 'u1l6' }), L('bs-72', 'Compound interest & the Rule of 72', { ref: 'u2l2' }) ] },
  { id: 'credit', group: 0, emoji: '💳', title: 'Credit & Debt', desc: 'credit scores, cards, student loans, interest', lessons: [
    L('cd-what', 'What is credit?'), L('cd-score', 'Credit scores'), L('cd-cards', 'How credit cards work'), L('cd-apr', 'Interest & APR'),
    L('cd-min', 'Minimum payments trap'), L('cd-student', 'Student loans'), L('cd-payoff', 'Paying off debt (avalanche vs. snowball)') ] },
  { id: 'purchases', group: 0, emoji: '🏠', title: 'Big Life Purchases', desc: 'renting vs. buying, car loans, mortgages', lessons: [
    L('bp-rent', 'Renting vs. buying'), L('bp-apt', 'Your first apartment'), L('bp-car', 'Car loans & leasing'), L('bp-mort', 'How mortgages work'),
    L('bp-down', 'Down payments & closing costs'), L('bp-ins', 'Insurance basics') ] },
  { id: 'taxes', group: 0, emoji: '🧾', title: 'Taxes 101', desc: 'W-2s, brackets, refunds, Roth vs. traditional', check: 'a8', lessons: [
    L('tx-why', 'Why we pay taxes'), L('tx-w2', 'W-2s & W-4s'), L('tx-brk', 'Tax brackets'), L('tx-ref', 'Refunds vs. owing'),
    L('tx-file', 'Filing your first return'), L('tx-roth', 'Roth vs. traditional accounts', { ref: 'u8l2' }), L('tx-cg', 'Capital gains taxes', { ref: 'u8l5' }) ] },

  { id: 'stocks', group: 1, emoji: '📈', title: 'Stock Market Basics', desc: "what stocks are, indexes, ETFs, how to place a trade", check: 'a4', lessons: [
    L('sm-what', 'What is a stock?', { ref: 'u4l1', skip: 'i' }), L('sm-how', 'How the market works', { ref: 'u4l2', skip: 'i' }),
    L('sm-why', 'Why prices move', { ref: 'u4l3', skip: 'a' }), L('sm-idx', 'Indexes'), L('sm-etf', 'ETFs & index funds', { ref: 'u6l3', skip: 'a' }),
    L('sm-brk', 'Brokerage accounts', { ref: 'u8l1' }), L('sm-trade', 'How to place a trade'), L('sm-div', 'Dividends', { ref: 'u4l4' }),
    L('sm-time', 'Why timing the market fails', { ref: 'u9l4' }) ] },
  { id: 'equity', group: 1, emoji: '🔍', title: 'Equity Research', desc: 'reading financial statements, ratios, valuing a company', check: 'a12', lessons: [
    L('er-is', 'Income statement', { ref: 'u12l1', skip: 'i' }), L('er-bs', 'Balance sheet', { ref: 'u12l2', skip: 'i' }),
    L('er-cf', 'Cash flow statement', { ref: 'u12l3', skip: 'a' }), L('er-ratio', 'Key ratios (P/E, margins, ROE)', { ref: 'u12l4', skip: 'a' }),
    L('er-gv', 'Growth vs. value', { ref: 'u12l5' }), L('er-dcf', 'Intro to valuation & DCF', { ref: 'u12l6' }), L('er-pitch', 'Writing a stock pitch') ] },
  { id: 'portfolio', group: 1, emoji: '🧺', title: 'Portfolio Building', desc: 'diversification, asset allocation, risk vs. return', check: 'a7', lessons: [
    L('pb-rr', 'Risk vs. return', { ref: 'u3l2', skip: 'i' }), L('pb-tol', 'Risk tolerance & time horizon', { ref: 'u3l3', skip: 'i' }),
    L('pb-div', 'Diversification', { ref: 'u7l1', skip: 'a' }), L('pb-aa', 'Asset allocation', { ref: 'u7l2', skip: 'a' }),
    L('pb-dca', 'Dollar-cost averaging', { ref: 'u7l3' }), L('pb-reb', 'Rebalancing', { ref: 'u7l4' }), L('pb-fees', 'Fees & expense ratios', { ref: 'u6l4' }),
    L('pb-psy', 'Investor psychology (FOMO, panic selling, herd mentality)', { ref: 'u10l1' }) ] },
  { id: 'bonds', group: 1, emoji: '🏦', title: 'Bonds & Interest Rates', desc: 'yields, the Fed, how rates move markets', check: 'a5', lessons: [
    L('bd-what', 'What is a bond?', { ref: 'u5l1', skip: 'i' }), L('bd-yld', 'Yields'), L('bd-rate', 'Interest rates & bond prices', { ref: 'u5l2', skip: 'a' }),
    L('bd-gov', 'Government vs. corporate bonds', { ref: 'u5l3', skip: 'a' }), L('bd-cr', 'Credit ratings', { ref: 'u5l4' }), L('bd-fed', 'The Fed', { ref: 'u9l5' }),
    L('bd-mkt', 'How rates move markets') ] },
  { id: 'alts', group: 1, emoji: '🪙', title: 'Crypto & Alternatives', desc: "crypto, commodities, REITs, what's hype and what's real", check: 'a11', lessons: [
    L('al-crypto', 'Crypto basics & blockchain', { ref: 'u11l2', skip: 'i' }), L('al-risk', 'Crypto risks & volatility'),
    L('al-gold', 'Commodities & gold', { ref: 'u11l3', skip: 'a' }), L('al-reit', 'Real estate & REITs', { ref: 'u11l1', skip: 'a' }),
    L('al-hype', 'Hype vs. real value', { ref: 'u10l2' }), L('al-scam', 'Spotting scams & pump-and-dumps', { ref: 'u10l6' }) ] },

  { id: 'wealth', group: 2, emoji: '💼', title: 'Wealth Management', desc: 'financial planning, retirement, client advising', check: 'a3', lessons: [
    L('wm-what', 'What wealth managers do'), L('wm-plan', 'Financial planning', { ref: 'u7l5', skip: 'a' }), L('wm-ret', 'Retirement planning (401k, IRAs)', { ref: 'u8l4', skip: 'a' }),
    L('wm-risk', 'Risk profiling clients', { ref: 'u3l3' }), L('wm-cases', 'Client advising scenarios'), L('wm-estate', 'Estate & tax planning basics', { ref: 'u8l6' }) ] },
  { id: 'pevc', group: 2, emoji: '🏗️', title: 'Private Equity & VC', desc: 'LBOs, fundraising, deal structure, startups', lessons: [
    L('pe-what', 'What PE and VC firms do'), L('pe-fund', 'How funds raise money'), L('pe-stage', 'Startup funding stages'), L('pe-val', 'Valuing startups'),
    L('pe-lbo', 'Leveraged buyouts (LBOs)'), L('pe-deal', 'Deal structure'), L('pe-exit', 'Exits') ] },
  { id: 'ibma', group: 2, emoji: '🤝', title: 'Investment Banking & M&A', desc: 'IPOs, mergers, pitch books', lessons: [
    L('ib-what', 'What investment bankers do'), L('ib-ipo', 'IPOs'), L('ib-why', 'Why companies merge'), L('ib-proc', 'M&A process'),
    L('ib-val', 'Valuation methods (comps, precedents, DCF)', { ref: 'u12l6' }), L('ib-pitch', 'Pitch books') ] },
  { id: 'macro', group: 2, emoji: '🌎', title: 'Macro & Economics', desc: 'inflation, GDP, jobs reports, why markets react', check: 'a9', lessons: [
    L('mc-gdp', 'GDP', { ref: 'u9l6', skip: 'i' }), L('mc-cpi', 'Inflation & CPI', { ref: 'u1l4', skip: 'i' }), L('mc-jobs', 'Jobs reports'),
    L('mc-fed', 'The Fed & monetary policy', { ref: 'u9l5', skip: 'a' }), L('mc-cycle', 'Economic cycles'), L('mc-bull', 'Bull vs. bear markets', { ref: 'u9l1' }),
    L('mc-news', 'Why markets react to news', { ref: 'u4l3' }) ] },
];
TRACKS.forEach((t, i) => { t.mentor = TRACK_GROUPS[t.group].mentor; t.color = ['--u1', '--u2', '--u3', '--u4'][i % 4]; t.unit = { mentor: t.mentor, color: t.color }; });
const TRACK = Object.fromEntries(TRACKS.map(t => [t.id, t]));

// Stage tags for the 62 original lessons, assigned by rule (marked stageAuto so teammates can review and override).
function autoStage(it, i, items) {
  if (it.t === 'teach') return items.slice(0, i).some(x => x.t === 'teach') ? 'understand' : 'remember';
  if (it.t === 'tf' || it.t === 'fill') return /\$|\d/.test(it.q) ? 'apply' : 'remember';
  if (it.t === 'match') return 'understand';
  const q = it.q || '';
  if (/\bshould\b|best (move|plan|choice|response)|what do you|recommend|fits better/i.test(q)) return 'evaluate';
  if (/which .*(more|better|safer|riskier|usually)|compare| vs\.? /i.test(q)) return 'analyze';
  if (/\$|\d|%|[A-Z][a-z]+ (has|is|buys|wants|puts|sees|earns|saves)/.test(q)) return 'apply';
  return 'understand';
}
UNITS.forEach(u => u.lessons.forEach(l => l.items.forEach((it, i, a) => { if (!it.stage) { it.stage = autoStage(it, i, a); it.stageAuto = true; } })));

// ---- progress helpers ----
const built = l => !!(l.ref ? NODE[l.ref] : l.cards && LESSON_CARDS[l.id]);
const doneKey = l => l.ref || l.id;
const testedOut = (l, lvl) => !!l.skip && (lvl === 'advanced' || (l.skip === 'i' && lvl === 'intermediate'));
function trackLevel(id) { return (S.profile?.tracks.find(t => t.id === id) || {}).level || 'beginner'; }
// Each lesson's state on a track: done | tested | soon | open | locked. Checkpoint is the last row.
function trackStates(t) {
  const lvl = trackLevel(t.id); let clear = true;
  const rows = t.lessons.map(l => {
    let st;
    if (!built(l)) st = 'soon';
    else if (S.done[doneKey(l)]) st = 'done';
    else if (testedOut(l, lvl)) st = 'tested';
    else st = clear || REVIEW_UNLOCK ? 'open' : 'locked';
    if (st === 'open' || st === 'locked') clear = false;
    return { l, st };
  });
  const ck = t.check && NODE[t.check] ? { l: { id: t.check, title: NODE[t.check].title, check: true }, st: S.done[t.check] ? 'done' : clear || REVIEW_UNLOCK ? 'open' : 'locked' } : null;
  const current = rows.find(r => r.st === 'open') || (ck && ck.st === 'open' ? ck : null);
  const complete = rows.some(r => r.st !== 'soon') && rows.every(r => r.st !== 'open' && r.st !== 'locked') && (!ck || ck.st === 'done');
  const counted = rows.filter(r => r.st !== 'soon');
  return { rows, ck, current, complete, lvl, doneN: counted.filter(r => r.st === 'done' || r.st === 'tested').length + (ck && ck.st === 'done' ? 1 : 0), totalN: counted.length + (ck ? 1 : 0) };
}
// Lets a reused 12-unit lesson or desk open from the personalized path even when the 12-unit order would lock it.
function pathAllows(id) {
  return (S.profile?.tracks || []).some(p => { const t = TRACK[p.id]; if (!t) return false; const s = trackStates(t);
    return s.rows.some(r => r.l.ref === id && r.st !== 'locked' && r.st !== 'soon') || (s.ck && s.ck.l.id === id && s.ck.st !== 'locked'); });
}
function recordStage(stage, ok) { if (!stage || ok === null || ok === undefined) return; S.stages = S.stages || {}; const s = S.stages[stage] || (S.stages[stage] = { n: 0, c: 0 }); s.n++; if (ok) s.c++; }
function stageChip(stage, auto) { const s = STAGE[stage]; if (!s) return ''; return `<span class="stage-chip" style="--sc:${s.color}" title="${auto ? 'Stage assigned automatically' : 'Learning stage'}">Stage ${s.n} · ${s.name}</span>`; }

// ---- Readings: free, openly licensed or public-domain sources for each track (links open in a new tab) ----
const BOOKS = {
  pof:   { title: 'Principles of Finance 2e', by: 'OpenStax', url: 'https://openstax.org/details/books/principles-finance-2e', kind: 'Free textbook (PDF)', lic: 'CC BY-NC-SA 4.0' },
  pf:    { title: 'Personal Finance', by: 'Rachel Siegel & Carol Yacht', url: 'https://open.umn.edu/opentextbooks/textbooks/31', kind: 'Free textbook', lic: 'CC BY-NC-SA' },
  acct:  { title: 'Principles of Accounting, Vol. 1: Financial Accounting', by: 'OpenStax', url: 'https://openstax.org/details/books/principles-financial-accounting', kind: 'Free textbook (PDF)', lic: 'CC BY-NC-SA 4.0' },
  ent:   { title: 'Entrepreneurship', by: 'OpenStax', url: 'https://openstax.org/details/books/entrepreneurship', kind: 'Free textbook (PDF)', lic: 'CC BY 4.0' },
  macro: { title: 'Principles of Macroeconomics 3e', by: 'OpenStax', url: 'https://openstax.org/details/books/principles-macroeconomics-3e', kind: 'Free textbook (PDF)', lic: 'CC BY 4.0' },
  ymyg:  { title: 'Your Money, Your Goals toolkit', by: 'Consumer Financial Protection Bureau', url: 'https://files.consumerfinance.gov/f/documents/cfpb_ymyg_a-financial-empowerment-toolkit_large-print.pdf', kind: 'PDF', lic: 'U.S. government work' },
  fdic:  { title: 'Money Smart for Young Adults', by: 'FDIC', url: 'https://www.fdic.gov/resources/consumers/money-smart/teach-money-smart/money-smart-for-young-adults.html', kind: 'Lessons + PDFs', lic: 'U.S. government work' },
  home:  { title: 'Your Home Loan Toolkit', by: 'Consumer Financial Protection Bureau', url: 'https://pueblo.gpo.gov/CFPBPubs/pdfs/CFPBWEB187.pdf', kind: 'PDF (2015)', lic: 'U.S. government work' },
  p17:   { title: 'Publication 17: Your Federal Income Tax (2025 returns)', by: 'IRS', url: 'https://www.irs.gov/pub/irs-pdf/p17.pdf', kind: 'PDF', lic: 'U.S. government work' },
  road:  { title: 'A Roadmap to Your Financial Security Through Saving and Investing', by: 'U.S. SEC', url: 'https://www.sec.gov/investor/pubs/sec-guide-to-savings-and-investing.pdf', kind: 'PDF (2011)', lic: 'U.S. government work' },
  fedpf: { title: 'The Fed: Purposes & Functions', by: 'Federal Reserve Board', url: 'https://www.federalreserve.gov/pf/pf.htm', kind: 'Web book', lic: 'U.S. government work' },
  fedex: { title: 'The Fed Explained', by: 'Federal Reserve Bank of Atlanta', url: 'https://www.atlantafed.org/about/fed-explained', kind: 'Web', lic: 'Public education resource' },
  seccr: { title: 'Exercise Caution with Crypto Asset Securities', by: 'U.S. SEC investor alert', url: 'https://sec.gov/oiea/investor-alerts-and-bulletins/exercise-caution-crypto-asset-securities-investor-alert', kind: 'Web', lic: 'U.S. government work' },
  cftc:  { title: 'Digital Assets', by: 'CFTC', url: 'https://cftc.gov/bitcoin', kind: 'Web', lic: 'U.S. government work' },
};
const R = (b, part) => ({ ...BOOKS[b], key: b, part });
const READINGS = {
  budget:    [R('pf', 'Ch. 1–5: planning, budgets, time value'), R('ymyg', 'Goals, cash flow, saving'), R('fdic', 'Young-adult money basics')],
  credit:    [R('pf', 'Ch. 7: financial management and credit'), R('ymyg', 'Credit reports, scores and debt')],
  purchases: [R('pf', 'Ch. 8–10: consumer strategies, buying a home, insurance'), R('home', 'Mortgages, down payments, closing')],
  taxes:     [R('p17', 'Filing, income, deductions, credits, IRAs'), R('pf', 'Ch. 6: taxes and tax planning')],
  stocks:    [R('road', 'Stocks, funds, brokers, fees'), R('pof', 'Stock markets and stock valuation'), R('pf', 'Ch. 15: owning stocks')],
  equity:    [R('pof', 'Financial statements, ratios, valuation'), R('acct', 'Reading the three statements')],
  portfolio: [R('road', 'Diversification, allocation, fees'), R('pf', 'Ch. 12–14: investing and behavioral finance'), R('pof', 'Risk and return')],
  bonds:     [R('pof', 'Bonds and bond valuation'), R('pf', 'Ch. 16: owning bonds'), R('fedpf', 'Monetary policy and interest rates')],
  alts:      [R('pf', 'Ch. 17: commodities, real estate, collectibles'), R('seccr', 'Crypto risks'), R('cftc', 'Digital asset advisories')],
  wealth:    [R('pf', 'Ch. 1 and 11: planning, retirement, estates'), R('p17', 'IRA rules')],
  pevc:      [R('ent', 'Funding a startup: angels, VC, stages'), R('pof', 'Valuation basics')],
  ibma:      [R('pof', 'Valuation methods'), R('ent', 'Raising capital')],
  macro:     [R('macro', 'GDP, inflation, unemployment, cycles'), R('fedpf', 'How the Fed works'), R('fedex', 'The Fed in plain English')],
};
function readingList(trackId) {
  return `<div class="readings"><h4>📚 Read more</h4><ul>${(READINGS[trackId] || []).map(r => `<li><a href="${r.url}" target="_blank" rel="noopener">${esc(r.title)}</a> <span class="muted">· ${esc(r.by)} · ${esc(r.part)}</span></li>`).join('')}</ul></div>`;
}
