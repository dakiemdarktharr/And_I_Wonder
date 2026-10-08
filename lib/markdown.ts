import type { Note } from "@/lib/types";

/** Encode a vault-relative note path while keeping its folder separators readable. */
function encodeNotePath(id: string): string {
  return id
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function normalizeNoteId(value: string): string {
  let path = value.trim().replace(/\\/g, "/");
  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep a malformed percent sequence literal so a broken link stays navigable.
  }
  path = path.replace(/^\/+/, "").replace(/\.md$/i, "");
  path = path.replace(/^Road to Quant\//i, "");
  const parts: string[] = [];
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}

function metadataDate(note: Note): string | undefined {
  const raw = note.meta.date ?? note.meta.day ?? note.meta.created;
  if (typeof raw === "string") {
    const match = raw.match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  return note.id.match(/\d{4}-\d{2}-\d{2}/)?.[0];
}

/** Map a vault note to the public page that displays it. */
export function routeForNote(noteOrId: Note | string): string {
  const note = typeof noteOrId === "string" ? undefined : noteOrId;
  const id = normalizeNoteId(typeof noteOrId === "string" ? noteOrId : noteOrId.id);
  const kind = note?.kind;

  if (kind === "daily" || /(?:^|\/)Daily\//i.test(id) || /^\d{4}-\d{2}-\d{2}$/.test(id)) {
    const date = metadataDate(note ?? ({ id, meta: {} } as Note));
    if (date) return `/daily/${date}`;
  }
  if (kind === "project" || /^Projects\//i.test(id)) {
    return `/projects/${encodeURIComponent(id.split("/").pop() ?? id)}`;
  }
  if (kind === "week" || kind === "month" || /^Weeks\//i.test(id) || /^Months\//i.test(id)) {
    return `/notes/${encodeNotePath(id)}`;
  }
  return `/notes/${encodeNotePath(id)}`;
}

function noteMatch(target: string, sourceId: string, notes: readonly Note[]): Note | undefined {
  const normalized = normalizeNoteId(target);
  const exact = notes.find((note) => normalizeNoteId(note.id).toLocaleLowerCase() === normalized.toLocaleLowerCase());
  if (exact) return exact;

  const sourceFolder = normalizeNoteId(sourceId).split("/").slice(0, -1).join("/");
  const relative = normalizeNoteId(`${sourceFolder}/${target}`);
  const sibling = notes.find((note) => normalizeNoteId(note.id).toLocaleLowerCase() === relative.toLocaleLowerCase());
  if (sibling) return sibling;

  const tail = normalized.split("/").pop()?.toLocaleLowerCase();
  if (!tail) return undefined;
  return notes.find((note) => {
    const noteId = normalizeNoteId(note.id).toLocaleLowerCase();
    const title = note.title.toLocaleLowerCase();
    const titleVi = note.titleVi.toLocaleLowerCase();
    return noteId.split("/").pop() === tail || title === target.toLocaleLowerCase() || titleVi === target.toLocaleLowerCase();
  });
}

/** Resolve an Obsidian wikilink using the supplied compact note index. */
export function resolveWikiTarget(target: string, sourceId: string, notes: readonly Note[] = []): string {
  const [rawPath, ...headingParts] = target.trim().split("#");
  const heading = headingParts.join("#").trim();
  const found = noteMatch(rawPath || sourceId, sourceId, notes);
  const base = found ? routeForNote(found) : routeForNote(rawPath ? normalizeNoteId(rawPath) : sourceId);
  if (!heading) return base;
  const anchor = heading.startsWith("^") ? heading.slice(1) : slugForHeading(heading);
  return `${base}#${encodeURIComponent(anchor)}`;
}

export function resolveMarkdownHref(href: string, sourceId: string, notes: readonly Note[] = []): string {
  const value = href.trim();
  if (!value) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("#")) return `#${encodeURIComponent(slugForHeading(decodeURIComponentSafe(value.slice(1))))}`;
  if (/^(?:https?:|mailto:|tel:)/i.test(value)) return value;
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return "#unsafe-link";
  if (/^(?:\/|\.\/|\.\.\/)?[^?#]+\.md(?:[#?].*)?$/i.test(value) || value.startsWith("./") || value.startsWith("../")) {
    const [fileAndQuery, hash] = value.split("#", 2);
    const [filePath, query] = fileAndQuery.split("?", 2);
    const normalized = filePath.startsWith("/")
      ? normalizeNoteId(filePath)
      : normalizeNoteId(`${normalizeNoteId(sourceId).split("/").slice(0, -1).join("/")}/${filePath}`);
    const note = noteMatch(normalized, sourceId, notes);
    const base = note ? routeForNote(note) : routeForNote(normalized);
    const suffix = `${query ? `?${query}` : ""}${hash ? `#${encodeURIComponent(slugForHeading(hash))}` : ""}`;
    return `${base}${suffix}`;
  }
  // Markdown links without a .md suffix are usually relative vault note links.
  if (!/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith("/")) {
    const [filePath, hash] = value.split("#", 2);
    const normalized = normalizeNoteId(`${normalizeNoteId(sourceId).split("/").slice(0, -1).join("/")}/${filePath}`);
    const note = noteMatch(normalized, sourceId, notes);
    if (note || notes.length > 0) {
      const base = note ? routeForNote(note) : routeForNote(normalized);
      return hash ? `${base}#${encodeURIComponent(slugForHeading(hash))}` : base;
    }
  }
  return value;
}

function decodeURIComponentSafe(value: string): string {
  try { return decodeURIComponent(value); } catch { return value; }
}

export function slugForHeading(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}_\-\s]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function escapeMarkdownLabel(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/([\[\]])/g, "\\$1");
}

