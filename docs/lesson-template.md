# Writing a track lesson (card template)

Personalized learning has four parts:

- `js/tracks.js` defines the 13 tracks, the levels, the six Bloom stages and the card helpers.
- `js/placement.js` holds the placement quizzes.
- `js/onboard.js` runs onboarding, the plan summary and settings.
- `js/trackpath.js` draws the learning path and the lesson card UI.

## Data shape
```
TRACKS[] → { id, emoji, title, desc, check, tiers: { B: [], I: [], A: [] } }
lesson   → { id, title, ref?, cards? }
card     → C(stage, levels, { t, ... })
```
- **tiers**: each level has its own lesson list with **different topics**. A player only sees the list for the level they picked (or were placed in). Don't put the same topic in two levels of one track.
- **ref**: reuses one of the original 62 lessons, for example `'u1l3'`.
- **cards: true**: a card lesson stored in `LESSON_CARDS[id]`. Only the cards tagged for that lesson's level play.
- **cards: '<id>'**: reuses another card set at a different level (for example, the Advanced "Case: cash vs. real inflation" lesson plays the `A` cards from `bs-money`). Give it its own lesson id and title so progress is tracked separately.
- **neither**: shows as "Coming soon" on the path and never blocks progress.
- **stage**: one of `remember | understand | apply | analyze | evaluate | create`. Every graded answer is counted by stage in `S.stages`.
- **levels**: a string of `B`, `I` and `A` for the levels that see the card. `'BIA'` means everyone sees it.
- **t**: the card type. One of `teach`, `mc`, `tf`, `match`, `calc`, `slider`, `sort` or `plan`. Add `timer: 20` to any question card for a timed decision.

## Level recipe (follow js/content/t-budget-money.js)
- **Beginner**: all six stages, with extra Remember and Understand cards.
- **Intermediate**: a one-card recap of stages 1 and 2, then mostly Apply and Analyze.
- **Advanced**: Analyze, Evaluate and Create only, with a real-data case and a timed decision.

## Rules
- Ask a question before you explain.
- Keep each card to 2–3 sentences and one idea.
- Give every answer a `why`.
- Add a `src` to every fact.
- Use fictional companies in simulations.

## Adding a lesson
1. Create `js/content/t-<track>-<topic>.js` and fill in `LESSON_CARDS['<lesson-id>'] = [ ... ]`.
2. Set `cards: true` on that lesson in `js/tracks.js`, inside the level list (`B`, `I` or `A`) it belongs to.
3. Add the script tag to `index.html` after `t-budget-money.js`.
