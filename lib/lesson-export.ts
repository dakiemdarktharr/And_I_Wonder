import type {LessonModule,LessonVisual} from './lesson-types';

function figureMarkdown(v:LessonVisual,language:'vi'|'en'){
 const t=(x:{en:string;vi:string})=>x[language];
 const cell=(s:string)=>s.replaceAll('|','\\|').replaceAll('\n',' ');
 const table=(headers:string[],rows:(number|string)[][])=>`| ${headers.map(cell).join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n${rows.map(row=>'| '+row.map(x=>cell(String(x))).join(' | ')+' |').join('\n')}`;
 const body=v.kind==='steps'?v.steps.map((x,i)=>`${i+1}. ${t(x)}`).join('\n'):v.kind==='matrix'?table(['',...v.columns],v.values.map((row,i)=>[v.rows[i],...row])):v.kind==='bars'?table([t(v.xLabel),t(v.yLabel)],v.values.map(x=>[t(x.label),x.value])):v.series.map(s=>`### ${t(s.name)}\n\n${table([t(v.xLabel),t(v.yLabel)],s.points)}`).join('\n\n');
 return `## ${t(v.title)}\n\n${t(v.caption)}\n\n${body}`;
}

/** Produce a portable study handout without exposing the owner's private evidence. */
export function lessonToMarkdown(lesson:LessonModule,dayIndex:number,date:string,language:'vi'|'en',checked:Record<string,boolean>={},noteId=''){
 const s=lesson.sessions[dayIndex];const vi=language==='vi';const text=(value:{vi:string;en:string})=>value[language];
 const sections=[`# ${date} — ${text(s.title)}`,`**${vi?'Tuần':'Week'} ${lesson.week}:** ${text(lesson.title)}`,`## ${vi?'Kiến thức cần có':'Prerequisites'}\n\n${text(lesson.prerequisites)}`,`## ${vi?'Mục tiêu':'Objectives'}\n\n${lesson.objectives.map(x=>'- '+text(x)).join('\n')}`,`## ${text(lesson.diagram.title)}\n\n${lesson.diagram.labels.map(text).join(' → ')}\n\n${text(lesson.diagram.caption)}`,`## ${vi?'Nền tảng lý thuyết':'Theory foundations'}\n\n${text(lesson.foundations)}`,`## ${vi?'Bài học hôm nay':'Today’s lesson'}\n\n${text(s.theory)}`,`## ${vi?'Ví dụ hướng dẫn':'Worked example'}\n\n${text(s.workedExample)}`,`## ${vi?'Lịch học bốn giờ':'Four-hour agenda'}\n\n${s.agenda.map((item,index)=>`- [${checked[`${noteId}::lesson${index}`]?'x':' '}] ${text(item)}`).join('\n')}`];
 for(const [index,e] of s.exercises.entries())sections.push(`## ${vi?'Bài tập':'Exercise'} ${index+1}\n\n${text(e.prompt)}\n\n<details>\n<summary>${vi?'Hiện gợi ý':'Show hint'}</summary>\n\n${text(e.hint)}\n\n</details>\n\n<details>\n<summary>${vi?'Hiện đáp án':'Show answer'}</summary>\n\n${text(e.answer)}\n\n</details>`);
 if(s.visual)sections.splice(8,0,figureMarkdown(s.visual,language));
 sections.push(`## ${vi?'Sản phẩm hôm nay':'Today’s deliverable'}\n\n${text(s.deliverable)}`);
 if(lesson.references.length)sections.push(`## ${vi?'Đọc thêm — không bắt buộc':'Further reading — optional'}\n\n${lesson.references.map(r=>`- [${r.title}](${r.url})`).join('\n')}`);
 return sections.join('\n\n')+'\n';
}
