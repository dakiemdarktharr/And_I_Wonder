# Legacy weeks 97–105: mathematical audit

All 43 sessions read at baseline. Classification measures the mathematical work required by the tasks, not the learner's ability or the usefulness of research hygiene. “Intended” is the role implied by the old title/placement, not a proven standard.

| Week / topic | Prerequisite stated by v1 | Intended / observed | Capabilities | Theory / exercise / answer / assessment evidence | Gap | Decision |
|---|---|---|---|---|---|---|
| W97 Adversarial methodological review | Read a results table, compute a mean and a percentage, and distinguish a prediction from its later outcome. All data required today are provided below. | specialization / foundation | Application, arithmetic, numerical diagnosis | Delayed features, weak baseline, seed selection, MAE/RMSE arithmetic and repair severity. Solutions explain methodological errors; no graduate rubric or unseen proof. | Leakage/baseline/selection examples are worthwhile research hygiene, but there is no probability or optimization proof sequence. | replace |
| W98 Revise without selecting a convenient story | Read a results table, compute a mean and a percentage, and distinguish a prediction from its later outcome. All data required today are provided below. | specialization / foundation | Application, arithmetic | Seed selection, dependency graph descendants, difference −1 versus +0.5, contaminated holdout and reviewer response. Model answers are prose or elementary calculations. | Change classification and dependency closure are project workflow, not graduate mathematical inference. | archive |
| W99 An independent reproduction package | Read a results table, compute a mean and a percentage, and distinguish a prediction from its later outcome. All data required today are provided below. | specialization / foundation | Numerical checking, application | n/MSE tolerance, floating-point equality, percentage caption, permission card and notebook cell order. No original mathematical gate. | Reproducibility contracts do not assess mathematical theorem conditions or proof competence. | archive |
| W100 Technical presentation and oral defense | A completed, reproducible result with a prespecified metric and honest limitations. | specialization / foundation | Computation, application | 8.3% MAE reduction, normal-interval arithmetic, slide/Q&A arithmetic and concise skeptical-panel answers. No theorem derivation or proof rubric. | Presentation quality is useful but not a substitute for rigorous probability, inference, optimization or dependence. | archive |
| W101 Research portfolio and applications | A public research artifact with auditable results and a factual project record. | specialization / foundation | Computation, application | CV bullet, evidence README, fictional role mapping, mean/MAE of three returns, truthful live-trading answer. Outputs concern communication rather than graduate mathematics. | CV and application exercises are outside the mathematics upgrade; no measured proof readiness. | archive |
| W102 Choosing the next research stage | A CV/portfolio audit and a clear account of research interests and constraints. | specialization / foundation | Computation, application | Fictional funding constraints, weighted scores 4.50/4.40, chronological row ranges and day-45 contingency. Decisions are not inference theorems. | Funding/decision/proposal planning has no graduate mathematical assessment. | archive |
| W103 Graduate-level skills assessment | Completed probability, inference, optimization, and forecasting work from the preceding curriculum. | graduate core / upper-undergraduate | Computation, finite derivation, theorem application | A1 posterior 2/3; A2 two-sided p=112/1024; A3 minimize (x−4)² subject x≤1; A4 lagged pairs; A5 group conditional means 3/6 and risk 4/6.25. Answers are mostly correct for these tasks; this does not establish a graduate comprehensive standard. | The advertised graduate assessment mostly consists of finite Bayes, an exact small Bernoulli test and scalar KKT. CE identity is checked only on a finite two-group example. No UI, general CE proof, estimator asymptotics, convergence rate or dependent CLT reasoning. | replace |
| W104 Final manuscript and public release | A complete draft and reproducible result lineage with known limitations. | specialization / foundation | Application, arithmetic | Unsupported profit claim, mixed intervals, run provenance, hypothetical chart rights, 99-versus-100 prediction mismatch. No mathematical proof rubric. | Manuscript and release review is project hygiene, not a mathematics qualifying gate. | archive |
| W105 Two-year research handoff | Released manuscript, reproducibility package, and evidence-based skill audit. | specialization / foundation | Application | Skills-gap retest suggestion, month-three provenance checks and N/hash reuse conditions. Three sessions preserve the calendar; they do not contain a graduate exam. | Handoff checklists identify next actions but do not demonstrate course-level mathematical competence. | replace |

## Session evidence

### W97

