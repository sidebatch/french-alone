// Records stay on this device. These keys are deliberately independent of the app cache.
export const RECORD_LABELS = Object.freeze({
  'bonjour-french-v1':'학습·경험치·단어장',
  'bonjour-practice-v1':'문장 연습·스탬프',
  'bonjour-practice-drafts-v1':'이어하던 문제',
  'bonjour-grammar-v1':'문법 열람',
  'bonjour-room-v1':'구매 아이템·루의 방'
});
export const RECORD_KEYS = Object.keys(RECORD_LABELS);
export const SNAPSHOT_KEY = 'bonjour-snapshots-v1';
export const RECOVERY_KEY = 'bonjour-recovery-v1';
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const FORMAT = 'french-alone-backup';
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const quotaError = error => error?.name==='QuotaExceededError' || error?.code===22 || error?.code===1014;
const shapes = [
  {arrays:['completed','mastered','favorites','mistakes'],objects:['activity','lessonProgress']},
  {arrays:['runs','completed'],objects:['cards','days']},
  {arrays:[],objects:['sessions']},
  {arrays:['seen'],objects:['counts']},
  {arrays:['granted'],objects:['purchases','layout','history']}
];

export function recordStatus(key, raw) {
  if (raw === null) return 'missing';
  try {
    if (typeof raw !== 'string') return 'invalid';
    const value = JSON.parse(raw), shape = shapes[RECORD_KEYS.indexOf(key)];
    if (!shape || !object(value)) return 'invalid';
    if (value.version !== 1) return 'version';
    // Optional fields allow older v1 records; wrong types must not be silently discarded.
    if (![...shape.arrays,...shape.objects].some(name=>Object.hasOwn(value,name))) return 'invalid';
    if (shape.arrays.some(name=>Object.hasOwn(value,name)&&!Array.isArray(value[name]))) return 'invalid';
    if (shape.objects.some(name=>Object.hasOwn(value,name)&&!object(value[name]))) return 'invalid';
    for (const name of shape.objects.filter(name=>name!=='layout')) {
      if (value[name] && Object.values(value[name]).some(item=>name==='counts' ? !Number.isSafeInteger(item)||item<0 : !object(item))) return 'invalid';
    }
    return 'ok';
  } catch { return 'invalid'; }
}

export function summarizeRecords(data) {
  const values = RECORD_KEYS.map(key=>{
    try { return recordStatus(key,data[key])==='ok' ? JSON.parse(data[key]) : {}; } catch { return {}; }
  });
  const [base,practice,drafts,grammar,room] = values;
  const days = new Set([...Object.keys(base.activity||{}),...Object.keys(practice.days||{})]);
  const xp = Object.values(base.activity||{}).reduce((n,day)=>n+(Number.isFinite(day.xp)?Math.max(0,day.xp):0),0);
  const earned = Object.values(practice.days||{}).reduce((n,day)=>n+[3,10,20].filter(limit=>day.questions>=limit).length,0);
  const spent = Object.values(room.purchases||{}).reduce((n,item)=>n+(Number.isFinite(item.cost)?Math.max(0,item.cost):0),0);
  return {days:days.size,xp,cards:Object.keys(practice.cards||{}).length,stamps:Math.max(0,earned-spent),
    purchases:Object.keys(room.purchases||{}).length,drafts:Object.keys(drafts.sessions||{}).length,
    lessons:(base.completed||[]).length,favorites:(base.favorites||[]).length,grammar:Object.keys(grammar.counts||{}).length};
}

