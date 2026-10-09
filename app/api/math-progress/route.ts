import { getOwnerSession, isSameOrigin, jsonError } from '@/lib/auth';
import { readMathProgress, validateMathProgress, writeMathProgress } from '@/lib/math-progress';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const response = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET(request: Request) {
  try { return response({ version: 'math-v2.0', notes: await readMathProgress(Boolean(await getOwnerSession(request))) }); }
  catch { return response({ error: 'Math progress is unavailable.' }, 503); }
}
export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return jsonError('This request must come from the app origin.', 403);
  if (!(await getOwnerSession(request))) return jsonError('Only the owner may update progress.', 401);
  let body: unknown;
  try { const raw = await request.text(); if (raw.length > 32_000) return jsonError('Request too large.', 413); body = JSON.parse(raw); }
  catch { return jsonError('Expected valid JSON.', 400); }
  const { session, patch, error } = validateMathProgress(body);
  if (!session || !patch) return jsonError(error ?? 'Invalid update.', 400);
  try { return response({ ok: true, progress: await writeMathProgress(session, patch) }); }
  catch { return response({ error: 'Progress could not be saved.' }, 503); }
}