- **S1: Audit feature availability**. Theory: A timestamp saying which period a value describes is not necessarily its publication time. A forecast may use a feature only if the feature was actually available before the decision. Revised historical data can also leak later knowledge. Record event time, release time and decision time separately.
  Exercise: Decision is 09:00; releases are 08:55, 09:00 and 09:05. A protocol requires strictly earlier availability. Which rows qualify and why?
  Model answer: Only 08:55 qualifies. The 09:00 row fails the explicitly strict boundary; 09:05 is in the future. If simultaneous releases are intended to be usable, the protocol needs a documented ordering and latency model rather than silently changing the inequality.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S2: Challenge a weak baseline**. Theory: An improvement over a weak comparator may say little about the proposed method. A baseline must follow the same information constraints and receive a reasonable, disclosed tuning budget. Simple persistence is often informative for slowly changing series. Adding it is a validity check, not a guarantee that it will always win.
  Exercise: Targets=[4,5], model=[3,3], persistence=[3,4], zero=[0,0]. Compute MSE and state the fair conclusion.
  Model answer: Model MSE=(1+4)/2=2.5; persistence=(1+1)/2=1; zero=(16+25)/2=20.5. The model improves over zero but not persistence on these two targets. A broad superiority claim is unsupported, even though the zero-baseline percentage improvement is large.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S3: Selection can manufacture a winner**. Theory: Testing many ideas and reporting only the best increases false discoveries. For m independent tests each with false-positive probability α, probability of at least one false positive is 1−(1−α)^m. Independence is an assumption here. A union bound mα does not require independence, though it can be loose.
  Exercise: For five independent tests, assuming all five null hypotheses are true and each test uses α=0.05, compute the chance of at least one false positive and the union bound.
  Model answer: Exact under independence: 1−0.95⁵=0.226219≈22.62%. Union bound=0.25=25%, valid even without independence. The bound is larger because it can count overlapping false-positive events more than once.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S4: A metric implementation can change the answer**. Theory: RMSE is sqrt(mean(error²)); mean absolute error is mean(|error|). Averaging row-level square roots of squared errors computes MAE, not RMSE. Names in code are not evidence of correct implementation. Use a fixture where errors have unequal magnitudes so the two metrics differ.
  Exercise: For errors [−1,3], calculate MAE, MSE and RMSE. Which quantity equals the buggy row-root average?
  Model answer: MAE=(1+3)/2=2; MSE=(1+9)/2=5; RMSE=√5≈2.236. The buggy expression gives MAE=2. MAE and RMSE use target units; MSE uses squared target units. Equal-magnitude errors would not distinguish the formulas.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S5: Prioritize review findings**. Theory: Severity depends on how a defect changes the scientific conclusion. A leakage bug can invalidate every result; a mislabeled axis may leave calculations valid but communication wrong. A review should distinguish confirmed defects from questions and assign a concrete acceptance test to each requested repair.
  Exercise: Review finds a shuffled time split, a typo in the title and a missing seed value. Rank repairs and state what must be rerun.
  Model answer: First replace the shuffled split with the declared chronological protocol and rerun all affected evaluation. Next recover or explicitly mark the missing seed; if the run cannot be identified, regenerate it under a recorded seed. Fix the title typo without rerunning numerical work. Preserve old outputs as invalidated evidence rather than erasing the history.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

### W98

- **S1: Correction or new exploration?**. Theory: Classify changes by their cause. A bug fix restores the originally intended procedure. An amendment changes a planned procedure for a stated reason. Exploration asks a new question after seeing data. These categories can coexist in a project, but calling all changes “bug fixes” conceals researcher choices.
  Exercise: After seeing poor results, an author changes random seed until loss falls. Is this a correction? How should the work be reported?
  Model answer: It is selection/exploration unless a concrete seed-related defect was established. Retain every attempted seed and report a prespecified aggregate or a clearly exploratory distribution. Do not present the selected minimum as an ordinary single-run estimate; validate any new procedure on untouched runs.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S2: Rerun the dependency closure**. Theory: Outputs form a directed dependency graph. If a node changes, every descendant may be stale. A changed metric requires rescoring and rebuilding dependent tables and figures, but may not require retraining if saved predictions remain valid. Rerunning only the favorable figure leaves an inconsistent manuscript.
  Exercise: D→P, P→M, M→T, M→F, T→A, F→A. If T’s formatting changes without altering values, which descendants need rebuilding? If M changes, what expands?
  Model answer: A formatting change rebuilds T and A if A embeds T; P,M,F remain valid. A change to M requires M,T,F,A. Neither case requires retraining P when its stored predictions and inputs are unchanged. Dependencies should be explicit rather than guessed from filenames.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S3: Report before and after honestly**. Theory: A correction table keeps old and new values side by side and labels the old result invalid. The change in the conclusion matters more than whether the code diff is small. Use paired comparisons against the same corrected baseline, because a fix may affect both methods.
  Exercise: Old scores A=2,B=3; corrected A=4,B=3.5. Compute both differences d=A−B and explain the conclusion change.
  Model answer: Old d=−1 favors A. Corrected d=+0.5 favors B. The old comparison is superseded, and the correction reverses the sample ranking. Keeping only A’s change from 2 to 4 would miss that the baseline also changed.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S4: Keep new hypotheses separate**. Theory: After discovering a subgroup pattern, testing the same subgroup on the same data is not independent confirmation. Freeze the new hypothesis and evaluate on untouched data generated or held out under an explicit rule. If no fresh data remain, report exploration and uncertainty rather than manufacture a confirmatory label.
  Exercise: You inspected runs 1–30 to choose a threshold, then call runs 21–30 a holdout. Explain the problem and repair options.
  Model answer: Runs 21–30 helped choose the threshold, so they are discovery data. Either collect/generate a genuinely untouched set after freezing the rule, or label the current result exploratory. Renaming files does not remove the information already used in selection.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S5: Answer a reviewer with a verifiable change**. Theory: A response letter links each comment to a decision, a concrete change and evidence. Agreement without action is incomplete. Disagreement can be reasonable when explained with the study’s scope and evidence. Avoid promising a fix that the manuscript or code does not actually contain.
  Exercise: A reviewer asks for market profitability, but your study has synthetic forecasts and no execution data. Write a respectful, evidence-based response.
  Model answer: “We cannot estimate executable profitability from these synthetic forecast records. We have removed trading-performance language and now state that the study measures forecast loss under the specified generator. Execution-aware evaluation is a separate future study requiring prices, fills and costs.” This addresses the concern through an honest scope correction.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

