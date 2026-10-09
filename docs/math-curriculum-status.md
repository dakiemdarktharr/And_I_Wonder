# Mathematics curriculum v2 — local handoff status

Local implementation complete on 2026-10-10.

- Baseline: 47e38bf5f510b92c9987b4be2e88c37e6ad5e3f8; branch: codex/math-curriculum-v2.
- Source SHA-256: c6d96e1b443b30559cabf524408cb3ef0c5b3ec52346fb02fca1c7a96460e275.
- Calendar: 105 modules, 523 × 240-minute sessions, 208 rest days, 125,520 minutes. Both routes and A/B alternatives have at least three distinct problem identities per day.
- Content: 543 original exercises, all with individual bilingual application/formula and ≥3 method steps. 1,087 labelled retrieval copies yield 1,630 stored records and 1,569 main-route assignments. Copies are not unseen problems.
- Practice: prompt/application plus one show/hide solution; no hint, numeric checkpoint, draft/reset workspace, rubric or reasoning checklist beside the problem. Rubrics and gate rules remain canonical and on the syllabus. No existing localStorage data was deleted.
- UI: five illustrated project quests with a connected path; resource shelves open directly without version/source boilerplate; duplicated titles and URLs cleaned; calendar and Home slogans removed. See study-ui-refinement.md.
- Validation: production build/typecheck passed; 57 unit cases passed, then all 9 mathematics cases rerun after formula refinements. Browser suite: 49 passed / 2 obsolete-heading-selector failures / 1 mobile-hover skip; corrected two selectors passed 2/2. Final library/calendar refinements passed their affected 8 desktop/mobile cases. Thus all 51 runnable cases were verified passing; no full rerun is claimed after those targeted repairs. Six outputs reproduced byte-for-byte.
- V1: immutable 28-file snapshot verified; original content data unchanged. Old progress/drafts retain their meanings. Updated v2 completion remains revision-scoped.
- Mathematical review: internal authored review and sampled cross-review; no external reviewer or learner performance fabricated.
- Local only: no commit, push, merge, deploy, production DB access/migration or credential change. Local server uses empty MONGODB_URI. Authenticated live writes remain untested.

## Ownership

Root owns schema, generation/scheduling, archive, app/API, project/library design, docs and tests.
GPT-6 Luna xhigh authors own foundations, probability/inference, optimization/learning and assessment teaching maps. All maps are frozen and coverage-checked. Root integrates canonical text before hashing.

## Review

Open localhost:3000/projects for the illustrated questline, /resources for the shelves and /daily/2026-10-09?curriculum=v2#math-practice for the simplified practice. Source, specification, baseline audit, migration and validation reports remain in docs.

## GitHub handoff

On 2026-10-10 the user first authorized committing and pushing this implementation on branch codex/math-curriculum-v2, published as commit 3c3b028. They subsequently requested all completed changes be committed to main and deployed immediately after relevant checks. This standing authorization is recorded in AGENTS.md. The local-only statement above describes the implementation and validation phase before release authorization. No production database migration or credential change is included in this release.

