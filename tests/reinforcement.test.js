import test from 'node:test';
import assert from 'node:assert/strict';
import {practicePacks,practiceQuestions,questionById} from '../dist/practice-data.js';
import {freshPractice,recordPractice,readPractice,readPracticeDrafts,reinforcementDeck,dailyDeck,roundLevel,isCorrect,normalizeAnswer,independentSentences} from '../dist/practice-core.js';
import {goalForQuestion} from '../dist/practice-goals.js';
import {lessonForQuestion} from '../dist/practice-lessons.js';
import {grammarForQuestion} from '../dist/grammar-data.js';

const date='2026-11-19';
const results=deck=>deck.map(q=>({id:q.id,correct:true,independent:q.kind==='input'}));
const reload=state=>readPractice({getItem:()=>JSON.stringify(state)});

test('each original course retains ten stable questions and adds ten explained follow-ups',()=>{
  assert.equal(practiceQuestions.length,420);
  assert.equal(new Set(practiceQuestions.map(q=>q.id)).size,420);
  for(const pack of practicePacks){
    assert.deepEqual(pack.questions.map(q=>q.id),Array.from({length:10},(_,i)=>pack.id+'-'+(i+1)));
    assert.equal(pack.reinforcement.length,10);
    for(const end of [4,9])assert.ok(pack.reinforcement[end].kind==='input'&&!pack.reinforcement[end].cue);
    for(const q of pack.reinforcement){
      assert.equal(q.packId,pack.id);assert.equal(q.level,pack.level);
      assert.ok(q.ko&&q.note&&q.hint&&q.phase&&q.answer&&q.full,q.id);
      assert.ok(q.note.length<=130&&q.answer.length<=180,q.id);
      assert.ok(goalForQuestion(q.id)&&lessonForQuestion(q.id)&&grammarForQuestion(q.id),q.id);
      assert.ok(pack.questions.some(base=>base.id===q.focusId));
      assert.ok(isCorrect(q,q.answer));for(const value of q.accepted||[])assert.ok(isCorrect(q,value));
      if(q.cue)assert.equal(normalizeAnswer(q.cue.replace('___',q.answer)),normalizeAnswer(q.full));
      if(q.tiles)assert.ok(isCorrect(q,q.tiles.join(' ')),q.id);
    }
    const oldSentences=new Set(pack.questions.map(q=>normalizeAnswer(q.full)));
    const novel=new Set(pack.reinforcement.filter(q=>!oldSentences.has(normalizeAnswer(q.full))).map(q=>normalizeAnswer(q.full)));
    assert.ok(novel.size>=7,pack.id+' needs meaningfully different sentences');
  }
});

test('new grading accepts natural variants but rejects wrong meaning, agreement, tense and missing details',()=>{
  const cases=[
    ['want-extra-4',['Maintenant, je veux dormir.'],['Je veux dors maintenant.','Je veux dormir.']],
    ['be-extra-9',['Maintenant, je suis fatiguée.'],['Je suis fatigue maintenant.']],
    ['order-food-extra-10',['Je voudrais une salade et un sandwich, s’il vous plaît.'],['Je voudrais un salade et un sandwich.']],
    ['past-movement-extra-4',['Hier, elles sont arrivées.'],['Elles sont arrivé hier.','Elles ont arrivées hier.']],
    ['past-background-extra-6',['Hier, à 8 h, elle lisait un livre.'],['Elle lit un livre hier à huit heures.','Elle lisait un livre hier.']],
    ['real-conditions-extra-7',['Je viendrai si j’ai le temps.'],['Si j’aurai le temps, je viendrai.']],
    ['imagined-conditions-extra-10',['J’irais à Paris si j’avais le temps.'],['Si j’aurais le temps, j’irais à Paris.','Si j’avais le temps, j’irai à Paris.']],
    ['object-pronouns-extra-6',['Je veux le lire.'],['Je le veux lire.','Je veux lire.']],
    ['place-quantity-extra-5',['J’en ai trois.'],['J’en ai.','J’y ai trois.']],
    ['relative-links-extra-7',['C’est le film qu’elle regarde.'],['C’est le film qui elle regarde.']],
    ['comparisons-extra-8',['Cette chambre est moins chère que celle-là.'],['Cette chambre est moins cher que celle-là.']],
    ['necessity-extra-10',['Il faut que nous soyons ici.'],['Il faut que nous sommes ici.']]
  ];
  for(const [id,yes,no]of cases){const q=questionById(id);for(const text of yes)assert.ok(isCorrect(q,text),id+': '+text);for(const text of no)assert.equal(isCorrect(q,text),false,id+': '+text);}
});

