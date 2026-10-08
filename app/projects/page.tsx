import {getAllNotes} from '@/lib/content';
import {ProjectQuests} from '@/components/project-quests';
export const metadata={title:'Projects'};
export default function Page(){return <ProjectQuests projects={getAllNotes().filter(n=>n.kind==='project')}/>}
