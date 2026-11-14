import test from 'node:test';
import assert from 'node:assert/strict';
import { practicePacks, practiceQuestions, practiceUnits } from '../dist/practice-data.js';
import { PRACTICE_KEY, PRACTICE_DRAFT_KEY, readPracticeDrafts, freshPractice, readPractice, normalizeAnswer, isCorrect, addDays, dueQuestions, reviewDeck, nextPack, recordPractice, independentSentences, answerFeedback } from '../dist/practice-core.js';

const resultsFor = pack => pack.questions.map(q=>({id:q.id,correct:true,independent:q.kind==='input'}));
test('vocabulary notes beside a blank never spell out a valid answer',()=>{
  const words=text=>normalizeAnswer(text).match(/\p{Script=Latin}+/gu)||[];
  for(const q of practiceQuestions.filter(q=>q.cue&&q.glossary)){
    const note=' '+words(q.glossary).join(' ')+' ';
    for(const value of [q.answer,...(q.accepted||[])]){
      assert.ok(!note.includes(' '+words(value).join(' ')+' '),q.id+' gives away '+value);
    }
  }
});
test('units cover each course once and all questions have a usable grammar explanation',()=>{
  assert.deepEqual(practiceUnits.flatMap(u=>u.packs),practicePacks.map(p=>p.id));
  for(const pack of practicePacks){assert.ok(pack.guide.rule&&pack.guide.caution);for(const q of pack.questions){assert.ok(q.note.length>15);for(const answer of q.accepted||[])assert.ok(isCorrect(q,answer));}}
});
test('typing feedback marks omissions without blaming correctly placed words and recognizes accents',()=>{
  const sentence=practicePacks[0].questions[8];
  const feedback=answerFeedback(sentence,'Je veux ici');
  assert.deepEqual(feedback.tokens.map(t=>t.kind),['ok','ok','missing','ok']);
  assert.equal(answerFeedback(sentence,'Je veux rester ici ici').tokens.filter(t=>t.kind==='extra').length,1);
  const word=practiceQuestions.find(q=>q.id==='order-food-3');
  assert.equal(answerFeedback(word,'cafe').accentOnly,true);assert.equal(isCorrect(word,'cafe'),false);
  assert.equal(isCorrect(word,'café'),true);
  const blank=practiceQuestions.find(q=>q.id==='want-2');
  assert.equal(answerFeedback(blank,'Je veux mangr').tokens.filter(t=>t.kind!=='ok').length,1);
});
test('completing a word or blank does not count as writing an entire sentence',()=>{
  const state=freshPractice(),pack=practicePacks.find(p=>p.id==='be');
  const answers=pack.questions.map(q=>({id:q.id,correct:true,independent:q.kind==='input'&&Boolean(q.cue||q.mode==='word')}));
  recordPractice(state,answers,{packId:pack.id,date:'2026-11-09'});
  assert.equal(independentSentences(state).length,0);
  const review=reviewDeck(state,'2026-11-10');
  recordPractice(state,review.map(q=>({id:q.id,correct:true,independent:true})),{packId:'review',date:'2026-11-10'});
  assert.ok(independentSentences(state).includes('je suis à la maison'));
  assert.ok(!independentSentences(state).includes('ici'));
});
test('course completion outlives the capped history and legacy progress migrates',()=>{
  const state=freshPractice();recordPractice(state,resultsFor(practicePacks[0]),{packId:'want',date:'2026-11-09'});
  const legacy=structuredClone(state);delete legacy.completed;
  assert.deepEqual(readPractice({getItem:()=>JSON.stringify(legacy)}).completed,['want']);
  for(let i=0;i<205;i++)recordPractice(state,resultsFor(practicePacks[1]),{packId:'can',date:'2026-11-09'});
  const loaded=readPractice({getItem:()=>JSON.stringify(state)});
  assert.equal(loaded.runs.length,200);assert.deepEqual(loaded.completed,['want','can']);assert.equal(nextPack(loaded).id,'like');
});
test('twenty-one authored rounds move from guided choices to recall and novel combinations',()=>{
  assert.equal(practicePacks.length,21);assert.equal(practiceQuestions.length,210);assert.equal(new Set(practiceQuestions.map(q=>q.id)).size,210);
  for(const pack of practicePacks){
    assert.equal(pack.questions.length,10);assert.equal(pack.questions[0].kind,'choice');assert.equal(pack.questions[4].kind,'choice');
    const last=pack.questions.at(-1);assert.equal(last.kind,'input');assert.equal(last.transfer,true);assert.ok(last.glossary);assert.equal(last.cue,undefined);
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
  assert.equal(r.correct,10);assert.equal(r.independent,6);assert.equal(r.transfer,true);assert.equal(r.xp,80);assert.equal(r.newSentences,2);assert.equal(independentSentences(state).length,2);
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

test('paused practice validates its sequence, answers and hint state before restoring',()=>{
  const ids=practicePacks[0].questions.map(q=>q.id);
  const paused={packId:'want',questionIds:ids,index:1,results:[{id:ids[0],correct:true,independent:false}],updatedAt:10,continued:false,current:{draft:'veux',choice:null,tiles:[],selected:[],status:'correct',hints:1,hadError:false}};
  const read=sessions=>readPracticeDrafts({getItem:key=>{assert.equal(key,PRACTICE_DRAFT_KEY);return JSON.stringify({version:1,sessions});}});
  assert.equal(read({want:paused}).want.current.hints,1);
  assert.equal(read({want:paused}).want.current.status,'correct');
  assert.equal(read({want:{...paused,current:{...paused.current,draft:'not French'}}}).want.current.status,'idle');
  assert.deepEqual(read({want:{...paused,questionIds:[...ids].reverse()}}),{});
  assert.deepEqual(read({want:{...paused,index:30}}),{});
  assert.deepEqual(read({want:{...paused,results:[]}}),{});
  assert.deepEqual(readPracticeDrafts({getItem:()=>'{bad json'}),{});
});
