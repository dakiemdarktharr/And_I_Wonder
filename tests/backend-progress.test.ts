import assert from "node:assert/strict";
import { test } from "node:test";
import {
  countMarkdownTasks,
  isValidNoteId,
  normalizeEvidence,
  validateProgressPatch,
  validateTaskId,
} from "@/lib/progress";
import type { Note } from "@/lib/types";

const note: Note = {
  id: "Daily/2026-10/2026-10-07",
  title: "Day 1",
  titleVi: "Ngày 1",
  body: "- [ ] First\n- [x] Second\n",
  bodyVi: "- [ ] Một\n- [ ] Hai\n",
  kind: "daily",
  meta: {},
};

test("note IDs and positional checkbox IDs are constrained to real Markdown tasks", () => {
  assert.equal(isValidNoteId(note.id), true);
  assert.equal(isValidNoteId("GitHub Publishing Checklist"), true);
  assert.equal(isValidNoteId("../../secret"), false);
  assert.equal(isValidNoteId("Daily/../secret"), false);
  assert.equal(countMarkdownTasks(note.body), 2);
  assert.equal(countMarkdownTasks("- [ ] Real\n\n```md\n- [ ] Example only\n```\n\n> - [x] Quoted task\n> ```\n> - [ ] Fenced quote example\n> ```\n"), 2);
  assert.equal(validateTaskId(note, `${note.id}::0`), 0);
  assert.equal(validateTaskId(note, `${note.id}::1`), 1);
  assert.equal(validateTaskId(note, `${note.id}::2`), null);
  assert.equal(validateTaskId(note, "Daily/2026-10/2026-10-08::0"), null);
  assert.equal(validateTaskId(note, `${note.id}::99999`), null);
});

test("checkbox patch accepts false and rejects malformed or unknown fields", () => {
  assert.deepEqual(validateProgressPatch(note.id, {
    noteId: note.id, taskId: `${note.id}::0`, checked: false,
  }), { patch: { taskId: `${note.id}::0`, checked: false } });
  assert.equal(validateProgressPatch(note.id, { noteId: note.id, taskId: `${note.id}::0` }).error, "Checkbox updates require checked=true or false.");
  assert.equal(validateProgressPatch(note.id, { noteId: note.id, checked: true }).error, "checked must be sent with taskId.");
  assert.match(validateProgressPatch(note.id, { noteId: note.id, query: { $where: "1" } }).error || "", /unsupported/);
});

test("self-contained lesson checkboxes are separate from imported Markdown progress", () => {
  const study = {...note, meta:{planned_minutes:240}};
  assert.equal(validateTaskId(study,`${note.id}::lesson0`),'lesson0');
  assert.equal(validateTaskId(study,`${note.id}::lesson3`),'lesson3');
  assert.equal(validateTaskId(study,`${note.id}::lesson4`),null);
  assert.equal(validateTaskId(study,`${note.id}::lesson0.$set`),null);
  assert.equal(validateTaskId({...study,meta:{planned_minutes:0}},`${note.id}::lesson0`),null);
  assert.equal(validateTaskId({...study,kind:'project'},`${note.id}::lesson0`),null);
  assert.equal(validateTaskId(study,`${note.id}::0`),0);
});

test("status, time, and private evidence have bounded input", () => {
  assert.deepEqual(validateProgressPatch(note.id, {
    noteId: note.id, status: "done", actualMinutes: 240, evidence: " derivation recorded ",
  }), { patch: { status: "done", actualMinutes: 240, evidence: "derivation recorded" } });
  assert.match(validateProgressPatch(note.id, { noteId: note.id, status: "admin" }).error || "", /status/);
  assert.match(validateProgressPatch(note.id, { noteId: note.id, actualMinutes: 1.5 }).error || "", /actualMinutes/);
  assert.equal(normalizeEvidence("<img src=x onerror=alert(1)>proof</img>"), "proof");
  assert.equal(normalizeEvidence("x".repeat(10_001)), null);
});
