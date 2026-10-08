import first from '@/data/lessons-01-35.json';
import middle from '@/data/lessons-36-70.json';
import late from '@/data/lessons-71-86.json';
import robustness from '@/data/lessons-87-93.json';
import writing from '@/data/lessons-94-99.json';
import final from '@/data/lessons-100-105.json';
import foundationVisuals from '@/data/lesson-visuals-01-13.json';
import type {LessonModule,LessonVisual} from './lesson-types';
import type {Note} from './types';

const figures=foundationVisuals as unknown as Record<string,LessonVisual>;
const lessons = ([...first,...middle,...late,...robustness,...writing,...final] as unknown as LessonModule[]).map(m=>({...m,sessions:m.sessions.map((s,i)=>({...s,visual:figures[`${m.week}-${i}`]||s.visual}))}));
const byWeek = new Map(lessons.map(lesson=>[lesson.week,lesson]));

export function getDailyLesson(note:Note):{lesson?:LessonModule;dayIndex?:number}{
  if(note.kind!=='daily'||Number(note.meta.planned_minutes)===0)return {};
  const date=String(note.meta.date);
  const day=new Date(`${date}T12:00:00Z`).getUTCDay();
  // The roadmap starts on Wednesday: Wed, Thu, Fri, Mon, Tue.
  const dayIndex=[3,4,5,1,2].indexOf(day);
  if(dayIndex<0)return {};
  return {lesson:byWeek.get(Number(note.meta.week)),dayIndex};
}

export function getAllLessons(){return lessons;}
