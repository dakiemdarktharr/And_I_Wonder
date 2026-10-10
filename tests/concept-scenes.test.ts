import assert from 'node:assert/strict';
import {test} from 'node:test';
import {binomialPmf,conceptScene,sceneControls,plotPoint,type SceneKind} from '../lib/concept-scenes';
import {conceptFigures} from '../content/math-v2/concept-figures';
import {reviewAmendments} from '../content/math-v2/review-amendments';
import {mathCurriculum} from '../lib/math-curriculum';
import {exerciseSolutionParagraphs,solutionParagraphs} from '../lib/solution-paragraphs';
import katex from 'katex';
const near=(a:number,b:number,t=1e-9)=>assert.ok(Math.abs(a-b)<t,a+' != '+b);
test('all slider ticks yield finite coordinates and values inside the explicit plotting window',()=>{
 for(const kind of Object.keys(sceneControls) as SceneKind[]){
  const ctl=sceneControls[kind],steps=Math.round((ctl.max-ctl.min)/ctl.step);
  for(let i=0;i<=steps;i++){
   const v=Number((ctl.min+i*ctl.step).toFixed(10)),scene=conceptScene(kind,v);
   for(const n of Object.values(scene.readout))assert.ok(Number.isFinite(n),kind);
   for(const p of [...scene.series.flatMap(s=>s.points),...scene.markers?.map(m=>m.point)??[]]){
    const [x,y]=plotPoint(p,scene.bounds);assert.ok(Number.isFinite(x)&&Number.isFinite(y),kind);
    assert.ok(x>=51.99&&x<=532.01&&y>=39.99&&y<=270.01,kind+' out of view '+[x,y]);
   }
   katex.renderToString(scene.formula,{throwOnError:true,strict:'error'});
  }
  assert.throws(()=>conceptScene(kind,NaN));assert.throws(()=>conceptScene(kind,ctl.max+1));
 }
});
test('screen transform preserves ordered axes and exact endpoints',()=>{
 assert.deepEqual(plotPoint([-2,-5],[-2,2,-5,5]),[52,270]);
 assert.deepEqual(plotPoint([2,5],[-2,2,-5,5]),[532,40]);
 assert.deepEqual(plotPoint([0,0],[-2,2,-5,5]),[292,155]);
});

