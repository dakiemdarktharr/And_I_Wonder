import {getNote} from '@/lib/content';
import {notFound} from 'next/navigation';
import {NoteReader} from '@/components/note-reader';
import {ProjectGuide} from '@/components/project-guide';
import {MathProjects} from '@/components/math-projects';
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{curriculum?:string}>}){const {id}=await params;const note=getNote(`Projects/${id}`);if(!note)notFound();const {curriculum}=await searchParams;if(curriculum!=='v1')return <MathProjects id={id}/>;return <><div className="math-version-bar">Legacy v1 · <a href={`/projects/${id}`}>Mathematics v2 →</a></div><ProjectGuide project={note}/><NoteReader note={note}/></>}
