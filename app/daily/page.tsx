import {getAllNotes} from '@/lib/content';
import {StudyCalendar} from '@/components/study-calendar';
export const metadata={title:'Daily'};
export default function Page(){const days=getAllNotes().filter(n=>n.kind==='daily').map(n=>({id:n.id,date:String(n.meta.date),focus:String(n.meta.focus||n.title),focusVi:String(n.meta.focusVi||n.titleVi),week:Number(n.meta.week),project:String(n.meta.project||''),minutes:Number(n.meta.planned_minutes||0),total:(n.body.match(/^- \[[ xX]\]/gm)||[]).length,completed:(n.body.match(/^- \[[xX]\]/gm)||[]).length}));return <StudyCalendar days={days}/>}
