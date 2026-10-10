'use client';
import {useId,useState} from 'react';
import {useLanguage} from './providers';
import {MathMarkdown} from './math-markdown';
import {conceptFigures} from '@/content/math-v2/concept-figures';
import {conceptScene,sceneControls,sceneNumber,plotPoint,type Point} from '@/lib/concept-scenes';
import './concept-explorer.css';
const colors=['#285f87','#a75030','#47776b'];
const tick=(n:number)=>Number(n.toPrecision(3));
const labels:Record<string,[string,string]>={h:['Increment','Bước tăng'],slope:['Secant slope','Độ dốc dây cung'],derivative:['Derivative','Đạo hàm'],epsilon:['Tolerance','Mức sai số'],N:['First valid index','Chỉ số bắt đầu'],error:['Error','Sai số'],supremum:['Supremum error','Supremum sai số'],endpointError:['Error at 1','Sai số tại 1'],x:['Witness position','Vị trí kiểm tra'],n:['Index','Chỉ số'],prior:['Prevalence','Tỷ lệ nền'],truePositive:['Expected true positives','Dương thật kỳ vọng'],falsePositive:['Expected false positives','Dương giả kỳ vọng'],posterior:['Posterior probability','Xác suất hậu nghiệm'],p:['Success probability','Xác suất thành công'],mean:['Mean','Trung bình'],variance:['Variance','Phương sai'],SE:['Standard error of mean','Sai số chuẩn trung bình'],c:['Parameter','Tham số'],absoluteDot:['Absolute dot product','Tích vô hướng tuyệt đối'],normProduct:['Product of lengths','Tích độ dài'],gap:['Inequality gap','Độ chênh hai vế'],t:['Segment fraction','Tỷ lệ trên đoạn'],z1:['First coordinate','Tọa độ thứ nhất'],z2:['Second coordinate','Tọa độ thứ hai'],sum:['Coordinate sum','Tổng tọa độ'],a:['Curvature parameter','Tham số độ cong'],eigenvalue1:['First eigenvalue','Trị riêng thứ nhất'],eigenvalue2:['Second eigenvalue','Trị riêng thứ hai'],convex:['Convex','Lồi'],lambda:['Penalty','Mức phạt'],beta1:['Coefficient 1','Hệ số 1'],beta2:['Coefficient 2','Hệ số 2'],beta3:['Coefficient 3','Hệ số 3'],eta:['Step size','Độ dài bước'],x1:['First iterate','Bước lặp 1'],x2:['Second iterate','Bước lặp 2'],f1:['First objective','Giá trị hàm bước 1'],f2:['Second objective','Giá trị hàm bước 2'],theta:['Filter weight','Hệ số lọc'],f0:['Density at zero','Mật độ tại 0'],fPi:['Density at π','Mật độ tại π'],LRV:['Long-run variance','Phương sai dài hạn'],R:['Noise variance','Phương sai nhiễu'],K:['Kalman gain','Kalman gain'],k:['Chosen gain','Gain đã chọn'],MSE:['Actual MSE','MSE thực'],excess:['Excess MSE','MSE vượt mức'],df:['Effective degrees of freedom','Bậc tự do hiệu dụng'],rho:['Correlation','Tương quan'],information:['Information (nats)','Thông tin (nat)']};
export function ConceptExplorer({conceptId}:{conceptId:string}){
 const config=conceptFigures[conceptId];return config?<Explorer key={conceptId} config={config}/>:null;
}
function Explorer({config}:{config:(typeof conceptFigures)[string]}){
 const {language}=useLanguage(),vi=language==='vi',t=(b:{en:string;vi:string})=>b[language];
 const ctl=sceneControls[config.kind],id=useId(),[value,setValue]=useState(ctl.initial);
 const scene=conceptScene(config.kind,value),xy=(p:Point)=>plotPoint(p,scene.bounds);
 const line=(points:Point[])=>points.map((p,i)=>(i?'L':'M')+xy(p).join(' ')).join(' ');
 const [xmin,xmax,ymin,ymax]=scene.bounds;
 const zeroX=xy([Math.max(xmin,Math.min(xmax,0)),0])[0],zeroY=xy([0,Math.max(ymin,Math.min(ymax,0))])[1];
 return <figure className="concept-explorer" data-scene={config.kind}>
  <figcaption>{t(config.title)}</figcaption>
  <MathMarkdown>{t(config.caption)}</MathMarkdown>
  <div className="concept-plot"><div className="concept-y-label"><MathMarkdown inline>{'$'+config.axes[1]+'$'}</MathMarkdown></div>
   <svg viewBox="0 0 584 310" role="img" aria-label={t(config.title)} aria-describedby={id+'-values'}>
    <defs><clipPath id={id+'-clip'}><rect x="44" y="32" width="496" height="246"/></clipPath></defs>
    <rect x="52" y="40" width="480" height="230" fill="#fffefa" stroke="#b3c9c0"/>
    {[0,1,2,3,4].map(i=>{const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;const px=xy([x,0])[0],py=xy([0,y])[1];return <g key={i}><path d={'M'+px+' 40V270M52 '+py+'H532'} stroke="#dce6df"/><text x={px} y="291" textAnchor="middle">{tick(x)}</text><text x="44" y={py+4} textAnchor="end">{tick(y)}</text></g>;})}
    <path d={'M52 '+zeroY+'H532M'+zeroX+' 40V270'} stroke="#718e80" strokeWidth="1.5"/>
    <g clipPath={'url(#'+id+'-clip)'}>
     {scene.polygon&&<path d={line(scene.polygon)+'Z'} fill="#c9e4dc" stroke="#47776b" strokeWidth="2"/>}
     {scene.series.map((s,i)=><g key={s.name} stroke={colors[i%3]} fill="none">{s.dots?s.points.map((p,j)=>{const [x,y]=xy(p);return <g key={j}><path d={'M'+x+' '+zeroY+'V'+y} strokeWidth="1.2"/><circle cx={x} cy={y} r="3.2" fill={colors[i%3]} stroke="#fffefa" strokeWidth=".8"/></g>;}):<path d={line(s.points)} strokeWidth="2.7" strokeDasharray={s.dashed?'7 5':undefined}/>}</g>)}
     {scene.markers?.map((m,i)=>{const [x,y]=xy(m.point);return <g key={i}><circle cx={x} cy={y} r="5" fill={m.open?'#fffefa':'#edc86e'} stroke="#203e4b" strokeWidth="2"><title>{m.name+': ('+m.point.map(sceneNumber).join(', ')+')'}</title></circle>{/^[ABNxyzuvI]$/.test(m.name)&&<text x={Math.min(520,x+9)} y={Math.max(52,Math.min(263,y+(m.name==='B'?20:-10)))} fill="#203e4b" paintOrder="stroke" stroke="#fffefa" strokeWidth="3">{m.name}</text>}</g>;})}
    </g>
   </svg><div className="concept-x-label"><MathMarkdown inline>{'$'+config.axes[0]+'$'}</MathMarkdown></div>
  </div>
  <div className="concept-legend">{scene.series.map((s,i)=><span key={s.name}><i style={{borderColor:colors[i%3],borderTopStyle:s.dashed?'dashed':'solid'}}/>{t(config.legend[i])}</span>)}</div>
  <MathMarkdown>{'$$'+scene.formula+'$$'}</MathMarkdown>
  <label className="concept-control"><MathMarkdown inline>{'$'+ctl.symbol+'='+sceneNumber(value)+'$'}</MathMarkdown><input aria-label={config.kind+' parameter'} type="range" min={ctl.min} max={ctl.max} step={ctl.step} value={value} onChange={e=>setValue(Number(e.target.value))}/><button type="button" onClick={()=>setValue(ctl.initial)}>{vi?'Về giá trị trong bài':'Reset to lesson'}</button></label>
  {(config.kind==='secant'||config.kind==='cubic'||config.kind==='kink')&&value===0&&<div className="concept-boundary"><MathMarkdown>{vi?'$h=0$: thương sai phân không xác định ($0/0$).':'$h=0$: the difference quotient is undefined ($0/0$).'}</MathMarkdown></div>}
  <dl id={id+'-values'} className="concept-values">{Object.entries(scene.readout).map(([name,n])=><div key={name}><dt>{labels[name]?.[vi?1:0]??name}</dt><dd data-value={name}>{name==='convex'?(n?(vi?'Có':'Yes'):(vi?'Không':'No')):sceneNumber(n)}</dd></div>)}</dl>
 </figure>;
}
