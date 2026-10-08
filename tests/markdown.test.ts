import assert from "node:assert/strict";
import test from "node:test";
import { normalizeNoteId, remarkCallouts, remarkHashtags, remarkTaskIndexes, resolveMarkdownHref, resolveWikiTarget, rewriteWikiLinks, routeForNote } from "../lib/markdown";
import type { Note } from "../lib/types";

const note = (overrides: Partial<Note> = {}): Note => ({
  id: "Daily/2026-10-08",
  title: "Thursday",
  titleVi: "Thứ Năm",
  body: "",
  bodyVi: "",
  kind: "daily",
  meta: { date: "2026-10-08" },
  ...overrides,
});

test("note routes point daily and project notes to their app screens", () => {
  assert.equal(routeForNote(note()), "/daily/2026-10-08");
  assert.equal(routeForNote(note({ id: "Projects/P03", kind: "project", meta: {} })), "/projects/P03");
  assert.equal(routeForNote(note({ id: "Weeks/W001", kind: "week", meta: {} })), "/notes/Weeks/W001");
  assert.equal(routeForNote(note({ id: "Resources/ANALYSIS", kind: "resource", meta: {} })), "/notes/Resources/ANALYSIS");
  assert.equal(normalizeNoteId("Road to Quant\\Daily\\2026-10-08.md"), "Daily/2026-10-08");
});

test("wikilinks support aliases and embeds while preserving inline and fenced code", () => {
  const source = "Open [[Projects/P01|the first project]] and ![[Resources/Statistical Learning]]\n`[[not-a-link]]`\n```md\n[[also-not-a-link]]\n```\n";
  const result = rewriteWikiLinks(source);
  assert.match(result, /\[the first project\]\(\/__obsidian\/note\/Projects%2FP01\)/);
  assert.match(result, /\[Statistical Learning\]\(\/__obsidian\/embed\/Resources%2FStatistical%20Learning\)/);
  assert.match(result, /`\[\[not-a-link\]\]`/);
  assert.match(result, /```md\n\[\[also-not-a-link\]\]/);
});

test("wiki and relative links resolve through the supplied note index", () => {
  const project = note({ id: "Projects/P01", title: "Foundations", titleVi: "Nền tảng", kind: "project", meta: {} });
  const daily = note();
  const notes = [project, daily];
  assert.equal(resolveWikiTarget("P01#Weekly plan", "Daily/2026-10-08", notes), "/projects/P01#weekly-plan");
  assert.equal(resolveWikiTarget("#Today", "Daily/2026-10-08", notes), "/daily/2026-10-08#today");
  assert.equal(resolveMarkdownHref("../Projects/P01.md", "Daily/2026-10-08", notes), "/projects/P01");
});

test("external links remain safe and executable URL schemes are rejected", () => {
  assert.equal(resolveMarkdownHref("https://example.org/paper", "Daily/2026-10-08"), "https://example.org/paper");
  assert.equal(resolveMarkdownHref("//example.org/paper", "Daily/2026-10-08"), "https://example.org/paper");
  assert.equal(resolveMarkdownHref("javascript:alert(1)", "Daily/2026-10-08"), "#unsafe-link");
  assert.equal(resolveMarkdownHref("ftp://example.org/paper", "Daily/2026-10-08"), "#unsafe-link");
  assert.equal(resolveMarkdownHref("#Café / Data", "Daily/2026-10-08"), "#cafe-data");
});

test("task index plugin assigns a single ordered index to translated-note-compatible tasks", () => {
  const tree: Parameters<ReturnType<typeof remarkTaskIndexes>>[0] = { type: "root", children: [{ type: "list", children: [
    { type: "listItem", checked: false, children: [] },
    { type: "listItem", checked: true, children: [] },
    { type: "listItem", checked: null, children: [] },
    { type: "listItem", checked: false, children: [] },
  ] }] };
  remarkTaskIndexes()(tree);
  const items = tree.children![0].children!;
  assert.equal(items[0].data?.hProperties?.["data-task-index"], 0);
  assert.equal(items[1].data?.hProperties?.["data-task-index"], 1);
  assert.equal(items[2].data?.hProperties?.["data-task-index"], undefined);
  assert.equal(items[3].data?.hProperties?.["data-task-index"], 2);
});

test("callout and hashtag plugins convert Obsidian syntax to semantic markdown nodes", () => {
  const calloutTree: Parameters<ReturnType<typeof remarkCallouts>>[0] = { type: "root", children: [{ type: "blockquote", children: [{ type: "paragraph", children: [{ type: "text", value: "[!warning]- Verify the split" }] }] }] };
  remarkCallouts()(calloutTree);
  assert.equal(calloutTree.children![0].data?.hName, "callout");
  assert.equal(calloutTree.children![0].data?.hProperties?.kind, "warning");
  assert.equal(calloutTree.children![0].data?.hProperties?.collapsed, true);
  assert.equal(calloutTree.children![0].data?.hProperties?.title, "Verify the split");

  const hashtagTree: Parameters<ReturnType<typeof remarkHashtags>>[0] = { type: "paragraph", children: [{ type: "text", value: "Review #backtesting and #time-series" }] };
  remarkHashtags()(hashtagTree);
  assert.deepEqual(hashtagTree.children!.filter((child) => child.type === "link").map((child) => child.children?.[0].value), ["#backtesting", "#time-series"]);
});
