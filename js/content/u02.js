// Unit 2: The Magic of Compounding
unit({ id: 'u2', title: 'The Magic of Compounding', lessons: [
  { id: 'u2l1', title: 'Simple vs. compound interest', items: [
    T('Interest on your interest', `<p><b>Simple interest</b> pays only on your original money (the <b>principal</b>).</p><p><b>Compound interest</b> pays on the principal <i>plus</i> the interest you already earned.</p><p>$1,000 at 10% for 3 years: simple ends at <b>$1,300</b>. Compound ends at <b>$1,331</b>. The gap grows huge over decades. Drag the sliders.</p>`, SRC.OS(7), { widget: 'simple' }),
    FILL('$1,000 at 10% simple interest for 3 years grows to ___.', ['$1,300', '$1,331', '$1,030', '$3,000'], '$1,300', '$100 a year × 3 years = $300 of interest.', SRC.OS(7)),
    FILL('$1,000 at 10% compounded yearly for 3 years grows to ___.', ['$1,331', '$1,300', '$1,100', '$1,030'], '$1,331', '$1,000 × 1.1 × 1.1 × 1.1 = $1,331.', SRC.OS(7)),
    TF('With compound interest, you earn interest on your interest.', true, 'That snowball is the whole point.', SRC.OS(7)),
    MC('Over 30 years, which grows more at the same rate?', ['Compound interest', 'Simple interest', 'They end the same'], 0, 'Compounding pulls further ahead every single year.', SRC.OS(7)),
  ]},
  { id: 'u2l2', title: 'The Rule of 72', items: [
    T('A shortcut for doubling', `<p>Divide <b>72</b> by the yearly growth rate to estimate how many years it takes money to <b>double</b>.</p><p>At 6%: 72 ÷ 6 = <b>12 years</b>. At 9%: <b>8 years</b>.</p><p>It works for inflation too: at 3% inflation, prices double (your cash's buying power halves) in about <b>24 years</b>.</p><p>It's an estimate, not an exact formula.</p>`, SRC.OS(7)),
    FILL('At 7% a year, money doubles about every ___ years.', ['10', '7', '72', '3'], '10', '72 ÷ 7 ≈ 10.', SRC.OS(7)),
    FILL('At 8% a year, money doubles in about ___ years.', ['9', '8', '12', '16'], '9', '72 ÷ 8 = 9.', SRC.OS(7)),
    MC('A savings account pays 2%. About how long until your money doubles?', ['36 years', '12 years', '7 years', '2 years'], 0, '72 ÷ 2 = 36. That is why cash alone is slow.', SRC.OS(7)),
    MC('Inflation runs at 4%. About how long until your cash buys only half as much?', ['18 years', '4 years', '72 years', '40 years'], 0, '72 ÷ 4 = 18.', SRC.OS(7)),
    TF('The Rule of 72 gives the exact answer every time.', false, `It's a quick estimate that works best for rates between about 4% and 12%.`, SRC.OS(7)),
  ]},
  { id: 'u2l3', title: 'Starting early vs. starting late', items: [
    T('Time is your superpower', `<p>The biggest advantage a teenager has isn't money. It's <b>time</b>.</p><p>The last years of compounding add the most dollars, so starting 10 years earlier can roughly double what you end with. Drag the sliders.</p>`, SRC.OS(8), { widget: 'compound' }),
    MC('Jordan invests $100 a month from age 25 to 65 and earns 7% a year. About how much does she end with?', ['About $260,000', 'About $48,000', 'About $100,000', 'About $1 million'], 0, 'She only puts in $48,000. Compounding does the rest.', SRC.OS(8)),
    MC('Ana invests $2,000 a year from 15 to 24, then stops. Ben invests $2,000 a year from 25 to 64. Both earn 7%. Who has more at 65?', ['Ana, even though she put in $20,000 vs. his $80,000', 'Ben, because he put in four times as much', 'They end up the same'], 0, `Ana's money had 10 extra years to compound. She ends near $414,000; Ben near $399,000.`, SRC.OS(8)),
    TF('Waiting 10 years to start investing barely changes how much you end up with.', false, 'Those missing years are the biggest compounding years at the end.', SRC.OS(8)),
    MC('What is the biggest investing advantage teenagers have?', ['Time', 'Large paychecks', 'Inside information'], 0, 'Decades of compounding beat bigger amounts started later.', SRC.OS(8)),
  ]},
  { id: 'u2l4', title: 'Time in the market', items: [
    T('Staying invested is the strategy', `<p>"<b>Time in the market</b> beats timing the market" means staying invested through ups and downs usually works better than jumping in and out.</p><p>Pick a start year below and replay <b>real US stock market returns</b>. Notice the down years, and what happened to people who kept going.</p>`, SRC.FF, { widget: 'replay' }),
    MC(`What does "time in the market beats timing the market" mean?`, ['Staying invested matters more than guessing the perfect moment', 'Only buy stocks on Mondays', 'Sell whenever the news is bad'], 0, 'Nobody reliably predicts the short-term moves. Staying invested lets you catch the long-run growth.', SRC.OS(12)),
    TF('In US history, stocks have had many losing years, even though they grew a lot over long periods.', true, 'Down years are normal. The long-run growth came anyway.', SRC.FF),
    TF('Over most 20-year stretches since 1926, US stocks ended ahead of cash (Treasury bills).', true, 'Short periods are a coin flip; long periods have favored stocks. Past results do not guarantee the future.', SRC.FF),
    MC('Someone invested in US stocks at the start of 2008, the year of a big crash, and held for 10 years. What happened?', ['They ended well ahead despite the crash', 'They never got their money back', 'They exactly broke even'], 0, 'The 2008 crash hurt, but the following decade recovered and grew. Holding was rewarded.', SRC.FF),
  ]},
], app: { id: 'a2', title: 'Two friends, two start dates', blurb: 'Start now or later, beat simple interest, and stay invested through a drop.' },
shift: { desk: 'Compounding desk', intro: `Your grandparents gave you $5,000 to invest. Maya will test whether you really understand compounding.`,
  init(st) { PF.set(st, { INDEX: 5000 }); st.start = toC(5000); },
  scenarios: [
    { obj: 'inbox', alert: 'New memo in your inbox', from: 'Memo · Maya Chen', title: 'Start at 16 or wait until 26?', lesson: 'u2l3',
      body: () => `<p>Your cousin can invest <b>$100 a month</b> starting now at 16, or wait until 26 "when there's more money." Both stop at 65 and earn 7% a year.</p><p><b>What do you tell her?</b></p>`,
      choices: [
        { t: `Start now. The extra 10 years of compounding roughly doubles the ending total`, ok: true, fb: `At 7%, $100 a month from 16 to 65 grows to about ${money(compoundMonthly(toC(100), 49, 0.07).bal)}; starting at 26 gives about ${money(compoundMonthly(toC(100), 39, 0.07).bal)}.` },
        { t: 'Wait. $100 a month is too small to matter', ok: false, fb: 'Small amounts plus lots of time is exactly how compounding works.' },
        { t: `It doesn't matter when you start`, ok: false, fb: 'Time is the biggest factor in compounding.' },
      ], after: st => { PF.drift(st, 12); return 'A year passes. Your $5,000 keeps compounding.'; } },
    { obj: 'phone', alert: 'Your phone buzzed: bank offer', from: 'Text · Hometown Bank', title: 'Pick an account: simple or compound?', lesson: 'u2l1', phone: true,
      body: () => `<div class="bub them">Two 20-year accounts, both 5%: Account A pays <b>simple interest</b>. Account B <b>compounds yearly</b>. Which do you want for your $1,000?</div>`,
      choices: [
        { t: `Account B (compound): about ${money(Math.round(100000 * 1.05 ** 20))} after 20 years`, ok: true, fb: `Compound wins: about ${money(Math.round(100000 * 1.05 ** 20))} vs $2,000 with simple interest.` },
        { t: 'Account A (simple): $2,000 after 20 years', ok: false, fb: `Simple pays $50 a year forever. Compound grows to about ${money(Math.round(100000 * 1.05 ** 20))}.` },
      ] },
    { obj: 'monitor', alert: 'Question on your monitor', from: 'Terminal · Maya Chen', title: 'When will it double?', lesson: 'u2l2',
      body: st => `<p>Your index fund is worth <b>${money(PF.tot(st))}</b>. If it averages <b>8% a year</b>, about how long until it doubles?</p>`,
      choices: [{ t: 'About 9 years', ok: true, fb: '72 ÷ 8 = 9 years.' }, { t: 'About 8 years', ok: false, fb: 'Use the Rule of 72: 72 ÷ 8 = 9.' }, { t: 'About 25 years', ok: false, fb: '72 ÷ 8 = 9 years, much sooner than that.' }] },
    { obj: 'phone', alert: 'MARKET ALERT on your phone', from: 'Alert · Bullpen Markets', title: 'Stocks fall 20%', lesson: 'u2l4', phone: true,
      before: st => { PF.move(st, { INDEX: -0.2 }); return 'BEAR MARKET: stocks fall 20% from their high.'; },
      body: st => `<div class="bub alert">Your fund is down to <b>${money(PF.tot(st))}</b>.</div><div class="bub them">Maya: You won't need this money for 40 years. What's your move?</div>`,
      choices: [
        { t: 'Stay invested. Time in the market matters more than timing it', ok: true, fb: 'Down years are normal. Staying in lets you catch the recovery.' },
        { t: 'Sell now and buy back when things look better', ok: false, fb: 'By the time things look better, prices have usually bounced. You miss the recovery.', apply: st => PF.toSafe(st, 'cash') },
      ], after: st => { PF.move(st, { INDEX: 0.25 }); PF.drift(st, 120); return 'TEN YEARS LATER. The market recovered and kept compounding.'; } },
  ], pass: 3 } });
