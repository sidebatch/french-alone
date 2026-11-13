import test from 'node:test';
import assert from 'node:assert/strict';
import {grammarCoverage} from '../docs/grammar-coverage.mjs';
import {grammarArticles,referenceGrammarArticles,grammarById,grammarsForQuestion,grammarForQuestion} from '../dist/grammar-data.js';
import {searchGrammar,createGrammarStore,GRAMMAR_KEY} from '../dist/grammar-core.js';

test('published reference contents have 97 traceable topic mappings, with no missing destinations',()=>{
  assert.deepEqual(grammarCoverage.map(source=>source.units.length),[39,36,22]);
  for(const source of grammarCoverage){
    assert.ok(new URL(source.contents).protocol==='https:');
    for(const unit of source.units){
      assert.ok(unit.topic&&unit.articles.length,source.id+':'+unit.unit);
      for(const id of unit.articles){
        const article=grammarById(id);assert.ok(article,id);assert.ok(article.sections.length>=3,id);
        assert.ok(article.sections.some(s=>s.examples?.length),id+' must teach with a translated example');
      }
    }
  }
});

test('all 59 original reference additions have substantive teaching text, examples and French titles',()=>{
  assert.equal(referenceGrammarArticles.length,59);assert.equal(grammarArticles.length,126);
  for(const a of referenceGrammarArticles){
    assert.ok(grammarArticles.includes(a));assert.deepEqual(a.lessonIds,[]);assert.ok(a.term&&a.fr===a.term);
    assert.ok(a.sections.length>=3,a.id);
    assert.ok(a.sections.filter(s=>s.paragraphs).length>=2,a.id);
    assert.ok(a.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.table?.rows.flat()||[])]).join('').length>=180,a.id+' substantive rules');
    assert.ok(a.sections.flatMap(s=>s.examples||[]).length>=1,a.id+' bilingual examples');
    assert.ok(!JSON.stringify(a).match(/TODO|준비 중|작성 예정|임시 설명/),a.id);
  }
});

test('future questions can link multiple reference topics without a course mapping, and old IDs still work',()=>{
  assert.deepEqual(grammarsForQuestion({id:'future-q',grammarIds:['causative','participle-agreement','causative']}).map(a=>a.id),['causative','participle-agreement']);
  assert.equal(grammarForQuestion({id:'future-q',grammarId:'neutral-relatives'}).id,'neutral-relatives');
  assert.equal(grammarForQuestion({id:'past-events-3'}).id,'participles');
  assert.equal(grammarForQuestion({id:'past-events-3',grammarIds:['bad']} ).id,'participles');
  assert.deepEqual(grammarsForQuestion({id:'missing',grammarIds:'causative'}),[]);
  for(const q of [null,undefined,{},'missing'])assert.deepEqual(grammarsForQuestion(q),[]);
});

test('new topics are discoverable with Korean names and French constructions',()=>{
  for(const [query,id] of [['사역구문','causative'],['ce dont','neutral-relatives'],['부정법 과거','infinitive-past'],['접속법 반과거','literary-subjunctive'],['숫자','numbers'],['au cas où','condition-connectors'],['허사 ne','advanced-negation'],['자유간접화법','discourse-types'],['과거분사 일치','participle-agreement']])assert.equal(searchGrammar(query)[0]?.id,id,query);
});

test('sensitive form distinctions and exceptions remain in their respective lessons',()=>{
  const content=id=>JSON.stringify(grammarById(id));
  for(const [id,fragments] of Object.entries({
    'literary-subjunctive':['fusse, fusses, fût, fussions, fussiez, fussent','eusse, eusses, eût','qu’elle fût partie'],
    'passe-simple-forms':['fus, fus, fut, fûmes, fûtes, furent','vins, vins, vint, vînmes, vîntes, vinrent'],
    'participle-agreement':['Elles se sont parlé.','Elles se sont fait aider.','Les enfants que j’ai vus courir','Les maisons que j’ai vu construire'],
    'tout':['Elles sont tout heureuses.','Elles sont toutes honteuses.'],
    'time-clauses':['après que는 표준 규범에서 직설법','Quand tu arriveras'],
    'indirect-questions':['Je me demande s’il viendra.'],
    'neutral-relatives':['ce dont tu as besoin','ce à quoi tu penses'],
    'numbers':['deux cents / deux cent trois','quatre-vingts / quatre-vingt-deux'],
    'verb-prepositions':['Je l’aide à comprendre.','Je lui demande de venir.']
  }))for(const fragment of fragments)assert.ok(content(id).includes(fragment),id+': '+fragment);
});

test('adding reference articles keeps existing view history and independently counts multiple links',()=>{
  const data=new Map([[GRAMMAR_KEY,JSON.stringify({version:1,counts:{participles:4},seen:[{id:'participles',context:'p:run:q'}]})]]);
  const store=createGrammarStore({getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)});
  assert.equal(store.open('participles','p:run:q'),4);
  assert.equal(store.open('causative','p:new:q'),1);assert.equal(store.open('participle-agreement','p:new:q'),1);
  assert.equal(store.open('causative','p:new:q'),1);assert.equal(store.count('participles'),4);
});
