import test from 'node:test';
import assert from 'node:assert/strict';
import {grammarArticles,grammarCategories,grammarForQuestion,miniLessonArticleIds,grammarOutline,grammarById} from '../dist/grammar-data.js';
import {extraGrammarArticles} from '../dist/grammar-extra-data.js';
import {renderGrammarText} from '../dist/grammar-terms.js';
import {miniLessons} from '../dist/practice-lessons.js';
import {practicePacks} from '../dist/practice-data.js';
import {GRAMMAR_KEY,createGrammarStore,parseGrammar,searchGrammar} from '../dist/grammar-core.js';

const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};};
test('every mini lesson and all 210 questions have exactly one authored grammar destination',()=>{
  assert.equal(grammarArticles.length,67);assert.equal(new Set(grammarArticles.map(a=>a.id)).size,67);
  const ids=grammarArticles.flatMap(a=>a.lessonIds);
  assert.equal(ids.length,114);assert.equal(new Set(ids).size,114);
  assert.deepEqual(Object.keys(miniLessons).sort(),Object.keys(miniLessonArticleIds).sort());
  for(const q of practicePacks.flatMap(pack=>pack.questions))assert.ok(grammarForQuestion(q.id),q.id);
  assert.equal(grammarForQuestion('past-events-3').id,'participles');
  assert.equal(grammarForQuestion('past-events-5').id,'past-negation');
  assert.equal(grammarForQuestion('past-movement-3').id,'etre-past');
});
test('library articles contain complete sections, useful tables and translated examples',()=>{
  for(const article of grammarArticles){
    assert.ok(grammarCategories.some(c=>c.id===article.category));
    assert.ok(article.title&&article.fr&&article.summary&&article.aliases.length&&article.sections.length>=3,article.id);
    for(const section of article.sections){
      assert.ok(section.title);assert.ok(section.paragraphs?.length||section.table);
      for(const p of section.paragraphs||[])assert.ok(p.trim().length>=10);
      for(const example of section.examples||[])assert.ok(example.length===2&&example.every(value=>value.trim()));
      if(section.table){assert.equal(section.table.headers.length,2);assert.ok(section.table.rows.length>=2);for(const row of section.table.rows)assert.ok(row.length===2&&row.every(value=>value.trim()));}
    }
  }
});
test('search finds infinitives, irregular forms, Korean meanings and accent-free queries',()=>{
  for(const [query,id] of [['vu','participles'],['voir','participles'],['과거분사','participles'],['갔었다','etre-past'],['ETRE','etre'],[' café ','articles'],['ne pas','negation'],['subjonctif','subjunctive'],['voudrais','requests']])assert.equal(searchGrammar(query)[0]?.id,id,query);
  assert.ok(searchGrammar('여성형').some(a=>a.id==='agreement'));
  assert.equal(searchGrammar('').length,67);assert.equal(searchGrammar('없는검색어').length,0);
  assert.equal(searchGrammar('lessonIds').length,0);assert.equal(searchGrammar('headers').length,0);
  assert.equal(searchGrammar('y')[0].id,'y');assert.equal(searchGrammar('en')[0].id,'en');
  assert.ok(searchGrammar('','tenses').every(a=>a.category==='tenses'));assert.ok(searchGrammar('vu','basics').every(a=>a.category==='basics'));
});

test('the reference outline includes all 35 independent additions in their declared category',()=>{
  assert.equal(extraGrammarArticles.length,35);
  for(const article of extraGrammarArticles){assert.ok(grammarArticles.includes(article));assert.deepEqual(article.lessonIds,[]);assert.ok(article.term);}
  for(const [category,ids] of Object.entries(grammarOutline))for(const id of ids)assert.equal(grammarById(id).category,category);
  for(const id of ['possessive-adjectives','pronominal-verbs','imperative','indirect-objects','pronoun-order','interrogatives','superlative','pluperfect','conditional-past','future-perfect','passive','reported-speech','gerund','present-participle','relative-dont-ou'])assert.ok(grammarById(id),id);
});

test('French terminology and Korean topic names find the same reference articles',()=>{
  for(const [query,id] of [['소유형용사','possessive-adjectives'],['adjectifs possessifs','possessive-adjectives'],['대명동사','pronominal-verbs'],['verbes pronominaux','pronominal-verbs'],['gérondif','gerund'],['GERONDIF','gerund'],['jerondif','gerund'],['subjuntif','subjunctive'],['plus-que-parfait','pluperfect'],['conditionnel passé','conditional-past'],['futur anterieur','future-perfect'],['lui','indirect-objects'],['lequel','relative-compound'],['la mienne','possessive-pronouns']])assert.equal(searchGrammar(query)[0]?.id,id,query);
});