### W99

- **S1: Define the reproduction contract**. Theory: A reproduction contract states the command, input, expected output and tolerance. “Run the notebook” is ambiguous if hidden cells or local files are required. Separate exact assertions, such as row count, from floating-point comparisons where a documented tolerance is appropriate.
  Exercise: Expected n=3 and MSE=2 within 0.001. A reports n=3,MSE=2.0005; B reports n=2,MSE=2. Which pass?
  Model answer: A passes: count matches and |2.0005−2|=0.0005≤0.001. B fails the count even though its scalar matches exactly. A contract is a conjunction of requirements, not a choice among them.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S2: Environment and determinism**. Theory: A random seed controls a random-number stream only within the specified generator and execution setup. Different library versions or parallel reduction orders may change outputs. Record versions and distinguish deterministic fixture expectations from stochastic experiment summaries. Do not force exact equality across hardware when the method only promises a tolerance.
  Exercise: Two runs return 0.30000000000000004 and 0.3. A contract uses absolute tolerance 10⁻¹². Are they numerically consistent? Does this prove all outputs reproducible?
  Model answer: Their difference is about 5.55×10⁻¹⁷, below 10⁻¹², so this field passes. It does not verify row alignment, other metrics, manifests or the scientific claim. Floating-point agreement is one check within a broader contract.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S3: Trace a figure back to a command**. Theory: A reader should be able to regenerate a figure from its source data using a named command. Manual edits to numeric labels break this chain. Store presentation choices separately from computed results, and validate that displayed values match the source table. A source hash detects changes but does not prove data quality.
  Exercise: Baseline=4, model=3.2 but a manually edited caption says “30% reduction.” Calculate the correct value and name the defect.
  Model answer: Reduction=(4−3.2)/4=0.2=20%. The caption is inconsistent with its data source, likely stale or manually altered. Regenerate it from the shared result record and add an assertion; changing the bar height to fit the caption would falsify the result.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S4: Package only material you can redistribute**. Theory: Publicly readable does not automatically mean redistributable. For this exercise, permissions are supplied as explicit fictional license cards, so no legal interpretation is required. Keep code, data and figures separate because their permissions may differ. If redistribution is forbidden, provide an authorized acquisition instruction and a synthetic fixture rather than bundling the file.
  Exercise: A new card D allows linking but forbids copying. Can you include D’s PDF in the repository? What can the README include?
  Model answer: Do not bundle the PDF. The README may include the permitted link and identify D as optional background. The required runnable example must use permitted inputs such as C. This answer follows the fictional card; real assets require checking their actual terms.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S5: Run a clean-room rehearsal**. Theory: A clean-room rehearsal starts from a fresh copy and follows only the public instructions. It exposes hidden dependencies such as absolute paths, untracked data or notebook state. Log the first failure before fixing it, then repeat from a fresh start. Success means the declared contract passed, not that the model is scientifically correct.
  Exercise: A notebook passes only after cell 8 has been run manually before cell 3. Explain the hidden dependency and give an acceptance test.
  Model answer: Cell 3 depends on state created later in cell 8, so the visible order is incomplete. Move initialization before its first use or refactor into explicit functions. Acceptance: restart the kernel, run all cells top to bottom and verify the contract without manual intervention. A saved successful output is not a substitute for this test.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

### W100

