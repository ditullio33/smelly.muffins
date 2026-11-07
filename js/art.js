// Original artwork: The Bullpen bull logo and one illustration per unit for the lesson path.
// Fills use CSS classes (see css/lessons.css) so the art follows each unit's color and the light/dark theme.

// Bull head with horns rising like an up-trending chart; the right horn ends in an arrow (a "bull market").
const BULL_LOGO = `<svg class="bull-logo" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <rect width="64" height="64" rx="14" fill="#14212B"/>
  <path d="M21 25 C13 23 9.5 17 11 9" fill="none" stroke="#F3C34D" stroke-width="5" stroke-linecap="round"/>
  <path d="M43 25 C51 23 54.5 17 53 10.5" fill="none" stroke="#F3C34D" stroke-width="5" stroke-linecap="round"/>
  <path d="M53 4.5 L58 12 L48.5 11.5 Z" fill="#F3C34D"/>
  <path d="M18.5 27 L9.5 29.5 L17.5 33 Z M45.5 27 L54.5 29.5 L46.5 33 Z" fill="#E0A93A"/>
  <path d="M21 22 H43 Q46.5 22 46 26 L43.5 41 Q41.5 54 32 54 Q22.5 54 20.5 41 L18 26 Q17.5 22 21 22 Z" fill="#F3C34D"/>
  <circle cx="26" cy="33" r="2.6" fill="#14212B"/><circle cx="38" cy="33" r="2.6" fill="#14212B"/>
  <ellipse cx="32" cy="46" rx="8.5" ry="5.6" fill="#E0A93A"/>
  <circle cx="28.8" cy="46" r="1.7" fill="#14212B"/><circle cx="35.2" cy="46" r="1.7" fill="#14212B"/>
</svg>`;

