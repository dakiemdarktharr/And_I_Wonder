import { test } from 'node:test';
import assert from 'node:assert/strict';
import checkpoints from '../data/exercise-checkpoints.json';
import { getAllLessons } from '../lib/lessons';
import { buildExerciseKey, evaluateNumericAnswer, parseSimpleNumericAnswer } from '../lib/answer-workbench';

const checkpointIndex = checkpoints.exercises as Record<string, {
  exerciseId: string;
  week: number;
  dayIndex: number;
  mode: string;
  stages: { en: string; vi: string }[];
  numericChecks?: {
    id: string;
    expected: number;
    question: { en: string; vi: string };
    target: { en: string; vi: string };
    absoluteTolerance?: number;
    relativeTolerance?: number;
  }[];
}>;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

test('all 523 exercises have a unique week-day-ID checkpoint grounded in their bilingual source answer', () => {
  let count = 0;
  const keys: string[] = [];
  for (const module of getAllLessons()) {
    module.sessions.forEach((session, dayIndex) => session.exercises.forEach(exercise => {
      const key = buildExerciseKey(module.week, dayIndex, exercise.id);
      keys.push(key);
      count += 1;
      const checkpoint = checkpointIndex[key];
      assert.ok(checkpoint, `Missing checkpoint ${key}`);
      assert.equal(checkpoint.exerciseId, exercise.id, key);
      assert.equal(checkpoint.week, module.week, key);
      assert.equal(checkpoint.dayIndex, dayIndex, key);
      assert.equal(checkpoint.mode, 'solution-stage-comparison', key);
      assert.ok(checkpoint.stages.length > 0, key);
      assert.ok(checkpoint.stages.every(stage => stage.en.trim() && stage.vi.trim()), key);
      assert.equal(normalizeWhitespace(checkpoint.stages.map(stage => stage.en).join(' ')), normalizeWhitespace(exercise.answer.en), `${key} English stages must preserve the source answer`);
      assert.equal(normalizeWhitespace(checkpoint.stages.map(stage => stage.vi).join(' ')), normalizeWhitespace(exercise.answer.vi), `${key} Vietnamese stages must preserve the source answer`);
    }));
  }
  assert.equal(count, 523);
  assert.equal(new Set(keys).size, 523);
  assert.equal(Object.keys(checkpointIndex).length, 523);
  assert.equal(new Set(Object.values(checkpointIndex).map(checkpoint => checkpoint.exerciseId)).size, 489);
});