function meaningful(data) {
  return Object.values(summarizeRecords(data)).some(value=>value>0) || (()=>{
    try { const room=JSON.parse(data[RECORD_KEYS[4]]);return room?.revision>0; } catch { return false; }
  })();
}
function validData(data) {
  return object(data) && Object.keys(data).length===RECORD_KEYS.length && RECORD_KEYS.every(key=>
    Object.hasOwn(data,key) && ['ok','missing'].includes(recordStatus(key,data[key])));
}
const same = (a,b) => RECORD_KEYS.every(key=>a[key]===b[key]);
const localDate = now => `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
export function parseBackup(text) {
  if (typeof text!=='string' || new TextEncoder().encode(text).length>MAX_BACKUP_BYTES) throw new Error('백업 파일은 5MB 이하만 열 수 있어요.');
  let value;
  try { value=JSON.parse(text); } catch { throw new Error('JSON 파일을 읽을 수 없어요. 원래 백업 파일을 선택해 주세요.'); }
  if (value?.format!==FORMAT || value?.version!==1 || !validData(value.data)) throw new Error('복원할 수 있는 French Alone 백업이 아니에요. 현재 기록은 바꾸지 않았어요.');
  if (typeof value.exportedAt!=='string' || !Number.isFinite(Date.parse(value.exportedAt))) throw new Error('백업 날짜를 확인할 수 없어요. 현재 기록은 바꾸지 않았어요.');
  return {format:FORMAT,version:1,exportedAt:value.exportedAt,appVersion:String(value.appVersion||''),data:{...value.data}};
}

export function createRecordStorage(raw, {now=()=>new Date(),schedule=setTimeout,cancel=clearTimeout}={}) {
  let blocked=null, backupProblem=false, listener=()=>{}, savedListener=()=>{}, timer=null, stopped=false;
  let expected={};
  const fail = (kind,message) => {
    if (!blocked) { blocked={kind,message}; listener(); }
    return new Error(blocked.message);
  };
  function capture() {
    const data={}, statuses={};
    for (const key of RECORD_KEYS) {
      try { data[key]=raw.getItem(key);statuses[key]=recordStatus(key,data[key]); }
      catch { data[key]=null;statuses[key]='unavailable'; }
    }
    return {data,statuses};
  }
  function checkReadable(snapshot) {
    if (Object.values(snapshot.statuses).includes('unavailable')) throw fail('read','기록을 읽지 못했어요. 원본 보호를 위해 저장을 멈췄어요.');
    if (Object.values(snapshot.statuses).some(status=>!['ok','missing'].includes(status))) throw fail('invalid','읽을 수 없는 기록이 있어요. 원본을 덮어쓰지 않고 보관하고 있어요.');
  }
  function readSnapshots() {
    try {
      const text=raw.getItem(SNAPSHOT_KEY);
      if (text===null) return [];
      const value=JSON.parse(text);
      if (value?.version!==1 || !Array.isArray(value.entries) || value.entries.length>4 || value.entries.some(entry=>
        !validData(entry.data) || !['daily','latest'].includes(entry.kind) || typeof entry.id!=='string' || !Number.isFinite(Date.parse(entry.at)))) throw new Error('invalid snapshots');
      return value.entries;
    } catch { backupProblem=true;return []; }
  }
  function readRecovery() {
    try {
      const text=raw.getItem(RECOVERY_KEY);
      if (text===null) return null;
      const value=JSON.parse(text);
      // This copy can contain damaged raw records, so it can always be exported for inspection.
      if (value?.version!==1 || !['applying','saved'].includes(value.phase) || !object(value.data) ||
        typeof value.at!=='string' || !Number.isFinite(Date.parse(value.at)) ||
        (value.missingKeys!==undefined && (!Array.isArray(value.missingKeys)||value.missingKeys.some(key=>!RECORD_KEYS.includes(key)))) ||
        !RECORD_KEYS.every(key=>Object.hasOwn(value.data,key)&&(typeof value.data[key]==='string'||value.data[key]===null))) throw new Error('invalid recovery');
      return value;
    } catch { backupProblem=true;return {phase:'unreadable'}; }
  }
  function writeChecked(key,value) {
    raw.setItem(key,value);
    if (raw.getItem(key)!==value) throw new Error('저장된 내용을 확인하지 못했어요.');
  }
  function checkpoint() {
    if (timer!==null) { cancel(timer);timer=null; }
    if (stopped || blocked || backupProblem) return false;
    const snapshot=capture();
    if (!validData(snapshot.data) || Object.values(snapshot.statuses).includes('unavailable') || !same(snapshot.data,expected) || !meaningful(snapshot.data)) return false;
    const entries=readSnapshots();
    if (backupProblem) return false; // Never replace an unreadable backup with an empty list.
    const at=now().toISOString(), day=localDate(now());
    const daily=entries.filter(entry=>entry.kind==='daily');
    if (!daily.some(entry=>entry.id===day)) daily.unshift({id:day,kind:'daily',at,data:snapshot.data});
    const latest={id:'latest',kind:'latest',at,data:snapshot.data};
    try {
      const candidates=[latest,...daily.slice(0,3)];
      while (candidates.length) {
        try {writeChecked(SNAPSHOT_KEY,JSON.stringify({version:1,entries:candidates}));break;}
        catch(error) {if (!quotaError(error)||candidates.length===1)throw error;candidates.pop();}
      }
      return true;
    } catch { backupProblem=true;listener();return false; }
  }
  function backups() {
    const entries=readSnapshots().map(entry=>({...entry,label:entry.kind==='latest'?'최근 자동 보관':'하루 첫 보관',restorable:true}));
    const recovery=readRecovery();
    if (recovery?.data) entries.unshift({id:'before-restore',kind:'recovery',at:recovery.at,data:recovery.data,label:'복원하기 전 기록',restorable:validData(recovery.data)});
    // Daily and latest copies often match immediately after opening the app.
    return entries.filter((entry,index)=>!entries.slice(0,index).some(other=>same(other.data,entry.data)));
  }
  function inspect() {
    const snapshot=capture();
    return {...snapshot,summary:summarizeRecords(snapshot.data),backups:backups(),blocked,backupProblem};
  }
  function exportData(data,appVersion) {
    return JSON.stringify({format:FORMAT,version:1,appVersion,exportedAt:now().toISOString(),data},null,2);
  }
  function exportCurrent(appVersion) {
    const snapshot=capture();
    if (Object.values(snapshot.statuses).includes('unavailable')) throw new Error('현재 기록을 읽지 못해 파일을 만들 수 없어요. 초기화하지 말고 앱을 다시 열어 주세요.');
    return exportData(snapshot.data,appVersion);
  }
  function assertUnchanged() {
    const current=capture();checkReadable(current);
    if (!same(current.data,expected)) throw fail('conflict','다른 화면에서 기록이 바뀌었어요. 덮어쓰지 않도록 저장을 멈췄으니 앱을 다시 열어 주세요.');
  }
  function applyData(data) {
    for (const key of RECORD_KEYS) {
      if (data[key]===null) raw.removeItem(key);
      else raw.setItem(key,data[key]);
    }
    const checked=capture();
    if (Object.values(checked.statuses).includes('unavailable') || !same(checked.data,data)) throw new Error('기록 저장을 확인하지 못했어요.');
  }
  function restore(data,{resume=false}={}) {
    if (!validData(data)) throw new Error('이 보관본은 바로 복원할 수 없어요. 원본 파일을 먼저 저장해 주세요.');
    if (timer!==null) {cancel(timer);timer=null;}
    const before=capture();
    if (Object.values(before.statuses).includes('unavailable')) throw new Error('현재 원본을 읽지 못해 복원을 멈췄어요. 초기화하지 말고 다시 열어 주세요.');
    const journal={version:1,phase:'applying',at:now().toISOString(),data:before.data,missingKeys:RECORD_KEYS.filter(key=>data[key]===null)};
    // Save the original before the first mutation. If this fails, do not touch any record.
    try {writeChecked(RECOVERY_KEY,JSON.stringify(journal));}
    catch {throw new Error('복원 전 기록을 보관할 공간이 없어요. 현재 기록은 바꾸지 않았어요.');}
    try {
      applyData(data);
      journal.phase='saved';writeChecked(RECOVERY_KEY,JSON.stringify(journal));
    } catch {
      let rolledBack=false;
      try {applyData(before.data);rolledBack=true;} catch { /* The write-ahead copy survives for the next launch. */ }
      if (rolledBack) {journal.phase='saved';journal.missingKeys=RECORD_KEYS.filter(key=>before.data[key]===null);try {writeChecked(RECOVERY_KEY,JSON.stringify(journal));} catch { /* Still protected on restart. */ }}
      fail('restore','복원을 끝내지 못했어요. 복원 전 보관본을 확인해 주세요.');
      throw new Error(rolledBack?'복원에 실패해 이전 기록으로 되돌렸어요. 백업 파일을 보관하고 다시 열어 주세요.':'복원이 중단됐어요. 초기화하지 말고 ‘복원하기 전 기록’을 파일로 저장해 주세요.');
    }
    expected={...data};blocked=null;stopped=!resume;
  }
  function clearBackupsForReset() {
    if (timer!==null) {cancel(timer);timer=null;}
    // Reset is explicit in the UI. A blocked record must first be inspected/recovered.
    if (blocked) throw new Error('먼저 기록 확인·백업에서 원본을 확인해 주세요. 보호 중에는 초기화할 수 없어요.');
    assertUnchanged();
    for (const key of [SNAPSHOT_KEY,RECOVERY_KEY]) {raw.removeItem(key);if (raw.getItem(key)!==null) throw new Error('기기 보관본을 지우지 못했어요.');}
    backupProblem=false;
  }
  // Read the complete bundle before legacy readers or room rendering can write anything.
  const initial=capture();expected={...initial.data};
  try {checkReadable(initial);} catch { /* Display the preserved originals in diagnostics. */ }
  const journal=readRecovery();
  if (journal && journal.phase!=='saved') fail('restore','지난 복원이 끝나지 않았어요. 복원 전 보관본을 먼저 확인해 주세요.');
  const previous=readSnapshots();
  if (!blocked && previous.some(entry=>RECORD_KEYS.some(key=>initial.data[key]===null && entry.data[key]!==null &&
    !(journal?.phase==='saved' && entry.at<=journal.at && journal.missingKeys?.includes(key)) && meaningful({[key]:entry.data[key]})))) {
    fail('missing','현재 기록 일부가 보이지 않지만 기기 보관본이 있어요. 복원할 기록을 확인해 주세요.');
  }
  if (!blocked) checkpoint();
  return {
    getItem(key) {
      if (!RECORD_KEYS.includes(key)) return raw.getItem(key);
      let value;
      try {value=raw.getItem(key);} catch {throw fail('read','기록을 읽지 못했어요. 원본 보호를 위해 저장을 멈췄어요.');}
      const status=recordStatus(key,value);
      if (!['ok','missing'].includes(status)) fail('invalid','읽을 수 없는 기록이 있어요. 원본을 덮어쓰지 않고 보관하고 있어요.');
      expected[key]=value;
      return value;
    },
    setItem(key,value) {
      if (!RECORD_KEYS.includes(key)) throw new Error('허용되지 않은 기록이에요.');
      if (blocked) throw new Error(blocked.message);
      assertUnchanged();
      if (recordStatus(key,value)!=='ok') throw fail('invalid','기록 형식을 확인하지 못해 저장을 멈췄어요.');
      try {writeChecked(key,value);}
      catch(error) {
        // Automatic copies must not crowd out the active record. Keep one prior copy,
        // never the recovery journal, and retry only a genuine quota failure.
        const entries=quotaError(error)?readSnapshots():[];
        if (entries.length<=1 || backupProblem) throw fail('write','기기에 기록을 저장하지 못했어요. 남은 기록을 파일로 보관해 주세요.');
        try {
          writeChecked(SNAPSHOT_KEY,JSON.stringify({version:1,entries:entries.slice(0,1)}));
          writeChecked(key,value);backupProblem=true;listener();
        } catch {throw fail('write','기기에 기록을 저장하지 못했어요. 남은 기록을 파일로 보관해 주세요.');}
      }
      expected[key]=value;
      if (timer!==null) cancel(timer);
      timer=schedule(checkpoint,700);
      savedListener();
    },
    inspect,checkpoint,restore,exportCurrent,exportData,clearBackupsForReset,
    issue:()=>blocked,
    backupWarning:()=>backupProblem,
    onIssue(fn){listener=fn;},
    onSaved(fn){savedListener=fn;},
    dispose(){stopped=true;if(timer!==null)cancel(timer);}
  };
}
