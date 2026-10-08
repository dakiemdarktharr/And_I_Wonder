import { createHash } from "node:crypto";
import type { Collection } from "mongodb";
import { getOwnerSession, isSameOrigin, jsonError } from "@/lib/auth";
import { getNote } from "@/lib/content";
import { getDb } from "@/lib/db";
import { countMarkdownTasks, getProgressForNote, normalizeEvidence, writeProgress } from "@/lib/progress";
import type { Note } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NoteEdit = {
  noteId: string;
  body: string;
  bodyVi: string;
  revision: string;
  updatedAt: Date;
};

type RouteContext = { params: Promise<{ slug: string[] }> };
let noteIndexPromise: Promise<void> | undefined;

function revisionFor(body: string, bodyVi: string): string {
  return createHash("sha256").update(JSON.stringify([body, bodyVi])).digest("hex");
}

async function rawEditCollection(): Promise<Collection<NoteEdit>> {
  const db = await getDb();
  return db.collection<NoteEdit>("noteEdits");
}

async function writableEditCollection(): Promise<Collection<NoteEdit>> {
  const collection = await rawEditCollection();
  if (!noteIndexPromise) {
    noteIndexPromise = collection.createIndex({ noteId: 1 }, { unique: true }).then(() => undefined).catch((error: unknown) => {
      noteIndexPromise = undefined;
      throw error;
    });
  }
  await noteIndexPromise;
  return collection;
}

async function resolveNote(noteId: string): Promise<{ note: Note; revision: string }> {
  const canonical = getNote(noteId);
  if (!canonical) throw new NoteNotFoundError();
  const edit = await (await rawEditCollection()).findOne({ noteId: canonical.id });
  const note: Note = {
    ...canonical,
    body: edit?.body ?? canonical.body,
    bodyVi: edit?.bodyVi ?? canonical.bodyVi,
  };
  return { note, revision: revisionFor(note.body, note.bodyVi) };
}

function validEditableMarkdown(value: unknown): value is string {
  return typeof value === "string"
    && value.length <= 300_000
    && !/<\s*script\b|javascript\s*:|data\s*:\s*text\/html|\bon[a-z]+\s*=/i.test(value);
}

function hasOnlyKeys(record: Record<string, unknown>, allowed: string[]): boolean {
  const keySet = new Set(allowed);
  return Object.keys(record).every((key) => keySet.has(key));
}

function isDuplicateKey(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}

class NoteNotFoundError extends Error {}

