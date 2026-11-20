import {RECORD_KEYS,RECORD_LABELS,MAX_BACKUP_BYTES,parseBackup,summarizeRecords} from './record-storage.js';

export function createRecordBackup({storage,version,dialog,content,dialogHeader,openDialog,focusDialog,escape,onRestored}) {
  const doc=content.ownerDocument, win=doc.defaultView;
  let pending=null, entries=[], generation=0;
  const dateLabel = value => Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString('ko-KR',{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '날짜 확인 필요';
  const summary = data => {
    const s=summarizeRecords(data);
    return `학습 ${s.days}일 · ${s.xp} XP · 스탬프 ${s.stamps}개 · 구매 ${s.purchases}개${s.drafts?` · 이어하기 ${s.drafts}개`:''}`;
  };
  function active() {return dialog.open && dialog.dataset.view==='backup';}
  function render(message='') {
    const status=storage.inspect();entries=status.backups;
    const available=Object.values(status.statuses).filter(value=>value==='ok').length;
    const allMissing=Object.values(status.statuses).every(value=>value==='missing');
    const warning=status.blocked?.message || (allMissing ? '이 앱의 저장 공간에서 기존 기록을 찾지 못했어요.' : '현재 기기에 남아 있는 기록이에요.');
    content.innerHTML=dialogHeader('기록 확인·백업')+`<div class="dialog-body backup-body">
      <section class="backup-overview"><p class="backup-kicker">서버 없이 · 내 기기에 보관</p><h3>${status.blocked?'원본 보호 중':allMissing?'기록 확인이 필요해요':'기록을 안전하게 챙겨요'}</h3><p>${escape(warning)}</p>
      <p class="backup-counts">${escape(summary(status.data))}</p>${status.blocked?'<p>보호 중에는 새 기록을 저장하지 않아요. 먼저 파일로 보관하거나 아래 보관본을 확인해 주세요.</p>':''}${Object.values(status.statuses).some(value=>['invalid','version'].includes(value))?'<p>읽지 못한 항목도 원본 그대로 파일에 담아요. 형식이 손상된 원본 파일은 바로 복원되지 않을 수 있어요.</p>':''}</section>
      <div class="backup-actions"><button type="button" class="primary-button" data-action="backup-export">백업 파일 저장</button><button type="button" class="secondary-button" data-action="backup-import">파일에서 불러오기</button></div>
      <input id="backup-file" type="file" accept=".json,application/json" hidden>
      <p class="backup-note">파일은 기기에 저장해요. 브라우저 데이터가 지워져도 되찾으려면 <b>다운로드한 파일을 앱 밖에 보관</b>해 주세요. 다른 기기에서는 이 파일을 불러오면 돼요.</p>
      <p id="backup-message" role="status" class="backup-message" ${message?'':'hidden'}>${escape(message)}</p>
      <div id="backup-preview"></div>
      <section class="backup-copies"><h3>이 기기의 보관본 <small>${entries.length}개</small></h3>
      ${entries.length?entries.map((entry,index)=>`<article class="backup-copy"><div><b>${escape(entry.label)}</b><time>${escape(dateLabel(entry.at))}</time><small>${escape(summary(entry.data))}</small></div><div class="backup-copy-actions"><button type="button" class="secondary-button" data-action="backup-preview" data-index="${index}" ${entry.restorable?'':'disabled'}>확인</button><button type="button" class="text-link" data-action="backup-copy-export" data-index="${index}">파일 저장</button></div></article>`).join(''):'<p>보관본이 없어요. 이전에 저장한 백업 파일이 있다면 불러와 주세요. 남아 있는 원본이나 파일이 없으면 사라진 기록을 재구성할 수 없어요.</p>'}
      <p class="backup-note">최근 기록 1개와 날짜별 첫 기록을 최대 3개 자동 보관해요. 기기 보관본도 브라우저 데이터를 삭제하면 함께 사라져요.</p>
      ${status.backupProblem?'<p class="inline-alert">자동 보관본을 읽거나 저장하지 못했어요. 남은 원본을 파일로 먼저 저장해 주세요.</p>':''}</section>
      <details class="backup-details"><summary>저장 상태 자세히 · 확인 내용 복사</summary><dl>${RECORD_KEYS.map(key=>`<div><dt>${RECORD_LABELS[key]}</dt><dd>${({ok:'기록 있음',missing:'기록 없음',invalid:'형식 확인 필요',version:'버전 확인 필요',unavailable:'읽기 실패'})[status.statuses[key]]}</dd></div>`).join('')}</dl>
      <p>${available} / 5개 항목을 읽었어요. ‘기록 없음’만으로 삭제 원인을 알 수는 없어요.</p><button class="secondary-button" type="button" data-action="backup-diagnostics">확인 내용 복사</button><textarea id="backup-diagnostics" aria-label="공유할 확인 내용" readonly hidden></textarea></details>
      <details class="backup-details"><summary>기기의 자동 정리 방지</summary><p>지원하는 브라우저에 기록을 자동 정리 대상에서 빼 달라고 요청해요. 사용자가 직접 데이터를 삭제하는 것까지 막지는 못해요.</p><button type="button" class="secondary-button" data-action="backup-persist">기기 저장 보호 요청</button></details>
      </div><div class="dialog-footer"><button type="button" class="secondary-button" data-action="settings">설정으로</button><button type="button" class="primary-button" data-action="close">닫기</button></div>`;
    focusDialog();
  }
  function notify(message) {
    if (!active()) return;
    const el=content.querySelector('#backup-message');el.hidden=false;el.textContent=message;
    el.scrollIntoView?.({block:'nearest'});
  }
  function preview(backup,label) {
    pending={data:backup.data,at:backup.exportedAt||backup.at,label};
    const current=storage.inspect();
    content.querySelector('#backup-preview').innerHTML=`<section class="backup-confirm" aria-labelledby="backup-confirm-title" tabindex="-1"><h3 id="backup-confirm-title">${escape(label)}</h3><p>${escape(dateLabel(pending.at))}</p><p class="backup-counts">${escape(summary(pending.data))}</p><p>현재 기록(${escape(summary(current.data))})을 이 기록으로 바꿔요. 서로 합치지는 않아요. 바꾸기 전 원본도 기기에 따로 보관해요.</p><div class="backup-actions"><button class="primary-button" type="button" data-action="backup-restore">이 기록으로 복원</button><button class="secondary-button" type="button" data-action="backup-cancel">취소</button></div></section>`;
    const panel=content.querySelector('.backup-confirm');panel.focus({preventScroll:true});panel.scrollIntoView?.({block:'nearest'});
  }
  function download(text) {
    if (!win.URL.createObjectURL) throw new Error('이 화면에서는 파일을 저장할 수 없어요. 설치에 사용한 브라우저에서 같은 앱을 열어 주세요.');
    const url=win.URL.createObjectURL(new win.Blob([text],{type:'application/json;charset=utf-8'}));
    const link=doc.createElement('a');link.href=url;link.download=`french-alone-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
    doc.body.append(link);link.click();link.remove();win.setTimeout(()=>win.URL.revokeObjectURL(url),30000);
    notify('파일 저장을 요청했어요. 기기의 다운로드 목록에서 JSON 파일이 있는지 확인해 주세요.');
  }
  function diagnosticText() {
    const status=storage.inspect();
    return [`French Alone v${version}`,`주소: ${win.location.origin}${win.location.pathname}`,
      `실행: ${win.matchMedia?.('(display-mode: standalone)').matches||win.navigator.standalone?'설치 앱':'브라우저'}`,
      `브라우저: ${win.navigator.userAgent}`,`보호: ${status.blocked?.kind||'없음'}`,
      ...RECORD_KEYS.map(key=>`${RECORD_LABELS[key]}: ${status.statuses[key]}`),
      summary(status.data),`기억한 문항 ${status.summary.cards}개 / 기초 완료 ${status.summary.lessons}개 / 저장 표현 ${status.summary.favorites}개 / 문법 열람 ${status.summary.grammar}개`,
      `보관본: ${status.backups.length}개 / 자동 보관 오류: ${status.backupProblem?'있음':'없음'}`].join('\n');
  }
  content.addEventListener('click',async event=>{
    const button=event.target.closest('[data-action]');
    if (!active() || !button || button.disabled) return;
    const action=button.dataset.action;
    if (!action.startsWith('backup-')) return;
    try {
      if (action==='backup-export') download(storage.exportCurrent(version));
      else if (action==='backup-import') content.querySelector('#backup-file').click();
      else if (action==='backup-copy-export') {
        const entry=entries[Number(button.dataset.index)];if(entry)download(storage.exportData(entry.data,version));
      } else if (action==='backup-preview') {
        const entry=entries[Number(button.dataset.index)];if(entry?.restorable)preview(entry,entry.label);
      } else if (action==='backup-cancel') {pending=null;content.querySelector('#backup-preview').replaceChildren();}
      else if (action==='backup-restore' && pending) {
        button.disabled=true;storage.restore(pending.data);pending=null;
        notify('기록을 복원했어요. 앱을 다시 열고 있어요.');
        onRestored();
      } else if (action==='backup-diagnostics') {
        const text=diagnosticText(),area=content.querySelector('#backup-diagnostics');area.hidden=false;area.value=text;
        try {await win.navigator.clipboard.writeText(text);notify('확인 내용을 복사했어요. 이 내용을 대화에 붙여 넣어 주세요.');}
        catch {area.focus();area.select();notify('아래 확인 내용을 길게 눌러 복사해 주세요.');}
      } else if (action==='backup-persist') {
        if (!win.navigator.storage?.persist) notify('이 브라우저는 저장 보호 요청을 지원하지 않아요. 백업 파일을 따로 보관해 주세요.');
        else {
          const accepted=await win.navigator.storage.persist();
          notify(accepted?'이 브라우저에서 자동 정리 방지를 허용했어요. 백업 파일도 함께 보관해 주세요.':'브라우저가 아직 저장 보호를 허용하지 않았어요. 백업 파일을 따로 보관해 주세요.');
        }
      }
    } catch (error) {notify(error.message);if(button.isConnected)button.disabled=false;}
  });
  content.addEventListener('change',async event=>{
    if (event.target.id!=='backup-file' || !active()) return;
    const file=event.target.files?.[0], token=++generation;
    event.target.value='';pending=null;content.querySelector('#backup-preview').replaceChildren();
    if (!file) return;
    try {
      if (file.size>MAX_BACKUP_BYTES) throw new Error('백업 파일은 5MB 이하만 열 수 있어요.');
      const text=await file.text(), backup=parseBackup(text);
      if (token===generation && active()) preview(backup,'불러온 백업 파일');
    } catch (error) {if(token===generation)notify(error.message);}
  });
  return {
    open(){generation++;pending=null;dialog.dataset.view='backup';openDialog();render();},
    close(){generation++;pending=null;},
    diagnosticText
  };
}
