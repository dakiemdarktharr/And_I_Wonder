# Mathematics v2 validation — historical local review

This document preserves the earlier 2026-10-09 math-only review. Its baseline checks and counts are historical; they do not cover the 2026-10-10 dual-track research changes below.

Baseline: `47e38bf5f510b92c9987b4be2e88c37e6ad5e3f8`. Branch: `codex/math-curriculum-v2`. The validation below concerns this local change. It is not a production deployment, database migration, independent academic examination or certification of the learner.

## Validation state

Local implementation and required technical checks completed on 2026-10-09. Canonical version: math-v2.0; source SHA-256: 8bae1146774a3a80ca48f2dbfeac1f4cbb401f1da35dda370e376409aa70f9a1. No push, merge, deploy, production database write/migration or credential change was performed. External academic review and live storage verification are not part of this local acceptance.

The delivered data has 105 modules, 523 sessions, 731 dates, 208 rest dates and 125,520 minutes. Study years contain 62,640 and 62,880 minutes (1,044 and 1,048 hours). There are 543 exercise records, 521 distinct exercises selected by the default schedule, 18 explicitly labelled reconstruction records, and six selected numeric checkpoints. Alternative forms and repeated questions explain why these numbers differ; none is a count of independently verified unseen graduate problems.

The manifest records 106 theorem/derivation entries: 89 labelled proved, 11 sketches and six assumed results. These are authored proof-status labels, not an external quality certification. There are 27 versioned primary-source records. Default-scheduled skill tags include 222 proof, 197 derivation, 128 counterexample and 149 transfer records; tags overlap and cannot be summed.

## Review method and limits

The baseline evidence ledger retains every legacy session's actual theory, worked example, prompt and model answer, alongside source file and index. Module judgements classify the work demanded by those questions rather than trusting their titles. This is a judgement of curriculum evidence, not of the learner.

Internal mathematical review used two distinct activities:

- Read the written hypothesis-to-conclusion argument and try to invalidate missing assumptions or constants. Read-only cross-reviews of foundations, probability/inference, dependence and final assessment are preserved in the audit parts. The authors repaired their own content; the integrator checked the repairs. These are internal agent reviews, not independent external faculty review.
- Recompute selected exact fixtures without parsing the model answer as an oracle: matrix/Joseph covariance, negative-AR covariance summation, wrong-noise MSE on independent finite support, a spike sequence, overlapping windows and optional stopping. These tests establish those identities and boundary cases, not the universal correctness of every proof or a graduate qualification.

Examples of substantive issues found and repaired during this process include the endpoint of a pointwise spike counterexample; permutation enumeration; a multivariate estimating-equation expansion requiring an integral Jacobian; discrete versus continuous randomized ranks; KDE isotropy/tail assumptions and its Gaussian variance constant; known-mean versus sample-centered covariance rank; and a BH rejection rank. Final-exam review tightened both tails of CE uniqueness, covariance dimensions, observability nondegeneracy, critical-error scoring and the distinction between four exam parts and a fifth review day.

The optimization/dependence/learning review additionally checks the UCB upper-confidence ordering, Rademacher sign enumeration, empirical versus population optimization error, zero long-run variance, explicit HAC/bootstrap hypotheses, sensor bias absorbed by a latent level, and the difference between marginal PIT calibration and independence. The detailed closure is recorded in the optimization audit part. HAC and growing-block bootstrap are now proved for explicit bounded stationary fixed-m dependence, with L³/n→0 and b³/n→0 respectively; the bootstrap proof includes conditional characteristic functions and edge-centering. The general mixing CLT remains a precisely stated assumed result. W72 has disjoint multipart forms with critical rows for all three competencies; W84 now includes inference and counterexamples in both forms.

## Automated coverage

Content tests validate both alternative calendars, every session's four-block budget, earlier prerequisites and route ordering, resolved theorem/exercise/source/assessment references, scheduled proof/transfer coverage, immutable archive hashes, populated bilingual fields and KaTeX parsing. Formula multiset comparison on the final assessment allows Vietnamese word order while preserving mathematical expressions and multiplicities. Structural checks alone cannot rate academic depth.

Product tests cover default v2 and explicit v1 access, old completion/draft isolation, main/foundation route isolation, form A/B draft separation, reload and language persistence, reset scope, selected numeric checks, Markdown export, public search and project access, guest write denial, failure rollback, keyboard disclosures and desktop/mobile formula layout. Failed-save tests mock the browser response and do not prove a live MongoDB write.

