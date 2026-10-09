import test from 'node:test';
import assert from 'node:assert/strict';
import {binomialPMF,eigenvalues,evaluateLab,labControls,normalCDF,softThreshold} from '../lib/math-labs';
import {exerciseLabs,theoryLabs} from '../lib/lab-catalog';
import {getAllLessons} from '../lib/lessons';

const close=(a:number,b:number,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const value=(key:string,label:string)=>{const s=exerciseLabs[key];return evaluateLab(s,s.defaults).metrics.find(m=>m.label.en===label)!.value as number;};
test('analytic quadratic derivative and exact finite difference match the assigned first-day exercise',()=>{
 close(value('1-0','f(x)'),4.5);close(value('1-0','Exact derivative'),-9);close(value('1-0','Forward difference'),-8.955);close(value('1-0','Forward absolute error'),.045);
});
test('convexity uses both eigenvalues, including semidefinite, indefinite and negative definite cases',()=>{
 const ev=eigenvalues(4,-2,6);close(ev[0],5-Math.sqrt(5));close(ev[1],5+Math.sqrt(5));
 assert.deepEqual(eigenvalues(2,0,0),[0,2]);assert.deepEqual(eigenvalues(2,0,-2),[-2,2]);assert.deepEqual(eigenvalues(-2,0,-4),[-4,-2]);
 const spec=exerciseLabs['4-2'];const indefinite=evaluateLab(spec,{...spec.defaults,a:1,b:0,c:-1});assert.match(indefinite.explanation.en,/not convex/);
 const psd=evaluateLab(spec,{...spec.defaults,a:1,b:0,c:0});assert.match(psd.explanation.en,/not strictly/);
});
test('Bayes uses the false positive population and assessment-specific inputs',()=>{
 close(value('1-2','P(A|B)'),18/67);close(value('103-0','P(B)'),.24);close(value('103-0','P(A|B)'),2/3);
});
test('binomial probabilities normalize and tail is exact at the assessment fixture',()=>{
 for(const n of [1,8,40,100])for(const p of [.01,.3,.99])close(binomialPMF(n,p).reduce((a,b)=>a+b,0),1,1e-12);
 close(value('5-2','P(X = k)'),.29647548);close(value('103-1','P(X ≥ k)'),56/1024);close(normalCDF(0),.5,1e-7);close(normalCDF(-1),.158655,1e-6);
});
test('OLS, KKT and gradient iterations calculate the stated problem rather than its guided example',()=>{
 close(value('1-1','OLS slope'),1);close(value('1-1','OLS intercept'),1);
 close(value('5-1','OLS intercept'),7/6);close(value('5-1','OLS slope'),.5);
 close(value('36-2','Optimal value'),-8);close(value('37-0','λ* for g=x−u'),4);close(value('103-2','Optimal value'),9);
 close(value('38-2','Final x'),.04);close(value('38-2','Final objective'),.0032);
});
test('filtering, proximal and posterior examples match independent hand calculations',()=>{
 close(value('34-0','Gain K'),.75);close(value('34-0','Posterior mean'),6);close(value('34-0','Posterior variance'),2.25);
 close(value('64-0','Posterior mean'),9/14);close(value('64-1','Two future successes'),3/7);
 close(value('89-2','Final state'),3.75);close(softThreshold(-.4,.1),-.3);close(softThreshold(.05,.1),0);
 close(value('36-3','Portfolio variance'),1.125);
});
test('all explicit model fixtures have finite metrics and data; slider limits remain valid',()=>{
 for(const [key,s] of Object.entries({...Object.fromEntries(Object.entries(theoryLabs).map(([k,v])=>['t'+k,v])),...exerciseLabs})){
  const cases=[s.defaults,...labControls(s).flatMap(c=>[{...s.defaults,[c.key]:c.min},{...s.defaults,[c.key]:c.max}])];
  for(const p of cases){const r=evaluateLab(s,p);for(const m of r.metrics)if(typeof m.value==='number')assert.ok(Number.isFinite(m.value),`${key}: ${m.label.en}`);
   if(r.visual.kind==='xy')for(const series of r.visual.series)for(const point of series.points)assert.ok(point.every(Number.isFinite),key);
  }
 }
});
test('every lab catalog key maps to a scheduled existing session',()=>{
 const lessons=getAllLessons();
 for(const key of [...Object.keys(exerciseLabs),...Object.keys(theoryLabs)]){const [w,d]=key.split('-').map(Number);assert.ok(lessons.find(m=>m.week===w)?.sessions[d],key);}
});