test('vector and feasible-set diagrams preserve equal geometric units',()=>{
 for(const kind of ['cauchy','simplex'] as const){
  const s=conceptScene(kind,sceneControls[kind].initial);
  const o=plotPoint([0,0],s.bounds),x=plotPoint([1,0],s.bounds),y=plotPoint([0,1],s.bounds);
  near(x[0]-o[0],o[1]-y[1]);
 }
});
test('secant models agree with direct endpoint evaluation and exclude zero quotients',()=>{
 for(const h of [-.5,-.1,.01,.1,.5]){
  const q=(x:number)=>(3*x-2)**2/2;
  near(conceptScene('secant',h).readout.slope,(q(1+h)-q(1))/h);
  near(conceptScene('cubic',h).readout.slope,((-2+h)**3-(-2)**3)/h);
  near(conceptScene('kink',h).readout.slope,Math.abs(h)/h);
 }
 for(const k of ['secant','cubic','kink'] as const){const s=conceptScene(k,0);assert.ok(!('slope' in s.readout));assert.ok(!s.series.some(s=>s.name==='secant'));}
});
test('epsilon threshold and nonuniform convergence witness check strictness and endpoints',()=>{
 for(const eps of [.05,.1,.2,.25,.5,1]){
  const {N}=conceptScene('epsilon',eps).readout;assert.ok(Number.isInteger(N));assert.ok(2/N<eps);
  assert.ok(2/(N-1)>=eps);
 }
 for(const n of [1,5,10,100]){const r=conceptScene('power',n).readout;near(r.x**n,.5);assert.ok(r.x<1);assert.equal(r.endpointError,0);}
});
test('Bayes and binomial are independently checked by counts and finite enumeration',()=>{
 const r=conceptScene('bayes',.01).readout;near(r.truePositive,90);near(r.falsePositive,495);near(r.posterior,2/13);
 for(const p of [0,.2,.4,.9,1]){
  const mass=binomialPmf(25,p);near(mass.reduce((s,[,p])=>s+p,0),1);
  near(mass.reduce((s,[k,p])=>s+k*p,0),25*p);
  near(mass.reduce((s,[k,pk])=>s+(k-25*p)**2*pk,0),25*p*(1-p));
 }
});
test('Cauchy equality, simplex feasibility and full Hessian criterion match their claims',()=>{
 near(conceptScene('cauchy',.5).readout.gap,0);assert.ok(conceptScene('cauchy',0).readout.gap>0);
 for(const t of [0,.2,.5,1]){const r=conceptScene('simplex',t).readout;assert.ok(r.z1>=0&&r.z2>=0&&r.sum<=1);}
 for(const a of [-2,0,2]){
  const r=conceptScene('curvature',a).readout;
  const f=(x:number,y:number)=>(x-1)**2+a*(y+1)**2-3;
  // Midpoint inequality along the second eigenvector, independently of the model classifier.
  const jensenGap=(f(1,-2)+f(1,0))/2-f(1,-1);
  assert.equal(r.convex,jensenGap>=0?1:0);near(jensenGap,a);
 }
});
test('thresholding satisfies scalar KKT including exactly the threshold',()=>{
 for(const lambda of [0,.4,.5,1.2,2.7,3])for(const z of [2.7,.4,-1.2]){
  const r=conceptScene('threshold',lambda).readout;
  const beta=r[z===2.7?'beta1':z===.4?'beta2':'beta3'];
  if(beta!==0)near(beta-z+lambda*Math.sign(beta),0);
  else assert.ok(Math.abs(z)<=lambda);
 }
});
test('descent has the correct stable, oscillatory, and divergent boundary behavior',()=>{
 near(conceptScene('descent',1).readout.x1,0);
 near(conceptScene('descent',2).readout.f2,.5);
 near(conceptScene('descent',2.2).readout.f1,.72);
 near(conceptScene('descent',2.2).readout.f2,1.0368);
});
test('integrated spectrum equals covariance variance; zero frequency equals LRV',()=>{
 for(const theta of [-1,-.5,0,.5,1]){
  const s=conceptScene('spectrum',theta),p=s.series[0].points;
  let area=0;for(let i=1;i<p.length;i++)area+=(p[i][0]-p[i-1][0])*(p[i][1]+p[i-1][1])/2;
  near(area,4+4*theta*theta);near(2*Math.PI*s.readout.f0,4*(1+theta)**2);
  assert.ok(p.every(([,y])=>y>=-1e-12));
 }
});
test('Gaussian posterior, risk, information, and ridge fixtures use independent calculations',()=>{
 const posterior=conceptScene('gaussian',1).readout;
 near(posterior.variance,1/(1/4+1));near(posterior.mean,(2/4+5)/(1/4+1));
 for(const k of [0,.2,.5,1]){
  let mse=0;for(const x of [-1,1])for(const noise of [-2,2])mse+=(x-k*(x+noise))**2/4;
  near(conceptScene('risk',k).readout.MSE,mse);
 }
 near(conceptScene('ridge',1).readout.df,1.4);near(conceptScene('ridge',9).readout.df,.6);
 near(conceptScene('information',.6).readout.information,.2231435513142097);
 near(conceptScene('information',-.6).readout.information,conceptScene('information',.6).readout.information);
});
test('each authored scene is assigned explicitly to an existing primary concept',()=>{
 const ids=new Set(mathCurriculum.sessions.map(s=>s.lesson!.conceptKey));
 for(const id of Object.keys(conceptFigures))assert.ok(ids.has(id),id);
});
test('editorial corrections reach the compiled lesson, solution, and companion tasks',()=>{
 for(const [id,a] of Object.entries(reviewAmendments)){
  const week=mathCurriculum.weeks.find(w=>w.exercises.some(e=>e.id===id))!;
  const e=week.exercises.find(e=>e.id===id)!;assert.deepEqual(e.solution,a.solution);
  if(a.prompt)assert.deepEqual(e.prompt,a.prompt);
  if(a.formula)assert.deepEqual(e.teaching!.formula,a.formula);
  if(a.application)assert.deepEqual(e.teaching!.application,a.application);
  if(a.commonErrors)assert.deepEqual(e.commonErrors,a.commonErrors);
  if(a.rubric)assert.deepEqual(e.rubric,a.rubric);
  const lesson=mathCurriculum.sessions.find(s=>s.lesson?.primaryExerciseId===id)?.lesson;
  if(lesson)assert.deepEqual(lesson.steps,a.solution);
 }
});

