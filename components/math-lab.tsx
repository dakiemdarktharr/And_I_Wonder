'use client';
import {useId,useState} from 'react';
import {evaluateLab,fnum,labControls,type LabSpec} from '@/lib/math-labs';
import {useLanguage} from './providers';
import {LessonVisual} from './lesson-visual';
import './learning-lab.css';

function Surface({a,b,c,vi}:{a:number;b:number;c:number;vi:boolean}){
 const id=useId(),f=(x:number,y:number)=>a*x*x+2*b*x*y+c*y*y;
 const magnitude=Math.max(1,...[-2,0,2].flatMap(x=>[-2,0,2].map(y=>Math.abs(f(x,y)))));
 const project=(x:number,y:number):[number,number]=>[260+53*(x-y),180+22*(x+y)-90*f(x,y)/magnitude];
 const lines=Array.from({length:17},(_,i)=>-2+i*.25);
 return <figure className="interactive-surface"><figcaption>{vi?'Mặt f(x,y) trên [−2,2]²':'Surface f(x,y) on [−2,2]²'}</figcaption><svg viewBox="0 0 520 360" role="img" aria-labelledby={`${id}-title`}><title id={`${id}-title`}>{vi?'Mặt bậc hai tính từ a, b, c hiện tại':'Quadratic surface calculated from current a, b, c'}</title>
  {lines.map((v,i)=><g key={i}><polyline points={lines.map(u=>project(u,v).join(',')).join(' ')} stroke="#2455a4" fill="none" strokeWidth={i%4===0?1.3:.65} opacity=".8"/><polyline points={lines.map(u=>project(v,u).join(',')).join(' ')} stroke="#287967" fill="none" strokeWidth={i%4===0?1.3:.65} opacity=".8"/></g>)}
  <path d="M260 180L383 231M260 180L137 231M260 180V50" fill="none" stroke="#172e42" strokeWidth="1.5" strokeDasharray="4 3"/><text x="388" y="239">x</text><text x="119" y="239">y</text><text x="267" y="50">f</text>
 </svg><p>{vi?'Phép chiếu phối cảnh song song. Trục đứng tự đổi tỷ lệ để mặt luôn nằm trong khung; kết luận tính lồi dựa vào Hessian phía dưới.':'Parallel projection. The vertical scale adapts to keep the surface visible; the convexity conclusion uses the Hessian below.'}</p></figure>;
}
export function MathLab({spec}:{spec:LabSpec}){
 const {language}=useLanguage(),vi=language==='vi',id=useId();const [values,setValues]=useState({...spec.defaults});
 const result=evaluateLab(spec,values),changed=Object.keys(values).some(k=>values[k]!==spec.defaults[k]);
 return <section className="interactive-lab" aria-label={spec.title[language]} data-lab-kind={spec.kind}>
  <header><div><span className="interactive-label">{vi?'Thử nghiệm trực tiếp':'Interactive experiment'}</span><h4>{spec.title[language]}</h4></div><button type="button" onClick={()=>setValues({...spec.defaults})}>{vi?'Về dữ kiện gốc':'Reset given values'}</button></header>
  <p>{spec.note?.[language]|| (vi?'Dự đoán kết quả trước khi kéo thanh trượt. Quan sát đại lượng nào đổi và giải thích nguyên nhân.':'Predict before moving a slider. Notice what changes and explain why.')}</p>
  <div className="interactive-lab__formula">{result.formula}</div>
  <div className="interactive-controls">{labControls(spec).map(control=><div key={control.key} className="interactive-control"><label htmlFor={`${id}-${control.key}`}>{control.label[language]}<output>{fnum(values[control.key])}</output></label><input id={`${id}-${control.key}`} type="range" min={control.min} max={control.max} step={control.step} value={values[control.key]} onChange={e=>setValues(v=>({...v,[control.key]:Number(e.target.value)}))}/><input aria-label={`${control.label[language]} (${vi?'nhập giá trị':'type value'})`} type="number" min={control.min} max={control.max} step={control.step} value={Number(values[control.key].toPrecision(8))} onChange={e=>{const n=e.target.valueAsNumber;if(Number.isFinite(n))setValues(v=>({...v,[control.key]:Math.min(control.max,Math.max(control.min,control.step===1?Math.round(n):n))}));}}/></div>)}</div>
  <p className="interactive-variant" role="status">{changed?(vi?'Đang khám phá biến thể. Bấm “Về dữ kiện gốc” để trở lại đề ban đầu.':'Exploring a variant. Reset the given values to return to the original problem.'):(vi?'Đang dùng dữ kiện gốc của thí nghiệm.':'Using the original experiment inputs.')}</p>
  {result.surface&&<Surface {...result.surface} vi={vi}/>}
  <LessonVisual visual={result.visual}/>
  <dl className="interactive-metrics">{result.metrics.map((m,i)=><div key={i}><dt>{m.label[language]}</dt><dd>{typeof m.value==='number'?fnum(m.value):m.value}</dd></div>)}</dl>
  <p className="interactive-explanation">{result.explanation[language]}</p>
 </section>;
}
