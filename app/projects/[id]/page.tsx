import {getNote} from '@/lib/content';
import {notFound} from 'next/navigation';
import {NoteReader} from '@/components/note-reader';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const note=getNote(`Projects/${id}`);if(!note)notFound();return <NoteReader note={note}/>}
