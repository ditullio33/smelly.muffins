// Regenerates docs/sources.md from the lesson files. Run: npm run sources
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const files = [...html.matchAll(/<script src="(js\/[^"]+)"><\/script>/g)].map(m => m[1]).filter(f => /utils|market|sim-helpers|history-data|icons|course|desk-scenarios|content\//.test(f));
const ctx = { matchMedia: () => ({ matches: false }), document: {}, window: {}, console }; vm.createContext(ctx);
for (const f of files) vm.runInContext(readFileSync(new URL(f, root), 'utf8'), ctx, { filename: f });
const UNITS = vm.runInContext('UNITS', ctx);
let md = `# Sources by lesson\n\nGenerated from \`js/content/\` by \`npm run sources\`. Every teach card and question carries a \`src\` field.\n\n`;
md += `Primary sources:\n- OpenStax, *Principles of Finance 2e* (CC BY-NC-SA 4.0): https://openstax.org/books/principles-finance-2e/pages/preface\n- Ken French Data Library, Fama/French 3 Factors: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html\n- IRS news release IR-2025-111 (2026 401(k)/IRA limits) and Rev. Proc. 2025-32 (2026 capital gains brackets)\n- Investor.gov (SEC), FINRA, FDIC, SIPC, CFPB, BLS, Federal Reserve for topics outside the textbook\n\n`;
for (const u of UNITS) {
  md += `## Unit ${u.n}: ${u.title}\n\n| Lesson | Sources |\n|---|---|\n`;
  for (const l of u.lessons) md += `| ${l.title} | ${[...new Set(l.items.map(i => i.src).filter(Boolean))].join('<br>')} |\n`;
  md += `\n`;
}
writeFileSync(new URL('docs/sources.md', root), md);
console.log('Wrote docs/sources.md');
