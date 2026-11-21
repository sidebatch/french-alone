import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../dist/core.js';
import {createRecordStorage,RECORD_KEYS,RECOVERY_KEY,parseBackup} from '../dist/record-storage.js';
import {createAutoFile} from '../dist/record-autofile.js';

const BASE=RECORD_KEYS[0];
function data(xp=80) {
  const base=freshState();if(xp)base.activity['2026-11-19']={xp,words:2};
  return Object.fromEntries(RECORD_KEYS.map(key=>[key,key===BASE?JSON.stringify(base):null]));
}
function memory(initial=data()) {
  const map=new Map(Object.entries(initial));
  return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key),map};
}
function handle(text='') {
  const file={name:'french-alone-backup.json',text,granted:true,writes:0,failWrite:false,missing:false};
  file.queryPermission=async()=>file.granted?'granted':'prompt';file.requestPermission=file.queryPermission;
  file.getFile=async()=>{if(file.missing)throw new DOMException('Gone','NotFoundError');return {size:Buffer.byteLength(file.text),text:async()=>file.text};};
  file.createWritable=async()=>{
    let next='',aborted=false;
    return {write:async text=>{if(file.failWrite)throw Error('write failed');next=text;},
      close:async()=>{if(file.beforeClose)await file.beforeClose();if(file.failClose)throw Error('close failed');if(!aborted){file.text=next;file.writes++;}},
      abort:async()=>{aborted=true;}};
  };
  return file;
}
function metadata(){return {value:null,get:async function(){return this.value;},set:async function(value){if(this.fail)throw Error('metadata failed');this.value=value;},clear:async function(){this.value=null;}};}
function setup(raw=memory(),meta=metadata(),extra={}) {
  const storage=createRecordStorage(raw,{schedule:()=>1,cancel:()=>{}});
  const auto=createAutoFile({storage,version:'1.21.0',handleStore:meta,supported:true,lock:async fn=>fn(true),schedule:()=>1,cancel:()=>{},...extra});
  return {raw,meta,storage,auto};
}
async function connected(){const f=setup(),file=handle();await f.auto.choose(file);await f.auto.connect('device');return {...f,file};}
const snapshot=raw=>Object.fromEntries(RECORD_KEYS.map(key=>[key,raw.getItem(key)]));
const xp=backup=>JSON.parse(backup.data[BASE]).activity['2026-11-19']?.xp||0;

test('one chosen file is reused for successive saves, with one previous record inside the same file',async()=>{
  const f=await connected();
  assert.equal(f.auto.state().phase,'ready');assert.equal(f.file.writes,1);
  f.storage.setItem(BASE,data(100)[BASE]);await f.auto.flush();
  assert.equal(xp(parseBackup(f.file.text)),100);assert.equal(xp(JSON.parse(f.file.text).previous),80);
  f.storage.setItem(BASE,data(120)[BASE]);await f.auto.flush();
  const file=JSON.parse(f.file.text);assert.equal(xp(file),120);assert.equal(xp(file.previous),100);assert.equal(file.previous.previous,undefined);
  assert.equal(f.file.writes,3);assert.equal(f.meta.value.handle,f.file);
});

test('startup reads the linked file and restores missing local records before the app starts',async()=>{
  const f=await connected();for(const key of RECORD_KEYS)f.raw.removeItem(key);
  const next=setup(f.raw,f.meta);assert.equal(next.storage.issue().kind,'missing');
  await next.auto.initialize();assert.equal(next.auto.state().phase,'ready');
  assert.deepEqual(snapshot(f.raw),data());assert.equal(next.storage.issue(),null);
  next.storage.setItem(BASE,data(90)[BASE]);await next.auto.flush();assert.equal(xp(parseBackup(f.file.text)),90);
});

test('newer local work from an interrupted file save survives reopening and then updates the old file',async()=>{
  const f=await connected();f.raw.setItem(BASE,data(140)[BASE]);
  const next=setup(f.raw,f.meta);await next.auto.initialize();
  assert.equal(next.auto.state().phase,'pending');assert.equal(xp(parseBackup(f.file.text)),80);
  assert.deepEqual(snapshot(f.raw),data(140));await next.auto.flush();assert.equal(xp(parseBackup(f.file.text)),140);
});

