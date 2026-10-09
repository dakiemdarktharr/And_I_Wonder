import { getDb } from './db';
import { MATH_VERSION, mathSessionForKey, mathProgressKey } from './math-curriculum';
import { validateProgressPatch, type ProgressPatch, type ProgressView } from './progress';
import type { MathSession } from './math-curriculum-types';

export type MathProgressDocument = { noteId: string; version: string; checked?: Record<string, boolean>; status?: string; actualMinutes?: number; evidence?: string; updatedAt?: Date };
export function validateMathProgress(body: unknown): { session?: MathSession; patch?: ProgressPatch; error?: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Expected an object.' };
  const { version, ...input } = body as Record<string, unknown>;
  if (version !== MATH_VERSION || typeof input.noteId !== 'string') return { error: 'Unknown curriculum version or session.' };
  const session = mathSessionForKey(input.noteId);
  if (!session) return { error: 'Unknown or outdated session revision.' };
  const validated = validateProgressPatch(input.noteId, input);
  if (validated.error || !validated.patch) return validated;
  if (validated.patch.taskId && !session.taskIds.includes(validated.patch.taskId)) return { error: 'Unknown task for this content revision.' };
  return { session, patch: validated.patch };
}
export function mathProgressView(document: MathProgressDocument, includeEvidence: boolean): ProgressView | null {
  const session = mathSessionForKey(document.noteId);
  if (document.version !== MATH_VERSION || !session) return null;
  const checked = Object.fromEntries(session.taskIds.map((id, i) => [id, document.checked?.[`block${i}`] === true]));
  return { checked, status: ['planned', 'in-progress', 'done', 'blocked'].includes(document.status ?? '') ? document.status! : 'planned',
    actualMinutes: Number.isInteger(document.actualMinutes) ? document.actualMinutes! : 0,
    updatedAt: document.updatedAt instanceof Date ? document.updatedAt.toISOString() : '',
    ...(includeEvidence ? { evidence: document.evidence ?? '' } : {}) };
}
const collection = async () => (await getDb()).collection<MathProgressDocument>('math_progress_v2');
let indexPromise: Promise<unknown> | undefined;
export async function readMathProgress(includeEvidence: boolean) {
  const documents = await (await collection()).find({ version: MATH_VERSION }).toArray();
  return Object.fromEntries(documents.flatMap(d => { const view = mathProgressView(d, includeEvidence); return view ? [[d.noteId, view]] : []; }));
}
export async function writeMathProgress(session: MathSession, patch: ProgressPatch) {
  // Validate before Mongo, including direct internal calls.
  const noteId = mathProgressKey(session);
  const validated = validateMathProgress({ version: MATH_VERSION, noteId, ...patch });
  if (!validated.session || !validated.patch) throw new Error(validated.error);
  const safePatch=validated.patch;
  const db = await collection();
  indexPromise ??= db.createIndex({ noteId: 1, version: 1 }, { unique: true }).catch(error => { indexPromise = undefined; throw error; });
  await indexPromise;
  const values: Record<string, unknown> = { noteId, version: MATH_VERSION, updatedAt: new Date() };
  if (safePatch.taskId) {
    const index = validated.session.taskIds.indexOf(safePatch.taskId);
    values[`checked.block${index}`] = safePatch.checked;
  }
  for (const field of ['status', 'actualMinutes', 'evidence'] as const) if (safePatch[field] !== undefined) values[field] = safePatch[field];
  const saved = await db.findOneAndUpdate({ noteId, version: MATH_VERSION }, { $set: values }, { upsert: true, returnDocument: 'after' });
  if (!saved) throw new Error('Progress save returned no document');
  return mathProgressView(saved, true);
}
