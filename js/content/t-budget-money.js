// Budgeting & Saving, Lesson 1: "What is money?" built at three levels. This is the template for every card lesson.
// Each card: C(stage, levels, {...}). Levels: B = Beginner, I = Intermediate, A = Advanced.
// Beginner: all six stages with extra Remember/Understand cards. Intermediate: short recap, then mostly Apply/Analyze.
// Advanced: Analyze/Evaluate/Create with a real-data case and a timed decision.
// Real data: CPI-U (BLS, via FRED series CUUS0000SA0, first-half averages) and 1-month T-bill returns (Ken French Data Library).

const CPI_SRC = 'BLS CPI-U, U.S. city average (FRED series CUUS0000SA0, first-half averages: 2021 = 266.2, 2026 = 330.7)';
const inflSlider = (ask) => ({
  t: 'slider', sliders: [{ k: 'r', label: 'Inflation per year', min: 0, max: 10, step: 0.5, val: 3, fmt: v => v + '%' }, { k: 'y', label: 'Years', min: 1, max: 30, step: 1, val: 10, fmt: v => v + ' yrs' }],
  out: v => { const real = 100 / Math.pow(1 + v.r / 100, v.y); return `<div class="big-out"><span class="muted">$100 in a drawer buys what</span><b>${money(toC(real))}</b><span class="muted">buys today</span></div><div class="meter" aria-hidden="true"><span style="width:${real}%"></span></div>`; },
  ...ask,
});

