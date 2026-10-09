import {getAllNotes} from '@/lib/content';
import {ProjectQuests} from '@/components/project-quests';
import {MathProjects} from '@/components/math-projects';
export const metadata={title:'Projects'};
export default async function Page({searchParams}:{searchParams:Promise<{curriculum?:string}>}){const {curriculum}=await searchParams;return curriculum==='v1'?<><div className="math-version-bar">Legacy v1 · <a href="/projects">Mathematics v2 →</a></div><ProjectQuests projects={getAllNotes().filter(n=>n.kind==='project')}/></>:<MathProjects/>}
