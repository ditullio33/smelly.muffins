// Icons + ALL LESSON CONTENT (units, lessons, questions). Content team edits here.
/* ============================== ICONS ============================== */
const I = {
  fire:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M12 2.5c.6 3.4 4.8 5.6 4.8 10.6a4.8 4.8 0 0 1-9.6 0c0-2.6 1.4-3.9 2.1-6 1.5 1.1 2.3 2.6 2.4 4.3 1.2-2.4 1.3-5.5.3-8.9z"/></svg>',
  bolt:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M13.5 2 4.5 13.5h6.2L9.8 22l9.7-12h-6.4z"/></svg>',
  heart:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M12 21s-8.5-5.3-8.5-11.4A4.6 4.6 0 0 1 12 6.9a4.6 4.6 0 0 1 8.5 2.7C20.5 15.7 12 21 12 21z"/></svg>',
  check:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  lock:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M7 10V7.5a5 5 0 0 1 10 0V10h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2.5 0h5V7.5a2.5 2.5 0 0 0-5 0z"/></svg>',
  star:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>',
  chart:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M3 20h18v2H3zM4 17l5-6 4 3 6-8 1.6 1.2-7.2 9.6-4-3-3.9 4.6z"/></svg>',
  book:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5a.5.5 0 0 0 0 1H20v3H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
  x:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" fill="none"/></svg>',
  flask:'<svg class="ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M9 2h6v2h-1v5.2l5.6 9.6A2.2 2.2 0 0 1 17.7 22H6.3a2.2 2.2 0 0 1-1.9-3.2L10 9.2V4H9z"/></svg>',
};