test('a changed file is loaded when the local records still match the last saved baseline',async()=>{
  const f=await connected();f.file.text=f.storage.exportData(data(140),'1.21.0');
  const next=setup(f.raw,f.meta);await next.auto.initialize();
  assert.deepEqual(snapshot(f.raw),data(140));assert.equal(next.auto.state().phase,'ready');
  assert.deepEqual(JSON.parse(f.raw.getItem(RECOVERY_KEY)).data,data(80));
});

test('divergent file and device records require a choice and are never silently merged or overwritten',async()=>{
  const f=await connected();f.raw.setItem(BASE,data(100)[BASE]);f.file.text=f.storage.exportData(data(140),'1.21.0');
  const originalFile=f.file.text,next=setup(f.raw,f.meta);await next.auto.initialize();
  assert.equal(next.auto.state().phase,'conflict');await next.auto.flush();assert.equal(f.file.text,originalFile);assert.deepEqual(snapshot(f.raw),data(100));
  assert.equal(await next.auto.connect('file'),true);
  assert.deepEqual(snapshot(f.raw),data(100),'mounted app state must not be replaced before reload');
  const reopened=setup(f.raw,f.meta);await reopened.auto.initialize();assert.deepEqual(snapshot(f.raw),data(140));
});

test('a denied or expired permission keeps both copies and asks for an explicit reconnect',async()=>{
  const f=await connected(),before=f.file.text;f.file.granted=false;
  const next=setup(f.raw,f.meta);await next.auto.initialize();
  assert.equal(next.auto.state().phase,'permission');next.storage.setItem(BASE,data(100)[BASE]);await next.auto.flush();assert.equal(f.file.text,before);
  assert.equal(await next.auto.retry(),false);f.file.granted=true;assert.equal(await next.auto.retry(),true);
  const reopened=setup(f.raw,f.meta);await reopened.auto.initialize();await reopened.auto.flush();assert.equal(xp(parseBackup(f.file.text)),100);
});

test('malformed, empty or missing linked files never erase healthy local progress',async()=>{
  for(const mode of ['bad','empty','missing']) {
    const f=await connected();f.file.text=mode==='bad'?'{bad':mode==='empty'?'':f.file.text;f.file.missing=mode==='missing';
    const next=setup(f.raw,f.meta);await next.auto.initialize();assert.equal(next.auto.state().phase,'error');
    assert.deepEqual(snapshot(f.raw),data());
  }
});

test('failed writes and failed close leave the previous file intact, and local work remains saved',async()=>{
  for(const failure of ['failWrite','failClose']){
    const f=await connected(),original=f.file.text;f.file[failure]=true;
    f.storage.setItem(BASE,data(120)[BASE]);await f.auto.flush();
    assert.equal(f.auto.state().phase,'error');assert.equal(f.file.text,original);assert.deepEqual(snapshot(f.raw),data(120));
  }
});

test('changes made during an asynchronous file write are saved in the following pass',async()=>{
  const f=await connected();let release,entered;
  const waiting=new Promise(resolve=>{entered=resolve;});
  f.file.beforeClose=async()=>{entered();await new Promise(resolve=>{release=resolve;});};
  f.storage.setItem(BASE,data(100)[BASE]);const saving=f.auto.flush();await waiting;
  f.storage.setItem(BASE,data(120)[BASE]);release();await saving;f.file.beforeClose=null;
  assert.equal(f.auto.state().phase,'pending');await f.auto.flush();assert.equal(xp(parseBackup(f.file.text)),120);
});

test('the file is checked again before a write so external changes are not overwritten',async()=>{
  const f=await connected();f.storage.setItem(BASE,data(100)[BASE]);f.file.text=f.storage.exportData(data(140),'1.21.0');
  const changed=f.file.text;await f.auto.flush();assert.equal(f.auto.state().phase,'error');assert.equal(f.file.text,changed);
});

