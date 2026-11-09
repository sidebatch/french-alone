import { practicePacks, practiceUnits, questionById } from './practice-data.js';
import { PRACTICE_KEY, PRACTICE_DRAFT_KEY, readPracticeDrafts, freshPractice, readPractice, dueQuestions, reviewDeck, dailyDeck, dailyProgress, asRecall, supportTiles, nextPack, independentSentences, isCorrect, recordPractice, answerFeedback } from './practice-core.js';
import { shuffle } from './core.js';
import { mascot } from './companion.js';

export function createPractice({ storage, content, dialogHeader, openDialog, closeDialog, focusDialog, icon, escape, speak, playFeedback=()=>{}, onFinish, onSaveError }) {
  let state=readPractice(storage), drafts=readPracticeDrafts(storage), session=null, saveFailed=false;
  let libraryUnit='all', libraryStatus='all';
  const saveError=()=>{if(!saveFailed)onSaveError();saveFailed=true;};
  const save=()=>{try{storage.setItem(PRACTICE_KEY,JSON.stringify(state));}catch{saveError();}};
  const saveDrafts=()=>{try{storage.setItem(PRACTICE_DRAFT_KEY,JSON.stringify({version:1,sessions:drafts}));}catch{saveError();}};
  const titleFor=id=>({daily:'오늘의 5문제',light:'가볍게 3문제',retry:'다시 도전',review:'기억을 깨우는 복습'}[id]||practicePacks.find(p=>p.id===id)?.title);
  function stash() {
    if(!session||session.summary)return;
    drafts[session.packId]={packId:session.packId,runId:session.runId,questionIds:session.deck.map(q=>q.id),formats:session.deck.map(q=>q.kind),index:session.index,
      results:session.results.map(r=>({...r})),continued:session.continued,updatedAt:Date.now(),
      current:{draft:session.draft,selected:[...session.selected],tiles:[...session.tiles],choice:session.choice,hints:session.hints,hadError:session.hadError,status:session.status,supported:session.supported,errors:session.errors}};
    saveDrafts();
  }
  const resumeInfo=()=>{
    const draft=Object.values(drafts).sort((a,b)=>b.updatedAt-a.updatedAt)[0];
    return draft?{packId:draft.packId,title:titleFor(draft.packId),index:draft.index,total:draft.questionIds.length}:null;
  };
  const active=()=>session?.deck[session.index];
  const packDone=pack=>state.completed.includes(pack.id);
  const packStarted=pack=>Boolean(drafts[pack.id])||(!packDone(pack)&&pack.questions.some(q=>state.cards[q.id]));
  const done=()=>['correct','revealed'].includes(session.status);
  const tileMode=()=>active().kind==='order'||session.supported;
  const answerValue=()=>tileMode()?session.selected.map(i=>session.tiles[i]).join(session.supported?supportTiles(active()).joiner:' '):active().kind==='choice'?session.choice:session.draft;
  const combo=()=>{
    let count=session.status==='correct'&&!session.hints&&!session.hadError?1:0;
    if(!count)return 0;
    for(const r of [...session.results].reverse()){if(!r.correct||r.needsReview)break;count++;}
    return count;
  };
  function start(id,continued=false,retryQuestions) {
    const pack=practicePacks.find(p=>p.id===id),paused=retryQuestions?null:drafts[id];
    let deck;
    if(paused)deck=paused.questionIds.map((qid,i)=>{
      const q=questionById(qid);
      if((paused.formats[i]==='input'&&q.kind!=='input')||['review','retry'].includes(id))return asRecall(q);
      return {...q,transfer:q.transfer===true&&!state.cards[qid]};
    });
    else if(id==='retry')deck=retryQuestions?.map(asRecall);
    else if(id==='daily'||id==='light')deck=dailyDeck(state,undefined,id==='light'?3:5);
    else if(id==='review')deck=reviewDeck(state).slice(0,5);
    else deck=pack?.questions.map(q=>({...q,transfer:q.transfer===true&&!state.cards[q.id]}));
    if(!deck?.length)return;
    openDialog();
    session={packId:id,title:titleFor(id),deck,index:paused?.index||0,results:paused?.results.map(r=>({...r}))||[],continued:paused?.continued||continued,summary:null,
      runId:paused?.runId||('run-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)),renderKey:null,explain:false};
    if(paused){Object.assign(session,paused.current);session.selected=[...paused.current.selected];session.tiles=[...paused.current.tiles];}
    else prepare();
    render();
  }
  function prepare() {
    Object.assign(session,{draft:'',selected:[],hints:0,hadError:false,status:'idle',message:'',choice:null,accentOpen:false,supported:false,errors:0,explain:false,composing:false,renderKey:null});
    session.tiles=shuffle(active().tiles||[]);
  }
  const modeLabel=q=>session.supported?'카드로 연습':q.kind==='order'?'단어를 순서대로':q.kind==='choice'?'빈칸에 맞는 말':q.mode==='word'?'단어 쓰기':q.cue?'빈칸 채우기':'문장 쓰기';
  function explanation(q) {
    const pack=practicePacks.find(p=>p.id===q.packId);
    return '<b lang="fr">'+escape(q.full)+'</b><p>'+escape(q.note)+'</p><details class="answer-detail"><summary>조금 더 알아보기</summary><div class="grammar-guide"><p class="grammar-pattern">'+escape(pack.pattern)+'</p><p>'+escape(pack.guide.rule)+'</p><p>'+escape(pack.guide.caution)+'</p></div></details>';
  }
  function tilesHTML() {
    const q=active(),finished=done();
    return '<div class="tile-answer" aria-label="선택한 단어">'+(session.status==='revealed'?'<span class="revealed-tiles" lang="fr">'+escape(q.answer)+'</span>':session.selected.length?session.selected.map((index,i)=>'<button class="word-tile selected '+(i===session.justPlaced?'just-placed':'')+'" data-action="practice-unpick" data-index="'+i+'" '+(finished?'disabled':'')+' aria-label="'+escape(session.tiles[index])+' 선택 취소">'+escape(session.tiles[index])+'</button>').join(''):'<span class="tile-placeholder">카드를 눌러 완성해요</span>')+'</div><div class="tile-pool" aria-label="문장을 만들 단어">'+session.tiles.map((tile,i)=>'<button class="word-tile" data-action="practice-pick" data-index="'+i+'" '+(finished||session.selected.includes(i)?'disabled':'')+'>'+escape(tile)+'</button>').join('')+'</div><div class="tile-tools"><span>선택한 카드를 누르면 취소돼요</span><button class="text-link" data-action="practice-clear" '+(finished||!session.selected.length?'disabled':'')+'>다시 배열</button></div>'+(session.supported&&!finished?'<button class="text-link type-again" data-action="practice-type">직접 쓸게요</button>':'');
  }
  function inputHTML(q) {
    return '<form id="practice-form"><label class="visually-hidden" for="practice-input">'+modeLabel(q)+'</label><input id="practice-input" class="practice-input" lang="fr" type="text" maxlength="180" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-describedby="typing-help" placeholder="'+(q.mode==='word'?'배운 단어':q.cue?'여기에 답을 써요':'프랑스어로 써보세요')+'" value="'+escape(session.draft)+'"></form><div class="typing-tools"><span id="typing-help">대소문자·마침표는 자유롭게</span><button class="accent-toggle" data-action="practice-accents" aria-expanded="false" aria-controls="accent-keys">é · 악센트</button></div><div id="accent-keys" class="accent-keys" role="group" aria-label="프랑스어 글자 입력" hidden>'+['é','è','ê','ë','à','â','ç','î','ï','ô','ù','û','ü','œ','’'].map(letter=>'<button type="button" data-action="practice-accent" data-value="'+letter+'" aria-label="'+letter+' 입력">'+letter+'</button>').join('')+'</div>';
  }
  function choicesHTML(q) {
    if(session.choicesFor!==q.id){session.choicesFor=q.id;session.choices=shuffle(q.choices||[]);}
    return '<div class="practice-options">'+session.choices.map(choice=>'<button class="choice" data-action="practice-choice" data-value="'+escape(choice)+'">'+escape(choice)+'</button>').join('')+'</div>';
  }
  function feedbackText() {
    if(session.status==='revealed')return '확인했어요. 다음에 다시 떠올려봐요.';
    if(session.status==='correct')return combo()>=3?combo()+'개 연속 정답!':session.hadError?'이번엔 해냈어요!':session.hints?'잘 완성했어요!':'좋아요, 정답!';
    if(session.supported&&session.status!=='correct')return '카드로 한 번 만들어볼까요?';
    if(session.message)return session.message;
    if(session.hints)return active().hint;
    return active().kind==='choice'?'맞는 말을 골라요.':tileMode()?'카드를 눌러 문장을 만들어요.':'떠오르는 답을 써보세요.';
  }
  function renderFooter() {
    const q=active(),finished=done(),color=session.status==='correct'?'success':session.status==='wrong'?'retry':session.status==='revealed'?'revealed':'neutral';
    const why=finished||session.status==='wrong';
    const action=finished?'<button class="primary-button" data-action="practice-next">'+(session.index===session.deck.length-1?'한 판 마치기':'다음')+icon('arrow')+'</button>':q.kind==='choice'&&!session.supported?'<button class="text-link footer-hint" data-action="practice-hint">'+(session.hints?'정답 보기':'힌트')+'</button>':'<button class="primary-button" '+(tileMode()?'data-action="practice-check"':'type="submit" form="practice-form"')+' '+((tileMode()?session.selected.length!==session.tiles.length:!session.draft.trim())?'disabled':'')+'>확인'+icon('check')+'</button>';
    return '<div class="feedback-strip '+color+'"><div class="feedback-signal" aria-hidden="true">'+icon(session.status==='correct'?'check':session.status==='wrong'?'sparkles':'book')+'</div><p class="feedback-message" role="status">'+escape(feedbackText())+'</p>'+(why?'<button class="why-button" data-action="practice-why" aria-expanded="'+Boolean(session.explain)+'" aria-controls="practice-explanation">'+(session.explain?'접기':'왜?')+'</button>':q.kind!=='choice'?'<button class="why-button" data-action="practice-hint">'+(session.hints?'정답':'힌트')+'</button>':'')+'</div><div class="footer-action">'+(session.status==='wrong'&&q.kind!=='choice'?'<button class="text-link footer-reveal" data-action="practice-hint">정답 보기</button>':'')+action+'</div>';
  }
  function render({tilesChanged=false,focusAction=null,focusIndex=null}={}) {
    if(!session)return;
    if(session.summary)return renderResult();
    const q=active(),finished=done(),key=q.id+':'+(session.supported?'support':q.kind);
    const rebuild=session.renderKey!==key;
    const scroll=content.querySelector('.dialog-body')?.scrollTop||0;
    if(rebuild) {
      const model=q.model?'<div class="practice-model"><span>처음 보는 표현</span><b lang="fr">'+escape(q.model.fr)+'</b></div>':'';
      const interaction=tileMode()?tilesHTML():q.kind==='choice'?choicesHTML(q):inputHTML(q);
      content.innerHTML=dialogHeader(session.title,1,(session.index+1)+' / '+session.deck.length,!saveFailed)+'<div class="dialog-body practice-body game-body" data-practice-question="'+q.id+'"><div class="exercise-heading"><span class="exercise-mode">'+modeLabel(q)+'</span><span class="exercise-stage">'+(q.transfer?'새 문장 도전':q.phase)+'</span></div><div class="practice-question"><div class="question-copy">'+model+'<h3 class="practice-prompt">'+escape(q.ko)+'</h3>'+(q.glossary?'<p class="practice-glossary">'+escape(q.glossary).replace(/^새 단어: /,'')+'</p>':'')+(q.cue?'<p class="practice-cue" lang="fr"></p>':'')+'</div><div class="answer-zone" id="practice-answer">'+interaction+'</div><div id="word-feedback"></div></div><section id="practice-explanation" class="explanation-sheet" hidden></section></div><div class="dialog-footer practice-footer game-footer"></div>';
      session.renderKey=key;focusDialog();
    } else if(tileMode()&&(tilesChanged||finished))content.querySelector('#practice-answer').innerHTML=tilesHTML();
    content.querySelector('.practice-footer').innerHTML=renderFooter();
    const percent=(session.index+(finished?1:0))/session.deck.length*100;
    const track=content.querySelector('.dialog-progress');track.setAttribute('aria-valuenow',Math.round(percent));track.firstElementChild.style.width=percent+'%';
    const cue=content.querySelector('.practice-cue');if(cue)cue.innerHTML=escape(q.cue).replace('___','<span class="blank-space '+(finished?'is-filled':'')+'">'+(finished?escape(q.answer):'···')+'</span>');
    const input=content.querySelector('#practice-input');
    if(input){
      input.disabled=finished;input.setAttribute('aria-invalid',String(session.status==='wrong'));
      if(session.status==='revealed')input.value=q.answer;
      const toggle=content.querySelector('[data-action="practice-accents"]');toggle.disabled=finished;
      content.querySelectorAll('[data-action="practice-accent"]').forEach(button=>button.disabled=finished);
      if(finished){content.querySelector('#accent-keys').hidden=true;toggle.setAttribute('aria-expanded','false');}
    }
    content.querySelectorAll('[data-action="practice-choice"]').forEach(button=>{
      button.disabled=finished;button.classList.toggle('correct',finished&&button.dataset.value===q.answer);
      button.classList.toggle('incorrect',session.status==='wrong'&&button.dataset.value===session.choice);
    });
    const marks=content.querySelector('#word-feedback');
    if(session.status==='wrong'&&q.kind==='input'&&!session.supported) {
      const feedback=answerFeedback(q,session.draft);
      marks.innerHTML='<div class="answer-attempt" aria-label="입력한 답 확인">'+feedback.tokens.map(token=>'<mark class="attempt-word '+(token.kind==='ok'?'ok':token.kind==='missing'?'missing':'needs-work')+'">'+escape(token.text)+'</mark>').join(' ')+'</div>';
    }else marks.innerHTML='';
    const panel=content.querySelector('#practice-explanation');panel.hidden=!session.explain;
    if(session.explain)panel.innerHTML=explanation(q)+'<button class="sound-button" data-action="practice-sound">'+icon('sound')+'듣기</button>';
    else panel.innerHTML='';
    const body=content.querySelector('.dialog-body');if(!rebuild)body.scrollTop=scroll;
    stash();
    if(finished)content.querySelector('[data-action="practice-next"]')?.focus({preventScroll:true});
    else if(session.status==='wrong'&&input)input.focus({preventScroll:true});
    if(focusAction)content.querySelector('[data-action="'+focusAction+'"]'+(focusIndex!==null?'[data-index="'+focusIndex+'"]':''))?.focus({preventScroll:true});
    session.justPlaced=null;
  }
  function check() {
    if(!session||session.summary||session.composing||done())return;
    const q=active(),value=answerValue();
    if(!value?.trim())return;
    if(tileMode()&&session.selected.length!==session.tiles.length)return;
    session.explain=false;
    if(isCorrect(q,value)){session.status='correct';session.message='';playFeedback('correct');}
    else {
      session.hadError=true;session.status='wrong';session.errors++;session.hints=Math.max(1,session.hints);
      const feedback=q.kind==='input'&&!session.supported?answerFeedback(q,value):null;
      session.message=feedback?.accentOnly?'철자는 맞아요. 악센트만 확인해요.':feedback?.tokens.some(t=>t.kind==='missing')?'빠진 단어가 있어요.':tileMode()?'단어 순서를 한 번 바꿔봐요.':q.kind==='choice'?q.hint:'표시된 부분을 다시 써볼까요?';
      if(q.kind==='input'&&!session.supported&&session.errors===2&&!feedback?.accentOnly) {
        session.supported=true;session.tiles=shuffle(supportTiles(q).tiles);session.selected=[];session.message='카드로 한 번 만들어볼까요?';
      }
      if(!feedback?.accentOnly)playFeedback('wrong');
    }
    render({tilesChanged:true});
  }
  function advance() {
    if(!session||session.summary||!done())return;
    const q=active();
    session.results.push({id:q.id,correct:session.status==='correct',independent:session.status==='correct'&&q.kind==='input'&&!q.model&&!session.hints&&!session.hadError&&!session.supported,needsReview:session.hadError||session.hints>0||session.status==='revealed'});
    if(session.index<session.deck.length-1){session.index++;prepare();render();}
    else {
      session.summary=recordPractice(state,session.results,{packId:session.packId,continued:session.continued,runId:session.runId});
      delete drafts[session.packId];save();saveDrafts();onFinish(session.summary);playFeedback('complete');renderResult();
    }
  }
  function renderResult() {
    const s=session.summary,retry=session.results.filter(r=>r.needsReview||!r.correct).map(r=>questionById(r.id));
    const progress=dailyProgress(state),nextGift=[{days:1,name:'작은 화분'},{days:3,name:'책 한 묶음'},{days:7,name:'포근한 러그'}].find(g=>g.days>progress.days);
    const growth=s.recovered?'막혔던 '+s.recovered+'개를 혼자 풀었어요.':s.newSentences?'새 문장 '+s.newSentences+'개를 혼자 썼어요.':s.newQuestions?'처음 푼 문제 '+s.newQuestions+'개 완료!':'기억을 한 번 더 단단하게.';
    const target=retry.length?'헷갈린 '+retry.length+'문제 다시 도전':'다음 5문제';
    content.innerHTML=dialogHeader('한 판 완료')+'<div class="dialog-body practice-body practice-completion game-result center"><div class="result-mascot">'+mascot('complete')+'</div><p class="completion-eyebrow">'+s.total+'문제 완료</p><h3 class="dialog-title" tabindex="-1">한 판 해냈어요!</h3><p class="result-growth">'+escape(growth)+'</p><div class="result-stats"><div><strong>'+s.correct+' / '+s.total+'</strong><span>완성한 문제</span></div><div><strong class="completion-reward">'+(s.xp?'+'+s.xp:'0')+' XP</strong><span>이번에 쌓은 경험치</span></div></div><div class="result-stamp">'+icon('check')+(progress.questions>=3?'오늘의 스탬프 완료':'오늘 '+progress.questions+' / 3문제')+'</div>'+(nextGift?'<p class="next-gift">'+nextGift.name+'까지 스탬프 '+(nextGift.days-progress.days)+'개</p>':'<p class="next-gift">루의 방을 모두 채웠어요.</p>')+(retry.length?'<details class="practice-recap"><summary>다시 볼 표현 '+retry.length+'개</summary>'+retry.map(q=>'<article><b lang="fr">'+escape(q.full)+'</b><p>'+escape(q.ko)+'</p></article>').join('')+'</details>':'')+(saveFailed?'<p class="inline-alert">지금은 이 기기에 기록을 저장하지 못하고 있어요.</p>':'')+'</div><div class="dialog-footer practice-footer game-result-footer"><button class="primary-button" data-action="'+(retry.length?'practice-retry':'practice-more')+'">'+target+icon('arrow')+'</button><button class="text-link" data-action="practice-close">오늘은 여기까지</button></div>';
    focusDialog();content.querySelector('.dialog-title')?.focus({preventScroll:true});
  }
  function packCard(pack) {
    const done=packDone(pack),paused=drafts[pack.id],recommended=nextPack(state).id===pack.id;
    const seen=pack.questions.filter(q=>state.cards[q.id]).length;
    const pct=paused?Math.round(paused.index/pack.questions.length*100):done?100:Math.round(seen/pack.questions.length*100);
    return '<button class="practice-pack '+(packStarted(pack)?'in-progress':done?'is-complete':'')+'" data-action="practice-start" data-id="'+pack.id+'"><span class="pack-icon '+pack.color+'">'+icon(pack.icon)+'</span><span class="pack-copy"><small>'+(paused?'이어서 학습':done?'한 판 완료':seen?'학습 중':recommended?'오늘의 추천':'시작 전')+'</small><h3>'+escape(pack.title)+'</h3><span class="pack-detail"><span class="practice-pattern" lang="fr">'+escape(pack.pattern.split('+')[0].trim())+'</span><span>'+(paused?(paused.index+1)+' / '+pack.questions.length+'문제':pack.questions.length+'문제 · 3–5분')+'</span></span><span class="pack-progress" aria-label="'+pct+'% 완료"><i style="width:'+pct+'%"></i></span></span><span class="pack-arrow">'+icon(done&&!paused?'check':'chevron')+'</span></button>';
  }
  function renderLibrary({compact=false}={}) {
    const completed=state.completed.length;
    const groups=practiceUnits.filter(unit=>libraryUnit==='all'||libraryUnit===unit.id);
    const filters=compact?'':'<div class="curriculum-summary"><div><strong>'+completed+' <small>/ '+practicePacks.length+' 코스 완료</small></strong><p>단어에서 문장까지, 한 번에 10문제</p></div><span>'+practicePacks.reduce((n,p)=>n+p.questions.length,0)+'문제</span></div><div class="curriculum-filters" role="group" aria-label="코스 단계"><button class="filter-button '+(libraryUnit==='all'?'active':'')+'" data-action="practice-unit" data-value="all" aria-pressed="'+(libraryUnit==='all')+'">전체</button>'+practiceUnits.map((unit,i)=>'<button class="filter-button '+(libraryUnit===unit.id?'active':'')+'" data-action="practice-unit" data-value="'+unit.id+'" aria-pressed="'+(libraryUnit===unit.id)+'">'+(i+1)+'단계</button>').join('')+'</div><div class="course-status-filters" role="group" aria-label="코스 진행 상태">'+[['all','모두'],['active','진행 중'],['new','시작 전'],['done','완료']].map(([value,label])=>'<button data-action="practice-status" data-value="'+value+'" aria-pressed="'+(libraryStatus===value)+'">'+label+'</button>').join('')+'</div>';
    let listing;
    if(compact) {
      const ids=[resumeInfo()?.packId,nextPack(state).id,...practicePacks.filter(p=>!packDone(p)).map(p=>p.id),...practicePacks.map(p=>p.id)];
      const packs=[...new Set(ids)].map(id=>practicePacks.find(p=>p.id===id)).filter(Boolean).slice(0,3);
      listing='<div class="practice-pack-grid">'+packs.map(packCard).join('')+'</div>';
    } else {
      listing=groups.map((unit,i)=>{
        const packs=practicePacks.filter(p=>unit.packs.includes(p.id)&&(libraryStatus==='all'||libraryStatus==='active'&&packStarted(p)||libraryStatus==='new'&&!packDone(p)&&!packStarted(p)||libraryStatus==='done'&&packDone(p)&&!drafts[p.id]));
        if(!packs.length)return '';
        return '<section class="curriculum-unit"><div class="unit-heading"><span>'+String(practiceUnits.indexOf(unit)+1).padStart(2,'0')+'</span><div><h3>'+unit.title+'</h3><p>'+unit.description+'</p></div><small>'+unit.packs.filter(id=>state.completed.includes(id)).length+' / '+unit.packs.length+'</small></div><div class="practice-pack-grid">'+packs.map(packCard).join('')+'</div></section>';
      }).join('')||'<div class="empty-state course-empty"><p>이 조건에 맞는 코스가 없어요.</p><button class="secondary-button" data-action="practice-filter-reset">전체 코스 보기</button></div>';
    }
    return '<section class="practice-library" data-compact="'+compact+'" aria-label="문장 만들기 코스"><div class="section-heading"><div><p class="section-kicker">읽고, 배열하고, 직접 써요</p><h2>나의 프랑스어 코스</h2></div>'+(compact?'<a class="text-link" href="#lessons" data-action="open-practice">전체 '+practicePacks.length+'개'+icon('chevron')+'</a>':'<span class="section-count">'+practiceUnits.length+'단계</span>')+'</div>'+filters+listing+(dueQuestions(state).length?'<button class="practice-due" data-action="practice-due">'+icon('cards')+'다시 꺼내볼 표현 '+dueQuestions(state).length+'개<span>복습 시작'+icon('arrow')+'</span></button>':'')+'</section>';
  }
  function refreshLibrary() {
    const library=document.querySelector('.practice-library');
    if(library)library.outerHTML=renderLibrary({compact:library.dataset.compact==='true'});
  }
  document.addEventListener('pointerdown',event=>{
    if(event.target.closest('[data-action="practice-accent"], [data-action="practice-accents"]'))event.preventDefault();
  });
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action^="practice-"]');if(!button||button.disabled)return;
    const action=button.dataset.action;
    if(action==='practice-unit'||action==='practice-status'||action==='practice-filter-reset') {
      if(action==='practice-unit')libraryUnit=button.dataset.value;
      else if(action==='practice-status')libraryStatus=button.dataset.value;
      else {libraryUnit='all';libraryStatus='all';}
      refreshLibrary();document.querySelector(action==='practice-filter-reset'?'[data-action="practice-unit"][data-value="all"]':'[data-action="'+action+'"][data-value="'+button.dataset.value+'"]')?.focus({preventScroll:true});return;
    }
    if(action==='practice-resume'){const paused=resumeInfo();if(paused)start(paused.packId);return;}
    if(action==='practice-start'){start(button.dataset.id||nextPack(state).id);return;}
    if(action==='practice-daily'){start('daily');return;}
    if(action==='practice-light'){start('light');return;}
    if(action==='practice-due'){start('review');return;}
    if(action==='practice-close'){closeDialog();return;}
    if(action==='practice-more'){if(session?.summary)start('daily',true);return;}
    if(action==='practice-retry'){
      if(session?.summary){const retry=session.results.filter(r=>r.needsReview||!r.correct).map(r=>questionById(r.id));if(retry.length)start('retry',true,retry);}
      return;
    }
    if(!session||session.summary)return;
    const finished=done();
    switch(action) {
      case 'practice-choice':if(!finished){session.choice=button.dataset.value;check();}break;
      case 'practice-pick':
        if(!finished&&!session.selected.includes(Number(button.dataset.index))){session.selected.push(Number(button.dataset.index));session.justPlaced=session.selected.length-1;render({tilesChanged:true,focusAction:'practice-unpick',focusIndex:session.justPlaced});}break;
      case 'practice-unpick':if(!finished){const [index]=session.selected.splice(Number(button.dataset.index),1);render({tilesChanged:true,focusAction:'practice-pick',focusIndex:index});}break;
      case 'practice-clear':if(!finished){session.selected=[];render({tilesChanged:true,focusAction:'practice-pick'});}break;
      case 'practice-type':if(!finished){session.supported=false;session.tiles=[];session.selected=[];render();content.querySelector('#practice-input')?.focus({preventScroll:true});}break;
      case 'practice-check':check();break;
      case 'practice-hint':
        if(!finished){if(session.hints){session.hints=2;session.status='revealed';}else {session.hints=1;session.message=active().hint;}render({tilesChanged:true});}break;
      case 'practice-why':
        session.explain=!session.explain;if(!finished)session.hints=Math.max(1,session.hints);
        render();if(session.explain)content.querySelector('#practice-explanation')?.scrollIntoView?.({block:'nearest',behavior:'instant'});break;
      case 'practice-sound':speak(active().full);break;
      case 'practice-next':advance();break;
      case 'practice-accents':
        if(!finished){session.accentOpen=!session.accentOpen;content.querySelector('#accent-keys').hidden=!session.accentOpen;button.setAttribute('aria-expanded',String(session.accentOpen));}break;
      case 'practice-accent': {
        const input=content.querySelector('#practice-input');if(finished||!input)return;
        const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
        if(input.value.length-(end-start)+button.dataset.value.length>input.maxLength)return;
        input.setRangeText(button.dataset.value,start,end,'end');session.draft=input.value;
        content.querySelector('[form="practice-form"]').disabled=!session.draft.trim();
        input.focus({preventScroll:true});stash();break;
      }
    }
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='practice-input'&&session&&!session.summary){
      session.draft=event.target.value;content.querySelector('[form="practice-form"]').disabled=!session.draft.trim();stash();
    }
  });
  document.addEventListener('compositionstart',event=>{if(event.target.id==='practice-input'&&session)session.composing=true;});
  document.addEventListener('compositionend',event=>{if(event.target.id==='practice-input'&&session)session.composing=false;});
  document.addEventListener('keydown',event=>{if(event.target.id==='practice-input'&&event.key==='Enter'&&(event.isComposing||event.keyCode===229))event.preventDefault();});
  document.addEventListener('submit',event=>{if(event.target.id==='practice-form'){event.preventDefault();check();}});
  return {
    key:PRACTICE_KEY,draftKey:PRACTICE_DRAFT_KEY,
    stop:()=>{stash();session=null;content.closest('dialog')?.classList.remove('typing-focused');},
    reset:()=>{state=freshPractice();drafts={};session=null;libraryUnit='all';libraryStatus='all';save();saveDrafts();},
    reload:()=>{state=readPractice(storage);drafts=readPracticeDrafts(storage);},
    questionCount:()=>practicePacks.reduce((n,p)=>n+p.questions.length,0),
    resumeInfo,dueCount:()=>dueQuestions(state).length,recommended:()=>nextPack(state),dailyProgress:()=>dailyProgress(state),
    independentCount:()=>independentSentences(state).length,independentExpressions:()=>independentSentences(state),
    renderLibrary,
    renderStats:()=>'<section class="practice-progress"><h2>문장 만들기</h2><div class="practice-stat-row"><span><b>'+state.completed.length+' / '+practicePacks.length+'</b>완료한 코스</span><span><b>'+independentSentences(state).length+'</b>혼자 쓴 문장</span><span><b>'+dailyProgress(state).days+'</b>모은 스탬프</span></div><p class="practice-stat-note">하루 3문제 이상을 마치면 스탬프를 모아요.</p></section>'
  };
}