- **S1: Build the one-sentence result**. Theory: A research talk compresses an argument: question, design, estimate, uncertainty, implication. State the target, comparator, sample period, and primary metric before interpretation. A claim must not exceed the population or period studied. Distinguish validation differences from future performance or causal effects. Keep secondary analyses after the primary result. Use verbs matching the design, such as measured, associated, or predicted. A listener should be able to repeat the central claim without making it stronger.
  Exercise: If MAE=.011 vs .012 and the improvement interval is [−.002,.004], write the result and name one unsupported claim.
  Model answer: Relative reduction=.001/.012=.0833=8.3%. The interval crosses zero, so say MAE was lower in this period but no improvement remains plausible. “It will make money” is unsupported because no returns, costs, or future period were evaluated.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S2: Show uncertainty honestly**. Theory: An interval must identify the estimand, sampling unit, and method. For serial data, resample blocks or use another justified dependence-aware procedure; row-wise IID bootstrap may break temporal structure. A confidence interval crossing zero does not prove equality: effects on both sides remain compatible with the data and method. A p-value is not the probability a hypothesis is true. Plot the estimate, reference line, interval, sample size, units, and method, then explain how uncertainty affects a decision.
  Exercise: For Δhat=.001, SE=.0015, calculate the 95% interval. Does it establish positive improvement?
  Model answer: Endpoints are −.00194 and .00394, so zero is included and positive improvement is not established. This also does not prove equivalence: set a margin in advance and require the full interval to lie within it.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S3: Budget the 15-minute slide deck**. Theory: Slides are an information budget, not a projected paper. Each should answer one audience question. Charts need units, baseline, period, and uncertainty; axes must not hide small effects. Keep primary evidence in the main talk and derivations in backup slides. Use consistent labels, readable type, and verbal descriptions so meaning is not encoded only in color or animation. Timing includes pauses and transitions. If Q&A must fit the same slot, reserve it before distributing the remaining minutes across slides.
  Exercise: Eight slide durations sum to 15 minutes. If the slot includes 3 minutes Q&A, how long may the talk last?
  Model answer: The talk may last 12 minutes. Reduce the slide budget by three while preserving question, main estimate, uncertainty, limitation, and takeaway; rehearse to verify rather than assuming the edited plan fits.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S4: Answer the skeptical panel**. Theory: Classify a question as definition, design, result, robustness, or implication. Answer directly, cite evidence, then state the boundary. If a value is unknown, say so and offer a test. A hypothetical calculation is not an empirical result. Concede a valid limitation and explain how it narrows the claim. Keep backup slides for split, metric, interval, and ablation. The aim is clarity, not winning an exchange. Replace an unsupported central claim rather than defending it because it is central.
  Exercise: A reviewer says lower MAE proves profit. Answer in two sentences with evidence and boundary.
  Model answer: “No. The observed MAE difference is a forecast-error metric on one held-out period. Returns, costs, capacity, and live execution were not evaluated, so it does not establish profit.” This directly answers and names absent evidence.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S5: Timed rehearsal and revision**. Theory: Rehearsal tests audience comprehension and timing, not just fluency. Record time per slide and note where listeners lose the argument. Feedback should be observable (“comparator appeared after result”), not vague taste. Score question, methods, estimate/uncertainty, scope, readability, time, and answers. Change one structural issue, rerun, and log it. A polished talk must not silently strengthen a claim. Leave transition margin; exact-limit timing is fragile.
  Exercise: A talk lasts 16:20; cut 70 seconds and then 25 more. What is the new duration?
  Model answer: 16:20−1:10=15:10; 15:10−0:25=14:45. Replace “reliably improves” because the interval includes zero. Say the observed MAE was lower by 8.3% in this period, with uncertainty including no improvement.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

### W101

