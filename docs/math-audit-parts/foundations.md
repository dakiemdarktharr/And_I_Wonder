# Foundations weeks 1–28: legacy audit

This audit covers the legacy curriculum in [`data/lessons-01-35.json`](../../data/lessons-01-35.json), weeks 1–28 inclusive. I inspected all 140 session objects. The evidence notation in each session is **T** (legacy theory), **E** (actual exercise prompt), and **Ans** (stored answer). Each old session supplies one prompt, one hint, four agenda actions, and a deliverable; agenda durations are not consistently specified. Unless a row says otherwise, assessment evidence is that single exercise/answer pair: no point rubric, score threshold, independent A/B form, or timed exam protocol is stored. This distinguishes an answer key from a scored assessment.

“Intended span” below is inferred from each old title, prerequisites, and objectives; the legacy schema does not assign a formal university level. “Observed” summarizes the actual five sessions, not the week title. “Decision” states the canonical replacement or deepening in `content/math-v2/foundations.ts`.

| Week | Intended span and observed content | Decision for the canonical curriculum |
|---|---|---|
| 1 — Diagnostic and numerical setup | Entry diagnostic spanning calculus, linear algebra, probability, proof, and code. The five sessions cover chain rule/finite differences, least squares/rank, Bayes, epsilon-N, and seeded Bernoulli simulation. Broad and useful, but not a scored A/B diagnostic. | Keep the breadth and repair routing; author distinct A/B forms and an explicitly non-pass/fail diagnostic blueprint. |
| 2 — Vectors and probability spaces | Introductory linear algebra and finite probability: span/basis, projection, dice-event algebra, weighted probability axioms, exact vs sampled loaded-die probability. | Keep; deepen with projection uniqueness, probability identities, counterexamples, and an exact/simulation boundary. |
| 3 — Matrices and conditioning | Row reduction, null space, diagonal condition number, class-table conditioning, sensitivity synthesis. | Keep; strengthen rank-nullity, condition-number assumptions, and proof/counterexample transfer. |
| 4 — Differentiation and Bayes | Gradient, chain rule, Hessian/eigenvalues, total probability, prevalence-sensitive Bayes. | Keep; add general-dimensional derivative statements, Taylor remainder, and local-extremum hypotheses. |
| 5 — Projection and least squares | Constant fit, QR, binomial calculations, residual orthogonality, mixed mini-project. | Keep; add general projection theorem, uniqueness conditions, rank-deficient and ill-conditioned boundaries. |
| 6 — Eigenvalues and distributions | Symmetric eigenpairs, normal standardization, exponential survival, covariance PSD, Gaussian covariance geometry. | Keep; state and prove the spectral theorem and expose PSD/quadratic-form hypotheses and dimensional scope. |
| 7 — SVD and expectation | Singular directions, truncation errors, linearity of expectation, zero-covariance dependence counterexample, covariance synthesis. | Keep; teach general SVD geometry and rank-k approximation with shape/rank conditions. |
| 8 — PCA and transformations | Variance maximization, triangle density, square-map density, polar Jacobian, rotated Gaussian. | Keep; state density-transform hypotheses (injectivity or branch splitting) and derive the multivariate Jacobian. |
| 9 — Proofs and convergence | Modular contrapositive, epsilon-N, monotone bounded sequence, Chebyshev/WLLN, simulation comparison. | Move proof language to weeks 1–3 and build real-analysis convergence before probability; retain WLLN after probability foundations. |
| 10 — Central limit theorem | Standard errors, binomial normal approximation, continuity correction, dependent variance, approximation audit; mostly applications, no CLT proof. | Put CLT after random variables/WLLN; state IID/moment conditions and honestly mark as assumed with exact source. |
| 11 — Monte Carlo uncertainty | Plug-in SE, Wald/Wilson interval, antithetic pair, control variate, efficiency comparison. | Preserve after probability/inference; teach expectation/variance first and state unbiasedness conditions. |
| 12 — Numerical foundations release | Floating-point tolerances, cancellation, summation, projection invariants, release audit. | Defer release practice to project work; retain numerical examples only when they teach conditioning/error. |
| 13 — Foundation assessment and publish | One underdetermined system/constant fit, one interval, one die simulation, unit-conversion slope, abstract. Despite assessment title, no scored exam form/rubric. | Replace with the Week 16 closed-book foundation gate; move publishing tasks outside the gate. |
| 14 — Financial returns and data contracts | Return arithmetic, risk-free alignment, publication timing, pipeline arithmetic and data audit. | Defer financial data contracts to applied study; use the canonical slot for calculus/analysis. |
| 15 — Likelihood and factor regressions | Gaussian MLE, factor regression, contemporaneous/predictive pairing, duplicate regressor, replication checks. | Move likelihood into the statistics bridge after sampling distributions; keep empirical protocol separate from theory. |
| 16 — Estimator bias and variance | Discrete bias, MSE decomposition, n vs n−1 variance, shrinkage, report. It is not a linear-algebra/calculus/analysis gate. | Replace with the required A/B foundation gate. Return to estimator theory after conditional expectation and inference. |
| 17 — Confidence intervals and coverage | Known/unknown variance intervals, repeated-sampling coverage, mean-vs-prediction interval, method audit. | Keep in the statistics bridge; distinguish sampling model and exact/asymptotic coverage. |
| 18 — Hypothesis testing and effect sizes | z test, CI/p relation, power, FWER, 40-test pipeline. | Keep; formalize rejection rules/null conditioning and prove the simple-vs-simple likelihood-ratio result. |
| 19 — Bootstrap and dependence | Tiny exact bootstrap, percentile intervals, circular blocks, block-length sensitivity, protocol. | Keep as a bridge; prove finite permutation validity and derive why IID resampling fails under serial dependence. |
| 20 — Residual diagnostics and robust errors | Residual geometry, HC0, Bartlett HAC, quadratic misspecification, interval comparison. | Keep relevant model-based ideas after likelihood/testing; separate robust covariance from model correctness. |
| 21 — Regularization and covariance | Ridge, unit scaling, validation MSE, covariance shrinkage eigenvalues, audit. | Defer as a modeling extension; preserve prerequisites rather than treating it as a core probability week. |
| 22 — Rolling and expanding estimation | Window estimators, step-change response, rolling-origin MAE, stability, weighting. | Defer to forecasting; canonical Week 22 instead teaches WLLN/CLT, prerequisites for inference. |
| 23 — Factor replication protocol | Estimand, point-in-time data, protocol, replication vs extension, synthetic dry run. | Defer protocol writing to project work; canonical Week 23 teaches finite Markov chains and invariant laws. |
| 24 — Factor robustness and manuscript | Windows, weighting, robust SE, captions, sensitivity conclusions. | Defer manuscript practice; retain interval/robustness mathematics in the bridge. |
| 25 — External review and release preparation | Clean-checkout review, response matrix, licenses, dependency regeneration, outlier sensitivity. | Defer to project execution/release materials; not a core mathematical learning week. |
| 26 — Factor study publish and semester audit | Result interpretation, a single hand OLS task labelled “unseen,” skills audit, abstract, forecast timing. The OLS task has no parallel form or score rubric. | Move stats content into weeks 17–28; keep presentation/audit as a separate capstone. |
| 27 — Chronological ML evaluation | Horizon split, train-only scaling, panel purge, nested tuning, leakage critique. | Defer to ML/forecasting; teach prerequisite concepts in applied project work. |
| 28 — Financial forecasting data and target design | Return targets, dataset licensing, vintage joins, panel missingness, dataset card. | Defer to the later applied research track; retain probability/statistical assumptions in this bridge. |

## Acceptance-gap matrix: legacy baseline and observed training, Weeks 1–28

The topic column uses each legacy week title, not its replacement title. The prerequisite column reproduces the English `prerequisites` field exactly from `data/lessons-01-35.json`. **Intended level** is inferred from that legacy title, objectives, and stated prerequisites; **observed level** is the level of mathematical work actually required by its five session T/E/Ans records. The labels use the requested five categories. Workflow or research context does not raise observed mathematical level: when sessions train project operations rather than formal mathematics, the observed label is foundation with applied context. Session evidence is indexed by W# in the ledger below. Decisions use only the requested enums; the gap column records any later v2 destination separately.

