import type {MathWeek,MathExercise,MathTeaching} from './math-curriculum-types';
import type {Bilingual} from './lesson-types';
import {dailyExtensions} from '../content/math-v2/daily-extensions';
import {extensionReading,introductoryReading} from '../content/math-v2/daily-sources';
import {researchBlock} from './learning-path';
import {conceptPractice} from '../content/math-v2/daily-practice';
const b=(en:string,vi:string):Bilingual=>({en,vi});
const cleanTitle=(value:Bilingual)=>b(
 value.en.replace(/^(?:Form [AB]:|Final [AB]\d?\s*[—–-]|[A-Z]\d?:|Diagnostic:)\s*/,'').replace(/diagnostic/gi,'').trim(),
 value.vi.replace(/^(?:Đề [AB]:|Cuối kỳ [AB]\d?\s*[—–-]|[A-Z]\d?:)\s*/,'').replace(/Chẩn đoán\s*/g,'').trim(),
);
/** One primary concept per main-route day, four staged tasks; no retrieval padding. */
export function prepareMathPractice(authored:MathWeek[],teaching:Record<string,MathTeaching>):MathWeek[]{
 const weeks=structuredClone(authored);const seen=new Set<string>();
 for(const week of weeks){
  const originals=new Map(week.exercises.map(e=>[e.id,e] as const));
  for(const e of originals.values()){
   e.teaching=teaching[e.id];if(!e.teaching||e.teaching.steps.length<3)throw Error('Missing teaching '+e.id);
   if(e.teaching.solution)e.solution=e.teaching.solution;
  }
  for(const [dayIndex,plan] of week.sessions.entries()){
   let primary:MathExercise=originals.get(plan.exerciseIds[0])!;
   const extension=dailyExtensions[week.week+'-'+dayIndex];
   if(extension){primary=structuredClone(extension);week.exercises.push(primary);}
   if(primary.practiceOrigin||seen.has(primary.id))throw Error('Repeated daily concept '+primary.id);
   seen.add(primary.id);
   primary.title=cleanTitle(primary.title);
   for(const lang of ['en','vi'] as const)primary.title[lang]=primary.title[lang].charAt(0).toUpperCase()+primary.title[lang].slice(1);
   const problems=conceptPractice(primary);
   for(const e of problems)if(e.id!==primary.id)week.exercises.push(e);
   primary.practiceRole='application';
   plan.exerciseIds=problems.map(e=>e.id);
   delete plan.alternativeExerciseIds; // A/B exams remain canonical in the syllabus.
   plan.lesson={id:'lesson-'+week.week+'-'+(dayIndex+1),conceptKey:primary.id,primaryExerciseId:primary.id,
    reading:extension?extensionReading(primary.id):introductoryReading(primary.id)??week.reading,title:primary.title,application:primary.teaching!.application,formula:primary.teaching!.formula,steps:primary.teaching!.steps};
   plan.title=plan.lesson.title;plan.mode='study';plan.minutes=[50,90,90,10];
   plan.actions=[
    b('Learn '+plan.title.en+'.','Học '+plan.title.vi+'.'),
    b('Four problems.','Bốn bài tập.'),
    b(researchBlock(week.week,dayIndex).stage.id+' · '+researchBlock(week.week,dayIndex).topic.en,researchBlock(week.week,dayIndex).stage.id+' · '+researchBlock(week.week,dayIndex).topic.vi),
    b('Compare solutions.','Đối chiếu lời giải.'),
   ];
  }
 }
 return weeks;
}
