// Placement quizzes ("Not sure? Test me."). Adaptive: start easy, step up a tier after a right answer, down after a wrong one.
// Each bank: { 1: easy[], 2: medium[], 3: hard[] }; question = [q, opts[], correctIndex, why].
// Tracks without a written bank borrow multiple-choice questions from their reused lessons (earlier lessons = easier tier).
const PQ = (q, opts, a, why = '') => ({ t: 'mc', q, opts, a, why });
const PLACEMENT = {
  budget: { // complete sample bank for Budgeting & Saving
    1: [PQ('What is a budget?', ["A plan for how you'll spend and save your money", 'A loan from a bank', 'A type of investment'], 0, 'A budget is a plan, made before the money is gone.'),
        PQ('An emergency fund is for…', ['Surprise costs like a car repair or losing a job', 'Concert tickets', 'Buying stocks on sale'], 0, 'It covers the unexpected so you avoid debt.'),
        PQ('Inflation means…', ['Prices rise over time, so money buys less', 'Prices fall over time', 'Your paycheck grows automatically'], 0, 'Rising prices shrink buying power.'),
        PQ('Which of these is a "need"?', ['Rent', 'A streaming subscription', 'A third pair of sneakers'], 0, 'Needs keep you housed, fed and working.'),
        PQ('Gross pay is…', ['Pay before taxes and deductions', 'Pay after taxes', 'Only your tips'], 0, 'Net pay is what lands in your account.'),
        PQ('Saving means…', ['Setting money aside for later', 'Buying things on sale', 'Borrowing money'], 0, 'A discount is still spending.')],
    2: [PQ('In the 50/30/20 guideline, the 20% goes to…', ['Saving and paying down debt', 'Wants', 'Rent'], 0, '50% needs, 30% wants, 20% saving and debt.'),
        PQ('A common goal for an emergency fund is…', ['3–6 months of expenses', 'One week of expenses', 'Two years of income'], 0, 'Enough to ride out a job loss or big repair.'),
        PQ('By the Rule of 72, money growing 8% a year doubles in about…', ['9 years', '8 years', '72 years'], 0, '72 ÷ 8 = 9.'),
        PQ('Your savings earn 2% while inflation is 4%. Your buying power…', ['Falls about 2% a year', 'Rises 2% a year', 'Stays the same'], 0, 'Real return ≈ 2% − 4% = −2%.'),
        PQ('Which pay-stub line is withheld for Social Security and Medicare?', ['FICA', 'Net pay', 'Gross pay'], 0, 'FICA = Social Security + Medicare.'),
        PQ('Money for a goal two years away is usually best kept in…', ['Savings or other low-risk accounts', 'One stock', 'Crypto'], 0, 'Short timelines leave no time to recover from a drop.')],
    3: [PQ('$5,000 grows 6% a year, compounded yearly, for 3 years. About how much do you have?', ['$5,955', '$5,900', '$6,500'], 0, '5,000 × 1.06³ ≈ $5,955. Simple interest would give $5,900.'),
        PQ('Take-home pay is $3,000/month and expenses are $2,400. Saving the rest, how long until you have 4 months of expenses saved?', ['16 months', '12 months', '4 months'], 0, '4 × $2,400 = $9,600 ÷ $600 a month = 16 months.'),
        PQ('Inflation runs 3% a year. About how long until prices double?', ['About 24 years', 'About 3 years', 'About 72 years'], 0, '72 ÷ 3 = 24.'),
        PQ('Why keep an emergency fund in savings instead of stocks?', ['Stocks could be down right when you need the cash', 'Stocks never go up', 'Savings beats stocks long-term'], 0, 'Emergencies often come with recessions, when stocks are down.'),
        PQ('Your pay rises from $40,000 to $42,000 while inflation is 6%. Your real pay…', ['Fell about 1%', 'Rose 5%', 'Rose 6%'], 0, '1.05 ÷ 1.06 ≈ 0.99.'),
        PQ('You save $200 a month at 0% for 40 years. A friend saves $100 a month at 7%. Who ends up with more?', ['The friend, by more than $150,000', 'You, since you saved twice as much', 'About the same'], 0, 'You: $96,000. Friend: about $262,000. Compounding wins.')],
  },
  credit: {
    1: [PQ('A credit score measures…', ["How reliably you've paid back borrowed money", 'Your income', 'Your savings'], 0),
        PQ('APR stands for…', ['Annual percentage rate', 'Average payment ratio', 'Annual payment requirement'], 0),
        PQ('If you pay only the minimum on a credit card…', ['You pay interest on the rest, and payoff takes much longer', 'The debt disappears', 'You earn a bonus'], 0)],
    2: [PQ('FICO scores range from…', ['300 to 850', '0 to 100', '100 to 1,000'], 0),
        PQ('Credit utilization is…', ['How much of your credit limit you are using', 'How many cards you have', 'Your interest rate'], 0),
        PQ('The debt avalanche method pays extra on…', ['The highest-interest debt first', 'The smallest balance first', 'The newest debt first'], 0)],
    3: [PQ('A $1,000 card balance at 24% APR. About how much interest builds in one month?', ['$20', '$240', '$2.40'], 0, '24% ÷ 12 = 2% a month.'),
        PQ('Which hurts a credit score most?', ['Missing payments', 'Checking your own score', 'Having a savings account'], 0, 'Payment history is the biggest factor.'),
        PQ('A subsidized federal student loan means…', ["The government pays the interest while you're in school at least half-time", 'There is never any interest', 'Only private banks offer it'], 0)],
  },
  purchases: {
    1: [PQ('A down payment is…', ['The cash you pay upfront on a big purchase', 'Your monthly payment', 'A late fee'], 0),
        PQ('Renters insurance mainly covers…', ['Your belongings in a rental', 'The building itself', 'Your car'], 0),
        PQ('A mortgage is…', ['A loan to buy a home', 'A type of rent', 'A home inspection'], 0)],
    2: [PQ('Compared with a 30-year mortgage, a 15-year mortgage usually has…', ['Higher monthly payments but much less total interest', 'Lower payments and more interest', 'The same total cost'], 0),
        PQ('Putting less than 20% down on a conventional mortgage usually adds…', ['Private mortgage insurance (PMI)', 'A lower rate', 'No closing costs'], 0),
        PQ('Leasing a car means…', ['You pay to use it for a set time, then return it', 'You own it outright', 'You pay no monthly bills'], 0)],
    3: [PQ('Closing costs on a home are often about…', ['2%–5% of the loan', '20% of the price', '$0'], 0),
        PQ('A common guideline caps housing costs at about ___ of gross income.', ['28%', '5%', '60%'], 0, 'The "28/36" rule of thumb.'),
        PQ('A $30,000 car loan at 7%: 72 months instead of 60 months gives you…', ['Lower payments but more total interest', 'A lower total cost', 'Higher payments'], 0)],
  },
  taxes: {
    1: [PQ('A W-2 shows…', ['What your employer paid you and withheld for taxes', 'Your credit score', 'Your bank balance'], 0),
        PQ('You fill out a W-4 to…', ['Tell your employer how much tax to withhold', 'File your tax return', 'Open a bank account'], 0),
        PQ('Getting a tax refund means…', ['You paid more during the year than you owed', 'The IRS gave you a bonus', 'You owe more'], 0)],
    2: [PQ('US tax brackets are marginal. Moving into a higher bracket means…', ['Only the dollars above the cutoff are taxed at the higher rate', 'All of your income is taxed at the higher rate', 'You take home less overall'], 0),
        PQ('Roth IRA contributions are made with…', ['After-tax money, and qualified withdrawals are tax-free', 'Pre-tax money, and withdrawals are taxed', 'Only employer money'], 0),
        PQ('Long-term capital gains rates apply to investments held…', ['More than one year', 'More than one month', 'More than ten years'], 0)],
    3: [PQ('Which situation usually favors a Roth over a traditional account?', ['You expect a higher tax rate later than now', 'You expect a lower tax rate later', 'You never plan to withdraw'], 0),
        PQ('A $1,000 tax credit…', ['Cuts your tax bill by $1,000', 'Cuts your taxable income by $1,000', 'Is the same as a deduction'], 0),
        PQ('You sell a stock held 8 months for a $500 gain. It is taxed as…', ['A short-term gain, at your ordinary income rate', 'A long-term gain at 0%', 'Not taxed'], 0)],
  },
  pevc: {
    1: [PQ('Venture capital firms mainly invest in…', ['Young, fast-growing startups', 'Government bonds', 'Mature utilities'], 0),
        PQ('Private equity firms often…', ['Buy whole companies, improve them and sell them later', 'Day-trade stocks', 'Make home loans'], 0),
        PQ('An "exit" is…', ['How investors cash out, like an IPO or a sale', 'A failed company', 'A board meeting'], 0)],
    2: [PQ('Startup funding usually goes…', ['Seed → Series A → Series B', 'Series B → Seed → IPO', 'IPO → Seed → Series A'], 0),
        PQ('In a leveraged buyout, the buyer uses…', ['A lot of borrowed money', 'Only cash', 'Only stock options'], 0),
        PQ("Limited partners (LPs) in a fund are…", ['The investors who supply most of the money', "The firm's managers", 'The startup founders'], 0)],
    3: [PQ('A startup raises $2M at an $8M pre-money valuation. Post-money is…', ['$10M', '$8M', '$6M'], 0, 'Post-money = pre-money + new cash.'),
        PQ('In that round, the new investors own about…', ['20%', '25%', '80%'], 0, '$2M ÷ $10M.'),
        PQ('Why does debt boost LBO returns when things go well?', ["The investors' own equity check is smaller, so the same gain is a bigger percentage", 'Debt has no cost', 'Lenders share the profits'], 0)],
  },
  ibma: {
    1: [PQ('An IPO is…', ['When a private company first sells shares to the public', 'A merger', 'A bond default'], 0),
        PQ('Investment bankers help companies…', ['Raise money and buy or sell businesses', 'Open checking accounts', 'Set interest rates'], 0),
        PQ('A merger is…', ['Two companies combining into one', 'A company splitting in two', 'A stock split'], 0)],
    2: [PQ('Comparable company analysis ("comps") values a company using…', ['Multiples of similar public companies', 'Its number of employees', "Its stock's 52-week high"], 0),
        PQ('Synergies are…', ['Extra value from combining, like cost savings', 'Legal fees', 'Taxes on a deal'], 0),
        PQ('A pitch book is…', ['A presentation bankers use to win clients or deals', 'A legal contract', 'A tax form'], 0)],
    3: [PQ('Similar companies trade at 10× EBITDA. The target earns $50M of EBITDA. Implied enterprise value?', ['$500M', '$50M', '$5B'], 0),
        PQ('Precedent transactions often show higher multiples than trading comps because…', ['Buyers pay a control premium', 'Old deals were bigger', 'Comps include debt'], 0),
        PQ('A DCF values a company by…', ['Discounting expected future cash flows to today', 'Adding up its past profits', 'Doubling its revenue'], 0)],
  },
};
function placementBank(trackId) {
  if (PLACEMENT[trackId]) return PLACEMENT[trackId];
  const t = TRACK[trackId], refs = t.lessons.filter(l => l.ref && NODE[l.ref]), bank = { 1: [], 2: [], 3: [] };
  refs.forEach(l => { const tier = { B: 1, I: 2, A: 3 }[l.lvl] || 1;
    NODE[l.ref].items.filter(x => x.t === 'mc' || x.t === 'tf').forEach(x => bank[tier].push(x.t === 'tf' ? PQ(x.q, ['True', 'False'], x.a ? 0 : 1, x.why) : PQ(x.q, x.opts, x.a, x.why))); });
  return bank;
}
// Runs the quiz in a lesson-style ui ({body, foot, fin, footReset}); calls done({level, right, hard, n, why}).
function runPlacement(ui, trackId, done) {
  const bank = placementBank(trackId), used = new Set(), N = 6; let tier = 1, n = 0, score = 0, right = 0, hard = 0;
  const pick = () => { for (const t of [tier, tier - 1, tier + 1, tier - 2, tier + 2]) { const pool = (bank[t] || []).filter(q => !used.has(q)); if (pool.length) { const q = pool[Math.floor(Math.random() * pool.length)]; used.add(q); return [q, t]; } } return [null]; };
  const next = () => {
    const [q, t] = pick(); if (!q || n >= N) return finish();
    n++; mountCard(ui, { ...q }, ok => {
      if (ok) { score += t; right++; if (t === 3) hard++; tier = Math.min(3, tier + 1); } else tier = Math.max(1, tier - 1); ui.progress?.(n / N); next(); }, `Placement · question ${n} of ${N}`);
  };
  const finish = () => {
    const level = score >= 11 && hard >= 2 ? 'advanced' : score >= 5 ? 'intermediate' : 'beginner';
    const why = level === 'advanced' ? `You got ${right} of ${n} right, including ${hard} of the hardest questions.`
      : level === 'intermediate' ? `You got ${right} of ${n} right. You know the basics, so you'll start with scenarios.`
      : `You got ${right} of ${n} right. You'll start with the core ideas and build up fast.`;
    done({ level, right, hard, n, why });
  };
  next();
}
