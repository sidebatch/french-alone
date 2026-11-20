import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,readState} from '../dist/core.js';
import {freshPractice,readPractice} from '../dist/practice-core.js';
import {freshRoom,readRoom,buyRoomItem,wallet} from '../dist/room-core.js';
import {createRecordStorage,RECORD_KEYS,SNAPSHOT_KEY,RECOVERY_KEY,recordStatus,parseBackup,summarizeRecords,MAX_BACKUP_BYTES} from '../dist/record-storage.js';

const [BASE,PRACTICE,DRAFT,GRAMMAR,ROOM]=RECORD_KEYS;
const date='2026-11-19';
function fixture(xp=80) {
  const base=freshState();base.activity[date]={xp,words:3};base.completed=['greetings'];base.favorites=['greetings-0'];
  const practice=freshPractice();practice.days[date]={questions:10,rounds:1};practice.cards['be-1']={strength:2,seen:2,due:'2026-11-21',lastSeen:date,credited:true,independent:true};
  const room=freshRoom(practice.days);buyRoomItem(room,practice.days,'lavender-pot',date);
  return Object.fromEntries(RECORD_KEYS.map((key,index)=>[key,JSON.stringify([base,practice,{version:1,sessions:{}},{version:1,counts:{articles:2},seen:[]},room][index])]));
}
function memory(data={}) {
  const map=new Map(Object.entries(data));
  return {map,getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};
}
const options={now:()=>new Date('2026-11-20T12:00:00Z'),schedule:()=>1,cancel:()=>{}};
const make=(raw,extra={})=>createRecordStorage(raw,{...options,...extra});
const rawRecords=raw=>Object.fromEntries(RECORD_KEYS.map(key=>[key,raw.getItem(key)]));

test('the new storage wrapper keeps all five old records byte-for-byte and exports an exact portable file',()=>{
  const data=fixture(),raw=memory(data),store=make(raw);
  assert.deepEqual(rawRecords(raw),data);
  assert.equal(store.issue(),null);
  const file=parseBackup(store.exportCurrent('1.20.0'));
  assert.deepEqual(file.data,data);
  assert.deepEqual(readState(store).completed,['greetings']);
  const days=readPractice(store).days;
  assert.equal(wallet(readRoom(store,days),days).balance,1);
  assert.equal(store.inspect().summary.purchases,1);
  assert.ok(store.inspect().backups.length);
});

test('failed reads protect originals from legacy fresh-state writes even if reading later succeeds',()=>{
  const data=fixture(),raw=memory(data),get=raw.getItem;let broken=true;
  raw.getItem=key=>{if(key===BASE&&broken)throw Error('denied');return get(key);};
  const store=make(raw);
  assert.equal(store.issue().kind,'read');
  assert.throws(()=>store.setItem(BASE,JSON.stringify(freshState())));
  assert.throws(()=>store.exportCurrent('1.20.0'));
  broken=false;
  assert.throws(()=>store.setItem(BASE,JSON.stringify(freshState())));
  assert.deepEqual(rawRecords(raw),data);
  assert.equal(raw.getItem(SNAPSHOT_KEY),null);
});

test('invalid JSON, wrong shapes and future versions are preserved, exportable and write-protected',()=>{
  for (const original of ['{unfinished','{"version":2,"activity":{}}','{"version":1,"completed":"bad"}','{"version":1,"activity":{"2026-11-19":null}}']) {
    const raw=memory({...fixture(),[BASE]:original}),store=make(raw);
    assert.equal(store.issue().kind,'invalid');
    assert.equal(store.getItem(BASE),original);
    assert.throws(()=>store.setItem(PRACTICE,JSON.stringify(freshPractice())));
    assert.equal(JSON.parse(store.exportCurrent('1.20.0')).data[BASE],original);
    assert.throws(()=>parseBackup(store.exportCurrent('1.20.0')));
    assert.equal(raw.getItem(BASE),original);
  }
});

test('another window cannot silently lose newer records to an already-open stale writer',()=>{
  const raw=memory(fixture()),first=make(raw),second=make(raw);
  const newer=fixture(120)[BASE];first.setItem(BASE,newer);
  assert.throws(()=>second.setItem(PRACTICE,fixture()[PRACTICE]),/다른 화면/);
  assert.equal(raw.getItem(BASE),newer);
  assert.equal(second.issue().kind,'conflict');
  assert.equal(first.issue(),null);
});

test('checkpoints capture a complete multi-key round, keep the first daily copy and bound history',()=>{
  const raw=memory(fixture());let day=20;
  const store=make(raw,{now:()=>new Date(`2026-11-${day}T12:00:00Z`)});
  for(day=20;day<=25;day++) {
    store.setItem(BASE,fixture(day*10)[BASE]);
    const practice=JSON.parse(raw.getItem(PRACTICE));practice.days[date].questions=day;
    store.setItem(PRACTICE,JSON.stringify(practice));store.checkpoint();
  }
  const entries=JSON.parse(raw.getItem(SNAPSHOT_KEY)).entries;
  assert.equal(entries.length,4);
  assert.equal(entries.filter(entry=>entry.kind==='daily').length,3);
  assert.equal(summarizeRecords(entries[0].data).xp,250);
  assert.equal(JSON.parse(entries[0].data[PRACTICE]).days[date].questions,25);
  assert.deepEqual(entries.filter(entry=>entry.kind==='daily').map(entry=>entry.id),['2026-11-25','2026-11-24','2026-11-23']);
});