- **S1: Write evidence-based CV bullets**. Theory: A research CV is an evidence index. A strong bullet states what you did, the artifact or method, a measured outcome, and the scope. Use “implemented” only if you wrote or maintained the code; distinguish your contribution from a team result. Numbers need units and a denominator. A preprint is not peer reviewed unless it has been; a simulation is not deployment. Avoid skill bars and unsupported superlatives. Place the most relevant project near the top and make every technical claim traceable to a repository, report, or reproducible test.
  Exercise: Turn this into one CV bullet: built 2,500-row chronological benchmark; 3 folds; MAE .011 vs .012 on one 100-date holdout; interval crosses zero.
  Model answer: “Implemented a 2,500-row chronological forecasting benchmark with three expanding folds; candidate MAE=.011 vs .012 zero baseline on one 100-date holdout, with uncertainty including no improvement.” This avoids causal, future, and profit claims.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S2: Make the project portfolio auditable**. Theory: A portfolio is stronger when another person can reproduce one central result quickly. A repository should identify the question, environment, data rights, exact command, expected output, and known limitations. Keep raw private data out of public code. Separate source, configuration, result, and narrative; record hashes or versions so evidence is not silently replaced. A result table without provenance is difficult to trust. The reviewer should not need to infer which script generated a number or which claims are exploratory.
  Exercise: README claims MAE=.011. Which files and command make this claim reproducible, and what caveat belongs next to it?
  Model answer: Link results/holdout.json, config/benchmark.yaml, commit a17, and run `python -m benchmark --config config/benchmark.yaml`. Verify output candidate=.011, baseline=.012, n=100. State that the interval includes zero and does not establish profit.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S3: Match applications to fictional research roles**. Theory: A job description is a set of required tasks, not a prompt to imitate keywords. Extract must-have skills, evidence expected, and unknowns. Map each requirement to a concrete artifact; label adjacent skills honestly and state gaps with a learning plan. Tailor the first paragraph and project order, but do not alter dates, authorship, performance, or degree status. For a research role, a careful negative result and a reproducible benchmark can be stronger evidence than an inflated “alpha” claim.
  Exercise: Which role best matches the documented C++ plus chronological benchmark evidence, and what gap should not be concealed?
  Model answer: Role A matches the C++ and time-aware benchmark evidence best. Role B remains a reasonable stretch application, but proof-writing evidence is missing; state this honestly and attach a sample proof-writing plan rather than claiming expertise. Role C is not supported until deployment/pipeline testing is documented.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S4: Practice a quantified research interview**. Theory: Technical interviews reward explicit assumptions and a checkable chain of reasoning. Before calculating, clarify whether the task asks for prediction error, investment return, or a causal quantity. Write units and denominators. For code, state input/output contracts and edge cases before optimizing. For mathematics, show the key derivation instead of jumping to a memorized formula. If the prompt is under-specified, request the missing convention and then solve a stated version. A good answer includes a sanity check and a limitation.
  Exercise: For returns .02,−.01,.01, compute the mean; for zero forecasts compute MAE. Are they interchangeable?
  Model answer: Mean return=(.02−.01+.01)/3=.02/3=.00667. Zero forecast residual magnitudes are .02,.01,.01, so MAE=.04/3=.01333. They are not interchangeable: one summarizes signed returns, the other forecast error. Three observations do not establish a repeatable edge.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S5: Conduct a truthful mock interview**. Theory: A research interview tests both skill and judgment. Prepare a concise project summary, then let the interviewer probe assumptions, code, uncertainty, and failure modes. Use a structured example, but keep each part factual: context, task, action, result, and limitation. Do not disclose confidential information, exaggerate authorship, or fabricate a metric. When experience is missing, identify the nearest evidence and a concrete learning plan. Ask about supervision, data access, evaluation standards, and feedback cadence; these reveal whether the role supports rigorous work.
  Exercise: How do you answer “Have you run a live trading system?” using only documented prototype and benchmark experience?
  Model answer: “No, I have not run a live trading system. I have built agentic workflow prototypes and a chronological forecasting benchmark, and can show its tests. I would need to learn the team’s deployment and risk controls.” This is specific and verifiable without inflating experience.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

### W102

