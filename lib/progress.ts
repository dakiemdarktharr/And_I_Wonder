import type { Collection } from "mongodb";
import type { Note } from "@/lib/types";
import { getDb } from "@/lib/db";

export type ProgressView = {
  checked: Record<string, boolean>;
  status: string;
  actualMinutes: number;
  updatedAt: string;
  evidence?: string;
};

export type ProgressPatch = {
  taskId?: string;
  checked?: boolean;
  status?: string;
  actualMinutes?: number;
  evidence?: string;
};

type ProgressDocument = {
  noteId: string;
  /** Stored by numeric task position to keep Mongo field paths safe. */
  checked: Record<string, boolean>;
  status: string;
  actualMinutes: number;
  evidence: string;
  updatedAt: Date;
};

const STATUSES = new Set(["planned", "in-progress", "done", "blocked"]);
const NOTE_ID = /^[\p{L}\p{N} ._()&'/-]{1,180}$/u;
const TASK_LINE = /^\s*(?:[-*+]|\d+[.)])\s+\[([ xX])\](?:\s|$)/;
let progressIndexPromise: Promise<void> | undefined;

function progressCollection(): Promise<Collection<ProgressDocument>> {
  return getDb().then((db) => db.collection<ProgressDocument>("progress"));
}

async function writableProgressCollection(): Promise<Collection<ProgressDocument>> {
  const collection = await progressCollection();
  if (!progressIndexPromise) {
    progressIndexPromise = collection.createIndex({ noteId: 1 }, { unique: true }).then(() => undefined).catch((error: unknown) => {
      progressIndexPromise = undefined;
      throw error;
    });
  }
  await progressIndexPromise;
  return collection;
}

export function isValidNoteId(value: unknown): value is string {
  return typeof value === "string" && NOTE_ID.test(value) && !value.includes("..") && !value.startsWith("/") && !value.endsWith("/");
}

export function countMarkdownTasks(markdown: string): number {
  let count = 0;
  let fence: { character: string; length: number } | undefined;
  for (const rawLine of markdown.split(/\r?\n/)) {
    // Task lists can occur inside blockquotes. Remove quote markers before
    // examining the Markdown syntax, while still ignoring fenced code blocks.
    const line = rawLine.replace(/^\s{0,3}>\s?/g, "");
    const fenceMarker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fenceMarker) {
      if (!fence) fence = { character: fenceMarker[0], length: fenceMarker.length };
      else if (fenceMarker[0] === fence.character && fenceMarker.length >= fence.length) fence = undefined;
      continue;
    }
    if (fence) continue;
    if (TASK_LINE.test(line)) count += 1;
  }
  return count;
}

export function validateTaskId(note: Note, taskId: unknown): number | string | null {
  if (typeof taskId !== "string") return null;
  const prefix = `${note.id}::`;
  if (!taskId.startsWith(prefix)) return null;
  const suffix = taskId.slice(prefix.length);
  if (/^lesson[0-3]$/.test(suffix)) {
    return note.kind === "daily" && Number(note.meta.planned_minutes) > 0 ? suffix : null;
  }
  if (!/^\d{1,4}$/.test(suffix)) return null;
  const index = Number(suffix);
  const counts = [note.body, note.bodyVi].map(countMarkdownTasks);
  const taskCount = Math.min(...counts);
  return index < taskCount ? index : null;
}

export function normalizeEvidence(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 10_000) return null;
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

