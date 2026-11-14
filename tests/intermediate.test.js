import test from 'node:test';
import assert from 'node:assert/strict';
import { practicePacks,practiceQuestions,practiceUnits,questionById } from '../dist/practice-data.js';
import { freshPractice,dailyDeck,readPractice,readPracticeDrafts,recordPractice,reviewDeck,nextPack,isCorrect,normalizeAnswer } from '../dist/practice-core.js';

const date='2026-11-12';
const load=state=>readPractice({getItem:()=>JSON.stringify(state)});
const results=deck=>deck.map(q=>({id:q.id,correct:true,independent:q.kind==='input'}));

test('intermediate content adds four coherent units and 120 questions without replacing beginner IDs',()=>{
  assert.equal(practiceUnits.filter(u=>u.level==='intermediate').length,4);
  assert.equal(practicePacks.filter(p=>p.level==='intermediate').length,12);
  assert.equal(practiceQuestions.filter(q=>q.level==='intermediate').length,120);
  assert.deepEqual(practicePacks.filter(p=>p.level==='beginner').map(p=>p.id),['want','can','like','be','have','go','order-food','need','where']);
  for(const p of practicePacks.filter(p=>p.level==='intermediate')){
    assert.ok(p.guide.rule&&p.guide.caution);assert.equal(p.questions.filter(q=>q.kind==='input').length,6);
    for(const q of p.questions){assert.equal(q.level,'intermediate');assert.ok(q.answer.length<=180);assert.ok(q.note.length<=130);
      assert.ok(isCorrect(q,q.answer));if(q.cue)assert.equal(normalizeAnswer(q.cue.replace('___',q.answer)),normalizeAnswer(q.full));
      if(q.tiles)assert.ok(isCorrect(q,q.tiles.join(' ')));for(const a of q.accepted||[])assert.ok(isCorrect(q,a));
    }
  }
});

test('revised writing examples accept previous answers, both clause orders and spelling variants',()=>{
  const rest=questionById('imagined-conditions-10');
  for(const text of ['Je prendrais un peu de repos si j’étais toi.','Si j’étais toi, je prendrais une pause.','Je ferais une pause si j’étais toi.'])assert.ok(isCorrect(rest,text));
  assert.equal(isCorrect(rest,'Si j’étais toi, je prendrai un peu de repos.'),false);
  const practice=questionById('opinion-links-10');
  for(const text of ['Je pratique tous les jours parce que j’apprends le français.','Parce que j’apprends le français, je m’entraîne tous les jours.','Je m’entraine tous les jours parce que j’apprends le français.'])assert.ok(isCorrect(practice,text));
  assert.equal(isCorrect(practice,'Je s’entraîne tous les jours parce que j’apprends le français.'),false);
});

test('gender, clause order and apostrophe variants pass while wrong agreement and tense fail',()=>{
  for(const a of ['Je suis allé à Paris hier.','Hier, je suis allée à Paris.'])assert.ok(isCorrect(questionById('past-movement-9'),a));
  for(const a of ['Je suis allés à Paris hier.','J’ai allé à Paris hier.'])assert.equal(isCorrect(questionById('past-movement-9'),a),false);
  assert.ok(isCorrect(questionById('imagined-conditions-9'),"Je voyagerais si j'avais le temps."));
  assert.equal(isCorrect(questionById('imagined-conditions-9'),'Si j’aurais le temps, je voyagerais.'),false);
  assert.equal(isCorrect(questionById('future-plans-9'),'J’irais à Paris demain.'),false);
  assert.equal(isCorrect(questionById('relative-links-8'),'qu’'),false);
  assert.equal(isCorrect(questionById('necessity-9'),'Il faut que tu es ici.'),false);
  assert.equal(isCorrect(questionById('comparisons-6'),'mieux'),false);
  assert.ok(isCorrect(questionById('object-pronouns-8'),"l'"));
  assert.equal(isCorrect(questionById('object-pronouns-10'),'Je la peux comprendre.'),false);
});

test('intermediate can start immediately and retains its level after reload',()=>{
  const state=freshPractice();state.level='intermediate';
  assert.equal(dailyDeck(state,date)[0].id,'past-events-1');assert.equal(nextPack(state).id,'past-events');
  recordPractice(state,results(dailyDeck(state,date)),{packId:'daily-intermediate',date,runId:'intermediate-first'});
  const loaded=load(state);assert.equal(loaded.level,'intermediate');assert.equal(loaded.runs[0].packId,'daily-intermediate');
  assert.equal(dailyDeck(loaded,date)[0].id,'past-events-6');
  loaded.level='beginner';assert.equal(dailyDeck(loaded,date)[0].id,'want-1');
});

test('review and daily mixing stay within the selected level',()=>{
  const state=freshPractice();
  for(const id of ['want','past-events'])recordPractice(state,results(practicePacks.find(p=>p.id===id).questions),{packId:id,date:'2026-11-11'});
  state.level='intermediate';const deck=dailyDeck(state,date);
  assert.ok(deck.every(q=>q.level==='intermediate'));assert.equal(deck.filter(q=>state.cards[q.id]).length,2);
  assert.deepEqual(deck.slice(2).map(q=>q.id),['past-movement-1','past-movement-2','past-movement-3']);
  assert.ok(reviewDeck(state,date,'intermediate').every(q=>q.level==='intermediate'&&q.kind==='input'&&!q.model));
  assert.ok(reviewDeck(state,date,'beginner').every(q=>q.level==='beginner'));
});

test('new short-round modes enforce counts and levels and guard replayed rewards',()=>{
  const state=freshPractice();state.level='intermediate';const deck=dailyDeck(state,date,3);
  assert.throws(()=>recordPractice(state,results(deck),{packId:'daily-intermediate',date}));
  assert.throws(()=>recordPractice(state,results(deck),{packId:'light',date}));
  recordPractice(state,results(deck),{packId:'light-intermediate',date,runId:'short-mid'});
  const loaded=load(state),before=structuredClone(loaded);
  assert.equal(recordPractice(loaded,results(deck),{packId:'light-intermediate',date,runId:'short-mid'}).duplicate,true);
  assert.deepEqual(loaded,before);
  assert.equal(recordPractice(state,[{id:'past-events-2',correct:true,independent:true}],{packId:'retry-intermediate',date}).transfer,false);
});

test('beginner and intermediate drafts can coexist with their original formats',()=>{
  const draft=(packId,ids)=>({packId,questionIds:ids,index:0,results:[],formats:ids.map(id=>questionById(id).kind),current:{status:'idle'},runId:packId+'-id'});
  const sessions={daily:draft('daily',practicePacks[0].questions.slice(0,5).map(q=>q.id)),
    'daily-intermediate':draft('daily-intermediate',practicePacks[9].questions.slice(0,5).map(q=>q.id))};
  let loaded=readPracticeDrafts({getItem:()=>JSON.stringify({version:1,sessions})});assert.equal(Object.keys(loaded).length,2);
  assert.equal(loaded['daily-intermediate'].questionIds[0],'past-events-1');
  sessions['daily-intermediate'].questionIds=sessions.daily.questionIds;
  loaded=readPracticeDrafts({getItem:()=>JSON.stringify({version:1,sessions})});assert.equal(loaded['daily-intermediate'],undefined);assert.ok(loaded.daily);
});

test('legacy settings remain beginner and corrupt level preferences safely fall back',()=>{
  const legacy=freshPractice();delete legacy.level;assert.equal(load(legacy).level,'beginner');
  legacy.level='unrecognized';assert.equal(load(legacy).level,'beginner');
});
