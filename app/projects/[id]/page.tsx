import {getNote} from '@/lib/content';
import {notFound} from 'next/navigation';
import {NoteReader} from '@/components/note-reader';
import {ProjectGuide} from '@/components/project-guide';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const note=getNote(`Projects/${id}`);if(!note)notFound();return <><ProjectGuide project={note}/><NoteReader note={note}/></>}
