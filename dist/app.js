import { lessons, phrases, getPhrases } from './data.js';
import { STORAGE_KEY, freshState, readState, today, makeQuestions, finishLesson, streak, totalXP } from './core.js';
import { createPractice } from './practice.js';
import { normalizeAnswer } from './practice-core.js';
import { playFeedback } from './feedback.js';
import { bindStudyViewport } from './study-viewport.js';
import { companionMessage } from './companion.js';
import { createGrammar } from './grammar.js';
import { renderGrammarText } from './grammar-terms.js';
import { learningRecords, WEEKDAYS, weekDates } from './records-core.js';
import { createRecords } from './records.js';
import { createRoom } from './room.js';
import { stampsForQuestions } from './room-core.js';
import { createRecordStorage } from './record-storage.js';
import { createRecordBackup } from './record-backup.js';
import { browserAutoFile } from './record-autofile.js';

const APP_VERSION = '1.23.0';
const $ = selector => document.querySelector(selector);
const icon = (name, cls='') => `<svg aria-hidden="true" class="${cls}"><use href="#i-${name}"/></svg>`;
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let rawStorage;
try { rawStorage = window.localStorage; } catch { rawStorage = {getItem:()=>{throw new Error('unavailable');}}; }
const storage = createRecordStorage(rawStorage,{schedule:window.setTimeout.bind(window),cancel:window.clearTimeout.bind(window)});
const autoFile=browserAutoFile(storage,APP_VERSION,window);
if(autoFile.state().supported&&$('.app-loading p'))$('.app-loading p').textContent='기기 기록과 연결된 백업 파일을 확인하고 있어요';
await autoFile.initialize();
let state = readState(storage);
let page = 'home', lessonView = 'practice', lessonFilter = '전체', vocabFilter = '전체 표현', query = '', session = null, restoreFocus = null, toastTimer;
const openVocabTopics = new Set();
let progressExpanded = false;
const dialog = $('#study-dialog');
const content = $('#dialog-content');
bindStudyViewport(dialog);
let storageWarning = false;
const grammar=createGrammar({storage,icon,escape,onSaveError:saveError});
const practice = createPractice({
  storage, content, dialogHeader, focusDialog, icon, escape,
  openDialog:()=>{session=null;dialog.dataset.view='practice';if(window.speechSynthesis)window.speechSynthesis.cancel();openDialog();},
  closeDialog, speak:speakText, playFeedback:kind=>playFeedback(kind,state.effects,state.effectsVolume),
  openGrammar:(id,options)=>grammar.open(id,options),
  onSaveError:saveError,
  onLevelChange:()=>renderPage(),
  rewardNote:()=>room.rewardNote(), renderMascot:mood=>room.avatar(mood),
  onFinish:summary=>{if(summary.duplicate)return;const activity=state.activity[summary.date||today()] ||= {xp:0,words:0,basicQuestions:0,basicRounds:0};activity.xp+=summary.xp;activity.words+=summary.newSentences;persist();room.onProgress();}
});
const room = createRoom({storage,getDays:()=>practice.dayRecords(),icon,onChange:()=>renderPage(),onSaveError:saveError});
const records = createRecords({getRecords:()=>learningRecords(state.activity,practice.dayRecords()),getRoom:date=>room.snapshot(date),icon,escape});
const recordBackup = createRecordBackup({storage,version:APP_VERSION,dialog,content,dialogHeader,openDialog,focusDialog,escape,autoFile,onRestored:()=>window.location.reload()});
storage.onIssue(updateStorageNotice);
autoFile.onChange(updateStorageNotice);
function saveError() {storageWarning=true;toast(storage.issue()?.message||'기기에 기록을 저장하지 못했어요. 설정에서 기록 확인·백업을 열어 주세요.');}
function updateStorageNotice() {
  document.querySelector('#storage-notice')?.remove();
  const issue=storage.issue(),file=autoFile.state(),attention=['permission','conflict','error','paused'].includes(file.phase);
  const label=$('.home-play-meta > span');if(label)label.textContent=issue?'저장 중단':file.connected?(file.phase==='ready'?'기기·파일 저장됨':attention?'기기 저장 · 백업 확인':'파일 저장 중'):'자동 저장';
  if(!issue&&!storage.backupWarning()&&!attention)return;
  $('#main').insertAdjacentHTML('afterbegin',`<aside id="storage-notice" class="storage-notice" role="status"><p>${escape(issue?.message||(attention?file.message:'자동 보관본을 읽거나 저장하지 못했어요. 남은 기록을 백업 파일로 보관해 주세요.'))}</p><button class="secondary-button" data-action="backup-open">기록 확인·백업</button></aside>`);
  if(issue)document.querySelectorAll('.autosave-label').forEach(label=>{label.textContent='저장 중단';});
  else if(attention&&file.connected)document.querySelectorAll('.autosave-label').forEach(label=>{label.textContent='파일 백업 확인';});
}
function persist() {
  try {storage.setItem(STORAGE_KEY,JSON.stringify(state));}
  catch {saveError();}
  updateHeader();
}
function toast(message) {
  const notice=$('#toast');if(!notice)return;
  const host=$('#grammar-dialog').open?$('#grammar-dialog'):dialog.open?dialog:document.body;if(notice.parentElement!==host)host.append(notice);
  clearTimeout(toastTimer);notice.textContent=message;notice.classList.add('visible');
  toastTimer=setTimeout(()=>notice.classList.remove('visible'),3500);
}
function updateHeader() { $('#header-streak').innerHTML=`${icon('flame')} ${streak(state)}일 연속`; }
const nextLesson = () => lessons.find(l=>!state.completed.includes(l.id)) || lessons[0];
const phraseById = id => phrases.find(p=>p.id===id);
const expressionCount = () => new Set([...state.mastered.map(id=>normalizeAnswer(phraseById(id).fr)),...practice.independentExpressions()]).size;
function favoriteButton(id) {const saved=state.favorites.includes(id);return `<button class="icon-button ${saved?'saved':''}" data-action="favorite" data-id="${id}" aria-label="${saved?'단어장에서 삭제':'단어장에 저장'}" aria-pressed="${saved}">${icon('heart')}</button>`;}
function lessonCard(lesson) {
  const index=lessons.indexOf(lesson)+1,done=state.completed.includes(lesson.id),progress=state.lessonProgress[lesson.id];
  const status=done?'complete':progress?'in-progress':'not-started';
  const count=getPhrases(lesson.id).length;
  const pct=done?100:progress?Math.round(progress.phase==='learn'?(progress.index/count*50):(50+progress.answers.length/count*50)):0;
  const label=done?'완료':progress?'진행 중':'시작 전';
  return `<button class="lesson-card status-${status}" data-action="lesson" data-id="${lesson.id}" aria-label="${escape(lesson.title)}, ${label}, ${pct}%"><span class="lesson-icon ${lesson.color}">${icon(lesson.icon)}</span><span class="lesson-copy"><span class="lesson-overline">LESSON ${String(index).padStart(2,'0')} · ${lesson.category}</span><h3>${escape(lesson.title)}</h3><p>${escape(lesson.subtitle)} · ${count}개 표현</p><span class="lesson-mini-track" aria-hidden="true"><span style="width:${pct}%"></span></span><small class="lesson-percent">${pct}% 학습</small></span><span class="lesson-status"><span class="lesson-badge">${label}</span>${icon(done?'check':'chevron')}</span></button>`;
}
function heading(title) {return `<div class="page-heading"><h1>${title}</h1><span class="date-label">${new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long'})}</span></div>`;}
function renderHome() {
  const resume=practice.resumeInfo(),progress=practice.dailyProgress(),stamp=progress.questions>=3;
  const next=practice.recommended();
  const basicResume=lessons.find(lesson=>state.lessonProgress[lesson.id]);
  const roomMarkup='<div class="home-room-view"><div class="room-entry-actions" role="group" aria-label="루의 방"><button data-action="room-open">'+icon('home')+'방 꾸미기</button><button data-action="room-closet">'+icon('bag')+'루의 옷장</button></div>'+room.renderScene(stamp?'complete':'wave')+'</div>';
  return '<div class="page-heading home-heading play-home-heading"><div><h1>루와, 가볍게 한 판.</h1></div><a class="home-streak" href="#progress">'+icon('flame')+streak(state)+'일</a></div>'+
    practice.renderLevelPicker()+'<div class="play-home-grid"><section class="hero play-home-hero" aria-label="오늘의 한 판"><div class="today-line"><span>'+icon('sparkles')+(resume?'이어서 한 판':stamp?'오늘도 해냈어요':practice.level()==='intermediate'?'오늘의 중급 한 판':'오늘의 한 판')+'</span><span class="stamp-label '+(stamp?'is-done':'')+'">'+icon(stamp?'check':'sun')+(stamp?'오늘 스탬프 '+stampsForQuestions(progress.questions)+'개':'오늘 '+Math.min(progress.questions,3)+' / 3')+'</span></div><div class="home-highlights"><div class="home-lesson-actions">'+
    '<div class="home-mission"><h2>'+(resume?'멈춘 곳부터 이어가요.':stamp?'한 번 더 해볼까요?':'다섯 문제면 충분해요.')+'</h2><p>'+(resume?escape(resume.title)+' · '+(resume.total-resume.index)+'문제 남음':practice.level()==='intermediate'?escape(next.title)+' · 읽고, 직접 쓰기':'<span lang="fr">'+escape(next.pattern.split('+')[0].trim())+'</span> · 읽고, 맞추고, 직접 쓰기')+'</p></div>'+
    '<button class="primary-button home-play" data-action="'+(resume?'practice-resume':'practice-daily')+'">'+(resume?'이어서 학습하기':'5문제 시작')+icon('arrow')+'</button>'+
    '<div class="home-play-meta"><span>'+icon('check')+(storage.issue()?'저장 중단':'자동 저장')+'</span><button class="text-link" data-action="practice-light">가볍게 3문제</button></div>'+(basicResume?'<button class="home-basic-resume text-link" data-action="lesson" data-id="'+basicResume.id+'">'+icon('book')+'<span>'+escape(basicResume.subtitle)+' 이어하기</span>'+icon('chevron')+'</button>':'')+'</div>'+roomMarkup+'</div></section>'+
    '<aside class="play-home-side">'+room.renderSummary()+
    '<section class="side-card goal-card home-week"><div class="goal-heading"><h2>이번 주의 발자국</h2><a class="text-link" href="#progress">기록 보기'+icon('chevron')+'</a></div><div class="goal-days">'+weekDates().map((d,i)=>'<div class="day '+(today(d)===today()?'today ':'')+(state.activity[today(d)]?'done':'')+'" aria-label="'+(d.getMonth()+1)+'월 '+d.getDate()+'일 '+(state.activity[today(d)]?'학습 완료':'학습 기록 없음')+'">'+WEEKDAYS[i]+'<span>'+(state.activity[today(d)]?icon('check'):d.getDate())+'</span></div>').join('')+'</div>'+(state.activity[today()]?'<button class="home-record-link" data-action="record-open">'+icon('sparkles')+'오늘 학습 인증</button>':'')+'</section></aside></div>'+
    '<nav class="home-destinations" aria-label="다른 학습"><a href="#lessons" data-action="open-practice"><span>'+icon('book')+'</span><div><b>코스 골라보기</b><small>21개 코스 · 420문제</small></div>'+icon('chevron')+'</a><a href="#vocabulary" data-action="open-saved"><span>'+icon('cards')+'</span><div><b>나의 단어장</b><small>저장한 표현 '+state.favorites.length+'개</small></div>'+icon('chevron')+'</a><a href="#lessons" data-action="open-basics"><span>'+icon('sun')+'</span><div><b>기초 표현</b><small>짧게 익히는 한마디</small></div>'+icon('chevron')+'</a></nav>';
}
function renderLessons() {
  const tabs = `<div class="learning-tabs" role="group" aria-label="학습 종류"><button data-action="lesson-view" data-value="practice" aria-pressed="${lessonView==='practice'}">문장 연습 <span>${practice.questionCount()}문제</span></button><button data-action="lesson-view" data-value="basics" aria-pressed="${lessonView==='basics'}">기초 표현 <span>${phrases.length}개</span></button></div>`;
  if(lessonView==='practice')return `${heading('학습')}${tabs}${practice.renderLibrary()}`;
  const visible=lessons.filter(l=>lessonFilter==='전체'||l.category===lessonFilter);
  const ongoing=lessons.filter(l=>!state.completed.includes(l.id)&&state.lessonProgress[l.id]).length;
  const untouched=lessons.length-state.completed.length-ongoing;
  return `${heading('학습')}${tabs}<div class="section-heading basics-heading"><div><h2>기초 표현 사전</h2></div><span class="section-count">${phrases.length}개 표현</span></div><div class="lesson-status-key" aria-label="레슨 상태"><span class="key-done">완료 <b>${state.completed.length}</b></span><span class="key-active">진행 중 <b>${ongoing}</b></span><span class="key-new">시작 전 <b>${untouched}</b></span></div><div class="filter-row" aria-label="레슨 분류">${['전체','첫걸음','일상 회화','여행 회화'].map(f=>`<button class="filter-button ${lessonFilter===f?'active':''}" data-action="lesson-filter" data-value="${f}" aria-pressed="${lessonFilter===f}">${f}</button>`).join('')}</div><div class="course-grid">${visible.map(lessonCard).join('')}</div>`;
}
function visiblePhrases() {
  const q=query.trim().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  return phrases.filter(p=>(vocabFilter!=='저장한 표현'||state.favorites.includes(p.id))&&(vocabFilter!=='틀린 표현'||state.mistakes.includes(p.id))&&(!q||[p.fr,p.ko,p.pronunciation].some(t=>t.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().includes(q))));
}
function phraseListHTML() {
  const deck=visiblePhrases();
  if(!deck.length) return `<div class="empty-state">${icon('cards')}<h3>${query?'검색 결과가 없어요':vocabFilter==='틀린 표현'?'아직 틀린 표현이 없어요':'저장한 표현이 없어요'}</h3>${query?'<button class="secondary-button" data-action="clear-search">검색어 지우기</button>':'<button class="secondary-button" data-action="vocab-filter" data-value="전체 표현">전체 표현 둘러보기</button>'}</div>`;
  const grouped=vocabFilter==='전체 표현'&&!query.trim();
  function card(p){
    const meta=grouped?'':`<div class="expression-meta">${p.category} · ${lessons.find(l=>l.id===p.lessonId).subtitle}</div>`;
    return `<article class="expression">${meta}${favoriteButton(p.id)}<p class="fr" lang="fr">${escape(p.fr)}</p><p class="pronunciation">[ ${escape(p.pronunciation)} ]</p><p class="ko">${escape(p.ko)}</p><div class="phrase-actions"><button class="sound-button" data-action="phrase-detail" data-id="${p.id}">${icon('book')}자세히</button><details class="phrase-usage"><summary>용법</summary><p>${renderGrammarText(p.note,escape)}</p></details><button class="sound-button" data-action="speak" data-id="${p.id}" aria-label="${escape(p.fr)} 발음 듣기">${icon('sound')}듣기</button></div></article>`;
  }
  if(!grouped)return deck.map(card).join('');
  return lessons.map(lesson=>{
    const items=getPhrases(lesson.id);
    return `<details class="reference-group vocab-group" data-vocab-topic="${lesson.id}" ${openVocabTopics.has(lesson.id)?'open':''}><summary>${escape(lesson.subtitle)}<small>${items.length}개 표현</small></summary><div class="topic-review"><button type="button" class="sound-button" data-action="review-topic" data-id="${lesson.id}" aria-label="${escape(lesson.subtitle)} ${items.length}개 표현 복습">${icon('cards')}${items.length}개 표현 복습</button></div><div class="phrase-group-items">${items.map(card).join('')}</div></details>`;
  }).join('');
}
function rememberVocabTopics(){
  document.querySelectorAll('[data-vocab-topic]').forEach(group=>{
    if(group.open)openVocabTopics.add(group.dataset.vocabTopic);
    else openVocabTopics.delete(group.dataset.vocabTopic);
  });
}
function renderVocabulary() {
  return `${heading('단어장')}<div class="vocab-top"><div class="search-box">${icon('search')}<label class="visually-hidden" for="phrase-search">표현 검색</label><input id="phrase-search" type="search" placeholder="프랑스어 또는 한국어로 검색" value="${escape(query)}" autocomplete="off"><button class="search-clear" data-action="clear-search" type="button" aria-label="검색어 지우기" ${query?'':'hidden'}>${icon('close')}</button></div><button id="vocab-review" class="primary-button" data-action="review" ${visiblePhrases().length?'':'disabled'}>${icon('cards')}카드로 복습하기</button></div><div class="filter-row" aria-label="단어장 분류">${['전체 표현','저장한 표현','틀린 표현'].map(f=>`<button class="filter-button ${vocabFilter===f?'active':''}" data-action="vocab-filter" data-value="${f}" aria-pressed="${vocabFilter===f}">${f} <span>${f==='전체 표현'?phrases.length:f==='저장한 표현'?state.favorites.length:state.mistakes.length}</span></button>`).join('')}</div><div id="search-count" class="search-result-count" role="status">${visiblePhrases().length}개 표현</div><div class="phrase-list" id="phrase-list">${phraseListHTML()}</div>`;
}
function renderProgress() {
  const dates=weekDates(),maxXP=Math.max(80,...dates.map(d=>state.activity[today(d)]?.xp||0));
  return `${heading('기록')}${records.render()}<details class="reference-group progress-more" ${progressExpanded?'open':''}><summary>주간·누적 학습 기록</summary><div class="progress-more-body">${practice.renderStats()}<div class="summary-grid">${[['flame',streak(state)+'일','연속 학습'],['book',(expressionCount())+'개','익힌 표현'],['check',state.completed.length+'개','완료한 기초 레슨'],['sparkles',totalXP(state)+' XP','총 경험치']].map(([i,n,t])=>`<div class="summary-card">${icon(i)}<strong>${n}</strong><p>${t}</p></div>`).join('')}</div><div class="progress-layout"><section class="progress-panel"><h2>이번 주의 발자국</h2><div class="week-chart" aria-label="이번 주 일별 경험치">${dates.map((d,i)=>{const xp=state.activity[today(d)]?.xp||0;return `<div class="bar-column" aria-label="${WEEKDAYS[i]}요일 ${xp} XP"><strong>${xp}</strong><div class="bar" style="height:${Math.max(4,xp/maxXP*105)}px"></div><span>${WEEKDAYS[i]}</span></div>`;}).join('')}</div></section><section class="progress-panel"><h2>기초 레슨</h2><div class="progress-track"><span style="width:${state.completed.length/lessons.length*100}%"></span></div><div class="progress-fraction"><span>${Math.round(state.completed.length/lessons.length*100)}% 완료</span><span>${state.completed.length} / ${lessons.length} 레슨</span></div><button class="primary-button" data-action="lesson" data-id="${nextLesson().id}">${state.completed.length===lessons.length?'다시 복습하기':'다음 레슨 시작하기'}${icon('arrow')}</button></section></div><div class="section-heading"><h2>완료한 레슨</h2><button class="text-link" data-action="settings">학습 설정 ${icon('settings')}</button></div>${state.completed.length?`<div class="progress-panel">${lessons.filter(l=>state.completed.includes(l.id)).map(l=>`<div class="completed-row"><span>${icon('check')}${l.title}</span><button class="text-link" data-action="lesson" data-id="${l.id}">다시 학습 ${icon('chevron')}</button></div>`).join('')}</div>`:`<div class="empty-state">${icon('sun')}<h3>완료한 기초 레슨이 없어요.</h3><button class="primary-button" data-action="lesson" data-id="greetings">첫 레슨 시작하기 ${icon('arrow')}</button></div>`}</div></details>`;
}
function renderPage() {
  rememberVocabTopics();
  const more=$('.progress-more');if(more)progressExpanded=more.open;
  const labels={home:'오늘의 학습',lessons:'전체 레슨',vocabulary:'나의 단어장',grammar:'문법',progress:'학습 기록'};
  const route=location.hash.slice(1);page=Object.hasOwn(labels,route)?route:'home';
  $('#page-label').textContent=labels[page];document.title=`${labels[page]} · French Alone`;
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  $('#main').innerHTML=({home:renderHome,lessons:renderLessons,vocabulary:renderVocabulary,grammar:grammar.renderLibrary,progress:renderProgress}[page])();$('#main').insertAdjacentHTML('beforeend',`<footer class="app-version-footer">French Alone v${APP_VERSION} <span>·</span> © 2026 sidebatch</footer>`);updateHeader();updateStorageNotice();document.documentElement.classList.add('app-ready');$('#main').dataset.page=page;
}
function openDialog() {
  if(!dialog.open){restoreFocus=document.activeElement;dialog.showModal();}
}
function closeDialog() {
  recordBackup.close();
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  const notice=$('#toast');if(notice?.parentElement===dialog)document.body.append(notice);
  dialog.close();delete dialog.dataset.view;session=null;practice.stop();renderPage();
  const opener=restoreFocus?.dataset;
  const replacement=opener?.action&&[...$('#main').querySelectorAll('[data-action]')].find(button=>button.dataset.action===opener.action&&button.dataset.id===opener.id&&button.dataset.value===opener.value);
  (restoreFocus?.isConnected?restoreFocus:replacement||$('#main')).focus({preventScroll:true});
}
function dialogHeader(title,percent=0,label='',autosave=false) {
  return `<div class="dialog-header"><h2 id="dialog-title">${title}</h2><div class="dialog-header-meta">${autosave?`<span class="autosave-label">${icon('check')}${storage.issue()?'저장 중단':'자동 저장'}</span>`:''}${label?`<span class="dialog-step">${label}</span>`:''}</div><button class="icon-button" data-action="close" aria-label="${autosave?'저장하고 학습 닫기':'학습 닫기'}">${icon('close')}</button></div>${percent?`<div class="progress-track dialog-progress" role="progressbar" aria-label="학습 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(percent)}"><span style="width:${percent}%"></span></div>`:''}`;
}
function focusDialog() {content.querySelector('.dialog-body')?.setAttribute('tabindex','-1'); content.querySelector('.dialog-body')?.focus({preventScroll:true});}
function saveLessonDraft() {
  if(session?.type!=='lesson' || session.phase==='result')return;
  const current=session;
  state.lessonProgress[current.lesson.id]={phase:current.phase,index:current.index,selected:current.selected,answers:[...current.answers],questions:current.questions.map(q=>({id:q.phrase.id,choices:q.choices.map(p=>p.id)}))};
  persist();
}
function startLesson(id) {
  const lesson=lessons.find(l=>l.id===id);if(!lesson)return;
  practice.stop();dialog.dataset.view='lesson';
  const deck=getPhrases(id),saved=state.lessonProgress[id];
  const restored=saved?.phase==='quiz' && saved.questions.length===deck.length ? saved.questions.map(q=>({phrase:phraseById(q.id),choices:q.choices.map(phraseById)})) : [];
  const quiz=restored.length===deck.length&&restored.every(q=>q.phrase&&q.choices.every(Boolean));
  session={type:'lesson',lesson,deck,phase:quiz?'quiz':'learn',index:saved?Math.min(deck.length-1,saved.index):0,answers:quiz?[...saved.answers]:[],selected:quiz?saved.selected:null,questions:quiz?restored:[]};
  if(!quiz && saved?.phase==='quiz')session.index=0;
  openDialog();saveLessonDraft();renderSession();
}
function renderSession() {
  if(!session)return;
  if(session.type==='review')return renderReview();
  const s=session;
  if(s.phase==='learn'){
    const p=s.deck[s.index];
    content.innerHTML=`${dialogHeader(s.lesson.title,(s.index+1)/s.deck.length*50,`표현 ${s.index+1} / ${s.deck.length}`,true)}<div class="dialog-body center"><h3 class="big-french" lang="fr">${escape(p.fr)}</h3><p class="pronunciation">[ ${escape(p.pronunciation)} ]</p><p class="translation">${escape(p.ko)}</p><div class="study-controls"><button class="sound-button" data-action="speak" data-id="${p.id}">${icon('sound')}발음 듣기</button>${favoriteButton(p.id)}</div><details class="lesson-detail lesson-explanation"><summary>왜 이렇게 쓸까요?</summary><p>${renderGrammarText(p.note,escape)}</p></details></div><div class="dialog-footer"><button class="secondary-button" data-action="prev" ${s.index===0?'disabled':''}>이전 표현</button><button class="primary-button" data-action="next-learn">${s.index===s.deck.length-1?'퀴즈 시작하기':'다음 표현'}${icon('arrow')}</button></div>`;
  } else if(s.phase==='quiz') {
    const q=s.questions[s.index];const answered=s.selected!==null;
    const right=answered&&s.selected===q.phrase.id;
    content.innerHTML=`${dialogHeader('한마디 퀴즈',50+(s.index+1)/s.questions.length*50,`${s.index+1} / ${s.questions.length}`,true)}<div class="dialog-body center basic-quiz"><div class="dialog-eyebrow">뜻 고르기</div><h3 class="big-french" lang="fr">${escape(q.phrase.fr)}</h3><button class="sound-button" data-action="speak" data-id="${q.phrase.id}">${icon('sound')}다시 듣기</button><div class="quiz-choices ${q.choices.every(p=>p.ko.length<=16)?'short-choices':''}">${q.choices.map((p,i)=>`<button class="choice ${answered&&p.id===q.phrase.id?'correct':''} ${answered&&p.id===s.selected&&!right?'incorrect':''}" data-action="answer" data-id="${p.id}" ${answered?'disabled':''} aria-label="${escape(p.ko)}${answered&&p.id===q.phrase.id?', 정답':answered&&p.id===s.selected?', 내 오답':''}"><span>${i+1}</span>${escape(p.ko)}</button>`).join('')}</div>${answered?`<div class="answer-reveal ${right?'is-correct':'is-wrong'}" role="status"><div class="quiz-verdict">${room.avatar(right?"correct":"wrong")}<div><strong>${right?'정답이에요':'다시 기억할 표현'}</strong><p>${escape(q.phrase.ko)}</p></div></div><details><summary>왜?</summary><p>${renderGrammarText(q.phrase.note,escape)}</p></details></div>`:''}</div><div class="dialog-footer"><span class="dialog-step">${s.answers.filter(a=>a.correct).length}개 정답</span><button class="primary-button" data-action="next-question" ${!answered?'disabled':''}>${s.index===s.questions.length-1?'결과 확인하기':'다음 문제'}${icon('arrow')}</button></div>`;
  } else if(s.phase==='result') {
    const r=s.result;
    const wrongPhrases=s.answers.filter(a=>!a.correct).map(a=>phraseById(a.id)).filter(Boolean);
    content.innerHTML=`${dialogHeader('레슨 결과')}<div class="dialog-body center"><div class="lesson-companion">${companionMessage(r.passed?"complete":"wrong",room.avatar)}</div><h3 class="dialog-title">${r.passed?'레슨 완료':'다시 도전'}</h3>${r.passed?'':'<p class="explanation">5개 이상 맞히면 완료돼요.</p>'}<div class="result-stats"><div><strong>${r.correct} / ${r.total}</strong><span>맞힌 문제</span></div><div><strong>+${r.xp}</strong><span>획득한 XP</span></div></div><button class="text-link result-record-link" data-action="record-open">오늘 학습 인증 ${icon('sparkles')}</button>${wrongPhrases.length?`<section class="mistake-summary"><strong>다시 볼 표현 ${wrongPhrases.length}개</strong><ul>${wrongPhrases.map(p=>`<li><b lang="fr">${escape(p.fr)}</b><span>${escape(p.ko)}</span></li>`).join('')}</ul><button class="secondary-button" data-action="review-mistakes">틀린 표현만 카드로 복습</button></section>`:''}</div><div class="dialog-footer"><button class="secondary-button" data-action="${r.passed?'review-lesson':'retry'}">${r.passed?'배운 표현 복습':'한 번 더 도전'}</button><button class="primary-button" data-action="close">학습 마치기${icon('check')}</button></div>`;
  }
  focusDialog();
}
function startReview(deck) {
  if(!deck?.length) {
    const selected=visiblePhrases();
    deck=page==='vocabulary'?selected:phrases.filter(p=>state.mistakes.includes(p.id)||state.favorites.includes(p.id));
    if(!deck.length){toast('복습할 표현을 먼저 저장하거나 다른 분류를 선택해 주세요.');return;}
  }
  practice.stop();dialog.dataset.view='review';session={type:'review',deck,index:0,flipped:false,known:0,retry:[],done:false};openDialog();renderReview();
}
function renderReview() {
  const s=session;
  if(s.done) {
    content.innerHTML=`${dialogHeader('복습 완료')}<div class="dialog-body center"><div class="lesson-companion">${companionMessage("complete",room.avatar)}</div><h3 class="dialog-title">복습 완료</h3><p class="explanation">${s.known} / ${s.deck.length}개 기억</p></div><div class="dialog-footer">${s.retry.length?'<button class="secondary-button" data-action="review-retry">낯선 표현만 다시</button>':''}<button class="primary-button" data-action="close">복습 마치기 ${icon('check')}</button></div>`;
  } else {
    const p=s.deck[s.index];
    content.innerHTML=`${dialogHeader('한마디 복습',(s.index+1)/s.deck.length*100,`${s.index+1} / ${s.deck.length}`)}<div class="dialog-body center review-body"><div class="dialog-eyebrow">뜻 떠올리기</div><button class="flashcard ${s.flipped?'is-flipped':''}" data-action="flip" aria-label="${s.flipped?'프랑스어 보기':'카드를 눌러 뜻 확인'}"><span class="big-french" ${s.flipped?'':'lang="fr"'}>${escape(s.flipped?p.ko:p.fr)}</span>${s.flipped?'':`<span class="pronunciation">[ ${escape(p.pronunciation)} ]</span>`}<span class="hint">${s.flipped?'프랑스어 보기':'뜻 보기'} ↻</span></button>${s.flipped?`<details class="review-note lesson-explanation"><summary>용법 보기</summary><p>${renderGrammarText(p.note,escape)}</p></details>`:''}<div class="study-controls"><button class="sound-button" data-action="speak" data-id="${p.id}">${icon('sound')}발음 듣기</button>${favoriteButton(p.id)}</div></div><div class="dialog-footer flash-actions"><button class="secondary-button" data-action="review-answer" data-known="false" ${!s.flipped?'disabled':''}>아직 낯설어요</button><button class="primary-button" data-action="review-answer" data-known="true" ${!s.flipped?'disabled':''}>기억나요 ${icon('check')}</button></div>`;
  }
  focusDialog();
}
function renderSettings() {
  content.innerHTML=`${dialogHeader('설정')}<div class="dialog-body settings-body"><div class="settings-brand"><span class="brand-mark" aria-hidden="true">f<span>✦</span></span><div><h3>French Alone</h3><p>v${APP_VERSION} · © 2026 sidebatch</p></div></div><section class="settings-section"><h3>학습</h3><div class="settings-option"><label for="slow-speech">조금 천천히 듣기</label><input type="checkbox" role="switch" id="slow-speech" ${state.slow?'checked':''}></div><div class="settings-option"><label for="feedback-sounds">학습 효과음</label><input type="checkbox" role="switch" id="feedback-sounds" ${state.effects?'checked':''}></div><details class="settings-sound-tools help-item"><summary>효과음 크기 · 미리듣기</summary><div class="settings-sound-panel ${state.effects?"":"is-muted"}"><label class="sound-volume-label" for="effects-volume">효과음 크기<output id="effects-volume-value" for="effects-volume">${state.effectsVolume}%</output></label><input id="effects-volume" type="range" min="0" max="100" step="5" value="${state.effectsVolume}" ${state.effects?"":"disabled"}><div class="sound-previews" role="group" aria-label="효과음 미리듣기">${[["correct","정답"],["wrong","다시 도전"],["complete","완료"]].map(([kind,label])=>`<button type="button" data-action="preview-feedback" data-value="${kind}" ${state.effects&&state.effectsVolume?"":"disabled"}>${icon("sound")}${label}</button>`).join("")}</div><p class="sound-volume-note">기기 음량도 함께 적용돼요.</p></div></details><button class="settings-row-button" data-action="speak" data-id="greetings-0">${icon('sound')}프랑스어 발음 확인${icon('chevron')}</button><button class="settings-row-button" data-action="install-help">${icon('book')}앱 설치 · 오프라인 안내${icon('chevron')}</button></section><section class="settings-section"><h3>도움말</h3><details class="help-item"><summary>학습 기록은 어디에 저장되나요?</summary><p>진도·스탬프·구매 아이템은 현재 기기에 저장돼요. 기록 확인·백업에서 파일을 저장하거나 불러올 수 있어요. 자동 보관본도 브라우저 데이터를 지우면 함께 사라지니 백업 파일을 따로 보관해 주세요.</p></details><details class="help-item"><summary>학습을 중간에 닫아도 되나요?</summary><p>진행 중인 학습은 자동으로 저장돼요. 홈에서 이어서 풀 수 있어요.</p></details><details class="help-item"><summary>발음이 들리지 않아요.</summary><p>기기의 볼륨과 무음 설정을 확인해 주세요. 기기에 프랑스어 음성이 없으면 언어 설정에서 음성을 추가해야 할 수 있어요.</p></details></section><section class="settings-section settings-data"><h3>나의 학습 기록</h3><button class="settings-row-button" data-action="backup-open">${icon('book')}기록 확인·백업${icon('chevron')}</button>${storageWarning?'<div class="inline-alert">현재 기기에 기록을 저장하지 못하고 있어요. 브라우저 저장 공간 설정을 확인해 주세요.</div>':''}<button class="danger-button" data-action="reset-confirm">학습 기록 초기화</button><div id="reset-area"></div></section></div><div class="dialog-footer"><button class="primary-button" data-action="close">완료${icon('check')}</button></div>`;focusDialog();
}
function speak(id) {
  const p=phraseById(id);if(p)speakText(p.fr);
}
function speakText(text) {
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){toast('이 브라우저에서는 발음 듣기를 지원하지 않아요. Chrome 또는 Safari에서 사용해 주세요.');return false;}
  window.speechSynthesis.cancel();
  const utterance=new window.SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=state.slow?0.65:0.85;
  const voices=window.speechSynthesis.getVoices();const french=voices.find(v=>v.lang==='fr-FR')||voices.find(v=>v.lang.startsWith('fr'));
  if(french)utterance.voice=french;
  utterance.onerror=event=>{if(!['interrupted','canceled'].includes(event.error))toast('프랑스어 음성을 재생하지 못했어요. 기기의 프랑스어 음성 설정을 확인해 주세요.');};
  window.speechSynthesis.speak(utterance);
  return true;
}
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
  const {action,id,value}=button.dataset;
  switch(action) {
    case 'mascot-hello': {
      const bubble=button.querySelector('.companion-bubble');
      bubble.textContent='함께 한 판 해볼까요?';bubble.removeAttribute('lang');bubble.classList.add('is-greeting');
      button.querySelector('.mascot').outerHTML=room.avatar('wave');
      playFeedback('correct',state.effects,state.effectsVolume);break;
    }
    case 'preview-feedback':
      if(!playFeedback(value,state.effects,state.effectsVolume))toast('효과음을 재생할 수 없어요. 기기의 소리 설정을 확인해 주세요.');
      break;
    case 'lesson': startLesson(id);break;
    case 'phrase-detail': {
      const p=phraseById(id);if(!p)break;
      practice.stop();session=null;dialog.dataset.view='phrase';openDialog();
      content.innerHTML=`${dialogHeader('표현 자세히')}<div class="dialog-body phrase-detail-body"><span class="dialog-eyebrow">${escape(p.category)}</span><h3 class="big-french" lang="fr">${escape(p.fr)}</h3><p class="pronunciation">[ ${escape(p.pronunciation)} ]</p><p class="translation">${escape(p.ko)}</p><section class="phrase-explanation"><h4>용법 · 기억할 점</h4><p>${renderGrammarText(p.note,escape)}</p></section><div class="study-controls"><button class="sound-button" data-action="speak" data-id="${p.id}">${icon('sound')}발음 듣기</button>${favoriteButton(p.id)}</div></div><div class="dialog-footer"><button class="primary-button" data-action="close">닫기${icon('check')}</button></div>`;
      focusDialog();break;
    }
    case 'close': closeDialog();break;
    case 'speak': speak(id);break;
    case 'favorite': {
      if(!phraseById(id))break;
      const exists=state.favorites.includes(id);state.favorites=exists?state.favorites.filter(x=>x!==id):[...state.favorites,id];persist();
      document.querySelectorAll(`[data-action="favorite"][data-id="${id}"]`).forEach(b=>{b.classList.toggle('saved',!exists);b.setAttribute('aria-pressed',String(!exists));b.setAttribute('aria-label',exists?'단어장에 저장':'단어장에서 삭제');});
      if(!dialog.open){renderPage();(document.querySelector(`[data-action="favorite"][data-id="${id}"]`)||document.querySelector('[data-action="vocab-filter"][aria-pressed="true"]'))?.focus({preventScroll:true});}toast(exists?'단어장에서 삭제했어요.':'나의 단어장에 저장했어요.');break;
    }
    case 'open-practice':lessonView='practice';if(page==='lessons')renderPage();break;
    case 'open-basics':lessonView='basics';if(page==='lessons')renderPage();break;
    case 'lesson-view':lessonView=value==='basics'?'basics':'practice';renderPage();document.querySelector('[data-action="lesson-view"][data-value="'+lessonView+'"]')?.focus({preventScroll:true});break;
    case 'lesson-filter':lessonFilter=value;renderPage();$('[data-action="lesson-filter"][aria-pressed="true"]')?.focus({preventScroll:true});break;
    case 'vocab-filter':vocabFilter=value;renderPage();$('[data-action="vocab-filter"][aria-pressed="true"]')?.focus({preventScroll:true});break;
    case 'next-learn':
      if(session?.type!=='lesson'||session.phase!=='learn')break;
      if(session.index<session.deck.length-1)session.index++;
      else {session.phase='quiz';session.index=0;session.questions=makeQuestions(session.deck);}
      saveLessonDraft();renderSession();break;
    case 'prev':if(session?.phase==='learn'&&session.index>0){session.index--;saveLessonDraft();renderSession();}break;
    case 'answer': {
      if(session?.phase!=='quiz'||session.selected!==null)break;
      const q=session.questions[session.index];if(!q.choices.some(p=>p.id===id))break;
      session.selected=id;session.answers.push({id:q.phrase.id,correct:id===q.phrase.id});saveLessonDraft();playFeedback(id===q.phrase.id?'correct':'wrong',state.effects,state.effectsVolume);renderSession();content.querySelector('[data-action="next-question"]')?.focus({preventScroll:true});content.querySelector('.quiz-verdict')?.scrollIntoView?.({block:'nearest'});break;
    }
    case 'next-question':
      if(session?.phase!=='quiz'||session.selected===null)break;
      if(session.index<session.questions.length-1){session.index++;session.selected=null;saveLessonDraft();}
      else {session.result=finishLesson(state,session.lesson.id,session.answers);session.phase='result';playFeedback(session.result.passed?'complete':'wrong',state.effects,state.effectsVolume);if(session.result.passed)delete state.lessonProgress[session.lesson.id];else state.lessonProgress[session.lesson.id]={phase:'quiz',index:0,selected:null,answers:[],questions:session.questions.map(q=>({id:q.phrase.id,choices:q.choices.map(p=>p.id)}))};persist();}
      renderSession();break;
    case 'retry':if(session?.lesson)startLesson(session.lesson.id);break;
    case 'review-lesson':if(session?.deck)startReview(session.deck);break;
    case 'review-mistakes':if(session?.type==='lesson')startReview(session.deck.filter(p=>session.answers.some(a=>a.id===p.id&&!a.correct)));break;
    case 'review':startReview();break;
    case 'review-topic':if(lessons.some(lesson=>lesson.id===id))startReview(getPhrases(id));break;
    case 'flip':if(session?.type==='review'){session.flipped=!session.flipped;renderReview();content.querySelector('.flashcard')?.focus({preventScroll:true});}break;
    case 'review-answer': {
      if(session?.type!=='review'||!session.flipped||session.done)break;
      const p=session.deck[session.index];
      if(button.dataset.known==='true') {session.known++;state.mistakes=state.mistakes.filter(x=>x!==p.id);}
      else {session.retry.push(p);if(!state.mistakes.includes(p.id))state.mistakes.push(p.id);}
      persist();
      if(session.index<session.deck.length-1){session.index++;session.flipped=false;}else {session.done=true;playFeedback('complete',state.effects,state.effectsVolume);}
      renderReview();break;
    }
    case 'review-retry':if(session?.retry)startReview(session.retry);break;
    case 'settings':recordBackup.close();practice.stop();session=null;dialog.dataset.view='settings';openDialog();renderSettings();break;
    case 'backup-open':practice.stop();session=null;recordBackup.open();break;
    case 'install-help':closeDialog();$('#install-app')?.click();break;
    case 'open-saved':vocabFilter='저장한 표현';break;
    case 'clear-search':query='';renderPage();$('#phrase-search')?.focus();break;
    case 'reset-confirm':$('#reset-area').innerHTML='<div class="inline-alert">학습 기록·단어장·보유 소품·방 배치와 이 기기의 자동 보관본이 모두 삭제돼요. 자동 백업 파일 연결도 해제하며, 따로 저장한 파일 자체는 남겨요. 파일이 없으면 되돌릴 수 없어요.<br><button class="danger-button" data-action="reset" style="margin-top:12px">모든 기록 삭제하기</button> <button class="secondary-button" data-action="reset-cancel">취소</button></div>';break;
    case 'reset-cancel':$('#reset-area').innerHTML='';break;
    case 'reset':
      try {if(autoFile.state().connected)await autoFile.disconnect();storage.clearBackupsForReset();}
      catch(error){toast(error.message);break;}
      state=freshState();practice.reset();grammar.reset();records.reset();room.reset();persist();closeDialog();toast('기록을 초기화했어요. 새로운 시작을 응원해요.');break;
  }
});
document.addEventListener('input',event=>{
  if(event.target.id==='effects-volume'){
    state.effectsVolume=Number(event.target.value);persist();updateSoundControls();
  }
  if(event.target.id==='phrase-search'){rememberVocabTopics();query=event.target.value;$('#phrase-list').innerHTML=phraseListHTML();$('#search-count').textContent=`${visiblePhrases().length}개 표현`;$('.search-clear').hidden=!query;$('#vocab-review').disabled=!visiblePhrases().length;}
});
function updateSoundControls(){
  const slider=$('#effects-volume');if(!slider)return;
  slider.disabled=!state.effects;
  $('#effects-volume-value').textContent=state.effectsVolume+'%';
  slider.closest('.settings-sound-panel').classList.toggle('is-muted',!state.effects);
  document.querySelectorAll('[data-action="preview-feedback"]').forEach(button=>{button.disabled=!state.effects||!state.effectsVolume;});
}
document.addEventListener('keydown',event=>{
  if(event.target.id!=='phrase-search'||event.key!=='Enter'||event.isComposing)return;
  event.preventDefault();
  const result=$('#phrase-list summary, #phrase-list .expression .fr, #phrase-list .empty-state');
  if(result){
    if(!result.matches('summary'))result.setAttribute('tabindex','-1');
    result.focus({preventScroll:true});result.scrollIntoView?.({block:'nearest',behavior:'instant'});
  }
  else event.target.blur();
});
document.addEventListener('change',event=>{
  if(event.target.id==='slow-speech'){state.slow=event.target.checked;persist();}
  if(event.target.id==='feedback-sounds'){
    state.effects=event.target.checked;persist();updateSoundControls();
    if(state.effects)playFeedback('correct',true,state.effectsVolume);
  }
  if(event.target.id==='effects-volume')playFeedback('correct',state.effects,state.effectsVolume);
});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
window.addEventListener('hashchange',()=>{grammar.close(false);renderPage();window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});});
window.addEventListener('storage',event=>{if((event.key===STORAGE_KEY||event.key===practice.key||event.key===practice.draftKey||event.key===room.key||event.key===null)&&!dialog.open&&!grammar.isOpen()&&!records.isOpen()&&!room.isOpen()){state=readState(storage);practice.reload();room.reload();renderPage();}});
window.addEventListener('pagehide',()=>{storage.checkpoint();void autoFile.flush();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){storage.checkpoint();void autoFile.flush();}});
renderPage();
autoFile.start();