test('the first daily copy stays intact, and empty defaults never replace meaningful snapshots',()=>{
  const data=fixture(),raw=memory(data),store=make(raw);
  store.setItem(BASE,fixture(130)[BASE]);store.checkpoint();
  assert.equal(summarizeRecords(JSON.parse(raw.getItem(SNAPSHOT_KEY)).entries[1].data).xp,80);
  const preserved=raw.getItem(SNAPSHOT_KEY);
  for(const key of RECORD_KEYS) raw.removeItem(key);
  const next=make(raw);
  assert.equal(next.issue().kind,'missing');
  assert.throws(()=>next.setItem(BASE,JSON.stringify(freshState())));
  assert.equal(next.checkpoint(),false);
  assert.equal(raw.getItem(SNAPSHOT_KEY),preserved);
  assert.ok(next.inspect().backups.length);
  next.restore(next.inspect().backups[0].data);
  assert.equal(readState(raw).activity[date].xp,130);
});

test('backup quota failure does not erase originals or prevent a normal primary save',()=>{
  const raw=memory(fixture()),set=raw.setItem;
  raw.setItem=(key,value)=>{if(key===SNAPSHOT_KEY)throw Error('quota');set(key,value);};
  const store=make(raw);assert.equal(store.inspect().backupProblem,true);
  assert.equal(store.issue(),null);
  store.setItem(BASE,fixture(100)[BASE]);assert.equal(readState(raw).activity[date].xp,100);
});

test('an unreadable backup container is not overwritten by a new snapshot',()=>{
  const raw=memory({...fixture(),[SNAPSHOT_KEY]:'{damaged'}),store=make(raw);
  store.setItem(BASE,fixture(100)[BASE]);store.checkpoint();
  assert.equal(raw.getItem(SNAPSHOT_KEY),'{damaged');
  assert.equal(store.inspect().backupProblem,true);
});

test('foreign, incomplete, oversized and unsupported files are rejected before any record changes',()=>{
  const raw=memory(fixture()),store=make(raw),good=JSON.parse(store.exportCurrent('1.20.0'));
  const badFiles=['not json',JSON.stringify({...good,format:'other'}),JSON.stringify({...good,version:2}),JSON.stringify({...good,exportedAt:'not a date'}),JSON.stringify({...good,data:{[BASE]:good.data[BASE]}}),JSON.stringify({...good,data:{...good.data,unrelated:'no'}}),' '.repeat(MAX_BACKUP_BYTES+1)];
  for(const text of badFiles)assert.throws(()=>parseBackup(text));
  assert.deepEqual(rawRecords(raw),fixture());
});

test('restoring replaces exactly the five app keys and keeps the old bundle for undo',()=>{
  const old=fixture(90),target=fixture(140);target[DRAFT]=null;
  const raw=memory({...old,unrelated:'leave me'}),store=make(raw);
  store.restore(target);
  assert.deepEqual(rawRecords(raw),target);
  assert.equal(raw.getItem('unrelated'),'leave me');
  const journal=JSON.parse(raw.getItem(RECOVERY_KEY));
  assert.equal(journal.phase,'saved');assert.deepEqual(journal.data,old);
  const reopened=make(raw);
  assert.equal(reopened.issue(),null);
  const undo=reopened.inspect().backups.find(entry=>entry.id==='before-restore');assert.deepEqual(undo.data,old);
  reopened.restore(undo.data);assert.deepEqual(rawRecords(raw),old);
});

test('restore refuses to start unless it can save the original first',()=>{
  const old=fixture(),raw=memory(old),store=make(raw),set=raw.setItem;
  raw.setItem=(key,value)=>{if(key===RECOVERY_KEY)throw Error('quota');set(key,value);};
  assert.throws(()=>store.restore(fixture(150)),/현재 기록은 바꾸지/);
  assert.deepEqual(rawRecords(raw),old);
});

test('a failure halfway through restore rolls back every original key',()=>{
  const old=fixture(),raw=memory(old),store=make(raw),set=raw.setItem;let fail=true;
  raw.setItem=(key,value)=>{if(key===PRACTICE&&fail){fail=false;throw Error('quota');}set(key,value);};
  assert.throws(()=>store.restore(fixture(150)),/이전 기록으로 되돌렸/);
  assert.deepEqual(rawRecords(raw),old);
  assert.equal(store.issue().kind,'restore');
  assert.deepEqual(JSON.parse(raw.getItem(RECOVERY_KEY)).data,old);
});

