import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getAllLessons,getDailyLesson} from '../lib/lessons';
import {getAllNotes} from '../lib/content';

test('every scheduled study day has a complete bilingual lesson; weekends remain free',()=>{
 const modules=getAllLessons();assert.equal(modules.length,105);
 assert.equal(new Set(modules.map(m=>m.week)).size,105);
 let count=0;
 for(const note of getAllNotes().filter(n=>n.kind==='daily')){
  const {lesson,dayIndex}=getDailyLesson(note);
  if(Number(note.meta.planned_minutes)===0){assert.equal(lesson,undefined);continue;}
  count++;assert.ok(lesson,`Missing lesson: ${note.id}`);assert.notEqual(dayIndex,undefined);
  assert.ok(lesson.sessions[dayIndex!],note.id);
 }
 assert.equal(count,523);
});

test('each module contains distinct daily examples, agendas, exercises and answer keys',()=>{
 for(const m of getAllLessons()){
  const context=`Week ${m.week}`;
  const expected=m.week===105?3:5;assert.equal(m.sessions.length,expected,context);
  assert.ok(m.diagram.labels.length>=2,context);
  assert.equal(new Set(m.sessions.map(s=>s.workedExample.en)).size,expected,`${context}: duplicated worked example`);
  assert.equal(new Set(m.sessions.map(s=>s.theory.en)).size,expected,`${context}: duplicated theory`);
  assert.equal(new Set(m.sessions.map(s=>JSON.stringify(s.agenda))).size,expected,`${context}: duplicated agenda`);
  for(const lang of ['en','vi'] as const){
   assert.ok(m.foundations[lang].length>200,`${context}: definitions missing`);
   for(const s of m.sessions){
    assert.ok(s.title[lang].length>3,context);
    assert.ok(s.theory[lang].length>100,`${context}: ${s.title.en} theory`);
    assert.ok(s.workedExample[lang].length>50,`${context}: ${s.title.en} example`);
    assert.equal(s.agenda.length,4,context);
    assert.ok(s.exercises.length>0,context);
    for(const e of s.exercises){
     assert.ok(e.prompt[lang].length>25,`${context}: ${e.id} question`);
     assert.ok(e.answer[lang].length>30,`${context}: ${e.id} answer`);
    }
   }
  }
 }
});

test('the opening Wednesday begins at session one and weekend rest does not advance it',()=>{
 for(const [date,index] of [['2026-10-07',0],['2026-10-08',1],['2026-10-09',2],['2026-10-12',3],['2026-10-13',4],['2026-10-14',0]] as const){
  const note=getAllNotes().find(n=>n.meta.date===date)!;
  assert.equal(getDailyLesson(note).dayIndex,index,date);
 }
});