test('disconnect stops automatic writes and leaves the single external file available for later recovery',async()=>{
  const f=await connected(),original=f.file.text;
  f.storage.setItem(BASE,data(100)[BASE]);await f.auto.disconnect();await f.auto.flush();
  assert.equal(f.meta.value,null);assert.equal(f.file.text,original);assert.equal(f.auto.state().connected,false);
});

test('a newly chosen existing backup is read-only until its contents are explicitly selected',async()=>{
  const f=setup(),file=handle(f.storage.exportData(data(140),'1.21.0')),original=file.text;
  await f.auto.choose(file);assert.equal(file.text,original);assert.deepEqual(snapshot(f.raw),data());assert.equal(f.meta.value,null);
  f.auto.cancelChoice();assert.equal(file.text,original);
});

test('a valid existing file can be connected even when the local raw record is damaged',async()=>{
  const f=setup(memory({...data(),[BASE]:'{damaged'})),file=handle(f.storage.exportData(data(140),'1.21.0'));
  await f.auto.choose(file);assert.equal(await f.auto.connect('file'),true);assert.equal(f.raw.getItem(BASE),'{damaged');
  const next=setup(f.raw,f.meta);await next.auto.initialize();assert.deepEqual(snapshot(f.raw),data(140));
  assert.equal(JSON.parse(f.raw.getItem(RECOVERY_KEY)).data[BASE],'{damaged');
});

test('file selection refuses unrelated files without modifying them or linking a handle',async()=>{
  const f=setup(),file=handle('{"other":"document"}'),original=file.text;
  await assert.rejects(()=>f.auto.choose(file));assert.equal(file.text,original);assert.equal(f.meta.value,null);
});

test('failed connection metadata is not reported as a successful automatic backup connection',async()=>{
  const f=setup(),file=handle();await f.auto.choose(file);f.meta.fail=true;
  await assert.rejects(()=>f.auto.connect('device'));assert.equal(f.auto.state().connected,false);assert.equal(f.meta.value,null);
  assert.deepEqual(parseBackup(file.text).data,data(),'a written file can still be reconnected manually');
});

test('unsupported browsers retain normal local records without trying to open a file',async()=>{
  const f=setup(memory(),metadata(),{supported:false});await f.auto.initialize();
  assert.equal(f.auto.state().phase,'unsupported');f.storage.setItem(BASE,data(100)[BASE]);await f.auto.flush();assert.deepEqual(snapshot(f.raw),data(100));
});

test('busy cross-window locks prevent simultaneous file replacement',async()=>{
  const f=await connected(),before=f.file.text,next=setup(f.raw,f.meta,{lock:async fn=>fn(false)});
  await next.auto.initialize();assert.equal(next.auto.state().phase,'error');assert.equal(f.file.text,before);
});

test('an older external file cannot silently rewind the latest known records',async()=>{
  for(const cleared of [false,true]) {
    const f=await connected(),old=JSON.parse(f.storage.exportData(data(30),'1.21.0'));
    old.exportedAt='2020-01-01T12:00:00Z';f.file.text=JSON.stringify(old);
    if(cleared)for(const key of RECORD_KEYS)f.raw.removeItem(key);
    const next=setup(f.raw,f.meta);await next.auto.initialize();
    assert.equal(next.auto.state().phase,'conflict');assert.deepEqual(snapshot(f.raw),data(80));assert.equal(xp(parseBackup(f.file.text)),30);
  }
});

test('canceling or rejecting a replacement choice preserves the existing automatic connection',async()=>{
  const f=await connected();f.storage.setItem(BASE,data(100)[BASE]);
  await f.auto.choose(handle());await f.auto.choose(handle());f.auto.cancelChoice();await f.auto.flush();
  assert.equal(f.auto.state().phase,'ready');assert.equal(xp(parseBackup(f.file.text)),100);
  f.storage.setItem(BASE,data(120)[BASE]);await assert.rejects(()=>f.auto.choose(handle('{unrelated')));
  await f.auto.flush();assert.equal(xp(parseBackup(f.file.text)),120);assert.equal(f.meta.value.handle,f.file);
  const denied=handle();denied.granted=false;await f.auto.choose(denied);await f.auto.connect('device');f.auto.cancelChoice();assert.equal(f.auto.state().phase,'ready');
});
