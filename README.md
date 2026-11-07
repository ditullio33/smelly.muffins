# The Bullpen (team Smelly Muffins)

A Duolingo-style course that teaches high schoolers how to invest: **12 units, 62 lessons**, from Money Basics to Analyzing Companies. Each unit ends with an **application**: a 3D desk where market news hits and every decision is graded against what that unit taught. Lessons cite their sources (OpenStax *Principles of Finance 2e*, the Ken French Data Library, IRS, SEC/Investor.gov, FINRA).

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
| Lessons + desk scenarios | `js/content/u01.js` … `u12.js` | One file per unit: every lesson, question, source and that unit's desk shift |
| Course framework | `js/course.js`, `js/course-index.js` | Item helpers (`T`, `MC`, `TF`, `FILL`, `MATCH`), source names, mentor rotation |
| Lesson player and path | `js/lessons.js`, `css/lessons.css` | Path, hearts, XP, feedback bar, teach widgets (budget, compounding, bonds, history charts) |
| Historical data | `scripts/build-history.mjs`, `js/history-data.js` | Ken French data → `FF_DATA` global |
| 3D desk | `js/room3d.js`, `js/desk.js`, `js/desk-scenarios.js`, `css/room.css` | Room, controller, portfolio model |
| Market engine | `js/market.js`, `js/sim-helpers.js` | Fictional companies, scenario factors |
| AI mentor | `js/mentor.js` | Mentor personas and fallback answers |
| Shared | `js/utils.js`, `js/chart.js`, `js/state.js`, `js/app.js`, `css/base.css`, `css/accessibility.css` | Helpers, charts, saved progress, router |
| Sources | `docs/sources.md` | Every lesson → its sources (`npm run sources` regenerates it) |

Scripts load in the order listed at the bottom of `index.html`. They share globals, so keep that order when adding files.

## Historical data (Ken French)

1. Download the [Fama/French 3 Factors CSV zip](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/F-F_Research_Data_Factors_CSV.zip).
2. Put the `.zip` (or the unzipped `.csv`) in `data/`.
3. Run `npm run data`. This writes `js/history-data.js`. Commit it.

Until then, the history widgets show a "data not loaded" note and the Unit 9 desk uses clearly labeled simulated numbers.

## Publish a single file

`npm run bundle` writes `dist/the-bullpen.html` (everything inlined) and `dist/artifact.html` (for publishing as a Claude artifact).

## Ground rules

- All money is stored in **integer cents**. Use `toC()` and `money()` from `utils.js`.
- **Code does the math; the AI only explains.** The mentor never changes scores or numbers.
- Every company is **fictional**. Show the "not investment advice" note on anything that looks like a market.
- Elections only matter to the market through **uncertainty**. Never tie outcomes to a party.
- Historical figures (2008, 2022, midterm stats) need a source in a code comment before the demo.

## AI mentor

When the game runs as a Claude artifact, the mentor uses Claude. Anywhere else (localhost, GitHub Pages) it falls back to the built-in answers in `js/mentor.js` until someone wires up an API route. See the mentor workstream in `CONTRIBUTING.md`.

## Credits

Lesson content adapted from OpenStax, *Principles of Finance 2e* (CC BY-NC-SA 4.0). Historical returns from the Kenneth R. French Data Library (Tuck School of Business, Dartmouth).

## Disclaimer

Simulated market based on historical patterns. Not a prediction or investment advice.