test('grammar labels add the French term once and keep existing parentheses and HTML safe',()=>{
  const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const seen=new Set(),first=renderGrammarText('대명동사와 과거분사를 봐요. 과거분사는 형태가 달라져요.',escape,seen);
  assert.match(first,/\(verbe pronominal\)/);assert.equal((first.match(/participe passé/g)||[]).length,1);
  assert.equal(renderGrammarText('과거분사를 확인해요.',escape,seen),'과거분사를 확인해요.');
  assert.equal(renderGrammarText('소유형용사(adjectif possessif)',escape),'소유형용사(adjectif possessif)');
  assert.equal(renderGrammarText('접속법 과거',escape).match(/class="grammar-term"/g).length,1);
  assert.match(renderGrammarText('<img> 제롱디프',escape),/^&lt;img&gt;/);assert.match(renderGrammarText('제롱디프',escape),/gérondif/);
  assert.match(renderGrammarText('동명사',escape),/\(gérondif\)/);assert.doesNotMatch(renderGrammarText('동명사',escape),/\(nom\)/);
  assert.match(renderGrammarText('불규칙동사',escape),/\(verbe irrégulier\)/);
  assert.match(renderGrammarText('명사구',escape),/\(groupe nominal\)/);assert.match(renderGrammarText('무관사',escape),/\(absence d’article\)/);
  assert.match(renderGrammarText('-ons를 빼고 -ant를 붙여요.',escape),/class="grammar-affix" lang="fr">-ons<\/span>/);
});

test('new form tables preserve possessive agreement, reflexive exceptions and gerund forms',()=>{
  const tables=id=>grammarById(id).sections.filter(s=>s.table).flatMap(s=>s.table.rows);
  assert.deepEqual(tables('possessive-adjectives').map(row=>row[1]),['mon / ma / mes','ton / ta / tes','son / sa / ses','notre / notre / nos','votre / votre / vos','leur / leur / leurs']);
  assert.ok(JSON.stringify(grammarById('possessive-adjectives')).includes('mon amie'));
  const reflexive=tables('pronominal-verbs').map(row=>row[0]);for(const value of ['Elles se sont lavées.','Elles se sont lavé les mains.','Elles se sont parlé.'])assert.ok(reflexive.includes(value));
  assert.deepEqual(tables('gerund').map(row=>row[1]),['en parlant','en finissant','en faisant','en mangeant','en prenant','en allant']);
  assert.match(JSON.stringify(grammarById('gerund')),/être → étant, avoir → ayant, savoir → sachant/);
  assert.match(JSON.stringify(grammarById('pronoun-order')),/Donne-le-moi/);assert.match(JSON.stringify(grammarById('pronoun-order')),/Ne me le donne pas/);
});

test('expanded library preserves existing counts while new articles start at zero',()=>{
  const storage=memory();storage.setItem(GRAMMAR_KEY,JSON.stringify({version:1,counts:{participles:7,subjunctive:3},seen:[{id:'participles',context:'p:old:q3'}]}));
  const store=createGrammarStore(storage);assert.equal(store.count('participles'),7);assert.equal(store.count('gerund'),0);
  assert.equal(store.open('participles','p:old:q3'),7);assert.equal(store.open('gerund'),1);assert.equal(store.count('subjunctive'),3);
});
test('personal counts share one record and deduplicate a question across reloads',()=>{
  const storage=memory(),first=createGrammarStore(storage);
  assert.equal(first.open('participles','p:run1:q3'),1);assert.equal(first.open('participles','p:run1:q3'),1);
  const reloaded=createGrammarStore(storage);assert.equal(reloaded.count('participles'),1);assert.equal(reloaded.open('participles','p:run1:q3'),1);
  assert.equal(reloaded.open('participles','p:run2:q3'),2);assert.equal(reloaded.open('participles'),3);assert.equal(reloaded.open('participles'),4);
  assert.equal(first.open('participles'),5,'a second tab reads the latest saved count');
  assert.equal(first.count('etre'),0);assert.equal(first.open('missing'),0);
});
test('malformed or future records do not leak invalid counts or contexts',()=>{
  for(const value of ['{','null','[]','{"version":2}'])assert.deepEqual(parseGrammar(value),{version:1,counts:{},seen:[]});
  const state=parseGrammar(JSON.stringify({version:1,counts:{etre:4,avoir:-2,aller:2.5,missing:99},seen:[null,{}, {id:'missing',context:'a'},{id:'etre',context:'a'}]}));
  assert.deepEqual(state.counts,{etre:4});assert.deepEqual(state.seen,[{id:'etre',context:'a'}]);
});
test('unavailable storage retains visit counts and reports failure only once',()=>{
  let failures=0;const store=createGrammarStore({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},()=>failures++);
  assert.equal(store.open('etre','q1'),1);assert.equal(store.open('etre','q1'),1);assert.equal(store.open('etre'),2);assert.equal(failures,1);
  store.reset();assert.equal(store.count('etre'),0);
});
test('dedup history is bounded and resetting removes both counts and history',()=>{
  const storage=memory(),store=createGrammarStore(storage);
  for(let i=0;i<520;i++)store.open('etre','p:run:'+i);
  assert.equal(store.count('etre'),520);assert.equal(JSON.parse(storage.getItem(GRAMMAR_KEY)).seen.length,512);
  store.reset();assert.deepEqual(JSON.parse(storage.getItem(GRAMMAR_KEY)),{version:1,counts:{},seen:[]});assert.equal(store.open('etre','p:run:519'),1);
});