- **S1: Compare MSc, PhD, and RA pathways**. Theory: A next-stage choice depends on the work you want, current preparation, finances, mentorship, and tolerance for uncertainty. An MSc can provide coursework and a credential but may require tuition and does not ensure research access. A PhD offers sustained original research and often funding, but has long duration and supervisor risk. An RA role builds evidence and lets you test fit, but admission later is not guaranteed. Treat advertised outcomes as uncertain, separate hard constraints from preferences, and compare counterfactuals: what evidence or option will each year create?
  Exercise: With no tuition reserve and funding mandatory, which fictional route violates the hard constraint: MSc 24 total tuition, funded PhD 32/year, or RA 28/year?
  Model answer: The MSc as described violates the funding constraint because it requires 24 tuition units and no reserve exists. The funded PhD and salaried RA do not violate that particular constraint, though living cost, location, duration, and actual written guarantees still need verification. The figures are fictional planning inputs.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S2: Inspect fictional lab and funding cards**. Theory: A lab offer bundles research fit, supervisor practice, funding certainty, location, workload, authorship norms, and exit options. Compare written details, not prestige labels. Ask who supervises daily, how projects are scoped, what happens if funding changes, and whether data access is permitted. A stipend number is not disposable income; compare it with fees and local cost assumptions. Lab cards in this lesson are fictional decision exercises. Their terms should never be presented as current openings or real institutions.
  Exercise: Which fictional card guarantees admission to a later graduate program? How do you distinguish this from research fit?
  Model answer: None guarantees later admission. Northstar is a PhD offer already; River explicitly makes no graduate-admission promise; Delta is an MSc and also gives no admission guarantee. Research-fit scores of 4/5 or 5/5 describe topic alignment, not an admissions decision.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S3: Use a decision matrix without hiding values**. Theory: A weighted matrix makes preferences visible but does not turn them into objective truth. First remove options violating hard constraints. Then choose criteria, define score anchors, and set weights before seeing the total. Run sensitivity analysis: if a small weight change flips the winner, the decision is fragile and should preserve options. Include uncertainty intervals or ranges where scores are not known. The matrix supports a discussion; it cannot replace written offer verification, personal constraints, or supervisor conversations.
  Exercise: With weights (.40,.25,.25,.10), calculate total for River scores (5,4,4,5) and compare Northstar (4,5,5,3).
  Model answer: River=.40·5+.25·4+.25·4+.10·5=2+1+1+.5=4.50. Northstar=.40·4+.25·5+.25·5+.10·3=1.6+1.25+1.25+.3=4.40. River leads by .10, smaller than plausible scoring error, so inspect the uncertain terms rather than treating the ranking as certain.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S4: Draft a six-month research proposal**. Theory: A short proposal is a testable plan, not a promise of a positive result. State a question and target estimand, related mechanism, data-generating or acquisition plan, comparator, chronological split, metric, uncertainty method, and failure criterion. Separate exploratory choices from confirmatory evaluation. A milestone should have an artifact and a decision gate. Synthetic data can test code and known behavior but cannot support a real-market claim. A negative result is still useful if the design can distinguish “no effect” from a broken or underpowered experiment.
  Exercise: A synthetic series has 10,000 rows and regime shift after 7,000; validation has 1,500 rows and test 1,500. State exact inclusive row ranges.
  Model answer: Train=1–7,000 (7,000 rows); validation=7,001–8,500 (1,500); test=8,501–10,000 (1,500). Counts sum 7,000+1,500+1,500=10,000 with no gap or overlap. Fit transforms on train only and do not inspect test during tuning.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S5: Write the decision memo and contingency plan**. Theory: A decision memo separates facts, assumptions, preferences, and unknowns. Name the chosen path and why it meets hard constraints; record what would make it fail. Prefer reversible steps while uncertainty is high: verify funding in writing, speak to current trainees, and define a review date. Do not treat a weighted score as objective truth. A contingency should specify a trigger, next action, budget consequence, and deadline. The six-month research proposal should fit the actual supervisor, data permissions, and time available.
  Exercise: River scores 4.50, Northstar 4.40. If a day-30 data-access condition fails and alternate applications take 15 days, what deadline should the memo set?
  Model answer: Start alternate applications by day 45 (day 30+15). State the day-30 trigger clearly: no written data access or supervision confirmation. The narrow .10 score lead is not a reason to ignore this condition; the backup preserves an option.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

### W103

- **S1: Probability and conditioning assessment**. Theory: A probability model begins with events and a declared sample mechanism. The law of total probability partitions an event B over disjoint regimes Aᵢ: P(B)=ΣP(B|Aᵢ)P(Aᵢ). Bayes reverses conditioning: P(A|B)=P(B|A)P(A)/P(B). Conditional expectation is a probability-weighted average. State the conditioning information and verify probabilities normalize. When regimes are latent, observing an outcome updates belief; it does not reveal the regime with certainty. Distinguish posterior probability under a model from a causal statement about what the regime did.
  Exercise: New assessment: P(H)=0.2, P(L)=0.8, P(S|H)=0.8 and P(S|L)=0.1. Find P(S), P(H|S), and explain why the posterior is not 0.8.
  Model answer: P(S)=0.2×0.8+0.8×0.1=0.24. The joint probability P(H∩S)=0.16, so P(H|S)=0.16/0.24=2/3≈0.6667. The supplied 0.8 is P(S|H), a different conditional probability. The large low-regime prior still contributes successes to the denominator.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S2: Inference and uncertainty assessment**. Theory: Inference names a target, estimator, sampling model, and uncertainty procedure. A p-value is the probability, under a null and assumptions, of a statistic at least as extreme as observed; it is not the probability the null is true. Confidence coverage is a repeated-sample property. A Bayesian posterior probability conditions on likelihood and prior. Exact and approximate methods can differ at small n. Report effect size and interval alongside a test, and never convert failure to reject into proof of no effect. Check whether the sample design satisfies independence or dependence handling.
  Exercise: New assessment: observe 8 successes in 10 independent Bernoulli trials under H0:p=0.5. Given C(10,8)=45, C(10,9)=10, C(10,10)=1, calculate the upper tail and symmetric two-sided p-value. Interpret the result at 0.05.
  Model answer: P(X≥8)=(45+10+1)/2^10=56/1024=0.0546875. By symmetry, the two-sided tail is 112/1024=0.109375. Do not reject at 0.05 under this stated test. The estimate is 0.8, but failure to reject neither proves p=0.5 nor assigns probability 0.109375 to H0.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S3: Constrained optimization assessment**. Theory: For constraints g(x)≤0, use L=f+λg with λ≥0. KKT requires primal feasibility, dual feasibility, stationarity, and complementary slackness. At a binding boundary, solve stationarity and verify multiplier sign; convexity plus an appropriate constraint qualification can make KKT sufficient for a global optimum. Projection maps an unconstrained step back to a feasible set but can alter the direction. Always distinguish the constrained minimizer from the unconstrained stationary point and check the objective values.
  Exercise: New assessment: minimize (x−4)^2 subject to x≤1. Find x*, objective and KKT multiplier for g(x)=x−1. Verify all conditions and explain global optimality.
  Model answer: The feasible minimizer is x*=1 with f=9. Stationarity gives −6+λ=0, hence λ=6≥0. Feasibility g(1)=0 and complementary slackness λg=0 hold. The objective is convex, the constraint affine, and a strictly feasible point exists; these KKT conditions certify the global optimum.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S4: Code and leakage assessment**. Theory: A time-aware dataset needs explicit feature-availability and target-release times. For a one-step return target r_t=P_{t+1}/P_t−1, the value is not known at forecast origin t until the next close. A lag feature may use r_{t−1}, not r_t. Separate feature construction from splitting; transformations fit on training rows only. Tests should assert date alignment, no future access, and expected values on a tiny fixture. Passing a high-level API test is insufficient if its indexes silently misalign.
  Exercise: New fixture: prices [100,110,99,108.9]. Implement lagged pairs x=r[t−1], y=r[t] for t=1,2. Show the expected rounded pairs and a test that rejects x=r[t].
  Model answer: Returns are approximately [0.1,−0.1,0.1]. Correct pairs are [(0.1,−0.1),(−0.1,0.1)]. A runnable check:
