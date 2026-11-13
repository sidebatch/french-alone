import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { today, STORAGE_KEY } from '../dist/core.js';
import { practicePacks, questionById } from '../dist/practice-data.js';
import { PRACTICE_KEY, PRACTICE_DRAFT_KEY, freshPractice, recordPractice, addDays, supportTiles } from '../dist/practice-core.js';

let fixtureNumber=0;
async function setup(initialPractice,initialDrafts) {
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const dom=new JSDOM(html,{url:'https://sidebatch.github.io/french-alone/',pretendToBeVisual:true,runScripts:'outside-only'});
  Object.assign(globalThis,{window:dom.window,document:dom.window.document,location:dom.window.location});
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  dom.window.scrollTo=()=>{};
  if(initialPractice)dom.window.localStorage.setItem(PRACTICE_KEY,JSON.stringify(initialPractice));
  if(initialDrafts)dom.window.localStorage.setItem(PRACTICE_DRAFT_KEY,JSON.stringify(initialDrafts));
  const errors=[];dom.window.addEventListener('error',event=>errors.push(event.error));
  await import(`../dist/app.js?practice-test=${++fixtureNumber}`);
  const $=selector=>document.querySelector(selector);
  const click=selector=>{const button=typeof selector==='string'?$(selector):selector;assert.ok(button,`Missing ${selector}`);assert.ok(!button.disabled,`Disabled ${selector}`);button.click();};
  const type=value=>{const input=$('#practice-input');assert.ok(input);input.value=value;input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));$('#practice-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));};
  const choose=value=>click([...document.querySelectorAll('[data-action="practice-choice"]')].find(b=>b.dataset.value===value));
  const pick=value=>click([...document.querySelectorAll('.tile-pool [data-action="practice-pick"]')].find(b=>b.textContent===value&&!b.disabled));
  const current=()=>questionById($('.practice-body[data-practice-question]')?.dataset.practiceQuestion);
  const answer=()=>{const q=current();assert.ok(q);if($('#practice-input'))type(q.answer);else if($('[data-action="practice-choice"]'))choose(q.answer);else {(q.kind==='order'?q.tiles:supportTiles(q).tiles).forEach(pick);click('[data-action="practice-check"]');}assert.ok($('[data-action="practice-next"]'));click('[data-action="practice-next"]');};
  const nav=route=>{dom.window.history.replaceState({},'','#'+route);dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));};
  const course=id=>{nav('lessons');const level=practicePacks.find(p=>p.id===id).level;click('[data-action="practice-level"][data-value="'+level+'"]');click('.practice-pack[data-id="'+id+'"]');};
  return {dom,$,click,type,choose,pick,current,answer,nav,course,errors,saved:()=>JSON.parse(dom.window.localStorage.getItem(PRACTICE_KEY))};
}

test('short rounds retain the input, resume assisted tiles and retry only the difficult question',async()=>{
  const f=await setup();f.click('[data-action="practice-daily"]');f.answer();
  const input=f.$('#practice-input');f.type('veu');assert.equal(f.$('#practice-input'),input);
  assert.equal(f.$('#practice-explanation').hidden,true);
  f.type('vex');assert.equal(f.$('#practice-input'),null);f.pick('v');
  f.click('#study-dialog [data-action="close"]');
  const drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));
  const restored=await setup(undefined,drafts);restored.click('[data-action="practice-resume"]');
  assert.equal(restored.current().id,'want-2');assert.equal(restored.$('.tile-answer .word-tile').textContent,'v');
  for(const letter of ['e','u','x'])restored.pick(letter);
  restored.click('[data-action="practice-check"]');restored.click('[data-action="practice-next"]');
  while(restored.current())restored.answer();
  assert.equal(restored.saved().runs[0].independent,1);
  restored.click('[data-action="practice-retry"]');assert.equal(restored.current().id,'want-2');
  assert.ok(restored.$('#practice-input'));restored.answer();
  assert.equal(restored.saved().runs[1].total,1);assert.equal(restored.saved().runs[1].independent,1);
  assert.match(restored.$('.result-growth').textContent,/막혔던 1개/);
  restored.click('[data-action="practice-more"]');assert.equal(restored.current().id,'want-6');
  assert.equal(restored.errors.length,0);
});

