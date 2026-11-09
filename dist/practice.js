import { practicePacks, practiceUnits, questionById } from './practice-data.js';
import { PRACTICE_KEY, PRACTICE_DRAFT_KEY, readPracticeDrafts, freshPractice, readPractice, dueQuestions, reviewDeck, nextPack, independentSentences, isCorrect, recordPractice, answerFeedback } from './practice-core.js';
import { shuffle } from './core.js';
import { mascot, companionMessage } from './companion.js';

export function createPractice({ storage, content, dialogHeader, openDialog, closeDialog, focusDialog, icon, escape, speak, playFeedback=()=>{}, onFinish, onSaveError }) {
  let state=readPractice(storage), drafts=readPracticeDrafts(storage), session=null, saveFailed=false;
  let libraryUnit='all', libraryStatus='all';
  const saveError=()=>{if(!saveFailed)onSaveError();saveFailed=true;};
  const save=()=>{try{storage.setItem(PRACTICE_KEY,JSON.stringify(state));}catch{saveError();}};
  const saveDrafts=()=>{try{storage.setItem(PRACTICE_DRAFT_KEY,JSON.stringify({version:1,sessions:drafts}));}catch{saveError();}};
  function stash() {
    if(!session||session.summary)return;
    drafts[session.packId]={packId:session.packId,questionIds:session.deck.map(q=>q.id),index:session.index,
      results:session.results.map(r=>({...r})),continued:session.continued,updatedAt:Date.now(),
      current:{draft:session.draft,selected:[...session.selected],tiles:[...session.tiles],choice:session.choice,hints:session.hints,hadError:session.hadError,status:session.status}};
    saveDrafts();
  }
  const resumeInfo=()=>{
    const draft=Object.values(drafts).sort((a,b)=>b.updatedAt-a.updatedAt)[0];
    return draft?{packId:draft.packId,title:practicePacks.find(p=>p.id===draft.packId)?.title||'기억을 깨우는 복습',index:draft.index,total:draft.questionIds.length}:null;
  };
  const active=()=>session?.deck[session.index];
  const recallCount=()=>session.deck.filter(q=>q.kind==='input'&&!q.model).length;
  const packDone=pack=>state.completed.includes(pack.id);
  const reviewQuestion=q=>({...q,kind:'input',phase:'다시 꺼내 보기',transfer:false,model:undefined,choices:undefined,tiles:undefined});
  function start(id,continued=false) {
    const pack=practicePacks.find(p=>p.id===id),paused=drafts[id];
    const deck=id==='review'?(paused?paused.questionIds.map(questionById).map(reviewQuestion):reviewDeck(state)):pack?.questions.map(q=>({...q,transfer:q.transfer===true&&!state.cards[q.id]}));
    if(!deck?.length)return;
    openDialog();
    session={packId:id,title:pack?.title||'기억을 깨우는 복습',deck,index:paused?.index||0,results:paused?.results.map(r=>({...r}))||[],continued:paused?.continued||continued,summary:null};
    if(paused){Object.assign(session,paused.current);session.selected=[...paused.current.selected];session.tiles=[...paused.current.tiles];}
    else prepare();
    render();
  }
  function prepare() {
    Object.assign(session,{draft:'',selected:[],hints:0,hadError:false,status:'idle',message:'',choice:null,accentOpen:false});
    session.tiles=shuffle(active().tiles||[]);
  }
  function wrongWords(q) {
    if(session.status!=='wrong'||q.kind!=='input')return '';
    const feedback=answerFeedback(q,session.draft);
    const message=feedback.accentOnly?'철자는 맞아요. 악센트를 확인해 보세요.':'표시된 부분의 철자·순서와 빠진 단어를 확인해 보세요.';
    return '<div class="answer-attempt" role="status"><b>'+message+'</b><div>'+feedback.tokens.map(token=>'<mark class="attempt-word '+(token.kind==='ok'?'ok':token.kind==='missing'?'missing':'needs-work')+'" '+(token.kind==='missing'?'':'lang="fr"')+'>'+escape(token.text)+'</mark>').join(' ')+'</div></div>';
  }
  const modeLabel=q=>q.kind==='order'?'단어 카드 배열':q.kind==='choice'?'빈칸 고르기':q.mode==='word'?'단어 타이핑':q.cue?'빈칸 타이핑':'문장 타이핑';
  function explanation(q) {
    const pack=practicePacks.find(p=>p.id===q.packId);
    return '<div class="explanation-brief"><span>이렇게 만들어요</span><p>'+escape(q.note)+'</p></div><details class="answer-detail" '+(session.hadError||session.status==='revealed'?'open':'')+'><summary>문장 구조 · 주의할 점</summary><div class="grammar-guide"><p class="grammar-pattern" lang="fr">'+escape(pack.pattern)+'</p><p>'+escape(pack.guide.rule)+'</p><div class="grammar-caution"><b>기억해 두세요</b><p>'+escape(pack.guide.caution)+'</p></div></div></details>';
  }
  function render({preserveScroll=false,focusAction=null,focusIndex=null}={}) {
    if(!session)return;
    if(session.summary)return renderResult();
    const scroll=preserveScroll?content.querySelector('.dialog-body')?.scrollTop||0:0;
    stash();
    const q=active(),done=['correct','revealed'].includes(session.status);
    const model=q.model?'<div class="practice-model" aria-label="예문"><span class="model-label">먼저, 한 문장</span><b lang="fr">'+escape(q.model.fr)+'</b><small>'+escape(q.model.ko)+'</small><p>'+escape(q.model.tip)+'</p></div>':'';
    let interaction='';
    if(q.kind==='choice') interaction='<div class="practice-options">'+shuffleChoices(q).map(choice=>'<button class="choice '+(session.choice===choice&&session.status==='wrong'?'incorrect':'')+' '+(done&&choice===q.answer?'correct':'')+'" data-action="practice-choice" data-value="'+escape(choice)+'" '+(done?'disabled':'')+'>'+escape(choice)+'</button>').join('')+'</div>';
    else if(q.kind==='order') interaction='<div class="tile-answer" aria-label="선택한 단어"><span class="visually-hidden">누른 단어를 다시 누르면 취소돼요.</span>'+(session.selected.length?session.selected.map((index,i)=>'<button class="word-tile selected" data-action="practice-unpick" data-index="'+i+'" '+(done?'disabled':'')+' aria-label="'+escape(session.tiles[index])+' 선택 취소">'+escape(session.tiles[index])+'</button>').join(''):'<span class="tile-placeholder">카드를 눌러 문장을 만들어요</span>')+'</div><div class="tile-pool" aria-label="문장을 만들 단어">'+session.tiles.map((tile,i)=>'<button class="word-tile" data-action="practice-pick" data-index="'+i+'" '+(done||session.selected.includes(i)?'disabled':'')+'>'+escape(tile)+'</button>').join('')+'</div>'+(!done?'<div class="tile-tools"><span>선택한 카드를 누르면 되돌릴 수 있어요</span><button class="text-link" data-action="practice-clear" '+(!session.selected.length?'disabled':'')+'>다시 배열</button></div>':'');
    else interaction='<form id="practice-form"><label class="visually-hidden" for="practice-input">'+modeLabel(q)+'</label><input id="practice-input" class="practice-input" lang="fr" type="text" maxlength="180" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-describedby="typing-help" aria-invalid="'+(session.status==='wrong')+'" placeholder="'+(q.mode==='word'?'프랑스어 단어':q.cue?'빈칸에 들어갈 말':'프랑스어 문장을 써보세요')+'" value="'+escape(session.draft)+'" '+(done?'disabled':'')+'></form>'+(!done?'<div class="typing-tools"><span id="typing-help">대소문자와 문장 부호는 자유롭게</span><button class="accent-toggle" data-action="practice-accents" aria-expanded="'+Boolean(session.accentOpen)+'" aria-controls="accent-keys">é · 악센트</button></div><div id="accent-keys" class="accent-keys" role="group" aria-label="프랑스어 글자 입력" '+(session.accentOpen?'':'hidden')+'>'+['é','è','ê','ë','à','â','ç','î','ï','ô','ù','û','ü','œ','’'].map(letter=>'<button type="button" data-action="practice-accent" data-value="'+letter+'" aria-label="'+letter+' 입력">'+letter+'</button>').join('')+'</div>':'<span id="typing-help" hidden></span>');
    const feedback=done?'<section class="practice-feedback '+(session.status==='revealed'?'assisted':'')+'"><div role="status">'+companionMessage(session.status==='revealed'?'revealed':'correct')+'<b class="answer-verdict">'+icon(session.status==='revealed'?'book':'check')+(session.status==='revealed'?'정답을 함께 확인해요':q.kind==='input'&&!session.hints&&!session.hadError?'스스로 떠올렸어요':'잘 완성했어요')+'</b></div><p class="correct-sentence" lang="fr">'+escape(q.full)+'</p>'+explanation(q)+'<button class="sound-button" data-action="practice-sound">'+icon('sound')+'발음 듣기</button></section>':(session.status==='wrong'||session.message?'<div class="practice-feedback pending assisted" role="status">'+(session.status==='wrong'?companionMessage('wrong'):'')+'<span>'+escape(session.message||'다시 한 번 해볼까요?')+'</span></div>':'');
    content.innerHTML=dialogHeader(session.title,(session.index+1)/session.deck.length*100,(session.index+1)+' / '+session.deck.length,!saveFailed)+'<div class="dialog-body practice-body" data-practice-question="'+q.id+'"><div class="exercise-heading"><span class="exercise-mode">'+modeLabel(q)+'</span><span>'+(q.transfer?'새 문장에 도전':q.phase)+'</span></div>'+model+'<div class="practice-question"><h3 class="practice-prompt">'+escape(q.ko)+'</h3>'+(q.glossary?'<p class="practice-glossary">'+escape(q.glossary)+'</p>':'')+(q.cue?'<p class="practice-cue" lang="fr">'+escape(q.cue).replace('___','<span class="blank-space">···</span>')+'</p>':'')+interaction+'</div>'+wrongWords(q)+(!done&&session.hints?'<div class="practice-hint" role="status">'+escape(q.hint)+'</div>':'')+feedback+(!done?'<div class="practice-help"><button class="text-link" data-action="practice-hint">'+icon('sparkles')+(session.hints?'정답과 해설 보기':'힌트 보기')+'</button></div>':'')+'</div><div class="dialog-footer practice-footer">'+(done?'<button class="primary-button" data-action="practice-next">'+(session.index===session.deck.length-1?'결과 보기':'다음 문제')+icon('arrow')+'</button>':q.kind!=='choice'?'<button class="primary-button" '+(q.kind==='input'?'type="submit" form="practice-form"':'data-action="practice-check"')+' '+((q.kind==='order'&&session.selected.length!==session.tiles.length)||(q.kind==='input'&&!session.draft.trim())?'disabled':'')+'>확인하기'+icon('check')+'</button>':'')+'</div>';
    focusDialog();
    const body=content.querySelector('.dialog-body');body.scrollTop=scroll;
    if(session.status==='wrong')content.querySelector('#practice-input')?.focus({preventScroll:true});
    if(done)content.querySelector('[data-action="practice-next"]')?.focus({preventScroll:true});
    if(focusAction)content.querySelector('[data-action="'+focusAction+'"]'+(focusIndex!==null?'[data-index="'+focusIndex+'"]':''))?.focus({preventScroll:true});
  }
  function shuffleChoices(q) {
    if(session.choicesFor!==q.id){session.choicesFor=q.id;session.choices=shuffle(q.choices||[]);}
    return session.choices;
  }
  function check() {
    if(!session||session.summary||session.composing||['correct','revealed'].includes(session.status))return;
    const q=active(),value=q.kind==='choice'?session.choice:q.kind==='order'?session.selected.map(i=>session.tiles[i]).join(' '):session.draft;
    if(!value?.trim()){session.message='답을 입력해 주세요.';render();return;}
    if(q.kind==='order'&&session.selected.length!==session.tiles.length)return;
    if(isCorrect(q,value)){session.status='correct';session.message='';playFeedback('correct');}
    else {
      session.hadError=true;session.status='wrong';session.hints=Math.max(1,session.hints);
      session.message=q.kind==='input'?'힌트를 참고해 다시 써보세요.':q.kind==='order'?'선택한 카드를 눌러 순서를 바꿔보세요.':'힌트를 보고 다시 골라보세요.';
      playFeedback('wrong');
    }
    render();
  }
  function advance() {
    if(!session||session.summary||!['correct','revealed'].includes(session.status))return;
    const q=active();
    session.results.push({id:q.id,correct:session.status==='correct',independent:session.status==='correct'&&q.kind==='input'&&!q.model&&!session.hints&&!session.hadError,needsReview:session.hadError||session.hints>0||session.status==='revealed'});
    if(session.index<session.deck.length-1){session.index++;prepare();render();}
    else {
      session.summary=recordPractice(state,session.results,{packId:session.packId,continued:session.continued});
      delete drafts[session.packId];save();saveDrafts();onFinish(session.summary);playFeedback('complete');renderResult();
    }
  }
  function renderResult() {
    const s=session.summary,next=nextPack(state,session.packId),example=session.deck.at(-1);
    const retry=session.results.filter(r=>r.needsReview||!r.correct).map(r=>questionById(r.id));
    const confetti=Array.from({length:20},(_,i)=>'<i style="--x:'+((i*37)%100)+'%;--drift:'+((i%2?1:-1)*(20+i*3))+'px;--delay:'+((i%5)*.09)+'s;--spin:'+(i%2?240:-240)+'deg;--color:'+['#9ab67d','#d9b66d','#789d94','#c2b5ce'][i%4]+'"></i>').join('');
    content.innerHTML=dialogHeader(session.title)+'<div class="dialog-body center practice-body practice-completion"><div class="completion-confetti" aria-hidden="true">'+confetti+'</div><section class="completion-hero"><div class="completion-mascot">'+mascot('complete')+'</div><p class="completion-cheer" lang="fr">Bravo, bravo !</p><p class="completion-eyebrow">'+s.total+'문제 완료</p><h3 class="dialog-title" tabindex="-1">한 판 해냈어요!</h3><span class="completion-reward">'+(s.xp?'+'+s.xp+' XP':'복습 완료')+(s.transfer?'<span>새 문장도 성공</span>':'')+'</span></section><div class="result-stats"><div><strong>'+s.correct+' / '+s.total+'</strong><span>완성한 문제</span></div><div><strong>'+s.independent+' / '+recallCount()+'</strong><span>힌트 없이 떠올린 답</span></div></div><div class="practice-takeaway"><span>이번에 연습한 문장</span><b lang="fr">'+escape(example.full)+'</b><p>'+escape(example.ko)+'</p></div>'+(retry.length?'<details class="practice-recap"><summary>다시 살펴볼 문제 '+retry.length+'개</summary>'+retry.map(q=>'<article><b lang="fr">'+escape(q.full)+'</b><p>'+escape(q.ko)+'</p><small>'+escape(q.note)+'</small></article>').join('')+'</details>':'<p class="round-confidence">모든 문제를 완성했어요. 내일 다시 떠올려봐요.</p>')+(saveFailed?'<p class="inline-alert">브라우저 저장 공간을 사용할 수 없어 이번 방문 동안만 기록이 유지돼요.</p>':'')+'</div><div class="dialog-footer practice-footer practice-result-actions"><button class="secondary-button" data-action="practice-more" data-id="'+next.id+'">한 판 더'+icon('arrow')+'</button><button class="primary-button" data-action="practice-close">마치기'+icon('check')+'</button></div>';
    focusDialog();content.querySelector('.dialog-title')?.focus({preventScroll:true});
  }
  function packCard(pack) {
    const done=packDone(pack),paused=drafts[pack.id],recommended=nextPack(state).id===pack.id;
    const pct=paused?Math.round(paused.index/pack.questions.length*100):done?100:0;
    return '<button class="practice-pack '+(paused?'in-progress':done?'is-complete':'')+'" data-action="practice-start" data-id="'+pack.id+'"><span class="pack-icon '+pack.color+'">'+icon(pack.icon)+'</span><span class="pack-copy"><small>'+(paused?'이어서 학습':done?'한 판 완료':recommended?'오늘의 추천':'시작 전')+'</small><h3>'+escape(pack.title)+'</h3><span class="pack-detail"><span class="practice-pattern" lang="fr">'+escape(pack.pattern.split('+')[0].trim())+'</span><span>'+(paused?(paused.index+1)+' / '+pack.questions.length+'문제':pack.questions.length+'문제 · 3–5분')+'</span></span><span class="pack-progress" aria-label="'+pct+'% 완료"><i style="width:'+pct+'%"></i></span></span><span class="pack-arrow">'+icon(done&&!paused?'check':'chevron')+'</span></button>';
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
        const packs=practicePacks.filter(p=>unit.packs.includes(p.id)&&(libraryStatus==='all'||libraryStatus==='active'&&drafts[p.id]||libraryStatus==='new'&&!packDone(p)&&!drafts[p.id]||libraryStatus==='done'&&packDone(p)&&!drafts[p.id]));
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
      refreshLibrary();document.querySelector('[data-action="'+action+'"][data-value="'+button.dataset.value+'"]')?.focus({preventScroll:true});return;
    }
    if(action==='practice-resume'){const paused=resumeInfo();if(paused)start(paused.packId);return;}
    if(action==='practice-start'){start(button.dataset.id||nextPack(state).id);return;}
    if(action==='practice-due'){start('review');return;}
    if(action==='practice-close'){closeDialog();return;}
    if(action==='practice-more'){if(session?.summary)start(button.dataset.id,true);return;}
    if(!session||session.summary)return;
    const done=['correct','revealed'].includes(session.status);
    switch(action) {
      case 'practice-choice':if(!done){session.choice=button.dataset.value;check();}break;
      case 'practice-pick':if(!done&&!session.selected.includes(Number(button.dataset.index))){session.selected.push(Number(button.dataset.index));render({preserveScroll:true,focusAction:'practice-unpick',focusIndex:session.selected.length-1});}break;
      case 'practice-unpick':if(!done){const [index]=session.selected.splice(Number(button.dataset.index),1);render({preserveScroll:true,focusAction:'practice-pick',focusIndex:index});}break;
      case 'practice-clear':if(!done){session.selected=[];render({preserveScroll:true,focusAction:'practice-pick'});}break;
      case 'practice-check':check();break;
      case 'practice-hint':if(!done){if(session.hints){session.hints=2;session.status='revealed';}else session.hints=1;render({preserveScroll:true});}break;
      case 'practice-sound':speak(active().full);break;
      case 'practice-next':advance();break;
      case 'practice-accents':
        if(!done){session.accentOpen=!session.accentOpen;content.querySelector('#accent-keys').hidden=!session.accentOpen;button.setAttribute('aria-expanded',String(session.accentOpen));}break;
      case 'practice-accent': {
        const input=content.querySelector('#practice-input');if(done||!input)return;
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
    resumeInfo,dueCount:()=>dueQuestions(state).length,recommended:()=>nextPack(state),
    independentCount:()=>independentSentences(state).length,independentExpressions:()=>independentSentences(state),
    renderLibrary,
    renderStats:()=>'<section class="practice-progress"><h2>문장 만들기</h2><div class="practice-stat-row"><span><b>'+state.completed.length+' / '+practicePacks.length+'</b>완료한 코스</span><span><b>'+independentSentences(state).length+'</b>혼자 쓴 문장</span><span><b>'+state.runs.filter(r=>r.transfer).length+'</b>새 문장 도전 성공</span></div><p class="practice-stat-note">혼자 쓴 문장은 힌트 없이 문장 전체를 타이핑한 기록이에요.</p></section>'
  };
}
