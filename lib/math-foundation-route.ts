import type {MathSession,MathWeek} from './math-curriculum-types';

/** A replacement schedule, never extra homework. Selected learning depth is deferred. */
export function foundationSourceWeek(calendarWeek:number){
 if(calendarWeek<=16)return calendarWeek;
 if(calendarWeek<=96)return calendarWeek-12;
 return ({97:97,98:98,99:99,100:100,101:102,102:104,103:100,104:98,105:97} as Record<number,number>)[calendarWeek];
}
export function makeFoundationSessions(weeks:MathWeek[],sessions:MathSession[],hash:(value:unknown)=>string):MathSession[]{
 return sessions.map(slot=>{
  const sourceWeek=foundationSourceWeek(slot.week);
  const source=weeks.find(w=>w.week===sourceWeek)!;
  const plan=source.sessions[slot.dayIndex];
  const isRepeat=slot.week>=17&&slot.week<=28||[100,102,103,104,105].includes(slot.week);
  const id=`m2-foundation-w${String(slot.week).padStart(3,'0')}-d${slot.dayIndex+1}`;
  const revision=hash({route:'foundation',calendarWeek:slot.week,source,plan}).slice(0,16);
  return {...plan,id,date:slot.date,week:sourceWeek,calendarWeek:slot.week,route:'foundation',dayIndex:slot.dayIndex,revision,
   minutes:plan.minutes??[60,100,50,30],
   title:isRepeat?{en:`Repair / reconstruction: ${plan.title.en}`,vi:`Sửa lỗi / tái dựng: ${plan.title.vi}`}:plan.title,
   mode:isRepeat?'remediation':plan.mode,
   taskIds:[0,1,2,3].map(i=>`${id}@${revision}::block${i}`)};
 });
}
