import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getAllLessons} from '../lib/lessons';
import {lessonToMarkdown} from '../lib/lesson-export';

test('every daily figure has finite data, complete labels and valid dimensions',()=>{
 for(const m of getAllLessons())for(const [i,s] of m.sessions.entries()){
  const at=`W${m.week} day ${i+1}`;const v=s.visual;assert.ok(v,`${at}: missing illustration`);
  for(const l of ['en','vi'] as const){assert.ok(v.title[l],at);assert.ok(v.caption[l],at);}
  if(v.kind==='xy'){
   assert.ok(v.series.length,at);assert.ok(v.xLabel.en&&v.xLabel.vi&&v.yLabel.en&&v.yLabel.vi,at);
   for(const series of v.series){assert.ok(series.points.length,at);for(const point of series.points){assert.equal(point.length,2,at);assert.ok(point.every(Number.isFinite),at);}}
  }else if(v.kind==='bars'){
   assert.ok(v.values.length,at);assert.ok(v.xLabel.en&&v.xLabel.vi&&v.yLabel.en&&v.yLabel.vi,at);
   for(const x of v.values){assert.ok(Number.isFinite(x.value),at);assert.ok(x.label.en&&x.label.vi,at);}
  }else if(v.kind==='matrix'){
   assert.equal(v.rows.length,v.values.length,at);assert.ok(v.columns.length,at);
   for(const row of v.values){assert.equal(row.length,v.columns.length,at);assert.ok(row.every(Number.isFinite),at);}
  }else {assert.ok(v.steps.length>=2,at);for(const step of v.steps)assert.ok(step.en&&step.vi,at);}
 }
});

test('introductory curve and regression figures satisfy their printed equations',()=>{
 const first=getAllLessons().find(m=>m.week===1)!;
 const derivative=first.sessions[0].visual!;assert.equal(derivative.kind,'xy');if(derivative.kind!=='xy')return;
 for(const [x,y] of derivative.series[0].points)assert.ok(Math.abs(y-.5*(2*x-3)**2)<1e-12);
 for(const [x,y] of derivative.series[1].points)assert.ok(Math.abs(y-(.5-2*(x-1)))<1e-12);
 const regression=first.sessions[1].visual!;assert.equal(regression.kind,'xy');if(regression.kind!=='xy')return;
 assert.deepEqual(regression.series[0].points,[[0,1],[1,2],[2,2]]);
 for(const [x,y] of regression.series[1].points)assert.ok(Math.abs(y-(7/6+x/2))<1e-12);
});

test('portable lesson exports preserve figure data and keep answers in disclosure blocks',()=>{
 const lesson=getAllLessons().find(m=>m.week===1)!;
 const md=lessonToMarkdown(lesson,1,'2026-10-08','en',{'day::lesson0':true},'day');
 assert.ok(md.includes('| 0 | 1 |'));assert.ok(md.includes('<details>'));assert.ok(md.includes('<summary>Show answer</summary>'));
 assert.equal((md.match(/^- \[[ x]\]/gm)||[]).length,4);assert.ok(md.includes('- [x]'));
});
