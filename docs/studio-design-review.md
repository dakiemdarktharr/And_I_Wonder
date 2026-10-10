# Desktop learning studio review — 10 October 2026

The user supplied a 1920px lesson screenshot: the first screen was almost entirely an agenda, the actual teaching began below the fold, and the document occupied only a narrow central strip. This review concerns the interface and mathematical presentation. It does not establish learning effectiveness or equivalence to Khan Academy.

## Design decision

Use a research desk: persistent lesson navigation on the left, a calm reading surface in the middle, and session progress plus the current formula on the right. The additional desktop width supports tools; it is not spent on stretching paragraphs across the screen. On narrower windows the desk moves below the lesson; focus mode remains an explicit choice.

Palette: ink `#203e4b`, background `#edf2ee`, reading surface `#fffefa`, mint `#c9e4dc`, formula yellow `#f0ce73`, blue `#285f87`. Strong outlines, flat offset shadows, geometric drawing and the existing illustrated quests preserve the requested pop-art/cel-shaded identity. Quiet surfaces surround the mathematics.

Type roles: Be Vietnam Pro for headings and interface; Source Serif 4 for sustained lesson reading; JetBrains Mono for code and compact timings; KaTeX for mathematics. All three text families include Vietnamese subsets and are locally served with the application. Reading copy uses 19–21px on the tested desktop widths, generous line height and ordinary letter spacing. Small uppercase labels and artificially tracked text are avoided.

```
Logo / destination tabs / search / language / account
Lesson title and compact reading tools
Navigation     Application → formula → worked steps     Session checklist
Prerequisites  Four exercises with solution disclosure  Current formula
Lab / path     Research block and sources
```

## First critique and changes

| Observed problem | Consequence | Implemented response |
| --- | --- | --- |
| Agenda consumes the opening viewport | The reader has to find the actual lesson | Move the agenda into the right desk; teaching starts in the first viewport |
| Narrow document and large unused margins | Desktop gives little benefit | Three-column layout using over 90% of the viewport at 1280/1920px |
| Every section has the same visual emphasis | Application, formula, methods and answers are hard to distinguish | Separate treatments, purposeful icons and numbered solution steps |
| Bare navigation/actions | Click targets are ambiguous | Bordered tabs and actions, explicit active state, keyboard focus and pressed states |
| Raw Unicode equations and ASCII matrices | Superscripts, sets and matrix structure are harder to read | Shared legacy-notation-to-TeX rendering across lessons, answers, diagnostic fields, project Markdown and exports |
| One text face and weak size hierarchy | Navigation and reasoning blend together | Distinct UI, reading, code and math typography with Vietnamese font coverage |
| Generic lettermark | Little connection to the subject | Original distribution/data-point/lens mark, also used for favicon |
| Abrupt ordinary route changes | Navigation loses continuity | React ViewTransition enter/exit with stationary header; existing portal flight remains separate; reduced motion disables animation |
| No immediate visual explanation of the reported null-space lesson | Symbol manipulation lacks a concrete interpretation | An exact slider-driven null-space illustration for the assigned matrix, with accessible text and a zero-output check |

## Second critique and corrections

The first rebuilt screen was insufficient. Visual inspection found resource captions still using legacy tiny type, more raw symbols inside derivatives answers, unframed secondary research links, and duplicate site names in page metadata. These were corrected. The library now uses more of the desktop and larger object captions; source-cover artwork is preserved.

The notation audit found issues that a clean screenshot would miss: a null-space operator was initially liable to become the set of natural numbers, set braces could disappear, subscripts could attach to the wrong term, and Markdown tables/emphasis could be interpreted as equations. The converter now has regression fixtures for these cases and preserves authored TeX, code, links, tables and emphasis. The runtime does not evaluate mathematical input or enable trusted HTML in KaTeX. This is presentation normalization, not a proof of every source statement.

## Inspiration and boundaries

- [Khan Academy linear algebra](https://www.khanacademy.org/math/linear-algebra): the comparison criterion is a clear relationship between a concept, explanation and practice. This implementation makes those stages visible without adding unsolicited hints or self-congratulation to each problem.
- [Pinterest mathematical-logo references](https://br.pinterest.com/digordeholanda/logo-matematica-ref/): research for geometric visual vocabulary. The new lens/distribution symbol is drawn in code; no pin artwork was copied.
- The installed Next.js guide `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` supplies the React 19.3 transition implementation appropriate to this project.

The UI now has clearer reading priorities and functional desktop space. It is not defensible to claim it has Khan Academy's demonstrated educational quality from screenshots or automated tests. The project still has self-authored instructional content, self-assessment, and no learner study establishing comprehension, enjoyment or retention. A UI redesign cannot settle those questions.

## Verification

- Unit tests cover preserved code/links, matrix rows, visible set braces, transpose, null-space notation, nested indices, Vietnamese text, Markdown structure and export behavior.
- `npm run math:notation:audit` scans the current curriculum and the older lesson files, failing on a KaTeX parse error. The final audit rendered 47,146 inline math occurrences with no parse errors. Existing authored display math remains covered by the curriculum tests.
- Desktop browser tests exercise both languages at 1280px and 1920px, actual Vietnamese font loads, column placement, absence of page overflow, keyboard solution disclosure, active section tracking, the null-space slider, view transitions, reduced motion, resource captions and derivatives answers.
- Existing current-curriculum browser tests cover progress failure handling, four-problem lessons, Markdown export, foundation routing, search, quest navigation and library filters.
- Visual inspection covers the lesson, project path, library and learning-path screens. Functional tests do not constitute an independent accessibility certification or a learner-effectiveness study.
