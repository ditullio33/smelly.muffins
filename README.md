# The Bullpen (team Smelly Muffins)

A Duolingo/Brilliant-style course that teaches high school and college students money and investing. New players pick up to 3 of **13 tracks** (Budgeting, Credit, Taxes, Stocks, Equity Research, PE & VC, Macro…), choose a level or take a placement quiz, and get a personalized path. Each level (Beginner, Intermediate, Advanced) has its own set of topics. Behind it sits the original **12 units, 62 lessons**, from Money Basics to Analyzing Companies. Each unit ends with an **application**: a 3D desk where market news hits and every decision is graded against what that unit taught. Lessons cite their sources (OpenStax *Principles of Finance 2e*, the Ken French Data Library, IRS, SEC/Investor.gov, FINRA).

Built for **Redhawk Builds 2026 · Challenge 20** (investing game: risk, diversification, liquidity, fees).

## Run it

No build step. Any static server works.

```bash
npm run dev          # serves at http://localhost:5173
# or: python3 -m http.server 5173
```

Opening `index.html` straight from the file system also works.

```bash
npm test             # checks the money math (fees, compounding, market engine)
```

Requires Node 18+ for the test and dev scripts.

## Where things live

| Area | Files | What's in it |
|---|---|---|
| Tracks, levels, stages, readings | `js/tracks.js` | The 13 tracks → Beginner / Intermediate / Advanced lesson lists (reusing unit lessons via `ref`), Bloom stage tags, progress rules, `READINGS` |
| Card lessons (3 levels) | `js/content/t-*.js` | `LESSON_CARDS`; the template example is `t-budget-money.js` |
| Onboarding, plan, settings, library | `js/onboard.js`, `js/focus.js`, `js/placement.js` | Topic picker, level per topic, placement quizzes, "Change focus", settings, Library page |
| Personalized path + card types | `js/trackpath.js`, `css/tracks.css` | My plan view, lesson runner, calc/slider/sort/plan/timed cards |
| Lessons + desk scenarios | `js/content/u01.js` … `u12.js` | One file per unit: every lesson, question, source and that unit's desk shift |
| Course framework | `js/course.js`, `js/course-index.js` | Item helpers (`T`, `MC`, `TF`, `FILL`, `MATCH`), source names, mentor rotation |
| Lesson player and path | `js/lessons.js`, `css/lessons.css` | Path, hearts, XP, feedback bar, teach widgets (budget, compounding, bonds, history charts) |
| Historical data | `scripts/build-history.mjs`, `js/history-data.js` | Ken French data → `FF_DATA` global |
| 3D desk | `js/room3d.js`, `js/desk.js`, `js/desk-scenarios.js`, `css/room.css` | Room, controller, portfolio model |
| Market engine | `js/market.js`, `js/sim-helpers.js` | Fictional companies, scenario factors |
| AI mentor | `js/mentor.js` | Mentor personas and fallback answers |
| Shared | `js/utils.js`, `js/chart.js`, `js/state.js`, `js/app.js`, `css/base.css`, `css/accessibility.css` | Helpers, charts, saved progress, router |
| Sources | `docs/sources.md` | Every lesson → its sources (`npm run sources` regenerates it) |
| To-do + how-to | `docs/lessons-to-write.md`, `docs/lesson-template.md` | The 41 track lessons still to write, and how to write one |

Scripts load in the order listed at the bottom of `index.html`. They share globals, so keep that order when adding files.

## Historical data (Ken French)

1. Download the [Fama/French 3 Factors CSV zip](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/F-F_Research_Data_Factors_CSV.zip).
2. Put the `.zip` (or the unzipped `.csv`) in `data/`.
3. Run `npm run data`. This writes `js/history-data.js`. Commit it.

Until then, the history widgets show a "data not loaded" note and the Unit 9 desk uses clearly labeled simulated numbers.

## Routes

`#home` (My plan, or onboarding for new players) · `#onboard` · `#settings` · `#library` · `#course` (all 12 units) · `#lab` · `#u1l1`… (unit lessons) · `#a1`… (desk sims) · `#t:bs-money` (card lessons). In-app links go through `go()` in `js/app.js`.

## Publish a single file

`npm run bundle` writes `dist/the-bullpen.html` (everything inlined) and `dist/artifact.html` (for publishing as a Claude artifact).

## Ground rules

- All money is stored in **integer cents**. Use `toC()` and `money()` from `utils.js`.
- **Code does the math; the AI only explains.** The mentor never changes scores or numbers.
- **Real companies** are fine in research lessons (dated figures, cited). **Simulations use fictional companies.** Show the "not investment advice" note on anything that looks like a market.
- Every track-lesson card is tagged with a **Bloom stage** and the **levels** that see it (see `docs/lesson-template.md`).
- `REVIEW_UNLOCK` in `js/state.js` is `true` (everything unlocked for review). Decide before submitting whether to set it to `false`.
- Elections only matter to the market through **uncertainty**. Never tie outcomes to a party.
- Historical figures (2008, 2022, midterm stats) need a source in a code comment before the demo.

## AI mentor

When the game runs as a Claude artifact, the mentor uses Claude. Anywhere else (localhost, GitHub Pages) it falls back to the built-in answers in `js/mentor.js` until someone wires up an API route. See the mentor workstream in `CONTRIBUTING.md`.

## Credits

Lesson content adapted from OpenStax, *Principles of Finance 2e* (CC BY-NC-SA 4.0). Historical returns from the Kenneth R. French Data Library (Tuck School of Business, Dartmouth).

## Disclaimer

Simulated market based on historical patterns. Not a prediction or investment advice.
