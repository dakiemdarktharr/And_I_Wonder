import fs from 'node:fs';
import crypto from 'node:crypto';
import foundations from '../content/math-v2/foundations';
import probability from '../content/math-v2/probability-inference';
import optimization from '../content/math-v2/optimization-learning';
import assessment from '../content/math-v2/assessment';
import type { MathCurriculum, MathSession } from '../lib/math-curriculum-types';
import { makeFoundationSessions } from '../lib/math-foundation-route';
import {prepareMathPractice} from '../lib/math-practice-plan';
import foundationTeaching from '../content/math-v2/foundations-teaching';
import probabilityTeaching from '../content/math-v2/probability-teaching';
import optimizationTeaching from '../content/math-v2/optimization-teaching';
import assessmentTeaching from '../content/math-v2/assessment-teaching';

const authors = [foundations, probability, optimization, assessment];
const teaching={...foundationTeaching,...probabilityTeaching,...optimizationTeaching,...assessmentTeaching};
const weeks = prepareMathPractice(authors.flatMap(a => a.weeks).sort((a, b) => a.week - b.week),teaching);
const sources = authors.flatMap(a => a.sources);
const assessments = authors.flatMap(a => a.assessments ?? []);
const hash = (value: unknown) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const unique = (ids: string[], label: string) => { if (new Set(ids).size !== ids.length) throw new Error(`Duplicate ${label}`); };
if (weeks.length !== 105 || weeks.some((w, i) => w.week !== i + 1)) throw new Error('Expected weeks 1–105.');
unique(sources.map(s => s.id), 'source');
unique(weeks.flatMap(w => w.theorems.map(t => t.id)), 'theorem');
unique(weeks.flatMap(w => w.exercises.map(e => e.id)), 'exercise');
const sourceIds = new Set(sources.map(s => s.id));
const exerciseIds=new Set(weeks.flatMap(w=>w.exercises.map(e=>e.id)));
for(const assessment of assessments){
 if(assessment.forms.length!==2||new Set(assessment.forms.map(f=>f.name)).size!==2)throw new Error(`A/B forms missing: ${assessment.id}`);
 if(assessment.forms.some(f=>!f.exerciseIds.length||f.exerciseIds.some(id=>!exerciseIds.has(id))))throw new Error(`Unknown assessment exercise: ${assessment.id}`);
}
const sessions: MathSession[] = [];
for (const week of weeks) {
  if (week.sessions.length !== (week.week === 105 ? 3 : 5)) throw new Error(`Invalid session count W${week.week}`);
  if (week.prerequisites.some(p => p < 1 || p >= week.week)) throw new Error(`Prerequisite cycle or unknown W${week.week}`);
  for (const ref of week.reading) if (!sourceIds.has(ref.sourceId)) throw new Error(`Unknown source ${ref.sourceId}`);
  for (const theorem of week.theorems) if (!sourceIds.has(theorem.sourceId)) throw new Error(`Unknown theorem source ${theorem.id}`);
  const scheduled=new Set(week.sessions.flatMap(s=>[...s.exerciseIds,...s.alternativeExerciseIds??[]]));
  for(const exercise of week.exercises){
    if(!scheduled.has(exercise.id))throw new Error(`Unscheduled/orphan exercise ${exercise.id}`);
    if(exercise.practiceOrigin&&!exerciseIds.has(exercise.practiceOrigin))throw new Error(`Unknown reconstruction origin ${exercise.id}`);
    if(exercise.numeric?.some(n=>!Number.isFinite(n.expected)||!Number.isFinite(n.tolerance)||n.tolerance<0))throw new Error(`Invalid numeric checkpoint ${exercise.id}`);
  }
  for (const [dayIndex, plan] of week.sessions.entries()) {
    const minutes = plan.minutes ?? [60, 100, 50, 30];
    if (minutes.reduce((a, b) => a + b, 0) !== 240 || minutes.some(m => m < 0)) throw new Error(`Time budget W${week.week}`);
    const selected = [...plan.exerciseIds, ...(plan.alternativeExerciseIds ?? [])];
    if (plan.exerciseIds.length<3 || (plan.alternativeExerciseIds&&plan.alternativeExerciseIds.length<3) || selected.some(id => !week.exercises.some(e => e.id === id))) throw new Error(`Unresolved/minimum practice W${week.week}`);
    if (!plan.theoremIds.length || plan.theoremIds.some(id => !week.theorems.some(t => t.id === id))) throw new Error(`Unresolved theorem W${week.week}`);
    const offset = (week.week - 1) * 7 + [0, 1, 2, 5, 6][dayIndex];
    const date = new Date(Date.UTC(2026, 9, 7 + offset)).toISOString().slice(0, 10);
    const id = `m2-w${String(week.week).padStart(3, '0')}-d${dayIndex + 1}`;
    // Hash the complete week: changed definitions/solutions invalidate completion as well as changed prompts.
    const revision = hash({ week, plan }).slice(0, 16);
    sessions.push({ ...plan, minutes, id, date, week: week.week, dayIndex, revision,
      taskIds: [0, 1, 2, 3].map(i => `${id}@${revision}::block${i}`) });
  }
}
if (sessions.length !== 523 || sessions.at(-1)?.date !== '2028-10-06') throw new Error('Calendar invariant failed');
const version = 'math-v2.0';
const foundationSessions=makeFoundationSessions(weeks,sessions,hash);
const curriculum: MathCurriculum = { version, sourceHash: hash({authors,teaching,weeks}), sources, weeks, sessions, assessments,foundationSessions };
const exercises = weeks.flatMap(w => w.exercises.map(e => ({ id: e.id, week: w.week, revision: e.revision, hash: hash({exercise:e,definitions:w.definitions,theorems:w.theorems}).slice(0, 16), skills: e.skills, practiceOrigin:e.practiceOrigin })));
const scheduledIds=new Set(sessions.flatMap(s=>s.exerciseIds));
const skillCounts=(selected:typeof exercises)=>Object.fromEntries(['computation','derivation','proof','counterexample','application','numerical analysis','transfer'].map(skill=>[skill,selected.filter(e=>e.skills.some(s=>s===skill)).length]));
const manifest = {
  version, sourceHash: curriculum.sourceHash, dates: 731, restDays: 208, sessionCount: sessions.length,
  minutes: sessions.reduce((sum, s) => sum + s.minutes!.reduce((a, b) => a + b, 0), 0),
  calendarYears: Object.fromEntries(['2026', '2027', '2028'].map(y => [y, sessions.filter(s => s.date.startsWith(y)).length * 240])),
  studyYears: [sessions.filter(s => s.date < '2027-10-07').length * 240, sessions.filter(s => s.date >= '2027-10-07').length * 240],
  counts:{spacedReviewRecords:weeks.flatMap(w=>w.exercises).filter(e=>e.reviewKind).length,defaultProblemAssignments:sessions.reduce((n,s)=>n+s.exerciseIds.length,0),minimumDailyProblems:Math.min(...sessions.map(s=>s.exerciseIds.length)),originalAuthoredRecords:authors.flatMap(a=>a.weeks.flatMap(w=>w.exercises)).length,exerciseRecords:exercises.length,defaultScheduledDistinct:scheduledIds.size,reconstructionRecords:exercises.filter(e=>e.practiceOrigin).length,allSkills:skillCounts(exercises),defaultScheduledSkills:skillCounts(exercises.filter(e=>scheduledIds.has(e.id))),numericChecks:weeks.flatMap(w=>w.exercises).reduce((n,e)=>n+(e.numeric?.length??0),0)},
  sources, exercises, theorems: weeks.flatMap(w => w.theorems.map(t => ({ id: t.id, week: w.week, status: t.proofStatus, sourceId: t.sourceId, section: t.sourceSection }))),
  schedule: sessions.map(s => ({ id: s.id, date: s.date, week: s.week, revision: s.revision, minutes: s.minutes, exerciseIds: s.exerciseIds, alternativeExerciseIds: s.alternativeExerciseIds ?? [] })),
  foundationSchedule:foundationSessions.map(s=>({id:s.id,date:s.date,calendarWeek:s.calendarWeek,sourceWeek:s.week,revision:s.revision,minutes:s.minutes,exerciseIds:s.exerciseIds})),
  coverage: weeks.flatMap(w => w.coverage.map(c => ({ week: w.week, ...c }))),
  ownership: { canonical: ['content/math-v2/foundations.ts', 'content/math-v2/probability-inference.ts', 'content/math-v2/optimization-learning.ts', 'content/math-v2/assessment.ts', 'content/math-v2/foundations-teaching.ts', 'content/math-v2/probability-teaching.ts', 'content/math-v2/optimization-teaching.ts', 'content/math-v2/assessment-teaching.ts'], supportingCanonical: ['lib/math-curriculum-types.ts', 'lib/math-foundation-route.ts', 'lib/math-project-guides.ts', 'lib/math-practice-plan.ts'], derived: ['data/math-v2/curriculum.json', 'data/math-v2/manifest.json', 'docs/math-curriculum-schedule.md', 'docs/math-curriculum-audit.md', 'docs/math-audit-parts/late-assessment.md', 'docs/math-audit-parts/baseline-session-evidence.json'], legacy: 'data/archive/curriculum-v1/manifest.json' },
};
fs.mkdirSync('data/math-v2', { recursive: true });
for (const [name, value] of Object.entries({ curriculum, manifest })) fs.writeFileSync(`data/math-v2/${name}.json`, JSON.stringify(value, null, 2) + '\n');
console.log(JSON.stringify({ version, sourceHash: curriculum.sourceHash, weeks: weeks.length, sessions: sessions.length, exercises: exercises.length, minutes: manifest.minutes }));
