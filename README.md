# And I Wonder

A Vietnamese/English quant learning studio, built from the **Road to Quant** Obsidian curriculum. **Mathematics v2 is the local default curriculum.** Public visitors can read; the configured GitHub owner can save progress and edit the original legacy Markdown notes.

Existing production address: **https://and-i-wonder-quant.vercel.app**. This mathematics upgrade is a local review diff; the production address does not imply v2 has been deployed.

## Mathematics v2

The 105-module sequence trains proofs, derivations, counterexamples and assumption checking across rigorous foundations, measure probability, statistical inference, convex optimization, dependent inference and selected statistical/online learning. Its target is **selected early-graduate coursework competence**, not a PhD credential or evidence of research independence. An unknown calculus/proof starting point is addressed by a diagnostic and a slower foundation route that defers the learning/bandit depth beyond two years.

- `/daily` and dated daily pages default to v2. `?curriculum=v1` opens the preserved curriculum; `?curriculum=v2&route=foundation` selects the replacement foundation schedule.
- `/mathematics` lists every week, prerequisites, sessions and assessment rules. Theorem labels distinguish complete proofs, sketches and assumed results.
- Lessons include self-contained bilingual definitions, theorem hypotheses, proofs, individual applications, general formulas, step-by-step methods, original solutions and section-specific free sources. A week revisits its theorems through distinct daily tasks.
- Diagnostic and cumulative gates have A/B problems. Final A and B each cover probability/analysis, inference, optimization/learning and dependent/sequential reasoning. Critical errors block a pass under the manual rubric; numeric matching never validates a proof.
- The P05 capstone is now sequential inference with matrix Kalman reasoning, dependent uncertainty and model mismatch. The earlier bandit replication remains labelled legacy; selected bandit mathematics is linked through v2 P04.
- Both routes contain exactly **523 × 240-minute weekday sessions**, not additive assignments. Projects, readings, exams and repair use those blocks. Weekends are free. No required paid book, dataset, certificate, API, cloud compute or GPU is used.

Start with the [audit](docs/math-curriculum-audit.md), [specification](docs/math-curriculum-spec.md), [complete dated schedule and coverage](docs/math-curriculum-schedule.md), [migration](docs/math-curriculum-migration.md), and [current validation evidence](docs/math-curriculum-validation.md). The manifest is [data/math-v2/manifest.json](data/math-v2/manifest.json). Brownian motion/Itô/pricing, stochastic control/execution and deeper learning theory remain explicitly bounded extensions.

## Learning experience

- Three animated portals: Daily, Projects, Resources. Hovered objects jump out, land, then dissolve. Reduced-motion preferences disable these effects.
- A monthly calendar covering **7 October 2026–6 October 2028**: 731 days, 523 four-hour study sessions and 208 weekend rest days.
- Self-contained bilingual daily lessons, four study blocks, at least three problems per study day and hidden model answers. In v2, source consultation is classified as assigned or reference and always fits the reading block.
- Pop-art outlines and hard cel shadows with a warm paper, steel-blue, sage and ochre reading palette. Sticky lesson navigation and a focus mode reduce the amount of context shown at once.
- V2 practice has only the problem and show/hide solution. Existing local drafts are preserved; legacy workspaces remain accessible. Assessment criteria stay on the syllabus. Historical v1 coverage was 523 exercises, 1,614 stages and 182 numeric checks; those are legacy counts, not v2 quotas or proof-validation evidence.
- Legacy figures retain their original exercise-specific fixtures. They are not attached to newly authored v2 problems. V2's numeric checks are selected exact values from its own solutions; plots and simulations are not proofs of convexity, a CLT or calibration.
- Five project quest lines and a free-resource library of book covers, research scrolls and video cassettes.
- The 899 imported Markdown notes retain checklists, links, wikilinks, callouts, code, tables, math and note embeds in the labelled legacy view.
- Search, Markdown downloads, owner study logs and revision-checked Markdown editing. Both languages share progress.

This is a structured learning curriculum, not an academic qualification. It does not claim that completing a fixed number of hours is equivalent to a PhD.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Reading the published curriculum works without credentials. MongoDB is required for progress and Markdown overrides; GitHub OAuth is required to edit. Missing storage produces an explicit sync error rather than a false success.

See [backend setup](docs/backend.md) for environment variables and API contracts. Set `APP_URL` to the exact local/deployed origin and register `<APP_URL>/api/auth/callback` with the GitHub OAuth App. A separate OAuth App is convenient for local development.

