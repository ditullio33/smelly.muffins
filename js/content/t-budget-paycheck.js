// Budgeting & Saving, Lesson 2: "Reading a paycheck" at three levels (same card template as t-budget-money.js).
// Sources: only U.S. materials that are free to copy (cards are written in our own words, with credit):
//   Saylor Personal Finance (CC BY-NC-SA 3.0), U.S. Dept. of Labor "Savings Fitness" (public domain),
//   Bolton, Personal Financial Planning for College Students (UL Lafayette, "print it, copy it, share it"),
//   plus IRS Topic 751 / Publication 15 for the payroll tax rates.
// Pay stubs are fictional. Income tax lines are example amounts; real withholding depends on your W-4, income and state.

const stub = (who, rows, net, note = 'Income tax amounts are examples. Real withholding depends on your W-4, income and state.') => `<div class="stub" role="table" aria-label="Pay stub for ${who}">
  <div class="stub-h"><span>${who}</span><span>Pay period: 2 weeks</span></div>
  <table>${rows.map(([k, v, cls]) => `<tr class="${cls || ''}"><td>${k}</td><td>${v}</td></tr>`).join('')}
  ${net ? `<tr class="tot"><td>Net pay</td><td>${net}</td></tr>` : ''}</table>
  <p class="muted" style="font-size:12px;margin:8px 0 0">${note}</p></div>`;

const STUB_B = stub('Jordan · Fresh Fields Grocery (fictional)', [
  ['Gross pay (40 hrs × $16.00)', '$640.00'], ['Federal income tax', '−$20.00', 'sub'], ['State income tax', '−$13.04', 'sub'],
  ['Social Security (6.2%)', '−$39.68', 'sub'], ['Medicare (1.45%)', '−$9.28', 'sub']], '?');
const STUB_I = stub('Riley · Summit Outfitters (fictional)', [
  ['Gross pay (80 hrs × $20.00)', '$1,600.00'], ['401(k), 5% (before income tax)', '−$80.00', 'sub'], ['Federal income tax', '−$110.00', 'sub'],
  ['State income tax', '−$45.60', 'sub'], ['Social Security (6.2%)', '−$99.20', 'sub'], ['Medicare (1.45%)', '−$23.20', 'sub']], '?');

