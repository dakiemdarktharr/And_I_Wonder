"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {normalizeMathNotation} from "@/lib/math-notation";
import rehypeKatex from "rehype-katex";
import type { Bilingual, LessonModule } from "@/lib/lesson-types";
import { useLanguage } from "@/components/providers";
import "./lesson.css";
import {LessonVisual} from './lesson-visual';
import {useState} from 'react';
import {MathLab} from './math-lab';
import {exerciseLabs,theoryLabs} from '@/lib/lab-catalog';
import {InteractiveAnswer} from './interactive-answer';
import {buildExerciseKey} from '@/lib/answer-workbench';

type DailyLessonProps = {
  lesson: LessonModule;
  dayIndex: number;
  noteId: string;
  checkedTasks: Record<string, boolean>;
  canEdit: boolean;
  onTaskToggle: (noteId: string, index: number | string, checked: boolean) => void;
};

function localized(value: Bilingual, language: "vi" | "en"): string {
  return language === "vi" ? value.vi : value.en;
}

function LessonMarkdown({ children }: { children: string }) {
  return <div className="daily-lesson__markdown"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{normalizeMathNotation(children)}</ReactMarkdown></div>;
}

function Diagram({ lesson, language }: { lesson: LessonModule; language: "vi" | "en" }) {
  const { diagram } = lesson;
  const labels = diagram.labels.map((label) => localized(label, language)).slice(0, 6);
  const title = localized(diagram.title, language);
  const caption = localized(diagram.caption, language);
  const id = `lesson-diagram-${lesson.week}`;
  const text = (value: string, x: number, y: number, className = "diagram-label") => <text key={`${value}-${x}-${y}`} className={className} x={x} y={y}>{value}</text>;

  let illustration: React.ReactNode;
  if (diagram.kind === "flow") {
    const count = Math.max(labels.length, 2);
    const width = Math.min(122, 500 / count - 16);
    illustration = <>
      <defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" /></marker></defs>
      {labels.map((label, index) => {
        const x = 24 + index * (512 / count);
        return <g key={`${index}-${label}`}>
          <rect className={`diagram-box diagram-box--${index % 3}`} x={x} y="75" width={width} height="62" />
          <foreignObject x={x + 5} y="82" width={width - 10} height="48"><div className="diagram-html-label">{label}</div></foreignObject>
          {index < count - 1 && <line className="diagram-arrow" x1={x + width + 5} y1="106" x2={x + 512 / count - 12} y2="106" markerEnd={`url(#${id}-arrow)`} />}
        </g>;
      })}
    </>;
  } else if (diagram.kind === "timeline") {
    const count = Math.max(labels.length, 2);
    illustration = <>
      <defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" /></marker></defs>
      <line className="diagram-axis" x1="35" y1="105" x2="525" y2="105" markerEnd={`url(#${id}-arrow)`} />
      {labels.map((label, index) => {
        const x = 48 + index * (460 / Math.max(1, count - 1));
        const upper = index % 2 === 0;
        return <g key={`${index}-${label}`}><circle className="diagram-point" cx={x} cy="105" r="8" /><foreignObject x={x - 61} y={upper ? 42 : 125} width="122" height="56"><div className="diagram-html-label">{label}</div></foreignObject></g>;
      })}
    </>;
  } else if (diagram.kind === "matrix") {
    const cellLabels = labels.slice(0, 4);
    illustration = <>
      <rect className="diagram-cell diagram-cell--a" x="130" y="33" width="150" height="69" />
      <rect className="diagram-cell diagram-cell--b" x="280" y="33" width="150" height="69" />
      <rect className="diagram-cell diagram-cell--c" x="130" y="102" width="150" height="69" />
      <rect className="diagram-cell diagram-cell--d" x="280" y="102" width="150" height="69" />
      {cellLabels.map((label, index) => text(label, index % 2 === 0 ? 205 : 355, index < 2 ? 74 : 143))}
      {labels[4] && text(labels[4], 280, 196, "diagram-axis-label")}
      {labels[5] && <foreignObject x="20" y="65" width="90" height="55"><div className="diagram-html-label diagram-html-label--vertical">{labels[5]}</div></foreignObject>}
    </>;
  } else if (diagram.kind === "distribution") {
    const count = Math.min(labels.length, 5);
    const width = Math.min(116, 500 / count - 15);
    illustration = <>
      <defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" /></marker></defs>
      {labels.slice(0, count).map((label, index) => {
        const x = 25 + index * (510 / count);
        return <g key={`${index}-${label}`}>
          <rect className={`diagram-box diagram-box--${index % 3}`} x={x} y="73" width={width} height="68" />
          <foreignObject x={x + 5} y="79" width={width - 10} height="56"><div className="diagram-html-label">{label}</div></foreignObject>
          {index < count - 1 && <line className="diagram-arrow" x1={x + width + 4} y1="107" x2={x + 510 / count - 11} y2="107" markerEnd={`url(#${id}-arrow)`} />}
        </g>;
      })}
    </>;
  } else {
    illustration = <>
      <line className="diagram-axis" x1="280" y1="105" x2="124" y2="47" />
      <line className="diagram-axis" x1="280" y1="105" x2="436" y2="47" />
      <line className="diagram-axis" x1="280" y1="105" x2="124" y2="166" />
      <line className="diagram-axis" x1="280" y1="105" x2="436" y2="166" />
      <rect className="diagram-box" x="215" y="78" width="130" height="54" />
      <foreignObject x="220" y="81" width="120" height="48"><div className="diagram-html-label">{labels[0] ?? title}</div></foreignObject>
      {labels.slice(1, 5).map((label, index) => {
        const positions = [{ x: 55, y: 22 }, { x: 390, y: 22 }, { x: 55, y: 142 }, { x: 390, y: 142 }];
        const point = positions[index];
        return <g key={`${index}-${label}`}><rect className={`diagram-box diagram-box--${index % 3}`} x={point.x} y={point.y} width="135" height="52" /><foreignObject x={point.x + 5} y={point.y + 4} width="125" height="44"><div className="diagram-html-label">{label}</div></foreignObject></g>;
      })}
    </>;
  }

  return <figure className={`daily-lesson__figure daily-lesson__figure--${diagram.kind}`}>
    <figcaption>{title}</figcaption>
    <svg viewBox="0 0 560 214" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{caption}</desc>
      <rect className="diagram-paper" x="1" y="1" width="558" height="212" />
      <path className="diagram-grid" d="M20 0V214 M60 0V214 M100 0V214 M140 0V214 M180 0V214 M220 0V214 M260 0V214 M300 0V214 M340 0V214 M380 0V214 M420 0V214 M460 0V214 M500 0V214 M540 0V214 M0 20H560 M0 60H560 M0 100H560 M0 140H560 M0 180H560" />
      {illustration}
    </svg>
    <p>{caption}</p>
  </figure>;
}

