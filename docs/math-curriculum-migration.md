# Mathematics v2 migration and rollback

This change is local. It does not migrate MongoDB, edit OAuth/environment variables, push Git, or deploy. Baseline: `47e38bf5f510b92c9987b4be2e88c37e6ad5e3f8`.

## Immutable evidence

`data/archive/curriculum-v1/manifest.json` records SHA-256 and byte length for 28 original content/schema/lab/export/authoring files. The archive is a readable snapshot, not executable application source (excluded from TypeScript compilation). The original six `data/lessons-*.json`, notes, translations, checkpoint and visual data remain the v1 source. `scripts/archive-math-v1.mjs` refuses to overwrite an existing manifest. Original Mongo note overrides and progress are untouched.

## Routes and interpretation

- `/daily` and `/daily/YYYY-MM-DD` default to mathematics v2. `?curriculum=v1` selects original lessons and Markdown with legacy labels. Previous/next links and imported wikilinks keep the v1 query.
- `/daily?curriculum=v2&route=foundation` is a replacement schedule with the same 523 sessions, not additional work. It inserts foundation repair before graduate material and defers learning/bandit depth and final B. Its progress is separate even on dates shared with the main route.
- `/mathematics` gives outcomes, prerequisite links, coverage, gates and dates. `/projects` defaults to mathematical portfolios; `?curriculum=v1` preserves the original project guides/notes.
- V2 search results precede clearly labelled legacy results. V2 resources share shelves with existing resources; section provenance remains in the manifest and daily source links.
- Original notes are reference material. Editing v1 Markdown does not change canonical v2 theorems or synchronize a local Obsidian vault. Revision-checked legacy editing remains at the v1 route.

## Progress: never carry a tick into different mathematics

Legacy `/api/progress`, collection `progress`, original numeric checkbox IDs and `lesson0`–`lesson3` retain their meanings. V2 uses `/api/math-progress`, collection `math_progress_v2`, version `math-v2.0`. Reads create no indexes; the unique index is created lazily only on an authorized future write.

V2 `noteId` is `<canonical-session-id>@<content-hash>`. A task ID must equal one of that session's four canonical `::block0`–`::block3` IDs. Validation rejects unknown versions, unknown/outdated revisions, old lesson IDs, arbitrary suffixes and Mongo path fragments before DB access. A changed week (including definitions, theorem hypotheses, questions or solutions) changes its session hash. Old documents can remain in storage but do not appear as completion for the new revision.

The main and foundation routes have different session IDs. `done` is an activity status, never an assessment pass. No score is inferred from checkboxes. A/B exercise answers use different IDs. Gate passing is manual, with rubric and critical-error rules.

Owner session and same-origin checks apply before every v2 write. Guest reads exclude private evidence; unknown document revisions are filtered. The reader updates saved progress only after a successful response, so failed writes leave the visible saved check state unchanged. Local edited evidence text can be retried but is not described as saved.

## Drafts, answers and figures

Legacy storage remains exactly `road-to-qr:answer-workbench:v1:<encoded-composite-key>`. V2 uses `road-to-qr:answer-workbench:math-v2.0:<encoded-id@revision-hash>`. The hash includes the exercise, its definitions and theorems, so changed mathematical context cannot silently attach an old numeric match. The simplified v2 reader no longer presents drafts, reset, hints or numeric-check workspaces. Previous localStorage keys remain untouched; legacy workspaces keep their original storage.

V2 solutions use the authored `solution` array behind one show/hide control. Numeric metadata remains authored but is not a practice control. Teaching maps provide individual applications/formulas/methods. Legacy checkpoint/lab catalogs are not merged into v2. No graph is attached by weekday alone. V2 currently prioritizes proofs and exact mathematical fixtures; legacy interactive illustrations stay attached only to their original problems. They are not evidence for a changed theorem.

## Authoring and overwrite controls

| Layer | Owner / files | Command / rule |
|---|---|---|
| Canonical v2 | Four lesson/assessment files and four teaching maps in `content/math-v2`; root-owned schema in `lib/math-curriculum-types.ts` | Edit authored text; preserve assumptions across languages; change revision for semantic changes |
| Derived v2 | `data/math-v2/curriculum.json`, `manifest.json` | `npm run curriculum:build`; deterministic sorted inputs; no manual patches |
| Mathematical project briefs | `lib/math-project-guides.ts` | Shared by project pages and public v2 search; original exact fixtures |
| Main/repair scheduling | `lib/math-foundation-route.ts`, `lib/math-practice-plan.ts`, builder | Exactly one selected route per date, 240 minutes on weekdays |
| Legacy import | `data/notes.json`, translations, `scripts/import_obsidian.py` | Frozen baseline for this upgrade; never import over v2 |
| Legacy answer patches | `correct-foundation-answers.mjs` | V1-only week semantics; does not apply to v2 |
| Legacy checkpoint/visual generators | `build-exercise-checkpoints.mjs`, `build-foundation-visuals.mjs` | V1-only output files; do not run as a v2 build step |
| Legacy authors | `author-research-lessons.mjs`, `author_rewritten_late.py`, `author_w77_93.py`, `author-87-93.mjs` | Write old lesson ranges, not `data/math-v2`; archived for provenance, not part of v2 generation |

Rollback for a future publication is a code revert or selecting `?curriculum=v1`; it does not require deleting new progress. Do not rewrite old draft keys or old `done` statuses. A future deliberate migration needs its own authorization and content-level mapping; matching a calendar date is not a valid mapping.

## 10 October 2026 refinement

Three distinct prompts per study day are validated on both routes and A/B alternatives. Retrieval copies have reviewKind=spaced and practiceOrigin; they are not unseen tasks. The original 543 records retain their identity and solutions. Enriched week hashes intentionally change completion revision; old ticks are not transferred. Total time remains 125,520 minutes. No prior draft or progress document is deleted.