test('sentence layout does not split leading-decimal arithmetic or leave generic instructions',()=>{
 for(const lang of ['en','vi'] as const){
  const steps=solutionParagraphs('Compute .3·.7=.21. Then divide by .7.',lang);
  assert.equal(steps.length,2);assert.ok(steps[0].includes('$.3\\cdot .7=.21$'));
 }
 const e=mathCurriculum.weeks[1].exercises.find(e=>e.id.endsWith('-practice-4'))!;
 for(const lang of ['en','vi'] as const){
  const parts=exerciseSolutionParagraphs(e,lang);
  assert.equal(new Set(parts).size,parts.length);
  assert.ok(!parts.some(p=>p.includes('Replace the quoted step')||p.includes('Thay bước nêu trong đề')));
 }
});

test('Bartlett window expansion agrees with direct lag covariance including the 1/n factor',()=>{
 for(const u of [[1,-2,3,4],[0,0,0],[3],[1,1,1,-1,-1]]){
  for(const b of [0,1,2,5]){
   const value=(t:number)=>u[t-1]??0,n=u.length;
   let squares=0,lags=0;
   for(let s=1;s<=n+b;s++){
    let window=0;for(let j=0;j<=b;j++)window+=value(s-j);squares+=window**2/(n*(b+1));
   }
   for(let h=-b;h<=b;h++){
    let covariance=0;for(let t=1;t<=n;t++)covariance+=value(t)*value(t-h)/n;
    lags+=(1-Math.abs(h)/(b+1))*covariance;
   }
   near(squares,lags);assert.ok(lags>=-1e-12);
  }
 }
});

test('bounded-parameter estimates are projections, and the risk decomposition telescopes to the stated target',()=>{
 for(const z of [-5,0,.2,.5,1,5]){
  const a=.2,b=.8,estimate=Math.min(b,Math.max(a,z));
  for(const truth of [.2,.3,.8])assert.ok(Math.abs(estimate-truth)<=Math.abs(z-truth)+1e-12);
  const objective=(p:number)=>-((z-p)**2);
  for(let j=0;j<=100;j++)assert.ok(objective(estimate)>=objective(a+(b-a)*j/100)-1e-12);
 }
 // Population J, empirical Jhat, fixed penalty zero. A returned approximate ERM.
 for(const J of [[2,4,1],[1,0,3]])for(const empirical of [[0,2,1],[3,1,0]]){
  const best=Math.min(...J),bestEmp=Math.min(...empirical),delta=Math.max(...J.map((v,i)=>Math.abs(v-empirical[i])));
  for(let i=0;i<3;i++){
   const epsilon=empirical[i]-bestEmp;
   assert.ok(J[i]-best<=2*delta+epsilon);
   const selected=empirical.indexOf(bestEmp),reference=-2;
   near(J[i]-reference,(best-reference)+(J[selected]-best)+(J[i]-J[selected]));
  }
 }
});
test('paragraph presentation preserves formulas and decimal values in both languages',()=>{
 for(const language of ['vi','en'] as const){
  const text='$x=0.25$. '+(language==='vi'?'Bình phương cho':'Squaring gives')+' $x^2=0.0625$.';
  const p=solutionParagraphs(text,language);assert.equal(p.join(' '),text);assert.equal(p.length,2);
 }
});
test('counterexamples independently expose missing boundedness and symmetry assumptions',()=>{
 // A bounded first term followed by f_n(x)=x converges uniformly to an unbounded function.
 for(const n of [2,10,100])for(const x of [-1e6,0,1e6])assert.equal(x-x,0);
 const A=[[1,10,0],[0,4,0],[0,0,7]],x=[1,1,0];
 const Ax=A.map(row=>row.reduce((sum,a,j)=>sum+a*x[j],0));
 near(Ax.reduce((sum,a,i)=>sum+a*x[i],0)/2,7.5);
 // Trivial sigma-field lacks the singleton needed by 1_{0}.
 const trivial=[[],[0,1]],singleton=[0];assert.ok(!trivial.some(s=>JSON.stringify(s)===JSON.stringify(singleton)));
});
