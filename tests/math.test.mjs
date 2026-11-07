// Checks the money math the game teaches. Run: npm test
// Loads the browser scripts into a sandbox, so no build step or bundler is needed.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { matchMedia: () => ({ matches: false }), document: {}, window: {}, console };
vm.createContext(ctx);
for (const f of ['utils.js', 'market.js', 'sim-helpers.js']) {
  vm.runInContext(readFileSync(new URL(`../js/${f}`, import.meta.url), 'utf8'), ctx, { filename: f });
}
const run = (code) => vm.runInContext(code, ctx);
let passed = 0;
const near = (a, b, tol = 100) => assert.ok(Math.abs(a - b) <= tol, `expected ~${b}, got ${a}`); // within $1 of the exact formula (yearly cent rounding)
const t = (name, fn) => { fn(); passed++; console.log('ok -', name); };

t('fee lesson: $10,000 for 30 years at 7% with no fee', () => {
  near(run('feeGrowth(toC(10000),30,0.07,0)[30]'), Math.round(1000000 * 1.07 ** 30)); // ≈ $76,123
});
t('fee lesson: same money with a 1% fee', () => {
  near(run('feeGrowth(toC(10000),30,0.07,0.01)[30]'), Math.round(1000000 * 1.06 ** 30)); // ≈ $57,435
});
t('compound lesson: $100/month from 25 to 65 at 7% is about $260k', () => {
  const v = run('compoundMonthly(toC(100),40,0.07).bal') / 100;
  assert.ok(v > 255000 && v < 270000, `got ${v}`);
});
t('market engine is repeatable with the same seed', () => {
  const a = run('simulateDaily({days:200,seed:5,events:[{id:"recession",start:20}]}).P.INDEX[200]');
  const b = run('simulateDaily({days:200,seed:5,events:[{id:"recession",start:20}]}).P.INDEX[200]');
  assert.equal(a, b);
});
t('rate hikes hurt high-P/E growth more than banks', () => {
  assert.ok(run('impact(CO.ZAPP,SCEN.rateHike.phases[0]) < impact(CO.HLBK,SCEN.rateHike.phases[0])'));
});
t('recessions hurt groceries less than tractors', () => {
  assert.ok(run('impact(CO.FRSH,SCEN.recession.phases[0]) > impact(CO.IRON,SCEN.recession.phases[0])'));
});
t('Unit 2 claim: Ana (15–24) beats Ben (25–64) at 7%', () => {
  let ana = 0; for (let a = 15; a < 65; a++) { ana = ana * 1.07 + (a < 25 ? 2000 : 0); }
  let ben = 0; for (let a = 15; a < 65; a++) { ben = ben * 1.07 + (a >= 25 ? 2000 : 0); }
  assert.ok(ana > ben, `ana ${ana} ben ${ben}`); assert.ok(Math.abs(ana - 414000) < 8000 && Math.abs(ben - 399000) < 8000, `ana ${Math.round(ana)} ben ${Math.round(ben)}`);
});
t('Unit 12 claim: dividend growth model $2 / (8% − 4%) = $50', () => { assert.equal(Math.round(2 / (0.08 - 0.04)), 50); });
console.log(`\n${passed} passed`);
