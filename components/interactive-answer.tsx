"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { LessonSession } from "@/lib/lesson-types";
import type { ExerciseCheckpoint } from "@/lib/answer-workbench";
import { evaluateNumericAnswer } from "@/lib/answer-workbench";
import "./answer-workbench.css";

type Language = "vi" | "en";
type LocalizedText = { en: string; vi: string };
type Exercise = LessonSession["exercises"][number];
type Stage = LocalizedText;
type NumericCheck = NonNullable<ExerciseCheckpoint["numericChecks"]>[number];
type NumericStatus = "match" | "mismatch" | "invalid";
type WorkbenchDraft = {
  activeStage: number;
  attempts: Record<string, string>;
  revealedStages: Record<string, boolean>;
  numericValues: Record<string, string>;
  numericStatuses: Record<string, NumericStatus | undefined>;
};

const emptyDraft = (): WorkbenchDraft => ({
  activeStage: 0,
  attempts: {},
  revealedStages: {},
  numericValues: {},
  numericStatuses: {},
});

function stringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

function booleanRecord(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"));
}

function statusRecord(value: unknown): Record<string, NumericStatus | undefined> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, NumericStatus] => entry[1] === "match" || entry[1] === "mismatch" || entry[1] === "invalid"));
}

function text(value: LocalizedText, language: Language): string {
  return value[language] || value.en;
}

function readDraft(key: string, stageCount: number): WorkbenchDraft {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return emptyDraft();
    const value = JSON.parse(stored) as Partial<WorkbenchDraft>;
    const activeStage = Number.isInteger(value.activeStage) ? Number(value.activeStage) : 0;
    return {
      activeStage: Math.min(Math.max(0, activeStage), Math.max(0, stageCount - 1)),
      attempts: stringRecord(value.attempts),
      revealedStages: booleanRecord(value.revealedStages),
      numericValues: stringRecord(value.numericValues),
      numericStatuses: statusRecord(value.numericStatuses),
    };
  } catch {
    return emptyDraft();
  }
}

function AnswerMarkdown({ children }: { children: string }) {
  return <div className="answer-workbench__markdown"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{children}</ReactMarkdown></div>;
}

export type InteractiveAnswerProps = {
  exercise: Exercise;
  language: Language;
  exerciseKey: string;
  checkpoint?: ExerciseCheckpoint;
  children?: ReactNode;
};

