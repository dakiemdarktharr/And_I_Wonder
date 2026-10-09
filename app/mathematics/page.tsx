import { mathCurriculum } from '@/lib/math-curriculum';
import { MathSyllabus } from '@/components/math-syllabus';
export const metadata={title:'Mathematics v2 — syllabus and assessment'};
export default function Page(){return <MathSyllabus weeks={mathCurriculum.weeks.map(w=>({week:w.week,title:w.title,level:w.level,prerequisites:w.prerequisites,outcomes:w.outcomes,coverage:w.coverage,date:mathCurriculum.sessions.find(s=>s.week===w.week)!.date,sessions:mathCurriculum.sessions.filter(s=>s.week===w.week).map(s=>({date:s.date,title:s.title,mode:s.mode}))}))} assessments={mathCurriculum.assessments}/>;}