/* ============================== COURSE ============================== */
// Item types: teach (lesson card), mc (multiple choice), tf (true/false), fill (word bank), match (pairs).
// Every fact shown here is general, long-run knowledge; companies are fictional.
const UNITS = [
 {id:'u1', mentor:'intern', color:'--u1', rank:'Intern', title:'Why invest at all?', lessons:[
  {id:'l1',title:'Saving vs. investing',items:[
    {t:'teach',title:'Two jobs for your money',body:`<p><b>Saving</b> means parking money somewhere safe, like a savings account. It barely grows, but it's there when you need it.</p><p><b>Investing</b> means buying things that can grow: <b>stocks</b> (tiny pieces of companies) and <b>bonds</b> (loans to governments or companies that pay you interest). It grows more, with ups and downs.</p>`},
    {t:'mc',q:'You need $500 for a new phone next month. Where should that money sit?',opts:['A savings account','The stock market','One exciting stock'],a:0,why:'Money you need soon shouldn\'t be somewhere that can drop 20% next month.'},
    {t:'tf',q:'A share of stock is a tiny piece of ownership in a company.',a:true,why:'Own a share and you own a slice of that business, including its future profits.'},
    {t:'mc',q:'What is a bond?',opts:['A loan you make to a government or company that pays you interest','A piece of ownership in a company','A type of savings account'],a:0,why:'You lend money, they pay interest, and you get your money back at the end.'},
    {t:'match',q:'Match each word to what it means',pairs:[['Savings account','Safe, slow growth'],['Stock','Piece of a company'],['Bond','Loan that pays interest'],['Investing','Buying things that can grow']]},
    {t:'tf',q:'Money sitting in a savings account can never lose value.',a:false,why:'Prices rise over time (inflation). If your savings grow slower than prices, each dollar buys less.'},
  ]},
  {id:'l2',title:'Compound growth',items:[
    {t:'teach',title:'Gains that earn gains',body:`<p>Invest $1,000 and earn 10%: you have <b>$1,100</b>.</p><p>Next year you earn 10% on $1,100, not just on $1,000. That's <b>$110</b> instead of $100. Your gains start earning their own gains.</p><p>That snowball is called <b>compounding</b>, and time is what makes it big.</p>`},
    {t:'fill',q:'$1,000 grows 10% to $1,100. If it grows another 10%, you\'ll have ___.',bank:['$1,200','$1,210','$1,100','$2,000'],a:'$1,210',why:'10% of $1,100 is $110, so you end with $1,210.'},
    {t:'teach',title:'Start early. Drag the sliders.',widget:'compound',body:`<p>Most of the money at 65 is <b>growth</b>, not money you put in. Try starting 10 years later.</p>`},
    {t:'fill',q:'Rule of 72: at 7% a year, money doubles about every ___ years.',bank:['10','7','72','3'],a:'10',why:'72 ÷ 7 ≈ 10. At 2% (a savings account) it takes about 36 years.'},
    {t:'mc',q:'Jordan invests $100 a month from age 25 to 65 and earns 7% a year. About how much does she end with?',opts:['About $48,000','About $260,000','About $100,000','About $1 million'],a:1,why:'She only puts in $48,000. Compounding turns it into roughly $260,000.'},
    {t:'tf',q:'Waiting 10 years to start investing barely changes how much you end up with.',a:false,why:'The last years of compounding are the biggest. Waiting 10 years can cut your ending total roughly in half.'},
  ]},
  {id:'l3',title:'Risk and reward',items:[
    {t:'teach',title:'More growth means more bumps',body:`<p><b>Cash:</b> almost no swings, small growth.</p><p><b>Bonds:</b> small swings, medium growth.</p><p><b>Stocks:</b> big swings. US stocks have averaged about 10% a year over the long run, but some years they've dropped more than 30%.</p><p>The more growth you want, the more ups and downs you have to sit through.</p>`},
    {t:'mc',q:'Which usually has the biggest ups and downs?',opts:['Stocks','Bonds','A savings account'],a:0,why:'Stocks swing the most, which is the price you pay for higher long-run growth.'},
    {t:'tf',q:'Higher possible returns usually come with more risk.',a:true,why:'If something offered high returns with no risk, everyone would buy it and the returns would disappear.'},
    {t:'mc',q:'Your friend says a stock "can\'t lose" because it doubled last year. Best reply?',opts:['Past gains don\'t guarantee future gains','It will probably double again','Stocks that rise never fall'],a:0,why:'Last year\'s winner can be next year\'s loser. Always look at the business, not just the price chart.'},
    {t:'mc',q:'Which is riskier?',opts:['Putting everything into one company','An index fund that owns hundreds of companies'],a:0,why:'One company can collapse. Hundreds of companies all collapsing at once is far less likely.'},
  ]},
  {id:'l4',title:'Know the business',items:[
    {t:'teach',title:'Rule #1 of investing',body:`<p>Only invest in businesses you understand.</p><p>Every company in this game has a <b>company card</b>. Start with the one-line description: what does the customer actually pay for?</p>`,card:'FRSH'},
    {t:'mc',card:'FRSH',q:'How does FreshCart make most of its money?',opts:CO.FRSH.how,a:0,why:'It buys groceries and sells them for a little more. It keeps about 3¢ of every $1.'},
    {t:'mc',card:'NMBS',q:'How does Nimbus Cloud make money?',opts:CO.NMBS.how,a:0,why:'Businesses rent its servers every month, which makes its income steady.'},
    {t:'mc',card:'HLBK',q:'How does Heartland Bank make money?',opts:CO.HLBK.how,a:0,why:'It pays you a little interest on savings and charges borrowers more on loans. The gap is its profit.'},
    {t:'tf',q:'If you can\'t explain how a company makes money in one sentence, you should research more before buying.',a:true,why:'If you can\'t explain it, you can\'t tell when something is going wrong.'},
  ]},
 ], app:{id:'a1',title:'Your first $1,000',blurb:'Split $1,000, fast-forward 10 years, then explain what happened.'}},

 {id:'u2', mentor:'junior', color:'--u2', rank:'Junior Analyst', title:'Build a portfolio', lessons:[
  {id:'l5',title:'Diversification',items:[
    {t:'teach',title:'Don\'t put all your eggs in one basket',body:`<p><b>Diversifying</b> means spreading money across many companies <i>and</i> many <b>sectors</b>: tech, banks, energy, healthcare, groceries and more.</p><p>When one sector has a terrible year, the others soften the blow.</p>`},
    {t:'mc',q:'Sam puts 80% of his money into tech stocks. What\'s the biggest problem?',opts:['One bad year for tech could sink his whole portfolio','Tech stocks are illegal for teens','Nothing. Tech always wins'],a:0,why:'He\'s concentrated. One sector\'s bad news becomes his bad news.'},
    {t:'tf',q:'Owning 10 different tech companies means you\'re well diversified.',a:false,why:'They\'re all in the same sector, so they tend to fall together.'},
    {t:'fill',q:'In this game, a good rule is no more than ___ of your money in one sector.',bank:['25%','50%','75%','90%'],a:'25%',why:'Capping each sector at about a quarter keeps any one headline from doing serious damage.'},
    {t:'match',q:'Match each company to its sector',pairs:[['FreshCart Grocers','Consumer staples'],['BrightGrid Power','Utilities'],['Petra Energy','Oil and gas'],['Vitalis Health','Healthcare']]},
  ]},
  {id:'l6',title:'Index funds and time',items:[
    {t:'teach',title:'Diversify in one click',body:`<p>An <b>index fund</b> buys a small slice of every company in a market. One purchase, hundreds of companies.</p><p>You get the market's average result, usually for a very low fee. Over long periods, most professional fund managers fail to beat it.</p>`},
    {t:'mc',q:'What does an index fund do?',opts:['Owns small slices of many companies at once','Picks the single best stock each year','Guarantees you won\'t lose money'],a:0,why:'It\'s instant diversification, but it still goes down when the whole market does.'},
    {t:'tf',q:'Most professional fund managers beat the index over long periods.',a:false,why:'Over 15 years, the large majority of US stock funds have trailed their index, mostly because of higher fees.'},
    {t:'mc',q:'Money you need in about one year should go…',opts:['In savings or cash','Mostly in stocks','In one exciting stock'],a:0,why:'Stocks can drop a lot in a single year. Short-term money needs to stay safe.'},
    {t:'mc',q:'Money for retirement 40+ years away should go…',opts:['Mostly in stocks or stock index funds','All in a savings account','Under your mattress'],a:0,why:'With decades to wait, you can ride out the drops and let compounding work.'},
  ]},
  {id:'l7',title:'Reading a company card',items:[
    {t:'teach',title:'Four numbers analysts check first',body:`<p><b>Sales growth:</b> how fast sales are rising.</p><p><b>Profit margin:</b> how many cents the company keeps from each $1 of sales.</p><p><b>Debt:</b> how much it owes. More debt means more risk in bad times.</p><p><b>P/E ratio:</b> the price you pay for each $1 of yearly profit. High P/E means investors expect big growth, so it has further to fall if growth slows.</p>`,card:'NMBS'},
    {t:'mc',card:'ZAPP',q:'ZipZap\'s P/E ratio is 85. What does that mean?',opts:['Investors pay $85 for each $1 of yearly profit','The stock costs $85','It grew 85% last year'],a:0,why:'That\'s very expensive. Investors are betting on huge future growth.'},
    {t:'mc',card:'NMBS',q:'Nimbus "keeps 26¢ per $1." Which stat is that?',opts:['Profit margin','Sales growth','P/E ratio','Debt'],a:0,why:'Profit margin is what\'s left from each dollar of sales after paying costs.'},
    {t:'mc',q:'Which is usually the stronger business?',opts:['Grows 20% a year, keeps 25¢ per $1, low debt','Grows 40% a year, keeps 2¢ per $1, high debt'],a:0,why:'Fast growth without profit is fragile. Profitable growth with little debt can survive bad years.'},
    {t:'tf',q:'Companies with lots of debt get hurt more when interest rates rise.',a:true,why:'Their loans get more expensive to pay back, which eats into profit.'},
    {t:'match',q:'Match each stat to its meaning',pairs:[['Sales growth','How fast sales rise'],['Profit margin','Cents kept per $1'],['P/E ratio','Price vs. profit'],['Edge','Why rivals can\'t copy it']]},
  ]},
  {id:'l8',title:'Crashes and calm',items:[
    {t:'teach',title:'Drops are normal. Panic is the problem.',body:`<p>Stocks have historically dropped 10% or more about once every year or two. Big crashes happen too.</p><p>If you <b>sell in a panic</b>, a temporary drop becomes a permanent loss, and you miss the recovery.</p><p><b>Dollar-cost averaging</b> means investing the same amount on a schedule, say $50 a month. When prices fall, your $50 buys more shares.</p>`},
    {t:'mc',q:'Your portfolio drops 25% in a recession. Which is usually the worst move?',opts:['Sell everything in a panic','Keep holding','Keep investing your usual monthly amount'],a:0,why:'Selling at the bottom locks in the loss. Markets have historically recovered, but only holders get the recovery.'},
    {t:'teach',title:'Interest rates are gravity',body:`<p>When the Fed <b>raises interest rates</b>, borrowing costs more and safe savings pay more.</p><p>Stocks usually fall, especially fast-growing companies with high P/Es, because their profits are far in the future. Bonds fall too. Banks often hold up better.</p>`},
    {t:'mc',q:'The Fed raises rates. Which company is likely hurt most?',opts:['ZipZap Social (fast growth, P/E 85)','Heartland Bank','FreshCart Grocers'],a:0,why:'High-P/E growth stocks get hit hardest when rates rise.'},
    {t:'mc',q:'In a recession, which usually falls least?',opts:['FreshCart Grocers','Summit Outdoor','Ironclad Machines'],a:0,why:'People still buy food. Camping gear and tractors can wait.'},
    {t:'tf',q:'Dollar-cost averaging means investing the same amount on a regular schedule.',a:true,why:'It removes the temptation to guess the perfect time to buy.'},
  ]},
 ], app:{id:'a2',title:'Build it and survive',blurb:'Compare companies, build a $10,000 portfolio and live through two years of market.'}},

 {id:'u3', mentor:'senior', color:'--u3', rank:'Senior Analyst', title:'Manage it like a pro', lessons:[
  {id:'l9',title:'Fees',items:[
    {t:'teach',title:'The quiet return-killer',widget:'fees',body:`<p>Funds charge a yearly fee called the <b>expense ratio</b>. It comes out every year, whether the fund wins or loses.</p>`},
    {t:'fill',q:'$10,000 for 30 years at 7% grows to about $76,000. With a 1% yearly fee it grows to about ___.',bank:['$57,000','$75,000','$70,000','$30,000'],a:'$57,000',why:'The 1% fee costs about $19,000. That\'s a quarter of the money.'},
    {t:'mc',q:'How much does a 1.20% fee cost per year on $10,000?',opts:['$120','$12','$1.20','$1,200'],a:0,why:'1.20% of $10,000 is $120. A 0.05% index fund would cost $5.'},
    {t:'tf',q:'Funds only charge fees in years when they make money.',a:false,why:'Fees come out in good years and bad years.'},
  ]},
  {id:'l10',title:'Emergency funds',items:[
    {t:'teach',title:'Cash is your shock absorber',body:`<p>Keep <b>3 to 6 months of bills</b> in cash before investing. That's an <b>emergency fund</b>.</p><p><b>Liquidity</b> is how quickly you can turn something into cash without losing value. Cash is the most liquid. Stocks can be sold in days, but maybe at a loss.</p>`},
    {t:'fill',q:'Your bills are $2,000 a month. A 3-month emergency fund is ___.',bank:['$6,000','$2,000','$3,000','$24,000'],a:'$6,000',why:'3 × $2,000 = $6,000.'},
    {t:'mc',q:'Your car breaks down during a market crash and you have no cash saved. What happens?',opts:['You may have to sell investments at a loss','Your investments pay for it automatically','Nothing, crashes don\'t matter'],a:0,why:'Without cash, you\'re forced to sell at the worst possible time.'},
    {t:'match',q:'Match each to how liquid it is',pairs:[['Cash','Spend it today'],['Stocks','Sell in days, maybe at a loss'],['A house','Takes months to sell'],['Emergency fund','3–6 months of bills']]},
  ]},
  {id:'l11',title:'Rebalancing, inflation, Roth IRA',items:[
    {t:'teach',title:'Keep your mix on target',body:`<p>Say your target is 70% stocks, 30% bonds. After a great year for stocks you might drift to 85/15, which means more risk than you chose.</p><p><b>Rebalancing</b> means selling a bit of what grew and buying what shrank to get back to target, often once a year.</p>`},
    {t:'mc',q:'Target: 70% stocks / 30% bonds. You\'re now at 85/15. Rebalancing means…',opts:['Sell some stocks and buy bonds to get back to 70/30','Buy more stocks since they\'re winning','Sell everything'],a:0,why:'You trim the winner to bring risk back to what you chose.'},
    {t:'tf',q:'If inflation is 3% and your savings earn 1%, you\'re losing buying power.',a:true,why:'Prices rise 3% but your money grows 1%, so each year it buys about 2% less.'},
    {t:'teach',title:'A Roth IRA',body:`<p>A <b>Roth IRA</b> is a retirement account. You put in money you've already paid tax on, and it can grow and come out <b>tax-free</b> in retirement.</p><p>You need <b>earned income</b> to contribute, so even a summer job counts.</p>`},
    {t:'mc',q:'What\'s special about a Roth IRA?',opts:['Money can grow and come out tax-free in retirement','It guarantees a 10% return','You can only open one after age 30'],a:0,why:'Tax-free growth over decades is a huge advantage for young investors.'},
  ]},
  {id:'l12',title:'Big news events',items:[
    {t:'teach',title:'How the market reacts to the news',body:`<p><b>Rate hikes:</b> growth stocks and bonds fall, savings pay more.</p><p><b>Recessions:</b> most stocks fall. Defensive companies (food, power, medicine) fall less.</p><p><b>Inflation spikes:</b> energy companies often rise, cash loses buying power, and the Fed often raises rates next.</p><p><b>Elections:</b> markets dislike <i>uncertainty</i>, so prices can get choppy before a vote and have historically settled after, whoever wins.</p>`},
    {t:'mc',q:'The Fed raises rates. What happens to savings accounts?',opts:['They pay more interest','They pay less interest','They close'],a:0,why:'Banks pay more to attract deposits when rates rise.'},
    {t:'mc',q:'Why does the market often get choppy before midterm elections?',opts:['Investors are unsure what new laws might pass','One party always crashes the market','The stock market closes during elections'],a:0,why:'It\'s about uncertainty, not which side wins. Historically, stocks have tended to recover after midterms.'},
    {t:'mc',q:'Inflation spikes. Which company tends to benefit?',opts:['Petra Energy','StreamVerse','ZipZap Social'],a:0,why:'Higher prices for oil and gas mean more profit for producers.'},
    {t:'tf',q:'Events chain together: high inflation often leads the Fed to raise rates.',a:true,why:'Raising rates is the Fed\'s main tool for cooling down inflation.'},
  ]},
  {id:'l13',title:'The stock pitch',items:[
    {t:'teach',title:'How analysts pitch a stock',body:`<p>A good pitch has three parts:</p><p><b>1. Decision:</b> buy or pass.</p><p><b>2. Reason:</b> backed by at least two numbers (growth, margin, debt, P/E).</p><p><b>3. Risk:</b> what could go wrong.</p>`},
    {t:'mc',q:'Which pitch reason is strongest?',opts:['Buy Vitalis: sales grow 11% a year, it keeps 22¢ per $1, and patents block copycats','Buy ZipZap: everyone at school uses it','Pass on BrightGrid: it\'s boring'],a:0,why:'It uses real numbers and names an edge. Popularity and boredom aren\'t analysis.'},
    {t:'mc',card:'NMBS',q:'What\'s the best "biggest risk" for Nimbus Cloud?',opts:['At 34× profits it\'s pricey, so if growth slows the stock could fall','It has a nice logo','There is no risk; it\'s a great company'],a:0,why:'Even great companies can be bad investments if you pay too much.'},
    {t:'tf',q:'A great company is a great investment at any price.',a:false,why:'Price matters. Overpay and even a great business can lose you money.'},
  ]},
 ], app:{id:'a3',title:'Run the desk',blurb:'Plan 20 years, survive the surprises, then pitch a stock.'}},
];
const NODES = []; UNITS.forEach(u=>{ u.lessons.forEach(l=>NODES.push({...l,unit:u,kind:'lesson'})); NODES.push({...u.app,unit:u,kind:'app'}); });
const NODE = Object.fromEntries(NODES.map(n=>[n.id,n]));
