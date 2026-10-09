'use client';
import {useId,useState} from 'react';
import {useLanguage} from './providers';
import type {LessonVisual as VisualSpec,Bilingual} from '@/lib/lesson-types';
import {plotDomain,linearScale,plotTicks,equalAspectDomains} from '@/lib/plot';
import './learning-lab.css';

const colors=['#1947e5','#c3351c','#12765e','#7143a5','#805500'];
const box={left:85,right:680,top:32,bottom:275};
function wrapLabel(value:string,max:number){
 const lines:string[]=[];let current='';
 for(const word of value.split(' ')){if(current&&current.length+word.length+1>max){lines.push(current);current=word;}else current+=(current?' ':'')+word;}
 if(current)lines.push(current);return lines;
}

export function LessonVisual({visual}:{visual:VisualSpec}){
 const {language}=useLanguage();const id=useId();const vi=language==='vi';const t=(s:Bilingual)=>s[language];
 const [cursor,setCursor]=useState(0),[seriesIndex,setSeriesIndex]=useState(0),[hidden,setHidden]=useState<number[]>([]),[cell,setCell]=useState<[number,number]>([0,0]);
 const fmt=(n:number)=>new Intl.NumberFormat(vi?'vi-VN':'en-GB',{maximumSignificantDigits:5}).format(Math.abs(n)<1e-12?0:n);
 let drawing:React.ReactNode;let data:React.ReactNode;
 if(visual.kind==='steps'){
  drawing=<><ol className="worked-figure__steps">{visual.steps.map((s,i)=><li key={i} className={i>cursor?'figure-step-muted':undefined}><span>{i+1}</span><p>{t(s)}</p>{i<visual.steps.length-1&&<b aria-hidden="true">↓</b>}</li>)}</ol><div className="figure-explorer"><label htmlFor={`${id}-step`}>{vi?'Theo dõi lập luận':'Trace the reasoning'}<input id={`${id}-step`} type="range" min="0" max={Math.max(0,visual.steps.length-1)} value={Math.min(cursor,visual.steps.length-1)} onChange={e=>setCursor(Number(e.target.value))}/></label><output>{vi?'Bước':'Step'} {Math.min(cursor+1,visual.steps.length)}/{visual.steps.length}</output></div></>;
 }else if(visual.kind==='matrix'){
  drawing=<><div className="worked-figure__matrix"><table><caption>{t(visual.title)}</caption><thead><tr><th aria-label={vi?'Hàng / cột':'Row / column'}/>{visual.columns.map((c,i)=><th key={i} scope="col">{c}</th>)}</tr></thead><tbody>{visual.values.map((row,i)=><tr key={i}><th scope="row">{visual.rows[i]}</th>{row.map((v,j)=><td key={j}><button type="button" aria-label={`${visual.rows[i]}, ${visual.columns[j]}: ${fmt(v)}`} aria-pressed={cell[0]===i&&cell[1]===j} onClick={()=>setCell([i,j])}>{fmt(v)}</button></td>)}</tr>)}</tbody></table></div><div className="figure-explorer"><output>{visual.rows[cell[0]]} / {visual.columns[cell[1]]}: {fmt(visual.values[cell[0]]?.[cell[1]]??0)}</output><span>{vi?'Chọn một ô để đối chiếu hàng và cột.':'Select a cell to inspect its row and column.'}</span></div></>;
 }else{
  const xy=visual.kind==='xy';
  let xDomain:[number,number]=xy?plotDomain(visual.series.flatMap(s=>s.points.map(p=>p[0]))):[0,visual.values.length];
  let yDomain=plotDomain(xy?visual.series.flatMap(s=>s.points.map(p=>p[1])):visual.values.map(v=>v.value),!xy);
  if(xy&&visual.equalAspect){const equal=equalAspectDomains(xDomain,yDomain,box.right-box.left,box.bottom-box.top);xDomain=equal.x;yDomain=equal.y;}
  const x=linearScale(xDomain,[box.left,box.right]),y=linearScale(yDomain,[box.bottom,box.top]);
  const yTicks=plotTicks(yDomain),xTicks=plotTicks(xDomain);
  const selectedSeries=xy?visual.series[Math.min(seriesIndex,visual.series.length-1)]:undefined;
  const selectedPoint=selectedSeries?.points[Math.min(cursor,selectedSeries.points.length-1)];
  drawing=<><div className="worked-figure__scroll"><svg viewBox="0 0 720 355" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
   <title id={`${id}-title`}>{t(visual.title)}</title><desc id={`${id}-desc`}>{t(visual.caption)}</desc>
   {yTicks.map((tick,i)=><g key={i}><line x1={box.left} x2={box.right} y1={y(tick)} y2={y(tick)} stroke="#cccfc9" strokeDasharray="3 4"/><text x={box.left-12} y={y(tick)+4} textAnchor="end" className="plot-tick">{fmt(tick)}</text></g>)}
   <line x1={box.left} x2={box.left} y1={box.top} y2={box.bottom} stroke="#141414" strokeWidth="1.5"/>
   <line x1={box.left} x2={box.right} y1={box.bottom} y2={box.bottom} stroke="#141414" strokeWidth="1.5"/>
   {yDomain[0]<0&&yDomain[1]>0&&<line x1={box.left} x2={box.right} y1={y(0)} y2={y(0)} stroke="#666" strokeWidth="1"/>}
   {xy?<>
    {xTicks.map((tick,i)=><g key={i}><line x1={x(tick)} x2={x(tick)} y1={box.bottom} y2={box.bottom+5} stroke="#141414"/><text x={x(tick)} y={box.bottom+21} textAnchor="middle" className="plot-tick">{fmt(tick)}</text></g>)}
    {visual.series.map((s,i)=><g key={i} opacity={hidden.includes(i)?0:1}>
     {s.mode==='line'&&<polyline points={s.points.map(p=>`${x(p[0])},${y(p[1])}`).join(' ')} fill="none" stroke={colors[i%colors.length]} strokeWidth="2.5"/>}
     {(s.mode==='scatter'||s.points.length<=25)&&s.points.map((p,j)=><circle key={j} cx={x(p[0])} cy={y(p[1])} r={s.mode==='scatter'?4.5:3} fill={colors[i%colors.length]}><title>{`${t(s.name)}: (${fmt(p[0])}, ${fmt(p[1])})`}</title></circle>)}
    </g>)}
    {selectedPoint&&!hidden.includes(Math.min(seriesIndex,visual.series.length-1))&&<circle cx={x(selectedPoint[0])} cy={y(selectedPoint[1])} r="7" fill="white" stroke={colors[seriesIndex%colors.length]} strokeWidth="3"/>}
   </>:visual.values.map((v,i)=>{const step=(box.right-box.left)/visual.values.length;return <g key={i}><rect x={box.left+step*i+step*.18} y={Math.min(y(0),y(v.value))} width={step*.64} height={Math.max(.5,Math.abs(y(v.value)-y(0)))} fill={colors[i%colors.length]}><title>{`${t(v.label)}: ${fmt(v.value)}`}</title></rect><text x={box.left+step*(i+.5)} y={v.value>=0?y(v.value)-7:y(v.value)+14} textAnchor="middle" className="plot-value">{fmt(v.value)}</text><text x={box.left+step*(i+.5)} y={box.bottom+22} textAnchor="middle" className="plot-tick">{t(v.label).length>19?t(v.label).slice(0,18)+'…':t(v.label)}</text></g>})}
   <text textAnchor="middle" className="plot-axis-title">{wrapLabel(t(visual.xLabel),72).map((line,i)=><tspan key={i} x={(box.left+box.right)/2} y={327+i*15}>{line}</tspan>)}</text>
   <text transform={`translate(15 ${(box.top+box.bottom)/2}) rotate(-90)`} textAnchor="middle" className="plot-axis-title" style={{fontSize:11}}>{wrapLabel(t(visual.yLabel),38).map((line,i)=><tspan key={i} x="0" dy={i?13:0}>{line}</tspan>)}</text>
  </svg></div></>;
  data=<><div className="figure-explorer">{xy?<><label>{vi?'Dãy số liệu':'Data series'}<select value={seriesIndex} onChange={e=>{setSeriesIndex(Number(e.target.value));setCursor(0);}}>{visual.series.map((s,i)=><option key={i} value={i}>{t(s.name)}</option>)}</select></label><label htmlFor={`${id}-cursor`}>{vi?'Điểm trên đồ thị':'Point on the graph'}<input id={`${id}-cursor`} type="range" min="0" max={Math.max(0,(selectedSeries?.points.length||1)-1)} value={Math.min(cursor,(selectedSeries?.points.length||1)-1)} onChange={e=>setCursor(Number(e.target.value))}/></label>{selectedPoint&&<output>{t(visual.xLabel)} = {fmt(selectedPoint[0])}; {t(visual.yLabel)} = {fmt(selectedPoint[1])}</output>}<div style={{display:'flex',flexWrap:'wrap',gap:8}}>{visual.series.map((s,i)=><button type="button" className="figure-legend-button" key={i} aria-pressed={!hidden.includes(i)} onClick={()=>setHidden(h=>h.includes(i)?h.filter(n=>n!==i):[...h,i])}><i style={{background:colors[i%colors.length]}}/>{t(s.name)}</button>)}</div></>:<><label htmlFor={`${id}-bar`}>{vi?'So sánh từng cột':'Compare the bars'}<input id={`${id}-bar`} type="range" min="0" max={visual.values.length-1} value={Math.min(cursor,visual.values.length-1)} onChange={e=>setCursor(Number(e.target.value))}/></label><output>{t(visual.values[Math.min(cursor,visual.values.length-1)].label)} = {fmt(visual.values[Math.min(cursor,visual.values.length-1)].value)} ({t(visual.yLabel)})</output></>}</div><details className="worked-figure__data"><summary>{vi?'Xem số liệu dùng để vẽ':'Inspect the plotted data'}</summary><div>{xy?visual.series.map((s,i)=><table key={i}><caption>{t(s.name)}</caption><thead><tr><th>{t(visual.xLabel)}</th><th>{t(visual.yLabel)}</th></tr></thead><tbody>{s.points.map((p,j)=><tr key={j}><td>{fmt(p[0])}</td><td>{fmt(p[1])}</td></tr>)}</tbody></table>):<table><thead><tr><th>{t(visual.xLabel)}</th><th>{t(visual.yLabel)}</th></tr></thead><tbody>{visual.values.map((v,i)=><tr key={i}><td>{t(v.label)}</td><td>{fmt(v.value)}</td></tr>)}</tbody></table>}</div></details></>;
 }
 return <figure className="worked-figure"><figcaption>{t(visual.title)}</figcaption>{drawing}<p className="worked-figure__caption">{t(visual.caption)}</p>{data}</figure>;
}
