import { practicePacks, questionById } from './practice-data.js';
import { PRACTICE_KEY, PRACTICE_DRAFT_KEY, readPracticeDrafts, freshPractice, readPractice, dueQuestions, reviewDeck, nextPack, independentSentences, isCorrect, recordPractice, normalizeAnswer } from './practice-core.js';
import { shuffle } from './core.js';

export function createPractice({ storage, content, dialogHeader, openDialog, closeDialog, focusDialog, icon, escape, speak, playFeedback=()=>{}, onFinish, onSaveError }) {
  let state = readPractice(storage), drafts = readPracticeDrafts(storage), session = null, saveFailed = false;
  const save = () => {try {storage.setItem(PRACTICE_KEY,JSON.stringify(state));} catch {if(!saveFailed)onSaveError();saveFailed=true;}};
  const saveDrafts = () => {try {storage.setItem(PRACTICE_DRAFT_KEY,JSON.stringify({version:1,sessions:drafts}));} catch {if(!saveFailed)onSaveError();saveFailed=true;}};
  function stash() {
    if(!session||session.summary)return;
    drafts[session.packId]={packId:session.packId,questionIds:session.deck.map(q=>q.id),index:session.index,
      results:session.results.map(r=>({...r})),continued:session.continued,updatedAt:Date.now(),
      current:{draft:session.draft,selected:[...session.selected],tiles:[...session.tiles],choice:session.choice,hints:session.hints,hadError:session.hadError,status:session.status}};
    saveDrafts();
  }
  const resumeInfo = () => {
    const draft=Object.values(drafts).sort((a,b)=>b.updatedAt-a.updatedAt)[0];
    return draft?{packId:draft.packId,title:practicePacks.find(p=>p.id===draft.packId)?.title||'기억을 깨우는 복습',index:draft.index,total:draft.questionIds.length}:null;
  };
  const active = () => session?.deck[session.index];
  const recallCount = () => session.deck.filter(q=>q.kind==='input').length;
  function start(id, continued=false) {
    const pack=practicePacks.find(p=>p.id===id),paused=drafts[id];
    let deck;
    if(id==='review')deck=paused?paused.questionIds.map(questionById).map(q=>({...q,kind:'input',phase:'다시 꺼내 보기',transfer:false,model:undefined,choices:undefined,tiles:undefined})):reviewDeck(state);
    else deck=pack?.questions.map(q=>({...q,transfer:q.transfer===true&&!state.cards[q.id]}));
    if(!deck?.length)return;
    openDialog();
    session={packId:id,title:pack?.title||'기억을 깨우는 복습',deck,index:paused?.index||0,results:paused?.results.map(r=>({...r}))||[],continued:paused?.continued||continued,summary:null};
    if(paused){Object.assign(session,paused.current);session.selected=[...paused.current.selected];session.tiles=[...paused.current.tiles];}
    else prepare();
    render();
  }
  function prepare() {
    session.draft='';session.selected=[];session.hints=0;session.hadError=false;session.status='idle';session.message='';session.choice=null;
    session.tiles=shuffle(active().tiles||[]);
  }
  function wrongWords(question) {
    if(session.status!=='wrong'||question.kind!=='input')return '';
    const attempt=(session.draft||'').trim().split(/\s+/),expected=question.answer.trim().split(/\s+/);
    return '<div class="answer-attempt" role="status"><b>입력한 답 살펴보기</b><div lang="fr">'+attempt.map((word,i)=>{
      const ok=normalizeAnswer(word)===normalizeAnswer(expected[i]||'');
      return '<mark class="attempt-word '+(ok?'ok':'needs-work')+'">'+escape(word)+'</mark>';
    }).join(' ')+'</div><small>붉은 단어의 철자·순서를 확인하고 다시 입력하세요.</small></div>';
  }
  function render() {
    if(!session)return;
    if(session.summary)return renderResult();
    stash();
    const q=active(),done=['correct','revealed'].includes(session.status);
    const model=q.model?`<div class="practice-model" aria-label="예문"><b lang="fr">${escape(q.model.fr)}</b><small>${escape(q.model.ko)}</small><p>${escape(q.model.tip)}</p></div>`:'';
    let interaction='';
    if(q.kind==='choice') interaction=`<div class="practice-options">${shuffleChoices(q).map(choice=>`<button class="choice ${session.choice===choice&&session.status==='wrong'?'incorrect':''} ${done&&choice===q.answer?'correct':''}" data-action="practice-choice" data-value="${escape(choice)}" ${done?'disabled':''}>${escape(choice)}</button>`).join('')}</div>`;
    else if(q.kind==='order') interaction=`<div class="tile-answer" aria-label="선택한 단어"><span class="visually-hidden">누른 단어를 다시 누르면 취소돼요.</span>${session.selected.length?session.selected.map((index,i)=>`<button class="word-tile selected" data-action="practice-unpick" data-index="${i}" ${done?'disabled':''} aria-label="${escape(session.tiles[index])} 선택 취소">${escape(session.tiles[index])}</button>`).join(''):'<span class="tile-placeholder">문장 완성</span>'}</div><div class="tile-pool" aria-label="문장을 만들 단어">${session.tiles.map((tile,i)=>`<button class="word-tile" data-action="practice-pick" data-index="${i}" ${done||session.selected.includes(i)?'disabled':''}>${escape(tile)}</button>`).join('')}</div>`;
    else interaction=`<form id="practice-form"><label class="visually-hidden" for="practice-input">${q.cue?'빈칸에 들어갈 말':'프랑스어 문장'} 입력</label><input id="practice-input" class="practice-input" lang="fr" type="text" maxlength="180" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${q.cue?'답 입력':'프랑스어 문장'}" value="${escape(session.draft)}" ${done?'disabled':''}></form>`;
    const feedback=done?`<div class="practice-feedback ${session.status==='revealed'?'assisted':''}" role="status" tabindex="-1"><b>${icon(session.status==='revealed'?'book':'check')}${session.status==='revealed'?'정답 확인':q.kind==='input'&&!session.hints&&!session.hadError?'정답':'완성'}</b><p lang="fr">${escape(q.full)}</p><details class="answer-detail"><summary>해설</summary><p>${escape(q.note)}</p></details><button class="sound-button" data-action="practice-sound">${icon('sound')}발음 듣기</button></div>`:`<div class="practice-feedback pending ${session.status==='wrong'?'assisted':''}" role="status">${escape(session.message||'')}</div>`;
    content.innerHTML=`${dialogHeader(session.title,(session.index+1)/session.deck.length*100,`${session.index+1} / ${session.deck.length}`,!saveFailed)}<div class="dialog-body practice-body" data-practice-question="${q.id}">${q.transfer?'<div class="practice-stage"><b>새 문장</b></div>':''}${model}<h3 class="practice-prompt">${escape(q.ko)}</h3>${q.glossary?`<p class="practice-glossary">${escape(q.glossary)}</p>`:''}${q.cue?`<p class="practice-cue" lang="fr">${escape(q.cue).replace('___','<span class="blank-space">···</span>')}</p>`:''}${interaction}${wrongWords(q)}${q.kind==='input'&&!done?'<p class="typing-hint">입력 후 Enter 또는 확인을 누르세요.</p>':''}${!done&&session.hints?`<div class="practice-hint" role="status">${escape(q.hint)}</div>`:''}${feedback}${!done?`<div class="practice-help"><button class="text-link" data-action="practice-hint">${icon('sparkles')}${session.hints?'정답 보기':'힌트'}</button><button class="text-link" data-action="practice-sound">${icon('sound')}소리 힌트</button></div>`:''}</div><div class="dialog-footer practice-footer">${done?`<button class="primary-button" data-action="practice-next">${session.index===session.deck.length-1?'결과 보기':'다음'}${icon('arrow')}</button>`:q.kind!=='choice'?`<button class="primary-button" ${q.kind==='input'?'type="submit" form="practice-form"':'data-action="practice-check"'} ${q.kind==='order'&&session.selected.length!==session.tiles.length?'disabled':''}>확인${icon('check')}</button>`:''}</div>`;
    focusDialog();
    if(session.status==='wrong')content.querySelector('#practice-input')?.focus({preventScroll:true});
    if(done)content.querySelector('[data-action="practice-next"]')?.focus({preventScroll:true});
  }
  function shuffleChoices(q) {if(!session.choicesFor || session.choicesFor!==q.id){session.choicesFor=q.id;session.choices=shuffle(q.choices||[]);}return session.choices;}
  function check() {
    if(!session||session.summary||['correct','revealed'].includes(session.status))return;
    const q=active(),value=q.kind==='choice'?session.choice:q.kind==='order'?session.selected.map(i=>session.tiles[i]).join(' '):session.draft;
    if(!value?.trim()){session.message='답을 입력해 주세요.';render();return;}
    if(isCorrect(q,value)){session.status='correct';session.message='';playFeedback('correct');}
    else {session.hadError=true;session.status='wrong';session.hints=Math.max(1,session.hints);session.message='다시 시도해 보세요. 빨간 부분을 확인하세요.';playFeedback('wrong');}
    render();
  }
  function advance() {
    if(!session||session.summary||!['correct','revealed'].includes(session.status))return;
    const q=active();session.results.push({id:q.id,correct:session.status==='correct',independent:session.status==='correct'&&q.kind==='input'&&!session.hints&&!session.hadError});
    if(session.index<session.deck.length-1){session.index++;prepare();render();}
    else {session.summary=recordPractice(state,session.results,{packId:session.packId,continued:session.continued});delete drafts[session.packId];save();saveDrafts();onFinish(session.summary);renderResult();}
  }
  function renderResult() {
    const s=session.summary,next=nextPack(state,session.packId);
    const transfer=session.deck.find(q=>q.transfer),transferResult=transfer&&session.results.find(r=>r.id===transfer.id);
    const example=session.deck.at(-1);
    content.innerHTML=`${dialogHeader('학습 결과')}<div class="dialog-body center practice-body"><div class="result-medal" aria-hidden="true">✳</div><h3 class="dialog-title">${s.total}문제 완료</h3><div class="result-stats"><div><strong>${s.independent} / ${recallCount()}</strong><span>힌트 없이 떠올린 답</span></div><div><strong>+${s.xp}</strong><span>획득한 XP</span></div></div><div class="practice-takeaway"><span>${transfer?(transferResult?.correct?'새 문장':'다시 볼 문장'):'이번 문장'}</span><b lang="fr">${escape(example.full)}</b><p>${escape(example.ko)}</p><small>완성 ${s.correct} / ${s.total}</small></div>${saveFailed?'<p class="inline-alert">브라우저 저장 공간을 사용할 수 없어 이번 방문 동안만 기록이 유지돼요.</p>':''}</div><div class="dialog-footer practice-footer practice-result-actions"><button class="secondary-button" data-action="practice-close">마치기</button><button class="primary-button" data-action="practice-more" data-id="${next.id}">한 판 더${icon('arrow')}</button></div>`;
    focusDialog();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action^="practice-"]');if(!button||button.disabled)return;
    const action=button.dataset.action;
    if(action==='practice-resume'){const paused=resumeInfo();if(paused)start(paused.packId);return;}
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
      case 'practice-sound':if(speak(active().full)&&!done){session.hints=Math.max(1,session.hints);session.message='소리 힌트';render();}break;
      case 'practice-next':advance();break;
    }
  });
  document.addEventListener('focusin',event=>{if(event.target.id==='practice-input')content.closest('dialog')?.classList.add('typing-focused');},true);
  document.addEventListener('focusout',event=>{if(event.target.id==='practice-input')content.closest('dialog')?.classList.remove('typing-focused');},true);
  document.addEventListener('input',event=>{if(event.target.id==='practice-input'&&session&&!session.summary){session.draft=event.target.value;stash();}});
  document.addEventListener('submit',event=>{if(event.target.id==='practice-form'){event.preventDefault();check();}});
  return {
    key:PRACTICE_KEY, draftKey:PRACTICE_DRAFT_KEY,
    stop:()=>{stash();session=null;},
    reset:()=>{state=freshPractice();drafts={};session=null;save();saveDrafts();},
    reload:()=>{state=readPractice(storage);drafts=readPracticeDrafts(storage);},
    resumeInfo,
    dueCount:()=>dueQuestions(state).length,
    recommended:()=>nextPack(state),
    independentCount:()=>independentSentences(state).length,
    independentExpressions:()=>independentSentences(state),
    renderLibrary:()=>`<section class="practice-library" aria-label="내 말이 되는 10문제"><div class="section-heading"><div><h2>10문제 학습</h2></div><span class="section-count">3개 코스</span></div><div class="practice-pack-grid">${practicePacks.map((pack,i)=>{
      const done=state.runs.some(run=>run.packId===pack.id),paused=drafts[pack.id],recommended=nextPack(state).id===pack.id;
      return `<button class="practice-pack ${paused?'in-progress':done?'is-complete':''}" data-action="practice-start" data-id="${pack.id}"><span class="practice-pack-top"><span class="stat-icon ${pack.color}">${icon(pack.icon)}</span><small>${paused?'이어서 학습':done?'한 판 완료':recommended?'오늘의 추천':'입문 A1'}</small></span><span class="course-number">0${i+1}</span><h3>${pack.title}</h3><span class="practice-pattern" lang="fr">${pack.pattern.split('+')[0].trim()}</span><span class="practice-pack-bottom">${paused?`${paused.index+1} / 10문제`:'10문제 · 3–5분'}${icon(done&&!paused?'check':'arrow')}</span></button>`;
    }).join('')}</div>${dueQuestions(state).length?`<button class="practice-due" data-action="practice-due">${icon('cards')}다시 꺼내볼 표현 ${dueQuestions(state).length}개<span>복습 시작${icon('arrow')}</span></button>`:''}</section>`,
    renderStats:()=>`<section class="practice-progress"><h2>문장 만들기</h2><div class="practice-stat-row"><span><b>${state.runs.length}</b>완료한 연습</span><span><b>${independentSentences(state).length}</b>혼자 떠올린 표현</span><span><b>${state.runs.filter(r=>r.transfer).length}</b>새 문장 도전 성공</span></div></section>`
  };
}