| Week / legacy topic | Legacy prerequisite (exact) | Intended / observed level | Actually trained skills (session evidence) | Baseline gap and v2 route | Decision |
|---|---|---|---|---|---|
| 1 — Diagnostic and numerical setup | Algebra, fractions, functions, and reading a small table. No calculus or Python package is assumed; both are introduced here. | foundation / foundation | Chain rule and finite differences; rank/least-squares identifiability; Bayes base rates; epsilon-N convergence; seeded Bernoulli simulation. (W1) | Broad diagnostic sampling, but one answer-only item per area with no parallel forms, score map, or remediation path. V2 W1 supplies separate diagnostic forms; the earlier skills remain useful.  | replace |
| 2 — Vectors and probability spaces | Comfort with arithmetic, coordinates, sets, and the Week 1 gradient and rank diagnostic. | upper-undergraduate / foundation | Span/basis and projection; finite event algebra and weighted probability; exact probability versus simulation. (W2) | The intended linear algebra/probability scope is only introduced through examples; there is little proof practice or theorem-hypothesis checking. V2 W2 makes proof language explicit.  | deepen |
| 3 — Matrices and conditioning | Week 2 bases, matrix-vector products, dot products, and finite event probabilities. | upper-undergraduate / upper-undergraduate | Row reduction, rank/nullity and identifiability; condition-number sensitivity; conditional probability. (W3) | Only small matrices and perturbation examples are solved; general rank/conditioning claims and their assumptions are not developed. V2 W3 adds general norm/geometry reasoning.  | deepen |
| 4 — Differentiation and Bayes | Partial derivatives, matrix notation, conditional probability, and the chain rule for one variable. | upper-undergraduate / upper-undergraduate | Partial gradients, chain rule and Hessian eigenvalues; total probability and Bayes. (W4) | The prerequisites assume partial derivatives and chain rule before the old sequence has systematically taught them; no general Taylor remainder or local-extremum hypotheses. V2 W4 is a repair sequence.  | deepen |
| 5 — Projection and least squares | Orthogonal projection, matrix rank, gradients, and Bernoulli probability. | upper-undergraduate / upper-undergraduate | Constant least squares, QR, binomial calculations, residual orthogonality. (W5) | Computes projections and normal equations without a general existence/uniqueness theorem or rank-deficient boundary. V2 W5–6 supplies vector-space and projection proofs.  | deepen |
| 6 — Eigenvalues and distributions | Symmetric matrices, inner products, means, variances, and density notation. | upper-undergraduate / upper-undergraduate | Symmetric eigenpairs, normal standardization, exponential survival, covariance geometry. (W6) | Calculates examples without proving the spectral theorem or connecting PSD to quadratic forms. V2 W7 develops the general result.  | deepen |
| 7 — SVD and expectation | Orthogonal eigen-decomposition, matrix rank, and finite random variables. | upper-undergraduate / upper-undergraduate | SVD directions and truncation error; expectation linearity; zero-covariance dependence counterexample. (W7) | The finite examples do not prove general SVD geometry or rank-k approximation claims. V2 W8 supplies that structure.  | deepen |
| 8 — PCA and transformations | Covariance matrices, eigenvectors, densities, and the one-dimensional change-of-variables rule. | upper-undergraduate / upper-undergraduate | PCA variance maximization; joint density/marginals; one- and multivariate variable transforms. (W8) | Special-case transforms do not state injectivity/branch conditions or derive the general Jacobian rule. V2 W9–11 develops calculus and integration prerequisites.  | deepen |
| 9 — Proofs and convergence | Inequalities, sequences, expectation, variance, and elementary limits. | upper-undergraduate / upper-undergraduate | Contrapositive and epsilon-N proofs; monotone bounded sequence; Chebyshev/WLLN; simulation check. (W9) | Proof/convergence skills appear after many applications and without a prior completeness sequence. V2 moves proof repair to W2 and real sequences to W12–15.  | deepen |
| 10 — Central limit theorem | IID sampling, variance, standard normal CDF, and the weak law. | upper-undergraduate / upper-undergraduate | Standard errors; IID CLT and normal approximation; continuity correction; dependent-variance examples. (W10) | CLT is applied rather than proved, and the full moment/independence boundary is not systematically examined. V2 places the named CLT after probability foundations and labels its status.  | deepen |
| 11 — Monte Carlo uncertainty | Expectation, variance, CLT, and independent random sampling. | upper-undergraduate / upper-undergraduate | Monte Carlo standard errors and coverage; antithetic/control variates; efficiency comparison. (W11) | Good computational intuition, but limited derivation of unbiasedness and variance conditions; interval calibration is example-driven. V2 retains a theory-first probability/statistics route.  | deepen |
| 12 — Numerical foundations release | Floating-point arithmetic, numerical tests, random seeds, and Git-based project workflow. | foundation / foundation | Floating-point tolerances, cancellation, summation error, invariants, reproducible environments and release audit. (W12) | The topic is numerical/tool literacy, not the real-sequence/completeness topic assigned to canonical W12. Keep the release workflow as a project elective.  | elective |
| 13 — Foundation assessment and publish | Weeks 1–12: linear algebra, calculus, probability, inference basics, simulation, and numerical verification. | upper-undergraduate / upper-undergraduate | Mixed linear algebra/calculus, interval reasoning, simulation, unit conversion and portfolio writing. (W13) | Despite assessment/timed labels, there is no A/B form, point threshold, point rubric, or scored gate. V2 replaces this function with W16 A/B foundation gate.  | replace |
| 14 — Financial returns and data contracts | Logarithms, percentage changes, sample means, and data provenance concepts. | upper-undergraduate / foundation | Return arithmetic, risk-free alignment, publication timing, pipeline calculations and data audit. (W14) | The actual work is mostly arithmetic and provenance workflow, not a full undergraduate statistics topic. V2 W14 is function-sequence analysis; retain returns/data contracts as an applied elective.  | elective |
| 15 — Likelihood and factor regressions | OLS, normal distributions, likelihood, returns, and chronological data alignment. | graduate bridge / upper-undergraduate | Gaussian OLS likelihood, factor exposures, predictive-time alignment, duplicate-regressor identifiability. (W15) | The exercises introduce applications but do not establish likelihood/identifiability theory or sufficient-statistic arguments. V2 moves likelihood to W25; keep the factor protocol elective.  | elective |
| 16 — Estimator bias and variance | Sampling distributions, expectation, variance, and least squares. | upper-undergraduate / upper-undergraduate | Bias/MSE calculations, n−1 variance, shrinkage, estimator reporting. (W16) | Useful estimator arithmetic, but it is not the promised foundation gate and has no unseen A/B forms, critical criteria, or retest rule. V2 replaces the gate with W16 and revisits estimator theory later.  | replace |
| 17 — Confidence intervals and coverage | Sampling distributions, standard errors, normal/t distributions, and variance estimation. | upper-undergraduate / upper-undergraduate | Known/unknown-variance intervals; repeated-sampling coverage; mean versus prediction interval. (W17) | Intervals are selected by examples; sampling-model and exact/asymptotic assumptions need fuller treatment. V2 keeps these skills in the later inference route.  | deepen |
| 18 — Hypothesis testing and effect sizes | Sampling distributions, confidence intervals, standard errors, and normal/t approximations. | upper-undergraduate / upper-undergraduate | Null tests, p/CI relation, power/sample size, familywise error and practical significance. (W18) | Uses normal approximations and multiple testing without a derivation of exact likelihood-ratio optimality. V2 develops the proof and multiplicity hypotheses in W27 and later inference.  | deepen |
| 19 — Bootstrap and dependence | Sampling distributions, empirical distributions, confidence intervals, and time-indexed data. | graduate bridge / upper-undergraduate | Empirical/percentile bootstrap; IID bootstrap failure for dependence; block-length sensitivity. (W19) | Block resampling is discussed operationally, without a complete exchangeability or dependent-bootstrap theorem and hypotheses. V2 builds the finite-group bridge at W28.  | deepen |
| 20 — Residual diagnostics and robust errors | OLS, residuals, covariance, bootstrap dependence, and confidence intervals. | graduate bridge / upper-undergraduate | Residual geometry; HC0/HAC calculations; model-misspecification diagnostic; interval comparison. (W20) | Robust covariance is calculated but its PSD construction, stationarity, dependence and model-validity boundaries are not proved. V2 retains the topic in later HAC work.  | deepen |
| 21 — Regularization and covariance | OLS, bias-variance decomposition, matrix eigenvalues, and chronological validation. | graduate bridge / upper-undergraduate | Ridge scaling, validation comparison, covariance shrinkage and conditioning. (W21) | A one-grid validation and covariance example do not establish high-dimensional regularization guarantees. V2 places covariance risk and lasso bounds later; keep this applied extension elective.  | elective |
| 22 — Rolling and expanding estimation | Regression, chronological splits, stationarity, and validation protocols. | graduate bridge / upper-undergraduate | Rolling/expanding windows, regime drift, rolling-origin MAE and deployment-weighted scoring. (W22) | Small examples do not establish sampling-distribution or forecasting-limit results. V2 keeps this in forecasting rather than the probability core.  | elective |
| 23 — Factor replication protocol | Factor regressions, point-in-time data contracts, inference, and reproducible project structure. | graduate bridge / foundation | Estimand definition, data vintages, predeclared protocol, replication-versus-extension, synthetic dry run. (W23) | These are project-planning skills; no Markov transition or invariant-law mathematics is trained. V2 W23 supplies finite-chain theory; retain protocol work as an applied elective.  | elective |
| 24 — Factor robustness and manuscript | A frozen factor protocol, regression inference, multiple testing, and reproducible figures. | graduate bridge / foundation | Window/universe sensitivity, weighting, inference comparisons, manuscript evidence and caveats. (W24) | The manuscript task gives limited mathematical derivation and does not establish sampling/unbiased-estimation theory. V2 W24 teaches that theory; preserve manuscript work as elective.  | elective |
| 25 — External review and release preparation | A complete replication manuscript, code, data manifest, and robustness table. | graduate bridge / foundation | Clean-checkout review, reviewer responses, licensing/provenance, artifact lineage, exploratory-analysis boundaries. (W25) | Release practice contains no likelihood, identifiability, or exponential-family mathematics. V2 W25 supplies that theory; keep review/release work elective.  | elective |
| 26 — Factor study publish and semester audit | Weeks 14–25 factor project, regression/inference tools, reviewer responses, and reproducibility checks. | graduate bridge / foundation | Factor-result integration, one hand OLS task, project audit, communication and forecast timing. (W26) | One unscored OLS task is not sufficiency/Rao–Blackwell assessment and has no alternate form or rubric. V2 W26 teaches the theorem; retain project publishing separately.  | elective |
| 27 — Chronological ML evaluation | Rolling-origin estimation, data contracts, regression baselines, and feature engineering. | graduate bridge / foundation | Chronological splits, leakage-safe scaling, panel purging, nested temporal tuning and baselines. (W27) | The tasks are applied evaluation workflow, not hypothesis-test or likelihood-ratio theory. V2 W27 develops test theory; keep chronology/ML methods elective.  | elective |
| 28 — Financial forecasting data and target design | Returns, point-in-time information, and chronological evaluation. | graduate bridge / foundation | Forecast-target timing, licensing, vintage joins, panel schema/missingness and dataset cards. (W28) | Data contracts are useful applied work but do not teach resampling, exchangeability, or probability/statistics bridge theorems. V2 W28 fills the mathematical bridge; keep financial-data design elective.  | elective |

