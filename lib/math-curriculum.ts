import curriculumData from '../data/math-v2/curriculum.json';
import manifestData from '../data/math-v2/manifest.json';
import type { MathCurriculum, MathExercise, MathSession } from './math-curriculum-types';

export const mathCurriculum = curriculumData as MathCurriculum;
export const mathManifest = manifestData;
export const MATH_VERSION = 'math-v2.0';
const byDate = new Map(mathCurriculum.sessions.map(s => [s.date, s]));
const foundationByDate = new Map(mathCurriculum.foundationSessions.map(s => [s.date,s]));
const byKey = new Map([...mathCurriculum.sessions,...mathCurriculum.foundationSessions].map(s => [mathProgressKey(s), s]));
export function mathProgressKey(session: Pick<MathSession, 'id' | 'revision'>) { return `${session.id}@${session.revision}`; }
export function mathSessionForDate(date: string,route?:string) { return (route==='foundation'?foundationByDate:byDate).get(date); }
export function mathSessionForKey(key: string) { return byKey.get(key); }
export function mathWeek(week: number) { return mathCurriculum.weeks.find(w => w.week === week); }
export function mathExerciseKey(exercise: MathExercise) {
  const entry = mathManifest.exercises.find(e => e.id === exercise.id);
  if (!entry) throw new Error('Unregistered math exercise');
  return `${exercise.id}@r${exercise.revision}-${entry.hash}`;
}
export function mathHref(date: string, version: 'v1' | 'v2' = 'v2') { return `/daily/${date}?curriculum=${version}`; }
export function mathCalendarDays(route?:string) {
  return Array.from({ length: 731 }, (_, i) => {
    const date = new Date(Date.UTC(2026, 9, 7 + i)).toISOString().slice(0, 10);
    const session = (route==='foundation'?foundationByDate:byDate).get(date);
    return { id: session ? mathProgressKey(session) : `rest-${date}`, date,
      focus: session?.title.en ?? 'Rest day', focusVi: session?.title.vi ?? 'Nghỉ ngơi',
      week: Math.floor(i / 7) + 1, project: session ? `W${String(session.week).padStart(3, '0')}` : '', minutes: session ? 240 : 0, total: session ? 4 : 0, completed: 0 };
  });
}
