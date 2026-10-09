"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage, useSession } from "@/components/providers";
import { MarkdownContent } from "@/components/markdown-content";
import { DailyLesson } from "@/components/daily-lesson";
import { SearchDialog } from "@/components/search-dialog";
import type { LessonModule } from "@/lib/lesson-types";
import type { Note } from "@/lib/types";
import {lessonToMarkdown} from '@/lib/lesson-export';

type NoteProgress = {
  checked?: Record<string, boolean>;
  status?: string;
  actualMinutes?: number;
  evidence?: string;
  updatedAt?: string;
};

type ProgressResponse = { notes?: Record<string, NoteProgress> };
type SaveState = "loading" | "saved" | "saving" | "error";

type NoteReaderProps = {
  note: Note;
  /** Compact note index for wikilink resolution and immediate search. */
  notes?: readonly Note[];
  lesson?: LessonModule;
  /** Sequential study-session index within the Wednesday-to-Tuesday week (0–4). */
  dayIndex?: number;
  dailyNavigation?: {previous?:{href:string;date:string};next?:{href:string;date:string}};
};

const STATUS_OPTIONS = ["planned", "in-progress", "blocked", "done"] as const;
const EMPTY_NOTES: Note[] = [];

function responseMessage(value: unknown, fallback: string): string {
  if (value && typeof value === "object" && "error" in value && typeof value.error === "string") return value.error;
  return fallback;
}

