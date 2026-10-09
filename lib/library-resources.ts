import type {ResourceItem} from './types';
import type {MathSource} from './math-curriculum-types';

/** Keep course sources discoverable on the same shelves as books and videos. */
export function libraryResources(resources:ResourceItem[],sources:MathSource[]):ResourceItem[]{
 const result=[...new Map(resources.map(r=>[r.url,r])).values()];
 for(const source of sources){
  const [title,translated]=source.title.split(' / ');
  if(result.some(r=>r.url===source.url||r.title.toLowerCase()===title.toLowerCase()))continue;
  const paper=/\.pdf(?:$|\?)|arxiv.org|nber.org|projecteuclid.org/.test(source.url)||['o-prox','o-neweywest','o-kunsch','o-scoring','o-hansen-hac'].includes(source.id);
  result.push({id:`math-${source.id}`,title,titleVi:translated??title,url:source.url,kind:paper?'paper':'course'});
 }
 return result;
}
