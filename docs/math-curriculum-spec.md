# Mathematics curriculum v2 specification

## Target and bounds

Target: **selected early-graduate mathematical coursework competence**, followed by statistical learning/sequential-inference depth. Robotics, C++ and agent workflows do not establish calculus or proof readiness. This is a syllabus and self-assessment instrument, not a claim that its author or learner has passed a university qualifying examination. Independent mathematical review is not yet supplied.

Observable outcomes: prove conditional identities/convergence under stated hypotheses; derive estimator distributions, duals and algorithm bounds; construct counterexamples; bound approximation/estimation/optimization or regret terms; diagnose numerical conditioning, dependence and future-information errors. A computed number or keyword cannot establish a proof.

## Fixed time model

7 October 2026 through 6 October 2028, inclusive: 731 dates, 523 study sessions, 208 weekend rest dates, 125,520 minutes = 2,092 hours. Programme weeks are Wednesday–Tuesday, with Wednesday/Thursday/Friday/Monday/Tuesday sessions. Week 105 has three sessions. Main and foundation routes each independently satisfy this budget; they are alternatives and must not be summed.

Default study allocation: 60 minutes definitions/proof reading; 100 minutes independent problems; 50 minutes derivation, exact checks or appropriate numerics; 30 minutes retrieval/error repair. A simulation is not compulsory every day. Assessment sessions replace these blocks; final exams use 15 minutes setup + 180 attempt + 15 rubric comparison + 30 error log. Source consultation fits the reading block. No unlisted required problem sets, project hours or weekend catch-up are implied.

## Sequence and source benchmark

