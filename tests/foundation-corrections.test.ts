import {test} from 'node:test';
import assert from 'node:assert/strict';
import modules from '../data/lessons-01-35.json';
const exercise=(week:number,day:number)=>modules.find(m=>m.week===week)!.sessions[day].exercises[0];

test('corrected fixtures retain exact derivatives, optimizer and estimator variance',()=>{
 const f=(x:number,y:number)=>x*x*y+2*y*y*y;
 assert.ok(Math.abs((f(2.03,-.98)-f(2,-1))-.079134)<1e-12);
 assert.match(exercise(4,0).answer.en,/\.079134/);
 assert.deepEqual([4*.5-2*0,-2*.5+6*0],[2,-1]);
 assert.match(exercise(4,2).answer.en,/1\/2,0/);
 const values=[8,10,14],p=[.25,.5,.25];
 const mean=values.reduce((sum,v,i)=>sum+v*p[i],0);
 const variance=values.reduce((sum,v,i)=>sum+p[i]*(v-mean)**2,0);
 assert.equal(variance,4.75);assert.match(exercise(16,0).answer.en,/4\.75/);
 assert.doesNotMatch(exercise(16,0).hint.en,/is symmetric/);
});

test('forecast errors align with observed targets and portfolios sort the given signals',()=>{
 const y=[5,6,4,4,7];const errors=y.slice(1).map((v,i)=>v-y[i]);
 assert.deepEqual(errors,[1,-2,0,3]);assert.equal(errors.reduce((s,e)=>s+Math.abs(e),0)/errors.length,1.5);
 assert.match(exercise(22,2).answer.en,/MAE=\(1\+2\+0\+3\)\/4=1\.5/);
 const assets=[{id:'A',signal:.1,ret:.01},{id:'B',signal:.3,ret:.04},{id:'C',signal:.2,ret:-.02}].sort((a,b)=>a.signal-b.signal);
 assert.deepEqual([assets[0].id,assets[2].id],['A','B']);assert.equal(assets[2].ret-assets[0].ret,.03);
 assert.match(exercise(23,4).answer.en,/\.03/);
 assert.match(exercise(15,2).prompt.en,/FOLLOWING month/);
 assert.match(exercise(15,2).answer.en,/insufficient for an executable evaluation/);
});