/** Rewrite Obsidian links outside fenced and inline code so React Markdown can render them. */
export function rewriteWikiLinks(markdown: string): string {
  const lines = markdown.split(/(?<=\n)/);
  let fence: { char: string; size: number } | undefined;
  return lines.map((line) => {
    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = { char: marker[0], size: marker.length };
      else if (marker[0] === fence.char && marker.length >= fence.size) fence = undefined;
      return line;
    }
    if (fence) return line;

    let output = "";
    let cursor = 0;
    while (cursor < line.length) {
      if (line[cursor] === "`") {
        let delimiterEnd = cursor;
        while (line[delimiterEnd] === "`") delimiterEnd++;
        const delimiter = line.slice(cursor, delimiterEnd);
        const closing = line.indexOf(delimiter, delimiterEnd);
        if (closing >= 0) {
          output += line.slice(cursor, closing + delimiter.length);
          cursor = closing + delimiter.length;
          continue;
        }
      }
      const opening = line.indexOf("[[", cursor);
      if (opening < 0) {
        output += line.slice(cursor);
        break;
      }
      const closing = line.indexOf("]]", opening + 2);
      if (closing < 0) {
        output += line.slice(cursor);
        break;
      }
      const isEmbed = opening > 0 && line[opening - 1] === "!";
      output += line.slice(cursor, isEmbed ? opening - 1 : opening);
      const raw = line.slice(opening + 2, closing).trim();
      const [target, alias] = raw.split("|", 2).map((part) => part.trim());
      const label = alias || target.split("/").pop()?.split("#")[0] || target;
      const href = `/__obsidian/${isEmbed ? "embed" : "note"}/${encodeURIComponent(target)}`;
      output += `[${escapeMarkdownLabel(label)}](${href})`;
      cursor = closing + 2;
    }
    return output;
  }).join("");
}

type MutableNode = {
  type: string;
  value?: string;
  checked?: boolean | null;
  url?: string;
  children?: MutableNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

function visitNodes(node: MutableNode, visitor: (node: MutableNode) => void): void {
  visitor(node);
  for (const child of node.children ?? []) visitNodes(child, visitor);
}

/** Attach stable per-note indexes to GFM tasks. */
export function remarkTaskIndexes() {
  return (tree: MutableNode) => {
    let index = 0;
    visitNodes(tree, (node) => {
      if (node.type !== "listItem" || node.checked === undefined || node.checked === null) return;
      node.data ??= {};
      node.data.hProperties = {
        ...node.data.hProperties,
        "data-task-index": index++,
      };
    });
  };
}

/** Turn Obsidian's `[!kind]` blockquote prefix into a semantic expandable callout. */
export function remarkCallouts() {
  return (tree: MutableNode) => {
    visitNodes(tree, (node) => {
      if (node.type !== "blockquote") return;
      const firstParagraph = node.children?.find((child) => child.type === "paragraph");
      const firstText = firstParagraph?.children?.find((child) => child.type === "text" && child.value);
      if (!firstText?.value) return;
      const match = firstText.value.match(/^\[!([\w-]+)\]([+-])?(?:\s+(.*))?\s*$/i);
      if (!match) return;
      const [, rawKind, toggle, title] = match;
      node.data ??= {};
      node.data.hName = "callout";
      node.data.hProperties = {
        ...node.data.hProperties,
        kind: rawKind.toLocaleLowerCase(),
        title: title?.trim() || "",
        collapsed: toggle === "-",
      };
      firstText.value = "";
      if (!title?.trim() && firstParagraph?.children) {
        firstParagraph.children = firstParagraph.children.filter((child) => child !== firstText);
        if (firstParagraph.children.length === 0 && node.children) {
          node.children = node.children.filter((child) => child !== firstParagraph);
        }
      }
    });
  };
}

/** Make Obsidian hashtags searchable while keeping them as ordinary safe links. */
export function remarkHashtags() {
  return (tree: MutableNode) => {
    const transform = (parent: MutableNode) => {
      if (!parent.children) return;
      const next: MutableNode[] = [];
      for (const child of parent.children) {
        if (["link", "linkReference", "inlineCode", "code"].includes(child.type)) {
          next.push(child);
          continue;
        }
        if (child.type !== "text" || !child.value || child.value.includes("http")) {
          if (child.children) transform(child);
          next.push(child);
          continue;
        }
        const pattern = /(^|[\s([{])#([\p{L}\p{N}_][\p{L}\p{N}_/-]*)/gu;
        let cursor = 0;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(child.value))) {
          const start = match.index + match[1].length;
          if (start > cursor) next.push({ type: "text", value: child.value.slice(cursor, start) });
          const tag = match[2];
          next.push({ type: "link", url: `/?tag=${encodeURIComponent(tag)}`, children: [{ type: "text", value: `#${tag}` }], data: { hProperties: { className: ["note-hashtag"] } } });
          cursor = start + match[0].length - match[1].length;
        }
        if (cursor === 0) next.push(child);
        else if (cursor < child.value.length) next.push({ type: "text", value: child.value.slice(cursor) });
      }
      parent.children = next;
    };
    transform(tree);
  };
}