| Weeks | Outcomes and level | Primary scope benchmark |
|---|---|---|
| 1–4 | Diagnose proof/calculus/linear-algebra gaps; repair quantifiers and scientific-computing assumptions. Foundation. | Hammack *Book of Proof* Ch.1–5; MIT 18.01SC/18.02SC selected material |
| 5–16 | Prove projection/spectral/compactness results, derive multivariate Taylor and Jacobian calculations, distinguish pointwise/uniform limits. Foundation to upper undergraduate. | MIT 18.06SC resource index; MIT 18.100A Fall 2020 notes/readings |
| 17–28 | Derive elementary probability/statistical results and justify the probability-to-inference bridge. Upper undergraduate / graduate bridge. | MIT 6.041SC and MIT 18.05 selected readings |
| 29–44 | Measure expectation, limit interchange, CE uniqueness/projection, convergence/UI, selected LLN/CLT, finite Markov and martingale arguments. Selected graduate core. | [MIT 6.436J Fall 2018](https://ocw.mit.edu/courses/6-436j-fundamentals-of-probability-fall-2018/pages/lecture-notes/), lectures 1–26 as specified per theorem; public assignments/exams are benchmarks, not extra assigned hours |
| 45–60 | Sufficiency/testing, regularity, argmax consistency, M-estimation/delta/sandwich, selected nonparametric/high-dimensional arguments. Selected graduate core. | [CMU 36-705](https://stat.cmu.edu/~siva/teaching/705/), individual lectures 8–36 cited per unit; not the complete statistics PhD core |
| 61–72 | Derive dual/KKT/prox and convergence bounds; diagnose conditioning and stopping certificates. Graduate core selection. | [Boyd & Vandenberghe](https://web.stanford.edu/~boyd/cvxbook/), exact chapters/sections in source manifest |
| 73–84 | Derive dependence variance/HAC, distinguish stationarity and CLT assumptions, matrix Kalman/filter/smoother reasoning. Graduate bridge/core selection. | Official time-series notes plus Särkkä author-hosted filtering text, exact sections in manifest |
| 85–96 | Prove finite-class/selected complexity bounds, OGD and selected UCB arguments; distinguish partial feedback. Graduate core / selected specialization. | Official learning notes, OCO and *Bandit Algorithms* references in manifest |
| 97–104 | Mathematical state-space capstone, four-part exams A/B, scheduled repair and proof reconstruction. | Original problems mapped to probability/inference/optimization/filtering results already taught |
| 105 | Three reconstruction/handoff sessions with unresolved outcomes explicitly retained. | Original proof/rubric evidence; no certificate |

`data/math-v2/manifest.json` is the exhaustive machine-readable mapping: every source/version/access record, week, theorem ID/status, exercise/revision, all 523 dated sessions and four minute allocations, year totals, prerequisite graph via curriculum, and coverage evidence. The companion generated `docs/math-curriculum-schedule.md` is the human-readable full mapping. This table is a phase outline, not a substitute for those mappings.

The primary lesson is original self-contained text. Linked readings are section-specific verification/further explanation; no solution requires purchase or opening an unavailable page. Where a theorem is deliberately assumed (for example a named limit theorem or Radon–Nikodym existence), that status is visible beside the theorem and source. Applications still require proofs. The coverage ledger distinguishes **taught**, **introduced**, and **deferred**; a sourced black box is not a claimed full proof.

## Prerequisites and assessment

Each week has explicit earlier-week prerequisites; validation rejects a future/self edge, guaranteeing an acyclic week graph. Sessions refer to exact theorem/exercise IDs. Mathematical review separately checks conceptual dependencies; a graph test alone cannot recognize an unintroduced concept hidden in prose.

Diagnostic W1; foundations gate W16; probability W44; inference W60; optimization W72; dependence W84; cumulative learning synthesis W96; final A W99 and B W101. Each gate has actual problems, solutions, rubrics and remediation, not only a title. Gate A/B choices in a session replace one another; retest/reconstruction sessions use existing time. Gate numerical thresholds are programme planning criteria with critical-competency floors, not official examination equivalence. Final parts each require at least 7/10 and no unresolved critical error; the floor prevents one domain from compensating for a missing proof domain.

At least two scheduled proof/derivation exercises and one transfer/counterexample appear in every graduate week. Reconstruction problems have `practiceOrigin`; counts of exercise records must not be advertised as counts of unseen problems. Final A/B are genuinely different: CE/UI versus stopping/non-UI; ratio estimation versus endpoint/quasi-likelihood; dual/GD versus OGD/generalization; overlap/Kalman versus smoothing/nonergodicity.

Self-exams are closed-book/no-AI attempts. Learning material and solutions are initially collapsed on assessment days. The client still receives answers, so this is not secure proctoring. All proofs use manual stepwise comparison; automatic numeric checks certify only a selected arithmetic value. External review remains pending rather than fabricated.

## Foundation replacement route

If diagnostic repair and the foundation gate remain weak, use a slower alternative before graduate material:

| Calendar weeks | Authored content used |
|---|---|
| 1–16 | Main foundations/diagnostic sequence |
| 17–28 | Reconstruct W5–16; target first failed implications |
| 29–40 | Main W17–28 probability/statistics bridge |
| 41–56 | Main W29–44 probability/processes |
| 57–72 | Main W45–60 inference |
| 73–84 | Main W61–72 optimization/numerics |
| 85–96 | Main W73–84 dependence/filtering |
| 97–100 | Capstones W97–98, Final A99 and repair100 |
| 101–102 | Capstone102 and reconstruction104 |
| 103–104 | Repeat repair100 and capstone98 |
| 105 | First three conditional-projection reconstruction tasks from W97 |

Main W85–96 learning/bandit depth, OGD portion of final B and the full default final-B standard are **deferred beyond two years** on this route. Do not claim they were learned. A weak foundation can require even more time; then reduce scope again. No 24-month plan guarantees an unknown starting point will pass. The reader exposes the source week as well as calendar week; route progress has a separate namespace.

## Mathematical projects and specialization

P01 stable projection/least squares; P02 estimating equations and sandwich; P03 dependent paired loss; P04 learning bounds/partial feedback; P05 sequential-inference capstone. Their work is the corresponding scheduled proof/numerical blocks. P04's old agent-workbench identity and P05's old Thompson-sampling replication remain labelled legacy. Bandit mathematics is now a selected linked unit, not silently treated as the same as financial time-series inference.

Brownian motion, Itô/SDEs, Girsanov, no-arbitrage/pricing/PDEs are a derivatives extension after graduate probability. Point processes/intensities, stochastic control/DP/HJB and execution models form a different extension. Dynamic regret and deeper Thompson-sampling guarantees are elective/assumed only as recorded. No one must study all quant specializations to pass the default statistical-learning track.

## Authoring quality contract

Each weekly reading contains domain/notation, a theorem/derivation with hypotheses and proof status, worked example, failure case, specific exercises with progressive skills, staged hints, original solutions, rubric and error checklist. Several sessions deliberately revisit a shared theorem through different problems; the weekly theorem is not passed off as five different new theorems. Sources support the exact topic. The calendar and UI select actual authored tasks, never a title-only “graduate” placeholder.

`npm run curriculum:build` deterministically builds content, hashes and manifests. Legacy patch scripts are not v2 commands. See migration and validation documents for data isolation and evidence limits.

## Daily practice refinement — 10 October 2026

Four canonical *-teaching.ts maps cover every original ID with bilingual application/formula and at least three specific method steps. The builder merges them before hashing. lib/math-practice-plan.ts schedules three distinct prompts per session, including A/B and foundation alternatives, in existing blocks. There are 543 original records and 1,087 retrieval copies (1,630 total), giving 1,569 main-route assignments. Copies are not unseen graduate problems. Practice shows only prompt and a solution disclosure; canonical rubrics and gate rules remain in the syllabus. Previous local drafts remain untouched.

## Daily teaching superseding the earlier retrieval schedule — 2026-10-10

One distinct main-route primary focus per day; four staged tasks (concept, derivation, application, error analysis); 20 replacement topics. The main lesson shows application, general formula and concrete steps; chapter definitions/proofs are optional reference. A/B records remain historical assessment material rather than scheduled daily forms. The optional foundation route intentionally reconstructs prior learning. Read daily-learning-update.md for actual authorship counts and resource access policy. All live source readers must pass the exact URL access list; an unknown URL is withheld.
