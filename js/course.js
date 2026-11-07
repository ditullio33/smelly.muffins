// Course framework. The lessons themselves live in js/content/u01.js … u12.js (one file per unit).
// Item types: teach (lesson card), mc (multiple choice), tf (true/false), fill (word bank), match (pairs).
// Every teach card and question carries `src`: where the fact comes from. Companies are fictional.
const UNITS = [];
const SRC = {
  OS: ch => `OpenStax, Principles of Finance 2e, Ch. ${ch} (CC BY-NC-SA 4.0)`,
  FF: 'Ken French Data Library, US market returns since 1926',
  IRS26: 'IRS news release IR-2025-111 (2026 retirement limits)',
  RP2532: 'IRS Rev. Proc. 2025-32 (2026 tax brackets)',
  CFPB: 'Consumer Financial Protection Bureau, consumerfinance.gov',
  INV: 'Investor.gov (U.S. Securities and Exchange Commission)',
  FINRA: 'FINRA.org',
  FDIC: 'FDIC.gov',
  SIPC: 'SIPC.org',
  BLS: 'U.S. Bureau of Labor Statistics, Consumer Price Index',
  FED: 'Federal Reserve, federalreserve.gov',
  GAME: 'The Bullpen (fictional company data)',
};
const T = (title, body, src, extra = {}) => ({ t: 'teach', title, body, src, ...extra });
const MC = (q, opts, a, why, src, extra = {}) => ({ t: 'mc', q, opts, a, why, src, ...extra });
const TF = (q, a, why, src) => ({ t: 'tf', q, a, why, src });
const FILL = (q, bank, a, why, src) => ({ t: 'fill', q, bank, a, why, src });
const MATCH = (q, pairs, src) => ({ t: 'match', q, pairs, src });
// Mentors rotate: Maya (Units 1–4), Marcus (5–8), Dana (9–12).
function unit(u) { const n = UNITS.length + 1; u.n = n; u.mentor = n <= 4 ? 'intern' : n <= 8 ? 'junior' : 'senior'; u.color = ['--u1', '--u2', '--u3', '--u4'][(n - 1) % 4]; UNITS.push(u); }
