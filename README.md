# The Bullpen (team Smelly Muffins)

A Duolingo-style course that teaches high schoolers how to invest. Players work up from **Intern** to **Junior Analyst** to **Senior Analyst**. Each unit is a few bite-size lessons, then an **application**: a 3D desk where market news hits (rate hikes, recessions, midterms, inflation) and every decision is graded against what the lessons taught.

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
| Lesson content | `js/course.js` | Every unit, lesson and question. Edit text here. |
| Lesson player and path | `js/lessons.js`, `css/lessons.css` | The lesson map, hearts, XP, feedback bar, teach widgets |
| 3D desk | `js/room3d.js` | Three.js room: objects, camera, click-to-zoom |
| Desk scenarios | `js/desk-scenarios.js` | The market situations in each unit's application, plus the portfolio math |
| Desk controller | `js/desk.js`, `css/room.css` | Alerts, panels, choices, shift report |
| Market engine | `js/market.js`, `js/sim-helpers.js` | Fictional companies, scenario factors, simulation |
| AI mentor | `js/mentor.js` | Mentor personas, fallback answers, AI hookup |
| Scenario Lab | `js/lab.js` | Practice screen |
| Shared | `js/utils.js`, `js/chart.js`, `js/state.js`, `js/app.js`, `css/base.css`, `css/accessibility.css` | Helpers, charts, saved progress, router |

Scripts load in the order listed at the bottom of `index.html`. They share globals, so keep that order when adding files.

## Ground rules

- All money is stored in **integer cents**. Use `toC()` and `money()` from `utils.js`.
- **Code does the math; the AI only explains.** The mentor never changes scores or numbers.
- Every company is **fictional**. Show the "not investment advice" note on anything that looks like a market.
- Elections only matter to the market through **uncertainty**. Never tie outcomes to a party.
- Historical figures (2008, 2022, midterm stats) need a source in a code comment before the demo.

## AI mentor

When the game runs as a Claude artifact, the mentor uses Claude. Anywhere else (localhost, GitHub Pages) it falls back to the built-in answers in `js/mentor.js` until someone wires up an API route. See the mentor workstream in `CONTRIBUTING.md`.

## Disclaimer

Simulated market based on historical patterns. Not a prediction or investment advice.