No legacy week in this range demonstrates graduate-core or specialization-level mathematical proof. The weeks intended as graduate bridge mostly deliver upper-undergraduate computations or foundation-level project workflows; those labels describe the observed exercises, not the sophistication of the application context.
## Session-level evidence ledger

Each session below gives the actual T/E/Ans evidence from its own JSON object. Unless explicitly marked otherwise, assessment evidence is one exercise with a stored answer and four agenda actions; durations are not consistently specified, and there is no point rubric or alternate form. The old data does not record proof status, theorem hypotheses, or grading criteria.

### Week 1 — Diagnostic and numerical setup

- **S1 Gradient and finite differences.** T: derivative-as-local-slope and chain rule for ½(2w−3)². E: derive/evaluate ½(3w−6)² and finite difference at h=.01. Ans: f′=3(3w−6), f(1)=4.5, f′(1)=−9, forward slope −8.955/error .045. Assessment: week title says diagnostic, but no A/B form or diagnostic scoring rule.
- **S2 Rank, identifiability, and least squares.** T: design columns, rank, coefficient identification. E: fit y=(1,2,3) on intercept and x=(0,1,2), then duplicate x. Ans: original fit is exact; duplicate predictors permit infinitely many coefficient pairs but fixed predictions.
- **S3 Conditional probability and Bayes.** T: conditional probability and screening-test base rates. E: 1,000 tests, prevalence 2%, sensitivity 90%, specificity 95%. Ans: 20 cases, 18 true positives, 49 false positives, posterior 18/67≈.2687.
- **S4 Epsilon proofs and convergence.** T: quantified sequence convergence. E: prove 3/n→0 and give N at ε=.02. Ans: N=floor(3/ε)+1; N=151 for .02.
- **S5 Seeded simulation and sampling error.** T: Bernoulli frequency, expectation/variance and reproducible pseudorandomness. E: Python `Random(7)`, then n={100,1000,10000}, seeds {11,23,47}. Ans: seed 7 gives 7/10; nine estimates, mean absolute error, and empirical SE are compared with √(.25/n).

### Week 2 — Vectors and probability spaces

- **S1 Span, independence, and basis.** T: vector columns and span. E: basis for u=(1,2,0), v=(0,1,1), w=(1,3,1), and membership of z=(2,5,2). Ans: w=u+v, {u,v} basis, dimension 2; z is in the span.
- **S2 Orthogonal projection and residual geometry.** T: dot product/orthogonality. E: project (3,1,2) on (1,1,0). Ans: p=(2,2,0), r=(1,−1,2), u·r=0 and squared norms 8+6=14.
- **S3 Finite sample spaces and event algebra.** T: finite Ω and disjoint events. E: two ordered dice, sum 7 vs first die 4. Ans: 36 outcomes, event sizes 6/18, intersection 3, union probability 7/12.
- **S4 Weighted outcomes and probability axioms.** T: finite PMF normalization. E: two-stage red/blue device and success. Ans: success path masses .24/.14, failure .06/.56, total success .38.
- **S5 Synthesis: projections and exact-versus-sampled probability.** T: invariant tests. E: face-proportional loaded die, exact even probability and sample SE. Ans: 4/7 and SE≈.02020 for n=600.

### Week 3 — Matrices and conditioning

- **S1 Gaussian elimination and solution sets.** T: elementary row operations. E: classify 2x−y=1, 4x−2y=2, x+y=5. Ans: unique solution; second equation adds no pivot.
- **S2 Rank, null spaces, and identifiability.** T: pivot/rank interpretation. E: A=[[1,2,1],[2,4,2]], rank/nullity and null vectors. Ans: rank 1, nullity 2; basis includes (−2,1,0), (−1,0,1); one coefficient combination identified.
- **S3 Condition numbers and perturbation.** T: ill-conditioning as amplification. E: κ₂(diag(1,.02)) and perturb b₂. Ans: κ₂=50; b₂ and x₂ both change 2% in the example.
- **S4 Conditional probability and independence.** T: conditioning on observed subsets. E: class table for Python study and passing. Ans: P(pass)=7/15, P(pass|Python)=2/3, P(Python|pass)=4/7; not independent.
- **S5 Matrix and probability sensitivity synthesis.** T: explicit model assumptions. E: perturb diag(1,.01) and a probability table. Ans: x₂ changes 3%; rare-event sampling is noisy and compared separately.

### Week 4 — Differentiation and Bayes

- **S1 Partial derivatives and gradient geometry.** T: hold-other-coordinate-fixed partials. E: ∇(x²y+2y³) at (2,−1), first-order change. Ans: gradient (−4,10), predicted change .08.
- **S2 Chain rule and gradients through a model.** T: Jacobian composition. E: a=2x−y, b=x²+y, L=ab at (1,2). Ans: gradient (6,−3), checked by expansion.
- **S3 Hessians, curvature, and quadratic objectives.** T: Hessian/local curvature. E: Hessian/eigenvalues of 2x²−2xy+3y². Ans: eigenvalues 5±√5 positive; origin unique global minimum.
- **S4 Total probability and partition models.** T: partition and total probability. E: group shares 4%/96%, positive rates .70/.05. Ans: total positive rate .076.
- **S5 Bayes, base rates, and posterior odds.** T: prior and likelihood evidence. E: posterior at 2% and 10% prevalence. Ans: at 2%, 18/67≈.2687; recalculates posterior for 10% using 900 true and 450 false positives.

### Week 5 — Projection and least squares

- **S1 Least squares from orthogonal projection.** T: fit is closest point in Col(X). E: intercept-only fit to (2,4,7,7). Ans: mean 5, residuals (−3,−1,2,2), sum zero, SSE 18.
- **S2 Normal equations and QR stability.** T: normal equations and QR. E: QR for an intercept/trend matrix and fit y. Ans: Q/R displayed; β̂=(7/6,1/2).
- **S3 Bernoulli and binomial models.** T: Bernoulli PMF/moments. E: Binomial(8,.3) probabilities/moments. Ans: P(0)=.05764801, P(2)=.29647548, P(≥1)=.94235199, mean 2.4, variance 1.68.
- **S4 QR, residual diagnostics, and probability checks.** T: pair identities with independent checks. E: fit 3-point line, test Xᵀr=0, state binomial check. Ans: β̂=(4/3,1), residuals (2/3,−4/3,2/3), orthogonal residual.
- **S5 Mini-project: stable least squares with a probability calibration check.** T: deterministic/stochastic validation. E: fit three-point line and calibrate 100 Bernoulli(.2) trials. Ans: β̂=(7/3,1.5), residuals (1/6,−1/3,1/6); E[S]=20, Var(S)=16.

