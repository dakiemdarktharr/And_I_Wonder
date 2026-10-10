import {normalizeMathNotation} from '../lib/math-notation';
import {solutionParagraphs} from '../lib/solution-paragraphs';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs';
import crypto from 'node:crypto';
import katex from 'katex';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import {mathCurriculum as c,mathManifest as m,mathCalendarDays,mathSessionForDate,mathProgressKey,mathExerciseKey,mathSessionForKey} from '../lib/math-curriculum';
import {mathLessonToMarkdown} from '../lib/lesson-export';
import {mathProgressView,validateMathProgress} from '../lib/math-progress';
import {searchMathNotes} from '../lib/math-search';
import {foundationSourceWeek} from '../lib/math-foundation-route';

test('both alternative routes preserve all 731 dates and exactly 523 × 240-minute weekday sessions',()=>{
 assert.equal(c.weeks.length,105);
 for(const route of [undefined,'foundation']){
  const days=mathCalendarDays(route);const sessions=route?c.foundationSessions:c.sessions;
  assert.equal(days.length,731);assert.equal(days.filter(d=>d.minutes===0).length,208);assert.equal(sessions.length,523);
  assert.equal(sessions.reduce((a,s)=>a+s.minutes!.reduce((a,b)=>a+b,0),0),125520);
  assert.equal(sessions.at(-1)!.date,'2028-10-06');
  assert.equal(sessions.filter(s=>(s.calendarWeek??s.week)===105).length,3);
  const completedWeeks=new Set<number>();
  for(const s of sessions){if(s.dayIndex===0)assert.ok(c.weeks.find(w=>w.week===s.week)!.prerequisites.every(p=>completedWeeks.has(p)),`Prior study on ${route??'main'} route: ${s.id}`);if(s.dayIndex===4)completedWeeks.add(s.week);}
  for(const s of sessions){assert.ok(![0,6].includes(new Date(s.date+'T12:00:00Z').getUTCDay()));assert.deepEqual(s.minutes!.reduce((a,b)=>a+b,0),240);assert.equal(s.taskIds.length,4);}
 }
 assert.deepEqual(c.sessions.slice(0,5).map(s=>new Date(s.date+'T12:00:00Z').getUTCDay()),[3,4,5,1,2]);
 assert.equal(m.studyYears.reduce((a,b)=>a+b,0),125520);
});

test('canonical graph, theorem/source/exercise and alternate-form references resolve',()=>{
 const sources=new Set(c.sources.map(s=>s.id));const exerciseIds=new Set(c.weeks.flatMap(w=>w.exercises.map(e=>e.id)));
 assert.equal(sources.size,c.sources.length);assert.equal(exerciseIds.size,m.exercises.length);
 for(const w of c.weeks){
  assert.equal(w.sessions.length,w.week===105?3:5);
  assert.ok(w.prerequisites.every(p=>p>=1&&p<w.week),`DAG W${w.week}`);
  assert.ok(w.reading.every(r=>sources.has(r.sourceId)));
  for(const th of w.theorems){assert.ok(sources.has(th.sourceId));assert.ok(th.sourceSection);assert.ok(['proved','proof sketch','assumed'].includes(th.proofStatus));}
  const ids=new Set(w.exercises.map(e=>e.id)),theorems=new Set(w.theorems.map(t=>t.id));
  for(const s of w.sessions){assert.ok(s.exerciseIds.length);for(const id of [...s.exerciseIds,...s.alternativeExerciseIds??[]])assert.ok(ids.has(id),`${id} at W${w.week}`);for(const id of s.theoremIds)assert.ok(theorems.has(id));}
  for(const e of w.exercises){assert.ok(e.solution.length);assert.ok(Array.isArray(e.hints));assert.ok(e.rubric.length);assert.ok(e.rubric.every(r=>r.points>0));if(e.practiceOrigin)assert.ok(exerciseIds.has(e.practiceOrigin));for(const p of e.remediation)assert.ok(c.weeks.some(w=>w.week===p));}
  if(w.week>=29){const scheduled=new Set(w.sessions.flatMap(s=>s.exerciseIds));const es=w.exercises.filter(e=>scheduled.has(e.id));assert.ok(es.filter(e=>e.skills.some(s=>s==='proof'||s==='derivation')).length>=2,`Two substantial proof/derivation tasks W${w.week}`);assert.ok(es.some(e=>e.skills.includes('transfer')||e.skills.includes('counterexample')),`Transfer W${w.week}`);}
 }
 for(const a of c.assessments){assert.equal(a.forms.length,2);const A=new Set(a.forms[0].exerciseIds);for(const form of a.forms)for(const id of form.exerciseIds)assert.ok(exerciseIds.has(id));assert.ok(a.forms[1].exerciseIds.every(id=>!A.has(id)));}
 assert.ok(!/\bTODO\b|\bTBD\b|PLACEHOLDER|lorem ipsum/i.test(JSON.stringify(c)));
});