test('three-question round stamps once, updates partial-course filters and survives reload',async()=>{
  const f=await setup();f.click('[data-action="practice-light"]');while(f.current())f.answer();
  assert.equal(f.saved().runs[0].total,3);f.click('[data-action="practice-close"]');
  assert.ok(f.$('.lou-room.has-plant'));assert.equal(f.$('.lou-room.has-books'),null);
  f.nav('lessons');f.click('[data-action="practice-status"][data-value="active"]');
  assert.equal(document.querySelectorAll('.practice-pack').length,1);
  assert.equal(f.$('.practice-pack').dataset.id,'want');assert.match(f.$('.practice-pack').textContent,/학습 중/);
  const restored=await setup(f.saved());assert.ok(restored.$('.lou-room.has-plant'));
  restored.click('[data-action="practice-light"]');assert.equal(restored.current().id,'want-4');
  while(restored.current())restored.answer();restored.click('[data-action="practice-close"]');
  assert.equal(restored.$('.lou-room.has-books'),null);assert.equal(restored.saved().days[today()].rounds,2);
});

test('promoted review formats and revealed answers remain honest after a quick-round reload',async()=>{
  const initial=freshPractice(),pack=practicePacks[0];
  recordPractice(initial,pack.questions.map(q=>({id:q.id,correct:true,independent:false})),{packId:pack.id,date:addDays(today(),-1)});
  const f=await setup(initial);f.click('[data-action="practice-daily"]');assert.ok(f.$('#practice-input'));
  f.type('wrong');f.click('[data-action="practice-hint"]');
  assert.equal(f.$('#practice-input').value,'veux');f.click('#study-dialog [data-action="close"]');
  const drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));
  const restored=await setup(initial,drafts);restored.click('[data-action="practice-resume"]');
  assert.ok(restored.$('[data-action="practice-next"]'));assert.equal(restored.$('.practice-model'),null);
  restored.click('[data-action="practice-next"]');while(restored.current())restored.answer();
  const result=restored.saved().runs.at(-1);assert.equal(result.total,5);assert.equal(result.correct,4);
  assert.equal(result.independent,3);assert.equal(restored.saved().cards['want-1'].strength,0);
});

test('level switching keeps both short-round drafts and resumes the chosen level after reload',async()=>{
  const f=await setup();f.click('[data-action="practice-daily"]');f.answer();
  f.$('#practice-input').value='ve';f.$('#practice-input').dispatchEvent(new f.dom.window.Event('input',{bubbles:true}));f.click('#study-dialog [data-action="close"]');
  f.click('[data-action="practice-level"][data-value="intermediate"]');assert.equal(f.$('[data-action="practice-resume"]'),null);
  f.click('[data-action="practice-daily"]');assert.equal(f.current().id,'past-events-1');f.answer();
  f.$('#practice-input').value='regard';f.$('#practice-input').dispatchEvent(new f.dom.window.Event('input',{bubbles:true}));f.click('#study-dialog [data-action="close"]');
  f.click('[data-action="practice-level"][data-value="beginner"]');f.click('[data-action="practice-resume"]');assert.equal(f.$('#practice-input').value,'ve');f.click('#study-dialog [data-action="close"]');
  f.click('[data-action="practice-level"][data-value="intermediate"]');
  const drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));const restored=await setup(f.saved(),drafts);
  assert.equal(restored.$('[data-action="practice-level"][data-value="intermediate"]').getAttribute('aria-pressed'),'true');
  restored.click('[data-action="practice-resume"]');assert.equal(restored.$('#practice-input').value,'regard');while(restored.current())restored.answer();
  assert.equal(restored.saved().runs.at(-1).packId,'daily-intermediate');restored.click('[data-action="practice-more"]');assert.equal(restored.current().id,'past-events-6');
});

test('intermediate courses and review are available without finishing beginner courses',async()=>{
  const initial=freshPractice();initial.level='intermediate';
  for(const id of ['want','past-events'])recordPractice(initial,practicePacks.find(p=>p.id===id).questions.map(q=>({id:q.id,correct:true,independent:false})),{packId:id,date:addDays(today(),-1)});
  const f=await setup(initial);f.nav('lessons');assert.equal(document.querySelectorAll('.practice-pack').length,12);
  assert.match(f.$('.practice-due').textContent,/10개/);f.click('[data-action="practice-due"]');assert.equal(f.current().id,'past-events-1');assert.ok(f.$('#practice-input'));
  while(f.current())f.answer();assert.equal(f.saved().runs.at(-1).packId,'review-intermediate');assert.equal(f.saved().runs.at(-1).transfer,false);
});