### Week 6 — Eigenvalues and distributions

- **S1 Symmetric eigenproblems.** T: eigenpair/Rayleigh quotient. E: diagonalize [[5,2],[2,2]]. Ans: eigenvalues 6,1; unit directions (2,1)/√5 and (1,−2)/√5.
- **S2 Normal distribution and standardization.** T: standard-normal transform. E: probabilities for μ=50, σ=10. Ans: Φ(−1)≈.1587, upper tail at 65≈.0668, interval 45–60≈.5328.
- **S3 Exponential waiting times.** T: rate, survival, memorylessness. E: λ=.25/day. Ans: mean 4, variance 16, survival e⁻¹≈.3679 and conditional residual survival e⁻.⁵≈.6065.
- **S4 Covariance eigenvalues and distribution comparison.** T: covariance PSD. E: eigenvalues of [[9,3],[3,4]] and directional variance. Ans: eigenvalues (13±√61)/2 positive; variance along (1,1)/√2 is 9.5.
- **S5 Synthesis: spectral geometry and probability models.** T: eigen-coordinates of covariance. E: rotate Gaussian with principal variances 4 and 1. Ans: covariance [[2.5,1.5],[1.5,2.5]], principal variances preserved.

### Week 7 — SVD and expectation

- **S1 Singular values as geometric gains.** T: eigen-directions of AᵀA. E: SVD of [[0,2],[0,0]]. Ans: singular values 2,0; rank 1 and one-dimensional null space.
- **S2 Low-rank approximation and compression.** T: truncate singular expansion. E: singular values 8,4,1,.5 with k=2. Ans: spectral error 1, Frobenius error √1.25, retained squared-energy fraction 80/81.25.
- **S3 Linearity of expectation.** T: weighted expectation. E: independent failures .1,.2,.3. Ans: E[N]=.6 and P(N≥1)=.496; expectation differs from event probability.
- **S4 Covariance and dependence.** T: covariance as signed linear movement. E: X uniform {−2,0,2}, Y=X². Ans: Cov=0 but deterministic dependence remains.
- **S5 Synthesis: low-rank geometry and random sums.** T: compression plus random sums. E: transform covariance [[2,1],[1,2]]. Ans: AΣAᵀ=diag(6,2), eigenvalues 6,2, sum variance 6.

### Week 8 — PCA and transformations

- **S1 PCA from variance maximization.** T: sample covariance eigenvectors. E: four centered points. Ans: covariance (10/3)I; all directions tie, so the first PC is not unique.
- **S2 Joint density and independence.** T: joint and marginal density. E: f=2 on 0<x<y<1. Ans: normalized; fX=2(1−x), fY=2y, dependent triangular support.
- **S3 One-dimensional change of variables.** T: monotone transform density. E: X∼Unif(−2,2), Y=X². Ans: fY=1/(4√y), 0<y<4; integral 1 and P(Y≤1)=1/2.
- **S4 Multivariate transformations and Jacobians.** T: density transform with |det J|. E: point uniform in disk radius 3, polar density. Ans: fR,Θ=r/(9π), fR=2r/9, P(R≤1.5)=.25.
- **S5 Synthesis: PCA and probability-preserving maps.** T: orthogonal transform preserves area/probability. E: rotate covariance diag(9,1). Ans: [[5,4],[4,5]], leading eigenvector (1,1)/√2 with eigenvalue 9.

### Week 9 — Proofs and convergence

- **S1 Quantifiers and proof structure.** T: universal claim/counterexample and proof plan. E: divisibility contrapositive. Ans: n≡1 or 2 mod 3 implies n²≡1; proves the contrapositive.
- **S2 Epsilon-N proofs for sequence limits.** T: bound |aₙ−L|. E: prove (2n+1)/(n+3)→2. Ans: error 5/(n+3), N=floor(5/ε)+1.
- **S3 Monotone sequences, bounds, and Cauchy reasoning.** T: monotone bounded convergence. E: aₙ=1−(3/4)ⁿ. Ans: positive increments, upper bound 1, limit 1; N follows by logarithms.
- **S4 Convergence in probability and the weak law.** T: tail-probability control. E: μ=5, variance 16, Chebyshev at n=100,400. Ans: mean variances .16,.04; tail bounds .64,.16 at ε=.5.
- **S5 Synthesis: proof and simulation of the law of large numbers.** T: proof vs empirical check. E: Bernoulli(.4), bound P(|p̂−.4|≥.05). Ans: 96/n, sufficient n≥960 for bound ≤.1; simulation is illustrative.

### Week 10 — Central limit theorem

- **S1 Sampling distributions and standard error.** T: estimator varies over repeated samples. E: μ=12, σ=5, n=25,100. Ans: SEs 1 and .5; individual-observation spread remains 5.
- **S2 The CLT and standardized sums.** T: standardized IID sum approaches N(0,1). E: Binomial(80,.25), upper-tail approximation. Ans: corrected z≈1.4201, tail≈.0778.
- **S3 Continuity correction and approximation diagnostics.** T: normal curve approximates integer mass. E: Binomial(40,.5), P(S≤15), corrected/unadjusted and exact. Ans: corrected ≈.0773; uncorrected ≈.0569; exact sum also given.
- **S4 CLT for non-Bernoulli data and dependence caution.** T: CLT beyond binary and dependence changes variance. E: stationary series γ₀=4, γ₁=1, γ₂=.5. Ans: Var(mean)=31/25=1.24 vs IID .8.
- **S5 Synthesis: a CLT approximation audit.** T: identify estimand, assumptions, approximation. E: Binomial(50,.4), lower-tail. Ans: corrected z≈−1.299, normal tail≈.097; exact binomial sum distinguished.

### Week 11 — Monte Carlo uncertainty

- **S1 Monte Carlo estimators and standard errors.** T: sample average estimates expectation. E: 625 events in 2,500 draws. Ans: p̂=.25, plug-in SE≈.00866, interval ≈[.2330,.2670].
- **S2 Confidence intervals and coverage.** T: repeated-sampling coverage. E: zero successes in 20; compare Wald/Wilson. Ans: Wald [0,0] defect; Wilson interval is nondegenerate.
- **S3 Antithetic variates.** T: U and 1−U share a marginal. E: estimate ∫₀¹x dx with antithetic pairs. Ans: pair average exactly 1/2, variance 0; crude independent estimate remains random.
- **S4 Control variates and optimal coefficients.** T: known-mean control and variance-minimizing coefficient. E: Y=U², C=U. Ans: β*=1; adjusted expectation 1/3 and variance 1/180.
- **S5 Confidence intervals and variance reduction comparison.** T: variance reduction changes precision per budget. E: compare crude/antithetic variances. Ans: crude SE≈.006667 vs antithetic≈.002357 in the stated setup.

### Week 12 — Numerical foundations release

- **S1 Floating-point representation and rounding.** T: finite precision and tolerance. E: compare values under atol/rtol. Ans: 2e−13 passes 2e−12; .0002 fails the stated tolerance.
- **S2 Cancellation and stable formulas.** T: subtractive cancellation. E: rationalize √(x²+9)−x at x=10⁶. Ans: 9/(√(x²+9)+x)≈4.50e−6.
- **S3 Summation, accumulation, and compensated arithmetic.** T: floating addition is nonassociative. E: binary64 sum [1e16,1,−1e16,1]. Ans: accumulator rounds through 1e16,1e16,0,1; exact sum is 2.
- **S4 Validation, testing, and reproducible environments.** T: example tests plus invariants. E: list projection checks. Ans: residual orthogonality, Pythagorean identity, and scaling invariance.
- **S5 Release audit: numerical claims and reproducibility.** T: trace numerical output to configuration. E: audit claimed MC error .0003. Ans: identifies missing target, estimator, N, error definition, reference, seed/RNG, dtype, etc.

### Week 13 — Foundation assessment and publish

- **S1 Closed-book linear algebra and calculus assessment.** T: translate prompt into method. E: dependent system plus constant least-squares fit. Ans: infinitely many solutions x=(5−t)/2,y=t; fit mean separately. Assessment: title says closed-book but no duration, rubric, score threshold, or alternate form.
- **S2 Statistical reasoning and uncertainty assessment.** T: estimand and sampling model. E: difference 2.0, SE .8. Ans: normal interval [.432,3.568], conditional on the approximation. Same assessment limitation.
- **S3 Probability simulation and numerical audit.** T: simulation as computational experiment. E: 170 sixes in 900 fair-die rolls. Ans: p̂≈.18889, SE≈.01305, deviation 1.70 SE. No scoring rule.
- **S4 Timed mixed assessment and error analysis.** T: transfer across topics. E: OLS slope with milliseconds. Ans: .002 per millisecond = 2 per second. “Timed” exists in title only; no duration/threshold encoded.
- **S5 Publish and audit the foundations portfolio.** T: reviewer-oriented reproducibility. E: write 120-word synthetic QR/OLS study abstract. Ans: example abstract tests QR vs normal equations; this is a communication task.