type Tree={type:string;value?:string;children?:Tree[]};
const parser=unified().use(remarkParse).use(remarkMath);
function formulas(text:string){const values:string[]=[];const visit=(n:Tree)=>{if(n.type==='math'||n.type==='inlineMath')values.push(n.value!);n.children?.forEach(visit);};visit(parser.parse(text) as Tree);return values;}
function bilingualNodes(value:unknown,path='root'):{path:string;en:string;vi:string}[]{
 if(!value||typeof value!=='object')return[];
 const v=value as Record<string,unknown>;if(typeof v.en==='string'&&typeof v.vi==='string')return[{path,en:v.en,vi:v.vi}];
 return Object.entries(v).flatMap(([k,x])=>bilingualNodes(x,`${path}.${k}`));
}
test('every authored mathematical expression renders through KaTeX; bilingual fields are populated',()=>{
 let count=0;
 for(const node of bilingualNodes(c.weeks))for(const lang of ['en','vi'] as const){
  assert.ok(node[lang].trim(),`${node.path}.${lang}`);
  assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(node[lang]),`Control escape in ${node.path}.${lang}`);
  for(const formula of formulas(node[lang])){assert.doesNotThrow(()=>katex.renderToString(formula,{throwOnError:true,strict:false}),`${node.path}.${lang}: ${formula}`);count++;}
 }
 assert.ok(count>100,'Content has actual rendered mathematics');
});
test('new final-exam bilingual formulas preserve exact mathematical symbols and constants',()=>{
 for(const node of bilingualNodes(c.weeks.filter(w=>[97,98,99,101,102].includes(w.week)))){
  // Vietnamese word order can move a formula without changing its content or multiplicity.
  assert.deepEqual(formulas(node.en).map(x=>x.replace(/\s/g,'')).sort(),formulas(node.vi).map(x=>x.replace(/\s/g,'')).sort(),node.path);
 }
});

test('archived v1 content verifies across Git text line-ending conversion',()=>{
 const archive=JSON.parse(fs.readFileSync('data/archive/curriculum-v1/manifest.json','utf8'));
 const canonicalHash=(bytes:Buffer,expected:string)=>{const hash=(v:Buffer|string)=>crypto.createHash('sha256').update(v).digest('hex');const lf=bytes.toString('utf8').replace(/\r\n/g,'\n');return [hash(bytes),hash(lf),hash(lf.replace(/\n/g,'\r\n'))].includes(expected)?expected:hash(lf);};
 // Git autocrlf normalizes text on checkout. This script originally mixed CRLF/LF;
 // pin its LF blob separately while retaining the original historical manifest.
 const checkoutHashes:Record<string,string>={'scripts/author-87-93.mjs':'5be46d25204d3c17d5c941e25aa7e7c3bf1000189604ff8d3878ec7813f20d91'};
 for(const entry of archive.entries){const bytes=fs.readFileSync('data/archive/curriculum-v1/'+entry.file);assert.equal(canonicalHash(bytes,entry.sha256),checkoutHashes[entry.file]??entry.sha256,entry.file);if(entry.file.startsWith('data/'))assert.equal(canonicalHash(fs.readFileSync(entry.file),entry.sha256),checkoutHashes[entry.file]??entry.sha256,'Original '+entry.file);}

});

test('revision-scoped progress accepts only canonical tasks and keeps public evidence private',()=>{
 const s=c.sessions[0],key=mathProgressKey(s);const valid={version:c.version,noteId:key,taskId:s.taskIds[0],checked:true};
 assert.ok(validateMathProgress(valid).patch);
 for(const patch of [{version:'v1'},{noteId:'Daily/2026-10/2026-10-07'},{noteId:key+'old'},{taskId:key+'::lesson0'},{taskId:key+'::block4'},{taskId:key+'::block0.$set'},{taskId:'__proto__'},{admin:true},{checked:'true'}])assert.ok(validateMathProgress({...valid,...patch}).error,JSON.stringify(patch));
 const doc={noteId:key,version:c.version,checked:{block0:true,lesson0:true,'block0.x':true},status:'done',evidence:'private mathematics feedback'};
 const publicView=mathProgressView(doc,false)!;assert.ok(!('evidence' in publicView));assert.deepEqual(Object.keys(publicView.checked),s.taskIds);assert.equal(mathProgressView(doc,true)!.evidence,doc.evidence);
 assert.equal(mathProgressView({...doc,version:'v1'},false),null);
 assert.equal(mathProgressView({...doc,noteId:key+'old'},false),null);
 const repaired=c.foundationSessions[0];assert.notEqual(mathProgressKey(repaired),key);assert.ok(mathSessionForKey(mathProgressKey(repaired)));
});

