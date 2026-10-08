import {getNote} from '@/lib/content';
import {notFound} from 'next/navigation';
import {NoteReader} from '@/components/note-reader';
import {getDailyLesson} from '@/lib/lessons';
export default async function Page({params}:{params:Promise<{date:string}>}){
 const {date}=await params;if(!/^\d{4}-\d{2}-\d{2}$/.test(date))notFound();
 const note=getNote(`Daily/${date.slice(0,7)}/${date}`);if(!note)notFound();
 const adjacent=(offset:number)=>{const next=new Date(new Date(date+'T12:00:00Z').getTime()+offset*86400000).toISOString().slice(0,10);return getNote(`Daily/${next.slice(0,7)}/${next}`)?{date:next,href:'/daily/'+next}:undefined;};
 return <NoteReader key={note.id} note={note} {...getDailyLesson(note)} dailyNavigation={{previous:adjacent(-1),next:adjacent(1)}}/>;
}
