"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/components/providers";
import { routeForNote } from "@/lib/markdown";
import type { Note } from "@/lib/types";
import { useRouter } from "next/navigation";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Pass a compact index for instant local search. With no index, search uses /api/search. */
  notes?: readonly Note[];
};

// Only accept internal links emitted by the curriculum search index.
function searchHref(note: Note) {
 const href=note.meta.href;
 return typeof href==='string'&&/^\/(daily|projects)\/[A-Za-z0-9/-]+\?curriculum=v[12]$/.test(href)?href:routeForNote(note);
}

function noteDescription(note: Note, language: "vi" | "en"): string {
  const preferred = language === "vi" ? note.meta.descriptionVi ?? note.meta.summaryVi : note.meta.description ?? note.meta.summary;
  if (typeof preferred === "string") return preferred;
  const body = language === "vi" ? (note.bodyVi || note.body) : note.body;
  const snippet = body
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[\[[^\]]+\]\]/g, "")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, "$2$1")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (snippet) return snippet.length > 108 ? `${snippet.slice(0, 105)}…` : snippet;
  if (note.kind === "daily") return String(note.meta.date ?? note.id.split("/").pop() ?? "");
  if (note.kind === "project") return language === "vi" ? "Tuyến dự án" : "Project line";
  if (note.kind === "resource") return language === "vi" ? "Tài liệu tham khảo" : "Reference material";
  return note.kind.toLocaleUpperCase();
}

export function SearchDialog({ open, onClose, notes }: SearchDialogProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [remoteNotes, setRemoteNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const previousFocus = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('input,button,a[href]') || []);
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onEscape);
      document.body.style.overflow = previousOverflow;
      if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    };
  }, [onClose, open]);

  const localSearch = useMemo(() => {
    if (!notes?.length || !query.trim()) return [];
    const needle = query.trim().toLocaleLowerCase();
    return notes.filter((note) => {
      const text = [note.title, note.titleVi, note.id, note.kind, note.meta.searchText, note.meta.searchTextVi]
        .filter((part): part is string => typeof part === "string")
        .join(" ")
        .toLocaleLowerCase();
      return text.includes(needle);
    }).slice(0, 30);
  }, [notes, query]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!open || notes?.length || trimmed.length < 2) {
      setRemoteNotes([]);
      setLoading(false);
      setError("");
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        const payload = await response.json() as { notes?: Note[] } | Note[];
        setRemoteNotes(Array.isArray(payload) ? payload : payload.notes ?? []);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setRemoteNotes([]);
          setError(cause instanceof Error ? cause.message : "Search unavailable");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [notes, open, query]);

  const results = notes?.length ? localSearch : remoteNotes;
  const close = useCallback(() => onClose(), [onClose]);
  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" && results[activeIndex]) {
      router.push(searchHref(results[activeIndex]));
      close();
    }
  };

  if (!open) return null;
  const copy = language === "vi"
    ? { placeholder: "Tìm ghi chú, dự án, tài liệu…", hint: "↑↓ di chuyển · Enter mở · Esc đóng", empty: query.length < 2 ? "Nhập ít nhất hai ký tự để tìm kiếm." : "Không tìm thấy ghi chú nào.", loading: "Đang tìm…", error: "Tìm kiếm tạm thời không khả dụng." }
    : { placeholder: "Search notes, projects, resources…", hint: "↑↓ navigate · Enter open · Esc close", empty: query.length < 2 ? "Type at least two characters to search." : "No notes found.", loading: "Searching…", error: "Search is temporarily unavailable." };

  return <div className="search-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <section ref={dialogRef} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
      <h2 className="visually-hidden" id="search-dialog-title">{language === "vi" ? "Tìm kiếm ghi chú" : "Search notes"}</h2>
      <div className="search-dialog__field"><span aria-hidden="true">⌕</span><input ref={inputRef} type="search" value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} onKeyDown={onInputKeyDown} placeholder={copy.placeholder} aria-label={copy.placeholder} aria-controls="search-results" /><button className="search-dialog__close" onClick={close} aria-label={language==='vi'?'Đóng tìm kiếm':'Close search'}>×</button></div>
      <div className="search-dialog__results" id="search-results" role="listbox" aria-label={language === "vi" ? "Kết quả tìm kiếm" : "Search results"}>
        {results.map((note, index) => <a
          key={note.id}
          className={`search-result${index === activeIndex ? " search-result--active" : ""}`}
          href={searchHref(note)}
          role="option"
          aria-selected={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            router.push(searchHref(note));
            close();
          }}
        >
          <span className="search-result__kind">{note.kind}</span>
          <span className="search-result__text"><strong>{language === "vi" ? (note.titleVi || note.title) : note.title}</strong><small>{noteDescription(note, language)}</small></span>
          <span className="search-result__arrow" aria-hidden="true">↗</span>
        </a>)}
        {!results.length && <p className="search-dialog__empty" role="status">{loading ? copy.loading : error ? copy.error : copy.empty}</p>}
      </div>
      <footer className="search-dialog__footer">{copy.hint}{error && <span className="search-dialog__error"> · {error}</span>}</footer>
    </section>
  </div>;
}