### Week 14 — Financial returns and data contracts

- **S1 Simple and log return arithmetic.** T: simple/log definitions. E: prices 80→100→90. Ans: simple returns .25,−.10; compounded total .125; log returns add to log(1.125).
- **S2 Excess returns, alignment, and timing.** T: align risk-free rates over same interval. E: .6% five-day return and annual effective rate. Ans: convert to five-day effective rate before subtracting.
- **S3 Point-in-time data contracts.** T: define row unit and field availability. E: Q1 accounting value released May 10. Ans: using it May 1 leaks; latest usable date is after release.
- **S4 Return pipeline synthesis.** T: price-to-excess-return steps. E: prices 200,190,209, same-period rf=.001. Ans: simple −.05,+.10; excess −.051,+.099; compounded total .045.
- **S5 End-to-end return contract and data audit.** T: timestamps and adjustment conventions. E: adjusted closes 200,210,199.5. Ans: returns +.05,−.05; excess +.049,−.051; audit asks for data contract.

### Week 15 — Likelihood and factor regressions

- **S1 Likelihood and Gaussian regression.** T: likelihood conditions on observed data. E: intercept-only y=(2,3,5,6). Ans: β̂=4, SSE=10, variance MLE 2.5 vs unbiased 10/3.
- **S2 Factor exposures and intercepts.** T: linear factor model. E: regress four returns on factor. Ans: β=1, α=.01.
- **S3 Contemporaneous versus predictive regression.** T: same-time explanatory vs future prediction. E: Jan–May features and full-calendar returns. Ans: Jan–Apr have specified next-month targets; May has no June label.
- **S4 Factor regression audit.** T: data contract and model. E: duplicate factor column. Ans: β₁+β₂=2 invariant; separate slopes are not identified.
- **S5 Synthesis: likelihood-based factor replication setup.** T: model plus synthetic checks. E: simulated 24-observation two-factor regression; list recovery checks. Ans: coefficient/prediction recovery within expected sampling error, plus diagnostics.

### Week 16 — Estimator bias and variance

- **S1 Bias from the sampling distribution.** T: estimator is random before observing data. E: estimates 8,10,14 with probabilities .25,.5,.25, target 10. Ans: mean 10.5, bias .5, variance computed around 10.5.
- **S2 Bias-variance decomposition and MSE.** T: add/subtract estimator mean in squared error. E: A (bias −.5,var 2), B (bias 1,var .5). Ans: MSE 2.25 vs 1.5; B wins under squared loss.
- **S3 Sample variance and degrees of freedom.** T: centered sum and n−1 correction. E: sample (2,4,4,10). Ans: mean 5, SSE 36, divide by n gives 9; divide by n−1 gives 12.
- **S4 Shrinkage as a bias-variance tradeoff.** T: shrink estimate toward reference. E: δ=.5X̄, Var(X̄)=9, μ=3. Ans: bias −1.5, variance 2.25, MSE 4.5 vs raw MSE 9.
- **S5 Bias-variance assessment and estimator report.** T: report target/design/loss. E: A (.2,1.5) vs B (−.6,.8). Ans: MSE 1.54 vs 1.16. Despite “assessment,” this is not the foundations gate and has no A/B form or rubric.

### Week 17 — Confidence intervals and coverage

- **S1 Mean interval with known variance.** T: exact normal pivot. E: n=100, mean 5.2, σ=3. Ans: 95% interval [4.612,5.788]; n≥385 for half-width .3.
- **S2 Unknown variance, t intervals, and prediction intervals.** T: Student pivot and prediction spread. E: n=16, mean 20, s=4, t=2.131. Ans: mean CI [17.869,22.131], prediction interval wider.
- **S3 Coverage, robustness, and repeated sampling.** T: coverage by repeated simulation. E: 1860/2000 cover. Ans: coverage .93, MC SE≈.00570, approximate MC interval [.9188,.9412].
- **S4 Sampling interval design and reporting.** T: identify target before interval. E: interpret [17.9,22.1] lacking target. Ans: matches mean CI, not prediction CI.
- **S5 Synthesis: interval method audit.** T: match interval to sampling model. E: n=9, mean 10, s=3, t=2.306. Ans: mean half-width 2.306, prediction half-width≈7.29, plus coverage check.

### Week 18 — Hypothesis testing and effect sizes

- **S1 Null hypotheses and test statistics.** T: null reference model. E: test μ=50, x̄=52, σ=8,n=64. Ans: z=2,p≈.0455, reject at .05 under normal assumptions.
- **S2 P-values and confidence intervals.** T: two-sided p/CI relation. E: estimate −.5, SE .2. Ans: p≈.0124, CI [−.892,−.108].
- **S3 Power, sample size, and detectable effects.** T: power under a stated alternative. E: one-sided α=.05, σ=2,n=100, Δ=1. Ans: power≈.9996; n≈24.74, so choose 25 for .8 power.
- **S4 Multiple testing and practical significance.** T: independent-null familywise error. E: 10 tests at .05. Ans: FWER≈.4013; Bonferroni threshold .005; statistical/practical effects separated.
- **S5 Hypothesis-testing synthesis.** T: preregister target/null/family. E: 40 candidate factors. Ans: FWER≈.8715; adjust family or use declared FDR method.

### Week 19 — Bootstrap and dependence

- **S1 Empirical bootstrap mechanics.** T: empirical distribution has mass 1/n. E: exact bootstrap mean for (0,1,1). Ans: E*=2/3, Var=2/27, SE≈.2722 and discrete law.
- **S2 Bootstrap standard errors and percentile intervals.** T: bootstrap SD/quantiles. E: sorted ten estimates with nearest ranks. Ans: 10–90% interval [1,8], median 3.5, range [1,10].
- **S3 Why IID bootstrap fails for dependent series.** T: resampling individual times destroys serial structure. E: enumerate circular length-4 blocks from 1…6. Ans: (1,2,3,4),(3,4,5,6),(5,6,1,2).
- **S4 Block-length sensitivity and dependent uncertainty.** T: block length affects effective sample. E: compare L=6 and L=30 for n=240. Ans: about 40 vs 8 blocks; choose an intermediate length and examine sensitivity.
- **S5 Bootstrap protocol and scientific interpretation.** T: resampling answers a conditional model question. E: 500 returns with autocorrelation .35/volatility clustering. Ans: moving-block bootstrap with declared length/sensitivity and caveats.

### Week 20 — Residual diagnostics and robust errors

- **S1 Residual geometry and diagnostic plots.** T: residual is observed minus fitted. E: fit line to (0,1),(1,2),(2,5). Ans: intercept 2/3, slope 2, residuals (1/3,−2/3,1/3) and plot coordinates.
- **S2 Heteroskedasticity and sandwich covariance.** T: conditional variance varies. E: HC0 for centered x and residual vector. Ans: HC0 variance .10 vs classical .20; SE .316 vs .447.
- **S3 Serial correlation and HAC uncertainty.** T: long-run score covariance. E: γ₀=2,γ₁=.6,γ₂=.2, Bartlett L=1,2. Ans: 2.6 and 2.9333 vs naive 2.
- **S4 Robust standard errors are not a model repair.** T: robust covariance adjusts uncertainty only. E: fit line to y=x² for x=−2…2. Ans: slope 0, intercept 2, curved residuals remain.
- **S5 Residual and covariance audit release.** T: report coefficient with covariance method. E: β̂=.15, classical SE .03/HAC .07. Ans: intervals [.0912,.2088] and [.0128,.2872]; estimate is unchanged.

### Week 21 — Regularization and covariance

- **S1 Ridge objective and closed-form solution.** T: quadratic penalty. E: X=I₂,y=(6,−3), λ=4. Ans: β=(1.2,−.6), residual (4.8,−2.4), coefficients shrink.
- **S2 Scaling, intercepts, and penalty meaning.** T: raw-unit penalty is scale-dependent. E: convert slope from meters to centimeters. Ans: slope .02; squared penalty changes by factor 10,000 without rescaling.
- **S3 Ridge bias-variance and validation.** T: shrinkage tradeoff. E: four-fold errors for λ=.1 vs 1. Ans: mean validation MSE 1.25 vs 1.20; λ=1 wins only on this grid.
- **S4 Covariance shrinkage and conditioning.** T: sample covariance noise. E: halfway shrink [[4,3],[3,4]] toward 4I. Ans: [[4,1.5],[1.5,4]], eigenvalues 5.5,2.5, condition 2.2.
- **S5 Regularization audit and synthesis.** T: preprocessing units matter. E: change feature units after ridge fit. Ans: prior penalty meaning invalidated; refit and check validation leakage.

### Week 22 — Rolling and expanding estimation

