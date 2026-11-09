import test from 'node:test';
import assert from 'node:assert/strict';
import { practicePacks, questionById } from '../dist/practice-data.js';
import { freshPractice, dailyDeck, dailyProgress, recordPractice, readPractice, readPracticeDrafts, supportTiles } from '../dist/practice-core.js';

const date='2026-11-09';
const results=deck=>deck.map(q=>({id:q.id,correct:true,independent:q.kind==='input'}));
const reload=state=>readPractice({getItem:()=>JSON.stringify(state)});

test('two short rounds follow authored order and complete exactly one course',()=>{
  const state=freshPractice();
  const first=dailyDeck(state,date);
  assert.deepEqual(first.map(q=>q.id),practicePacks[0].questions.slice(0,5).map(q=>q.id));
  recordPractice(state,results(first),{packId:'daily',date,runId:'first'});
  assert.deepEqual(state.completed,[]);
  const second=dailyDeck(reload(state),date);
  assert.deepEqual(second.map(q=>q.id),practicePacks[0].questions.slice(5).map(q=>q.id));
  recordPractice(state,results(second),{packId:'daily',date,runId:'second'});
  assert.deepEqual(state.completed,['want']);
  assert.equal(dailyDeck(reload(state),date)[0].id,'can-1');
});

test('daily review makes room for new content and promotes credited cards to unaided typing',()=>{
  const state=freshPractice(),pack=practicePacks[0];
  recordPractice(state,results(pack.questions),{packId:pack.id,date:'2026-11-08'});
  const deck=dailyDeck(state,date);
  assert.equal(deck.length,5);
  assert.equal(deck.filter(q=>state.cards[q.id]).length,2);
  assert.deepEqual(deck.slice(2).map(q=>q.id),['can-1','can-2','can-3']);
  for(const q of deck.slice(0,2)){
    assert.equal(q.kind,'input');assert.equal(q.model,undefined);
    assert.equal(q.choices,undefined);assert.equal(q.tiles,undefined);
  }
  assert.equal(deck[2].kind,'choice');assert.ok(deck[2].model);
  assert.equal(dailyDeck(state,date,3).length,3);
});

test('stamps require three completed questions and unlock by distinct days rather than repeated rounds',()=>{
  let state=freshPractice();
  recordPractice(state,results(dailyDeck(state,date,3)),{packId:'light',date});
  recordPractice(state,results(dailyDeck(state,date,3)),{packId:'light',date});
  assert.deepEqual(dailyProgress(state,date),{questions:6,rounds:2,days:1});
  state=reload(state);
  recordPractice(state,[{id:'want-2',correct:true,independent:true}],{packId:'retry',date:'2026-11-10'});
  assert.equal(dailyProgress(state,'2026-11-10').days,1);
  recordPractice(state,results(dailyDeck(state,'2026-11-10',3)),{packId:'light',date:'2026-11-10'});
  assert.equal(dailyProgress(reload(state),'2026-11-10').days,2);
});

test('replaying a committed round after reload cannot duplicate credit, progress or memory strength',()=>{
  let state=freshPractice();const answers=results(dailyDeck(state,date));
  recordPractice(state,answers,{packId:'daily',date,runId:'once'});
  state=reload(state);const before=structuredClone(state);
  const duplicate=recordPractice(state,answers,{packId:'daily',date,runId:'once'});
  assert.equal(duplicate.duplicate,true);assert.equal(duplicate.xp,0);
  assert.equal(duplicate.newSentences,0);assert.deepEqual(state,before);
});

test('a weak answer only earns recovery when recalled without assistance',()=>{
  const state=freshPractice(),q=questionById('want-2');
  recordPractice(state,[{id:q.id,correct:true,independent:false}],{packId:'retry',date});
  let summary=recordPractice(state,[{id:q.id,correct:true,independent:false}],{packId:'retry',date});
  assert.equal(summary.recovered,0);assert.equal(summary.xp,0);
  summary=recordPractice(state,[{id:q.id,correct:true,independent:true}],{packId:'retry',date});
  assert.equal(summary.recovered,1);assert.equal(summary.independent,1);assert.equal(summary.xp,5);
  assert.equal(summary.transfer,false);assert.equal(summary.newSentences,0);
});

test('legacy completed rounds migrate to stamps and stored days survive truncated run history',()=>{
  const state=freshPractice();recordPractice(state,results(practicePacks[0].questions),{packId:'want',date});
  delete state.days;
  const migrated=reload(state);assert.equal(dailyProgress(migrated,date).days,1);
  migrated.runs=[];assert.equal(dailyProgress(reload(migrated),date).days,1);
  migrated.days['2026-02-30']={questions:10,rounds:1};
  migrated.days['2026-11-10']={questions:-3,rounds:1};
  assert.equal(dailyProgress(reload(migrated),date).days,1);
});

test('paused quick rounds preserve promoted formats and repeated letters in assisted cards',()=>{
  const ids=['want-1','want-2','want-3','want-4','want-5'];
  const tiles=supportTiles(questionById('want-3')).tiles.reverse();
  const item={packId:'daily',runId:'resume-id',questionIds:ids,formats:['input','input','input','order','choice'],index:2,
    results:[{id:ids[0],correct:true,independent:true},{id:ids[1],correct:true,independent:true}],
    current:{supported:true,errors:2,tiles,selected:[1,3],status:'idle',hints:1,hadError:true}};
  const read=value=>readPracticeDrafts({getItem:()=>JSON.stringify({version:1,sessions:{daily:value}})});
  const draft=read(item).daily;
  assert.equal(draft.runId,item.runId);assert.equal(draft.formats[0],'input');assert.equal(draft.results[0].independent,true);
  assert.deepEqual(draft.current.tiles,tiles);assert.deepEqual(draft.current.selected,[1,3]);
  assert.equal(draft.current.supported,true);assert.equal(draft.current.hints,1);
  assert.deepEqual(read({...item,questionIds:ids.slice(0,4)}),{});
  assert.deepEqual(supportTiles({answer:'attendre'}).tiles.filter(x=>x==='t'),['t','t']);
});
