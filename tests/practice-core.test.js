import test from 'node:test';
import assert from 'node:assert/strict';
import { practicePacks, practiceQuestions } from '../dist/practice-data.js';
import { PRACTICE_KEY, freshPractice, readPractice, normalizeAnswer, isCorrect, addDays, dueQuestions, reviewDeck, nextPack, recordPractice, independentSentences } from '../dist/practice-core.js';

const resultsFor = pack => pack.questions.map(q=>({id:q.id,correct:true,independent:q.kind==='input'}));
test('three authored rounds move from a model to unsupported recall and novel combinations',()=>{
  assert.equal(practicePacks.length,3);assert.equal(practiceQuestions.length,30);assert.equal(new Set(practiceQuestions.map(q=>q.id)).size,30);
  for(const pack of practicePacks){
    assert.equal(pack.questions.length,10);assert.ok(pack.questions[0].model);assert.ok(pack.questions[4].model);
    const last=pack.questions.at(-1);assert.equal(last.kind,'input');assert.equal(last.transfer,true);assert.ok(last.glossary);assert.equal(last.cue,undefined);assert.equal(last.model,undefined);
    assert.equal(pack.questions.at(-2).cue,undefined);
    for(const q of pack.questions){assert.ok(q.ko&&q.full&&q.answer&&q.note&&q.hint);assert.ok(isCorrect(q,q.answer));if(q.kind==='choice'){assert.equal(q.choices.filter(c=>c===q.answer).length,1);}if(q.kind==='order')assert.ok(isCorrect(q,q.tiles.join(' ')));if(q.cue)assert.equal(normalizeAnswer(q.cue.replace('___',q.answer)),normalizeAnswer(q.full));}
  }
});
test('answer matching accepts formatting and declared alternatives without accepting a different meaning',()=>{
  const q=practicePacks[2].questions[8];assert.ok(isCorrect(q,"  j' aime marcher!  "));assert.ok(isCorrect(q,'J’aime bien marcher.'));assert.equal(isCorrect(q,"Je n'aime pas marcher."),false);
  assert.equal(isCorrect(q,'Je aime marcher'),false);
  assert.ok(isCorrect(practicePacks[0].questions[1],'Je veux manger.'));
  assert.equal(isCorrect(practicePacks[0].questions[1],'peux'),false);
});
test('credit is awarded once and only direct unaided recall counts as independent',()=>{
  const state=freshPractice(),pack=practicePacks[0];
  let r=recordPractice(state,resultsFor(pack),{packId:pack.id,date:'2026-11-06'});
  assert.equal(r.correct,10);assert.equal(r.independent,6);assert.equal(r.transfer,true);assert.equal(r.xp,80);assert.equal(r.newSentences,6);assert.equal(independentSentences(state).length,6);
  assert.equal(state.cards['want-2'].due,'2026-11-07');
  const sameDay=recordPractice(state,resultsFor(pack),{packId:pack.id,date:'2026-11-06'});
  assert.equal(sameDay.xp,0);assert.equal(sameDay.transfer,false);assert.equal(state.cards['want-2'].strength,1);assert.equal(state.cards['want-2'].due,'2026-11-07');
  r=recordPractice(state,resultsFor(pack),{packId:pack.id,date:'2026-11-07',continued:true});
  assert.equal(r.xp,0);assert.equal(r.newSentences,0);assert.equal(r.continued,true);assert.equal(state.cards['want-2'].due,'2026-11-10');
  assert.equal(nextPack(state).id,'can');
});
test('hinted or revealed items return tomorrow and cannot claim unaided transfer',()=>{
  const state=freshPractice(),pack=practicePacks[0];const results=resultsFor(pack).map(r=>({...r,independent:false}));results.at(-1).correct=false;
  const r=recordPractice(state,results,{packId:pack.id,date:'2026-11-06'});
  assert.equal(r.xp,45);assert.equal(r.transfer,false);assert.equal(r.independent,0);assert.equal(independentSentences(state).length,0);
  assert.equal(dueQuestions(state,'2026-11-06').length,0);assert.equal(dueQuestions(state,'2026-11-07').length,10);
  const review=reviewDeck(state,'2026-11-07');assert.ok(review.every(q=>q.kind==='input'&&!q.model&&!q.choices&&!q.tiles));
  const reviewed=recordPractice(state,review.map(q=>({id:q.id,correct:true,independent:true})),{packId:'review',date:'2026-11-07'});
  assert.equal(reviewed.xp,55);assert.equal(reviewed.transfer,false);assert.equal(reviewed.independent,10);
});
test('review intervals use local calendar dates across month and leap-day boundaries',()=>{
  assert.equal(addDays('2026-12-31',1),'2027-01-01');assert.equal(addDays('2028-02-28',1),'2028-02-29');assert.equal(addDays('2026-11-06',3),'2026-11-09');assert.throws(()=>addDays('2026-02-30',1));
});
test('partial rounds, duplicate answers, and unrelated question IDs cannot complete a round',()=>{
  const state=freshPractice(),answers=resultsFor(practicePacks[0]);
  assert.throws(()=>recordPractice(state,answers.slice(1),{packId:'want'}));
  answers[1]=answers[0];assert.throws(()=>recordPractice(state,answers,{packId:'want'}));
  assert.throws(()=>recordPractice(state,resultsFor(practicePacks[1]),{packId:'want'}));assert.throws(()=>recordPractice(state,[],{packId:'review'}));
});
test('practice history survives reload and discards corrupt or obsolete saved fields',()=>{
  assert.deepEqual(readPractice({getItem:()=>'{invalid'}),freshPractice());assert.deepEqual(readPractice({getItem:()=>{throw Error();}}),freshPractice());
  const state=freshPractice();recordPractice(state,resultsFor(practicePacks[0]),{packId:'want',date:'2026-11-06'});
  const storage={getItem:key=>{assert.equal(key,PRACTICE_KEY);return JSON.stringify(state);}};
  assert.deepEqual(readPractice(storage),state);
  state.cards['unknown-1']={due:'2026-11-07'};state.cards['want-1'].due='2026-99-99';state.runs.push({date:'2026-11-06',packId:'unknown'});
  const loaded=readPractice(storage);assert.equal(loaded.cards['unknown-1'],undefined);assert.equal(loaded.cards['want-1'],undefined);assert.equal(loaded.runs.length,1);
});
