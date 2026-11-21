import {RECORD_KEYS,MAX_BACKUP_BYTES,parseBackup,summarizeRecords} from './record-storage.js';

export const AUTO_FILE_DB='french-alone-file-backup-v1';
const same=(a,b)=>!!a&&!!b&&RECORD_KEYS.every(key=>a[key]===b[key]);
const hasRecords=data=>Object.values(summarizeRecords(data)).some(value=>value>0)||(()=>{try{return JSON.parse(data['bonjour-room-v1'])?.revision>0;}catch{return false;}})();
const readable=snapshot=>Object.values(snapshot.statuses).every(value=>['ok','missing'].includes(value));
const textError=message=>new Error(message);
const timeout=(promise,ms=8000)=>new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(textError('파일 응답을 기다리다 멈췄어요. 기기 기록은 유지하며, 파일 연결을 다시 확인해 주세요.')),ms);
  promise.then(value=>{clearTimeout(timer);resolve(value);},error=>{clearTimeout(timer);reject(error);});
});

export function createFileHandleStore(indexedDB) {
  async function access(write,value) {
    if(!indexedDB)return null;
    const database=await new Promise((resolve,reject)=>{
      const request=indexedDB.open(AUTO_FILE_DB,1);let settled=false;
      const timer=setTimeout(()=>{settled=true;reject(textError('파일 연결 정보를 열지 못했어요. 다른 앱 창을 닫고 다시 열어 주세요.'));},5000);
      request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('connection'))request.result.createObjectStore('connection');};
      request.onsuccess=()=>{clearTimeout(timer);if(settled)request.result.close();else resolve(request.result);};
      request.onerror=()=>{clearTimeout(timer);reject(request.error);};
      request.onblocked=()=>{clearTimeout(timer);settled=true;reject(textError('다른 창에서 파일 연결 정보를 사용하고 있어요.'));};
    });
    try {
      return await new Promise((resolve,reject)=>{
        const tx=database.transaction('connection',write?'readwrite':'readonly'),store=tx.objectStore('connection');
        const request=write?(value===null?store.delete('active'):store.put(value,'active')):store.get('active');
        tx.oncomplete=()=>resolve(write?undefined:request.result||null);
        tx.onerror=()=>reject(tx.error||textError('파일 연결 정보를 저장하지 못했어요.'));
        tx.onabort=()=>reject(tx.error||textError('파일 연결 정보 저장이 중단됐어요.'));
      });
    } finally {database.close();}
  }
  return {get:()=>access(false),set:value=>access(true,value),clear:()=>access(true,null)};
}