test('a crash or failed rollback leaves an exportable journal and blocks fresh saves on next launch',()=>{
  const old=fixture(),raw=memory(old),store=make(raw),set=raw.setItem;let failed=false;
  raw.setItem=(key,value)=>{if(key===PRACTICE)failed=true;if(failed&&RECORD_KEYS.includes(key))throw Error('offline storage');set(key,value);};
  assert.throws(()=>store.restore(fixture(150)),/복원이 중단/);
  raw.setItem=set;
  const next=make(raw);assert.equal(next.issue().kind,'restore');
  assert.deepEqual(next.inspect().backups.find(entry=>entry.id==='before-restore').data,old);
  assert.throws(()=>next.setItem(BASE,fixture(200)[BASE]));
  next.restore(old);assert.deepEqual(rawRecords(raw),old);
});

test('damaged originals remain exportable after a successful recovery from a valid file',()=>{
  const raw=memory({...fixture(),[BASE]:'{damaged'}),store=make(raw);
  store.restore(fixture(100));
  const next=make(raw),before=next.inspect().backups.find(entry=>entry.id==='before-restore');
  assert.equal(before.restorable,false);
  assert.equal(JSON.parse(next.exportData(before.data,'1.20.0')).data[BASE],'{damaged');
});

test('explicit reset clears internal copies, but neither exported files nor unrelated browser keys',()=>{
  const raw=memory({...fixture(),unrelated:'ok'}),store=make(raw),file=store.exportCurrent('1.20.0');
  store.clearBackupsForReset();
  assert.equal(raw.getItem(SNAPSHOT_KEY),null);assert.equal(raw.getItem(RECOVERY_KEY),null);
  assert.equal(raw.getItem('unrelated'),'ok');assert.equal(parseBackup(file).data[BASE],fixture()[BASE]);
  const protectedRaw=memory({[BASE]:'{bad'}),protectedStore=make(protectedRaw);
  assert.throws(()=>protectedStore.clearBackupsForReset(),/보호 중/);
  assert.equal(protectedRaw.getItem(BASE),'{bad');
});

test('older v1 records with missing optional fields remain readable',()=>{
  const raw=JSON.stringify({version:1,completed:['greetings'],favorites:[],mastered:[],mistakes:[],activity:{[date]:{xp:20}}});
  assert.equal(recordStatus(BASE,raw),'ok');
  const store=make(memory({[BASE]:raw}));assert.equal(store.issue(),null);
  const state=readState(store);store.setItem(BASE,JSON.stringify(state));assert.equal(state.activity[date].xp,20);
});

test('restoring an older backup with intentionally absent sections does not trigger a false loss alarm',()=>{
  const raw=memory(fixture()),store=make(raw),target=fixture(30);target[GRAMMAR]=null;target[ROOM]=null;
  store.restore(target);
  assert.equal(make(raw).issue(),null);
});

test('automatic history shrinks under quota rather than displacing active records or the recovery journal',()=>{
  const raw=memory(fixture()),store=make(raw),set=raw.setItem;
  raw.setItem(RECOVERY_KEY,JSON.stringify({version:1,phase:'saved',at:'2026-11-20T10:00:00Z',data:fixture(50)}));
  const journal=raw.getItem(RECOVERY_KEY);
  raw.setItem=(key,value)=>{
    if(key===BASE && JSON.parse(raw.getItem(SNAPSHOT_KEY)).entries.length>1)throw new DOMException('Full','QuotaExceededError');
    set(key,value);
  };
  store.setItem(BASE,fixture(100)[BASE]);
  assert.equal(readState(raw).activity[date].xp,100);assert.equal(store.issue(),null);
  assert.equal(JSON.parse(raw.getItem(SNAPSHOT_KEY)).entries.length,1);
  assert.equal(raw.getItem(RECOVERY_KEY),journal);
  assert.equal(store.backupWarning(),true);
});

test('a checkpoint keeps the newest complete copy when only one snapshot fits',()=>{
  const raw=memory(fixture()),set=raw.setItem;
  raw.setItem=(key,value)=>{
    if(key===SNAPSHOT_KEY && JSON.parse(value).entries.length>1)throw new DOMException('Full','QuotaExceededError');
    set(key,value);
  };
  const store=make(raw);store.setItem(BASE,fixture(100)[BASE]);store.checkpoint();
  assert.equal(JSON.parse(raw.getItem(SNAPSHOT_KEY)).entries.length,1);
  assert.equal(summarizeRecords(store.inspect().backups[0].data).xp,100);
  assert.equal(store.backupWarning(),false);
});

test('damaged recovery metadata protects originals without crashing initialization',()=>{
  const data=fixture(),raw=memory({...data,[RECOVERY_KEY]:JSON.stringify({version:1,phase:'saved',at:'2026-11-20T12:00:00Z',data,missingKeys:12})});
  const store=make(raw);
  assert.equal(store.issue().kind,'restore');assert.equal(store.inspect().backupProblem,true);
  assert.deepEqual(rawRecords(raw),data);
  assert.throws(()=>store.setItem(BASE,JSON.stringify(freshState())));
});