async function saveMarkdownEdit(noteId: string, body: { body?: string; bodyVi?: string; expectedRevision: string }, current: { note: Note; revision: string }): Promise<{ revision: string } | { conflict: true; revision: string }> {
  if (body.expectedRevision !== current.revision) return { conflict: true, revision: current.revision };
  const nextBody = body.body ?? current.note.body;
  const nextBodyVi = body.bodyVi ?? current.note.bodyVi;
  if (countMarkdownTasks(nextBody) !== countMarkdownTasks(current.note.body)
    || countMarkdownTasks(nextBodyVi) !== countMarkdownTasks(current.note.bodyVi)) {
    throw new Error("Markdown edits must preserve the checkbox count in each language so saved task IDs remain aligned.");
  }

  const collection = await writableEditCollection();
  let existing = await collection.findOne({ noteId });
  if (!existing) {
    const initial: NoteEdit = {
      noteId,
      body: current.note.body,
      bodyVi: current.note.bodyVi,
      revision: current.revision,
      updatedAt: new Date(),
    };
    try {
      await collection.insertOne(initial);
    } catch (error) {
      if (!isDuplicateKey(error)) throw error;
    }
    existing = await collection.findOne({ noteId });
  }
  if (!existing) throw new Error("Could not initialize the note revision.");
  if (existing.revision !== body.expectedRevision) return { conflict: true, revision: existing.revision };

  const nextRevision = revisionFor(nextBody, nextBodyVi);
  const result = await collection.updateOne(
    { noteId, revision: body.expectedRevision },
    { $set: { body: nextBody, bodyVi: nextBodyVi, revision: nextRevision, updatedAt: new Date() } },
  );
  if (result.matchedCount !== 1) {
    const latest = await collection.findOne({ noteId });
    return { conflict: true, revision: latest?.revision || current.revision };
  }
  return { revision: nextRevision };
}

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  const { slug } = await context.params;
  const noteId = slug.join("/").replace(/\.md$/i, "");
  try {
    const { note, revision } = await resolveNote(noteId);
    const owner = await getOwnerSession(request);
    const progress = await getProgressForNote(note.id, Boolean(owner));
    if (new URL(request.url).searchParams.get("download") === "md") {
      const fileName = `${note.id.split("/").at(-1)?.replace(/[^a-z0-9._-]/gi, "_") || "note"}.md`;
      const markdown = new URL(request.url).searchParams.get("lang") === "vi" ? note.bodyVi : note.body;
      return new Response(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-store",
          ETag: `"${revision}"`,
        },
      });
    }
    const responseProgress = { ...progress };
    if (!owner) delete responseProgress.evidence;
    return Response.json({ note, revision, progress: responseProgress }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof NoteNotFoundError) return jsonError("The requested note does not exist.", 404);
    console.error("MongoDB note read failed", error);
    return jsonError("Note storage is unavailable.", 503);
  }
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  if (!isSameOrigin(request)) return jsonError("This request must come from the app origin.", 403);
  if (!(await getOwnerSession(request))) return jsonError("Sign in with the owner GitHub account to edit notes.", 401);
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 650_000) return jsonError("The request is too large.", 413);

  const { slug } = await context.params;
  const noteId = slug.join("/").replace(/\.md$/i, "");
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return jsonError("Expected valid JSON.", 400);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return jsonError("Expected a JSON object.", 400);
  const body = value as Record<string, unknown>;
  if (!hasOnlyKeys(body, ["body", "bodyVi", "expectedRevision", "evidence"])) return jsonError("The request contains an unsupported field.", 400);

  try {
    const current = await resolveNote(noteId);
    const hasMarkdown = body.body !== undefined || body.bodyVi !== undefined;
    const hasEvidence = body.evidence !== undefined;
    if (hasMarkdown && hasEvidence) return jsonError("Save note text and private evidence in separate requests.", 400);

    if (hasEvidence) {
      const evidence = normalizeEvidence(body.evidence);
      if (evidence === null) return jsonError("evidence must be text of at most 10000 characters.", 400);
      await writeProgress(current.note, { evidence });
      return Response.json({ ok: true, progress: await getProgressForNote(current.note.id, true) }, { headers: { "Cache-Control": "no-store" } });
    }

    if (!hasMarkdown || typeof body.expectedRevision !== "string" || !/^[a-f0-9]{64}$/.test(body.expectedRevision)) {
      return jsonError("Provide body or bodyVi and the current expectedRevision.", 400);
    }
    if (body.body !== undefined && !validEditableMarkdown(body.body)) return jsonError("body must be safe Markdown under 300000 characters.", 400);
    if (body.bodyVi !== undefined && !validEditableMarkdown(body.bodyVi)) return jsonError("bodyVi must be safe Markdown under 300000 characters.", 400);

    const saved = await saveMarkdownEdit(current.note.id, {
      body: body.body as string | undefined,
      bodyVi: body.bodyVi as string | undefined,
      expectedRevision: body.expectedRevision,
    }, current);
    if ("conflict" in saved) return Response.json({ error: "This note changed after you opened it.", currentRevision: saved.revision }, { status: 409, headers: { "Cache-Control": "no-store" } });
    return Response.json({ ok: true, revision: saved.revision }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof NoteNotFoundError) return jsonError("The requested note does not exist.", 404);
    if (error instanceof Error && error.message.startsWith("Markdown edits must preserve")) return jsonError(error.message, 400);
    console.error("MongoDB note write failed", error);
    return jsonError("The note could not be saved.", 503);
  }
}
