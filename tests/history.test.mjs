// Checks the Ken French parser on a small fixture, and the real data file once it has been built.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { parseFF } from '../scripts/ff-parse.mjs';

let passed = 0; const t = (n, f) => { f(); passed++; console.log('ok -', n); };
const fx = parseFF(readFileSync(new URL('./fixtures/ff-sample.csv', import.meta.url), 'latin1'));
t('parser reads the monthly section', () => { assert.equal(fx.monthly.length, 4); assert.equal(fx.monthly[0].ym, 192607); });
t('parser reads the annual section separately', () => { assert.equal(fx.annual.length, 2); assert.equal(fx.annual[0].y, 1927); });
t('parser ignores header and copyright lines', () => { assert.ok(fx.monthly.every(r => Number.isFinite(r.mktrf))); });

const ctx = {}; vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../js/history-data.js', import.meta.url), 'utf8') + ';this.FF_DATA=FF_DATA;', ctx);
const D = ctx.FF_DATA;
if (!D) console.log('skip - real data not built yet (run npm run data)');
else {
  t('real data: annual series starts in 1927', () => assert.equal(D.annual[0].y, 1927));
  t('real data: monthly series starts July 1926', () => assert.equal(D.monthly[0].ym, 192607));
  t('real data: 2008 market return is strongly negative (computed)', () => { const r = D.annual.find(x => x.y === 2008); assert.ok(r.mktrf + r.rf < -25, `2008 = ${r.mktrf + r.rf}`); });
}
console.log(`\n${passed} passed`);