- **S1 Rolling versus expanding windows.** T: eligible history at forecast origin. E: compare means for (1,1,1,5,5,5). Ans: expanding 2.6 vs rolling 11/3≈3.667.
- **S2 Window length and parameter drift.** T: short window reduces stale-regime bias but raises variance. E: step change 0→2 at t=11, W=4. Ans: .5,1,1.5,2,2; W-window adapts after four post-change values.
- **S3 Rolling-origin evaluation and temporal baselines.** T: train only on past at each origin. E: persistence forecasts for five-point series. Ans: forecasts (5,6,4,4), with MAE calculated on later values.
- **S4 Window estimation protocol and stability audit.** T: rolling estimates form a time series. E: compare rolling/expanding slopes and SEs. Ans: possible coefficient shift vs sampling variation, calls for planned comparison.
- **S5 Rolling estimation synthesis.** T: score depends on regime weighting. E: compare pre/post-change errors. Ans: B wins both equal-weight (.90 vs 1.15) and stated deployment-weighted score (.96 vs 1.54).

### Week 23 — Factor replication protocol

- **S1 Question, estimand, and replication target.** T: define measurable estimand. E: momentum protocol over 12 months. Ans: specifies universe/dates, equal-weight top-minus-bottom, rebalance, target.
- **S2 Data vintage, sample rules, and transformations.** T: results depend on vintage. E: survivor-only universe, forward fill, revised data. Ans: flags survivorship/lookahead; use point-in-time membership and no unsupported filling.
- **S3 Protocol, baselines, and inference plan.** T: name baseline before evaluation. E: 3 lags × 3 weights, then best result. Ans: predeclare primary lag/weight, null, and HAC plan; disclose grid.
- **S4 Replication versus extension claims.** T: replication minimizes changes. E: coefficient match but later data vintage. Ans: avoid exact-replication claim; restore vintage or label extension.
- **S5 Freeze and dry-run the protocol.** T: synthetic fixture catches errors. E: rank three assets. Ans: B>C>A, top return .04; arithmetic checked.

### Week 24 — Factor robustness and manuscript

- **S1 Sample-window and universe sensitivity.** T: regimes/universe change estimates. E: spread .40% (SE .15) vs .05% (SE .20). Ans: intervals [.106,.694]% and [−.342,.442]%; second includes zero.
- **S2 Factor-definition and weighting sensitivity.** T: lookback/skip/breakpoint/weight matter. E: rank A/B/C with returns. Ans: equal-weight spread −15%; value-weight answer requires weights.
- **S3 Inference and robustness without specification search.** T: inference methods expose dependence. E: estimate .30%, SE .10/.12/.18. Ans: conventional/HC intervals exclude zero; HAC includes zero.
- **S4 Manuscript structure and evidence discipline.** T: state question/design/result/limits. E: table omits N, frequency, weights, SE. Ans: caption template supplies required details.
- **S5 Robustness release and interpretation.** T: report prespecified choice sensitivity. E: five estimates and intervals. Ans: nearby variants similar, alternate windows include zero; avoids universal robustness claim.

### Week 25 — External review and release preparation

- **S1 Independent reproducibility review.** T: clean checkout and traceable outputs. E: figure differs because it reads `results_old.csv`. Ans: stale lineage; rebuild from documented pipeline.
- **S2 Reviewer response matrix.** T: answer each comment with evidence. E: request Newey–West lags 1,3,6. Ans: rerun same sample/coefficient and report all intervals.
- **S3 Licenses, attribution, and contributor records.** T: code/data/figure rights can differ. E: research-download data forbids redistribution. Ans: do not bundle; document terms and user-directed retrieval.
- **S4 Release candidate review.** T: track dependent artifacts. E: return lag changes 0→1 month. Ans: regenerate aligned rows, counts, coefficients, baselines, figures and narrative.
- **S5 External-review handoff and learning log.** T: reviewer handoff includes caveats. E: outlier question absent from primary protocol. Ans: keep primary fixed and label the outlier analysis exploratory.

### Week 26 — Factor study publish and semester audit

- **S1 Integrate the factor study end to end.** T: frozen inputs to reported table. E: spread .30%, HAC interval [−.05,.65]%, 120 months. Ans: describes a small, uncertain estimate.
- **S2 Unseen regression and inference assessment.** T: transfer framing. E: hand OLS for x=(1,2,3,4), y=(2,2,5,7). Ans: slope 1.8, intercept −.5, residuals/SSE. Assessment: one numeric task; no alternate form or rubric.
- **S3 Semester project audit.** T: evaluate evidence, not hours. E: skill audit for regression inference, time validation, numeric analysis. Ans: example artifacts, capabilities, gaps, next actions.
- **S4 Final project release and communication.** T: concise presentation. E: five-sentence summary. Ans: states frozen 120-month setup and qualified result.
- **S5 Transition to forecasting research.** T: name next question. E: close-t feature and t→t+1 target availability. Ans: forecast after close only if feature is published then; no future labels.

### Week 27 — Chronological ML evaluation

- **S1 Chronological splits and information sets.** T: order origins by time. E: three-day horizon at origins 1…12. Ans: at cut 8, training ends at 5; origin 6 label is not fully known.
- **S2 Leakage-safe preprocessing and feature selection.** T: fit learned transforms on training partition. E: train values 2,4,6, test 100. Ans: train z≈−1.225,0,1.225; test≈58.79 under train-only moments.
- **S3 Panel time splits and purging.** T: all assets at a date share information. E: H=2, validation targets start at 7. Ans: purge origin 5 because its label includes date 7.
- **S4 Nested temporal tuning and benchmark fairness.** T: separate inner tuning and outer evaluation. E: two λ values across three folds. Ans: λ=1 inner MSE .933<1; post-100 outer targets remain untouched.
- **S5 Leakage audit and chronological evaluation release.** T: trace feature/target availability. E: score falls after global scaling/random split. Ans: likely optimistic leakage; use past-only transforms and chronological split.

### Week 28 — Financial forecasting data and target design

- **S1 Define the target before selecting a dataset.** T: target fixes forecast time/meaning. E: prices 50,51,49.98 plus late macro release. Ans: returns +.02,−.02; 17:00 release unavailable at same-day close.
- **S2 Choose free datasets responsibly.** T: source provenance/license must fit use. E: compare dataset scorecards. Ans: tied scores can hide unclear rights; verify terms or choose clear-license data.
- **S3 Point-in-time joins and release delays.** T: vintage-aware features. E: value 7 released May 3/revised June 2. Ans: May 20 uses 7; June 10 uses 9; UTC/local rollover considered.
- **S4 Panel schema, identifiers, and missingness.** T: key is `(asset_id,date)`. E: expected 2×3 panel with missing A3 and duplicate B2. Ans: A3 is absent after delisting, not zero; duplicate key is a data defect.
- **S5 Dataset card and reproducible data release.** T: describe measures and selection. E: 240 rows from 20 assets×12 months, survivor-selected. Ans: disclose survivorship before claims.

## Assessment and source audit

The legacy file contains 28 week objects and 140 sessions. Every session has one stored exercise, hint, answer, and four agenda actions; only 5/140 agendas explicitly state a duration. No session exposes point-by-point grading criteria. Week 1 is titled diagnostic but has no parallel forms or pass rule. Week 13 includes “assessment” and “timed” titles, and one S1 agenda names a 60-minute set, but there is no point threshold, alternate form, or rubric. Week 16 is estimator bias/variance, not a foundation gate. Week 26 S2 says “Unseen regression and inference assessment,” but is one hand OLS exercise with no alternate form or score rule. This evidence is why the new Week 1 diagnostic and Week 16 A/B gate are explicit separate assessment objects.

**Recommended route after a weak Week 16 gate.** Use the gate’s rubric to map each failed proof/assumption item to Weeks 1–15, then insert a 12-week foundation-repair block before graduate material rather than waiting until Calendar 85. A concrete alternative calendar is: Calendar 17–28 repeats Foundations 5–16 with targeted repair; 29–40 covers core 17–28; 41–56 covers 29–44; 57–72 covers 45–60; 73–84 covers 61–72; 85–96 covers 73–84; and 97–105 is capstone plus Final A99 (no OGD). This is a conditional alternative; the main 105-week schedule remains the default. It has reduced coverage: learning for 85–96 is deferred beyond two years. The learner should not silently treat the replacement sequence as full completion of the default graduate curriculum.

Exact free primary references for the canonical module were checked on 2026-10-09 and recorded with course/version, section, and use in `content/math-v2/foundations.ts`:

