import { getOwnerSession, isSameOrigin, jsonError } from "@/lib/auth";
import {
  findCanonicalNote,
  getProgressSnapshot,
  ProgressValidationError,
  validateProgressPatch,
  validateTaskId,
  writeProgress,
} from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreJson(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const owner = await getOwnerSession(request);
    const notes = await getProgressSnapshot(Boolean(owner));
    return noStoreJson({ notes });
  } catch (error) {
    console.error("MongoDB progress read failed", error);
    return noStoreJson({ error: "Progress storage is unavailable." }, 503);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return jsonError("This request must come from the app origin.", 403);
  if (!(await getOwnerSession(request))) return jsonError("Sign in with the owner GitHub account to edit progress.", 401);
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 32_000) return jsonError("The request is too large.", 413);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Expected valid JSON.", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body) || typeof (body as Record<string, unknown>).noteId !== "string") {
    return jsonError("noteId is required.", 400);
  }

  const noteId = (body as { noteId: string }).noteId;
  const note = await findCanonicalNote(noteId);
  if (!note) return jsonError("The requested note does not exist.", 404);
  const validated = validateProgressPatch(noteId, body);
  if (validated.error || !validated.patch) return jsonError(validated.error || "Invalid progress update.", 400);

  try {
    if (validated.patch.taskId !== undefined) {
      // Validate against the ordered Markdown tasks before touching MongoDB.
      if (validateTaskId(note, validated.patch.taskId) === null) {
        return jsonError("taskId is not a checkbox in this note.", 400);
      }
    }
    const progress = await writeProgress(note, validated.patch);
    return noStoreJson({ ok: true, progress });
  } catch (error) {
    if (error instanceof ProgressValidationError) return jsonError(error.message, 400);
    console.error("MongoDB progress write failed", error);
    return noStoreJson({ error: "Progress could not be saved." }, 503);
  }
}
