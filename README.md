# And I Wonder

A Vietnamese/English quant learning studio, built from the **Road to Quant** Obsidian curriculum. **Mathematics v2 is the default curriculum.** Public visitors can read; the configured GitHub owner can save progress and edit the original legacy Markdown notes.

Production address: **https://and-i-wonder-quant.vercel.app**. Completed changes are checked, committed and pushed to `main`, then deployed to the Vercel project `and-i-wonder` under the user's standing release authorization.

## The two-year self-study path

The program now targets two applied research areas: **low-frequency statistical/ML alpha** and **single-asset European derivatives pricing and hedging**. It is a free, bilingual self-study path for rigorous mathematics, research code and a reproducible portfolio. Finishing 523 sessions, passing self-set cutoffs or publishing a repository does **not** demonstrate PhD-level research, original results, job readiness or independent examination. Every self-assessed proof, research claim and defence is labelled unverified by an independent reviewer. No independent learner study has yet validated the diagnostic or instructional outcomes.

The mathematics syllabus records whether material is fully taught within a stated case, introduced, assumed, a proof sketch or deferred. “Graduate” describes some topic difficulty, not the learner's credential or a completed graduate qualification. The path is not equivalent to university doctoral training: real doctoral programs include graded graduate courses, supervised research, written reports, committee questioning and a dissertation.

- `/daily` and dated daily pages default to v2. `?curriculum=v1` opens the preserved curriculum; `?curriculum=v2&route=foundation` selects the replacement foundation schedule.
- `/path` lets a new learner start on session one, choose a device-local five-day calendar and take a provisional 16-question foundations diagnostic. Each prerequisite domain must meet its own threshold, including its critical item. The cutoffs have not been calibrated against student data, and numeric questions do not certify proof skills. Optional diagnostic sync and the research portfolio use the owner's private MongoDB record; guests keep a local draft and can export it.
- `/mathematics` lists every week, prerequisites, sessions and depth boundaries. “Taught”, “introduced”, “assumed”, “proof sketch” and “deferred” have distinct meanings.
- Lessons include self-contained bilingual definitions, theorem hypotheses, proofs, individual applications, general formulas, step-by-step methods, original solutions and section-specific free sources. A week revisits its theorems through distinct daily tasks.
- `/assessment` captures a proof/research attempt before revealing the rubric, rotates A/B numerical fixtures and exports a self-review record. It is explicitly neither a secure, standardized exam nor independent grading. Numeric checks can catch an arithmetic error; they cannot certify a proof, novelty, or understanding.
- Each 240-minute main-route session uses 50 minutes for theory, 90 minutes for the four daily exercises, 90 minutes for a research-code project, and 10 minutes to record results. When foundation repair is needed, use project time and extend the calendar rather than pretending that every learner fits one two-year deadline.
- `/lab` fetches the free Ken French monthly factor file with provenance and a SHA-256 digest. A chronological ridge/backtest lab exposes train/validation/test splits, turnover costs, a negative-control workflow and paired block uncertainty. It uses **revised aggregate factors**, not original point-in-time individual stock data. P02/P03 cannot establish executable stock alpha.
- P01–P05 now form a practical project sequence: numerics and reproducibility; a cost-aware market-data baseline; an ML extension with a frozen evaluation plan; option pricing and hedge ledgers; and an independently formulated research question. A negative finding is acceptable. The Python starter at `/research-kit/research.py` uses only the standard library, writes a manifest, trials and returns, and can be rerun locally. GitHub publication is performed by the learner when their repo is ready.
- `/derivatives` contains eight bilingual units with derivations, scope labels and four exercises per unit. `/lab` plots Black–Scholes sensitivities, CRR tree prices, antithetic Monte Carlo intervals and a self-financing discrete hedge ledger. The included model omits dividends, jumps, stochastic volatility, rates and trading liquidity. General Girsanov, exotic pricing and HJB/execution are not mastered.
- The five-stage target is deliberately bounded: complete the specified math and code; pass only the explicitly described fixtures; package reproducible artifacts; formulate one falsifiable extension; document the negative controls and evidence limits. The capability still requiring independent review is marked **unverified** rather than inferred from hours, checked boxes, green test results, self-grading or backtest PnL.
- Both routes contain exactly **523 × 240-minute weekday sessions**, not additive assignments. Projects, readings, exams and repair use those blocks. Weekends are free. No required paid book, dataset, certificate, API, cloud compute or GPU is used.

Design sources and the issue-by-issue response are documented in [research standards and evidence limits](docs/research-standards.md).

Start with the [research standards](docs/research-standards.md), [audit](docs/math-curriculum-audit.md), [specification](docs/math-curriculum-spec.md), [complete dated schedule and coverage](docs/math-curriculum-schedule.md), [migration](docs/math-curriculum-migration.md), and [current validation evidence](docs/math-curriculum-validation.md). The manifest is [data/math-v2/manifest.json](data/math-v2/manifest.json).

## Learning experience

- Three animated portals: Daily, Projects, Resources. Hovered objects jump out, land, then dissolve. Reduced-motion preferences disable these effects.
- A monthly calendar covering **7 October 2026–6 October 2028**: 731 days, 523 four-hour study sessions and 208 weekend rest days.
- Self-contained bilingual daily lessons, four study blocks, four staged problems per study day and hidden model answers. Lessons are self-contained. The active resource library uses reviewed full free online readers; unverified destinations are omitted.
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

For this local upgrade, tests use only localhost with `MONGODB_URI` unset/empty and `APP_URL` set to that localhost origin. Do not target production to validate a curriculum change. Latest local refinement (2026-10-10): all 543 original exercises have applications and ≥3 method steps; all 523 main-route sessions now have a distinct primary focus and four staged problems (2,092 assignments; no retrieval padding). Build/typecheck and test results are recorded in the validation report. Browser results and selector repairs are in the validation report. See [the UI refinement audit](docs/study-ui-refinement.md).

## Deterministic mathematics authoring

Canonical v2 content lives in `content/math-v2/` with the schema in `lib/math-curriculum-types.ts`. Four author files contain original lessons and assessments; four teaching maps add individual applications, formulas and methods. lib/math-practice-plan.ts schedules one primary lesson and four contextual tasks per day. Twenty new mathematical extensions replace repeated main-route sessions. The optional foundation repair route deliberately reconstructs prior work. The build derives dated sessions, content hashes, task IDs, exercise revision keys, source records and coverage; runtime renders the derived curriculum.

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