- Hammack, *Book of Proof*, third edition, author-hosted free text, Chapters 1–5: [official author page](https://richardhammack.github.io/BookOfProof/).
- MIT 18.01SC, Fall 2010, limits/differentiation/integration/Taylor: [official OCW course](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/).
- MIT 18.02SC, Fall 2010, partial derivatives, chain rule, Taylor, extrema, double integrals/change of variables: [official OCW course](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/).
- MIT 18.06SC, Fall 2011, four subspaces, projections, least squares, spectrum and SVD: [official OCW resource index](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/resource-index/).
- MIT 18.100A, Fall 2020, sequences/completeness, continuity/compactness, integration and function sequences: [official OCW notes and readings](https://ocw.mit.edu/courses/18-100a-real-analysis-fall-2020/pages/lecture-notes-and-readings/).
- MIT 6.041SC, Fall 2013, conditioning, random variables/processes and limit theorems: [official OCW resource index](https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/pages/resource-index/).
- MIT 18.05, Spring 2022, sampling, likelihood, confidence intervals, tests, bootstrap and regression: [official OCW course](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/).

The references are supplementary and non-required by default. Definitions, proofs, hypotheses, exercises, hints, solutions and five-point rubrics are authored in the curriculum itself. The CLT is explicitly marked as an assumed named theorem with stated conditions; it is not represented as proved.

## Internal cross-module review: late assessment and foundation route (2026-10-09)

This is an internal consistency review, not an independent external review. I read `content/math-v2/assessment.ts` and `lib/math-foundation-route.ts` without editing either file.

- **P1 — `m2-w099-e1` (and its repeated W100/W105 practice copies): uniqueness proof and Vietnamese solution contradict themselves.** The English proof tests only the event where the difference is positive and larger than `1/k`; it must also test the negative tail. The Vietnamese sentence currently says that a zero integral “does not force the event probability to be zero,” then concludes almost-sure equality. Repair by setting `D=U−V` for two versions, testing `E[1_A D]=0` on both `A={D>1/k}` and `A={D<−1/k}` for each positive integer k, and explaining that on either event the signed integral has magnitude at least `P(A)/k`; therefore each event is null and their countable union gives `D=0` a.s. Translate that same implication into Vietnamese: “tích phân bằng 0 buộc xác suất của mỗi biến cố bằng 0.” This is a mathematical and bilingual-equivalence defect.
- **P1 — `m2-final` forms versus scheduled exam work.** A and B expose only the first four exercise IDs, consistent with the blueprint's four 180-minute parts; however W99 and W101 schedule all five exercises with `mode:'assessment'` and the 180-minute exam agenda. The fifth review exercise is therefore presented as assessed, timed work but omitted from the form and pass score. Mark each fifth item/session as untimed review/study, or include it explicitly and revise the blueprint, duration, form IDs, and scoring rule.
- **P2 — `m2-final.passRule` operationalizes the critical-error clause incompletely.** Each part has its first four-point rubric criterion marked `critical:true`, while the pass rule says “no uncorrected critical error” without specifying how a learner records an error as corrected or whether the critical rubric row must score zero to fail. State a mechanical test, e.g. each part reaches 7/10, the critical row is not zero, and each listed critical error encountered has a written correction before the transfer attempt. Align the Vietnamese rule to the same test.
- **P2 — `m2-w097-t1` covariance notation.** The Gaussian-conditioning formula is correct, but “covariance blocks P,C,S” only defines C and says S is positive definite. Explicitly state `P=Cov(x)`, `C=Cov(x,y)`, `S=Cov(y)≻0` (and therefore the joint block covariance is positive semidefinite) in both languages so the formula's matrix dimensions and assumptions are complete.
- **P2 — `m2-w097-e1` PSD justification uses an undefined residual `e`.** The solution writes `vᵀP⁺v=Var(vᵀe)` without defining `e` in that exercise prompt. Define the linear-update residual (for example, with zero prior mean, `e=x−K(Hx+v_noise)` and independent `v_noise` of covariance R), or state directly that `P⁺` is the covariance of the explicitly defined posterior residual. Use a distinct symbol for observation noise to avoid collision with “error/residual.”
- **P2 — `m2-w097-e4` unobservable-coordinate premise needs nondegeneracy and an observation model.** The prompt does not specify `y_t=Hx_t+v_t`, the measurement-noise independence/covariance, or positive initial variance in coordinate 2. Add these assumptions (with `P_{0,22}>0`; diagonal `Q` with `q_2≥0`; independent measurement noise of positive variance) so the statement concerns uncertainty that actually exists and the gain-induction argument is justified. Otherwise a zero initial variance/no-noise case makes “cannot reduce uncertainty” vacuous.

The other checked late-module arguments were internally coherent under their written hypotheses: in particular, W98's absolutely summable autocovariance calculation, A/B sandwich and likelihood counterexamples, bounded optional stopping, projected-regret constants, Kalman/Joseph covariance identities, and W105's uniform-`L²`-to-`L¹` implication. I found no prerequisite-order defect in `foundationSourceWeek`: Calendar weeks 1–16 source Foundations 1–16; 17–28 source 5–16; 29–40 source 17–28; 41–56 source 29–44; 57–72 source 45–60; 73–84 source 61–72; 85–96 source 73–84; late source weeks are explicitly replayed in the order 97, 98, 99, 100, 102, 104, 100, 98, 97. Each declared prerequisite is placed earlier than its use in this route. The route intentionally omits Final B and defers source weeks 85–96 beyond Calendar week 105, matching the reduced-coverage warning above.

## Internal cross-review: probability/inference W31–41 and W49–54 (2026-10-09)

This is an internal cross-review, not an independent external review. I read the assigned ranges in `content/math-v2/probability-inference.ts` without editing that file.

- **P1 — `m2-w050-t1` (also `m2-w050-e1`): multivariate mean-value theorem is used incorrectly.** The proof writes a vector estimating-equation expansion with a single intermediate point `θ̃ₙ` between `θ̂ₙ` and `θ₀`. In dimension greater than one, the scalar mean-value theorem does not in general provide one common point whose Jacobian times the parameter difference equals the vector difference. Use the exact integral Jacobian `Jₙ=∫₀¹Pₙ∂ψ(θ₀+t(θ̂ₙ−θ₀))dt`; state a uniform local derivative LLN that makes `Jₙ→P−A`, then combine the score residual and iid CLT. This also avoids the extra unexplained remainder in the current displayed expansion.
- **P1 — `m2-w052-t1` and `m2-w052-e2`: randomized permutation rank is called continuous uniform, but the solution obtains a discrete rank.** If `R` is uniformly distributed on `{1,…,N}`, then `R/N` is discrete uniform on `{1/N,…,1}`, not Uniform(0,1). Either state this exact discrete law and its super-uniform level guarantee, or define a genuinely continuous randomized p-value such as `(R−1+U)/N` with independent `U~Uniform(0,1)` (and explain the tie/rank convention). The currently stated nonrandomized conservative result can remain, but its randomized claim must match the construction.
- **P1 — `m2-w053-t1` and `m2-w053-e1`: the multivariate KDE bias formula assumes isotropy not stated by “symmetric.”** Central symmetry `K(u)=K(−u)` only removes the first-order term; it does not imply `∫uuᵀK(u)du=μ₂I`. The general leading bias is `(h²/2) tr(M_K H_f(x))`, where `M_K=∫uuᵀK(u)du`. To retain `(h²μ₂/2)Δf(x)`, explicitly require an isotropic second-moment matrix (and enough moment/tail regularity for the Taylor remainder, e.g. compactly supported K or a stated bounded-density/tail condition). The proof's phrase “isotropic second moments” currently adds a hypothesis missing from the theorem and definition.
- **P1 — `m2-w053` boundary statements contradict each other.** The failure case says boundary bias is “typically O(h),” but `m2-w053-e3` derives `E f̂_h(0)→f(0)/2`, hence an O(1) bias when `f(0)>0`. For a density estimate at the support edge, state this O(1) case explicitly (or qualify O(h) to a setting with `f(0)=0` and additional smoothness); align both languages.
- **P1 — `m2-w053-e5`: Gaussian-kernel variance constant is wrong.** With standard-normal density `f(0)=1/√(2π)` and Gaussian kernel `R(K)=1/(2√π)`, the leading variance is `f(0)R(K)/(nh)=1/(2√2·π·nh)`. The solution writes `1/[2√(2π)nh]`, missing a factor `√π` in the denominator. The squared-bias constant `h⁴/(8π)` is correct.

The remaining reviewed proofs/counterexamples in W31–41 and W49–54 were coherent under their stated hypotheses, including Fatou/reverse-Fatou, Borel–Cantelli, the RN uniqueness argument, WLLN/SLLN scope, the iid characteristic-function CLT, argmax separation, second-order delta method, the finite-variance mean bootstrap, and the Le Cam/Bernoulli constants. Week 53's Taylor-tail condition should be tightened together with the isotropy item; I did not find an additional independently demonstrated counterexample to that omitted tail regularity.

## Internal cross-review: optimization-learning W74–78 (2026-10-09)

This is an internal mathematical consistency review, not an independent external review. I read Weeks 74–78 of `content/math-v2/optimization-learning.ts` without editing that file. The main calculations and Bartlett positive-semidefinite proof check out; the items below concern a missing uniqueness argument, one false implication about the CLT scale, theorem assumptions/source precision, and block-bootstrap wording/examples.

- **P2 — `m2-w074-t1`: the statement claims uniqueness but the proof constructs only one solution.** The geometric filter is square-summable for `|φ|<1`, and its Yule–Walker calculations are correct. Add a short uniqueness argument: if two finite-variance stationary causal solutions use the same innovations, their difference satisfies `D_t=φD_{t−1}`; stationarity gives `E D_t²=φ² E D_t²`, hence `D_t=0` a.s. (or iterate the recursion and use the finite second moment). The current proof's uses of innovation orthogonality are valid for the causal filter solution because its past is generated by past innovations.
- **P1 — `m2-w076-t1` proof says the CLT assumptions produce a “nonzero √n-scale limit.”** The stated theorem only guarantees a nondegenerate normal limit when `Ω>0`; W76-E3 itself has `Ω=0` and a normalized sum tending to zero. Replace that sentence with: the mixing/moment conditions yield the stated CLT, while a nonzero limit additionally requires `Ω>0`; the variance scale alone does not prove a CLT. Keep the telescoping example as a degenerate-limit consequence, distinguishing it from the theorem's nondegenerate case.
- **P2 — `m2-w076` Gaussian AR(1) mixing-rate claims need their own source or argument.** The cited CMU 36-754 Chapter 27, Theorem 396 supports the α-mixing CLT and is accurately marked assumed, but it does not establish the separate assertion that Gaussian AR(1) has geometrically decaying α-mixing coefficients. W76-E4 responsibly asks for that implication to be cited if not proved; provide a primary mixing reference or a concise model-specific derivation (e.g. via the Gaussian Markov transition), rather than treating geometric covariance decay by itself as a general proof of mixing.
- **P2 — `m2-w077-t1`: HAC consistency is sourced but not stated with checkable hypotheses.** The zero-padded Bartlett sum-of-squares identity correctly proves finite-sample PSD, and the sandwich covariance formula follows from the given asymptotic linearization. The separate consistency claim leaves “moment/mixing conditions controlling truncation” unspecified while pointing to Newey–West Theorem 2. Either state that exact theorem's assumptions and bandwidth conditions, or label a clearly sourced sufficient consistency result as assumed and give its hypotheses. The Newey–West paper's PSD result supports the algebra here; its consistency result is conditional and does not make the current shorthand “stationary mixing CLT” by itself a complete theorem statement.
- **P1 — `m2-w078-e2` calls generic sufficient block-length rates necessary.** `b_n→∞` and `b_n/n→0` are the standard rates in Künsch's general stationary-mean consistency result under additional moment/dependence assumptions, but they are not necessary for every process: the ordinary bootstrap (`b=1`) is consistent for an iid sample mean. Recast the prompt/answer as explaining why those rates are used for generic dependent-sequence guarantees, and state the model-specific exception. Also avoid saying all long-lag covariance contributions must be absent in every process; bounded blocks cannot reproduce arbitrary dependence beyond their length, while an iid process has no such omitted covariance.
- **P2 — `m2-w078-e1` contradicts the MBB definition's resample length.** The definition says blocks are concatenated until `n` observations are assembled, but the exercise has `n=6`, samples two blocks of length 2, and returns only 4 observations. Either define this item as a length-4 illustrative concatenation, or give enough block starts and trim the last block to length 6; otherwise it is not the described size-`n` bootstrap sample.
- **P2 — `m2-w078-t1` cites Künsch accurately at the broad result level but not at theorem-hypothesis level.** Künsch (1989), *Annals of Statistics* 17(3), 1217–1241, is the relevant primary paper: its abstract explicitly gives consistency for block length `l→∞`, `l/n→0` under “appropriate conditions.” The current statement acknowledges stronger conditions than stationarity and the proof is correctly marked assumed, but “short-memory” and “Künsch's moment and weak-dependence conditions” are not a self-contained list a learner can check. State the exact selected theorem conditions, or identify the cited claim as a black box whose complete assumptions must be consulted in the article; do not imply stationarity plus the two rates is sufficient by itself.

The bibliography matches the scope of the main results: [CMU 36-754 notes, Chapter 27, Theorem 396](https://www.stat.cmu.edu/~cshalizi/754/notes/all.pdf) is the direct source for the stated α-mixing CLT; [Newey and West (1987)](https://www.nber.org/papers/t0055) is directly relevant to Bartlett PSD and conditional HAC consistency; and [Künsch (1989)](https://projecteuclid.org/journals/annals-of-statistics/volume-17/issue-3/The-jackknife-and-the-bootstrap-for-general-stationary-observations/10.1214/aos/1176347265) is directly relevant to stationary block-bootstrap consistency and its block rates. Their existence and topic were verified against the primary course/publisher pages; I did not claim an independent external review of the module.

## Internal cross-review: probability-inference W45–48 and W55–60 (2026-10-09)

This is an internal mathematical consistency review, not an independent external review. I read the requested weeks, including both W60 assessment forms, without editing `content/math-v2/probability-inference.ts`.

- **P2 — `m2-w048-t1`: state the estimator-specific score interchange and nondegenerate information premise explicitly.** The Cramér–Rao covariance/Cauchy–Schwarz derivation is correct once `∂θ Eθ[T]=Eθ[T Sθ]` is justified and `Varθ(T)<∞`, `0<I(θ)<∞`. The definitions mention differentiation under the integral generically and finite score information, but do not explicitly require domination/interchange for `T fθ` or positive information; the proof later refers to integrability that is not stated. Add those assumptions (or say the bound is trivial for infinite variance and formulate the regularity for each finite-variance T). W48-E2 already lists `E[T²]<∞` and `0<I(θ)<∞`, and W60-A1 names common support/interchange, so align the main theorem with the exercises.
- **P1 — `m2-w055` failure case and `m2-w055-e3`: the known-zero-mean covariance estimator need not be singular at `p=n`.** Here `S=n⁻¹XXᵀ` for a `p×n` matrix of iid nondegenerate Gaussian columns. At `p=n`, X is square and full rank almost surely when `Σ≻0`; S is invertible almost surely. Singularity follows when `p>n` (or with a sample-centered estimator whose rank is at most `n−1`). Correct “when `p≥n`” / “typically singular at `p=n`” to `p>n`, and state the positive-definite Gaussian premise; preserve the known-mean/denominator-n convention.
- **P1 — Week 58 worked example: the English largest-passing BH rank is wrong and disagrees with Vietnamese.** For ordered p-values `.004,.018,.041,.20` at `q=.05`, `.041>.0375`, so rank 3 fails; ranks 1 and 2 pass, hence the largest passing rank is `k=2`. The English solution currently says `k=3` while then correctly rejecting only the first two; the Vietnamese says `k=2`. Change the English value to `k=2` (W58-E2 already has the correct reasoning).
- **P2 — `m2-w048-e5`: differentiable one-to-one reparameterization is not enough to use `dθ/dη`.** A differentiable injective map need not have a differentiable inverse at every point (e.g. `η=θ³` at zero). Add a local diffeomorphism condition such as `g′(θ)≠0` at the parameter point, or restrict the identity to points where the inverse derivative exists and the reparameterized model remains regular.

The other checked arguments were mathematically coherent under their stated assumptions: W45's finite common-support factorization proof; W46 Rao–Blackwell/completeness uniqueness and its restricted-binomial counterexample; W47 the randomized Neyman–Pearson inequality; W55 Gaussian Frobenius-risk and deterministic-target shrinkage calculations; W56 lasso cone and constants 9/12; W57 Beta–Bernoulli update/predictive identities; W58 Holm/Bonferroni and independent-null BH guarantees; W59 studentized Wald coverage and the exact `.95²` post-selection calculation; and W60's Le Cam testing reduction and both five-task forms. I found no additional mathematical issue in those reviewed arguments.

## Cross-review repairs in owned foundations content (2026-10-09)

Following an internal review, I corrected two authored mathematical details in `content/math-v2/foundations.ts`:

- **Week 15 spike counterexample:** changed the spike support from `[0,1/n]` to `(0,1/n]` in both languages. The sequence now converges pointwise to zero at every x in `[0,1]`, including x=0, while its integral remains 1. This preserves the intended failure of pointwise convergence to imply integral convergence.
- **Week 28 permutation enumeration:** for A-pairs `{1,2},{1,4},{1,5},{2,4},{2,5},{4,5}` from pooled values `{1,2,4,5}`, corrected the six A−B differences in both languages to `−3,−1,0,0,1,3`. The two-sided tail count for observed difference `−1` remains `4/6`.