export function createAutoFile({storage,version,handleStore,supported,lock,now=()=>new Date(),schedule=setTimeout,cancel=clearTimeout}) {
  let connection=null,phase=supported?'off':'unsupported',message='',pending=null,priorChoice=null,timer=null,running=null,dirty=false,revision=0;
  const listeners=new Set();
  const publish=()=>listeners.forEach(fn=>fn());
  const setPhase=(value,note='')=>{phase=value;message=note;publish();};
  function local(allowInvalid=false) {
    const snapshot=storage.inspect();
    if(allowInvalid?Object.values(snapshot.statuses).includes('unavailable'):!readable(snapshot))throw textError('기기 원본을 읽지 못해 자동 파일 갱신을 멈췄어요. 파일의 기존 기록은 유지해요.');
    return snapshot.data;
  }
  function envelope(data,previous) {
    const result=JSON.parse(storage.exportData(data,version));
    if(previous&&!same(previous.data,data))result.previous={...previous};
    const text=JSON.stringify(result,null,2);
    if(new TextEncoder().encode(text).length>MAX_BACKUP_BYTES)throw textError('자동 백업 파일 크기가 한도를 넘었어요. 기존 파일은 그대로 보관해요.');
    return text;
  }
  async function read(handle) {
    const file=await timeout(handle.getFile());
    if(file.size>MAX_BACKUP_BYTES)throw textError('연결할 백업 파일은 5MB 이하만 열 수 있어요.');
    const text=await timeout(file.text());
    return {text,backup:text?parseBackup(text):null};
  }
  async function permission(handle,request=false) {
    const granted=request?await handle.requestPermission({mode:'readwrite'}):await handle.queryPermission({mode:'readwrite'});
    if(granted!=='granted'){setPhase('permission','자동 백업 파일 접근을 다시 허용해 주세요. 기기 안 저장은 계속돼요.');return false;}
    return true;
  }
  async function remember(meta) {
    await handleStore.set(meta);connection=meta;
  }
  async function writeFile(handle,text,expectedText) {
    if((await read(handle)).text!==expectedText)throw textError('백업 파일이 다른 곳에서 바뀌었어요. 덮어쓰지 않고 확인을 기다려요.');
    const stream=await handle.createWritable({mode:'exclusive'});
    try {await stream.write(text);await stream.close();}
    catch(error){try{await stream.abort();}catch{/* A failed close may already have disposed the temporary writer. */}throw error;}
    const verified=await read(handle);
    if(verified.text!==text)throw textError('백업 파일에 저장된 내용을 확인하지 못했어요. 기기 기록은 유지해요.');
    return verified.backup;
  }
  async function exclusively(fn) {
    return lock(async available=>{
      if(!available)throw textError('다른 앱 창에서 백업 파일을 쓰고 있어요. 잠시 뒤 다시 확인해 주세요.');
      return fn();
    });
  }
  function failed(error) {
    if(error?.name==='AbortError')return;
    setPhase('error',error?.name==='NotAllowedError'?'파일 접근 권한이 없어요. 다시 허용해 주세요.':error?.name==='NotFoundError'?'연결한 백업 파일을 찾지 못했어요. 파일을 다시 선택해 주세요.':error.message||'자동 파일 백업을 멈췄어요. 기기 기록은 유지해요.');
  }
  async function initialize() {
    if(!supported)return;
    try {
      await exclusively(async()=>{
        connection=await handleStore.get();
        if(!connection){setPhase('off');return;}
        if(!connection.handle?.getFile||!connection.lastData)throw textError('파일 연결 정보를 읽지 못했어요. 기존 파일을 다시 연결해 주세요.');
        if(!await permission(connection.handle))return;
        const file=await read(connection.handle);
        if(!file.backup)throw textError('연결한 백업 파일이 비어 있어요. 현재 기기 기록으로 덮어쓰지 않고 확인을 기다려요.');
        const snapshot=storage.inspect(),device=snapshot.data;
        if(Object.values(snapshot.statuses).includes('unavailable'))throw textError('기기 원본을 읽지 못해 파일을 불러오지 않았어요. 원본을 지우지 말고 다시 열어 주세요.');
        if(connection.loadFile&&!same(file.backup.data,connection.lastData)) {
          pending={handle:connection.handle,file,device};setPhase('conflict','선택한 뒤 파일 기록이 바뀌었어요. 사용할 기록을 다시 확인해 주세요.');
        } else if(!connection.loadFile&&Date.parse(file.backup.exportedAt)<Date.parse(connection.savedAt)&&!same(file.backup.data,connection.lastData)) {
          // Replacing the linked document with an older download must not rewind progress.
          if(!hasRecords(device)&&hasRecords(connection.lastData))storage.restore(connection.lastData,{resume:true});
          pending={handle:connection.handle,file,device:storage.inspect().data};setPhase('conflict','파일이 최근 저장 기록보다 오래됐어요. 최신 기기 기록을 유지하고 확인을 기다려요.');
        } else if(same(device,file.backup.data)) {
          await remember({...connection,loadFile:false,lastData:device,savedAt:file.backup.exportedAt});setPhase('ready');
        } else if(connection.loadFile||!readable(snapshot)||(!hasRecords(device)&&hasRecords(file.backup.data))||same(device,connection.lastData)) {
          storage.restore(file.backup.data,{resume:true});
          await remember({...connection,loadFile:false,lastData:file.backup.data,savedAt:file.backup.exportedAt});setPhase('ready','자동 백업 파일에서 기록을 불러왔어요.');
        } else if(same(file.backup.data,connection.lastData)) {
          // The browser copy contains changes saved before a previous file write finished.
          dirty=true;setPhase('pending','기기에 남은 최신 기록을 같은 파일에 저장하고 있어요.');
        } else {
          pending={handle:connection.handle,file,device};setPhase('conflict','파일과 기기에 서로 다른 기록이 있어요. 사용할 기록을 확인해 주세요.');
        }
      });
    } catch(error){failed(error);}
  }
  function scheduleSave() {
    dirty=true;revision++;
    if(!connection||!['ready','pending','saving'].includes(phase))return;
    if(phase!=='saving')setPhase('pending');
    if(timer!==null)cancel(timer);
    timer=schedule(()=>{timer=null;void flush();},400);
  }
  async function flush() {
    if(timer!==null){cancel(timer);timer=null;}
    if(running)return running;
    if(!connection||!dirty||!['ready','pending','saving'].includes(phase))return;
    setPhase('saving');
    running=exclusively(async()=>{
      const meta=await handleStore.get();
      if(meta?.id!==connection.id)throw textError('다른 창에서 파일 연결을 바꿨어요. 앱을 다시 열어 주세요.');
      if(!await permission(connection.handle))return;
      const file=await read(connection.handle),data=local(),stamp=revision;
      if(storage.issue())throw textError('기기 원본 보호 중에는 자동 파일을 갱신하지 않아요. 기록 확인·백업을 열어 주세요.');
      if(!file.backup)throw textError('백업 파일이 비어 있어 갱신을 멈췄어요. 파일 연결을 확인해 주세요.');
      if(!same(file.backup.data,meta.lastData)&&!same(file.backup.data,data))throw textError('백업 파일이 다른 곳에서 바뀌었어요. 사용할 기록을 확인해 주세요.');
      if(!hasRecords(data)&&hasRecords(file.backup.data))throw textError('기기 기록이 비어 있어 기존 백업 파일을 보호하고 있어요.');
      const saved=same(data,file.backup.data)?file.backup:await writeFile(connection.handle,envelope(data,file.backup),file.text);
      await remember({...connection,lastData:data,savedAt:saved.exportedAt});
      dirty=stamp!==revision;setPhase(dirty?'pending':'ready');
    }).catch(failed).finally(()=>{running=null;if(dirty&&phase==='pending')scheduleSave();});
    return running;
  }
  async function choose(handle) {
    if(timer!==null){cancel(timer);timer=null;}
    if(running)await running;
    try {
      const file=await read(handle),device=local(true);pending={handle,file,device};priorChoice||={phase,message};
      setPhase('choosing');return pending;
    } catch(error){pending=null;if(priorChoice){const prior=priorChoice;priorChoice=null;setPhase(prior.phase,prior.message);}if(dirty&&['ready','pending'].includes(phase))scheduleSave();throw error;}
  }
  async function connect(source) {
    if(!pending)throw textError('먼저 자동 백업 파일을 선택해 주세요.');
    const choice=pending;
    // Request while still in the user's confirm-button gesture.
    if(!await permission(choice.handle,true))return false;
    return exclusively(async()=>{
      const device=local(source==='file');
      const stamp=revision;
      if(!same(device,choice.device))throw textError('확인하는 동안 기기 기록이 바뀌었어요. 파일을 다시 선택해 주세요.');
      const fresh=await read(choice.handle);
      if(fresh.text!==choice.file.text)throw textError('확인하는 동안 파일이 바뀌었어요. 파일을 다시 선택해 주세요.');
      const data=source==='file'?fresh.backup?.data:device;
      if(!data)throw textError('이 파일에는 불러올 기록이 없어요.');
      if(source==='device'&&storage.issue())throw textError('원본 보호 중에는 기기 기록으로 자동 파일을 바꾸지 않아요.');
      const saved=same(data,fresh.backup?.data)?fresh.backup:await writeFile(choice.handle,envelope(data,fresh.backup),fresh.text);
      const reload=source==='file'&&!same(device,data);
      await remember({id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,handle:choice.handle,lastData:data,savedAt:saved.exportedAt,loadFile:reload});
      pending=null;priorChoice=null;dirty=!reload&&stamp!==revision;setPhase(reload?'restarting':dirty?'pending':'ready');if(dirty)scheduleSave();return reload;
    });
  }
  async function disconnect() {
    if(timer!==null){cancel(timer);timer=null;}
    dirty=false;
    if(running)await running;
    await exclusively(async()=>{await handleStore.clear();connection=null;pending=null;dirty=false;setPhase(supported?'off':'unsupported');});
  }
  storage.onSaved(scheduleSave);
  return {
    initialize,flush,choose,connect,disconnect,
    start(){if(dirty)scheduleSave();},
    cancelChoice(){pending=null;const prior=priorChoice;priorChoice=null;setPhase(connection?(prior?.phase||phase):'off',connection?(prior?.message||message):'');if(dirty&&['ready','pending'].includes(phase))scheduleSave();},
    async retry(){if(connection&&!await permission(connection.handle,true))return false;return true;},
    state:()=>({supported,phase,message,name:connection?.handle?.name||pending?.handle?.name||'',savedAt:connection?.savedAt||'',connected:!!connection}),
    preview:()=>pending,
    onChange(fn){listeners.add(fn);return()=>listeners.delete(fn);}
  };
}

export function browserAutoFile(storage,version,win) {
  const supported=typeof win.showSaveFilePicker==='function'&&typeof win.showOpenFilePicker==='function'&&!!win.indexedDB&&!!win.navigator.locks;
  const lock=fn=>win.navigator.locks.request('french-alone-file-backup',{mode:'exclusive',ifAvailable:true},value=>fn(!!value));
  return createAutoFile({storage,version,handleStore:createFileHandleStore(win.indexedDB),supported,
    lock:supported?lock:async fn=>fn(true),schedule:win.setTimeout.bind(win),cancel:win.clearTimeout.bind(win)});
}
