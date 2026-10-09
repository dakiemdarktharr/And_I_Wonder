import type {MathWeek,MathExercise,MathTeaching} from './math-curriculum-types';
import type {Bilingual} from './lesson-types';
const b=(en:string,vi:string):Bilingual=>({en,vi});

/** Adds retrieval practice, not unseen exam claims or additional study time. */
export function prepareMathPractice(authored:MathWeek[],teaching:Record<string,MathTeaching>):MathWeek[]{
 const weeks=structuredClone(authored);
 const originals=new Map(weeks.flatMap(w=>w.exercises.map(e=>[e.id,e] as const)));
 const sourceWeek=new Map(weeks.flatMap(w=>w.exercises.map(e=>[e.id,w.week] as const)));
 const identity=(exercise:MathExercise):string=>exercise.practiceOrigin&&originals.has(exercise.practiceOrigin)?identity(originals.get(exercise.practiceOrigin)!):exercise.id;
 for(const e of originals.values()){
  const lesson=teaching[e.id];if(!lesson||lesson.steps.length<3)throw Error('Missing teaching '+e.id);
  e.teaching=lesson;if(lesson.solution)e.solution=lesson.solution;
  // Retain the actual mathematics, not repeated instructions about how to use the website.
  if(e.practiceOrigin&&/^(Scheduled remediation|This is a scheduled reconstruction)/.test(e.prompt.en)){
   e.prompt=b(e.prompt.en.split('\n\n').slice(1).join('\n\n'),e.prompt.vi.split('\n\n').slice(1).join('\n\n'));
  }
 }
 const history:MathExercise[][]=[];
 for(const week of weeks)for(const [dayIndex,plan] of week.sessions.entries()){
  const main=plan.exerciseIds.map(id=>originals.get(id)!);
  const extend=(ids:string[],form:'A'|'B')=>{
   const selected=ids.map(id=>originals.get(id)!);const origins=new Set(selected.map(identity));
   // Yesterday and one study week earlier; diagnostic bootstrap uses its existing problems.
   const candidates=[...(history.at(-5)??[]),...(history.at(-1)??[]),...history.slice().reverse().flat(),...week.exercises.filter(e=>!e.reviewKind)];
   for(const original of candidates){
    // The repair route defers learning depth and final B. Its shared late modules must not recall those topics.
    const originWeek=sourceWeek.get(original.id)!;
    if(week.week>=97&&((originWeek>=85&&originWeek<=96)||originWeek===101||originWeek===103))continue;
    if(selected.length>=3)break;if(origins.has(identity(original)))continue;origins.add(identity(original));
    const id='m2-w'+String(week.week).padStart(3,'0')+'-d'+(dayIndex+1)+'-'+form.toLowerCase()+'-review-'+original.id;
    const review:MathExercise={...structuredClone(original),id,practiceOrigin:original.id,reviewKind:'spaced',
     title:b('Review: '+original.title.en,'Ôn tập: '+original.title.vi)};
    week.exercises.push(review);selected.push(review);
   }
   if(selected.length<3)throw Error('Not enough distinct problems W'+week.week);
   return selected.map(e=>e.id);
  };
  plan.exerciseIds=extend(plan.exerciseIds,'A');
  if(plan.alternativeExerciseIds?.length)plan.alternativeExerciseIds=extend(plan.alternativeExerciseIds,'B');
  // Two recalled problems share the existing numerical/reconstruction block.
  const mins=plan.minutes??[60,100,50,30];
  plan.actions=[
   b('Study the definitions, general formulas and methods for today’s problems.','Học định nghĩa, công thức tổng quát và cách giải của các bài hôm nay.'),
   plan.actions[1],
   b('Solve the two review problems, about 25 minutes each. Reconstruct the key argument from memory.','Giải hai bài ôn tập, khoảng 25 phút mỗi bài. Tự dựng lại lập luận chính từ trí nhớ.'),
   b('Compare your work with the solutions and correct the step where your reasoning first diverges.','Đối chiếu với lời giải và sửa bước đầu tiên có lập luận khác.'),
  ];
  if(mins[2]!==50)plan.actions[2]=b('Solve the review problems within this block.','Giải các bài ôn tập trong khoảng thời gian này.');
  history.push(main);
 }
 return weeks;
}
