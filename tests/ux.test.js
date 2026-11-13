import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {phrases} from '../dist/data.js';
import {readState, STORAGE_KEY} from '../dist/core.js';

let counter=0;
async function setup(){
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const dom=new JSDOM(html,{url:'https://sidebatch.github.io/french-alone/',pretendToBeVisual:true});
  Object.assign(globalThis,{window:dom.window,document:dom.window.document,location:dom.window.location});
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  dom.window.scrollTo=()=>{};
  const errors=[];
  dom.window.addEventListener('error',e=>errors.push(e.error));
  await import('../dist/app.js?ux-test='+(++counter));
  const $=s=>document.querySelector(s);
  const click=s=>{const el=typeof s==='string'?$(s):s;assert.ok(el,'Missing '+s);assert.equal(el.disabled,false);el.click();};
  const nav=hash=>{dom.window.history.replaceState({},'','#'+hash);dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));};
  const saved=()=>JSON.parse(dom.window.localStorage.getItem(STORAGE_KEY));
  return {dom,$,click,nav,saved,errors};
}

test('legacy progress migrates safely with feedback enabled by default',()=>{
  const original={version:1,completed:['greetings'],mastered:[],favorites:[],mistakes:[],activity:{},slow:true};
  const storage={getItem:()=>JSON.stringify(original)};
  const state=readState(storage);
  assert.deepEqual(state.completed,['greetings']);
  assert.equal(state.slow,true);
  assert.equal(state.effects,true);
  assert.deepEqual(state.lessonProgress,{});
});

test('basic lesson visually tracks progress and reopens a checked quiz answer',async()=>{
  const f=await setup();
  f.nav('lessons');f.click('[data-action="lesson-view"][data-value="basics"]');
  assert.equal(document.querySelectorAll('.lesson-card.status-not-started').length,12);
  assert.match(f.$('.lesson-status-key').textContent,/시작 전 12/);
  f.click('.lesson-card[data-id="greetings"]');
  f.click('[data-action="next-learn"]');
  f.click('#study-dialog [data-action="close"]');
  assert.equal(f.saved().lessonProgress.greetings.index,1);
  assert.ok(f.$('.lesson-card[data-id="greetings"].status-in-progress'));
  assert.match(f.$('.lesson-status-key').textContent,/진행 중 1/);
  f.click('.lesson-card[data-id="greetings"]');
  assert.match(f.$('#study-dialog .dialog-step').textContent,/2 \/ 6/);
  for(let i=0;i<5;i++)f.click('[data-action="next-learn"]');
  const q=phrases.find(p=>p.fr===f.$('.big-french').textContent);
  const wrong=[...document.querySelectorAll('[data-action="answer"]')].find(b=>b.dataset.id!==q.id);
  f.click(wrong);
  assert.ok(f.$('.answer-reveal.is-wrong'));
  assert.match(f.$('.answer-reveal').textContent,/왜/);
  f.click('#study-dialog [data-action="close"]');
  assert.equal(f.saved().lessonProgress.greetings.phase,'quiz');
  f.nav('lessons');f.click('.lesson-card[data-id="greetings"]');
  assert.ok(f.$('.answer-reveal.is-wrong'));
  f.click('[data-action="next-question"]');
  for(let i=1;i<6;i++){
    const item=phrases.find(p=>p.fr===f.$('.big-french').textContent);
    f.click('[data-action="answer"][data-id="'+item.id+'"]');
    assert.ok(f.$('.answer-reveal.is-correct'));
    f.click('[data-action="next-question"]');
  }
  assert.ok(f.$('.mistake-summary'));
  assert.ok(f.$('[data-action="review-mistakes"]'));
  assert.equal(f.saved().lessonProgress.greetings,undefined);
  f.click('[data-action="review-mistakes"]');
  assert.match(f.$('#dialog-content').textContent,/한마디 복습/);
  f.click('#study-dialog [data-action="close"]');
  f.nav('lessons');
  assert.ok(f.$('.lesson-card[data-id="greetings"].status-complete'));
  assert.equal(f.errors.length,0);
});

