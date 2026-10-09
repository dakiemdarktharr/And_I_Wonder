'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useLanguage,useSession,Text} from './providers';
import {MathMarkdown} from './math-markdown';
import type {MathWeek,MathSession,MathSource,MathAssessment,MathExercise} from '@/lib/math-curriculum-types';
import {mathLessonToMarkdown} from '@/lib/lesson-export';
import type {ProgressView} from '@/lib/progress';
import './math-curriculum.css';
import './research.css';
import {researchBlock,canonicalSessionIndex,studyDates,shiftWeekdays,validDate} from '@/lib/learning-path';
function MathProblem({exercise,index,language}:{exercise:MathExercise;index:number;language:'vi'|'en'}){
 const [open,setOpen]=useState(false);const vi=language==='vi';const t=(v:{vi:string;en:string})=>v[language];const solutionId='solution-'+exercise.id;
 return <section className="math-exercise" data-exercise-id={exercise.id}><h3>{vi?'Bài':'Problem'} {index+1}. {t(exercise.title)}</h3>
  {exercise.practiceRole==='application'&&exercise.teaching&&<div className="math-application"><strong>{vi?'Ứng dụng':'Application'}</strong><MathMarkdown>{t(exercise.teaching.application)}</MathMarkdown></div>}
  <MathMarkdown>{t(exercise.prompt)}</MathMarkdown>
  <button className="math-answer-toggle" aria-expanded={open} aria-controls={solutionId} onClick={()=>setOpen(!open)}>{open?(vi?'Ẩn lời giải':'Hide solution'):(vi?'Hiện lời giải':'Show solution')}</button>
  {open&&<div id={solutionId} className="math-solution"><ol>{exercise.solution.map((step,i)=><li key={i}><MathMarkdown>{t(step)}</MathMarkdown></li>)}</ol></div>}</section>;
}
export function MathReader({week,session,sources,exerciseKeys,prerequisites,plannedDate}:{week:MathWeek;session:MathSession;sources:MathSource[];exerciseKeys:Record<string,string>;prerequisites:{week:number;date:string;title:{en:string;vi:string}}[];plannedDate?:string;assessments:MathAssessment[]}){
 const {language}=useLanguage();const owner=useSession();const t=(v:{en:string;vi:string})=>v[language];const vi=language==='vi';
 const routeSuffix=session.route==='foundation'?'&route=foundation':'';const noteId=session.id+'@'+session.revision;
 const [progress,setProgress]=useState<ProgressView>();const [saving,setSaving]=useState(false);const [error,setError]=useState('');
 const [evidence,setEvidence]=useState('');const [focus,setFocus]=useState(false);const [form,setForm]=useState<'A'|'B'>('A');
 useEffect(()=>{const controller=new AbortController();setProgress(undefined);setError('');
  fetch('/api/math-progress',{cache:'no-store',signal:controller.signal}).then(async r=>{if(!r.ok)throw Error('load');return r.json();}).then(data=>{const p=data.notes?.[noteId]??{checked:{},status:'planned',actualMinutes:0,updatedAt:''};setProgress(p);setEvidence(p.evidence??'');}).catch(()=>{if(!controller.signal.aborted)setError(vi?'Chưa tải được tiến độ.':'Progress could not be loaded.');});return()=>controller.abort();
 },[noteId,owner.authenticated,vi]);
 async function save(patch:Record<string,unknown>){if(saving||!owner.authenticated)return;setSaving(true);setError('');try{const r=await fetch('/api/math-progress',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:'math-v2.0',noteId,...patch})});if(!r.ok)throw Error('save');setProgress((await r.json()).progress);}catch{setError(vi?'Lưu thất bại. Hãy thử lại.':'Save failed. Please retry.');}finally{setSaving(false);}}
 const ids=form==='B'&&session.alternativeExerciseIds?.length?session.alternativeExerciseIds:session.exerciseIds;const exercises=ids.map(id=>week.exercises.find(e=>e.id===id)!);
 const lesson=session.lesson!;const research=researchBlock(week.week,session.dayIndex);
 const adjacent=(delta:number)=>{const index=canonicalSessionIndex(session.date),target=index+delta;if(index<0||target<0||target>=523)return null;const d=studyDates('2026-10-07',target+1)[target];const plan=plannedDate&&validDate(plannedDate)?'&planned='+shiftWeekdays(plannedDate,delta):'';return '/daily/'+d+'?curriculum=v2'+routeSuffix+plan;};
 function download(){const blob=new Blob([mathLessonToMarkdown(week,session,sources,language,progress?.checked,form)],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=session.date+'-math-v2-'+language+'.md';a.click();URL.revokeObjectURL(url);}
 return <main className={'math-reader '+(focus?'math-focus':'')}>
  <nav className="math-topbar"><Link href={'/daily?curriculum=v2'+routeSuffix}>← <Text vi="Lịch toán v2" en="Math v2 calendar"/></Link><Link href="/mathematics"><Text vi="Đề cương & phạm vi" en="Syllabus & scope"/></Link></nav>
  <header className="math-heading"><p className="math-date">{plannedDate&&validDate(plannedDate)?`${vi?'Lịch học':'Scheduled'} ${plannedDate} · `:''}{session.date} · {vi?'Tuần':'Week'} {session.calendarWeek??week.week}{session.route==='foundation'?' · source W'+week.week:''}</p><h1>{t(session.title)}</h1><div className="math-tools"><button onClick={()=>setFocus(!focus)} aria-pressed={focus}>{focus?(vi?'Hiện đầy đủ':'Full view'):(vi?'Tập trung':'Focus mode')}</button><button onClick={download}><Text vi="Xuất Markdown" en="Export Markdown"/></button></div></header>
  <div className="math-layout"><aside className="math-sidebar"><a href="#math-agenda"><Text vi="Kế hoạch" en="Plan"/></a><a href="#math-theory"><Text vi="Bài giảng" en="Lesson"/></a><a href="#math-practice"><Text vi="Bài tập" en="Problems"/></a><a href="#math-reading"><Text vi="Tài liệu" en="Sources"/></a>{prerequisites.length>0&&<details><summary><Text vi="Kiến thức trước" en="Prerequisites"/></summary>{prerequisites.map(p=><Link key={p.week} href={'/daily/'+p.date+'?curriculum=v2'+routeSuffix}>W{p.week} · {t(p.title)}</Link>)}</details>}</aside>
  <article className="math-article"><section id="math-agenda"><h2><Text vi="Kế hoạch · 4 giờ" en="Plan · 4 hours"/></h2><div className="math-agenda">{session.actions.map((a,i)=><label key={session.taskIds[i]}><input type="checkbox" checked={progress?.checked?.[session.taskIds[i]]??false} disabled={!owner.authenticated||!progress||saving} onChange={e=>save({taskId:session.taskIds[i],checked:e.target.checked})}/><span><strong>{session.minutes?.[i]??[50,90,90,10][i]} min</strong><MathMarkdown>{t(a).replace(/^\s*\d+\s*(?:min(?:utes)?|phút)\s*[:—–.-]?\s*/i,'')}</MathMarkdown></span></label>)}</div>
   {(error||saving)&&<p className="math-status" role="status">{error||(vi?'Đang lưu…':'Saving…')}</p>}{owner.authenticated&&<details><summary><Text vi="Ghi chú riêng" en="Private note"/></summary><textarea aria-label={vi?'Ghi chú riêng':'Private note'} value={evidence} onChange={e=>setEvidence(e.target.value)} maxLength={10000} rows={4}/><button onClick={()=>save({evidence})} disabled={saving||!progress}><Text vi="Lưu ghi chú" en="Save note"/></button></details>}</section>
   {session.alternativeExerciseIds?.length&&<label className="math-form"><Text vi="Đề" en="Form"/><select value={form} onChange={e=>setForm(e.target.value as 'A'|'B')}><option>A</option><option>B</option></select></label>}
   <section id="math-theory" data-concept={lesson.conceptKey}><h2><Text vi="Bài giảng" en="Lesson"/></h2><details open><summary><Text vi="Lý thuyết và cách giải" en="Theory and methods"/></summary>
    <div className="math-lesson-application"><h3><Text vi="Ứng dụng" en="Application"/></h3><MathMarkdown>{t(lesson.application)}</MathMarkdown></div>
    <section className="math-method"><div className="math-general-formula"><h3><Text vi="Công thức tổng quát" en="General formula"/></h3><MathMarkdown>{t(lesson.formula)}</MathMarkdown></div><h3><Text vi="Cách làm từng bước" en="Step-by-step method"/></h3><ol>{lesson.steps.map((s,j)=><li key={j}><MathMarkdown>{t(s)}</MathMarkdown></li>)}</ol></section>
   </details><details className="math-background"><summary><Text vi="Định nghĩa và chứng minh của chương" en="Chapter definitions and proofs"/></summary><MathMarkdown>{t(week.definitions)}</MathMarkdown>
    {week.theorems.filter(th=>session.theoremIds.includes(th.id)).map(th=><section className="math-theorem" key={th.id}><h3>{t(th.title)}</h3><MathMarkdown>{t(th.statement)}</MathMarkdown><details><summary>{th.proofStatus==='proved'?(vi?'Chứng minh':'Proof'):th.proofStatus==='assumed'?(vi?'Định lý dùng làm giả thiết':'Assumed theorem'):(vi?'Phác thảo chứng minh':'Proof sketch')}</summary><MathMarkdown>{t(th.proof)}</MathMarkdown></details></section>)}
   </details></section>
   <section id="math-practice"><h2><Text vi="Luyện bài tập" en="Practice"/></h2>{exercises.map((e,i)=><MathProblem key={form+'-'+exerciseKeys[e.id]} exercise={e} index={i} language={language}/>)}</section>
   <section className="research-block"><h2>90 min · {research.stage.id}</h2><h3>{t(research.topic)}</h3><p>{t(research.phase)}</p><Link href={'/projects/'+research.stage.id}><Text vi="Hướng dẫn và tiêu chí dự án" en="Project instructions and criteria"/> →</Link>{research.stage.id==='P04'&&<p><Link href={'/derivatives#unit-'+(Math.floor((week.week-65)/3)+1)}><Text vi="Mở bài giảng derivatives" en="Open the derivatives lesson"/> →</Link></p>}<p><Link href="/lab"><Text vi="Lab tương tác" en="Interactive lab"/></Link> · <Link href="/path#evidence"><Text vi="Ghi bằng chứng" en="Record evidence"/></Link></p></section><section id="math-reading"><h2><Text vi="Tài liệu" en="Sources"/></h2><ul>{(lesson.reading??week.reading).map((r,i)=>{const s=sources.find(s=>s.id===r.sourceId);return <li key={i}><a href={s?.url} target="_blank" rel="noreferrer">{s?.title.split(' / ')[0]}</a><span className="math-source-section"> · {r.section}</span></li>;})}</ul></section>
   <nav className="math-bottom-nav">{adjacent(-1)&&<Link href={adjacent(-1)!}>← <Text vi="Ngày trước" en="Previous day"/></Link>}{adjacent(1)&&<Link href={adjacent(1)!}><Text vi="Ngày tiếp" en="Next day"/> →</Link>}</nav><p className="math-legacy-link"><Link href={'/daily/'+session.date+'?curriculum=v1'}><Text vi="Bài cũ (v1)" en="Legacy lesson (v1)"/></Link></p>
  </article></div></main>;
}