LESSON_CARDS['bs-money'] = [
  // ---------- 1 · REMEMBER ----------
  C('remember', 'B', { t: 'mc', q: 'Before money existed, how did people get the things they needed?',
    opts: ['They traded goods directly (bartering)', 'They used credit cards', 'Everything was free'], a: 0,
    why: 'Bartering only works if the other person wants exactly what you have. Money fixes that.', src: SRC.OS(3) }),
  C('remember', 'B', { t: 'teach', title: 'Money has three jobs',
    body: `<p>Money is anything people widely accept as payment. It's a <b>medium of exchange</b> (you trade it for things), a <b>store of value</b> (you can save it) and a <b>unit of account</b> (it measures what things cost).</p>`, src: SRC.OS(3) }),
  C('remember', 'B', { t: 'match', q: 'Match each job to an example',
    pairs: [['Medium of exchange', 'Paying for lunch'], ['Store of value', 'Saving for a car next year'], ['Unit of account', 'Seeing a phone costs $300']], src: SRC.OS(3) }),
  C('remember', 'B', { t: 'tf', q: 'A good store of value means $50 saved today still buys about the same amount next month.', a: true,
    why: "That's the point of saving: the money keeps its buying power until you need it." }),
  C('remember', 'I', { t: 'teach', title: 'Quick recap',
    body: `<p>Money does three jobs: <b>medium of exchange</b>, <b>store of value</b> and <b>unit of account</b>. Bartering fails because you need someone who wants exactly what you have.</p>`, src: SRC.OS(3) }),

  // ---------- 2 · UNDERSTAND ----------
  C('understand', 'B', { t: 'teach', title: 'Think of money as a universal ticket',
    body: `<p>A farmer with eggs who wants shoes has to find a shoemaker who wants eggs. Money is a ticket every seller accepts, so the farmer can sell eggs to anyone and buy shoes from anyone.</p>` }),
  C('understand', 'B', { t: 'mc', q: 'Which example shows money as a unit of account?',
    opts: ['Comparing a $4 coffee with a $12 burrito', 'Keeping $20 in a jar for next month', 'Handing a cashier $10'], a: 0,
    why: 'A unit of account lets you measure and compare prices. The jar is a store of value, and paying is a medium of exchange.' }),
  C('understand', 'B', { t: 'mc', q: 'Why is money easier than bartering?',
    opts: ["Almost everyone accepts it, so you don't need someone who wants exactly what you have", 'It is worth more every year', 'It can only be spent at banks'], a: 0,
    why: 'Wide acceptance is what makes trade fast. (Money often loses value over time, which comes up next.)' }),
  C('understand', 'I', { t: 'mc', q: 'Prices are rising fast. Which job is money doing worst?',
    opts: ['Store of value', 'Unit of account', 'Medium of exchange'], a: 0,
    why: 'When prices jump, the same dollars buy less later, so money stores value poorly.' }),

  // ---------- 3 · APPLY ----------
  C('apply', 'B', { t: 'calc', q: 'You earn $15 an hour. Concert tickets cost $90. How many hours of work is that?', a: 6, tol: 0, suffix: 'hours',
    why: '$90 ÷ $15 = 6 hours. Pricing things in hours of work is a handy way to judge if they are worth it.' }),
  C('apply', 'I', { t: 'calc', q: 'Your paycheck is $600 after taxes for 40 hours of work. How many hours of work is a $180 jacket?', a: 12, tol: 0, suffix: 'hours',
    why: '$600 ÷ 40 = $15 an hour take-home. $180 ÷ $15 = 12 hours.' }),
  C('apply', 'B', { q: 'At 3% inflation for 10 years, about how much is $100 of cash worth in today\'s dollars?', ...inflSlider({
    opts: ['About $74', 'About $130', 'Still $100'], a: 0, why: '$100 ÷ 1.03¹⁰ ≈ $74. Cash in a drawer slowly loses buying power.', src: SRC.BLS }) }),
  C('apply', 'I', { q: 'Inflation averages 4% for 15 years. $1,000 of cash is worth about…', ...inflSlider({
    opts: ['About $555', 'About $800', 'About $1,800'], a: 0, why: '$1,000 ÷ 1.04¹⁵ ≈ $555. Try it on the sliders: 4% and 15 years.', src: SRC.BLS }) }),
  C('apply', 'I', { t: 'calc', q: 'A savings account pays 4% a year and inflation is 3%. About what is your real (after-inflation) return?', a: 1, tol: 0.1, suffix: '%',
    why: 'Real return ≈ interest rate − inflation = 4% − 3% = 1%.' }),

  // ---------- 4 · ANALYZE ----------
  C('analyze', 'B', { t: 'sort', q: 'Would each one make good money or bad money?', buckets: ['Good money', 'Bad money'],
    items: [['Metal coins that last for years', 0], ['Ice cream', 1], ['Paper dollars everyone accepts', 0], ['Live cows', 1], ['Seashells nobody near you values', 1]],
    why: "Good money lasts, is easy to carry and split, and is widely accepted. Ice cream melts, cows can't be split, and shells only work if people value them." }),
  C('analyze', 'I', { t: 'sort', q: 'Which job is money doing in each case?', buckets: ['Exchange', 'Store of value', 'Unit of account'],
    items: [['Tapping your card for groceries', 0], ['Leaving birthday money in savings', 1], ['Comparing two phones by price', 2], ['Paying a friend back on Venmo', 0], ['A menu listing prices', 2], ['An emergency fund', 1]],
    why: 'Spending = exchange. Saving = store of value. Prices and comparisons = unit of account.' }),
  C('analyze', 'I', { t: 'mc', q: 'Alex keeps $2,000 in checking at 0.01%. Sam keeps $2,000 in high-yield savings at 4%. Inflation is 3%. After 5 years, in today\'s dollars…',
    opts: ["Sam has about $2,100 of buying power; Alex about $1,725", 'Alex has more, because checking is safer', 'They have the same buying power'], a: 0,
    why: 'Sam: 2,000 × 1.04⁵ ÷ 1.03⁵ ≈ $2,099. Alex: 2,000 ÷ 1.03⁵ ≈ $1,725. Both accounts are FDIC-insured up to the limit; only one beats inflation.', src: SRC.FDIC }),
  C('analyze', 'A', { t: 'teach', title: 'Case: five years of real inflation',
    body: `<table class="mini-t"><tr><th></th><th>Early 2021</th><th>Early 2026</th></tr><tr><td>CPI (prices)</td><td>266.2</td><td>330.7</td></tr></table><p>Prices rose about <b>24%</b>. In June 2022, 12-month inflation hit <b>9.1%</b>, the highest in about 40 years.</p>`, src: CPI_SRC }),
  C('analyze', 'A', { t: 'calc', q: 'Using the case: $1,000 of cash held from early 2021 to early 2026 buys about how many early-2021 dollars of stuff? (1,000 ÷ 1.242)', a: 805, tol: 10, prefix: '$',
    why: '$1,000 ÷ (330.7 ÷ 266.2) ≈ $805. Cash quietly lost about a fifth of its buying power.', src: CPI_SRC }),
  C('analyze', 'A', { t: 'mc', q: 'Over 2021–2025, 1-month T-bills returned about 17% in total, while prices rose about 24%. What happened to money kept in T-bills?',
    opts: ['It grew in dollars but still lost some buying power', 'It beat inflation easily', 'It lost dollars'], a: 0,
    why: '$1,000 → about $1,168, which buys about $940 of early-2021 goods. Better than cash ($805), still behind inflation. (Calendar-year T-bill returns vs. first-half CPI, so the match is approximate.)', src: SRC.FF + '; ' + CPI_SRC }),
  C('analyze', 'A', { t: 'mc', q: 'In a hyperinflation, prices can double in weeks. Which job of money usually breaks first?',
    opts: ['Store of value: nobody wants to hold it', 'Unit of account: prices stop being listed', 'Medium of exchange: nobody accepts it'], a: 0,
    why: 'People spend it as fast as they can. Next, shops start quoting prices in a steadier currency, and finally people stop accepting it at all.', src: SRC.OS(3) }),

  // ---------- 5 · EVALUATE ----------
  C('evaluate', 'B', { t: 'mc', q: "Grandma gives you $500 and you won't need it for a year. What's the best plan?",
    opts: ['Put most of it in an FDIC-insured savings account', 'Keep it all in cash under your bed', 'Spend it all on gift cards right away'], a: 0,
    why: 'Savings is protected and earns interest. Cash at home can be lost and slowly loses value. Gift cards can go unused.', src: SRC.FDIC }),
  C('evaluate', 'I', { t: 'mc', q: "You're saving $3,000 for a car you'll buy in 8 months. Where should it sit?",
    opts: ['A high-yield savings account', 'A single hot stock', 'Cash in your room'], a: 0,
    why: 'Short timeline, so protect it. Stocks can drop 20% in months; cash at home earns nothing and can be lost.' }),
  C('evaluate', 'A', { t: 'mc', timer: 20, q: 'June 2022: inflation just hit 9.1%. Your $3,000 emergency fund sits in checking at 0.01%. What do you do?',
    opts: ['Move it to a high-yield savings account or T-bills you can still reach quickly', 'Put it all in crypto to beat inflation', 'Leave it. Inflation does not affect savings'], a: 0,
    why: 'An emergency fund must stay safe and easy to reach. Safe, higher-yield options cut the inflation drag without adding crash risk.', src: SRC.BLS }),
  C('evaluate', 'A', { t: 'mc', q: 'A friend says, "Cash is trash. Keep zero cash." Your best response?',
    opts: ['Keep an emergency fund anyway: its job is safety and access, not growth', 'Agree and invest every dollar', 'Keep everything in cash forever instead'], a: 0,
    why: 'Different money, different jobs. Long-term money can grow in investments; emergency money has to be there on a bad day.' }),

  // ---------- 6 · CREATE ----------
  C('create', 'B', { t: 'plan', q: 'Make your plan for the $500 from Grandma', total: 500, step: 10,
    cats: [['Spend now', 200], ['Save', 250], ['Give', 50]],
    grade: v => v[1] >= 100 ? { ok: true, msg: `Solid plan: ${money(toC(v[1]))} saved for later, and you still get to enjoy some now.` }
      : v[1] > 0 ? { ok: true, msg: `Plan saved. Tip: many people save at least 20% of gifts. That would be $100 here.` }
      : { ok: false, msg: 'Try saving at least something. Future you will thank you.' } }),
  C('create', 'I', { t: 'plan', q: 'Build a plan for your $600 paycheck', total: 600, step: 10,
    cats: [['Needs (phone, gas, food)', 300], ['Wants', 200], ['Savings', 100]],
    grade: v => v[2] >= 60 ? { ok: true, msg: `${Math.round(v[2] / 6)}% saved. The 50/30/20 guideline aims for about 20%, and you're on the board.` }
      : { ok: false, msg: `Only ${Math.round(v[2] / 6)}% saved. Aim for at least 10% ($60) to start.` } }),
  C('create', 'A', { t: 'plan', q: 'Design your $10,000 safety net. Your expenses are $2,000 a month.', total: 10000, step: 250,
    cats: [['Checking', 4000], ['High-yield savings', 3000], ['T-bills', 0], ['Stock index fund', 3000]],
    grade: v => { const safe = v[0] + v[1] + v[2];
      if (safe < 6000) return { ok: false, msg: `Only ${money(toC(safe))} is safe and reachable. Keep at least 3 months of expenses ($6,000) out of stocks.` };
      if (v[0] > 3000) return { ok: false, msg: `${money(toC(v[0]))} in checking earns almost nothing. Keep about a month there and move the rest to savings or T-bills.` };
      return { ok: true, msg: `${money(toC(safe))} safe (${(safe / 2000).toFixed(1)} months of expenses) and ${money(toC(v[3]))} growing. That's a resilient setup.` }; } }),
];