```python
p = [100,110,99,108.9]
r = [p[i+1]/p[i]-1 for i in range(3)]
rows = [(round(r[t-1],6), round(r[t],6)) for t in (1,2)]
assert rows == [(0.1,-0.1),(-0.1,0.1)]
```
The buggy same-index version returns [(-0.1,-0.1),(0.1,0.1)] and fails this fixture. Index ordering, not a good score, establishes availability here.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S5: Proof and synthesis assessment**. Theory: Conditional expectation is the orthogonal projection of Y onto functions measurable with respect to available information. For any square-integrable g(X), E[(Y−E[Y|X])g(X)]=0. In finite groups, this means residuals sum to zero within every group. This orthogonality yields the squared-error decomposition: constant-mean risk equals conditional-mean risk plus the variation explained by X. A proof should name the conditioning set and integrability, derive the identity, and distinguish population statements from fitted estimates. Assessment is about reasoning and scope, not recalling slogans.
  Exercise: New equally likely pairs: (A,1),(A,5),(B,4),(B,8). Find m(X)=E[Y|X], prove E[(Y−m(X))g(X)]=0 for every group-constant g, and compare constant-mean with conditional-mean MSE.
  Model answer: m(A)=3,m(B)=6; overall mean=4.5. Residuals around m are [−2,2,−2,2]. For g(A)=a,g(B)=b, the expectation is (−2a+2a−2b+2b)/4=0. Conditional MSE=4. Constant-mean squared residuals are [12.25,0.25,0.25,12.25], mean 6.25. Gain=2.25=Var(m(X)). This population identity does not guarantee a fitted conditional-mean estimator generalizes.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

### W104