export function NoteReader({ note, notes = EMPTY_NOTES, lesson, dayIndex, dailyNavigation }: NoteReaderProps) {
  const { language } = useLanguage();
  const { authenticated, owner, loading: sessionLoading } = useSession();
  const [readerNote, setReaderNote] = useState(note);
  const [noteRevision, setNoteRevision] = useState("");
  const [noteReadError, setNoteReadError] = useState("");
  const [markdownEditing, setMarkdownEditing] = useState(false);
  const [markdownDraft, setMarkdownDraft] = useState("");
  const [markdownSaving, setMarkdownSaving] = useState(false);
  const [markdownError, setMarkdownError] = useState("");
  const [allProgress, setAllProgress] = useState<Record<string, NoteProgress>>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [saveError, setSaveError] = useState("");
  const [draftEvidence, setDraftEvidence] = useState("");
  const [draftMinutes, setDraftMinutes] = useState("");
  const [draftStatus, setDraftStatus] = useState<(typeof STATUS_OPTIONS)[number]>("planned");
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState("");
  const taskVersions = useRef(new Map<string, number>());
  const latestRequest = useRef(0);
  const toastTimer = useRef<number | undefined>(undefined);
  const languageIsVi = language === "vi";
  const noteApiPath = `/api/notes/${note.id.split("/").map(encodeURIComponent).join("/")}`;
  const currentProgress = allProgress[note.id] ?? {};
  const noteIndex = useMemo(() => notes.some((item) => item.id === readerNote.id)
    ? notes.map((item) => item.id === readerNote.id ? readerNote : item)
    : [readerNote, ...notes], [notes, readerNote]);
  const localTitle = languageIsVi ? (readerNote.titleVi || readerNote.title) : readerNote.title;

  useEffect(() => {
    let active = true;
    setReaderNote(note);
    setNoteRevision("");
    setNoteReadError("");
    fetch(noteApiPath, { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Note storage unavailable (${response.status})`);
        return response.json() as Promise<{ note?: Note; revision?: string }>;
      })
      .then((payload) => {
        if (!active) return;
        if (payload.note) setReaderNote(payload.note);
        if (payload.revision) setNoteRevision(payload.revision);
      })
      .catch((error: unknown) => {
        if (active) setNoteReadError(error instanceof Error ? error.message : "Note storage unavailable");
      });
    return () => { active = false; };
  }, [note, noteApiPath]);

  useEffect(() => {
    let active = true;
    setProgressLoaded(false);
    setSaveState("loading");
    fetch("/api/progress", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Progress could not be loaded (${response.status})`);
        return response.json() as Promise<ProgressResponse>;
      })
      .then((payload) => {
        if (!active) return;
        setAllProgress(payload.notes ?? {});
        setProgressLoaded(true);
        setSaveState("saved");
        setSaveError("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setProgressLoaded(true);
        setSaveState("error");
        setSaveError(error instanceof Error ? error.message : "Progress could not be loaded");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setDraftEvidence(currentProgress.evidence ?? "");
    setDraftMinutes(currentProgress.actualMinutes === undefined ? "" : String(currentProgress.actualMinutes));
    setDraftStatus(STATUS_OPTIONS.includes(currentProgress.status as (typeof STATUS_OPTIONS)[number]) ? currentProgress.status as (typeof STATUS_OPTIONS)[number] : "planned");
  }, [note.id, currentProgress.evidence, currentProgress.actualMinutes, currentProgress.status]);

  useEffect(() => {
    setMarkdownDraft(languageIsVi ? (readerNote.bodyVi || readerNote.body) : readerNote.body);
    setMarkdownError("");
  }, [languageIsVi, readerNote.body, readerNote.bodyVi]);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  const queueToast = (message: string) => {
    setToast(message);
    if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

  const postProgress = useCallback(async (noteId: string, payload: Record<string, unknown>, failureText: string) => {
    const requestNumber = ++latestRequest.current;
    setSaveState("saving");
    setSaveError("");
    try {
      const response = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ noteId, ...payload }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(responseMessage(body, `${failureText} (${response.status})`));
      if (requestNumber === latestRequest.current) {
        setSaveState("saved");
        setSaveError("");
      }
      return true;
    } catch (error) {
      if (requestNumber === latestRequest.current) {
        setSaveState("error");
        setSaveError(error instanceof Error ? error.message : failureText);
      }
      return false;
    }
  }, []);

  const updateTask = useCallback((taskNoteId: string, index: number | string, value: boolean) => {
    if (!authenticated) return;
    const taskId = `${taskNoteId}::${index}`;
    const previous = !value;
    const version = (taskVersions.current.get(taskId) ?? 0) + 1;
    taskVersions.current.set(taskId, version);
    setAllProgress((progress) => ({
      ...progress,
      [taskNoteId]: { ...progress[taskNoteId], checked: { ...progress[taskNoteId]?.checked, [taskId]: value } },
    }));
    void postProgress(taskNoteId, { taskId, checked: value }, languageIsVi ? "Không lưu được ô kiểm" : "Could not save task").then((saved) => {
      if (saved || taskVersions.current.get(taskId) !== version) return;
      setAllProgress((progress) => ({
        ...progress,
        [taskNoteId]: { ...progress[taskNoteId], checked: { ...progress[taskNoteId]?.checked, [taskId]: previous } },
      }));
    });
  }, [authenticated, languageIsVi, postProgress]);

  const saveEvidence = async () => {
    const minutes = draftMinutes.trim() ? Number(draftMinutes) : undefined;
    if (minutes !== undefined && (!Number.isInteger(minutes) || minutes < 0 || minutes > 1440)) {
      setSaveState("error");
      setSaveError(languageIsVi ? "Thời gian cần là số phút nguyên từ 0 đến 1440." : "Minutes must be a whole number from 0 to 1440.");
      return;
    }
    const payload = { status: draftStatus, actualMinutes: minutes ?? 0, evidence: draftEvidence };
    const saved = await postProgress(note.id, payload, languageIsVi ? "Không lưu được tiến độ" : "Could not save progress");
    if (saved) setAllProgress((progress) => ({ ...progress, [note.id]: { ...progress[note.id], ...payload } }));
  };

  const saveMarkdown = async () => {
    if (!authenticated || !noteRevision) {
      setMarkdownError(languageIsVi ? "Chưa tải được phiên bản ghi chú để lưu. Hãy thử tải lại trang." : "The note revision is unavailable. Reload the page before saving.");
      return;
    }
    setMarkdownSaving(true);
    setMarkdownError("");
    const patch = languageIsVi ? { bodyVi: markdownDraft } : { body: markdownDraft };
    try {
      const response = await fetch(noteApiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...patch, expectedRevision: noteRevision }),
      });
      const result = await response.json().catch(() => ({})) as { revision?: string; error?: string };
      if (!response.ok) throw new Error(result.error || (response.status === 409
        ? (languageIsVi ? "Ghi chú đã thay đổi. Hãy tải lại trước khi lưu." : "This note changed. Reload before saving.")
        : (languageIsVi ? "Không lưu được ghi chú." : "Could not save note.")));
      setReaderNote((current) => ({ ...current, ...patch }));
      if (result.revision) setNoteRevision(result.revision);
      setMarkdownEditing(false);
      queueToast(languageIsVi ? "Đã lưu ghi chú Markdown" : "Markdown note saved");
    } catch (error) {
      setMarkdownError(error instanceof Error ? error.message : (languageIsVi ? "Không lưu được ghi chú." : "Could not save note."));
    } finally {
      setMarkdownSaving(false);
    }
  };

  const downloadSnapshot = () => {
    const markdown = lesson && dayIndex !== undefined ? lessonToMarkdown(lesson,dayIndex,String(note.meta.date),language,currentProgress.checked,note.id) : languageIsVi ? (readerNote.bodyVi || readerNote.body) : readerNote.body;
    const title = localTitle.replace(/"/g, "\\\"");
    const snapshot = `---\ntitle: "${title}"\nnoteId: "${readerNote.id}"\nsnapshotAt: "${new Date().toISOString()}"\n---\n\n${markdown}\n`;
    const blob = new Blob([snapshot], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${readerNote.id.split("/").pop() || "note"}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    queueToast(languageIsVi ? "Đã tải bản Markdown" : "Markdown snapshot downloaded");
  };

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const saveLabel = saveState === "loading"
    ? (languageIsVi ? "Đang tải tiến độ" : "Loading progress")
    : saveState === "saving"
      ? (languageIsVi ? "Đang lưu…" : "Saving…")
      : saveState === "error"
        ? (languageIsVi ? "Lỗi đồng bộ" : "Sync error")
        : (languageIsVi ? "Đã lưu" : "Saved");
  const displayStatus = languageIsVi
    ? { planned: "Chưa bắt đầu", "in-progress": "Đang thực hiện", blocked: "Đang vướng mắc", done: "Hoàn thành" }
    : { planned: "Not started", "in-progress": "In progress", blocked: "Blocked", done: "Done" };
  const checkedTaskMap = Object.fromEntries(Object.values(allProgress).flatMap((progress) => Object.entries(progress.checked ?? {})));

  return <article className="note-reader">
    <header className="note-reader__header">
      <div className="note-reader__identity">
        <nav className="note-reader__breadcrumbs" aria-label={languageIsVi ? "Đường dẫn" : "Breadcrumbs"}>
          <Link href="/">{languageIsVi ? "TRANG CHỦ" : "HOME"}</Link><span>/</span><span>{readerNote.kind.toUpperCase()}</span>
        </nav>
        <h1>{lesson&&dayIndex!==undefined?lesson.sessions[dayIndex].title[language]:localTitle}</h1>
        <p className="note-reader__path">{lesson&&readerNote.meta.date?new Date(`${readerNote.meta.date}T12:00:00+07:00`).toLocaleDateString(languageIsVi?'vi-VN':'en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}):readerNote.title}</p>
      </div>
      <div className="note-reader__actions">
        <span className={`save-indicator save-indicator--${saveState}`} role="status" aria-live="polite"><i aria-hidden="true" />{saveLabel}</span>
        {authenticated && owner && <span className="note-reader__owner">{owner.avatarUrl&&<img src={owner.avatarUrl} alt="" referrerPolicy="no-referrer" />}{owner.login}</span>}
        <button className="reader-tool" type="button" onClick={() => setSearchOpen(true)}><span aria-hidden="true">⌕</span>{languageIsVi ? "Tìm" : "Search"}<kbd>⌘K</kbd></button>
        {authenticated && <button className="reader-tool" type="button" disabled={!noteRevision || sessionLoading} title={noteReadError || undefined} onClick={() => { setMarkdownDraft(languageIsVi ? (readerNote.bodyVi || readerNote.body) : readerNote.body); setMarkdownError(""); setMarkdownEditing((editing) => !editing); }}><span aria-hidden="true">✎</span>{markdownEditing ? (languageIsVi ? "Đọc" : "Read") : (languageIsVi ? (lesson ? "Sửa MD gốc" : "Sửa MD") : (lesson ? "Edit original MD" : "Edit MD"))}</button>}
        <button className="reader-tool" type="button" onClick={downloadSnapshot}><span aria-hidden="true">↓</span>{languageIsVi ? "Tải MD" : "Save MD"}</button>
      </div>
    </header>
    {dailyNavigation && <nav className="daily-reader-nav" aria-label={languageIsVi?'Chuyển ngày':'Day navigation'}>
      {dailyNavigation.previous?<Link href={dailyNavigation.previous.href}>← {dailyNavigation.previous.date}</Link>:<span/>}
      <Link href="/daily?curriculum=v1">{languageIsVi?'Lịch v1':'Legacy calendar'}</Link>
      {dailyNavigation.next?<Link href={dailyNavigation.next.href}>{dailyNavigation.next.date} →</Link>:<span/>}
    </nav>}

    {saveError && <div className="reader-error" role="alert"><strong>{languageIsVi ? "Không đồng bộ được" : "Sync error"}</strong><span>{saveError}</span><button type="button" onClick={() => setSaveError("")} aria-label={languageIsVi ? "Đóng thông báo" : "Dismiss error"}>×</button></div>}

    {authenticated && <details className="note-reader__original-plan"><summary>{languageIsVi?'Nhật ký và tiến độ học':'Study log and progress'}</summary><section className="progress-panel" aria-label={languageIsVi ? "Tiến độ học" : "Study progress"}>
      <div className="progress-panel__heading"><span className="progress-panel__eyebrow">{languageIsVi ? "NHẬT KÝ HỌC TẬP" : "STUDY LOG"}</span><span>{languageIsVi ? "Chỉ chủ sở hữu chỉnh sửa" : "Owner only"}</span></div>
      <div className="progress-panel__fields">
        <label className="progress-field"><span>{languageIsVi ? "Trạng thái" : "Status"}</span><select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as (typeof STATUS_OPTIONS)[number])}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{displayStatus[status]}</option>)}</select></label>
        <label className="progress-field progress-field--minutes"><span>{languageIsVi ? "Thời gian thực tế" : "Actual time"}</span><div><input type="number" min="0" max="1440" step="5" value={draftMinutes} onChange={(event) => setDraftMinutes(event.target.value)} placeholder="0" /><small>{languageIsVi ? "phút" : "min"}</small></div></label>
      </div>
      <label className="progress-field progress-field--evidence"><span>{languageIsVi ? "Bằng chứng / ghi chú tiến độ" : "Evidence / progress notes"}</span><textarea value={draftEvidence} onChange={(event) => setDraftEvidence(event.target.value)} rows={3} placeholder={languageIsVi ? "Ghi lại điều bạn đã làm, phát hiện hoặc cần tiếp tục…" : "Record what you completed, learned, or need to continue…"} /></label>
      <div className="progress-panel__footer"><span>{currentProgress.updatedAt ? `${languageIsVi ? "Cập nhật" : "Updated"} · ${new Date(currentProgress.updatedAt).toLocaleDateString(languageIsVi ? "vi-VN" : "en-US")}` : (languageIsVi ? "Tiến độ có thể xem công khai; ghi chú bằng chứng chỉ bạn xem." : "Progress is public; evidence notes are visible only to you.")}</span><button className="progress-save" type="button" onClick={saveEvidence} disabled={sessionLoading || saveState === "saving"}>{languageIsVi ? "Lưu tiến độ" : "Save progress"}<span aria-hidden="true">↗</span></button></div>
    </section></details>}

    {noteReadError && authenticated && <p className="reader-readonly">{languageIsVi ? "Chế độ đọc đang dùng bản đã xuất bản; không tải được phiên bản để chỉnh sửa." : "Reading the published copy; an editable revision could not be loaded."}</p>}
    {markdownEditing ? <section className="markdown-editor" aria-label={languageIsVi ? "Trình soạn thảo Markdown" : "Markdown editor"}>
      <div className="markdown-editor__heading"><strong>{languageIsVi ? "NGUỒN MARKDOWN" : "MARKDOWN SOURCE"}</strong><span>{languageIsVi ? "Chỉ sửa ngôn ngữ đang chọn · Giữ nguyên số ô checklist." : "Editing the selected language · Keep the checklist count unchanged."}</span></div>
      <textarea value={markdownDraft} onChange={(event) => setMarkdownDraft(event.target.value)} spellCheck={false} aria-label={languageIsVi ? "Nội dung Markdown" : "Markdown source"} />
      {markdownError && <p className="reader-error__inline" role="alert">{markdownError}</p>}
      <div className="markdown-editor__actions"><button className="reader-tool" type="button" onClick={() => { setMarkdownEditing(false); setMarkdownDraft(languageIsVi ? (readerNote.bodyVi || readerNote.body) : readerNote.body); setMarkdownError(""); }} disabled={markdownSaving}>{languageIsVi ? "Hủy" : "Cancel"}</button><button className="progress-save" type="button" onClick={saveMarkdown} disabled={markdownSaving || sessionLoading || !noteRevision}>{markdownSaving ? (languageIsVi ? "Đang lưu…" : "Saving…") : (languageIsVi ? "Lưu Markdown" : "Save Markdown")}<span aria-hidden="true">↗</span></button></div>
    </section> : <>
      {lesson && dayIndex !== undefined && <DailyLesson lesson={lesson} dayIndex={dayIndex} noteId={readerNote.id} checkedTasks={checkedTaskMap} canEdit={authenticated && progressLoaded && saveState !== 'saving'} onTaskToggle={updateTask} />}
      {lesson && dayIndex !== undefined ? <details className="note-reader__original-plan">
        <summary>{languageIsVi ? "Kế hoạch Obsidian gốc (tham khảo)" : "Original Obsidian plan (reference)"}</summary>
        <div className="note-reader__body"><MarkdownContent note={readerNote} notes={noteIndex} checkedTasks={checkedTaskMap} canEdit={authenticated && progressLoaded && saveState !== 'saving'} onTaskToggle={updateTask} /></div>
      </details> : <div className="note-reader__body"><MarkdownContent note={readerNote} notes={noteIndex} checkedTasks={checkedTaskMap} canEdit={authenticated && progressLoaded && saveState !== 'saving'} onTaskToggle={updateTask} /></div>}
    </>}

    {!authenticated && <p className="reader-readonly">{languageIsVi ? "Ai cũng có thể đọc · Chỉ chủ sở hữu dakiemdarktharr được đăng nhập để chỉnh sửa tiến độ." : "Everyone can read · Only owner dakiemdarktharr can sign in to edit progress."}</p>}
    {authenticated && progressLoaded && <p className="reader-readonly">{languageIsVi ? "Bạn có thể chỉnh sửa Markdown, checklist và tiến độ trong tài khoản của mình." : "You can edit Markdown, checklists, and progress in your account."}</p>}
    {toast && <div className="reader-toast" role="status">{toast}</div>}
    <SearchDialog open={searchOpen} onClose={closeSearch} notes={notes} />
  </article>;
}