test('intermediate mistakes retry as typing and retain the chosen level',async()=>{
  const f=await setup();f.click('[data-action="practice-level"][data-value="intermediate"]');f.click('[data-action="practice-light"]');f.answer();
  f.type('regarde');f.type('regardé');f.click('[data-action="practice-next"]');f.answer();
  f.click('[data-action="practice-retry"]');assert.equal(f.current().id,'past-events-2');assert.ok(f.$('#practice-input'));f.answer();
  assert.equal(f.saved().runs.at(-1).packId,'retry-intermediate');assert.equal(f.saved().level,'intermediate');assert.match(f.$('.result-growth').textContent,/혼자/);
});

test('accent keys insert at the cursor, preserve the draft and do not spend a hint',async()=>{
  const f=await setup();f.course('want');f.answer();
  assert.equal(f.$('[form="practice-form"]').disabled,true);
  const input=f.$('#practice-input');input.value='caf';input.dispatchEvent(new f.dom.window.Event('input',{bubbles:true}));input.setSelectionRange(3,3);
  f.click('[data-action="practice-accents"]');assert.equal(f.$('#accent-keys').hidden,false);
  f.click('[data-action="practice-accent"][data-value="é"]');assert.equal(input.value,'café');assert.equal(input.selectionStart,4);
  input.setSelectionRange(1,2);f.click('[data-action="practice-accent"][data-value="à"]');assert.equal(input.value,'càfé');
  const drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));assert.equal(drafts.sessions.want.current.hints,0);
  const restored=await setup(undefined,drafts);restored.click('.hero [data-action="practice-resume"]');assert.equal(restored.$('#practice-input').value,'càfé');
});
test('IME composition cannot accidentally grade an unfinished answer',async()=>{
  const f=await setup();f.course('want');f.answer();
  f.$('#practice-input').dispatchEvent(new f.dom.window.Event('compositionstart',{bubbles:true}));f.type('veux');
  assert.equal(f.$('[data-action="practice-next"]'),null);assert.equal(f.$('.answer-attempt'),null);
  f.$('#practice-input').dispatchEvent(new f.dom.window.Event('compositionend',{bubbles:true}));f.type('veux');assert.ok(f.$('[data-action="practice-next"]'));
});
test('course filters and compact home keep unfinished courses accessible',async()=>{
  const f=await setup();assert.equal(document.querySelectorAll('.practice-pack').length,0);assert.ok(f.$('[data-action="practice-daily"]'));
  f.dom.window.history.replaceState({},'','#lessons');f.dom.window.dispatchEvent(new f.dom.window.HashChangeEvent('hashchange'));
  assert.equal(document.querySelectorAll('.practice-pack').length,9);
  f.click('[data-action="practice-unit"][data-value="outside"]');assert.equal(document.querySelectorAll('.practice-pack').length,3);
  f.click('[data-action="practice-status"][data-value="active"]');assert.ok(f.$('.course-empty'));
  f.click('[data-action="practice-filter-reset"]');f.click('.practice-pack[data-id="go"]');
  for(let i=0;i<3;i++)f.answer();f.pick('Je');f.pick('vais');f.click('[data-action="practice-clear"]');
  assert.equal(document.querySelectorAll('.tile-answer .word-tile').length,0);assert.equal(f.$('[data-action="practice-check"]').disabled,true);
  f.click('#study-dialog [data-action="close"]');f.click('[data-action="practice-status"][data-value="active"]');
  assert.equal(document.querySelectorAll('.practice-pack').length,1);assert.equal(f.$('.practice-pack').dataset.id,'go');
  f.click('[data-action="lesson-view"][data-value="basics"]');
  f.dom.window.history.replaceState({},'','#home');f.dom.window.dispatchEvent(new f.dom.window.HashChangeEvent('hashchange'));
  f.click('[data-action="open-practice"]');
  f.dom.window.history.replaceState({},'','#lessons');f.dom.window.dispatchEvent(new f.dom.window.HashChangeEvent('hashchange'));
  assert.equal(f.$('[data-action="lesson-view"][data-value="practice"]').getAttribute('aria-pressed'),'true');
  assert.equal(f.errors.length,0);
});
test('missing words, grammar guidance and assisted recap survive a paused session',async()=>{
  const f=await setup();f.course('want');for(let i=0;i<8;i++)f.answer();
  f.type('Je veux ici');assert.equal(f.$('.attempt-word.missing').textContent,'빠진 단어');
  f.type('Je veux rester ici');assert.equal(f.$('#practice-explanation').hidden,true);f.click('[data-action="practice-why"]');assert.equal(f.$('#practice-explanation').hidden,false);assert.match(f.$('.grammar-guide').textContent,/Je voudrais/);
  f.click('[data-action="practice-next"]');f.click('#study-dialog [data-action="close"]');
  const drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));
  const restored=await setup(undefined,drafts);restored.click('.hero [data-action="practice-resume"]');restored.answer();
  assert.match(restored.$('.practice-recap').textContent,/다시 볼 표현 1개/);assert.match(restored.$('.practice-recap').textContent,/Je veux rester ici/);
});
test('a round handles wrong answers, hints, tile undo, independent transfer, continuation and reset',async()=>{
  const f=await setup();const {$,click,type,choose,pick,current,answer,saved}=f;
  assert.equal(document.querySelectorAll('.practice-pack').length,0);
  f.course('want');assert.equal(current().id,'want-1');assert.match($('.practice-model').textContent,/Je veux dormir/);
  choose('peux');assert.equal($('[data-action="practice-next"]'),null);assert.ok($('.feedback-strip.retry'));assert.match($('.feedback-message').textContent,/v/);
  choose('veux');assert.ok($('.feedback-strip.success'));click('[data-action="practice-next"]');
  click('[data-action="practice-hint"]');type('veux');click('[data-action="practice-next"]');
  type('dormi');assert.equal($('[data-action="practice-next"]'),null);type('Je veux dormir.');click('[data-action="practice-next"]');
  pick('Je');click('[data-action="practice-unpick"]');assert.equal(document.querySelectorAll('.tile-answer .word-tile').length,0);
  answer();
  while(current())answer();
  assert.match($('.practice-completion .dialog-title').textContent,/한 판 해냈어요/);
  assert.equal(document.activeElement,$('.practice-completion .dialog-title'));
  assert.match($('.completion-reward').textContent,/\+70 XP/);
  assert.match($('.result-stats').textContent,/10 \/ 10/);
  assert.equal(saved().runs.length,1);assert.equal(saved().runs[0].independent,4);assert.equal(saved().runs[0].xp,70);assert.equal(saved().runs[0].transfer,true);
  assert.equal(saved().cards['want-2'].strength,0);assert.equal(saved().cards['want-10'].strength,1);
  const baseline=JSON.parse(f.dom.window.localStorage.getItem(STORAGE_KEY));assert.equal(Object.values(baseline.activity)[0].xp,70);assert.equal(Object.values(baseline.activity)[0].words,2);
  click('[data-action="practice-close"]');f.nav('home');assert.ok($('.stamp-label.is-done'));click('[data-action="practice-daily"]');assert.equal(current().id,'can-1');click('#study-dialog [data-action="close"]');assert.equal(saved().runs.length,1);
  assert.equal($('#study-dialog').open,false);assert.ok($('.lou-room.has-plant'));
  click('[data-action="settings"]');click('[data-action="reset-confirm"]');click('[data-action="reset"]');assert.deepEqual(saved().cards,{});assert.deepEqual(saved().runs,[]);assert.equal(f.errors.length,0);
});

