import { mathCurriculum } from './math-curriculum';
import type { Note } from './types';
import {mathProjectGuides} from './math-project-guides';
/** Compact public search entries never include private progress/evidence. */
export function searchMathNotes(query: string): Note[] {
 const q=query.toLocaleLowerCase();
 const projects:Note[]=mathProjectGuides.filter(g=>[g.id,g.en,g.vi,g.enBody,g.viBody].join(' ').toLocaleLowerCase().includes(q)).map(g=>({id:`MathV2/Projects/${g.id}`,title:`[Math v2] ${g.id} · ${g.en}`,titleVi:`[Toán v2] ${g.id} · ${g.vi}`,kind:'project',body:g.enBody.slice(0,400),bodyVi:g.viBody.slice(0,400),meta:{version:'math-v2.0',href:`/projects/${g.id}?curriculum=v2`}}));
 return [...projects,...mathCurriculum.sessions.flatMap(s=>{
  const w=mathCurriculum.weeks.find(w=>w.week===s.week)!;
  const es=w.exercises.filter(e=>s.exerciseIds.includes(e.id));
  const text=[s.title.en,s.title.vi,w.title.en,w.title.vi,w.definitions.en,w.definitions.vi,...w.theorems.flatMap(t=>[t.title.en,t.title.vi]),...es.flatMap(e=>[e.title.en,e.title.vi,e.prompt.en,e.prompt.vi])].join(' ');
  if(!text.toLocaleLowerCase().includes(q))return[];
  return [{id:`MathV2/${s.date}`,title:`[Math v2] ${s.title.en}`,titleVi:`[Toán v2] ${s.title.vi}`,kind:'daily',body:w.definitions.en.slice(0,400),bodyVi:w.definitions.vi.slice(0,400),meta:{date:s.date,version:'math-v2.0',href:`/daily/${s.date}?curriculum=v2`}} as Note];
 })].slice(0,24);
}