The local server is explicitly started with an empty `MONGODB_URI` and a localhost `APP_URL`. Missing-storage responses are expected in unmocked reads. No production credentials are changed and no production storage is contacted by these tests.

## Commands and interim findings

- `npm ci --no-audit --no-fund`: first sandbox attempt failed DNS resolution for the npm registry. The authorized network retry installed 179 locked packages successfully; npm reported an unapproved esbuild postinstall script. Subsequent actual compile/test results, rather than the install message alone, determine usability.
- `npx playwright install chromium`: sandbox CDN DNS failed; the authorized retry succeeded using the host browser cache.
- Initial TypeScript check passed before later content refinements; a later check caught an in-progress `MathWeek.topic` typo in the optimization author file, sent to its owner.
- Initial unit suite: 51/54 passed. Failures identified scheduled transfer coverage at W72, literal backspace escapes in probability text, and a bilingual formula test that incorrectly required identical language word order. Control escapes were repaired; the formula comparison now checks equal multisets. The targeted KaTeX/formula rerun passed 2/2.
- Initial v2 browser run: 9/14 passed. Four failures came from exact test link names omitting the visible arrow; one exposed search-result navigation during dialog removal. Link selectors and explicit router navigation were repaired. The targeted rerun passed 6/6 desktop/mobile cases.
- The additional mathematical layout/keyboard run passed 10/10 cases at W15, W31, W50, W71 and W99, in both languages across desktop and mobile.

## Final command results

| Command/check | Actual result |
|---|---|
| npm run curriculum:build | Passed: 105 modules, 523 sessions, 543 records, 125,520 minutes; rejects unresolved IDs, unscheduled exercises and invalid numeric checkpoints. |
| npm run curriculum:docs | Passed: complete main and foundation schedules, theorem/prerequisite/source map, coverage and skill accounting. |
| npm run curriculum:audit | Passed: all 105 module judgements and 523 exact bilingual baseline session records; validates exact legacy titles and prerequisites in the author audit parts. |
| npm run typecheck | Passed on the final authored/generated content. |
| npm test | **56 passed; zero failed/skipped**, including legacy regressions, v2 route/version/privacy/export checks, all authored formula parsing and independent exact fixtures. |
| npm run build | Passed with webpack; compiled, TypeScript checked, nine static pages generated and dynamic routes traced. |
| npm start | Production build started on localhost:3000 with empty MONGODB_URI and local APP_URL. |
| npm run test:e2e | **49 passed, one intentional skip, zero failed** in 27.2 seconds, across desktop and Pixel 7 emulation. All 24 v2 cases passed. The skipped mobile hover test is desktop-only; mobile navigation and reduced motion passed separately. |
| Full deterministic regeneration | All six curriculum, manifest, schedule, combined audit, late audit and baseline evidence outputs were byte-identical by SHA-256 after rerunning all three authoring commands. |
| Immutable legacy snapshot | All 28 archived files match their recorded hashes; original archived data files still match the same hashes (unit test). |
| git diff --check | Passed; Git only reported normal LF/CRLF conversion notices. |

The first final browser-suite invocation inside the restricted sandbox reported 50 failures before useful application assertions: Chromium was installed in the host cache rather than the sandbox cache, and localhost API calls were denied with EACCES. The authorized host-context rerun used the same tests and local production build and produced the 49-pass/one-skip result above. These were environment failures, not hidden skipped tests.

Next.js warned that a package-lock.json outside the repository was ignored. It did not change the repository lockfile or prevent compilation. Playwright emitted NO_COLOR/FORCE_COLOR console notices. Neither was treated as an application defect.

After the successful suites, only documentation changed; deterministic regeneration confirmed the served curriculum bytes did not change. No additional full-suite rerun was necessary.

## Remaining educational boundaries

The core uses complete original proofs for selected results and explicitly labels technical black boxes, including the scope of Radon–Nikodym existence and selected limit theorems. It does not claim all variants of LLN/CLT, all empirical-process theory or a complete PhD statistics core. Time-series asymptotics must be read with their stated dependence conditions; a financial series is not automatically inside those assumptions.

The main route includes selected learning/bandit depth; the slower route defers it and final form B. Derivatives/pricing and microstructure/execution are different post-core extensions, not hidden weekend requirements. Two years at 20 hours/week cannot guarantee that an unverified starting point passes the gates. Repeated reconstruction tasks are labelled and are not counted as unseen transfer tests.

