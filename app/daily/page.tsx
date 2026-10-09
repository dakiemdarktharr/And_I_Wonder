import {getAllNotes} from '@/lib/content';
import {StudyCalendar} from '@/components/study-calendar';
import {mathCalendarDays} from '@/lib/math-curriculum';
export const metadata={title:'Daily'};
export default async function Page({searchParams}:{searchParams:Promise<{curriculum?:string;route?:string}>}){const {curriculum,route}=await searchParams;if(curriculum!=='v1')return <StudyCalendar key={route??"v2"} days={mathCalendarDays(route)} version="v2" foundation={route==="foundation"}/>;const days=getAllNotes().filter(n=>n.kind==='daily').map(n=>({id:n.id,date:String(n.meta.date),focus:String(n.meta.focus||n.title),focusVi:String(n.meta.focusVi||n.titleVi),week:Number(n.meta.week),project:String(n.meta.project||''),minutes:Number(n.meta.planned_minutes||0),total:(n.body.match(/^- \[[ xX]\]/gm)||[]).length,completed:(n.body.match(/^- \[[xX]\]/gm)||[]).length}));return <StudyCalendar key="v1" days={days} version="v1"/>}