export function validateProgressPatch(noteId: string, body: unknown): { patch?: ProgressPatch; error?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "Expected a JSON object." };
  const record = body as Record<string, unknown>;
  const allowed = new Set(["noteId", "taskId", "checked", "status", "actualMinutes", "evidence"]);
  if (Object.keys(record).some((key) => !allowed.has(key))) return { error: "The request contains an unsupported field." };
  if (record.noteId !== noteId) return { error: "The note ID does not match the route." };

  const patch: ProgressPatch = {};
  if (record.taskId !== undefined) {
    if (typeof record.taskId !== "string") return { error: "taskId must be a string." };
    patch.taskId = record.taskId;
    if (typeof record.checked !== "boolean") return { error: "Checkbox updates require checked=true or false." };
    patch.checked = record.checked;
  } else if (record.checked !== undefined) {
    return { error: "checked must be sent with taskId." };
  }
  if (record.status !== undefined) {
    if (typeof record.status !== "string" || !STATUSES.has(record.status)) return { error: "status must be planned, in-progress, done, or blocked." };
    patch.status = record.status;
  }
  if (record.actualMinutes !== undefined) {
    if (!Number.isInteger(record.actualMinutes) || (record.actualMinutes as number) < 0 || (record.actualMinutes as number) > 1440) {
      return { error: "actualMinutes must be an integer from 0 to 1440." };
    }
    patch.actualMinutes = record.actualMinutes as number;
  }
  if (record.evidence !== undefined) {
    const evidence = normalizeEvidence(record.evidence);
    if (evidence === null) return { error: "evidence must be text of at most 10000 characters." };
    patch.evidence = evidence;
  }
  if (!Object.keys(patch).length) return { error: "Include at least one progress field to update." };
  return { patch };
}

function toView(document: ProgressDocument | null, noteId: string, includeEvidence: boolean): ProgressView {
  const checked: Record<string, boolean> = {};
  if (document) {
    for (const [position, value] of Object.entries(document.checked || {})) {
      if (/^(?:\d+|lesson[0-3])$/.test(position) && typeof value === "boolean") checked[`${noteId}::${position}`] = value;
    }
  }
  const result: ProgressView = {
    checked,
    status: document?.status || "planned",
    actualMinutes: Number.isInteger(document?.actualMinutes) ? document!.actualMinutes : 0,
    updatedAt: document?.updatedAt instanceof Date ? document.updatedAt.toISOString() : "",
  };
  if (includeEvidence) result.evidence = document?.evidence || "";
  return result;
}

export async function getProgressForNote(noteId: string, includeEvidence: boolean): Promise<ProgressView> {
  const collection = await progressCollection();
  const document = await collection.findOne({ noteId });
  return toView(document, noteId, includeEvidence);
}

export async function getProgressSnapshot(includeEvidence: boolean): Promise<Record<string, ProgressView>> {
  const collection = await progressCollection();
  const documents = await collection.find({}).toArray();
  const notes: Record<string, ProgressView> = {};
  for (const document of documents) notes[document.noteId] = toView(document, document.noteId, includeEvidence);
  return notes;
}

export async function writeProgress(note: Note, patch: ProgressPatch): Promise<ProgressView> {
  const collection = await writableProgressCollection();
  const values: Record<string, unknown> = { noteId: note.id, updatedAt: new Date() };
  if (patch.taskId !== undefined) {
    const index = validateTaskId(note, patch.taskId);
    if (index === null) throw new ProgressValidationError("taskId is not a checkbox in this note.");
    // The path segment is from a closed set and has already been range checked, avoiding
    // user-controlled Mongo field names while allowing atomic checkbox writes.
    values[`checked.${index}`] = patch.checked!;
  }
  if (patch.status !== undefined) values.status = patch.status;
  if (patch.actualMinutes !== undefined) values.actualMinutes = patch.actualMinutes;
  if (patch.evidence !== undefined) values.evidence = patch.evidence;
  await collection.updateOne(
    { noteId: note.id },
    { $set: values },
    { upsert: true },
  );
  const saved = await collection.findOne({ noteId: note.id });
  return toView(saved, note.id, true);
}

export class ProgressValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProgressValidationError";
  }
}

/** Look up the canonical note before accepting any client-supplied note ID. */
export async function findCanonicalNote(noteId: string): Promise<Note | undefined> {
  if (!isValidNoteId(noteId)) return undefined;
  const { getNote } = await import("@/lib/content");
  return getNote(noteId);
}
