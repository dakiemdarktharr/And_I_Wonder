export type NumericAnswerStatus = 'match' | 'mismatch' | 'invalid';

export interface NumericAnswerCheck {
  expected: number;
  absoluteTolerance?: number;
  relativeTolerance?: number;
}

export type AnswerWorkbenchText = { en: string; vi: string };

export interface ExerciseCheckpointNumericCheck extends NumericAnswerCheck {
  id: string;
  question: AnswerWorkbenchText;
  target: AnswerWorkbenchText;
}

/** Per-exercise material merged by the server and passed only to its workbench. */
export interface ExerciseCheckpoint {
  exerciseId: string;
  week: number;
  dayIndex: number;
  mode: 'solution-stage-comparison';
  stageSource: string;
  stages: AnswerWorkbenchText[];
  numericChecks?: ExerciseCheckpointNumericCheck[];
}

export interface NumericAnswerEvaluation {
  status: NumericAnswerStatus;
  value?: number;
  allowedError?: number;
}

/**
 * Parse a single decimal/scientific value or a simple fraction. This deliberately
 * does not evaluate expressions, code, units, or arbitrary calculator syntax.
 */
export function parseSimpleNumericAnswer(input: string): number | null {
  const value = input.trim().replace(/[−–]/g, '-').replace(/＋/g, '+');
  if (!value || value.length > 80) return null;
  const decimal = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?';
  const localizedDecimal = '[+-]?(?:\\d+(?:[.,]\\d*)?|[.,]\\d+)(?:[eE][+-]?\\d+)?';
  const directPattern = new RegExp(`^${decimal}$`);
  const fractionPattern = new RegExp(`^(${localizedDecimal})\\s*\\/\\s*(${localizedDecimal})$`);

  const normalizeScalar = (part: string): string | null => {
    const commaCount = (part.match(/,/g) ?? []).length;
    if (commaCount > 1 || (commaCount > 0 && part.includes('.'))) return null;
    return part.replace(',', '.');
  };

  let parsed: number;
  const fraction = value.match(fractionPattern);
  if (fraction) {
    const numeratorText = normalizeScalar(fraction[1]);
    const denominatorText = normalizeScalar(fraction[2]);
    if (!numeratorText || !denominatorText || !directPattern.test(numeratorText) || !directPattern.test(denominatorText)) return null;
    const numerator = Number(numeratorText);
    const denominator = Number(denominatorText);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
    parsed = numerator / denominator;
  } else {
    const normalized = normalizeScalar(value);
    if (!normalized || !directPattern.test(normalized)) return null;
    parsed = Number(normalized);
  }

  return Number.isFinite(parsed) ? parsed : null;
}

export function evaluateNumericAnswer(input: string, check: NumericAnswerCheck): NumericAnswerEvaluation {
  const value = parseSimpleNumericAnswer(input);
  if (value === null || !Number.isFinite(check.expected)) return { status: 'invalid' };

  const absoluteTolerance = Math.max(0, check.absoluteTolerance ?? 1e-8);
  const relativeTolerance = Math.max(0, check.relativeTolerance ?? 1e-6);
  const allowedError = absoluteTolerance + relativeTolerance * Math.abs(check.expected);
  return {
    status: Math.abs(value - check.expected) <= allowedError ? 'match' : 'mismatch',
    value,
    allowedError,
  };
}

/** Stable key format for exercises whose source ids may repeat in later weeks. dayIndex is zero-based. */
export function buildExerciseKey(week: number, dayIndex: number, exerciseId: string): string {
  return `${week}-${dayIndex}-${exerciseId}`;
}
