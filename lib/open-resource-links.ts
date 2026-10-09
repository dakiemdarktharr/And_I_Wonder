import checks from '../data/open-resource-access.json';
import type {MathSource} from './math-curriculum-types';

/** Exact reviewed URLs, not a domain allowlist: a publisher's other pages may be paid. */
const readers = new Set(checks.readers.map(r=>r.url));
const replacements:Record<string,string>={
 'https://richardhammack.github.io/BookOfProof/':'https://richardhammack.github.io/BookOfProof/Main.pdf',
 'https://web.stanford.edu/~boyd/cvxbook/':'https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf',
 'https://web.stanford.edu/~boyd/papers/prox_algs.html':'https://web.stanford.edu/~boyd/papers/pdf/prox_algs.pdf',
 'https://www.nber.org/papers/t0055':'https://www.nber.org/system/files/working_papers/t0055/t0055.pdf',
 'https://arxiv.org/abs/1909.05207':'https://arxiv.org/pdf/1909.05207',
 'https://probabilitybook.net/':'https://drive.google.com/file/d/1VmkAAGOYCTORq1wxSQqy255qLJjTNvBI/view',
};
export function freeOnlineReader(url:string):string|undefined{
 const reader=replacements[url]??url;
 return readers.has(reader)?reader:undefined;
}
export function curateMathSource(source:MathSource):MathSource{
 if(source.id==='o-kunsch')return {...source,
  title:'Simulation for Inference I — The Bootstrap / Mô phỏng cho suy luận I — Bootstrap',
  url:'https://stat.cmu.edu/~cshalizi/dst/18/lectures/18/lecture-18.html',
  version:'Cosma Shalizi, CMU 36-467/667, 6 November 2018; free companion lecture citing Künsch (1989)',
  sections:'The Resampling Bootstrap; Block bootstrap for time series. The original Künsch theorem remains cited as assumed; this lecture is not the original paper.',verified:checks.checked};
 const url=freeOnlineReader(source.url);
 if(!url)throw Error('Source lacks verified free full online reader: '+source.id);
 return {...source,url,verified:checks.checked};
}