export function DailyLesson({ lesson, dayIndex, noteId, checkedTasks, canEdit, onTaskToggle }: DailyLessonProps) {
  const { language } = useLanguage();
  const [focus,setFocus]=useState(false);
  const session = lesson.sessions[dayIndex];
  if (!session || dayIndex < 0 || dayIndex > 4) return null;
  const lang = language;
  const labKey=`${lesson.week}-${dayIndex}`;
  const complete=session.agenda.filter((_,index)=>checkedTasks[`${noteId}::lesson${index}`]).length;

  return <section className={`daily-lesson ${focus?'learning-focus':''}`} aria-labelledby={`daily-lesson-title-${lesson.week}`}>
    <nav className="learning-nav" aria-label={lang==='vi'?'Các phần của bài học':'Lesson sections'}>
      {[["learn",'Lý thuyết','Theory'],["example",'Ví dụ','Example'],["explore",'Khám phá','Explore'],["practice",'Luyện tập','Practice'],["agenda",'Lịch học','Agenda']].map(([id,vi,en])=><a key={id} href={`#lesson-${id}`}>{lang==='vi'?vi:en}</a>)}
      <button type="button" aria-pressed={focus} onClick={()=>setFocus(v=>!v)}>{lang==='vi'?(focus?'Hiện nền tảng':'Tập trung'):(focus?'Show context':'Focus')}</button>
    </nav>
    <div className="learning-progress"><progress value={complete} max={session.agenda.length} aria-label={lang==='vi'?'Khối học đã hoàn thành':'Completed study blocks'}/><span>{complete}/{session.agenda.length} {lang==='vi'?'khối học đã hoàn thành':'study blocks completed'}</span></div>
    {focus&&<p className="learning-focus-note">{lang==='vi'?'Đã thu gọn mục tiêu và nền tảng tuần. Bạn vẫn có thể xem lại bất cứ lúc nào.':'Week context is collapsed. You can bring it back at any time.'}</p>}
    <header className="daily-lesson__header">
      <div><span className="daily-lesson__eyebrow">{lang === "vi" ? `TUẦN ${lesson.week} · BÀI HỌC HẰNG NGÀY` : `WEEK ${lesson.week} · DAILY LESSON`}</span><h2 id={`daily-lesson-title-${lesson.week}`}>{localized(lesson.title, lang)}</h2></div>
      <span className="daily-lesson__day">{lang === "vi" ? `NGÀY ${dayIndex + 1} / ${lesson.sessions.length}` : `DAY ${dayIndex + 1} / ${lesson.sessions.length}`}</span>
    </header>

    <div className="daily-lesson__prerequisites"><strong>{lang === "vi" ? "Kiến thức cần có" : "Prerequisites"}</strong><LessonMarkdown>{localized(lesson.prerequisites, lang)}</LessonMarkdown></div>

    <div className="daily-lesson__objectives"><h3>{lang === "vi" ? "Mục tiêu tuần" : "Week objectives"}</h3><ul>{lesson.objectives.map((objective, index) => <li key={`${lesson.week}-objective-${index}`}>{localized(objective, lang)}</li>)}</ul></div>

    <details className="daily-lesson__chapter-map"><summary>{lang==='vi'?'Sơ đồ chương':'Chapter map'}</summary><Diagram lesson={lesson} language={lang}/></details>

    <details className="daily-lesson__foundations" open={dayIndex===0?true:undefined}><summary>{lang === "vi" ? "Nền tảng lý thuyết của tuần" : "This week's theory foundations"}</summary><LessonMarkdown>{localized(lesson.foundations, lang)}</LessonMarkdown></details>

    <article className="daily-lesson__session" aria-labelledby={`daily-lesson-session-${lesson.week}-${dayIndex}`}>
      <div className="daily-lesson__session-heading"><span>{lang === "vi" ? `BUỔI ${dayIndex + 1}` : `SESSION ${dayIndex + 1}`}</span><h3 id={`daily-lesson-session-${lesson.week}-${dayIndex}`}>{localized(session.title, lang)}</h3></div>
      <section id="lesson-learn" className="daily-lesson__theory learning-section"><h4>{lang === "vi" ? "Học lý thuyết" : "Learn the theory"}</h4><LessonMarkdown>{localized(session.theory, lang)}</LessonMarkdown></section>
      <section id="lesson-example" className="daily-lesson__example learning-section"><h4>{lang === "vi" ? "Ví dụ hướng dẫn" : "Guided example"}</h4><LessonMarkdown>{localized(session.workedExample, lang)}</LessonMarkdown></section>
      <section id="lesson-explore" className="learning-section" aria-label={lang==='vi'?'Khám phá kiến thức':'Explore the concept'}>
       {theoryLabs[labKey]?<><MathLab key={labKey} spec={theoryLabs[labKey]}/>{session.visual&&<details className="daily-lesson__chapter-map"><summary>{lang==='vi'?'Đối chiếu đồ thị và dữ liệu ví dụ gốc':'Compare the original example and data'}</summary><LessonVisual visual={session.visual}/></details>}</>:session.visual&&<LessonVisual key={labKey} visual={session.visual}/>}
      </section>
      <section id="lesson-agenda" className="daily-lesson__agenda learning-section"><h4>{lang === "vi" ? "Lịch học 4 giờ" : "Four-hour study agenda"}</h4><ol>{session.agenda.map((item, index) => {
        const taskId = `${noteId}::lesson${index}`;
        const checked = checkedTasks[taskId] ?? false;
        const taskLabel = localized(item, lang).replace(/^60\s*(min|phút)\s*[—–-]\s*/i, "");
        return <li key={`${lesson.week}-${dayIndex}-agenda-${index}`} className={checked ? "is-complete" : undefined}>
          <label className="daily-lesson__task">
            <input type="checkbox" checked={checked} disabled={!canEdit} aria-label={lang === "vi" ? `Đánh dấu hoàn thành: ${taskLabel}` : `Mark complete: ${taskLabel}`} onChange={(event) => onTaskToggle(noteId, `lesson${index}`, event.target.checked)} />
            <span className="daily-lesson__task-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <LessonMarkdown>{localized(item, lang)}</LessonMarkdown>
          </label>
        </li>;
      })}</ol></section>
      <section id="lesson-practice" className="daily-lesson__exercises learning-section"><h4>{lang === "vi" ? "Bài tập tự luyện" : "Practice exercises"}</h4>
        {session.exercises.map((exercise, index) => <article className="daily-lesson__exercise" key={exercise.id}>
          <h5>{lang === "vi" ? `Bài ${index + 1}` : `Exercise ${index + 1}`}</h5>
          <InteractiveAnswer key={buildExerciseKey(lesson.week,dayIndex,exercise.id)} exercise={exercise} checkpoint={exercise.checkpoint} language={lang} exerciseKey={buildExerciseKey(lesson.week,dayIndex,exercise.id)}>
           {exerciseLabs[labKey]&&<MathLab key={`answer-${labKey}`} spec={exerciseLabs[labKey]}/>}
          </InteractiveAnswer>
        </article>)}
      </section>
      <div className="daily-lesson__deliverable"><strong>{lang === "vi" ? "Sản phẩm hôm nay" : "Today's deliverable"}</strong><LessonMarkdown>{localized(session.deliverable, lang)}</LessonMarkdown></div>
    </article>
    {lesson.references.length>0&&<details className="daily-lesson__chapter-map"><summary>{lang==='vi'?'Tài liệu miễn phí đọc thêm — không bắt buộc':'Free further reading — optional'}</summary><ul>{lesson.references.map(r=><li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title} ↗</a></li>)}</ul></details>}
    <p className="daily-lesson__note">{lang === "vi" ? "Bài học này có đủ lý thuyết, ví dụ và dữ liệu để hoàn thành mà không cần tài liệu trả phí hay đọc ngoài bắt buộc." : "This lesson includes its own theory, worked example, and data; no paid or external reading is required."}</p>
  </section>;
}