test('all twenty-one authored rounds preserve independent scores and rewards on reload',async()=>{
  const f=await setup();
  for(const pack of practicePacks){
    f.course(pack.id);
    while(f.current())f.answer();
    assert.equal(f.saved().runs.at(-1).independent,6);assert.equal(f.saved().runs.at(-1).transfer,true);f.click('[data-action="practice-close"]');
  }
  assert.equal(f.saved().runs.length,21);
  const restored=await setup(f.saved());assert.ok(restored.$('.hero [data-action="practice-daily"]'));
  restored.course('want');while(restored.current())restored.answer();
  assert.equal(restored.$('.completion-reward').textContent,'0 XP');
  assert.equal(restored.saved().runs.at(-1).xp,0);assert.equal(restored.saved().runs.at(-1).transfer,false);assert.equal(restored.errors.length,0);
});

test('revealing an answer never counts as independent and due review removes the original model and choices',async()=>{
  const initial=freshPractice(),pack=practicePacks[0];
  recordPractice(initial,pack.questions.map(q=>({id:q.id,correct:true,independent:false})),{packId:pack.id,date:addDays(today(),-1)});
  const f=await setup(initial);f.nav('lessons');f.click('[data-action="practice-due"]');assert.equal(f.$('.practice-model'),null);assert.equal(f.$('[data-action="practice-choice"]'),null);assert.ok(f.$('#practice-input'));
  f.click('[data-action="practice-hint"]');f.click('[data-action="practice-hint"]');assert.ok(f.$('[data-action="practice-next"]'));f.click('[data-action="practice-next"]');
  while(f.current())f.answer();
  const result=f.saved().runs.at(-1);assert.equal(result.packId,'review');assert.equal(result.independent,4);assert.equal(result.correct,4);assert.equal(result.transfer,false);assert.equal(f.errors.length,0);
});

