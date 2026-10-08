"use client";

import { useMemo, useState, useEffect, createContext, useContext, type ComponentProps, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useLanguage } from "@/components/providers";
import { normalizeNoteId, resolveMarkdownHref, resolveWikiTarget, rewriteWikiLinks, slugForHeading, remarkCallouts, remarkHashtags, remarkTaskIndexes } from "@/lib/markdown";
import type { Note } from "@/lib/types";
import "katex/dist/katex.min.css";

type MarkdownContentProps = {
  note: Note;
  notes: readonly Note[];
  checkedTasks: Record<string, boolean>;
  canEdit: boolean;
  onTaskToggle?: (noteId: string, index: number, checked: boolean) => void;
  visited?: ReadonlySet<string>;
  depth?: number;
};

const TaskIndexContext = createContext<number | undefined>(undefined);

function flattenText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(flattenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return flattenText((children as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

function decodeTarget(encoded: string): string {
  try { return decodeURIComponent(encoded); } catch { return encoded; }
}

function lookupNote(target: string, source: Note, notes: readonly Note[]): Note | undefined {
  const noteTarget = target.split("#", 1)[0];
  const normalized = normalizeNoteId(noteTarget).toLocaleLowerCase();
  const exact = notes.find((item) => normalizeNoteId(item.id).toLocaleLowerCase() === normalized);
  if (exact) return exact;
  const title = noteTarget.split("/").pop()?.toLocaleLowerCase();
  return notes.find((item) => item.title.toLocaleLowerCase() === title || item.titleVi.toLocaleLowerCase() === title || normalizeNoteId(item.id).split("/").pop()?.toLocaleLowerCase() === title)
    ?? (normalizeNoteId(source.id).toLocaleLowerCase() === normalized ? source : undefined);
}

function NoteEmbed({ target, source, notes, checkedTasks, canEdit, onTaskToggle, visited, depth }: {
  target: string; source: Note; notes: readonly Note[]; checkedTasks: Record<string, boolean>; canEdit: boolean;
  onTaskToggle?: (noteId: string, index: number, checked: boolean) => void; visited: ReadonlySet<string>; depth: number;
}) {
  const { language } = useLanguage();
  const known = lookupNote(target, source, notes);
  const [loaded, setLoaded] = useState<Note>();
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(!known);
  const noteTarget = target.split("#", 1)[0];

  useEffect(() => {
    if (known) {
      setLoaded(undefined);
      setFailed(false);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    const path = normalizeNoteId(noteTarget).split("/").map(encodeURIComponent).join("/");
    fetch(`/api/notes/${path}`, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Note unavailable");
        return response.json() as Promise<{ note?: Note } | Note>;
      })
      .then((payload) => {
        if (controller.signal.aborted) return;
        const embedded: Note = "note" in payload ? payload.note as Note : payload as Note;
        if (!embedded || typeof embedded.id !== "string") throw new Error("Note response was invalid");
        setLoaded(embedded);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) { setFailed(true); setLoading(false); }
      });
    return () => controller.abort();
  }, [known, noteTarget]);

  const embedded = known ?? loaded;
  const blocked = depth >= 5 || Boolean(embedded && visited.has(embedded.id));
  if (loading) return <aside className="embedded-note embedded-note--missing" role="status">{language === "vi" ? "Đang tải ghi chú được nhúng…" : "Loading embedded note…"}</aside>;
  if (!embedded || failed || blocked) return <aside className="embedded-note embedded-note--missing">
    <span>{language === "vi" ? "Không thể nhúng ghi chú:" : "Note embed unavailable:"} {target}</span>
    {blocked && <small>{language === "vi" ? "Đã ngăn vòng lặp nhúng." : "A circular or deeply nested embed was stopped."}</small>}
    <a href={resolveWikiTarget(target, source.id, notes)}>{language === "vi" ? "Mở ghi chú ↗" : "Open note ↗"}</a>
  </aside>;
  const heading = language === "vi" ? (embedded.titleVi || embedded.title) : embedded.title;
  return <section className="embedded-note" aria-label={language === "vi" ? `Ghi chú nhúng: ${heading}` : `Embedded note: ${heading}`}>
    <header><span className="embedded-note__eyebrow">{language === "vi" ? "GHI CHÚ NHÚNG" : "EMBEDDED NOTE"}</span><a href={resolveWikiTarget(target, source.id, notes)}>{heading} ↗</a></header>
    <MarkdownContent note={embedded} notes={notes} checkedTasks={checkedTasks} canEdit={canEdit} onTaskToggle={onTaskToggle} visited={new Set([...visited, embedded.id])} depth={depth + 1} />
  </section>;
}

export function MarkdownContent({ note, notes, checkedTasks, canEdit, onTaskToggle, visited = new Set([note.id]), depth = 0 }: MarkdownContentProps) {
  const { language } = useLanguage();
  const body = language === "vi" ? (note.bodyVi || note.body) : note.body;
  const markdown = useMemo(() => rewriteWikiLinks(body), [body]);
  const components = useMemo<Components>(() => {
    const toggleTitle = language === "vi" ? "Nhấn để thu gọn hoặc mở rộng" : "Click to collapse or expand";
    const taskLabel = (isChecked: boolean) => language === "vi" ? (isChecked ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành") : (isChecked ? "Mark task incomplete" : "Mark task complete");

    const components: Components = {
      a({ href = "", children, className, node: _node, ...props }) {
        const embedMatch = href.match(/^\/__obsidian\/embed\/(.+)$/);
        const wikiMatch = href.match(/^\/__obsidian\/note\/(.+)$/);
        if (embedMatch) {
          const target = decodeTarget(embedMatch[1]);
          if (/\.base(?:$|#)/i.test(target)) {
            const view = target.split("#").slice(1).join("#").trim() || (language === "vi" ? "Lịch học" : "Study calendar");
            return <a className="dashboard-embed" href="/daily">
              <span className="dashboard-embed__eyebrow">{language === "vi" ? "BẢNG ĐIỀU KHIỂN TRỰC TIẾP" : "LIVE STUDY DASHBOARD"}</span>
              <strong>{view}</strong>
              <small>{language === "vi" ? "Mở lịch học để xem hôm nay và các ngày sắp tới ↗" : "Open Daily to see today and the next study days ↗"}</small>
            </a>;
          }
          return <NoteEmbed target={target} source={note} notes={notes} checkedTasks={checkedTasks} canEdit={canEdit} onTaskToggle={onTaskToggle} visited={visited} depth={depth} />;
        }
        if (wikiMatch) {
          const target = decodeTarget(wikiMatch[1]);
          if (/\.base(?:$|#)/i.test(target)) {
            return <a className="dashboard-base-link" href="/daily">{children}<span aria-hidden="true"> ↗</span><small>{language === "vi" ? "Bảng điều khiển lịch học" : "Live study dashboard"}</small></a>;
          }
          return <a href={resolveWikiTarget(target, note.id, notes)} {...props}>{children}</a>;
        }
        const resolved = resolveMarkdownHref(href, note.id, notes);
        const external = /^https?:\/\//i.test(resolved);
        const safeHref = /^(?:javascript|data|vbscript):/i.test(resolved) ? "#unsafe-link" : resolved;
        return <a href={safeHref} className={className} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...props}>{children}</a>;
      },
      li({ children, className, node: _node, ...props }) {
        const indexValue = (props as ComponentProps<"li"> & { "data-task-index"?: number | string })["data-task-index"];
        const index = indexValue === undefined ? undefined : Number(indexValue);
        const cleanProps = { ...props } as ComponentProps<"li"> & { "data-task-index"?: number | string };
        delete cleanProps["data-task-index"];
        return <TaskIndexContext.Provider value={Number.isFinite(index) ? index : undefined}><li className={className} {...cleanProps}>{children}</li></TaskIndexContext.Provider>;
      },
      input({ type, checked, disabled, node: _node, ...props }) {
        const index = useContext(TaskIndexContext);
        if (type !== "checkbox" || index === undefined) return <input type={type} checked={checked} disabled {...props} />;
        const key = `${note.id}::${index}`;
        const value = Object.prototype.hasOwnProperty.call(checkedTasks, key) ? checkedTasks[key] : Boolean(checked);
        return <input
          {...props}
          className="note-task-checkbox"
          type="checkbox"
          checked={value}
          disabled={!canEdit || disabled}
          aria-label={taskLabel(value)}
          onChange={(event) => onTaskToggle?.(note.id, index, event.currentTarget.checked)}
        />;
      },
      blockquote({ children, node: _node }) {
        return <blockquote className="note-blockquote">{children}</blockquote>;
      },
      ...({ callout: ({ children, kind, title, collapsed }: { children?: ReactNode; kind?: string; title?: string; collapsed?: boolean }) => {
        const kindText = String(kind ?? "note");
        const displayTitle = String(title || kindText.replace(/[-_]/g, " ").replace(/\b\w/g, (part) => part.toLocaleUpperCase()));
        return <details className={`note-callout note-callout--${kindText}`} data-kind={kindText} open={!collapsed}>
          <summary title={toggleTitle}><span className="note-callout__marker">{kindText === "warning" || kindText === "danger" ? "!" : kindText === "question" ? "?" : "↳"}</span>{displayTitle}</summary>
          <div className="note-callout__body">{children}</div>
        </details>;
      } } as unknown as Components),
      h1({ children, node: _node, ...props }) { return <h1 id={slugForHeading(flattenText(children))} {...props}>{children}</h1>; },
      h2({ children, node: _node, ...props }) { return <h2 id={slugForHeading(flattenText(children))} {...props}>{children}</h2>; },
      h3({ children, node: _node, ...props }) { return <h3 id={slugForHeading(flattenText(children))} {...props}>{children}</h3>; },
      h4({ children, node: _node, ...props }) { return <h4 id={slugForHeading(flattenText(children))} {...props}>{children}</h4>; },
      h5({ children, node: _node, ...props }) { return <h5 id={slugForHeading(flattenText(children))} {...props}>{children}</h5>; },
      h6({ children, node: _node, ...props }) { return <h6 id={slugForHeading(flattenText(children))} {...props}>{children}</h6>; },
      table({ children, node: _node, ...props }) { return <div className="note-table-scroll"><table {...props}>{children}</table></div>; },
      img({ src = "", alt = "", node: _node, ...props }) { return <img src={src} alt={alt} loading="lazy" {...props} />; },
    };
    return components;
  }, [canEdit, checkedTasks, depth, language, note, notes, onTaskToggle, visited]);

  return <div className="markdown-content">
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkTaskIndexes, remarkCallouts, remarkHashtags]} rehypePlugins={[rehypeKatex]} components={components}>
      {markdown}
    </ReactMarkdown>
  </div>;
}
