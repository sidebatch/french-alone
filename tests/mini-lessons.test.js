import test from 'node:test';
import assert from 'node:assert/strict';
import {practicePacks,practiceQuestions} from '../dist/practice-data.js';
import {miniLessons,courseLessonIds,questionLessonIds,lessonForQuestion,renderMiniLesson} from '../dist/practice-lessons.js';

test('every exercise has an explicit focused lesson and every authored lesson is used',()=>{
  assert.deepEqual(Object.keys(courseLessonIds).sort(),practicePacks.map(p=>p.id).sort());
  assert.deepEqual(Object.keys(questionLessonIds).sort(),practiceQuestions.map(q=>q.id).sort());
  assert.equal(practiceQuestions.length,210);
  assert.deepEqual([...new Set(Object.values(questionLessonIds))].sort(),Object.keys(miniLessons).sort());
  for(const p of practicePacks){assert.equal(courseLessonIds[p.id].length,p.questions.length);assert.ok(new Set(courseLessonIds[p.id]).size>=3,p.id+' must not repeat one course overview');}
  for(const [id,l] of Object.entries(miniLessons)){
    assert.ok(l.title&&l.rule&&l.caution&&l.example.fr&&l.example.ko,id);
    assert.ok(l.rule.length<=170,id+' rule too long');assert.ok(l.caution.length<=180,id+' caution too long');
    assert.ok(l.forms.length>=3&&l.forms.length<=6,id);
    for(const row of l.forms)assert.ok(row.length===2&&row.every(v=>typeof v==='string'&&v.length>0),id);
    assert.doesNotMatch(JSON.stringify(l),/undefined|TODO|토큰|API|자유 작문 전체를 평가/);
  }
});

test('voir form, past negation and gender agreement teach different question targets',()=>{
  const vu=lessonForQuestion('past-events-3'),negative=lessonForQuestion('past-events-5'),arrival=lessonForQuestion('past-movement-3');
  assert.notEqual(vu,negative);assert.match(vu.title,/voir.*vu/);
  assert.deepEqual(vu.forms.map(row=>row[1]),['vu','eu','été','fait','pris','lu']);
  assert.match(vu.example.fr,/J’ai vu/);assert.match(vu.caution,/원형 voir.*과거분사 vu.*현재형 vois/);
  assert.match(negative.rule,/조동사/);assert.ok(negative.forms.some(row=>row[1]==='Je n’ai pas vu ce film.'));
  assert.deepEqual(arrival.forms.map(row=>row[1]),['arrivé','arrivée','arrivés','arrivées']);
  assert.deepEqual(lessonForQuestion('past-movement-5').forms.map(row=>row[1]),['Il est parti.','Elle est partie.','Ils sont partis.','Elles sont parties.']);
});

test('short word questions teach the word or form rather than an unrelated course pattern',()=>{
  const targets={
    'want-3':/dormir/,'can-3':/attendre/,'like-3':/lire/,'be-3':/ici/,'have-3':/sac/,'go-3':/maison/,
    'order-food-3':/café/,'need-3':/aide/,'where-3':/gare/,'past-events-3':/voir.*vu/,'past-movement-3':/arriv/,
    'past-background-3':/être.*ét-/,'future-plans-3':/avoir.*aur/,'real-conditions-3':/rester/,'imagined-conditions-3':/être.*ser/,
    'object-pronouns-3':/le·la·les/,'place-quantity-3':/en.*숫자/,'relative-links-3':/que.*qu’/,
    'comparisons-3':/bon.*meilleur/,'opinion-links-3':/donc/,'necessity-3':/faire.*fass/
  };
  for(const [id,re] of Object.entries(targets))assert.match(lessonForQuestion(id).title,re,id);
  assert.doesNotMatch(JSON.stringify(lessonForQuestion('want-9')),/voudrais/);
  assert.notEqual(lessonForQuestion('object-pronouns-5'),lessonForQuestion('object-pronouns-7'));
  assert.notEqual(lessonForQuestion('relative-links-5'),lessonForQuestion('relative-links-8'));
});

test('irregular future, conditional and subjunctive tables keep all six persons correct',()=>{
  const expected={futureAvoir:['aurai','auras','aura','aurons','aurez','auront'],futureAller:['irai','iras','ira','irons','irez','iront'],
    futureVenir:['viendrai','viendras','viendra','viendrons','viendrez','viendront'],futureFaire:['ferai','feras','fera','ferons','ferez','feront'],
    condEtre:['serais','serais','serait','serions','seriez','seraient'],condPrendre:['prendrais','prendrais','prendrait','prendrions','prendriez','prendraient'],
    subjVenir:['vienne','viennes','vienne','venions','veniez','viennent'],subjEtre:['sois','sois','soit','soyons','soyez','soient'],
    subjFaire:['fasse','fasses','fasse','fassions','fassiez','fassent'],subjPartir:['parte','partes','parte','partions','partiez','partent'],
    subjAvoir:['aie','aies','ait','ayons','ayez','aient']};
  for(const [id,forms] of Object.entries(expected))assert.deepEqual(miniLessons[id].forms.map(row=>row[1]),forms,id);
  assert.equal(miniLessons.subjAvoir.forms[0][0],'que j’','elide que je before aie');
  assert.deepEqual(miniLessons.pcIrregular.headers,['동사원형','과거분사']);
});

test('a missing lesson fails visibly in QA instead of falling back to unrelated text',()=>{
  assert.equal(lessonForQuestion('unknown-question'),undefined);
  assert.throws(()=>renderMiniLesson('unknown-question',v=>v),/Missing mini lesson/);
});
