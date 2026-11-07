# Working together

Five people, one repo, about 20 hours. These rules keep us from overwriting each other.

## Workstreams

Each person owns a set of files. You can touch other files, but tell the owner in the team chat first.

| # | Workstream | Owns | First tasks |
|---|---|---|---|
| 1 | **Units 1–3** (Money Basics, Compounding, Risk & Return) | `js/content/u01–u03.js` | Fact-check every question against `docs/sources.md`, tighten wording, play each desk shift |
| 2 | **Units 4–6** (Stocks, Bonds, Funds) | `js/content/u04–u06.js` | Same, plus check the bond widget against OpenStax Ch. 10 |
| 3 | **Units 7–9 + historical data** | `js/content/u07–u09.js`, `scripts/`, `js/history-data.js` | Add the Ken French data (`npm run data`), sanity-check the crash and "time in the market" charts |
| 4 | **Units 10–12 + AI mentor** | `js/content/u10–u12.js`, `js/mentor.js` | Fact-check, then wire the mentor to an AI API so it works outside Claude |
| 5 | **3D desk, UX, pitch & submission** | `js/room3d.js`, `js/desk.js`, `css/*`, `README.md` | Phone + laptop testing, demo script, Devpost write-up, slides |

## Track lessons still to write

`docs/lessons-to-write.md` lists the 41 empty track lessons. Biggest gaps: **Credit & Debt**, **Big Life Purchases**, **Private Equity & VC**, **Investment Banking & M&A**, **Taxes 101**. Claim one in the team chat, write it with the card template in `docs/lesson-template.md` (copy `js/content/t-budget-money.js`), cite the track's readings from the Library page, set `cards: true` on the lesson in `js/tracks.js`, and add its script tag in `index.html`.

## Writing a unit lesson

```js
// js/content/uXX.js
T('Card title', `<p>Teach text…</p>`, SRC.OS(11)),                    // teach card (+ optional { widget, card })
MC('Question?', ['Right', 'Wrong', 'Wrong'], 0, 'Why.', SRC.INV),      // index of the right answer
TF('Statement.', true, 'Why.', SRC.FF),
FILL('Sentence with ___ blank.', ['a', 'b', 'c'], 'a', 'Why.', SRC.CFPB),
MATCH('Prompt', [['Term', 'Meaning'], ...], SRC.INV),
```

Every item needs a source. Numbers that change yearly (tax limits, rates) must come from an official page; note it in `SRC`.

## Daily flow

```bash
git checkout main && git pull
git checkout -b yourname/short-description   # e.g. joey/fee-lesson-copy
# ...make changes...
npm test                                      # must pass
git add -A && git commit -m "Clear one-line summary"
git push -u origin yourname/short-description
```

Then open a pull request on GitHub. One teammate approves it, then merge with **Squash and merge**.

## Rules

- **Never push straight to `main`.** Always use a branch and a pull request.
- **Small PRs, often.** Merge every hour or two instead of one giant PR at 3am.
- **Pull before you start** and before you open a PR.
- **Merge conflict?** Pull `main` into your branch, fix the conflict, and ask the file's owner if unsure.
- **Test before merging:** run `npm test`, open the game, and play the part you changed on a laptop and a phone-sized window.
- **No secrets in git.** API keys go in `.env` (already ignored).

## Freeze

- **Sunday 8:00am:** feature freeze. Bug fixes only.
- **Sunday 9:30am:** final merge, record the demo, submit to Devpost by 10:00am.
