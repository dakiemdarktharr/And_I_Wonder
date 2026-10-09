import {getNote} from '@/lib/content';
import {notFound} from 'next/navigation';
import {NoteReader} from '@/components/note-reader';
import {getDailyLesson} from '@/lib/lessons';
import Link from 'next/link';
import {MathReader} from '@/components/math-reader';
import {Text} from '@/components/providers';
import {mathSessionForDate,mathWeek,mathCurriculum,mathExerciseKey} from '@/lib/math-curriculum';
import '@/components/math-curriculum.css';
export default async function Page({params,searchParams}:{params:Promise<{date:string}>;searchParams:Promise<{curriculum?:string;route?:string;planned?:string}>}){
 const {date}=await params;if(!/^\d{4}-\d{2}-\d{2}$/.test(date))notFound();
 const note=getNote(`Daily/${date.slice(0,7)}/${date}`);if(!note)notFound();
 const {curriculum,route,planned}=await searchParams;
 if(curriculum!=='v1'){
  const session=mathSessionForDate(date,route);
  if(!session)return <main className="math-reader"><h1>{date} · <Text vi="Nghỉ cuối tuần" en="Weekend rest"/></h1><p><Text vi="Không có bài học bắt buộc hôm nay. Giữ nguyên ngân sách 4 giờ, 5 ngày trong tuần." en="No required study today. Keep the four-hour, five-day weekly budget."/></p><Link href={route==='foundation'?'/daily?curriculum=v2&route=foundation':'/daily?curriculum=v2'}><Text vi="Trở về lịch toán v2" en="Back to math v2 calendar"/></Link><p><Link href={`/daily/${date}?curriculum=v1`}>Legacy v1</Link></p></main>;
  const week=mathWeek(session.week)!;
  const gates=mathCurriculum.assessments.filter(a=>(a.week===week.week||a.forms.some(form=>form.exerciseIds.some(id=>session.exerciseIds.includes(id))))&&(route!=='foundation'||a.id!=='m2-final'));
  return <MathReader key={session.id+'@'+session.revision} week={week} session={session} sources={mathCurriculum.sources.filter(s=>(session.lesson?.reading??week.reading).some(r=>r.sourceId===s.id)||week.theorems.some(t=>t.sourceId===s.id))} exerciseKeys={Object.fromEntries(week.exercises.map(e=>[e.id,mathExerciseKey(e)]))} plannedDate={planned&&/^\d{4}-\d{2}-\d{2}$/.test(planned)?planned:undefined} prerequisites={week.prerequisites.map(w=>({week:w,date:(route==='foundation'?mathCurriculum.foundationSessions:mathCurriculum.sessions).find(s=>s.week===w)?.date??mathCurriculum.sessions.find(s=>s.week===w)!.date,title:mathWeek(w)!.title}))} assessments={gates}/>;
 }
 const adjacent=(offset:number)=>{const next=new Date(new Date(date+'T12:00:00Z').getTime()+offset*86400000).toISOString().slice(0,10);return getNote(`Daily/${next.slice(0,7)}/${next}`)?{date:next,href:'/daily/'+next+'?curriculum=v1'}:undefined;};
 return <><nav className="math-version-bar"><strong>Legacy v1</strong><Text vi="Bài học và tiến độ của chương trình cũ." en="Original curriculum content and progress."/><Link href={`/daily/${date}?curriculum=v2`}><Text vi="Mở toán v2" en="Open math v2"/></Link></nav><NoteReader key={note.id} note={note} {...getDailyLesson(note)} dailyNavigation={{previous:adjacent(-1),next:adjacent(1)}}/></>;
}
