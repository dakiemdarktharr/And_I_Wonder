import {getNote,getAllNotes} from '@/lib/content';
import {notFound} from 'next/navigation';
import {NoteReader} from '@/components/note-reader';
import {getDailyLesson} from '@/lib/lessons';
export default async function Page({params}:{params:Promise<{slug:string[]}>}){
 const {slug}=await params;const note=getNote(slug.join('/'));if(!note)notFound();
 const days=note.kind==='daily'?getAllNotes().filter(n=>n.kind==='daily').sort((a,b)=>String(a.meta.date).localeCompare(String(b.meta.date))):[];
 const index=days.findIndex(n=>n.id===note.id);
 const link=(offset:number)=>{const day=days[index+offset];return day?{href:'/notes/'+day.id.split('/').map(encodeURIComponent).join('/'),date:String(day.meta.date)}:undefined;};
 return <NoteReader key={note.id} note={note} {...getDailyLesson(note)} dailyNavigation={index>=0?{previous:link(-1),next:link(1)}:undefined}/>;
}
