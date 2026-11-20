import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {createRecordStorage,RECORD_KEYS,SNAPSHOT_KEY,RECOVERY_KEY} from '../dist/record-storage.js';
import {createRecordBackup} from '../dist/record-backup.js';
import {freshState} from '../dist/core.js';

const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setup() {
  const dom=new JSDOM('<dialog><div id="content"></div></dialog>',{url:'https://example.test/french-alone/'});
  const {window}=dom,doc=window.document,dialog=doc.querySelector('dialog'),content=doc.querySelector('#content');
  const initial=freshState();initial.activity['2026-11-19']={xp:80,words:3};
  window.localStorage.setItem(RECORD_KEYS[0],JSON.stringify(initial));
  const store=createRecordStorage(window.localStorage,{schedule:()=>1,cancel:()=>{}});let restored=0;
  const ui=createRecordBackup({storage:store,version:'1.20.0',dialog,content,escape,
    dialogHeader:title=>`<h2>${title}</h2>`,openDialog:()=>dialog.setAttribute('open',''),focusDialog:()=>{},onRestored:()=>{restored++;}});
  const click=action=>{const button=content.querySelector(`[data-action="${action}"]`);assert.ok(button,action);assert.equal(button.disabled,false);button.click();};
  const load=async(text,size=text.length)=>{
    const input=content.querySelector('#backup-file');
    Object.defineProperty(input,'files',{configurable:true,value:[{size,text:async()=>text}]});
    input.dispatchEvent(new window.Event('change',{bubbles:true}));await new Promise(resolve=>setImmediate(resolve));
  };
  ui.open();
  return {dom,window,doc,dialog,content,store,ui,click,load,restored:()=>restored};
}

test('backup inspection and copied diagnostics are read-only and do not send records',async()=>{
  const f=setup();const before=f.window.localStorage.getItem(RECORD_KEYS[0]);
  const text=f.ui.diagnosticText();
  assert.match(text,/v1\.20\.0/);assert.match(text,/80 XP/);assert.match(text,/학습·경험치·단어장: ok/);
  assert.ok(!text.includes('"activity"'));
  f.click('backup-diagnostics');await new Promise(resolve=>setImmediate(resolve));
  const area=f.content.querySelector('#backup-diagnostics');assert.equal(area.hidden,false);assert.equal(area.value,text);
  assert.equal(f.window.localStorage.getItem(RECORD_KEYS[0]),before);assert.equal(f.restored(),0);
  f.dom.window.close();
});

test('a backup file is previewed first and changes records only after the explicit restore button',async()=>{
  const f=setup(),file=JSON.parse(f.store.exportCurrent('1.20.0'));
  const next=JSON.parse(file.data[RECORD_KEYS[0]]);next.activity['2026-11-19'].xp=140;file.data[RECORD_KEYS[0]]=JSON.stringify(next);
  const before=f.window.localStorage.getItem(RECORD_KEYS[0]);
  await f.load(JSON.stringify(file));
  assert.match(f.content.querySelector('.backup-confirm').textContent,/140 XP/);
  assert.equal(f.window.localStorage.getItem(RECORD_KEYS[0]),before);
  f.click('backup-cancel');assert.equal(f.content.querySelector('.backup-confirm'),null);assert.equal(f.restored(),0);
  await f.load(JSON.stringify(file));f.click('backup-restore');
  assert.equal(f.restored(),1);assert.equal(f.window.localStorage.getItem(RECORD_KEYS[0]),file.data[RECORD_KEYS[0]]);
  assert.equal(JSON.parse(f.window.localStorage.getItem(RECOVERY_KEY)).data[RECORD_KEYS[0]],before);
  f.dom.window.close();
});

test('invalid files clear a previous preview and preserve current progress',async()=>{
  const f=setup(),before=f.window.localStorage.getItem(RECORD_KEYS[0]);
  await f.load(f.store.exportCurrent('1.20.0'));assert.ok(f.content.querySelector('.backup-confirm'));
  await f.load('{bad');assert.equal(f.content.querySelector('.backup-confirm'),null);
  assert.match(f.content.querySelector('#backup-message').textContent,/읽을 수 없/);
  assert.equal(f.window.localStorage.getItem(RECORD_KEYS[0]),before);assert.equal(f.restored(),0);
  f.dom.window.close();
});

test('an asynchronous file read cannot reopen a preview after leaving backup settings',async()=>{
  const f=setup(),input=f.content.querySelector('#backup-file');let finish;
  Object.defineProperty(input,'files',{value:[{size:50,text:()=>new Promise(resolve=>{finish=resolve;})}]});
  input.dispatchEvent(new f.window.Event('change',{bubbles:true}));
  f.ui.close();f.dialog.dataset.view='settings';finish(f.store.exportCurrent('1.20.0'));
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(f.content.querySelector('.backup-confirm'),null);assert.equal(f.restored(),0);
  f.dom.window.close();
});

test('automatic copies require confirmation and can be inspected without replacing data',()=>{
  const f=setup(),before=f.window.localStorage.getItem(RECORD_KEYS[0]);
  f.click('backup-preview');assert.ok(f.content.querySelector('.backup-confirm'));
  assert.equal(f.window.localStorage.getItem(RECORD_KEYS[0]),before);assert.equal(f.restored(),0);
  assert.ok(f.window.localStorage.getItem(SNAPSHOT_KEY));f.dom.window.close();
});

test('the complete app shows protected storage failures on the home screen and in settings',async()=>{
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const dom=new JSDOM(html,{url:'https://bonjour.test/',pretendToBeVisual:true});
  const {window}=dom;Object.assign(globalThis,{window,document:window.document,location:window.location});
  window.localStorage.setItem(RECORD_KEYS[0],'{damaged');
  window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  window.scrollTo=()=>{};
  const errors=[];window.addEventListener('error',event=>errors.push(event.error));
  await import('../dist/app.js?backup-protected-test');
  const $=selector=>window.document.querySelector(selector);
  assert.match($('#storage-notice').textContent,/원본/);
  $('#storage-notice [data-action="backup-open"]').click();
  assert.match($('#dialog-content').textContent,/원본 보호 중/);
  assert.match($('#dialog-content').textContent,/형식 확인 필요/);
  $('#dialog-content [data-action="settings"]').click();
  $('#slow-speech').click();
  assert.equal(window.localStorage.getItem(RECORD_KEYS[0]),'{damaged');
  $('[data-action="reset-confirm"]').click();$('[data-action="reset"]').click();
  assert.equal(window.localStorage.getItem(RECORD_KEYS[0]),'{damaged');
  assert.equal(errors.length,0);dom.window.close();
});
