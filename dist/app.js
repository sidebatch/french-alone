import { lessons, phrases, getPhrases } from './data.js';
import { STORAGE_KEY, freshState, readState, today, makeQuestions, finishLesson, streak, totalXP } from './core.js';
import { createPractice } from './practice.js';
import { normalizeAnswer } from './practice-core.js';

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
  openDialog:()=>{session=null;if(window.speechSynthesis)window.speechSynthesis.cancel();openDialog();},
  closeDialog, speak:speakText,
  onSaveError:()=>{storageWarning=true;toast('브라우저 저장 공간을 사용할 수 없어 이번 방문 동안만 진도가 유지돼요.');},
  onFinish:summary=>{const activity=state.activity[today()] ||= {xp:0,words:0};activity.xp+=summary.xp;activity.words+=summary.newSentences;persist();}
});
function persist() {
  try {storage.setItem(STORAGE_KEY,JSON.stringify(state));}
  catch {storageWarning=true; toast('브라우저 저장 공간을 사용할 수 없어 이번 방문 동안만 진도가 유지돼요.');}
  updateHeader();
}
function toast(message) {
  clearTimeout(toastTimer); $('#toast').textContent=message; $('#toast').classList.add('visible');
  toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);
}
function updateHeader() { $('#header-streak').innerHTML=`${icon('flame')} ${streak(state)}일 연속`; }
const nextLesson = () => lessons.find(l=>!state.completed.includes(l.id)) || lessons[0];
const phraseById = id => phrases.find(p=>p.id===id);
const expressionCount = () => new Set([...state.mastered.map(id=>normalizeAnswer(phraseById(id).fr)),...practice.independentExpressions()]).size;
const weekDates = () => {const now=new Date();const monday=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(d.getDate()+i);return d;});};
function favoriteButton(id) {const saved=state.favorites.includes(id);return `<button class="icon-button ${saved?'saved':''}" data-action="favorite" data-id="${id}" aria-label="${saved?'단어장에서 삭제':'단어장에 저장'}" aria-pressed="${saved}">${icon('heart')}</button>`;}
function lessonCard(lesson) {
  const index=lessons.indexOf(lesson)+1, done=state.completed.includes(lesson.id), next=lesson.id===nextLesson().id;
  return `<button class="lesson-card" data-action="lesson" data-id="${lesson.id}"><span class="lesson-icon ${lesson.color}">${icon(lesson.icon)}</span><span class="lesson-copy"><span class="lesson-overline">LESSON ${String(index).padStart(2,'0')} · ${lesson.category}</span><h3>${lesson.title}</h3><p>${lesson.subtitle} <span aria-hidden="true">·</span> 6개 표현 · 약 5분</p></span><span class="lesson-status">${done?'<span class="lesson-badge">학습 완료</span>':next?'<span class="lesson-badge">지금 시작</span>':''}${icon(done?'check':'chevron')}</span></button>`;
}
function heading(eyebrow,title,subtitle) {return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${subtitle}</p></div><span class="date-label">${icon('sun')}${new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long'})}</span></div>`;}
const parisArt = `<svg class="hero-art" viewBox="0 0 300 310" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><clipPath id="arch"><path d="M28 310V135a112 112 0 0 1 224 0v175Z"/></clipPath></defs><g clip-path="url(#arch)"><path fill="#f9f2dc" d="M10 10h270v320H10z"/><circle cx="205" cy="96" r="26" fill="#f3d6a1"/><path d="M0 217q82-22 160 6t140-3v100H0" fill="#d4dbba"/><path d="M0 259q112-35 300-12v73H0" fill="#c1cea3"/><path d="m140 38-4 54-17 72-43 97h18l30-60h46l30 60h18l-43-97-17-72-4-54Z" fill="#a6b28b"/><path d="M124 162h46M115 181h64M102 207h89M88 240h116" fill="none" stroke="#879971" stroke-width="5"/><path d="m142 88 13 33m-20 0 27 33m-39 10 57 39m-64 0 83 49m-23-88-58 39m64 0-85 49m61-131-28 33" fill="none" stroke="#899d74" stroke-width="2.5"/><path d="M118 269v-25a28 28 0 0 1 56 0v25" fill="#c1cea3"/><path fill="#e9d9bc" d="M-10 210h70v83h-70z"/><path fill="#b2bca2" d="m-18 209 44-38 42 38Z"/><g fill="#a0ac93"><path d="M4 222h11v17H4zm23 0h11v17H27zm-23 29h11v17H4zm23 0h11v17H27z"/></g><path fill="#e3cfb3" d="M230 194h74v99h-74z"/><path fill="#a6b294" d="m222 195 23-27h42l23 27Z"/><g fill="#a0ac93"><path d="M243 210h11v18h-11zm26 0h11v18h-11zm-26 31h11v18h-11zm26 0h11v18h-11z"/></g><path d="M-10 292q141-31 320 0v28H-10" fill="#aaba8b"/><path d="M245 274v-46m-22 30 22-17 23 17" stroke="#7c9468" stroke-width="4" fill="none"/><ellipse cx="246" cy="229" rx="23" ry="35" fill="#98aa7a"/><path d="M49 298v-48" stroke="#849869" stroke-width="4"/><ellipse cx="48" cy="245" rx="22" ry="30" fill="#91a775"/></g><path d="M28 310V135a112 112 0 0 1 224 0v175" fill="none" stroke="#d0d9bd" stroke-width="8"/><g fill="none" stroke="#889a75" stroke-width="1.7"><path d="m80 83 6 4 6-4m-39 26 5 3 5-3"/></g><path d="m272 126 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#b7c599"/><circle cx="17" cy="180" r="4" fill="#c5ceac"/></svg>`;
function renderHome() {
  const next=nextLesson(), daily=state.activity[today()] ? 1 : 0;
  const recommendedPractice=practice.recommended();
  const dayPhrase=phrases[(Math.floor(Date.now()/86400000))%phrases.length];
  const recommended=[next,...lessons.filter(l=>l.id!==next.id&&!state.completed.includes(l.id)),...lessons.filter(l=>l.id!==next.id&&state.completed.includes(l.id))].slice(0,3);
  return `${heading('A LITTLE FRENCH, EVERY DAY','Bonjour, 반가워요 <span class="wave" aria-hidden="true">☀</span>','오늘도 나만의 속도로, 프랑스어와 조금 더 가까워져요.')}<div class="dashboard-grid"><div class="main-column"><section class="hero" aria-label="추천 학습"><div class="hero-copy"><span class="pill">${icon('sparkles')} 내 말로 만드는 10문제</span><h2>매일 한 입,<br><em>프랑스어.</em></h2><p>알 듯한 한마디를 직접 꺼내 봐요.<br>마지막에는 새 문장도 내 힘으로.</p><button class="primary-button" data-action="practice-start" data-id="${recommendedPractice.id}">10문제 시작하기 ${icon('arrow')}</button><div class="hero-meta"><span>${icon('clock')}약 3–5분</span><span>${icon('book')}로그인 없이 바로 시작</span></div></div><span class="hero-label">C’est parti !</span>${parisArt}</section><div class="stats-row"><div class="stat-card"><span class="stat-icon peach">${icon('flame')}</span><div><div class="stat-number">${streak(state)}<small>일</small></div><div class="stat-caption">연속 학습</div></div></div><div class="stat-card"><span class="stat-icon mint">${icon('book')}</span><div><div class="stat-number">${expressionCount()}<small>개</small></div><div class="stat-caption">익힌 표현</div></div></div><div class="stat-card"><span class="stat-icon lavender">${icon('sparkles')}</span><div><div class="stat-number">${totalXP(state)}<small>XP</small></div><div class="stat-caption">쌓아온 경험치</div></div></div></div>${practice.renderLibrary()}<div class="section-heading"><h2>기초 표현도 함께 <small>차근차근, 한 걸음씩</small></h2><a class="text-link" href="#lessons">전체 보기 ${icon('chevron')}</a></div><div class="lesson-list">${recommended.map(lessonCard).join('')}</div><p class="bottom-note">${icon('heart')}완벽하지 않아도 괜찮아요. 오늘의 한마디면 충분해요.</p></div><aside class="right-column" aria-label="나의 목표와 오늘의 표현"><section class="side-card"><h2>오늘의 작은 목표 ${icon('sun')}</h2><p class="goal-subtitle">하루 한 판, 작은 완료를 쌓아가요.</p><div class="goal-content"><div class="goal-ring" style="--progress:${daily*100}%"><div>${daily}<span>/ 1판</span></div></div><div class="goal-copy"><b>${daily>=1?'오늘의 목표 달성!':'작은 시작이 큰 변화로'}</b><p>${daily>=1?'차곡차곡 쌓인 실력이에요.<br>내일도 함께해요.':'한 판을 마치면<br>오늘의 원이 채워져요.'}</p></div></div><div class="goal-days">${weekDates().map((d,i)=>`<div class="day ${today(d)===today()?'today':''} ${state.activity[today(d)]?'done':''}" aria-label="${d.getMonth()+1}월 ${d.getDate()}일 ${state.activity[today(d)]?'학습 완료':'학습 기록 없음'}">${['월','화','수','목','금','토','일'][i]}<span>${state.activity[today(d)]?icon('check'):d.getDate()}</span></div>`).join('')}</div></section><section class="side-card phrase-card"><h2>오늘의 한마디 ${icon('sparkles')}</h2><div class="phrase-type">UNE EXPRESSION PAR JOUR</div><p class="daily-french" lang="fr">${escape(dayPhrase.fr)}</p><p class="daily-pronunciation">[ ${escape(dayPhrase.pronunciation)} ]</p><p class="daily-meaning">${escape(dayPhrase.ko)}</p><div class="phrase-actions"><button class="sound-button" data-action="speak" data-id="${dayPhrase.id}">${icon('sound')}발음 듣기</button>${favoriteButton(dayPhrase.id)}</div></section><section class="tip-card"><div class="eyebrow">${icon('coffee')}LE PETIT CONSEIL</div><h3>프랑스에서는, 인사부터</h3><p>가게에 들어갈 때 <em lang="fr">“Bonjour !”</em><br>작은 인사 한마디가 따뜻한 대화의 시작이에요.</p></section></aside></div>`;
}
function renderLessons() {
  const visible=lessons.filter(l=>lessonFilter==='전체'||l.category===lessonFilter);
  return `${heading('YOUR FRENCH JOURNEY','한 걸음씩, 프랑스어','내 말로 만드는 짧은 도전부터, 상황별 기초 표현까지.')} ${practice.renderLibrary()}<div class="progress-panel"><div class="progress-fraction"><span>나의 첫 프랑스어 · 기초 8개 레슨</span><b>${state.completed.length} / 8 완료</b></div><div class="progress-track"><span style="width:${state.completed.length/8*100}%"></span></div><p class="section-intro">표현 익히기 → 6문제 퀴즈 → 결과 확인 · 5문제 이상 맞히면 레슨 완료!</p></div><div class="filter-row" aria-label="레슨 분류">${['전체','첫걸음','일상 회화','여행 회화'].map(f=>`<button class="filter-button ${lessonFilter===f?'active':''}" data-action="lesson-filter" data-value="${f}" aria-pressed="${lessonFilter===f}">${f}</button>`).join('')}</div><div class="course-grid">${visible.map(lessonCard).join('')}</div><p class="bottom-note">${icon('smile')}모든 레슨이 열려 있어요. 궁금한 주제부터 시작해도 좋아요.</p>`;
}
function visiblePhrases() {
  const q=query.trim().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  return phrases.filter(p=>(vocabFilter!=='저장한 표현'||state.favorites.includes(p.id))&&(vocabFilter!=='틀린 표현'||state.mistakes.includes(p.id))&&(!q||[p.fr,p.ko,p.pronunciation].some(t=>t.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().includes(q))));
}
function phraseListHTML() {
  const deck=visiblePhrases();
  if(!deck.length) return `<div class="empty-state">${icon('cards')}<h3>${query?'검색 결과가 없어요':vocabFilter==='틀린 표현'?'아직 틀린 표현이 없어요':'나만의 표현을 모아 보세요'}</h3><p>${query?'다른 프랑스어 또는 한국어 표현으로 검색해 보세요.':vocabFilter==='틀린 표현'?'레슨 퀴즈에서 틀린 표현을 여기에 모아 드려요.':'표현 옆의 하트를 누르면 이곳에 저장돼요.'}</p>${!query?'<button class="secondary-button" data-action="vocab-filter" data-value="전체 표현">전체 표현 둘러보기</button>':''}</div>`;
  return deck.map(p=>`<article class="expression"><div class="expression-meta">${p.category} · ${lessons.find(l=>l.id===p.lessonId).subtitle}</div>${favoriteButton(p.id)}<p class="fr" lang="fr">${escape(p.fr)}</p><p class="pronunciation">[ ${escape(p.pronunciation)} ]</p><p class="ko">${escape(p.ko)}</p><div class="phrase-actions"><span class="phrase-note">${escape(p.note)}</span><button class="sound-button" data-action="speak" data-id="${p.id}" aria-label="${escape(p.fr)} 발음 듣기">${icon('sound')}듣기</button></div></article>`).join('');
}
function renderVocabulary() {return `${heading('WORDS TO KEEP','마음에 남은 한마디','표현을 저장하고, 소리 내어 읽으며 내 것으로 만들어 보세요.')}<div class="vocab-top"><label class="search-box">${icon('search')}<span class="visually-hidden">표현 검색</span><input id="phrase-search" type="search" placeholder="프랑스어 또는 한국어로 찾아보세요" value="${escape(query)}" autocomplete="off"></label><button class="primary-button" data-action="review">${icon('cards')}카드로 복습하기</button></div><div class="filter-row" aria-label="단어장 분류">${['전체 표현','저장한 표현','틀린 표현'].map(f=>`<button class="filter-button ${vocabFilter===f?'active':''}" data-action="vocab-filter" data-value="${f}" aria-pressed="${vocabFilter===f}">${f} ${f==='전체 표현'?phrases.length:f==='저장한 표현'?state.favorites.length:state.mistakes.length}</button>`).join('')}</div><div id="search-count" class="visually-hidden" role="status">${visiblePhrases().length}개 표현</div><div class="phrase-list" id="phrase-list">${phraseListHTML()}</div><p class="speech-note">한글 발음 표기는 학습을 돕는 근사치예요. 브라우저의 프랑스어 음성으로 듣기를 제공하며, 기기와 브라우저에 따라 음성 지원이 달라요.</p>`;}
function renderProgress() {
  const dates=weekDates(),maxXP=Math.max(80,...dates.map(d=>state.activity[today(d)]?.xp||0));
  return `${heading('LOOK HOW FAR YOU’VE COME','차곡차곡 쌓인 나의 기록','어제보다 한마디 더. 작은 노력도 모두 소중한 진전이에요.')} ${practice.renderStats()}<div class="summary-grid">${[['flame',streak(state)+'일','연속 학습'],['book',(expressionCount())+'개','익힌 표현'],['check',state.completed.length+'개','완료한 레슨'],['sparkles',totalXP(state)+' XP','총 경험치']].map(([i,n,t])=>`<div class="summary-card">${icon(i)}<strong>${n}</strong><p>${t}</p></div>`).join('')}</div><div class="progress-layout"><section class="progress-panel"><h2>이번 주의 발자국</h2><div class="week-chart" aria-label="이번 주 일별 경험치">${dates.map((d,i)=>{const xp=state.activity[today(d)]?.xp||0;return `<div class="bar-column" aria-label="${['월','화','수','목','금','토','일'][i]}요일 ${xp} XP"><strong>${xp}</strong><div class="bar" style="height:${Math.max(4,xp/maxXP*105)}px"></div><span>${['월','화','수','목','금','토','일'][i]}</span></div>`;}).join('')}</div><p class="progress-caption">기초 레슨은 새 표현 10 XP와 첫 통과 20 XP. 10문제 도전은 첫 정답 5 XP, 직접 입력한 첫 독립 정답에 추가 5 XP를 받아요.</p></section><section class="progress-panel"><h2>나의 첫 프랑스어</h2><p class="section-intro">8개 레슨, 48개 표현으로<br>프랑스어의 기초를 만들어 가요.</p><div class="progress-track"><span style="width:${state.completed.length/8*100}%"></span></div><div class="progress-fraction"><span>${Math.round(state.completed.length/8*100)}% 완료</span><span>${state.completed.length} / 8 레슨</span></div><button class="primary-button" data-action="lesson" data-id="${nextLesson().id}">${state.completed.length===8?'다시 복습하기':'다음 레슨 시작하기'}${icon('arrow')}</button></section></div><div class="section-heading"><h2>완료한 레슨</h2><button class="text-link" data-action="settings">학습 설정 ${icon('settings')}</button></div>${state.completed.length?`<div class="progress-panel">${lessons.filter(l=>state.completed.includes(l.id)).map(l=>`<div class="completed-row"><span>${icon('check')}${l.title}</span><button class="text-link" data-action="lesson" data-id="${l.id}">다시 학습 ${icon('chevron')}</button></div>`).join('')}</div>`:`<div class="empty-state">${icon('sun')}<h3>첫 기록을 남겨 볼까요?</h3><p>레슨을 마치면 이곳에 나의 배움이 쌓여요.</p><button class="primary-button" data-action="lesson" data-id="greetings">첫 레슨 시작하기 ${icon('arrow')}</button></div>`}`;
}
function renderPage() {
  const labels={home:'오늘의 학습',lessons:'전체 레슨',vocabulary:'나의 단어장',progress:'학습 기록'};
  const route=location.hash.slice(1);page=Object.hasOwn(labels,route)?route:'home';
  $('#page-label').textContent=labels[page];document.title=`${labels[page]} · Bonjour`;
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  $('#main').innerHTML=({home:renderHome,lessons:renderLessons,vocabulary:renderVocabulary,progress:renderProgress}[page])();updateHeader();
}
function openDialog() {
  restoreFocus=document.activeElement;
  if(!dialog.open)dialog.showModal();
}
function closeDialog() {if(window.speechSynthesis)window.speechSynthesis.cancel();dialog.close();session=null;practice.stop();renderPage();if(restoreFocus?.isConnected)restoreFocus.focus();else $('#main').focus({preventScroll:true});}
function dialogHeader(title,percent=0,label='') {return `<div class="dialog-header"><h2 id="dialog-title">${title}</h2>${label?`<span class="dialog-step">${label}</span>`:''}<button class="icon-button" data-action="close" aria-label="학습 닫기">${icon('close')}</button></div>${percent?`<div class="progress-track" style="margin:0;border-radius:0;height:4px"><span style="width:${percent}%"></span></div>`:''}`;}
function focusDialog() {content.querySelector('.dialog-body')?.setAttribute('tabindex','-1'); content.querySelector('.dialog-body')?.focus({preventScroll:true});}
function startLesson(id) {
  const lesson=lessons.find(l=>l.id===id);if(!lesson)return;
  practice.stop();
  session={type:'lesson',lesson,deck:getPhrases(id),phase:'learn',index:0,answers:[],selected:null,questions:[]};
  openDialog();renderSession();
}
function renderSession() {
  if(!session)return;
  if(session.type==='review')return renderReview();
  const s=session;
  if(s.phase==='learn'){
    const p=s.deck[s.index];
    content.innerHTML=`${dialogHeader(s.lesson.title,(s.index+1)/s.deck.length*50,`표현 ${s.index+1} / ${s.deck.length}`)}<div class="dialog-body center"><div class="dialog-eyebrow">먼저 듣고, 따라 말해 보세요</div><h3 class="big-french" lang="fr">${escape(p.fr)}</h3><p class="pronunciation">[ ${escape(p.pronunciation)} ]</p><p class="translation">${escape(p.ko)}</p><p class="explanation">${escape(p.note)}</p><div class="study-controls"><button class="sound-button" data-action="speak" data-id="${p.id}">${icon('sound')}발음 듣기</button>${favoriteButton(p.id)}</div><div class="study-note"><b>알아 두면 좋은 작은 팁</b>${escape(s.lesson.tip)}</div><p class="speech-note">한글 발음은 참고용이에요. 듣기로 실제 소리를 익혀 보세요.</p></div><div class="dialog-footer"><button class="secondary-button" data-action="prev" ${s.index===0?'disabled':''}>이전 표현</button><button class="primary-button" data-action="next-learn">${s.index===s.deck.length-1?'퀴즈 시작하기':'다음 표현'}${icon('arrow')}</button></div>`;
  } else if(s.phase==='quiz') {
    const q=s.questions[s.index];const answered=s.selected!==null;
    const right=answered&&s.selected===q.phrase.id;
    content.innerHTML=`${dialogHeader('한마디 퀴즈',50+(s.index+1)/s.questions.length*50,`${s.index+1} / ${s.questions.length}`)}<div class="dialog-body center"><div class="dialog-eyebrow">이 표현은 어떤 뜻일까요?</div><h3 class="big-french" lang="fr">${escape(q.phrase.fr)}</h3><button class="sound-button" data-action="speak" data-id="${q.phrase.id}">${icon('sound')}다시 듣기</button><div class="quiz-choices">${q.choices.map((p,i)=>`<button class="choice ${answered&&p.id===q.phrase.id?'correct':''} ${answered&&p.id===s.selected&&!right?'incorrect':''}" data-action="answer" data-id="${p.id}" ${answered?'disabled':''}><span>${i+1}</span>${escape(p.ko)}</button>`).join('')}</div><div class="quiz-feedback ${answered&&!right?'wrong':''}" role="status">${answered?(right?'잘했어요! C’est très bien !':`조금만 더 연습해요. 정답: ${escape(q.phrase.ko)}`):'알맞은 뜻을 하나 골라 주세요.'}</div></div><div class="dialog-footer"><span class="dialog-step">${s.answers.filter(a=>a.correct).length}개 정답</span><button class="primary-button" data-action="next-question" ${!answered?'disabled':''}>${s.index===s.questions.length-1?'결과 확인하기':'다음 문제'}${icon('arrow')}</button></div>`;
  } else if(s.phase==='result') {
    const r=s.result;
    content.innerHTML=`${dialogHeader('오늘도 한 걸음 더')}<div class="dialog-body center"><div class="result-medal" aria-hidden="true">${r.passed?'✳':'☀'}</div><h3 class="dialog-title">${r.passed?'아주 잘했어요!':'좋은 시작이에요!'}</h3><p class="explanation">${r.passed?'프랑스어와 조금 더 가까워졌어요.<br>오늘 배운 표현을 소리 내어 말해 보세요.':'6문제 중 5문제를 맞히면 레슨이 완료돼요.<br>표현을 다시 익히고 한 번 더 도전해 보세요.'}</p><div class="result-stats"><div><strong>${r.correct} / ${r.total}</strong><span>맞힌 문제</span></div><div><strong>+${r.xp}</strong><span>획득한 XP</span></div></div>${state.mistakes.some(id=>s.deck.some(p=>p.id===id))?'<div class="study-note">틀린 표현을 단어장에 모아 두었어요. 카드로 한 번 더 복습해 보세요.</div>':''}${!r.first?'<p class="speech-note">이미 익힌 표현에는 XP가 다시 추가되지 않아요.</p>':''}</div><div class="dialog-footer"><button class="secondary-button" data-action="${r.passed?'review-lesson':'retry'}">${r.passed?'배운 표현 복습':'한 번 더 도전'}</button><button class="primary-button" data-action="close">학습 마치기${icon('check')}</button></div>`;
  }
  focusDialog();
}
function startReview(deck) {
  if(!deck?.length) {
    const selected=visiblePhrases();
    deck=page==='vocabulary'?selected:phrases.filter(p=>state.mistakes.includes(p.id)||state.favorites.includes(p.id));
    if(!deck.length){toast('복습할 표현을 먼저 저장하거나 다른 분류를 선택해 주세요.');return;}
  }
  practice.stop();session={type:'review',deck,index:0,flipped:false,known:0,retry:[],done:false};openDialog();renderReview();
}
function renderReview() {
  const s=session;
  if(s.done) {
    content.innerHTML=`${dialogHeader('복습 완료')}<div class="dialog-body center"><div class="result-medal" aria-hidden="true">✳</div><h3 class="dialog-title">한 번 더, 내 것으로</h3><p class="explanation">${s.deck.length}개 표현 중 ${s.known}개를 기억했어요.<br>${s.retry.length?'아직 낯선 표현은 다시 만나면 돼요.':'오늘의 작은 노력이 실력이 될 거예요.'}</p></div><div class="dialog-footer">${s.retry.length?'<button class="secondary-button" data-action="review-retry">낯선 표현만 다시</button>':''}<button class="primary-button" data-action="close">복습 마치기 ${icon('check')}</button></div>`;
  } else {
    const p=s.deck[s.index];
    content.innerHTML=`${dialogHeader('한마디 복습',(s.index+1)/s.deck.length*100,`${s.index+1} / ${s.deck.length}`)}<div class="dialog-body center"><div class="dialog-eyebrow">표현의 뜻을 떠올려 보세요</div><button class="flashcard ${s.flipped?'is-flipped':''}" data-action="flip" aria-label="${s.flipped?'프랑스어 보기':'카드를 눌러 뜻 확인'}"><span class="big-french" ${s.flipped?'':'lang="fr"'}>${escape(s.flipped?p.ko:p.fr)}</span><span class="pronunciation">${s.flipped?escape(p.note):`[ ${escape(p.pronunciation)} ]`}</span><span class="hint">카드를 눌러 ${s.flipped?'프랑스어 보기':'뜻 확인하기'} ↻</span></button><div class="study-controls"><button class="sound-button" data-action="speak" data-id="${p.id}">${icon('sound')}발음 듣기</button>${favoriteButton(p.id)}</div><p class="speech-note">카드를 뒤집은 뒤 얼마나 기억하는지 알려 주세요.</p></div><div class="dialog-footer flash-actions"><button class="secondary-button" data-action="review-answer" data-known="false" ${!s.flipped?'disabled':''}>아직 낯설어요</button><button class="primary-button" data-action="review-answer" data-known="true" ${!s.flipped?'disabled':''}>기억나요 ${icon('check')}</button></div>`;
  }
  focusDialog();
}
function renderSettings() {
  content.innerHTML=`${dialogHeader('나에게 맞는 학습')}<div class="dialog-body"><h3 class="dialog-title">천천히, 나의 속도로</h3><div class="settings-option"><label for="slow-speech">조금 천천히 듣기<small>표현을 더 천천히 읽어 드려요.</small></label><input type="checkbox" id="slow-speech" ${state.slow?'checked':''}></div><p class="storage-info">진도와 단어장은 이 브라우저에 저장돼요. 다른 기기와 자동으로 동기화되지 않으며, 브라우저 데이터를 지우면 기록도 삭제돼요.</p><p class="storage-info">발음 듣기는 기기의 프랑스어 음성을 사용해요. 음성이 없으면 시스템 언어 설정에서 프랑스어 음성을 추가해 주세요.</p>${storageWarning?'<div class="inline-alert">현재 저장 공간을 사용할 수 없어요. 브라우저 설정을 확인해 주세요.</div>':''}<button class="danger-button" data-action="reset-confirm">학습 기록 초기화</button><div id="reset-area"></div></div><div class="dialog-footer"><button class="primary-button" data-action="close">설정 완료 ${icon('check')}</button></div>`;focusDialog();
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
      if(!dialog.open)renderPage();toast(exists?'단어장에서 삭제했어요.':'나의 단어장에 저장했어요.');break;
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
    case 'settings':practice.stop();session=null;openDialog();renderSettings();break;
    case 'reset-confirm':$('#reset-area').innerHTML='<div class="inline-alert">저장한 표현과 모든 학습 기록이 삭제돼요. 되돌릴 수 없어요.<br><button class="danger-button" data-action="reset" style="margin-top:12px">모든 기록 삭제하기</button> <button class="secondary-button" data-action="reset-cancel">취소</button></div>';break;
    case 'reset-cancel':$('#reset-area').innerHTML='';break;
    case 'reset':state=freshState();practice.reset();persist();closeDialog();toast('기록을 초기화했어요. 새로운 시작을 응원해요.');break;
  }
});
document.addEventListener('input',event=>{
  if(event.target.id==='phrase-search'){query=event.target.value;$('#phrase-list').innerHTML=phraseListHTML();$('#search-count').textContent=`${visiblePhrases().length}개 표현`;}
});
document.addEventListener('change',event=>{if(event.target.id==='slow-speech'){state.slow=event.target.checked;persist();}});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
window.addEventListener('hashchange',()=>{renderPage();window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});});
window.addEventListener('storage',event=>{if((event.key===STORAGE_KEY||event.key===practice.key||event.key===null)&&!dialog.open){state=readState(storage);practice.reload();renderPage();}});
renderPage();