Production credentials belong in Vercel environment variables. Never add `NEXT_PUBLIC_` to any secret. The database user should have `readWrite` only on `and_i_wonder`.

## Validation

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm start
npm run test:e2e
```

Use `TEST_BASE_URL` to test another local port or a deployment. Browser tests cover English/Vietnamese persistence, portal navigation, month navigation, lesson answers, read-only guest controls, search, library destinations, responsive widths and rollback after a failed owner save. The failed-save test uses an explicit mock; it is not evidence of a live MongoDB write.

For this local upgrade, tests use only localhost with `MONGODB_URI` unset/empty and `APP_URL` set to that localhost origin. Do not target production to validate a curriculum change. Latest local refinement (2026-10-10): all 543 original exercises have applications and ≥3 method steps; all 523 sessions have three distinct problems (1,569 assignments, including review). Build/typecheck and 57 unit checks passed. Browser results and selector repairs are in the validation report. See [the UI refinement audit](docs/study-ui-refinement.md).

## Deterministic mathematics authoring

Canonical v2 content lives in `content/math-v2/` with the schema in `lib/math-curriculum-types.ts`. Four author files contain original lessons and assessments; four teaching maps add individual applications, formulas and methods. lib/math-practice-plan.ts schedules three distinct problems per day, including labelled retrieval practice. The build derives dated sessions, content hashes, task IDs, exercise revision keys, source records and coverage; runtime renders the derived curriculum.

```sh
npm run curriculum:build
npm run curriculum:docs
npm run curriculum:audit
```

Unchanged authored inputs produce byte-identical outputs. The manifest records file ownership. `scripts/archive-math-v1.mjs` created an immutable 28-file snapshot and refuses to overwrite it; it is not a routine regeneration step. The audit generator preserves full baseline evidence for all 523 sessions and combines the authored module judgements.

The old `correct-foundation-answers`, `build-exercise-checkpoints`, `author-*` and Obsidian import scripts target v1. They do **not** regenerate v2 and must not be run as v2 correction steps. See [migration](docs/math-curriculum-migration.md) before changing legacy content.

## Content and progress

`data/notes.json` is the curated Obsidian import. `scripts/import_obsidian.py` reads only the chosen Road to Quant folder and never modifies the vault. Check its command-line help before reimporting. Imported translations preserve original wiki targets and checkbox order.

Legacy lesson modules remain in `data/lessons-*.json` and resolve through `lib/lessons.ts`. V2 resolves from `data/math-v2/curriculum.json` through `lib/math-curriculum.ts`. Both preserve Wednesday, Thursday, Friday, Monday, Tuesday programme-week ordering; week 105 has three sessions.

Original Markdown task IDs use `<noteId>::0`, `::1`, etc.; **v1** lesson agenda IDs remain `<noteId>::lesson0` through `::lesson3`. V2 uses canonical `<sessionId>@<contentHash>::block0…3`, a separate `math_progress_v2` collection and `/api/math-progress`. Main/foundation route completion is distinct. Retired v2 workbench drafts remain in their `math-v2.0` namespace with revision hashes; the simplified reader does not read or delete them. Old completion, Markdown overrides and draft matches never become evidence that the new content was completed. Public progress omits private owner evidence.

Progress and note overrides are stored in MongoDB. This is an import/export workflow: browser changes do not automatically write into the local Obsidian vault. Obsidian community plugins are not executed in the browser; the roadmap's `.base` dashboard links to the web calendar.

Five original project illustrations are in public/quests. Portal illustrations and rolled scrolls use SVG/CSS compositions. Book thumbnails reproduce covers or first pages from the linked official sources; provenance and capture metadata are recorded in `data/resource-covers.json`. The library links to free official resources and does not bundle full third-party PDFs.

See [the historical UI/learning audit](docs/ux-learning-audit.md) for the earlier visual redesign. `data/project-guides.json` supplies the preserved legacy briefs; `lib/math-project-guides.ts` supplies v2's mathematical acceptance criteria and exact fixtures. Historical checks in older docs are not current v2 validation results.

## Deployment

The Vercel project is `and-i-wonder`. The GitHub repository is `dakiemdarktharr/And_I_Wonder`. Production uses the custom Vercel subdomain above because the shorter `and-i-wonder.vercel.app` name was already taken.

After changing environment variables, deploy again for the new values to take effect. Production sign-in should be tested at the canonical production URL, which must also match the OAuth callback configuration.