const ILLUS = [
  // 1 Money Basics: a bill and a stack of coins
  `<rect x="44" y="58" width="128" height="70" rx="10" class="i-u"/><rect x="54" y="68" width="108" height="50" rx="6" class="i-s" opacity=".25"/><circle cx="108" cy="93" r="20" class="i-s"/><text x="108" y="102" text-anchor="middle" class="i-t" font-size="26">$</text>
   ${[0,1,2,3,4].map(i=>`<ellipse cx="62" cy="${166-i*11}" rx="30" ry="9" class="i-h i-o"/>`).join('')}`,
  // 2 Compounding: bars growing faster and faster under a curve
  `${[8,13,21,34,55,90].map((h,i)=>`<rect x="${30+i*24}" y="${170-h}" width="18" height="${h}" rx="4" class="i-u"/>`).join('')}
   <path d="M34 160 C90 156 130 120 168 64" fill="none" class="i-hs" stroke-width="6" stroke-linecap="round"/><circle cx="168" cy="64" r="9" class="i-h"/>`,
  // 3 Risk & Return: a balance scale
  `<rect x="96" y="58" width="8" height="104" rx="3" class="i-k"/><rect x="70" y="160" width="60" height="10" rx="4" class="i-k"/>
   <g transform="rotate(-10 100 62)"><rect x="34" y="58" width="132" height="8" rx="4" class="i-u"/>
   <path d="M44 66 L30 104 H62 Z" class="i-s i-o"/><path d="M156 66 L142 104 H174 Z" class="i-s i-o"/>
   <circle cx="46" cy="96" r="9" class="i-h"/><path d="M146 100 L158 78 L170 100 Z" class="i-u"/></g>`,
  // 4 Stocks: candlesticks
  `${[[40,110,60,130],[66,92,40,120],[92,100,36,124],[118,70,44,96],[144,52,40,78]].map(([x,y,h,w],i)=>`<line x1="${x+9}" y1="${y-14}" x2="${x+9}" y2="${y+h+14}" class="i-ks" stroke-width="3"/><rect x="${x}" y="${y}" width="18" height="${h}" rx="3" class="${i===2?'i-k':'i-u'}"/>`).join('')}
   <path d="M30 170 H176" class="i-ks" stroke-width="3"/>`,
  // 5 Bonds: a certificate with a seal
  `<rect x="34" y="44" width="134" height="104" rx="8" class="i-s i-o"/><rect x="44" y="54" width="114" height="84" rx="4" fill="none" class="i-us" stroke-width="3"/>
   ${[70,84,98].map(y=>`<rect x="58" y="${y}" width="${y===98?50:86}" height="6" rx="3" class="i-m"/>`).join('')}
   <path d="M128 128 L120 164 L132 156 L140 168 L144 132 Z" class="i-u"/><circle cx="134" cy="122" r="18" class="i-h i-o"/>`,
  // 6 Funds: a basket holding many eggs
  `${[[66,96],[86,90],[106,88],[126,92],[146,98],[76,80],[96,74],[116,74],[136,80]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="14" class="i-s i-o"/>`).join('')}
   <path d="M40 104 H172 L156 166 H56 Z" class="i-u"/>${[118,134,150].map(y=>`<path d="M48 ${y} H164" class="i-ss" stroke-width="3" opacity=".5"/>`).join('')}`,
  // 7 Building a Portfolio: a pie chart
  `<circle cx="104" cy="104" r="54" class="i-s i-o"/>
   <path d="M104 104 L104 50 A54 54 0 0 1 155 120 Z" class="i-u"/><path d="M104 104 L155 120 A54 54 0 0 1 72 148 Z" class="i-h"/>
   <path d="M98 98 L46 108 A54 54 0 0 1 98 44 Z" class="i-k" transform="translate(-6 -6)"/>`,
  // 8 Accounts & Taxes: a piggy bank and a coin
  `<ellipse cx="100" cy="116" rx="58" ry="42" class="i-u"/><circle cx="152" cy="108" r="18" class="i-u"/><ellipse cx="166" cy="112" rx="8" ry="10" class="i-s" opacity=".5"/>
   <path d="M78 80 L90 62 L98 82 Z" class="i-u"/><rect x="62" y="148" width="14" height="22" rx="4" class="i-u"/><rect x="120" y="148" width="14" height="22" rx="4" class="i-u"/>
   <rect x="86" y="80" width="30" height="6" rx="3" class="i-k"/><circle cx="101" cy="54" r="16" class="i-h i-o"/><circle cx="142" cy="102" r="3.5" class="i-k"/>`,
  // 9 How Markets Behave: a market line with an up and a down arrow
  `<path d="M28 150 L60 112 L84 128 L112 76 L136 98 L172 52 L172 170 L28 170 Z" class="i-u" opacity=".25"/>
   <path d="M28 150 L60 112 L84 128 L112 76 L136 98 L172 52" fill="none" class="i-us" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
   <path d="M160 40 L182 44 L170 62 Z" class="i-h"/><path d="M48 52 L48 84 M38 74 L48 86 L58 74" fill="none" class="i-ks" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  // 10 Investor Psychology: a speech bubble shouting FOMO over a racing heartbeat
  `<path d="M36 50 H168 Q178 50 178 60 V112 Q178 122 168 122 H86 L62 144 L66 122 H36 Q26 122 26 112 V60 Q26 50 36 50 Z" class="i-s i-o"/>
   <text x="102" y="98" text-anchor="middle" class="i-t" font-size="30">FOMO!</text>
   <path d="M24 164 H70 L82 140 L96 182 L110 152 L120 164 H178" fill="none" class="i-us" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`,
  // 11 Other Investments: a house and gold bars
  `<path d="M30 98 L80 56 L130 98 Z" class="i-u"/><rect x="40" y="96" width="80" height="66" class="i-u"/><rect x="70" y="124" width="20" height="38" rx="2" class="i-s"/>
   ${[[118,150],[150,150],[134,128]].map(([x,y])=>`<path d="M${x} ${y} h30 l-6 -18 h-18 z" class="i-h i-o"/>`).join('')}`,
  // 12 Analyzing Companies: a financial statement under a magnifying glass
  `<rect x="34" y="34" width="104" height="134" rx="8" class="i-s i-o"/>${[52,66,80].map(y=>`<rect x="48" y="${y}" width="${y===80?44:76}" height="6" rx="3" class="i-m"/>`).join('')}
   ${[[52,24],[68,38],[84,30],[100,52]].map(([x,h])=>`<rect x="${x}" y="${150-h}" width="10" height="${h}" rx="2" class="i-u"/>`).join('')}
   <circle cx="132" cy="112" r="30" class="i-s" opacity=".6"/><circle cx="132" cy="112" r="30" fill="none" class="i-ks" stroke-width="8"/><path d="M154 134 L178 158" class="i-ks" stroke-width="12" stroke-linecap="round"/>`,
];
const illus = (n, side) => `<div class="illus ${side}" aria-hidden="true"><svg viewBox="0 0 200 200" focusable="false">${ILLUS[(n - 1) % ILLUS.length]}</svg></div>`;