/** A private-to-this-browser solution workspace; it never writes owner progress. */
export function InteractiveAnswer({ exercise, language, exerciseKey, checkpoint, children }: InteractiveAnswerProps) {
  const lang = language;
  const stages = useMemo<Stage[]>(() => checkpoint?.stages?.length ? checkpoint.stages : [exercise.answer], [checkpoint, exercise.answer]);
  const storageKey = `road-to-qr:answer-workbench:v1:${encodeURIComponent(exerciseKey)}`;
  const [draft, setDraft] = useState<WorkbenchDraft>(emptyDraft);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setLoadedKey(null);
    try {
      setDraft(readDraft(storageKey, stages.length));
      setStorageAvailable(true);
    } catch {
      setDraft(emptyDraft());
      setStorageAvailable(false);
    }
    setLoadedKey(storageKey);
  }, [storageKey, stages.length]);

  useEffect(() => {
    if (loadedKey !== storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [draft, loadedKey, storageKey]);

  const currentStage = Math.min(draft.activeStage, stages.length - 1);
  const stageKey = String(currentStage);
  const revealed = Boolean(draft.revealedStages[stageKey]);
  const checks = checkpoint?.numericChecks ?? [];
  const update = (patch: Partial<WorkbenchDraft>) => setDraft(current => ({ ...current, ...patch }));
  const saveAttempt = (value: string) => update({ attempts: { ...draft.attempts, [stageKey]: value } });
  const revealStage = () => update({ revealedStages: { ...draft.revealedStages, [stageKey]: true } });
  const hideStage = () => update({ revealedStages: { ...draft.revealedStages, [stageKey]: false } });
  const moveStage = (offset: number) => update({ activeStage: Math.min(stages.length - 1, Math.max(0, currentStage + offset)) });
  const reset = () => {
    try { window.localStorage.removeItem(storageKey); } catch { /* The reset remains scoped to the visible component state. */ }
    setDraft(emptyDraft());
  };

  const labels = lang === "vi" ? {
    title: "Không gian tự luyện lời giải",
    before: "Hãy thử nêu bước tiếp theo trước khi mở lời giải. Việc dự đoán được khuyến khích nhưng không bắt buộc.",
    browserOnly: "Bản nháp chỉ lưu trong trình duyệt này; không thay đổi tiến độ của chủ sở hữu.",
    storageUnavailable: "Trình duyệt không cho phép lưu bản nháp; nội dung sẽ mất khi tải lại trang.",
    exercise: "Bài toán",
    explore: "Mở công cụ khám phá cho bài này",
    hint: "Mở gợi ý",
    stage: "Mốc đối chiếu",
    of: "trên",
    attempt: "Thử viết lập luận hoặc phép tính của bạn (không bắt buộc)",
    reveal: "Mở bước lời giải mẫu này",
    hide: "Ẩn bước này",
    shown: "Bước lời giải mẫu",
    previous: "Bước trước",
    next: "Tôi đã đối chiếu — sang bước tiếp",
    numeric: "Tự kiểm tra kết quả số",
    numericIntro: "Chỉ các câu hỏi có đáp án số được chọn rõ ràng mới được chấm tự động. Câu trả lời dạng chứng minh, mã hoặc nghiên cứu cần được đối chiếu thủ công.",
    numericInput: "Kết quả của bạn",
    check: "Kiểm tra số này",
    match: "Khớp trong sai số cho phép. Hãy xem đây là một kiểm tra cục bộ cho đúng giá trị này.",
    mismatch: "Giá trị chưa nằm trong sai số cho phép. Hãy kiểm tra lại phép tính rồi thử lại.",
    invalid: "Nhập một số, số thập phân dùng dấu chấm hoặc dấu phẩy, hay phân số đơn giản như 2/3.",
    target: "Giá trị tham chiếu",
    reset: "Xóa phần tự luyện của riêng bài này",
    progress: "bước đã mở",
    modelHidden: "Các bước lời giải mẫu đang được ẩn.",
  } : {
    title: "Answer practice workspace",
    before: "Try stating the next step before opening the worked solution. Making a prediction is encouraged, never required.",
    browserOnly: "Drafts stay in this browser and do not change the owner’s progress.",
    storageUnavailable: "Browser storage is unavailable; this draft will be lost when the page reloads.",
    exercise: "Exercise",
    explore: "Open this exercise’s exploration tool",
    hint: "Open hint",
    stage: "Solution checkpoint",
    of: "of",
    attempt: "Try writing your reasoning or calculation (optional)",
    reveal: "Open this worked stage",
    hide: "Hide this stage",
    shown: "Worked solution stage",
    previous: "Previous stage",
    next: "I compared my work — next stage",
    numeric: "Check selected numeric results",
    numericIntro: "Only explicitly selected numeric results are checked automatically. Proofs, code, and research answers are for manual comparison.",
    numericInput: "Your value",
    check: "Check this number",
    match: "Within the allowed tolerance. This is a local check for this value only.",
    mismatch: "Outside the allowed tolerance. Recheck the calculation and try again.",
    invalid: "Enter a number, a decimal with a dot or comma, or a simple fraction such as 2/3.",
    target: "Reference value",
    reset: "Clear practice for this exercise only",
    progress: "stages opened",
    modelHidden: "Worked solution stages are hidden.",
  };

  return <section className="answer-workbench" aria-labelledby={`answer-workbench-title-${exerciseKey}`}>
    <header className="answer-workbench__header">
      <div>
        <p className="answer-workbench__eyebrow">{labels.title}</p>
        <h3 id={`answer-workbench-title-${exerciseKey}`}>{labels.exercise}</h3>
      </div>
      <span className="answer-workbench__progress">{Object.values(draft.revealedStages).filter(Boolean).length} / {stages.length} {labels.progress}</span>
    </header>

    <div className="answer-workbench__prompt"><AnswerMarkdown>{text(exercise.prompt, lang)}</AnswerMarkdown></div>

    {children ? <details className="answer-workbench__explore">
      <summary>{labels.explore}</summary>
      <div className="answer-workbench__explore-content">{children}</div>
    </details> : null}

    <details className="answer-workbench__hint">
      <summary>{labels.hint}</summary>
      <AnswerMarkdown>{text(exercise.hint, lang)}</AnswerMarkdown>
    </details>

    <p className="answer-workbench__privacy">{storageAvailable === false ? labels.storageUnavailable : labels.browserOnly}</p>

    <section className="answer-workbench__stages" aria-label={lang === "vi" ? "Đối chiếu lời giải theo bước" : "Compare the solution stage by stage"}>
      <div className="answer-workbench__stage-heading">
        <h4>{labels.stage} {currentStage + 1} {labels.of} {stages.length}</h4>
        <span aria-hidden="true">{String(currentStage + 1).padStart(2, "0")}</span>
      </div>
      <label className="answer-workbench__attempt-label" htmlFor={`answer-attempt-${exerciseKey}-${currentStage}`}>{labels.attempt}</label>
      <textarea
        id={`answer-attempt-${exerciseKey}-${currentStage}`}
        className="answer-workbench__attempt"
        value={draft.attempts[stageKey] ?? ""}
        onChange={event => saveAttempt(event.target.value)}
        rows={3}
      />

      {revealed ? <div className="answer-workbench__solution">
        <div className="answer-workbench__solution-heading"><strong>{labels.shown}</strong><button type="button" className="answer-workbench__text-button" onClick={hideStage}>{labels.hide}</button></div>
        <AnswerMarkdown>{text(stages[currentStage], lang)}</AnswerMarkdown>
      </div> : <>
        <p className="answer-workbench__hidden-note">{labels.modelHidden}</p>
        <button type="button" className="answer-workbench__primary" onClick={revealStage}>{labels.reveal}</button>
      </>}

      <div className="answer-workbench__stage-nav">
        <button type="button" className="answer-workbench__secondary" onClick={() => moveStage(-1)} disabled={currentStage === 0}>{labels.previous}</button>
        <button type="button" className="answer-workbench__secondary" onClick={() => moveStage(1)} disabled={currentStage >= stages.length - 1}>{labels.next}</button>
      </div>
    </section>

    {checks.length > 0 ? <section className="answer-workbench__checks" aria-labelledby={`answer-checks-${exerciseKey}`}>
      <h4 id={`answer-checks-${exerciseKey}`}>{labels.numeric}</h4>
      <p>{labels.numericIntro}</p>
      <div className="answer-workbench__check-list">
        {checks.map(check => {
          const input = draft.numericValues[check.id] ?? "";
          const status = draft.numericStatuses[check.id];
          return <div className="answer-workbench__check" key={check.id}>
            <label htmlFor={`answer-number-${exerciseKey}-${check.id}`}>{text(check.question, lang)}</label>
            <div className="answer-workbench__check-row">
              <input
                id={`answer-number-${exerciseKey}-${check.id}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={input}
                onChange={event => update({
                  numericValues: { ...draft.numericValues, [check.id]: event.target.value },
                  numericStatuses: { ...draft.numericStatuses, [check.id]: undefined },
                })}
              />
              <button type="button" className="answer-workbench__secondary" onClick={() => {
                const result = evaluateNumericAnswer(input, check);
                update({ numericStatuses: { ...draft.numericStatuses, [check.id]: result.status } });
              }}>{labels.check}</button>
            </div>
            {status ? <p className={`answer-workbench__feedback answer-workbench__feedback--${status}`} role="status" aria-live="polite">
              {status === "match" ? labels.match : status === "invalid" ? labels.invalid : labels.mismatch}
              {status === "match" ? <><br /><span>{labels.target}: {text(check.target, lang)}</span></> : null}
            </p> : null}
          </div>;
        })}
      </div>
    </section> : null}

    <footer className="answer-workbench__footer">
      <p>{labels.before}</p>
      <button type="button" className="answer-workbench__text-button" onClick={reset}>{labels.reset}</button>
    </footer>
  </section>;
}
