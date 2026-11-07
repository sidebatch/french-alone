import { lessons, phrases, getPhrases } from './data.js';
import { STORAGE_KEY, freshState, readState, today, makeQuestions, finishLesson, streak, totalXP } from './core.js';
import { createPractice } from './practice.js';
import { normalizeAnswer } from './practice-core.js';
import { playFeedback } from './feedback.js';

const APP_VERSION = '1.2.0';
const $ = selector => document.querySelector(selector);
const icon = (name, cls='') => `<svg aria-hidden="true" class="${cls}"><use href="#i-${name}"/></svg>`;
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let storage;
try { storage = window.localStorage; } catch { storage = {getItem:()=>null,setItem:()=>{throw new Error('unavailable');}}; }
let state = readState(storage);
let page = 'home', lessonFilter = '전체', vocabFilter = '전체 표현', query = '', session = null, restoreFocus = null, toastTimer;
const dialog = $('#study-dialog');
const content = $('#dialog-content');
let storageWarning = false;
const practice = createPractice({
  storage, content, dialogHeader, focusDialog, icon, escape,
  openDialog:()=>{session=null;dialog.dataset.view='practice';if(window.speechSynthesis)window.speechSynthesis.cancel();openDialog();},
  closeDialog, speak:speakText, playFeedback:kind=>playFeedback(kind,state.effects),
  onSaveError:()=>{storageWarning=true;toast('브라우저 저장 공간을 사용할 수 없어 이번 방문 동안만 진도가 유지돼요.');},
  onFinish:summary=>{const activity=state.activity[today()] ||= {xp:0,words:0};activity.xp+=summary.xp;activity.words+=summary.newSentences;persist();}
});
function persist() {
  try {storage.setItem(STORAGE_KEY,JSON.stringify(state));}
  catch {storageWarning=true; toast('브라우저 저장 공간을 사용할 수 없어 이번 방문 동안만 진도가 유지돼요.');}
  updateHeader();
}
function toast(message) {
  const notice=$('#toast');if(!notice)return;
  const host=dialog.open?dialog:document.body;if(notice.parentElement!==host)host.append(notice);
  clearTimeout(toastTimer);notice.textContent=message;notice.classList.add('visible');
  toastTimer=setTimeout(()=>notice.classList.remove('visible'),3500);
}
function updateHeader() { $('#header-streak').innerHTML=`${icon('flame')} ${streak(state)}일 연속`; }
const nextLesson = () => lessons.find(l=>!state.completed.includes(l.id)) || lessons[0];
const phraseById = id => phrases.find(p=>p.id===id);
const expressionCount = () => new Set([...state.mastered.map(id=>normalizeAnswer(phraseById(id).fr)),...practice.independentExpressions()]).size;
const weekDates = () => {const now=new Date();const monday=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(d.getDate()+i);return d;});};
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
const parisArt = `<svg class="hero-art" viewBox="0 0 300 310" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><clipPath id="arch"><path d="M28 310V135a112 112 0 0 1 224 0v175Z"/></clipPath></defs><g clip-path="url(#arch)"><path fill="#f9f2dc" d="M10 10h270v320H10z"/><circle cx="205" cy="96" r="26" fill="#f3d6a1"/><path d="M0 217q82-22 160 6t140-3v100H0" fill="#d4dbba"/><path d="M0 259q112-35 300-12v73H0" fill="#c1cea3"/><path d="m140 38-4 54-17 72-43 97h18l30-60h46l30 60h18l-43-97-17-72-4-54Z" fill="#a6b28b"/><path d="M124 162h46M115 181h64M102 207h89M88 240h116" fill="none" stroke="#879971" stroke-width="5"/><path d="m142 88 13 33m-20 0 27 33m-39 10 57 39m-64 0 83 49m-23-88-58 39m64 0-85 49m61-131-28 33" fill="none" stroke="#899d74" stroke-width="2.5"/><path d="M118 269v-25a28 28 0 0 1 56 0v25" fill="#c1cea3"/><path fill="#e9d9bc" d="M-10 210h70v83h-70z"/><path fill="#b2bca2" d="m-18 209 44-38 42 38Z"/><g fill="#a0ac93"><path d="M4 222h11v17H4zm23 0h11v17H27zm-23 29h11v17H4zm23 0h11v17H27z"/></g><path fill="#e3cfb3" d="M230 194h74v99h-74z"/><path fill="#a6b294" d="m222 195 23-27h42l23 27Z"/><g fill="#a0ac93"><path d="M243 210h11v18h-11zm26 0h11v18h-11zm-26 31h11v18h-11zm26 0h11v18h-11z"/></g><path d="M-10 292q141-31 320 0v28H-10" fill="#aaba8b"/><path d="M245 274v-46m-22 30 22-17 23 17" stroke="#7c9468" stroke-width="4" fill="none"/><ellipse cx="246" cy="229" rx="23" ry="35" fill="#98aa7a"/><path d="M49 298v-48" stroke="#849869" stroke-width="4"/><ellipse cx="48" cy="245" rx="22" ry="30" fill="#91a775"/></g><path d="M28 310V135a112 112 0 0 1 224 0v175" fill="none" stroke="#d0d9bd" stroke-width="8"/><g fill="none" stroke="#889a75" stroke-width="1.7"><path d="m80 83 6 4 6-4m-39 26 5 3 5-3"/></g><path d="m272 126 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#b7c599"/><circle cx="17" cy="180" r="4" fill="#c5ceac"/></svg>`;
function renderHome() {
  const next=nextLesson(),doneToday=Boolean(state.activity[today()]);
  const recommendedPractice=practice.recommended(),resume=practice.resumeInfo(),due=practice.dueCount();
  const dailyPhrase=phrases[Math.floor(Date.now()/86400000)%phrases.length];
  const recommended=[next,...lessons.filter(l=>l.id!==next.id&&!state.completed.includes(l.id)),...lessons.filter(l=>l.id!==next.id&&state.completed.includes(l.id))].slice(0,2);
  const action=resume?'practice-resume':due?'practice-due':'practice-start';
  const heroTitle=escape(resume?.title||(due?'오늘의 복습':recommendedPractice.title));
  const heroDescription=resume?'':due?`${Math.min(10,due)}개 표현`:escape(recommendedPractice.pattern.split('+')[0].trim());
  const heroButton=resume?'이어서 학습하기':due?'오늘의 복습 시작':'10문제 시작하기';
  return `${heading('오늘')}<div class="dashboard-grid"><div class="main-column"><section class="hero" aria-label="오늘의 추천 학습"><div class="hero-copy"><span class="pill">${icon(resume?'book':due?'cards':'sparkles')}${resume?'이어서':due?'복습':'입문 A1'}</span><h2>${heroTitle}</h2>${heroDescription?`<p class="hero-target">${heroDescription}</p>`:''}<button class="primary-button" data-action="${action}" data-id="${recommendedPractice.id}">${heroButton}${icon('arrow')}</button><div class="hero-meta"><span>${icon('clock')}${resume?`${resume.index+1} / ${resume.total}문제`:'3–5분'}</span>${doneToday?`<span class="hero-goal is-done">${icon('check')}오늘 목표 달성</span>`:''}</div></div>${parisArt}</section><div class="stats-row"><div class="stat-card"><span class="stat-icon peach">${icon('flame')}</span><div><div class="stat-number">${streak(state)}<small>일</small></div><div class="stat-caption">연속 학습</div></div></div><div class="stat-card"><span class="stat-icon mint">${icon('book')}</span><div><div class="stat-number">${expressionCount()}<small>개</small></div><div class="stat-caption">익힌 표현</div></div></div><div class="stat-card"><span class="stat-icon lavender">${icon('sparkles')}</span><div><div class="stat-number">${totalXP(state)}<small>XP</small></div><div class="stat-caption">나의 경험치</div></div></div></div>${practice.renderLibrary()}<div class="section-heading"><div><h2>기초 레슨</h2></div><a class="text-link" href="#lessons">전체 보기${icon('chevron')}</a></div><div class="lesson-list">${recommended.map(lessonCard).join('')}</div></div><aside class="right-column" aria-label="나의 목표와 오늘의 표현"><section class="side-card goal-card"><h2>오늘 목표 ${icon(doneToday?'check':'sun')}</h2><div class="goal-content"><div class="goal-ring" style="--progress:${doneToday?100:0}%"><div>${doneToday?1:0}<span>/ 1판</span></div></div><div class="goal-copy"><b>${doneToday?'목표 달성':'한 판 학습'}</b></div></div><div class="goal-days">${weekDates().map((d,i)=>`<div class="day ${today(d)===today()?'today':''} ${state.activity[today(d)]?'done':''}" aria-label="${d.getMonth()+1}월 ${d.getDate()}일 ${state.activity[today(d)]?'학습 완료':'학습 기록 없음'}">${['월','화','수','목','금','토','일'][i]}<span>${state.activity[today(d)]?icon('check'):d.getDate()}</span></div>`).join('')}</div></section><section class="side-card phrase-card"><h2>오늘의 한마디 ${icon('sparkles')}</h2><p class="daily-french" lang="fr">${escape(dailyPhrase.fr)}</p><p class="daily-pronunciation">[ ${escape(dailyPhrase.pronunciation)} ]</p><p class="daily-meaning">${escape(dailyPhrase.ko)}</p><div class="phrase-actions"><button class="sound-button" data-action="speak" data-id="${dailyPhrase.id}">${icon('sound')}발음 듣기</button>${favoriteButton(dailyPhrase.id)}</div></section><a class="saved-shortcut" href="#vocabulary" data-action="open-saved"><span class="stat-icon mint">${icon('heart')}</span><div><b>나의 단어장 <span>${state.favorites.length}</span></b></div>${icon('chevron')}</a></aside></div>`;
}
function renderLessons() {
  const visible=lessons.filter(l=>lessonFilter==='전체'||l.category===lessonFilter);
  const ongoing=lessons.filter(l=>!state.completed.includes(l.id)&&state.lessonProgress[l.id]).length;
  const untouched=lessons.length-state.completed.length-ongoing;
  return `${heading('학습')} ${practice.renderLibrary()}<div class="lesson-status-key" aria-label="레슨 상태"><span class="key-done">완료 <b>${state.completed.length}</b></span><span class="key-active">진행 중 <b>${ongoing}</b></span><span class="key-new">시작 전 <b>${untouched}</b></span></div><div class="progress-panel"><div class="progress-fraction"><span>기초 레슨</span><b>${state.completed.length} / 8 완료</b></div><div class="progress-track"><span style="width:${state.completed.length/8*100}%"></span></div></div><div class="filter-row" aria-label="레슨 분류">${['전체','첫걸음','일상 회화','여행 회화'].map(f=>`<button class="filter-button ${lessonFilter===f?'active':''}" data-action="lesson-filter" data-value="${f}" aria-pressed="${lessonFilter===f}">${f}</button>`).join('')}</div><div class="course-grid">${visible.map(lessonCard).join('')}</div>`;
}
function visiblePhrases() {
  const q=query.trim().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  return phrases.filter(p=>(vocabFilter!=='저장한 표현'||state.favorites.includes(p.id))&&(vocabFilter!=='틀린 표현'||state.mistakes.includes(p.id))&&(!q||[p.fr,p.ko,p.pronunciation].some(t=>t.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().includes(q))));
}
function phraseListHTML() {
  const deck=visiblePhrases();
  if(!deck.length) return `<div class="empty-state">${icon('cards')}<h3>${query?'검색 결과가 없어요':vocabFilter==='틀린 표현'?'아직 틀린 표현이 없어요':'저장한 표현이 없어요'}</h3>${query?'<button class="secondary-button" data-action="clear-search">검색어 지우기</button>':'<button class="secondary-button" data-action="vocab-filter" data-value="전체 표현">전체 표현 둘러보기</button>'}</div>`;
  return deck.map(p=>`<article class="expression"><div class="expression-meta">${p.category} · ${lessons.find(l=>l.id===p.lessonId).subtitle}</div>${favoriteButton(p.id)}<p class="fr" lang="fr">${escape(p.fr)}</p><p class="pronunciation">[ ${escape(p.pronunciation)} ]</p><p class="ko">${escape(p.ko)}</p><div class="phrase-actions"><button class="sound-button" data-action="phrase-detail" data-id="${p.id}">${icon('book')}자세히</button><details class="phrase-usage"><summary>용법</summary><p>${escape(p.note)}</p></details><button class="sound-button" data-action="speak" data-id="${p.id}" aria-label="${escape(p.fr)} 발음 듣기">${icon('sound')}듣기</button></div></article>`).join('');
}
function renderVocabulary() {
  return `${heading('단어장')}<div class="vocab-top"><div class="search-box">${icon('search')}<label class="visually-hidden" for="phrase-search">표현 검색</label><input id="phrase-search" type="search" placeholder="프랑스어 또는 한국어로 검색" value="${escape(query)}" autocomplete="off"><button class="search-clear" data-action="clear-search" type="button" aria-label="검색어 지우기" ${query?'':'hidden'}>${icon('close')}</button></div><button id="vocab-review" class="primary-button" data-action="review" ${visiblePhrases().length?'':'disabled'}>${icon('cards')}카드로 복습하기</button></div><div class="filter-row" aria-label="단어장 분류">${['전체 표현','저장한 표현','틀린 표현'].map(f=>`<button class="filter-button ${vocabFilter===f?'active':''}" data-action="vocab-filter" data-value="${f}" aria-pressed="${vocabFilter===f}">${f} <span>${f==='전체 표현'?phrases.length:f==='저장한 표현'?state.favorites.length:state.mistakes.length}</span></button>`).join('')}</div><div id="search-count" class="search-result-count" role="status">${visiblePhrases().length}개 표현</div><div class="phrase-list" id="phrase-list">${phraseListHTML()}</div>`;
}
function renderProgress() {
  const dates=weekDates(),maxXP=Math.max(80,...dates.map(d=>state.activity[today(d)]?.xp||0));
  return `${heading('기록')} ${practice.renderStats()}<div class="summary-grid">${[['flame',streak(state)+'일','연속 학습'],['book',(expressionCount())+'개','익힌 표현'],['check',state.completed.length+'개','완료한 레슨'],['sparkles',totalXP(state)+' XP','총 경험치']].map(([i,n,t])=>`<div class="summary-card">${icon(i)}<strong>${n}</strong><p>${t}</p></div>`).join('')}</div><div class="progress-layout"><section class="progress-panel"><h2>이번 주의 발자국</h2><div class="week-chart" aria-label="이번 주 일별 경험치">${dates.map((d,i)=>{const xp=state.activity[today(d)]?.xp||0;return `<div class="bar-column" aria-label="${['월','화','수','목','금','토','일'][i]}요일 ${xp} XP"><strong>${xp}</strong><div class="bar" style="height:${Math.max(4,xp/maxXP*105)}px"></div><span>${['월','화','수','목','금','토','일'][i]}</span></div>`;}).join('')}</div></section><section class="progress-panel"><h2>기초 레슨</h2><div class="progress-track"><span style="width:${state.completed.length/8*100}%"></span></div><div class="progress-fraction"><span>${Math.round(state.completed.length/8*100)}% 완료</span><span>${state.completed.length} / 8 레슨</span></div><button class="primary-button" data-action="lesson" data-id="${nextLesson().id}">${state.completed.length===8?'다시 복습하기':'다음 레슨 시작하기'}${icon('arrow')}</button></section></div><div class="section-heading"><h2>완료한 레슨</h2><button class="text-link" data-action="settings">학습 설정 ${icon('settings')}</button></div>${state.completed.length?`<div class="progress-panel">${lessons.filter(l=>state.completed.includes(l.id)).map(l=>`<div class="completed-row"><span>${icon('check')}${l.title}</span><button class="text-link" data-action="lesson" data-id="${l.id}">다시 학습 ${icon('chevron')}</button></div>`).join('')}</div>`:`<div class="empty-state">${icon('sun')}<h3>아직 학습 기록이 없어요.</h3><button class="primary-button" data-action="lesson" data-id="greetings">첫 레슨 시작하기 ${icon('arrow')}</button></div>`}`;
}
function renderPage() {
  const labels={home:'오늘의 학습',lessons:'전체 레슨',vocabulary:'나의 단어장',progress:'학습 기록'};
  const route=location.hash.slice(1);page=Object.hasOwn(labels,route)?route:'home';
  $('#page-label').textContent=labels[page];document.title=`${labels[page]} · French Alone`;
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  $('#main').innerHTML=({home:renderHome,lessons:renderLessons,vocabulary:renderVocabulary,progress:renderProgress}[page])();$('#main').insertAdjacentHTML('beforeend',`<footer class="app-version-footer">French Alone v${APP_VERSION} <span>·</span> © 2026 sidebatch</footer>`);updateHeader();document.documentElement.classList.add('app-ready');$('#main').dataset.page=page;
}
function openDialog() {
  restoreFocus=document.activeElement;
  if(!dialog.open)dialog.showModal();
}
function closeDialog() {if(window.speechSynthesis)window.speechSynthesis.cancel();const notice=$('#toast');if(notice?.parentElement===dialog)document.body.append(notice);dialog.close();delete dialog.dataset.view;session=null;practice.stop();renderPage();if(restoreFocus?.isConnected)restoreFocus.focus();else $('#main').focus({preventScroll:true});}
function dialogHeader(title,percent=0,label='',autosave=false) {
  return `<div class="dialog-header"><h2 id="dialog-title">${title}</h2><div class="dialog-header-meta">${autosave?`<span class="autosave-label">${icon('check')}자동 저장</span>`:''}${label?`<span class="dialog-step">${label}</span>`:''}</div><button class="icon-button" data-action="close" aria-label="${autosave?'저장하고 학습 닫기':'학습 닫기'}">${icon('close')}</button></div>${percent?`<div class="progress-track dialog-progress" role="progressbar" aria-label="학습 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(percent)}"><span style="width:${percent}%"></span></div>`:''}`;
}
function focusDialog() {content.querySelector('.dialog-body')?.setAttribute('tabindex','-1'); content.querySelector('.dialog-body')?.focus({preventScroll:true});}
function startLesson(id) {
  const lesson=lessons.find(l=>l.id===id);if(!lesson)return;
  practice.stop();dialog.dataset.view='lesson';
  session={type:'lesson',lesson,deck:getPhrases(id),phase:'learn',index:0,answers:[],selected:null,questions:[]};
  openDialog();renderSession();
}
function renderSession() {
  if(!session)return;
  if(session.type==='review')return renderReview();
  const s=session;
  if(s.phase==='learn'){
    const p=s.deck[s.index];
    content.innerHTML=`${dialogHeader(s.lesson.title,(s.index+1)/s.deck.length*50,`표현 ${s.index+1} / ${s.deck.length}`)}<div class="dialog-body center"><h3 class="big-french" lang="fr">${escape(p.fr)}</h3><p class="pronunciation">[ ${escape(p.pronunciation)} ]</p><p class="translation">${escape(p.ko)}</p><div class="study-controls"><button class="sound-button" data-action="speak" data-id="${p.id}">${icon('sound')}발음 듣기</button>${favoriteButton(p.id)}</div><details class="lesson-detail"><summary>해설</summary><p>${escape(p.note)}</p><p>${escape(s.lesson.tip)}</p></details></div><div class="dialog-footer"><button class="secondary-button" data-action="prev" ${s.index===0?'disabled':''}>이전 표현</button><button class="primary-button" data-action="next-learn">${s.index===s.deck.length-1?'퀴즈 시작하기':'다음 표현'}${icon('arrow')}</button></div>`;
  } else if(s.phase==='quiz') {
    const q=s.questions[s.index];const answered=s.selected!==null;
    const right=answered&&s.selected===q.phrase.id;
    content.innerHTML=`${dialogHeader('한마디 퀴즈',50+(s.index+1)/s.questions.length*50,`${s.index+1} / ${s.questions.length}`)}<div class="dialog-body center"><div class="dialog-eyebrow">뜻 고르기</div><h3 class="big-french" lang="fr">${escape(q.phrase.fr)}</h3><button class="sound-button" data-action="speak" data-id="${q.phrase.id}">${icon('sound')}다시 듣기</button><div class="quiz-choices">${q.choices.map((p,i)=>`<button class="choice ${answered&&p.id===q.phrase.id?'correct':''} ${answered&&p.id===s.selected&&!right?'incorrect':''}" data-action="answer" data-id="${p.id}" ${answered?'disabled':''}><span>${i+1}</span>${escape(p.ko)}</button>`).join('')}</div><div class="quiz-feedback ${answered&&!right?'wrong':''}" role="status">${answered?(right?'정답':`정답: ${escape(q.phrase.ko)}`):''}</div></div><div class="dialog-footer"><span class="dialog-step">${s.answers.filter(a=>a.correct).length}개 정답</span><button class="primary-button" data-action="next-question" ${!answered?'disabled':''}>${s.index===s.questions.length-1?'결과 확인하기':'다음 문제'}${icon('arrow')}</button></div>`;
  } else if(s.phase==='result') {
    const r=s.result;
    content.innerHTML=`${dialogHeader('레슨 결과')}<div class="dialog-body center"><div class="result-medal" aria-hidden="true">${r.passed?'✳':'☀'}</div><h3 class="dialog-title">${r.passed?'레슨 완료':'다시 도전'}</h3>${r.passed?'':'<p class="explanation">5개 이상 맞히면 완료돼요.</p>'}<div class="result-stats"><div><strong>${r.correct} / ${r.total}</strong><span>맞힌 문제</span></div><div><strong>+${r.xp}</strong><span>획득한 XP</span></div></div></div><div class="dialog-footer"><button class="secondary-button" data-action="${r.passed?'review-lesson':'retry'}">${r.passed?'배운 표현 복습':'한 번 더 도전'}</button><button class="primary-button" data-action="close">학습 마치기${icon('check')}</button></div>`;
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
    content.innerHTML=`${dialogHeader('복습 완료')}<div class="dialog-body center"><div class="result-medal" aria-hidden="true">✳</div><h3 class="dialog-title">복습 완료</h3><p class="explanation">${s.known} / ${s.deck.length}개 기억</p></div><div class="dialog-footer">${s.retry.length?'<button class="secondary-button" data-action="review-retry">낯선 표현만 다시</button>':''}<button class="primary-button" data-action="close">복습 마치기 ${icon('check')}</button></div>`;
  } else {
    const p=s.deck[s.index];
    content.innerHTML=`${dialogHeader('한마디 복습',(s.index+1)/s.deck.length*100,`${s.index+1} / ${s.deck.length}`)}<div class="dialog-body center"><div class="dialog-eyebrow">뜻 떠올리기</div><button class="flashcard ${s.flipped?'is-flipped':''}" data-action="flip" aria-label="${s.flipped?'프랑스어 보기':'카드를 눌러 뜻 확인'}"><span class="big-french" ${s.flipped?'':'lang="fr"'}>${escape(s.flipped?p.ko:p.fr)}</span><span class="pronunciation">${s.flipped?escape(p.note):`[ ${escape(p.pronunciation)} ]`}</span><span class="hint">${s.flipped?'프랑스어 보기':'뜻 보기'} ↻</span></button><div class="study-controls"><button class="sound-button" data-action="speak" data-id="${p.id}">${icon('sound')}발음 듣기</button>${favoriteButton(p.id)}</div></div><div class="dialog-footer flash-actions"><button class="secondary-button" data-action="review-answer" data-known="false" ${!s.flipped?'disabled':''}>아직 낯설어요</button><button class="primary-button" data-action="review-answer" data-known="true" ${!s.flipped?'disabled':''}>기억나요 ${icon('check')}</button></div>`;
  }
  focusDialog();
}
function renderSettings() {
  content.innerHTML=`${dialogHeader('설정')}<div class="dialog-body settings-body"><div class="settings-brand"><span class="brand-mark" aria-hidden="true">b<span>✦</span></span><div><h3>French Alone</h3><p>v${APP_VERSION} · © 2026 sidebatch</p></div></div><section class="settings-section"><h3>학습</h3><div class="settings-option"><label for="slow-speech">조금 천천히 듣기</label><input type="checkbox" role="switch" id="slow-speech" ${state.slow?'checked':''}></div><div class="settings-option"><label for="feedback-sounds">정답 · 오답 효과음</label><input type="checkbox" role="switch" id="feedback-sounds" ${state.effects?'checked':''}></div><button class="settings-row-button" data-action="speak" data-id="greetings-0">${icon('sound')}소리 확인${icon('chevron')}</button><button class="settings-row-button" data-action="install-help">${icon('book')}앱 설치 · 오프라인 안내${icon('chevron')}</button></section><section class="settings-section"><h3>도움말</h3><details class="help-item"><summary>학습 기록은 어디에 저장되나요?</summary><p>진도와 단어장은 현재 기기에 저장돼요. 다른 기기와 자동으로 연결되지는 않아요. 브라우저의 데이터를 삭제하면 기록도 삭제됩니다.</p></details><details class="help-item"><summary>학습을 중간에 닫아도 되나요?</summary><p>10문제 학습은 자동 저장돼요. 홈에서 이어할 수 있어요.</p></details><details class="help-item"><summary>발음이 들리지 않아요.</summary><p>기기의 볼륨과 무음 설정을 확인해 주세요. 기기에 프랑스어 음성이 없으면 언어 설정에서 음성을 추가해야 할 수 있어요.</p></details></section><section class="settings-section settings-data"><h3>나의 학습 기록</h3>${storageWarning?'<div class="inline-alert">현재 기기에 기록을 저장하지 못하고 있어요. 브라우저 저장 공간 설정을 확인해 주세요.</div>':''}<button class="danger-button" data-action="reset-confirm">학습 기록 초기화</button><div id="reset-area"></div></section></div><div class="dialog-footer"><button class="primary-button" data-action="close">완료${icon('check')}</button></div>`;focusDialog();
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
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
  const {action,id,value}=button.dataset;
  switch(action) {
    case 'lesson': startLesson(id);break;
    case 'close': closeDialog();break;
    case 'speak': speak(id);break;
    case 'favorite': {
      if(!phraseById(id))break;
      const exists=state.favorites.includes(id);state.favorites=exists?state.favorites.filter(x=>x!==id):[...state.favorites,id];persist();
      document.querySelectorAll(`[data-action="favorite"][data-id="${id}"]`).forEach(b=>{b.classList.toggle('saved',!exists);b.setAttribute('aria-pressed',String(!exists));b.setAttribute('aria-label',exists?'단어장에 저장':'단어장에서 삭제');});
      if(!dialog.open){renderPage();document.querySelector(`[data-action="favorite"][data-id="${id}"]`)?.focus({preventScroll:true});}toast(exists?'단어장에서 삭제했어요.':'나의 단어장에 저장했어요.');break;
    }
    case 'lesson-filter':lessonFilter=value;renderPage();break;
    case 'vocab-filter':vocabFilter=value;renderPage();break;
    case 'next-learn':
      if(session?.type!=='lesson'||session.phase!=='learn')break;
      if(session.index<session.deck.length-1)session.index++;
      else {session.phase='quiz';session.index=0;session.questions=makeQuestions(session.deck);}
      renderSession();break;
    case 'prev':if(session?.phase==='learn'&&session.index>0){session.index--;renderSession();}break;
    case 'answer': {
      if(session?.phase!=='quiz'||session.selected!==null)break;
      const q=session.questions[session.index];if(!q.choices.some(p=>p.id===id))break;
      session.selected=id;session.answers.push({id:q.phrase.id,correct:id===q.phrase.id});renderSession();content.querySelector('[data-action="next-question"]')?.focus();break;
    }
    case 'next-question':
      if(session?.phase!=='quiz'||session.selected===null)break;
      if(session.index<session.questions.length-1){session.index++;session.selected=null;}
      else {session.result=finishLesson(state,session.lesson.id,session.answers);session.phase='result';persist();}
      renderSession();break;
    case 'retry':if(session?.lesson)startLesson(session.lesson.id);break;
    case 'review-lesson':if(session?.deck)startReview(session.deck);break;
    case 'review':startReview();break;
    case 'flip':if(session?.type==='review'){session.flipped=!session.flipped;renderReview();}break;
    case 'review-answer': {
      if(session?.type!=='review'||!session.flipped||session.done)break;
      const p=session.deck[session.index];
      if(button.dataset.known==='true') {session.known++;state.mistakes=state.mistakes.filter(x=>x!==p.id);}
      else {session.retry.push(p);if(!state.mistakes.includes(p.id))state.mistakes.push(p.id);}
      persist();
      if(session.index<session.deck.length-1){session.index++;session.flipped=false;}else session.done=true;
      renderReview();break;
    }
    case 'review-retry':if(session?.retry)startReview(session.retry);break;
    case 'settings':practice.stop();session=null;dialog.dataset.view='settings';openDialog();renderSettings();break;
    case 'install-help':closeDialog();$('#install-app')?.click();break;
    case 'open-saved':vocabFilter='저장한 표현';break;
    case 'clear-search':query='';renderPage();$('#phrase-search')?.focus();break;
    case 'reset-confirm':$('#reset-area').innerHTML='<div class="inline-alert">저장한 표현과 모든 학습 기록이 삭제돼요. 되돌릴 수 없어요.<br><button class="danger-button" data-action="reset" style="margin-top:12px">모든 기록 삭제하기</button> <button class="secondary-button" data-action="reset-cancel">취소</button></div>';break;
    case 'reset-cancel':$('#reset-area').innerHTML='';break;
    case 'reset':state=freshState();practice.reset();persist();closeDialog();toast('기록을 초기화했어요. 새로운 시작을 응원해요.');break;
  }
});
document.addEventListener('input',event=>{
  if(event.target.id==='phrase-search'){query=event.target.value;$('#phrase-list').innerHTML=phraseListHTML();$('#search-count').textContent=`${visiblePhrases().length}개 표현`;$('.search-clear').hidden=!query;$('#vocab-review').disabled=!visiblePhrases().length;}
});
document.addEventListener('change',event=>{if(event.target.id==='slow-speech'){state.slow=event.target.checked;persist();}if(event.target.id==='feedback-sounds'){state.effects=event.target.checked;persist();}});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
window.addEventListener('hashchange',()=>{renderPage();window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});});
window.addEventListener('storage',event=>{if((event.key===STORAGE_KEY||event.key===practice.key||event.key===practice.draftKey||event.key===null)&&!dialog.open){state=readState(storage);practice.reload();renderPage();}});
renderPage();
