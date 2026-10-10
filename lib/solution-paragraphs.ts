import {normalizeMathNotation} from './math-notation';
import type {MathExercise} from './math-curriculum-types';
/** UI cleanup must not invalidate semantic progress hashes across unrelated weeks. */
export function exerciseSolutionParagraphs(exercise:MathExercise,language:'en'|'vi'):string[]{
 const boilerplate=new Set(['Replace the quoted step using the valid relationship below.','Thay bước nêu trong đề bằng quan hệ hợp lệ dưới đây.']);
 const parts=exercise.solution.filter(s=>!boilerplate.has(s[language])&&!(exercise.practiceRole==='concept'&&s[language]===exercise.teaching?.application[language])).flatMap(s=>solutionParagraphs(s[language],language));
 return [...new Set(parts)];
}
/** Presentation only: preserve formulas, decimals and all authored words. */
export function solutionParagraphs(source:string,language:'en'|'vi'):string[]{
 const text=normalizeMathNotation(source);
 const atoms:string[]=[];
 const protectedText=text.replace(/```[\s\S]*?```|`[^`]*`|\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])+\$/g,match=>{
  atoms.push(match);return '\uE000'+(atoms.length-1)+'\uE001';
 });
 const segments=[...new Intl.Segmenter(language,{granularity:'sentence'}).segment(protectedText)].map(s=>s.segment.trim()).filter(Boolean);
 const paragraphs=segments.map(s=>s.replace(/\uE000(\d+)\uE001/g,(_,i)=>atoms[Number(i)]));
 // A yes/no answer belongs with its explanation, not on its own numbered step.
 return paragraphs.reduce<string[]>((out,p,i)=>{
  if(/^(No|Yes|Không|Có)\.$/.test(p)&&i<paragraphs.length-1)paragraphs[i+1]=p+' '+paragraphs[i+1];
  else out.push(p);
  return out;
 },[]);
}
