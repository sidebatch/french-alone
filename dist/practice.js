import { practicePacks } from './practice-data.js';
import { PRACTICE_KEY, freshPractice, readPractice, dueQuestions, reviewDeck, nextPack, independentSentences, isCorrect, recordPractice } from './practice-core.js';
import { shuffle } from './core.js';

export function createPractice({ storage, content, dialogHeader, openDialog, closeDialog, focusDialog, icon, escape, speak, onFinish, onSaveError }) {
  let state = readPractice(storage), session = null, saveFailed = false;
  const save = () => {try {storage.setItem(PRACTICE_KEY,JSON.stringify(state));} catch {saveFailed=true;onSaveError();}};
  const active = () => session?.deck[session.index];
  const recallCount = () => session.deck.filter(q=>q.kind==='input').length;
  function start(id, continued=false) {
    const pack=practicePacks.find(p=>p.id===id);
    const deck=id==='review'?reviewDeck(state):pack?.questions.map(q=>({...q,transfer:q.transfer===true&&!state.cards[q.id]}));
    if(!deck?.length)return;
    openDialog();
    session={packId:id,title:pack?.title||'돌아온 표현 다시 꺼내기',deck,index:0,results:[],continued,summary:null};
    prepare();render();
  }
  function prepare() {
    session.draft='';session.selected=[];session.hints=0;session.hadError=false;session.status='idle';session.message='';session.choice=null;
    session.tiles=shuffle(active().tiles||[]);
  }
  function render() {
    if(!session)return;
    if(session.summary)return renderResult();
    const q=active(),done=['correct','revealed'].includes(session.status);
    const model=q.model?`<div class="practice-model"><span>먼저 이 한마디</span><b lang="fr">${escape(q.model.fr)}</b><small>${escape(q.model.ko)}</small><p>${escape(q.model.tip)}</p></div>`:'';
    let interaction='';
    if(q.kind==='choice') interaction=`<div class="practice-options">${shuffleChoices(q).map(choice=>`<button class="choice ${session.choice===choice&&session.status==='wrong'?'incorrect':''} ${done&&choice===q.answer?'correct':''}" data-action="practice-choice" data-value="${escape(choice)}" ${done?'disabled':''}>${escape(choice)}</button>`).join('')}</div>`;
    else if(q.kind==='order') interaction=`<div class="tile-answer" aria-label="선택한 단어"><span class="visually-hidden">누른 단어를 다시 누르면 취소돼요.</span>${session.selected.length?session.selected.map((index,i)=>`<button class="word-tile selected" data-action="practice-unpick" data-index="${i}" ${done?'disabled':''} aria-label="${escape(session.tiles[index])} 선택 취소">${escape(session.tiles[index])}</button>`).join(''):'<span class="tile-placeholder">단어를 순서대로 눌러 보세요</span>'}</div><div class="tile-pool" aria-label="문장을 만들 단어">${session.tiles.map((tile,i)=>`<button class="word-tile" data-action="practice-pick" data-index="${i}" ${done||session.selected.includes(i)?'disabled':''}>${escape(tile)}</button>`).join('')}</div>`;
    else interaction=`<form id="practice-form"><label class="visually-hidden" for="practice-input">${q.cue?'빈칸에 들어갈 말':'프랑스어 문장'} 입력</label><input id="practice-input" class="practice-input" lang="fr" type="text" maxlength="180" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${q.cue?'빈칸에 들어갈 말':'배운 표현으로 문장 만들기'}" value="${escape(session.draft)}" ${done?'disabled':''}></form>`;
    const feedback=done?`<div class="practice-feedback ${session.status==='revealed'?'assisted':''}" role="status" tabindex="-1"><b>${session.status==='revealed'?'이렇게 연결하면 돼요.':q.kind==='input'&&!session.hints&&!session.hadError?'스스로 떠올렸어요!':'좋아요, 한 번 더 연결했어요.'}</b><p lang="fr">${escape(q.full)}</p><span>${escape(q.note)}</span><button class="sound-button" data-action="practice-sound">${icon('sound')}발음 듣기</button></div>`:`<div class="practice-feedback pending ${session.status==='wrong'?'assisted':''}" role="status">${escape(session.message||'배운 표현으로 완성해 보세요.')}</div>`;
    content.innerHTML=`${dialogHeader(session.title,(session.index+1)/session.deck.length*100,`${session.index+1} / ${session.deck.length}`)}<div class="dialog-body practice-body" data-practice-question="${q.id}"><div class="practice-stage"><span>${q.phase}</span>${q.transfer?'<b>처음 보는 조합</b>':''}</div>${model}<h3 class="practice-prompt">${escape(q.ko)}</h3>${q.glossary?`<p class="practice-glossary">${escape(q.glossary)}</p>`:''}${q.cue?`<p class="practice-cue" lang="fr">${escape(q.cue).replace('___','<span class="blank-space">···</span>')}</p>`:''}${interaction}${!done&&session.hints?`<div class="practice-hint" role="status">${escape(q.hint)}</div>`:''}${feedback}${!done?`<div class="practice-help"><button class="text-link" data-action="practice-hint">${icon('sparkles')}${session.hints?'정답 보고 연결하기':'조금만 도와줘'}</button><button class="text-link" data-action="practice-sound">${icon('sound')}소리 힌트</button></div>`:''}</div><div class="dialog-footer practice-footer"><span class="dialog-step">${session.results.filter(r=>r.independent).length}개 스스로 떠올림</span>${done?`<button class="primary-button" data-action="practice-next">${session.index===session.deck.length-1?'오늘의 발견 보기':'다음 한마디'}${icon('arrow')}</button>`:q.kind!=='choice'?`<button class="primary-button" ${q.kind==='input'?'type="submit" form="practice-form"':'data-action="practice-check"'} ${q.kind==='order'&&session.selected.length!==session.tiles.length?'disabled':''}>확인하기${icon('check')}</button>`:''}</div>`;
    focusDialog();
    if(session.status==='wrong')content.querySelector('#practice-input')?.focus({preventScroll:true});
    if(done)content.querySelector('[data-action="practice-next"]')?.focus({preventScroll:true});
  }
  function shuffleChoices(q) {if(!session.choicesFor || session.choicesFor!==q.id){session.choicesFor=q.id;session.choices=shuffle(q.choices||[]);}return session.choices;}
  function check() {
    if(!session||session.summary||['correct','revealed'].includes(session.status))return;
    const q=active(),value=q.kind==='choice'?session.choice:q.kind==='order'?session.selected.map(i=>session.tiles[i]).join(' '):session.draft;
    if(!value?.trim()){session.message='떠오르는 답을 적어 보세요. 힌트를 눌러도 좋아요.';render();return;}
    if(isCorrect(q,value)){session.status='correct';session.message='';}
    else {session.hadError=true;session.status='wrong';session.hints=Math.max(1,session.hints);session.message='이번에는 방금 배운 표현으로 연결해 볼까요? 아래 힌트를 보며 다시 시도해 보세요.';}
    render();
  }
  function advance() {
    if(!session||session.summary||!['correct','revealed'].includes(session.status))return;
    const q=active();session.results.push({id:q.id,correct:session.status==='correct',independent:session.status==='correct'&&q.kind==='input'&&!session.hints&&!session.hadError});
    if(session.index<session.deck.length-1){session.index++;prepare();render();}
    else {session.summary=recordPractice(state,session.results,{packId:session.packId,continued:session.continued});save();onFinish(session.summary);renderResult();}
  }
  function renderResult() {
    const s=session.summary,next=nextPack(state,session.packId);
    const transfer=session.deck.find(q=>q.transfer),transferResult=transfer&&session.results.find(r=>r.id===transfer.id);
    const example=session.deck.at(-1);
    const resultTitle=s.independent?'내 힘으로 꺼낸 말이 생겼어요.':s.correct?'한마디씩 연결해 봤어요.':'새로운 말과 첫인사를 나눴어요.';
    const transferNote=transferResult?.independent?'새 동사를 넣은 문장도 혼자 완성했어요.':transferResult?.correct?'도움을 받아 새 문장을 연결했어요. 다음에는 힌트를 조금 줄여 봐요.':transfer?'새 조합은 내일 다시 만나 봐요. 지금은 한 번 연결해 본 것으로 충분해요.':'다시 떠올린 표현은 복습 간격이 조금씩 길어져요.';
    content.innerHTML=`${dialogHeader('오늘 발견한 나의 프랑스어')}<div class="dialog-body center practice-body"><div class="result-medal" aria-hidden="true">✳</div><h3 class="dialog-title">${resultTitle}</h3><p class="explanation">${escape(transferNote)}</p><div class="result-stats"><div><strong>${s.independent} / ${recallCount()}</strong><span>직접 쓰는 문제 · 도움 없이 정답</span></div><div><strong>+${s.xp}</strong><span>새롭게 쌓인 XP</span></div></div><div class="practice-takeaway"><span>${transfer?(transferResult?.correct?'오늘 처음 연결한 문장':'다음에 다시 꺼내볼 문장'):'다시 만난 한마디'}</span><b lang="fr">${escape(example.full)}</b><p>${escape(example.ko)}</p><small>${s.correct} / ${s.total}문제 완성 · 힌트로 완성한 답도 포함해요.</small></div>${saveFailed?'<p class="inline-alert">브라우저 저장 공간을 사용할 수 없어 이번 방문 동안만 기록이 유지돼요.</p>':''}<p class="speech-note">오늘 연습한 표현은 내일부터 다시 만나요. 같은 답에 XP를 반복해서 주지는 않아요.</p></div><div class="dialog-footer practice-footer practice-result-actions"><button class="secondary-button" data-action="practice-close">오늘은 여기까지</button><button class="primary-button" data-action="practice-more" data-id="${next.id}">한 판 더${icon('arrow')}</button></div>`;
    focusDialog();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action^="practice-"]');if(!button||button.disabled)return;
    const action=button.dataset.action;
    if(action==='practice-start'){start(button.dataset.id||nextPack(state).id);return;}
    if(action==='practice-due'){start('review');return;}
    if(action==='practice-close'){closeDialog();return;}
    if(action==='practice-more'){if(session?.summary)start(button.dataset.id,true);return;}
    if(!session||session.summary)return;
    const done=['correct','revealed'].includes(session.status);
    switch(action){
      case 'practice-choice':if(!done){session.choice=button.dataset.value;check();}break;
      case 'practice-pick':if(!done&&!session.selected.includes(Number(button.dataset.index))){session.selected.push(Number(button.dataset.index));render();}break;
      case 'practice-unpick':if(!done){session.selected.splice(Number(button.dataset.index),1);render();}break;
      case 'practice-check':check();break;
      case 'practice-hint':if(!done){if(session.hints){session.hints=2;session.status='revealed';}else session.hints=1;render();}break;
      case 'practice-sound':if(speak(active().full)&&!done){session.hints=Math.max(1,session.hints);session.message='소리 힌트를 들었어요. 이제 직접 연결해 보세요.';render();}break;
      case 'practice-next':advance();break;
    }
  });
  document.addEventListener('input',event=>{if(event.target.id==='practice-input'&&session&&!session.summary)session.draft=event.target.value;});
  document.addEventListener('submit',event=>{if(event.target.id==='practice-form'){event.preventDefault();check();}});
  return {
    key:PRACTICE_KEY,
    stop:()=>{session=null;},
    reset:()=>{state=freshPractice();session=null;save();},
    reload:()=>{state=readPractice(storage);},
    recommended:()=>nextPack(state),
    independentCount:()=>independentSentences(state).length,
    independentExpressions:()=>independentSentences(state),
    renderLibrary:()=>`<section class="practice-library" aria-label="내 말이 되는 10문제"><div class="section-heading"><h2>내 말이 되는 10문제 <small>발견 → 떠올리기 → 새 문장</small></h2></div><div class="practice-pack-grid">${practicePacks.map((pack,i)=>`<button class="practice-pack" data-action="practice-start" data-id="${pack.id}"><span class="practice-pack-top"><span class="stat-icon ${pack.color}">${icon(pack.icon)}</span><small>ROUND ${String(i+1).padStart(2,'0')}</small></span><h3>${pack.title}</h3><p>${pack.subtitle}</p><span class="practice-pattern" lang="fr">${pack.pattern}</span><span class="practice-pack-bottom">10문제 · 약 3–5분${icon('arrow')}</span></button>`).join('')}</div>${dueQuestions(state).length?`<button class="practice-due" data-action="practice-due">${icon('cards')}다시 꺼내볼 표현 ${dueQuestions(state).length}개<span>최대 10개씩${icon('arrow')}</span></button>`:'<p class="practice-library-note">조금 막혀도 괜찮아요. 힌트를 받고 끝까지 연결해 보세요.</p>'}</section>`,
    renderStats:()=>`<section class="practice-progress"><div><span class="eyebrow">내 말이 된 순간들</span><h2>처음엔 힌트와 함께, 다음엔 스스로.</h2><p>“도움 없이 정답”은 직접 입력한 문제에서 첫 시도에 힌트 없이 맞힌 기록이에요.</p></div><div class="practice-stat-row"><span><b>${state.runs.length}</b>마친 한 판</span><span><b>${independentSentences(state).length}</b>스스로 꺼내본 표현</span><span><b>${state.runs.filter(r=>r.transfer).length}</b>새 조합도 혼자 성공</span></div></section>`
  };
}