Local self-assessment asks for closed-book/no-AI attempts and manual rubrics. Client-delivered solutions are not secure proctoring. External mathematical review and authentic learner performance remain unverified. No email, mentor contact or review event has been fabricated.

## 10 October 2026 refinement — current results

The latest source hash is c6d96e1b443b30559cabf524408cb3ef0c5b3ec52346fb02fca1c7a96460e275. The tables above describe the prior 9 October implementation, before practice and UI simplification.

- Generation: 105 modules, 523 sessions, 1,630 records, 125,520 minutes. Four checked teaching maps cover all 543 original exercises. Every main/repair session and A/B alternative contains three distinct problem identities; a reconstruction and its original cannot count as two problems in the same session. There are 1,569 main-route assignments, including retrieval.
- Full unit run: 57/57 passed. After the sampled-review formula/assumption corrections, all 9 mathematics cases were rerun and passed, including full KaTeX parsing, exact final bilingual formula parity, three-problem coverage, legacy hashes, progress/privacy and clean exports.
- Typecheck and production webpack build passed. Build was repeated successfully after the final library/title/calendar adjustments. MongoDB was disabled throughout.
- Full browser run: 49 passed, 2 failed, 1 intentionally skipped. Both failures were stale test selectors for the removed slogan “One day. One step.”; the heading is now “Study calendar”. Updating those selectors and rerunning the two cases produced 2/2 passes.
- A subsequent targeted run of all affected portal, quest, resource-filter and real-cover cases passed 8/8 after the final resource classification and calendar copy edits. In aggregate, all 51 runnable cases were verified passing; no fresh full-suite run after the targeted fixes is claimed. The remaining mobile-hover case is intentionally desktop-only.
- New browser assertions: three problems and three individual methods; prompt plus one solution toggle; no workbench; old v1/v2 localStorage fixtures remain; no A/B solution leak; versioned Markdown has applications/formulas and hidden solutions without hints/rubric/checklists; five distinct quest images; resource page opens directly on the shelves. Both languages and keyboard activation tested.
- Six generated outputs reproduced byte-for-byte after final regeneration. The immutable 28-file v1 archive remains unchanged. Git diff whitespace check passed with normal LF/CRLF notices.
- Browser visual inspection: project text readable over individual scenes; resources begin with filter/search/shelves; daily practice visibly contains just application, question and solution control. Saved previews are in ignored private/ for local review.

The existing draft/workbench data is preserved rather than migrated or deleted. New practice does not read it. Academic rubrics remain in canonical content and the syllabus, not as daily interface clutter. Retrieval counts do not claim new unseen graduate exercises or academic equivalence.



## 2026-10-10 dual-track self-study revision

This overlay supersedes historical claims above wherever daily time blocks, current project names, assessment pages or coverage are concerned. It does not rewrite the historical review.

- The path now names low-frequency statistical/ML alpha and European options as bounded goals. It separates lesson progress, numerical fixtures, self-assessment and independent verification, which remains unverified. The 16-item placement threshold is provisional and has no student calibration.
- Main-route time is now 50 + 90 + 90 + 10 minutes: 1,307.5 planned hours in math/problems/review and 784.5 in software, data and derivatives. The five projects define free data/code artifacts, costs, leakage checks, a frozen self-study plan and the limits on each artifact. Foundation repair uses this same fixed daily budget and may extend the finish date.
- A browser lab loads the public, revised Kenneth French monthly factor file, records source/checksum and labels its point-in-time limitation. A derivatives lab includes price, tree, Monte Carlo and hedge-ledger controls. A downloadable standard-library Python starter creates manifests and tabular outputs.
- Five learner-authored checkpoints capture responses before showing rubrics; the derivatives course has eight self-study units with four exercises each and declares what is proved, assumed or deferred. Automated fixtures are numerical spot checks, not proof grades or evidence of independent review.
- 70/70 unit tests passed, including new research scheduling, numeric placement gating, record validation, KaTeX rendering, BS benchmark/finite-difference Greeks, tree convergence, Monte Carlo consistency, hedge cash accounting, future-data leakage, transaction costs and CSV parsing. `npm run typecheck` passed. `npm run build` completed successfully. No user logins, Mongo writes or production credential changes occurred.
- End-to-end fetch of the Ken French ZIP was not run from this workstation because outbound DNS was unavailable; its authorized network-download attempt was interrupted. The production data route has a timeout, size bound and explicit unavailable response, and never substitutes synthetic returns. No live production data fetch has been verified.
- No independent academic review or real-learner outcome study is claimed. Automated tests verify their named fixtures and invariants only.