- **S1: Link manuscript claims to evidence**. Theory: A manuscript is a chain of claims supported by methods, results, and artifacts. State estimand, eligibility, chronology, preprocessing, selection rule, metric, and uncertainty so a reader can reconstruct the analysis. Separate prespecified and exploratory findings. Abstract numbers must match tables and code. A claim-evidence ledger links each quantitative sentence to a file, run, and population. Discuss what the design supports and cannot identify.
  Exercise: An abstract gives MAE .011 vs .012 and interval [−.002,.004], then says “profitable.” What should change?
  Model answer: Remove “profitable”: MAE measures forecast error on one period, the interval includes zero, and there are no net-return or cost results. Report the observed 8.3% MAE reduction with uncertainty and say profitability is untested.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S2: Report negative and mixed evidence**. Theory: A null or unfavorable result is a finding. Preserve the prespecified outcome. Report subgroup sample counts and state whether the analysis was planned. Heterogeneous estimates may reflect real regimes, sampling noise, or design weakness; the data may not distinguish them. Do not promote a post-hoc subgroup as confirmation. Explain how evidence narrows the claim and propose a new test with a fixed split and subgroup rule.
  Exercise: Overall Δ=.001 [−.002,.004]; subgroup Δ=−.003 [−.006,0]. Interpret both.
  Model answer: The aggregate estimate favors the candidate by .001 but its interval includes zero. The subgroup favors the baseline by .003 and touches zero. Evidence is mixed; the subgroup is exploratory and cannot confirm a regime effect. Preserve both results and plan an independent, prespecified test.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S3: Preserve run provenance**. Theory: Provenance records source, transformations, code, configuration, environment, and outputs. A hash identifies bytes but does not prove data permission or scientific validity. A manifest names the command and expected result. Keep raw and derived data separate where rights permit. A version change requires a new run record; overwriting an old result breaks the audit trail. Reproducibility includes matching the claim and figure, not just a successful process exit.
  Exercise: What must be recorded to tie .011 to an exact run: only the figure or seed17,D7,v2,a17,c4 and output?
  Model answer: Record seed17, D7, transform v2, commit a17, config c4, environment, command, prediction file, and JSON. A figure alone cannot identify its generating run. Changing the seed requires regenerating predictions, metrics, figure, and the linked claim card.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S4: Check rights, privacy, authorship, and license**. Theory: A release needs permission for every included artifact. Inventory authorship, institutional or sponsor terms, third-party dependencies, data licenses, attribution, and privacy. An open-source license grants only rights the publisher holds; it cannot erase source-data restrictions or third-party notices. Remove credentials and personal data from the full version history, not just the latest file. If ownership or permission is unclear, exclude the item or delay release until written clarification. Do not treat an empty license field as permission to reuse.
  Exercise: Code is original, data are synthetic, but a copied chart has unclear rights. What can be released now?
  Model answer: Release the original code only after checking institutional terms and selecting a license you can grant; document synthetic data generation. Exclude the copied chart until permission/attribution is clear, or redraw it from owned results. The repository license cannot grant rights over third-party material.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

- **S5: Reproduce and release the final package**. Theory: A release candidate must pass a clean reproduction and a human claim audit. Pin dependencies, document runtime, and use permitted data. Check that predictions, metrics, figures, and manuscript values match the manifest. Include limitations, negative evidence, licenses, attribution, and a correction path. Remove secrets from the full Git history and rotate exposed credentials. Tag only after computation and rights checks pass. If a rerun changes a result, make a versioned correction rather than silently replacing it.
  Exercise: Manifest expects 100 predictions but the clean run returns 99. What do you do before release?
  Model answer: Stop the release. Compare input hash, split indices, missing-target filtering, and feature/label alignment. Reproduce n=100 from declared inputs or create a new version with a documented change and recomputed claims. Do not change the manuscript by hand to conceal the discrepancy.
  Assessment interpretation: Preserve as legacy workflow reference; no mathematics pass inferred.

### W105

- **S1: Audit strengths and gaps with evidence**. Theory: A handoff begins with artifacts, not self-esteem. Define a skill standard, inspect work, rate performance and confidence, and state what the artifact cannot prove. Strong code does not imply strong inference; one draft does not establish research independence. A gap is useful when linked to a next task and review date. Scores are a planning snapshot, not a credential.
  Exercise: Which skill rated 3/5 has a concrete retest, and what output must it produce?
  Model answer: Inference: rerun paired serial-error intervals at prespecified block lengths 5,10,20; save estimates, intervals, counts, and code, then ask another person to reproduce. The earlier report supports basic interpretation but not mastery of dependence sensitivity.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S2: Plan the next six months**. Theory: A six-month plan needs a few priorities, artifacts, and gates. Finish prerequisites before extensions; schedule feedback and reproduction alongside implementation. Every month needs an observable exit condition and a fallback for delayed data or supervision. Preserve rest and existing commitments. Review what shipped, failed, and changed in the question. Activity counts are not learning; redirect when validity conditions fail.
  Exercise: What must match at month 3 before drafting the result claim?
  Model answer: Source hash, expected N, and paired-error output must match the manifest within the stated tolerance. Otherwise pause claims and repair alignment/provenance. Synthetic data can test code but cannot establish a market result.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.

- **S3: Prepare a durable research handoff**. Theory: A handoff serves a future researcher without oral context. Include question, version, strongest evidence, negative result, open risks, review date, reproduction command, environment, hashes, rights note, and ownership boundaries. Archive old outputs instead of overwriting. Mark what is reusable, needs checking, or must not be claimed. A new reader should be able to act from the note alone.
  Exercise: What mismatch blocks reuse of .011, and where are inputs recorded?
  Model answer: Stop if N≠100 or hash is not D7. Check split, missing targets, and alignment. README records D7,c4,a17, environment, command, expected output, and fallback. Do not reuse .011 as though changed inputs were the same run.
  Assessment interpretation: Replace with a proof/transfer rubric in v2.
