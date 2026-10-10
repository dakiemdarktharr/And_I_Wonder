# Lesson and solution review — 10 October 2026

This is an editorial improvement and test record, not a certificate of mathematical completeness or independent validation.

## What was examined

- First assistant reading of the 523 scheduled primary English prompts and solutions, grouped by week. This did not constitute a full bilingual review of every theorem, proof, rubric and reference.
- Structural checks on all 2,092 scheduled problems in both languages: nonempty prompts and solutions, preserved mathematical notation, resolved lesson references.
- 25 primary lessons received explicit bilingual mathematical or explanatory amendments. Each amendment includes its reason in the canonical source and the per-day ledger.
- 17 new analytic interactive models, assigned explicitly to 17 primary concept IDs. Together with the previous null-space explorer, 18 of 523 daily lessons now have a v2 interactive illustration.
- Every slider tick is checked for finite values and plotting bounds. Selected identities are recomputed with a different method: endpoint difference quotients, enumerated binomial moments, precision-weighted Gaussian posterior, covariance versus integrated spectrum, scalar threshold KKT conditions, and finite-support risk calculations.

The exact per-day record is [lesson-review-ledger.json](lesson-review-ledger.json). An unmarked lesson is not thereby certified correct.

## Mathematical repairs

The amendments cover:

- Chain-rule and finite-difference derivation, including the undefined quotient at zero.
- Symmetry and idempotence in orthogonal projection; symmetry in Rayleigh bounds.
- An explicit two-variable counterexample to “partials imply differentiability.”
- The radius constraint on a local Taylor/gradient step.
- A noncircular supremum proof for a monotone sequence.
- Pointwise versus uniform convergence: the error at the endpoint is zero even though the supremum is one.
- Boundedness of a uniform limit: one early bounded function is insufficient.
- Correct right derivatives at zero for the power-sequence example.
- An explicit finite conditioning example.
- The zero-total-data boundary in an exponential MLE.
- Explicit unequal iterated sums without absolute summability.
- Conditional expectation versions must remain measurable with respect to the conditioning sigma-field.
- Scope of Neyman–Pearson and why symmetry does not establish unrestricted two-sided UMP.
- Uniform MLE endpoint convention and a full derivation of order-statistic moments.
- Constrained Bernoulli and quadratic estimators are projections, not always the sample mean.
- The log delta-method statistic needs a definition on nonpositive finite samples.
- Selection coverage uses the actual rounded normal cutoff, not an exact 0.95 identity.
- Stationarity is checked before assigning a spectrum; summable covariances are sufficient, not necessary for every spectral density.
- The factor of sample size in the Bartlett sum-of-squares identity.
- Centering loss preserves excess risk, not every empirical-population deviation.
- The exact excess-risk decomposition and the missing empirical-optimality comparison.
- Static regret permits a hindsight-selected constant comparator.

Related teaching formulas, applications and rubric fields were corrected where the original version conflicted with the repaired answer. The builder applies amendments before constructing companion questions and semantic hashes.

## Teaching and interaction

The daily flow remains application → formula → method → four prompts with hidden solutions. Existing paragraph solutions are split at sentence boundaries while protecting TeX and code; duplicate companion paragraphs and the generic “replace the quoted step” instruction are removed in presentation. This is layout cleanup, not a substitute for writing missing reasoning.

The new figures cover secants, nondifferentiability, epsilon thresholds, nonuniform convergence, Bayes base rates, binomial probabilities, Cauchy–Schwarz, convex sets, Hessian curvature, soft thresholding, gradient stability, MA(1) spectra, Gaussian updating, filter risk, ridge degrees of freedom and Gaussian mutual information. Captions identify the actual function/data and distinguish a parameterized extension from the exercise's fixed fixture. A reset returns to the assigned fixture.

The convexity illustration shows two sections of a quadratic and computes its full Hessian eigenvalues. It does not infer global convexity of an arbitrary multivariable function from two plotted slices. Numerical figures illustrate the proofs; they do not replace them.

Inspiration:

- [Khan Academy on deliberate practice and worked examples](https://blog.khanacademy.org/how-should-people-practice-on-khan-academy/): keep the fully worked argument available, and make the relationship between steps explicit.
- [IES practice guide on organizing instruction](https://ies.ed.gov/ncee/wwc/PracticeGuide/1): pair graphics with explanations and connect concrete examples to abstract representations.

These sources inform design choices; no study has measured learning gains from this implementation.

## Validation and progress

Run the curriculum builder before audits. The automated suite checks mathematical fixtures, bilingual formula rendering, model boundaries and UI interactions. These are separate from an expert review of the curriculum.

Release checks: production build and TypeScript passed; the full 93-test unit suite passed, followed by all 18 concept-scene tests after adding the equal-axis-scale assertion (94 total tests now defined). The notation audit rendered 46,434 expressions with no parser errors. All 49 desktop browser tests passed against the production build on localhost:3101, including both languages, hidden solutions, keyboard sliders, navigation and resource covers. A development-server navigation timeout did not reproduce in isolation or on the production build. The resource-cover test now checks the actual curated free-resource asset set and loads lazy images before asserting their dimensions.

Visual inspection at 1920×1080 covered secants, the endpoint limit example and the quadratic curvature illustration. Browser tests also check the lesson layout at 1280 pixels. Successful rendering is not evidence that every theorem or mathematical sentence is correct.

Content amendments change revisions in 23 weeks: 1, 6, 7, 9, 10, 12, 14, 15, 16, 18, 25, 32, 35, 47, 48, 49, 51, 59, 75, 77, 87, 88, 89. Existing stored records are not deleted. The current completion key changes for a semantically corrected week, as required by the existing revision policy. Presentation-only sentence splitting does not rehash unrelated weeks.

## Work that remains

- 518 daily lessons still generate their three companion tasks from shared interpretation/derivation/error-analysis scaffolds. These are not four independently authored problems. They need individual problem-writing and review.
- 505 daily lessons have no v2 interactive figure. A useful next figure needs its own mathematical model, caption and correctness fixtures; attaching a vaguely related chart by week number is not acceptable.
- Most later lessons have only presentation cleanup in this change, not a complete rewrite at introductory teaching depth.
- A full Vietnamese/English semantic comparison, all theorem proofs and all alternative-form answers still need a dedicated review.
- No independent mathematical validation or learner-outcome study has been performed.

This release must not be described as “every lesson rewritten and verified” or “all mathematical errors fixed.”
