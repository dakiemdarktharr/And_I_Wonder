import fs from 'node:fs';
import {mathCurriculum as c} from '../lib/math-curriculum';
import {reviewAmendments} from '../content/math-v2/review-amendments';
import {conceptFigures} from '../content/math-v2/concept-figures';
import {introductoryPractice} from '../content/math-v2/daily-practice';
import {solutionParagraphs} from '../lib/solution-paragraphs';
const issues:string[]=[];
const rows=c.sessions.map(s=>{
 const week=c.weeks.find(w=>w.week===s.week)!;
 const e=week.exercises.find(e=>e.id===s.lesson!.primaryExerciseId)!;
 const exercises=s.exerciseIds.map(id=>week.exercises.find(e=>e.id===id)!);
 for(const exercise of exercises){
  for(const lang of ['en','vi'] as const){
   if(!exercise.prompt[lang].trim()||!exercise.solution.length||exercise.solution.some(s=>!s[lang].trim()))issues.push(exercise.id+': missing '+lang);
   for(const step of exercise.solution){
    const parts=solutionParagraphs(step[lang],lang);
    if(!parts.length)issues.push(exercise.id+': empty solution after layout');
   }
  }
 }
 return{date:s.date,week:s.week,id:e.id,title:e.title.en,
  correction:reviewAmendments[e.id]?.reason??null,
  interactive:conceptFigures[e.id]?.kind??(e.id==='f-w003-e3'?'nullspace':null),
  companionSource:introductoryPractice[e.id]?'individually-authored':'shared-scaffold',
  solutionParagraphs:Object.fromEntries(['en','vi'].map(l=>[l,e.solution.flatMap(v=>solutionParagraphs(v[l as 'en'|'vi'],l as 'en'|'vi')).length])),
  exerciseIds:s.exerciseIds,
  unresolved:!introductoryPractice[e.id]?['Three companion tasks still use a shared question scaffold; not four independently authored problems.']:[],
 };
});
const summary={sourceHash:c.sourceHash,sessions:rows.length,scheduledExercises:rows.reduce((n,r)=>n+r.exerciseIds.length,0),revisedPrimaryLessons:rows.filter(r=>r.correction).length,interactiveLessons:rows.filter(r=>r.interactive).length,sharedScaffoldDays:rows.filter(r=>r.companionSource==='shared-scaffold').length,structuralIssues:issues.length,independentlyReviewed:false};
fs.writeFileSync('docs/lesson-review-ledger.json',JSON.stringify({summary,scope:'Full schedule structural inventory; assistant first-pass reading of primary English prompts/solutions. Explicit corrections and figures only where recorded. No claim of full bilingual theorem verification or expert validation.',issues,lessons:rows},null,2)+'\n');
console.log(summary);if(issues.length)process.exitCode=1;