test('detail dialog, sound setting and focused typing errors are usable',async()=>{
  const f=await setup();
  f.nav('vocabulary');
  f.click('[data-action="phrase-detail"]');
  assert.equal(f.$('#study-dialog').dataset.view,'phrase');
  assert.match(f.$('#dialog-content').textContent,/용법/);
  f.click('#study-dialog [data-action="close"]');
  f.click('.header-settings');
  assert.match(f.$('#dialog-content').textContent,/v1.9.0/);
  assert.match(f.$('#dialog-content').textContent,/sidebatch/);
  const sounds=f.$('#feedback-sounds');
  sounds.checked=false;
  sounds.dispatchEvent(new f.dom.window.Event('change',{bubbles:true}));
  assert.equal(f.saved().effects,false);
  assert.equal(f.$('#effects-volume').disabled,true);
  assert.ok([...document.querySelectorAll('[data-action="preview-feedback"]')].every(b=>b.disabled));
  sounds.checked=true;sounds.dispatchEvent(new f.dom.window.Event('change',{bubbles:true}));
  const volume=f.$('#effects-volume');volume.value='45';volume.dispatchEvent(new f.dom.window.Event('input',{bubbles:true}));
  assert.equal(f.saved().effectsVolume,45);
  assert.equal(f.$('#effects-volume-value').textContent,'45%');
  volume.value='0';volume.dispatchEvent(new f.dom.window.Event('input',{bubbles:true}));
  assert.ok([...document.querySelectorAll('[data-action="preview-feedback"]')].every(b=>b.disabled));
  f.click('#study-dialog [data-action="close"]');
  f.click('.header-settings');assert.equal(f.$('#effects-volume').value,'0');
  f.click('#study-dialog [data-action="close"]');
  f.nav('home');
  f.click('.hero [data-action="practice-daily"]');
  f.click('[data-action="practice-choice"][data-value="veux"]');
  f.click('[data-action="practice-next"]');
  const field=f.$('#practice-input');assert.ok(field);
  field.focus();
  assert.ok(f.$('#study-dialog').classList.contains('typing-focused'));
  field.value='veuz';
  field.dispatchEvent(new f.dom.window.Event('input',{bubbles:true}));
  f.$('#practice-form').dispatchEvent(new f.dom.window.Event('submit',{bubbles:true,cancelable:true}));
  assert.ok(f.$('.answer-attempt .needs-work'));
  assert.equal(f.errors.length,0);
  f.click('#study-dialog [data-action="close"]');
  assert.match(f.$('.app-version-footer').textContent,/© 2026 sidebatch/);
});

test('a failed lesson stays in progress and restarts its quiz, not the intro',async()=>{
  const f=await setup();f.nav('lessons');f.click('[data-action="lesson-view"][data-value="basics"]');f.click('.lesson-card[data-id="greetings"]');
  for(let i=0;i<6;i++)f.click('[data-action="next-learn"]');
  for(let i=0;i<6;i++){
    const q=phrases.find(p=>p.fr===f.$('.big-french').textContent);
    const wrong=[...document.querySelectorAll('[data-action="answer"]')].find(b=>b.dataset.id!==q.id);
    f.click(wrong);f.click('[data-action="next-question"]');
  }
  assert.match(f.$('#dialog-content').textContent,/다시 도전/);
  assert.equal(f.saved().lessonProgress.greetings.phase,'quiz');
  f.click('#study-dialog [data-action="close"]');f.nav('lessons');
  assert.ok(f.$('.lesson-card[data-id="greetings"].status-in-progress'));
  f.click('.lesson-card[data-id="greetings"]');
  assert.match(f.$('#dialog-content').textContent,/한마디 퀴즈/);
  assert.equal(f.errors.length,0);
});