test('closing and reopening the app restores typed text, hints and score exactly once',async()=>{
  const f=await setup();f.course('want');f.answer();
  f.click('[data-action="practice-hint"]');
  const input=f.$('#practice-input');input.value='veu';input.dispatchEvent(new f.dom.window.Event('input',{bubbles:true}));
  f.click('#study-dialog [data-action="close"]');
  f.nav('home');assert.ok(f.$('.hero [data-action="practice-resume"]'));
  const drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));
  assert.equal(drafts.sessions.want.index,1);assert.equal(drafts.sessions.want.current.hints,1);
  const restored=await setup(undefined,drafts);restored.click('.hero [data-action="practice-resume"]');
  assert.equal(restored.current().id,'want-2');assert.equal(restored.$('#practice-input').value,'veu');assert.match(restored.$('.feedback-message').textContent,/v/);
  restored.type('veux');restored.click('[data-action="practice-next"]');while(restored.current())restored.answer();
  assert.equal(restored.saved().runs.length,1);assert.equal(restored.saved().runs[0].independent,5);
  assert.equal(JSON.parse(restored.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY)).sessions.want,undefined);
  restored.click('[data-action="practice-close"]');assert.equal(restored.$('.hero [data-action="practice-resume"]'),null);
});

test('different course drafts do not overwrite each other and reset clears all paused work',async()=>{
  const f=await setup();
  for(const id of ['want','can']){f.course(id);f.answer();f.click('#study-dialog [data-action="close"]');}
  let drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));assert.equal(drafts.sessions.want.index,1);assert.equal(drafts.sessions.can.index,1);
  f.click('.practice-pack[data-id="want"]');assert.equal(f.current().id,'want-2');f.click('#study-dialog [data-action="close"]');
  f.click('.header-settings');assert.equal(f.$('#study-dialog').dataset.view,'settings');f.click('[data-action="reset-confirm"]');f.click('[data-action="reset"]');
  drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));assert.deepEqual(drafts.sessions,{});assert.equal(f.errors.length,0);
});

test('a partially arranged sentence resumes with its original tile order and selection',async()=>{
  const f=await setup();f.course('want');for(let i=0;i<3;i++)f.answer();
  assert.equal(f.current().id,'want-4');f.pick('Je');f.pick('veux');f.click('#study-dialog [data-action="close"]');
  const drafts=JSON.parse(f.dom.window.localStorage.getItem(PRACTICE_DRAFT_KEY));
  const restored=await setup(undefined,drafts);restored.click('.hero [data-action="practice-resume"]');
  assert.equal(restored.current().id,'want-4');assert.equal(restored.$('.tile-answer').querySelectorAll('.word-tile').length,2);
  restored.pick('rester');restored.pick('ici');restored.click('[data-action="practice-check"]');restored.click('[data-action="practice-next"]');
  assert.equal(restored.current().id,'want-5');assert.equal(restored.errors.length,0);
});

test('settings open installation help through the existing PWA controls',async()=>{
  const f=await setup();assert.ok(f.dom.window.document.documentElement.classList.contains('app-ready'));
  f.dom.window.eval(await readFile(new URL('../dist/pwa.js',import.meta.url),'utf8'));
  f.click('.header-settings');f.click('[data-action="install-help"]');
  assert.equal(f.$('#study-dialog').open,false);assert.equal(f.$('#install-dialog').open,true);
  f.$('#pwa-close').click();assert.equal(f.$('#install-dialog').open,false);f.dom.window.close();
});
