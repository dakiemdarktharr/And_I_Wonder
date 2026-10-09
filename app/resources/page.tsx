import {getResources} from '@/lib/content';
import {ResourceLibrary} from '@/components/resource-library';
import {mathCurriculum} from '@/lib/math-curriculum';
import {libraryResources} from '@/lib/library-resources';
export const metadata={title:'Resources'};
export default function Page(){return <ResourceLibrary resources={libraryResources(getResources(),mathCurriculum.sources)}/>}