test('draft keys are per exercise content and exports preserve version, teaching and hidden solutions without practice clutter',()=>{
 const w=c.weeks.find(w=>w.week===97)!,s=c.sessions.find(s=>s.week===97)!;
 const e=w.exercises[0],key=mathExerciseKey(e);assert.match(key,new RegExp('^'+e.id+'@r1-'));assert.notEqual(key,'97-0-'+e.id);
 const en=mathLessonToMarkdown(w,s,c.sources,'en',{[s.taskIds[0]]:true});
 assert.ok(en.includes('math-v2.0'));assert.ok(en.includes(s.revision));assert.ok(en.includes(e.prompt.en));for(const step of e.solution.flatMap(s=>solutionParagraphs(s.en,'en')))assert.ok(en.includes(step));assert.ok(en.includes(e.teaching!.application.en));assert.ok(en.includes(e.teaching!.formula.en));assert.ok(!en.includes('<summary>Stepped hints</summary>'));assert.ok(!en.includes('Deliverable and error check'));assert.ok(en.includes('[x] 50 min'));
 assert.ok(!en.includes('private mathematics feedback'));assert.ok(!en.includes('lesson0'));
 const vi=mathLessonToMarkdown(w,s,c.sources,'vi');assert.ok(vi.includes(e.prompt.vi));assert.ok(vi.includes(w.theorems[0].proof.vi));
 assert.ok(en.includes('<summary>Show solution</summary>'));assert.ok(vi.includes(normalizeMathNotation(e.teaching!.steps[0].vi)));
});

test('math search routes to versioned public lessons; repair route defers learning instead of doubling work',()=>{
 const hits=searchMathNotes('uniform integrability');assert.ok(hits.length);assert.ok(hits.every(n=>String(n.meta.href).includes('curriculum=v2')));assert.ok(hits.every(n=>!('evidence' in n.meta)));
 assert.ok(searchMathNotes('P05').some(n=>n.meta.href==='/projects/P05?curriculum=v2'&&n.kind==='project'));
 assert.equal(foundationSourceWeek(17),5);assert.equal(foundationSourceWeek(29),17);assert.equal(foundationSourceWeek(96),84);
 assert.ok(!c.foundationSessions.some(s=>s.week>=85&&s.week<=96));assert.ok(!c.foundationSessions.some(s=>s.week===101));
 for(const s of c.sessions)assert.equal(mathSessionForDate(s.date),s);
 for(const s of c.foundationSessions)assert.equal(mathSessionForDate(s.date,'foundation'),s);
});

test('every study session has four staged problems with specific teaching on both routes',()=>{
 const all=new Map(c.weeks.flatMap(w=>w.exercises.map(e=>[e.id,e] as const)));
 const identity=(id:string):string=>all.get(id)!.practiceOrigin?identity(all.get(id)!.practiceOrigin!):id;
 for(const sessions of [c.sessions,c.foundationSessions])for(const s of sessions){
  for(const ids of [s.exerciseIds,...(s.alternativeExerciseIds?[s.alternativeExerciseIds]:[])]){
   assert.equal(ids.length,4,s.id);assert.equal(new Set(ids.map(identity)).size,ids.length,s.id);
   for(const id of ids){const e=all.get(id)!;assert.ok(e.teaching?.application.en&&e.teaching.application.vi,id);assert.ok(e.teaching.formula.en&&e.teaching.formula.vi,id);assert.ok(e.teaching.steps.length>=3,id);}
  }
 }
 assert.equal(m.counts.originalAuthoredRecords,543);assert.equal(m.counts.minimumDailyProblems,4);
});

test('main route teaches one distinct primary focus per day without reconstruction padding',()=>{
 const all=new Map(c.weeks.flatMap(w=>w.exercises.map(e=>[e.id,e] as const)));
 assert.equal(new Set(c.sessions.map(s=>s.lesson!.conceptKey)).size,523);
 for(const session of c.sessions){
  assert.ok(session.lesson?.steps.length!>=3);assert.equal(session.exerciseIds[2],session.lesson!.primaryExerciseId);
  const problems=session.exerciseIds.map(id=>all.get(id)!);
  assert.deepEqual(problems.map(e=>e.practiceRole),['concept','derivation','application','error analysis']);
  assert.ok(problems.every(e=>!e.reviewKind&&!e.practiceOrigin));
 }
 assert.equal(c.sessions.filter(s=>s.lesson!.primaryExerciseId.startsWith('daily-')).length,20);
 assert.equal(m.counts.defaultProblemAssignments,2092);
});
