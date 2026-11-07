# Working together

Five people, one repo, about 20 hours. These rules keep us from overwriting each other.

## Workstreams

Each person owns one area. You can touch other files, but tell the owner in the team chat first.

| # | Workstream | Owns | First tasks |
|---|---|---|---|
| 1 | **Lessons & content** | `js/course.js` | Fact-check every question, tighten wording for high schoolers, add 1–2 questions where a lesson feels thin |
| 2 | **3D desk** | `js/room3d.js`, `css/room.css` | Merge in the best parts of the "Ledger Up" room, polish lighting and models, test on phones |
| 3 | **Scenarios & market engine** | `js/desk-scenarios.js`, `js/market.js`, `js/sim-helpers.js` | Source the historical numbers, make sure each scenario tests exactly one lesson, keep `npm test` green |
| 4 | **AI mentor & voice** | `js/mentor.js` | Add a small API route so the mentor works outside Claude; optional ElevenLabs voice for that prize |
| 5 | **UX, pitch & submission** | `css/base.css`, `css/lessons.css`, `css/accessibility.css`, `README.md` | Click through everything on phone + laptop, write the 2-minute demo script, Devpost write-up, slides |

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
