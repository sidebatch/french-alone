import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, phrases, getPhrases } from '../dist/data.js';
import { freshState, readState, makeQuestions, finishLesson, streak, totalXP, today } from '../dist/core.js';

const answers = (id, correct=6) => getPhrases(id).map((p,i)=>({id:p.id,correct:i<correct}));
test('curriculum has eight complete lessons and 48 unique, translated expressions',()=>{
  assert.equal(lessons.length,8);assert.equal(phrases.length,48);assert.equal(new Set(phrases.map(p=>p.id)).size,48);
  for(const l of lessons){assert.equal(getPhrases(l.id).length,6);for(const p of getPhrases(l.id))for(const key of ['fr','ko','pronunciation','note'])assert.ok(p[key]);}
});
test('quiz has one correct choice and four distinct meanings per question',()=>{
  for(const l of lessons){const questions=makeQuestions(getPhrases(l.id));assert.equal(questions.length,6);assert.equal(new Set(questions.map(q=>q.phrase.id)).size,6);for(const q of questions){assert.equal(q.choices.length,4);assert.equal(q.choices.filter(p=>p.id===q.phrase.id).length,1);assert.equal(new Set(q.choices.map(p=>p.ko)).size,4);}}
});
test('pass threshold, mistakes, daily goal, and repeat XP stay consistent',()=>{
  const s=freshState();let r=finishLesson(s,'greetings',answers('greetings',4),'2026-11-06');
  assert.equal(r.passed,false);assert.equal(r.xp,40);assert.equal(s.completed.length,0);assert.equal(s.mistakes.length,2);assert.equal(s.activity['2026-11-06'].words,4);
  r=finishLesson(s,'greetings',answers('greetings',5),'2026-11-06');assert.equal(r.passed,true);assert.equal(r.xp,30);assert.equal(s.completed.length,1);assert.equal(s.mistakes.length,1);
  r=finishLesson(s,'greetings',answers('greetings',6),'2026-11-06');assert.equal(r.xp,10);assert.equal(s.mistakes.length,0);assert.equal(s.mastered.length,6);assert.equal(totalXP(s),80);
  r=finishLesson(s,'greetings',answers('greetings',6),'2026-11-07');assert.equal(r.xp,0);assert.equal(s.activity['2026-11-07'].words,0);assert.equal(s.completed.length,1);
});
test('partial or duplicate answers cannot complete a lesson',()=>{
  assert.throws(()=>finishLesson(freshState(),'greetings',answers('greetings').slice(1)));
  const duplicated=answers('greetings');duplicated[0]=duplicated[1];assert.throws(()=>finishLesson(freshState(),'greetings',duplicated));
  assert.throws(()=>finishLesson(freshState(),'unknown',[]));
});
test('streak includes yesterday before today is studied and stops at gaps',()=>{
  const s=freshState();s.activity={'2026-11-04':{xp:0,words:0},'2026-11-05':{xp:0,words:0}};
  assert.equal(streak(s,new Date(2026,10,6,0,5)),2);assert.equal(streak(s,new Date(2026,10,7,12)),0);
  s.activity['2026-11-06']={xp:80,words:6};assert.equal(streak(s,new Date(2026,10,6,23,59)),3);assert.equal(today(new Date(2026,0,2)),'2026-01-02');
});
test('storage corruption and untrusted IDs recover without crashing',()=>{
  assert.deepEqual(readState({getItem:()=>'{bad'}),freshState());assert.deepEqual(readState({getItem:()=>{throw Error();}}),freshState());
  const raw={version:1,completed:['greetings','greetings','invalid'],favorites:['greetings-0','greetings-0','bad'],mastered:'bad',mistakes:null,activity:{'bad':{xp:90},'2026-11-06':{xp:-2},'2026-11-07':{xp:20,words:2}},slow:true};
  const loaded=readState({getItem:()=>JSON.stringify(raw)});assert.deepEqual(loaded.completed,['greetings']);assert.deepEqual(loaded.favorites,['greetings-0']);assert.deepEqual(loaded.mastered,[]);assert.deepEqual(Object.keys(loaded.activity),['2026-11-07']);assert.equal(loaded.slow,true);
});