test('numeric checks are limited to manually selected quantitative checkpoints, including KKT, probability, and regression', () => {
  const selected = Object.entries(checkpointIndex).filter(([, checkpoint]) => checkpoint.numericChecks?.length);
  const numericCheckCount = selected.reduce((sum, [, checkpoint]) => sum + (checkpoint.numericChecks?.length ?? 0), 0);
  const numericWeekCount = new Set(selected.map(([, checkpoint]) => checkpoint.week)).size;
  const coverage = checkpoints.coverage as {
    exercises: number;
    compositeKeys: number;
    rawIds: number;
    stageOnlyExercises: number;
    curatedNumericExercises: number;
    curatedNumericChecks: number;
    curatedNumericWeeks: number;
    solutionStages: number;
    oneStageExercises: number;
  };
  assert.ok(selected.length >= 100, `Expected at least 100 individually selected numeric exercises, found ${selected.length}`);
  assert.ok(numericWeekCount >= 90, `Expected broad numeric coverage across weeks, found ${numericWeekCount}`);
  assert.equal(coverage.curatedNumericExercises, selected.length);
  assert.equal(coverage.curatedNumericChecks, numericCheckCount);
  assert.equal(coverage.curatedNumericWeeks, numericWeekCount);
  assert.equal(coverage.stageOnlyExercises, Object.keys(checkpointIndex).length - selected.length);
  assert.equal(coverage.solutionStages, Object.values(checkpointIndex).reduce((total, item) => total + item.stages.length, 0));
  assert.equal(coverage.exercises, Object.keys(checkpointIndex).length);
  assert.equal(coverage.compositeKeys, Object.keys(checkpointIndex).length);
  assert.equal(coverage.rawIds, new Set(Object.values(checkpointIndex).map(item => item.exerciseId)).size);
  for (const [key, checkpoint] of selected) {
    const ids = new Set<string>();
    for (const check of checkpoint.numericChecks ?? []) {
      assert.ok(check.id.length > 0, key);
      assert.ok(!ids.has(check.id), `Duplicate check id ${key}/${check.id}`);
      ids.add(check.id);
      assert.ok(check.question.en.trim() && check.question.vi.trim(), `${key}/${check.id} question`);
      assert.ok(check.target.en.trim() && check.target.vi.trim(), `${key}/${check.id} target`);
      assert.ok(Number.isFinite(check.expected), `${key}/${check.id}`);
      assert.ok((check.absoluteTolerance ?? 1e-8) >= 0, `${key}/${check.id}`);
      assert.ok((check.relativeTolerance ?? 1e-6) >= 0, `${key}/${check.id}`);
    }
  }
  for (const key of ['1-0-w01-d1-gradient', '1-2-w01-d3-bayes', '8-4-w08d5', '12-4-w12d5', '14-1-w14d2', '15-2-w15d3', '16-0-w16d1', '20-1-w20d2', '22-2-w22d3', '23-4-w23d5', '37-0-w37d1', '103-0-w103d1']) {
    assert.ok(checkpointIndex[key]?.numericChecks?.length, `Expected selected numeric checkpoint ${key}`);
  }
  assert.equal(checkpointIndex['16-0-w16d1']?.numericChecks?.find(check => check.id === 'estimator-variance')?.expected, 4.75);
  assert.equal(checkpointIndex['22-2-w22d3']?.numericChecks?.find(check => check.id === 'persistence-mae')?.expected, 1.5);
  assert.equal(checkpointIndex['23-4-w23d5']?.numericChecks?.find(check => check.id === 'signal-rank-spread')?.expected, 0.03);
  assert.ok(Math.abs((checkpointIndex['72-3-w72-d4-smooth']?.numericChecks?.[0]?.expected ?? 0) - 36.48 / 41.61) < 1e-12);
  assert.ok(Math.abs((checkpointIndex['14-1-w14d2']?.numericChecks?.[0]?.expected ?? 0) - (1.04 ** (5 / 252) - 1)) < 1e-15);
  assert.equal(checkpointIndex['12-4-w12d5']?.numericChecks?.[0]?.expected, 0.3316900016029092);

  // These evidence and claim-audit tasks stay in exact-stage self-review mode.
  for (const key of ['26-2-w26d3', '47-4-w47d5', '48-1-w48d2', '49-4-w49d5']) {
    assert.equal(checkpointIndex[key]?.mode, 'solution-stage-comparison', key);
    assert.equal(checkpointIndex[key]?.numericChecks, undefined, key);
    assert.ok(checkpointIndex[key]?.stages.length, key);
  }
});

test('numeric input accepts decimal commas and simple fractions with explicit tolerances', () => {
  assert.equal(parseSimpleNumericAnswer('−0,25'), -0.25);
  assert.equal(parseSimpleNumericAnswer('2/3'), 2 / 3);
  assert.equal(parseSimpleNumericAnswer('1,2 / 0,3'), 4);
  assert.equal(parseSimpleNumericAnswer('−1,25e+2'), -125);
  assert.equal(evaluateNumericAnswer('0,6667', { expected: 2 / 3, absoluteTolerance: 0.0001, relativeTolerance: 0 }).status, 'match');
  assert.equal(evaluateNumericAnswer('2/3', { expected: 2 / 3, absoluteTolerance: 1e-9, relativeTolerance: 0 }).status, 'match');
  assert.equal(evaluateNumericAnswer('0.667', { expected: 2 / 3, absoluteTolerance: 0.0001, relativeTolerance: 0 }).status, 'mismatch');
  assert.equal(evaluateNumericAnswer('2', { expected: 2, absoluteTolerance: 0, relativeTolerance: 0 }).status, 'match');
  assert.equal(evaluateNumericAnswer('0.875', { expected: 1, absoluteTolerance: 0.125, relativeTolerance: 0 }).status, 'match', 'a value exactly on the tolerance boundary passes');
  assert.equal(evaluateNumericAnswer('0.874999', { expected: 1, absoluteTolerance: 0.125, relativeTolerance: 0 }).status, 'mismatch', 'a value just outside the tolerance boundary fails');
  assert.equal(evaluateNumericAnswer('101', { expected: 100, absoluteTolerance: 0, relativeTolerance: 0.01 }).status, 'match', 'relative tolerance scales with the target');
  assert.equal(evaluateNumericAnswer('101.0001', { expected: 100, absoluteTolerance: 0, relativeTolerance: 0.01 }).status, 'mismatch');
});

test('numeric parser rejects code and unsupported calculator expressions instead of evaluating them', () => {
  for (const input of ['', '1 + 1', 'Math.sqrt(4)', 'process.exit(1)', '2/0', '1,000.5', 'Infinity', 'NaN']) {
    assert.equal(parseSimpleNumericAnswer(input), null, input);
  }
  assert.equal(evaluateNumericAnswer('not an answer', { expected: 1 }).status, 'invalid');
});
