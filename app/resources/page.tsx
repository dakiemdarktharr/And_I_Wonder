import {getResources} from '@/lib/content';
import {ResourceLibrary} from '@/components/resource-library';
export const metadata={title:'Resources'};
export default function Page(){return <ResourceLibrary resources={getResources()}/>}
