import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { today, STORAGE_KEY } from '../dist/core.js';
import { practicePacks, questionById } from '../dist/practice-data.js';
import { PRACTICE_KEY, freshPractice, recordPractice, addDays } from '../dist/practice-core.js';

let fixtureNumber=0;
async function setup(initialPractice) {
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const dom=new JSDOM(html,{url:'https://sidebatch.github.io/french-alone/',pretendToBeVisual:true});
  Object.assign(globalThis,{window:dom.window,document:dom.window.document,location:dom.window.location});
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  dom.window.scrollTo=()=>{};
  if(initialPractice)dom.window.localStorage.setItem(PRACTICE_KEY,JSON.stringify(initialPractice));
  const errors=[];dom.window.addEventListener('error',event=>errors.push(event.error));
  await import(`../dist/app.js?practice-test=${++fixtureNumber}`);
  const $=selector=>document.querySelector(selector);
  const click=selector=>{const button=typeof selector==='string'?$(selector):selector;assert.ok(button,`Missing ${selector}`);assert.ok(!button.disabled,`Disabled ${selector}`);button.click();};
  const type=value=>{const input=$('#practice-input');assert.ok(input);input.value=value;input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));$('#practice-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));};
  const choose=value=>click([...document.querySelectorAll('[data-action="practice-choice"]')].find(b=>b.dataset.value===value));
  const pick=value=>click([...document.querySelectorAll('.tile-pool [data-action="practice-pick"]')].find(b=>b.textContent===value&&!b.disabled));
  const current=()=>questionById($('.practice-body[data-practice-question]')?.dataset.practiceQuestion);
  const answer=()=>{const q=current();assert.ok(q);if($('#practice-input'))type(q.answer);else if(q.kind==='choice')choose(q.answer);else {q.tiles.forEach(pick);click('[data-action="practice-check"]');}assert.ok($('[data-action="practice-next"]'));click('[data-action="practice-next"]');};
  return {dom,$,click,type,choose,pick,current,answer,errors,saved:()=>JSON.parse(dom.window.localStorage.getItem(PRACTICE_KEY))};
}

test('a round handles wrong answers, hints, tile undo, independent transfer, continuation and reset',async()=>{
  const f=await setup();const {$,click,type,choose,pick,current,answer,saved}=f;
  assert.equal(document.querySelectorAll('.practice-pack').length,3);
  click('.hero [data-action="practice-start"]');assert.equal(current().id,'want-1');assert.match($('.practice-model').textContent,/Je veux dormir/);
  choose('peux');assert.equal($('[data-action="practice-next"]'),null);assert.ok($('.practice-hint'));
  choose('veux');click('[data-action="practice-next"]');
  click('[data-action="practice-hint"]');type('veux');click('[data-action="practice-next"]');
  type('dormi');assert.equal($('[data-action="practice-next"]'),null);type('Je veux dormir.');click('[data-action="practice-next"]');
  pick('Je');click('[data-action="practice-unpick"]');assert.equal(document.querySelectorAll('.tile-answer .word-tile').length,0);
  answer();
  while(current())answer();
  assert.match($('.result-stats').textContent,/4 \/ 6/);assert.match($('.practice-takeaway').textContent,/Je veux continuer/);
  assert.equal(saved().runs.length,1);assert.equal(saved().runs[0].independent,4);assert.equal(saved().runs[0].xp,70);assert.equal(saved().runs[0].transfer,true);
  assert.equal(saved().cards['want-2'].strength,0);assert.equal(saved().cards['want-10'].strength,1);
  const baseline=JSON.parse(f.dom.window.localStorage.getItem(STORAGE_KEY));assert.equal(Object.values(baseline.activity)[0].xp,70);assert.equal(Object.values(baseline.activity)[0].words,4);
  click('[data-action="practice-more"]');assert.equal(current().id,'can-1');click('#study-dialog [data-action="close"]');assert.equal(saved().runs.length,1);
  assert.equal($('#study-dialog').open,false);
  click('[data-action="settings"]');click('[data-action="reset-confirm"]');click('[data-action="reset"]');assert.deepEqual(saved().cards,{});assert.deepEqual(saved().runs,[]);assert.equal(f.errors.length,0);
});

test('all three authored rounds can be completed using apostrophes and preserve independent scores on reload',async()=>{
  const f=await setup();
  for(const pack of practicePacks){
    f.click(`.practice-pack[data-id="${pack.id}"]`);
    while(f.current())f.answer();
    assert.equal(f.saved().runs.at(-1).independent,6);assert.equal(f.saved().runs.at(-1).transfer,true);f.click('[data-action="practice-close"]');
  }
  assert.equal(f.saved().runs.length,3);
  const restored=await setup(f.saved());assert.equal(restored.$('.hero [data-action="practice-start"]').dataset.id,'want');
  restored.click('.practice-pack[data-id="want"]');while(restored.current())restored.answer();
  assert.equal(restored.saved().runs.at(-1).xp,0);assert.equal(restored.saved().runs.at(-1).transfer,false);assert.equal(restored.errors.length,0);
});

test('revealing an answer never counts as independent and due review removes the original model and choices',async()=>{
  const initial=freshPractice(),pack=practicePacks[0];
  recordPractice(initial,pack.questions.map(q=>({id:q.id,correct:true,independent:false})),{packId:pack.id,date:addDays(today(),-1)});
  const f=await setup(initial);f.click('[data-action="practice-due"]');assert.equal(f.$('.practice-model'),null);assert.equal(f.$('[data-action="practice-choice"]'),null);assert.ok(f.$('#practice-input'));
  f.click('[data-action="practice-hint"]');f.click('[data-action="practice-hint"]');assert.ok(f.$('[data-action="practice-next"]'));f.click('[data-action="practice-next"]');
  while(f.current())f.answer();
  const result=f.saved().runs.at(-1);assert.equal(result.packId,'review');assert.equal(result.independent,9);assert.equal(result.correct,9);assert.equal(result.transfer,false);assert.equal(f.errors.length,0);
});
