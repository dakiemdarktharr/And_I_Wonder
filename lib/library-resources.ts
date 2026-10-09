import type {ResourceItem} from './types';
import type {MathSource} from './math-curriculum-types';
import {freeOnlineReader} from './open-resource-links';

/** Keep course sources discoverable on the same shelves as books and videos. */
export function libraryResources(resources:ResourceItem[],sources:MathSource[]):ResourceItem[]{
 const result=[...new Map(resources.flatMap(r=>{const url=freeOnlineReader(r.url);return url?[[url,{...r,url}] as const]:[];})).values()];
 for(const source of sources){
  const url=freeOnlineReader(source.url);if(!url)continue;
  const [title,translated]=source.title.split(' / ');
  if(result.some(r=>r.url===url||r.title.toLowerCase()===title.toLowerCase()))continue;
  const paper=/\.pdf(?:$|\?)|arxiv.org|nber.org|projecteuclid.org/.test(source.url)||['o-prox','o-neweywest','o-scoring','o-hansen-hac'].includes(source.id);
  result.push({id:`math-${source.id}`,title,titleVi:translated??title,url,kind:paper?'paper':'course'});
 }
 return result;
}