LESSON_CARDS['bs-paycheck'] = [
  // ---------- 1 · REMEMBER ----------
  C('remember', 'B', { t: 'mc', q: 'You work 40 hours at $16 an hour. Your first check is for $558, not $640. What happened?',
    opts: ['Taxes were taken out before you were paid', 'Your boss made a mistake', 'The bank charged a fee'], a: 0,
    why: 'Almost every first paycheck surprises people. Your employer takes out taxes before the money reaches you.', src: SRC.SAYLOR(6) }),
  C('remember', 'B', { t: 'teach', title: 'Gross pay vs. net pay',
    body: `<p><b>Gross pay</b> is everything you earned before anything comes out. <b>Net pay</b> (take-home pay) is what actually lands in your account. Your pay stub shows both, plus every deduction in between.</p>`, src: SRC.DOL }),
  C('remember', 'B', { t: 'calc', q: 'You work 40 hours at $16 an hour. What is your gross pay?', a: 640, prefix: '$',
    why: '40 × $16 = $640. That is before any deductions.' }),
  C('remember', 'B', { t: 'teach', title: 'What comes out',
    body: `<p><b>Federal income tax</b> (the amount depends on the <b>W-4</b> you fill out when hired), often <b>state income tax</b>, plus <b>Social Security (6.2%)</b> and <b>Medicare (1.45%)</b>. Those last two together are called <b>FICA</b>.</p>`, src: SRC.IRS751 }),
  C('remember', 'I', { t: 'teach', title: 'Quick recap',
    body: `<p><b>Gross pay</b> minus deductions = <b>net pay</b>. Deductions include income tax (set by your W-4), Social Security (6.2%), Medicare (1.45%), and anything you choose, like a 401(k) or health insurance.</p>`, src: SRC.IRS751 }),

  // ---------- 2 · UNDERSTAND ----------
  C('understand', 'B', { t: 'match', q: 'Match each pay stub term',
    pairs: [['Gross pay', 'Earnings before deductions'], ['Net pay', 'What you take home'], ['FICA', 'Social Security + Medicare'], ['W-4', 'Tells your employer how much income tax to withhold']], src: SRC.SAYLOR(6) }),
  C('understand', 'B', { t: 'tf', q: 'The Social Security taken from your check helps pay benefits to retirees and disabled workers.', a: true,
    why: 'It works mostly pay-as-you-go: today’s workers fund today’s benefits, and you earn credit toward your own.', src: SRC.SAYLOR(11) }),
  C('understand', 'BI', { t: 'mc', q: 'Which form sets how much federal income tax comes out of each paycheck?',
    opts: ['W-4', 'W-2', '1099'], a: 0,
    why: 'You fill out the W-4 when you are hired. The W-2 is the year-end summary your employer sends you.', src: SRC.SAYLOR(6) }),

  // ---------- 3 · APPLY ----------
  C('apply', 'B', { t: 'calc', q: "Read Jordan's pay stub. What is the net pay?", html: STUB_B, a: 558, tol: 0.01, prefix: '$',
    why: '$640 − $20.00 − $13.04 − $39.68 − $9.28 = $558.00.', src: SRC.DOL }),
  C('apply', 'B', { t: 'calc', q: 'Social Security is 6.2% of gross pay. How much comes out of a $640 check?', a: 39.68, tol: 0.01, prefix: '$',
    why: '0.062 × $640 = $39.68.', src: SRC.IRS751 }),
  C('apply', 'I', { t: 'calc', q: "Read Riley's pay stub. What is the net pay?", html: STUB_I, a: 1242, tol: 0.01, prefix: '$',
    why: '$1,600 − $80 − $110 − $45.60 − $99.20 − $23.20 = $1,242.00.', src: SRC.DOL }),
  C('apply', 'I', { t: 'calc', q: 'Riley’s employer matches 50% of 401(k) contributions, up to 6% of pay. Riley puts in 5% ($80). How much does the employer add?', a: 40, prefix: '$',
    why: '50% × $80 = $40. That is extra pay that goes straight into Riley’s retirement account.', src: SRC.ULL }),

  // ---------- 4 · ANALYZE ----------
  C('analyze', 'BI', { t: 'sort', q: 'Is each deduction a tax, or something you chose?', buckets: ['Tax', 'You chose it'],
    items: [['Federal income tax', 0], ['Medicare', 0], ['Social Security', 0], ['401(k) contribution', 1], ['Health insurance premium', 1]],
    why: 'Taxes are required. Retirement savings and insurance are benefits you sign up for, and they can be worth a lot.', src: SRC.DOL }),
  C('analyze', 'I', { t: 'mc', q: 'Riley’s $80 401(k) contribution comes out before income tax is figured. What does that do?',
    opts: ['Riley pays income tax on $1,520 instead of $1,600 this period', 'Riley never pays tax on that money', 'It raises Riley’s Social Security tax'], a: 0,
    why: 'Traditional 401(k) money is tax-deferred: you skip income tax now and pay it when you withdraw in retirement.', src: SRC.ULL }),
  C('analyze', 'I', { t: 'mc', q: 'Riley could raise the 401(k) from 5% to 6% of pay. What changes?',
    opts: ['Riley saves $96 and gets the full $48 match, $8 more free money each check', 'Nothing. The match is the same', 'Riley loses the match'], a: 0,
    why: '6% × $1,600 = $96, and 50% of that is $48 (vs. $40 now). Contributing up to the full match is like a raise.', src: SRC.ULL }),
  C('analyze', 'A', { t: 'teach', title: 'Case: two job offers',
    body: `<table class="mini-t"><tr><th></th><th>Job A</th><th>Job B</th></tr><tr><td>Pay</td><td>$20/hr</td><td>$19/hr</td></tr><tr><td>401(k) match</td><td>None</td><td>50% up to 6%</td></tr></table><p>Both are full-time: 2,080 hours a year. You'd put 6% into the 401(k) at Job B.</p>`, src: SRC.ULL }),
  C('analyze', 'A', { t: 'calc', q: 'At Job B, what is your total pay for the year: wages plus the employer match?', a: 40705.6, tol: 1, prefix: '$',
    why: 'Wages: 2,080 × $19 = $39,520. Your 6% = $2,371.20, so the match is $1,185.60. Total: $40,705.60. Job A pays $41,600, still $894.40 more, but Job B builds retirement savings automatically.', src: SRC.ULL }),
  C('analyze', 'A', { t: 'mc', q: 'Your traditional 401(k) contribution lowers your income tax. Does it lower your Social Security and Medicare tax too?',
    opts: ['No. FICA is still figured on your full wages', 'Yes, by the same amount', 'Yes, but only Medicare'], a: 0,
    why: 'Elective 401(k) deferrals are still subject to Social Security and Medicare taxes.', src: SRC.IRS15 }),
  C('analyze', 'A', { t: 'calc', q: 'You earn $40,000 and put in 3%, but your employer matches 50% up to 6%. How much match money are you leaving on the table each year?', a: 600, prefix: '$',
    why: 'The missing 3% is $1,200 of your pay, and half of that ($600) is match you are not getting.', src: SRC.ULL }),

  // ---------- 5 · EVALUATE ----------
  C('evaluate', 'B', { t: 'mc', q: 'Your friend says, "I make $640 every two weeks, so I can spend $640." Best response?',
    opts: ['Budget from your net pay, the $558 that actually arrives', 'Right. Gross pay is what you have', 'Spend $640 and put the rest on a card'], a: 0,
    why: 'Plans built on gross pay come up short every single check.', src: SRC.DOL }),
  C('evaluate', 'I', { t: 'mc', q: 'Riley gets a $1,200 tax refund every spring. Riley also carries a credit card balance at 24% interest. What’s the smarter move?',
    opts: ['Adjust the W-4 to withhold less and use the extra each check to pay down the card', 'Keep the big refund. It feels like a bonus', 'Stop paying income tax'], a: 0,
    why: 'A big refund is your own money, returned with no interest. About $100 a month toward a 24% card saves real money.', src: SRC.SAYLOR(6) }),
  C('evaluate', 'A', { t: 'mc', timer: 20, q: 'Open enrollment closes today. Match: 50% up to 6%. You have a starter emergency fund and no card debt. Pick your 401(k) rate.',
    opts: ['6%: at least enough for the full match', '0%: keep all of it for now', '1%: just to have something'], a: 0,
    why: 'With basic safety in place, skipping the match turns down part of your pay. You can raise it more later.', src: SRC.ULL }),
  C('evaluate', 'A', { t: 'mc', q: 'Job A pays $894 more a year. Job B adds a retirement match. Which reason best supports choosing Job B?',
    opts: ['The match automatically builds savings that grow tax-deferred for decades', 'Job B pays more in cash', 'Job B has no taxes'], a: 0,
    why: 'Job A wins on cash today; Job B wins on automatic, compounding retirement savings. Weigh which matters more to you.', src: SRC.ULL }),

  // ---------- 6 · CREATE ----------
  C('create', 'B', { t: 'plan', q: 'Plan your first $558 paycheck', total: 558, step: 2,
    cats: [['Needs (phone, gas, food)', 200], ['Fun and wants', 258], ['Savings', 100]],
    grade: v => v[2] >= 56 ? { ok: true, msg: `${Math.round(v[2] / 5.58)}% saved from your very first check. That habit is worth more than the dollars.` }
      : { ok: false, msg: 'Try saving at least 10% ($56). Paying yourself first is easiest from day one.' } }),
  C('create', 'I', { t: 'plan', q: 'Plan Riley’s $1,242 take-home pay', total: 1242, step: 2,
    cats: [['Needs (rent share, food, transport)', 700], ['Wants', 342], ['Savings', 200]],
    grade: v => v[2] >= 124 ? { ok: true, msg: `${Math.round(v[2] / 12.42)}% saved, on top of the 401(k) already coming out. Solid.` }
      : { ok: false, msg: 'Aim for at least 10% ($124) to savings, on top of the 401(k).' } }),
  C('create', 'A', { t: 'plan', q: 'You took Job B. Plan your $1,242 take-home: you have $3,000 of card debt at 24%.', total: 1242, step: 2,
    cats: [['Needs', 700], ['Wants', 342], ['Extra card payment', 100], ['Emergency fund', 100]],
    grade: v => v[2] + v[3] >= 250 && v[2] >= 100 ? { ok: true, msg: `${money(toC(v[2]))} to the 24% card and ${money(toC(v[3]))} to safety each check. Every extra dollar to the card saves 24% a year.` }
      : { ok: false, msg: 'At 24%, the card is costing you about $60 a month in interest. Put at least $250 a check toward the card plus your emergency fund.' } }),
];
