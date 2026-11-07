// Unit 12: Analyzing Companies (advanced). Statement figures are fictional and internally consistent with the Nimbus card.
const NIMBUS_IS = { revenue: 10.0, cogs: 4.0, opex: 2.6, interest: 0.1, taxes: 0.7, shares: 1.0 }; // $ billions; shares in billions
const fmtB = x => '$' + x.toFixed(1) + 'B';
function statementTable(rows) { return `<div class="r-hold" style="max-width:420px">${rows.map(([k, v, b]) => `<div><span>${b ? '<b>' + k + '</b>' : k}</span><b class="mono">${v}</b></div>`).join('')}</div>`; }
unit({ id: 'u12', title: 'Analyzing Companies (advanced)', lessons: [
  { id: 'u12l1', title: 'Reading an income statement', items: [
    T('Did the company make money?', `<p>The <b>income statement</b> shows a period's results:</p>${statementTable([['Revenue (sales)', '$10.0B'], ['− Cost of goods sold', '$4.0B'], ['= Gross profit', '$6.0B', 1], ['− Operating expenses', '$2.6B'], ['= Operating income', '$3.4B', 1], ['− Interest and taxes', '$0.8B'], ['= Net income', '$2.6B', 1]])}<p>Nimbus Cloud (fictional). <b>Earnings per share (EPS)</b> = net income ÷ shares = $2.6B ÷ 1.0B = <b>$2.60</b>.</p>`, SRC.OS(5)),
    MC('Gross profit equals…', ['Revenue minus cost of goods sold', 'Revenue minus taxes', 'Net income plus interest'], 0, 'It is what is left after making the product.', SRC.OS(5)),
    FILL('Nimbus earns $2.6B with 1.0B shares. Its EPS is ___.', ['$2.60', '$26.00', '$0.26', '$10.00'], '$2.60', '$2.6B ÷ 1.0B shares.', SRC.OS(5)),
    MC('In fall 2026, Microsoft kept about 41¢ of every $1 of sales as profit; Walmart kept about 3¢. What does that tell you?', ['Their business models differ: software is cheap to copy, groceries cost a lot to stock', 'Walmart is losing money', 'Microsoft sells more stuff'], 0, 'Margins depend on the industry. Compare companies with their peers.', SRC.REAL),
    TF('Revenue and net income are the same thing.', false, 'Revenue is sales. Net income is what is left after every cost.', SRC.OS(5)),
    MC(`Nimbus has $10.0B of revenue and $2.6B of net income. Its net profit margin is…`, ['26%', '10%', '2.6%', '60%'], 0, '$2.6B ÷ $10.0B. That matches the "keeps 26¢ per $1" card.', SRC.OS(6)),
  ]},
  { id: 'u12l2', title: 'Reading a balance sheet', items: [
    T('What it owns and owes', `<p>The <b>balance sheet</b> is a snapshot on one day:</p><p><b>Assets = Liabilities + Shareholders' equity</b></p>${statementTable([['Assets (cash, buildings, servers…)', '$20.0B'], ['Liabilities (incl. $2.0B debt)', '$6.0B'], ["Shareholders' equity", '$14.0B', 1]])}<p><b>Debt-to-equity</b> = $2.0B ÷ $14.0B ≈ <b>0.14</b>: low.</p>`, SRC.OS(5)),
    MC('Which equation is always true on a balance sheet?', ['Assets = Liabilities + Equity', 'Revenue = Profit', 'Assets = Revenue − Taxes'], 0, 'It has to balance.', SRC.OS(5)),
    FILL(`Assets are $20B and liabilities are $6B. Shareholders' equity is ___.`, ['$14B', '$26B', '$6B', '$20B'], '$14B', '$20B − $6B.', SRC.OS(5)),
    MATCH('Match each balance sheet term', [['Assets', 'What the company owns'], ['Liabilities', 'What the company owes'], ['Equity', `Owners' share`], ['Cash', 'Most liquid asset']], SRC.OS(5)),
    MC('JPMorgan\'s debt-to-equity was about 3.6 in fall 2026; Microsoft\'s was about 0.3. Why is a bank\'s so high?', ['Customer deposits count as money the bank owes', 'JPMorgan is about to go bankrupt', 'Banks never have equity'], 0, 'Borrowing (deposits) and lending is how banks work. Compare banks with banks.', SRC.REAL, { card: 'JPM' }),
    MC('A debt-to-equity ratio of 0.14 suggests…', ['Low debt compared with equity', 'The company is bankrupt', 'Very high debt'], 0, 'Lower means less borrowed money relative to owners\' money.', SRC.OS(6)),
  ]},
  { id: 'u12l3', title: 'Cash flow basics', items: [
    T('Profit isn\'t cash', `<p>The <b>cash flow statement</b> tracks real cash in three sections: <b>operating</b> (running the business), <b>investing</b> (buying equipment, other companies) and <b>financing</b> (borrowing, paying dividends).</p><p><b>Free cash flow</b> = operating cash flow − capital expenditures. Nimbus: $3.5B − $1.2B = <b>$2.3B</b>.</p>`, SRC.OS(5)),
    FILL('Operating cash flow is $3.5B and capital expenditures are $1.2B. Free cash flow is ___.', ['$2.3B', '$4.7B', '$1.2B', '$3.5B'], '$2.3B', '$3.5B − $1.2B.', SRC.OS(5)),
    MATCH('Match each cash flow section', [['Operating', 'Cash from running the business'], ['Investing', 'Buying equipment or companies'], ['Financing', 'Borrowing, repaying, dividends']], SRC.OS(5)),
    TF('A company can be profitable on paper and still run out of cash.', true, 'If customers pay slowly or spending is heavy, cash can run dry.', SRC.OS(5)),
    MC('Why do investors care about free cash flow?', ['It is the cash available for dividends, debt payments and growth', 'It is the same as revenue', 'It is always negative'], 0, 'Cash pays the bills and the owners.', SRC.OS(5)),
  ]},
  { id: 'u12l4', title: 'P/E ratio', items: [
    T('Price vs. profit', `<p><b>P/E ratio</b> = share price ÷ earnings per share.</p><p>A stock at <b>$88.40</b> with EPS of <b>$2.60</b> has a P/E of <b>34</b>: you pay $34 for each $1 of yearly profit.</p><p>Real examples from fall 2026: Walmart traded around <b>45×</b> earnings, JPMorgan around <b>14×</b>.</p><p>A high P/E means high expectations. Compare P/Es <b>within the same industry</b>. A low P/E isn't automatically a bargain.</p>`, SRC.OS(11), { card: 'WMT' }),
    FILL('A $60 stock with EPS of $3 has a P/E of ___.', ['20', '180', '3', '63'], '20', '$60 ÷ $3.', SRC.OS(11)),
    MC('A higher P/E means investors are…', ['Paying more for each $1 of profit, expecting growth', 'Paying less for each $1 of profit', 'Getting a bigger dividend'], 0, 'High P/E = high expectations.', SRC.OS(11)),
    MC('Walmart traded at about 45 times earnings in fall 2026. What does that tell you?', ['Investors were paying a lot for each $1 of profit, so expectations were high', 'It was cheap', 'It paid a huge dividend'], 0, 'A high P/E means good news is already priced in.', SRC.REAL, { card: 'WMT' }),
    TF('A low P/E always means a stock is a bargain.', false, 'Sometimes it is low because the business is in trouble.', SRC.OS(11)),
  ]},
  { id: 'u12l5', title: 'Growth vs. value stocks', items: [
    T('Two styles', `<p><b>Growth stocks</b> are growing fast and usually have high P/Es. <b>Value stocks</b> trade at low prices compared with their earnings or book value.</p><p>Researchers Eugene Fama and Kenneth French track the difference as <b>HML</b> ("high minus low"). Below is how value did versus growth over time, using their real data.</p>`, SRC.FF, { widget: 'value' }),
    MC('JPMorgan traded around 14 times earnings with a 2% dividend yield in fall 2026. That looks more like…', ['A value stock', 'A growth stock', 'A bond'], 0, 'Low price compared with earnings, plus a dividend.', SRC.REAL, { card: 'JPM' }),
    MC('Nvidia\'s revenue more than doubled in each of fiscal 2024 and 2025. That is the profile of…', ['A growth stock', 'A value stock', 'A utility'], 0, 'Explosive sales growth is what growth investors look for.', SRC.REAL, { card: 'NVDA' }),
    TF('A high P/E always means a company is growing fast.', false, 'Walmart\'s P/E was around 45 even though its sales grow steadily, not explosively. P/E reflects expectations and safety too.', SRC.REAL),
    TF('Value stocks have beaten growth stocks in every single decade.', false, 'Value has had long losing stretches, including much of the 2010s.', SRC.FF),
    MC('In the Fama/French data, HML measures…', ['Value stocks\' return minus growth stocks\' return', 'Stock returns minus inflation', 'Bond returns'], 0, 'High book-to-market minus low book-to-market.', SRC.FF),
  ]},
  { id: 'u12l6', title: 'Intro to valuation', items: [
    T('What is it really worth?', `<p>A stock's <b>intrinsic value</b> is the present value of the cash it will pay owners in the future.</p><p>A simple version, the <b>dividend growth model</b>: value = next year's dividend ÷ (required return − growth rate).</p><p>Example: $2 dividend, 8% required return, 4% growth: $2 ÷ (0.08 − 0.04) = <b>$50</b>. Small changes in assumptions change the answer a lot, so analysts build in a <b>margin of safety</b>.</p>`, SRC.OS(11)),
    FILL('Dividend $2, required return 8%, growth 4%. Estimated value is ___.', ['$50', '$25', '$100', '$2'], '$50', '$2 ÷ (0.08 − 0.04) = $2 ÷ 0.04.', SRC.OS(11)),
    MC('What is "intrinsic value"?', ['An estimate of what a stock is worth based on its future cash flows', 'Today\'s stock price', 'The value of the company\'s office'], 0, 'Price is what you pay; value is what you get.', SRC.OS(11)),
    TF('If the price is well above your estimate of value, the stock may be overvalued.', true, 'That is the point of estimating value.', SRC.OS(11)),
    MC('What is the biggest weakness of valuation models?', ['They depend heavily on assumptions about the future', 'They are illegal', 'They only work for banks'], 0, 'Garbage in, garbage out. Hence a margin of safety.', SRC.OS(11)),
  ]},
], app: { id: 'a12', title: 'The analyst seat', blurb: 'Read real-looking statements, then pitch a stock.' },
shift: { desk: 'Analyst desk', intro: `You're interviewing for an analyst job. Dana will hand you fictional financial statements. The game does the math; you make the calls.`,
  init(st) { PF.set(st, {}); st.start = 0; },
  scenarios: [
    { obj: 'inbox', alert: 'Statements in your inbox', from: 'Memo · Dana Okafor', title: `Summit Outdoor's income statement`, lesson: 'u12l1',
      body: () => { const r = 2.0, c = 1.1, o = 0.55, it = 0.15; const ni = r - c - o - it; return `<p>Summit Outdoor (fictional), last year:</p>${statementTable([['Revenue', fmtB(r)], ['Cost of goods sold', fmtB(c)], ['Operating expenses', fmtB(o)], ['Interest and taxes', fmtB(it)], ['Net income', fmtB(ni), 1]])}<p><b>What is Summit's net profit margin?</b></p>`; },
      choices: [{ t: '10%', ok: true, fb: '$0.2B ÷ $2.0B = 10%. Matches the "keeps 10¢ per $1" card.' }, { t: '45%', ok: false, fb: 'That is the gross margin: (2.0 − 1.1) ÷ 2.0. Net margin subtracts every cost.' }, { t: '55%', ok: false, fb: 'Net margin = net income ÷ revenue = $0.2B ÷ $2.0B.' }] },
    { obj: 'monitor', alert: 'Balance sheet on your monitor', from: 'Terminal · Dana Okafor', title: `StreamVerse's balance sheet`, lesson: 'u12l2',
      body: () => `<p>StreamVerse (fictional):</p>${statementTable([['Assets', '$30.0B'], ['Liabilities (incl. $15.0B debt)', '$22.0B'], ["Shareholders' equity", '$8.0B', 1]])}<p><b>What should worry you most?</b></p>`,
      choices: [{ t: 'Debt-to-equity near 1.9: heavy borrowing, risky if rates rise', ok: true, fb: '$15B ÷ $8B ≈ 1.9, versus Nimbus at 0.14.' }, { t: 'Assets are too large', ok: false, fb: 'Size alone is not the issue. What is financed by debt is.' }, { t: 'Equity is positive', ok: false, fb: 'Positive equity is normal. The debt load is the concern.' }] },
    { obj: 'phone', alert: 'Your phone buzzed: Dana', from: 'Text · Dana Okafor', title: 'Growth or value?', lesson: 'u12l5', phone: true,
      body: () => `<div class="bub them">Nvidia: revenue more than doubled two years running. JPMorgan: P/E around 14, 2% dividend. Which statement is true?</div>`,
      choices: [{ t: 'Nvidia fits growth and JPMorgan fits value; neither is automatically better', ok: true, fb: 'Style is not a verdict. Price versus prospects is.' }, { t: 'Nvidia is better because it grows faster', ok: false, fb: 'Growth is only good if the price leaves room for it.' }, { t: 'JPMorgan is better because its P/E is lower', ok: false, fb: 'A low P/E can also mean low expectations for a reason.' }] },
    { obj: 'monitor', alert: 'Pitch request on your monitor', from: 'Terminal · Dana Okafor', title: 'Pitch one stock to the desk', lesson: 'u12l6', kind: 'pitch' },
  ], pass: 3 } });
