import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {phrases} from '../dist/data.js';
import {STORAGE_KEY} from '../dist/core.js';

test('learner can finish a quiz, save progress, search, review mistakes, and reset',async()=>{
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const dom=new JSDOM(html,{url:'https://bonjour.test/',pretendToBeVisual:true});
  Object.assign(globalThis,{window:dom.window,document:dom.window.document,location:dom.window.location});
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  dom.window.scrollTo=()=>{};
  const errors=[];dom.window.addEventListener('error',e=>errors.push(e.error));
  await import('../dist/app.js');
  const $=s=>document.querySelector(s);
  const click=s=>{const el=$(s);assert.ok(el,`missing ${s}`);assert.equal(el.disabled,false,`disabled ${s}`);el.click();};
  const navigate=route=>{dom.window.history.replaceState({},'',`#${route}`);dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));};
  const saved=()=>JSON.parse(dom.window.localStorage.getItem(STORAGE_KEY));
  assert.match($('#main').textContent,/5문제 시작/);
  navigate('lessons');click('[data-action="lesson-view"][data-value="basics"]');click('[data-action="lesson"][data-id="greetings"]');assert.equal($('#study-dialog').open,true);
  click('#study-dialog [data-action="favorite"]');assert.equal(saved().favorites.length,1);
  for(let i=0;i<6;i++)click('[data-action="next-learn"]');
  assert.equal($('[data-action="next-question"]').disabled,true);
  for(let i=0;i<6;i++){
    const q=phrases.find(p=>p.fr===$('.big-french').textContent);assert.ok(q);
    const chosen=i===0?[...document.querySelectorAll('[data-action="answer"]')].find(b=>b.dataset.id!==q.id):$(`[data-action="answer"][data-id="${q.id}"]`);
    chosen.click();assert.equal(chosen.isConnected,false);assert.equal($('[data-action="answer"]').disabled,true);click('[data-action="next-question"]');
  }
  assert.match($('#dialog-content').textContent,/5 \/ 6/);assert.deepEqual(saved().completed,['greetings']);assert.equal(saved().mastered.length,5);assert.equal(saved().mistakes.length,1);
  assert.equal(Object.values(saved().activity)[0].xp,70);
  click('#study-dialog [data-action="close"]');assert.equal($('#study-dialog').open,false);
  navigate('vocabulary');assert.equal(document.querySelectorAll('.expression').length,phrases.length);
  const search=$('#phrase-search');search.value='cafe';search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert.equal(document.querySelectorAll('.expression').length,1);assert.match($('#phrase-list').textContent,/Un café/);
  search.value='<script>';search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert.match($('#phrase-list').textContent,/검색 결과가 없어요/);
  search.value='';search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));click('[data-action="vocab-filter"][data-value="틀린 표현"]');assert.equal(document.querySelectorAll('.expression').length,1);
  click('[data-action="review"]');assert.equal($('[data-action="review-answer"]').disabled,true);click('[data-action="flip"]');click('[data-action="review-answer"][data-known="true"]');assert.equal(saved().mistakes.length,0);assert.match($('#dialog-content').textContent,/복습 완료/);click('#study-dialog [data-action="close"]');
  navigate('progress');assert.match($('#main').textContent,/70 XP/);
  click('[data-action="settings"]');const slow=$('#slow-speech');slow.checked=true;slow.dispatchEvent(new dom.window.Event('change',{bubbles:true}));assert.equal(saved().slow,true);
  click('[data-action="reset-confirm"]');click('[data-action="reset-cancel"]');assert.equal(saved().completed.length,1);
  click('[data-action="reset-confirm"]');click('[data-action="reset"]');assert.deepEqual(saved().completed,[]);assert.deepEqual(saved().favorites,[]);assert.equal(errors.length,0);
});