test('supplementary rounds stay at five, preserve level and continue through both authored stages',()=>{
  const state=freshPractice();
  for(const id of ['want','past-events']){
    const mode='reinforce-'+id,pack=practicePacks.find(p=>p.id===id);
    assert.equal(roundLevel(mode),pack.level);
    const first=reinforcementDeck(state,mode,date);
    assert.deepEqual(first.map(q=>q.id),pack.reinforcement.slice(0,5).map(q=>q.id));
    recordPractice(state,results(first),{packId:mode,date,runId:mode+'1'});
    const second=reinforcementDeck(reload(state),mode,date);
    assert.deepEqual(second.map(q=>q.id),pack.reinforcement.slice(5).map(q=>q.id));
    recordPractice(state,results(second),{packId:mode,date,runId:mode+'2'});
    assert.ok(!state.completed.includes(id),'follow-ups cannot award completion of an unstudied basic course');
    const review=reinforcementDeck(reload(state),mode,'2026-11-20');
    assert.equal(review.length,5);assert.ok(review.every(q=>q.kind==='input'&&!q.tiles));
    const before=structuredClone(state);
    assert.equal(recordPractice(state,results(second),{packId:mode,date,runId:mode+'2'}).duplicate,true);
    assert.deepEqual(state,before);
  }
  assert.ok(independentSentences(state).length>0);
});

test('legacy progress and interrupted ten-question courses survive additional content',()=>{
  const state=freshPractice(),pack=practicePacks[0];
  recordPractice(state,results(pack.questions),{packId:pack.id,date});
  const saved=reload(state);assert.deepEqual(saved.completed,['want']);assert.equal(saved.runs[0].total,10);
  assert.deepEqual(saved.days,state.days);assert.deepEqual(saved.cards,state.cards);
  assert.equal(dailyDeck(saved,date)[0].id,'want-extra-1');
  const draft={packId:'can',questionIds:practicePacks[1].questions.map(q=>q.id),index:0,results:[],current:{}};
  assert.equal(readPracticeDrafts({getItem:()=>JSON.stringify({version:1,sessions:{can:draft}})}).can.questionIds.length,10);
});

test('follow-up drafts and result validation reject other courses, duplicate IDs and wrong round sizes',()=>{
  const state=freshPractice(),deck=reinforcementDeck(state,'want',date),mode='reinforce-want';
  const draft={packId:mode,questionIds:deck.map(q=>q.id),index:1,results:results(deck.slice(0,1)),current:{draft:'pa'}};
  const read=item=>readPracticeDrafts({getItem:()=>JSON.stringify({version:1,sessions:{[mode]:item}})});
  assert.equal(read(draft)[mode].current.draft,'pa');
  for(const ids of [draft.questionIds.slice(1),['can-extra-1',...draft.questionIds.slice(1)],[draft.questionIds[1],...draft.questionIds.slice(1)]]){
    assert.deepEqual(read({...draft,questionIds:ids}),{});
    assert.throws(()=>recordPractice(state,ids.map(id=>({id,correct:true,independent:true})),{packId:mode,date}));
  }
  assert.equal(reload({...state,runs:[{date,packId:mode,total:5,correct:5,independent:4,xp:45}]}).runs[0].packId,mode);
});
