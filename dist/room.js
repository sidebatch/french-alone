import { today } from './core.js';
import { ROOM_ITEMS, ROOM_CATEGORIES, WALLS, FLOORS, roomItem } from './room-catalog.js';
import { ROOM_KEY, MAX_ROOM_ITEMS, STAMP_TARGETS, stampsForQuestions, readRoom, freshRoom, wallet, ownedItems, grantRoomGifts, buyRoomItem, newPlacement, constrainPlacement, saveLayout, roomAtDate } from './room-core.js';
import { itemImage, renderRoomScene, placementStyle } from './room-art.js';

export function createRoom({storage,getDays,icon,escape,onChange=()=>{},onSaveError=()=>{}}) {
  let state=readRoom(storage,getDays()),memoryOnly=false,draft=null,baseLayout='',returnFocus=null;
  let tab='owned',category='전체',selected='lou',preview=null,previewId=null,drag=null,discard=false;
  const dialog=document.querySelector('#room-dialog');
  const days=()=>getDays();
  const balance=()=>wallet(state,days()).balance;
  const owned=()=>ownedItems(state,days());
  function persist() {
    try {storage.setItem(ROOM_KEY,JSON.stringify(state));return true;}
    catch {memoryOnly=true;onSaveError();return false;}
  }
  function latest() {
    if(memoryOnly)return;
    try {if(storage.getItem(ROOM_KEY)!==null)state=readRoom(storage,days());}catch {memoryOnly=true;}
  }
  function syncGifts() {
    if(grantRoomGifts(state,days())){state.revision++;persist();}
  }
  function target() {
    const chosen=roomItem(state.goal);
    return chosen&&!owned().has(chosen.id)?chosen:ROOM_ITEMS.find(item=>item.price&&!owned().has(item.id));
  }
  function rewardNote() {
    const questions=days()[today()]?.questions||0,next=STAMP_TARGETS.find(n=>n>questions);
    return next?`${next}문제까지 ${next-questions}문제 더 풀면 스탬프 +1`:'오늘 스탬프 3개를 모두 모았어요.';
  }
  function renderSummary() {
    syncGifts();const goal=target(),money=wallet(state,days());
    return `<section class="room-collection room-shop-summary"><div class="collection-heading"><span>${icon('heart')}루의 작은 방</span><b>보유 스탬프 ${money.balance}개</b></div>
      ${goal?`<div class="room-goal"><img src="${itemImage(goal.id)}" alt=""><div><small>다음에 들이고 싶은 소품</small><b>${goal.name}</b><span>${Math.min(money.balance,goal.price)} / ${goal.price} 스탬프</span></div></div><div class="room-goal-track" role="progressbar" aria-label="${goal.name} 구매에 필요한 스탬프" aria-valuemin="0" aria-valuemax="${goal.price}" aria-valuenow="${Math.min(money.balance,goal.price)}"><i style="width:${Math.min(100,money.balance/goal.price*100)}%"></i></div><p class="collection-next">${money.balance>=goal.price?'지금 방에 들일 수 있어요.':`스탬프 <b>${goal.price-money.balance}개</b> 더 모으면 살 수 있어요.`}</p>`:'<p class="collection-next">모든 소품을 모았어요. 새로운 배치를 만들어 봐요.</p>'}
      <button class="primary-button room-open-button" data-action="room-open">방 꾸미기 · 소품 가게 ${icon('arrow')}</button><p class="collection-rule">문장 연습 3·10·20문제에 스탬프 하나씩.</p></section>`;
  }
  function selectedPlacement() {
    if(selected==='lou')return draft?.lou;
    if(selected==='preview')return preview;
    return draft?.items.find(item=>item.uid===selected);
  }
  const selectedId=()=>selected==='lou'?'lou':selectedPlacement()?.itemId;
  function sceneLayout() {return preview?{...draft,items:[...draft.items,preview]}:draft;}
  const dirty=()=>draft&&JSON.stringify(draft)!==baseLayout;
  function status(text) {const output=dialog.querySelector('.room-status');if(output)output.textContent=(memoryOnly?'이 기기에 저장하지 못해 이번 방문 동안만 유지돼요. ':'')+text;}
  function toolbar() {
    const placement=selectedPlacement(),name=selected==='lou'?'루':roomItem(placement?.itemId)?.name;
    if(!placement)return '<p class="room-control-hint">방 안의 소품을 선택해 보세요.</p>';
    return `<div class="room-selected-name"><b>${name}</b>${selected==='preview'?'<span>미리 보는 소품</span>':''}</div>
      <div class="room-transform-controls"><label>크기 <output>${Math.round(placement.scale*100)}%</output><input aria-label="선택한 소품 크기" data-room-control="scale" type="range" min="60" max="160" step="5" value="${Math.round(placement.scale*100)}"></label><label>각도 <output>${placement.rotation}°</output><input aria-label="선택한 소품 각도" data-room-control="rotation" type="range" min="-30" max="30" step="5" value="${placement.rotation}"></label></div>
      <div class="room-object-actions"><button data-action="room-flip">좌우 반전</button><button data-action="room-forward" ${['lou','preview'].includes(selected)?'disabled':''}>앞으로</button><button data-action="room-backward" ${['lou','preview'].includes(selected)?'disabled':''}>뒤로</button><button data-action="room-remove" ${selected==='lou'?'disabled':''}>${selected==='preview'?'미리보기 닫기':'보관함으로'}</button></div>
      <div class="room-nudge" role="group" aria-label="선택한 소품 위치 이동"><span>조금씩 이동</span>${[['left','←','왼쪽'],['up','↑','위'],['down','↓','아래'],['right','→','오른쪽']].map(([id,label,name])=>`<button data-action="room-nudge" data-value="${id}" aria-label="${name}로 이동">${label}</button>`).join('')}</div>`;
  }
  function previewPanel() {
    const item=roomItem(previewId);if(!item)return '';
    const have=owned().has(item.id),remaining=Math.max(0,item.price-balance());
    return `<section class="room-item-preview"><div><img src="${itemImage(item.id)}" alt=""><div><h3>${item.name}</h3><p>${item.description}</p><small>${have?'보유 중 · 여러 개 배치 가능':item.gift?`학습 ${item.gift}일 선물`:item.price+' 스탬프 · 한 번 구매하면 계속 사용'}</small></div></div><div class="room-preview-actions">${have?`<button class="primary-button" data-action="room-place" ${draft.items.length>=MAX_ROOM_ITEMS?'disabled':''}>방에 놓기</button>`:item.gift?'<span>학습일을 모으면 선물로 받아요.</span>':`<button class="primary-button" data-action="room-buy" ${remaining?'disabled':''}>${remaining?'스탬프 '+remaining+'개 더 필요':item.price+' 스탬프로 구매'}</button><button class="secondary-button" data-action="room-goal">${state.goal===item.id?'모으는 중':'목표로 정하기'}</button>`}</div></section>`;
  }
  function shelves() {
    if(tab==='themes')return `<div class="room-theme-panel"><h3>벽 색</h3><div class="room-swatches">${WALLS.map(w=>`<button data-action="room-wall" data-value="${w.id}" aria-pressed="${draft.wall===w.id}"><i style="background:${w.color}"></i>${w.name}</button>`).join('')}</div><h3>바닥</h3><div class="room-swatches">${FLOORS.map(f=>`<button data-action="room-floor" data-value="${f.id}" aria-pressed="${draft.floor===f.id}"><i style="background:${f.color}"></i>${f.name}</button>`).join('')}</div><p>벽과 바닥 색은 자유롭게 바꿔요.</p></div>`;
    const items=ROOM_ITEMS.filter(item=>(tab==='shop'||owned().has(item.id))&&(category==='전체'||item.category===category));
    return `<div class="room-categories" role="group" aria-label="소품 분류">${ROOM_CATEGORIES.map(name=>`<button data-action="room-category" data-value="${name}" aria-pressed="${category===name}">${name}</button>`).join('')}</div>${previewPanel()}<div class="room-item-grid">${items.length?items.map(item=>`<button class="room-shop-item ${previewId===item.id?'is-active':''}" data-action="room-preview" data-value="${item.id}" aria-label="${item.name}, ${owned().has(item.id)?'보유 중':item.gift?'학습 '+item.gift+'일 선물':item.price+' 스탬프'}"><img src="${itemImage(item.id)}" alt="" draggable="false"><b>${item.name}</b><span>${owned().has(item.id)?'보유 중':item.gift?'학습 '+item.gift+'일 선물':item.price+' 스탬프'}</span></button>`).join(''):'<div class="room-inventory-empty">아직 이 분류의 소품이 없어요.<br>가게에서 마음에 드는 소품을 골라 보세요.</div>'}</div>`;
  }
  function render(focusAction) {
    if(!draft)return;
    const library=dialog.querySelector('.room-library'),scroll=library?.scrollTop||0;
    dialog.innerHTML=`<header class="room-dialog-header"><div><p>작은 공부가, 나만의 공간으로</p><h2 id="room-title">루의 방 꾸미기</h2></div><div class="room-wallet">${icon('sparkles')}<b>${balance()}</b><span>스탬프</span></div><button class="icon-button" data-action="room-close" aria-label="방 꾸미기 닫기">${icon('close')}</button></header>
      <div class="room-editor-layout"><section class="room-workspace"><div class="room-stage-heading"><span>${preview?'소품을 미리 놓아 보고 있어요':'소품과 루를 끌어서 옮겨요'}</span><b>${draft.items.length} / ${MAX_ROOM_ITEMS}</b></div><div class="room-stage">${renderRoomScene(sceneLayout(),{editor:true,selected})}</div><div class="room-controls">${toolbar()}</div><p class="room-earning-note">문장 연습 3·10·20문제에 스탬프 +1 · ${rewardNote()}</p></section>
      <section class="room-library"><div class="room-tabs" role="group" aria-label="방 꾸미기 메뉴">${[['owned','내 소품'],['shop','소품 가게'],['themes','벽 · 바닥']].map(([id,name])=>`<button data-action="room-tab" data-value="${id}" aria-pressed="${tab===id}">${name}${id==='owned'?` <small>${owned().size}</small>`:''}</button>`).join('')}</div>${shelves()}</section></div>
      <footer class="room-editor-footer"><p class="room-status" role="status">${memoryOnly?'이 기기에 저장하지 못해 이번 방문 동안만 유지돼요.':dirty()?'배치를 바꿨어요. 저장하면 홈과 인증 카드에 담겨요.':'구매한 소품은 여러 개 놓을 수 있어요.'}</p><div class="room-footer-actions"><button class="secondary-button" data-action="room-close">취소</button><button class="primary-button" data-action="room-save">배치 저장 ${icon('check')}</button></div>${discard?'<div class="room-discard-prompt" role="alert"><p>바꾼 배치를 저장하지 않고 닫을까요? 구매한 소품은 보관함에 남아요.</p><button class="secondary-button" data-action="room-keep">계속 꾸미기</button><button class="secondary-button" data-action="room-discard">저장하지 않고 닫기</button></div>':''}</footer>`;
    dialog.querySelector('.room-library').scrollTop=scroll;
    if(focusAction)dialog.querySelector(`[data-action="${focusAction}"]`)?.focus({preventScroll:true});
  }
  function open() {
    latest();syncGifts();draft=structuredClone(state.layout);baseLayout=JSON.stringify(state.layout);
    preview=null;previewId=null;selected='lou';discard=false;tab='owned';category='전체';returnFocus=document.activeElement;
    render();dialog.showModal();dialog.querySelector('[data-action="room-close"]').focus();
  }
  function close(force=false) {
    if(!dialog.open)return;
    if(!force&&dirty()){discard=true;render('room-keep');return;}
    dialog.close();draft=null;drag=null;preview=null;discard=false;onChange();
    if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});else document.querySelector('[data-action="room-open"]')?.focus({preventScroll:true});
  }
  function applyPlacement(change) {
    const placement=selectedPlacement();if(!placement)return;
    Object.assign(placement,constrainPlacement(selectedId(),{...placement,...change}));
    const node=dialog.querySelector(`[data-room-object="${selected}"]`),item=selected==='lou'?{w:230,h:230}:roomItem(placement.itemId);
    if(node)node.setAttribute('style',placementStyle(item,placement));
    status(selected==='preview'?'미리 보는 소품이에요. 마음에 들면 방에 놓아 보세요.':'배치를 바꿨어요. 저장하면 홈과 인증 카드에 담겨요.');
  }
  function placePreview() {
    if(!preview||!owned().has(preview.itemId))return;
    if(draft.items.length>=MAX_ROOM_ITEMS){status('한 방에는 24개까지 놓을 수 있어요. 소품을 보관함으로 옮겨 주세요.');return;}
    const uid=`item-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const item={...preview,uid};
    if(roomItem(item.itemId).category==='러그')draft.items.unshift(item);else draft.items.push(item);
    selected=uid;preview=null;render();status('방에 놓았어요. 배치 저장을 누르면 간직할 수 있어요.');
  }
  async function buy() {
    const itemId=previewId;if(!itemId)return;
    const purchase=()=>{
      latest();syncGifts();const result=buyRoomItem(state,days(),itemId);
      if(!result.ok){render();status(result.reason==='owned'?'이미 보유한 소품이에요.':'스탬프가 부족해요. 학습을 마치고 다시 와 주세요.');return;}
      persist();if(preview?.itemId===itemId)placePreview();render();status(`${roomItem(itemId).name}을 구매했어요. 취소해도 구매한 소품은 보관함에 남아요.`);
    };
    try {
      if(window.navigator.locks?.request)await window.navigator.locks.request('french-alone-room-purchase',purchase);else purchase();
    } catch {render();status('구매를 마치지 못했어요. 다시 눌러 주세요.');}
  }
  function save() {
    latest();
    if(JSON.stringify(state.layout)!==baseLayout) {
      status('다른 창에서 방 배치가 바뀌었어요. 현재 편집을 취소하고 다시 열어 주세요.');return;
    }
    saveLayout(state,days(),draft);const saved=persist();baseLayout=JSON.stringify(state.layout);
    if(saved)close(true);else {render();status('현재 방문의 방에만 반영했어요.');}
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action^="room-"]');if(!button||button.disabled)return;
    const {action,value}=button.dataset;
    if(action==='room-open'){open();return;}
    if(!dialog.open)return;
    if(action==='room-close'){close();return;}if(action==='room-discard'){close(true);return;}
    if(action==='room-keep'){discard=false;render('room-save');return;}if(action==='room-save'){save();return;}
    if(action==='room-buy'){button.disabled=true;void buy();return;}
    if(action==='room-place'){placePreview();return;}
    if(action==='room-tab'&&['owned','shop','themes'].includes(value)){tab=value;category='전체';render();return;}
    if(action==='room-category'&&ROOM_CATEGORIES.includes(value)){category=value;render();return;}
    if(action==='room-preview'&&roomItem(value)){previewId=value;preview=newPlacement(value,'preview');selected='preview';render();return;}
    if(action==='room-goal'&&roomItem(previewId)?.price){latest();state.goal=previewId;persist();render();status(`${roomItem(previewId).name}을 다음 목표로 정했어요.`);return;}
    if(action==='room-wall'&&WALLS.some(w=>w.id===value)){draft.wall=value;render();return;}
    if(action==='room-floor'&&FLOORS.some(f=>f.id===value)){draft.floor=value;render();return;}
    if(action==='room-flip'){applyPlacement({flipped:!selectedPlacement()?.flipped});return;}
    if(action==='room-nudge'){
      const p=selectedPlacement();if(p)applyPlacement({x:p.x+({left:-2,right:2}[value]||0),y:p.y+({up:-2,down:2}[value]||0)});return;
    }
    if(action==='room-remove'){
      if(selected==='preview'){preview=null;previewId=null;}else draft.items=draft.items.filter(item=>item.uid!==selected);
      selected='lou';render();return;
    }
    if(action==='room-forward'||action==='room-backward'){
      const index=draft.items.findIndex(item=>item.uid===selected),next=index+(action==='room-forward'?1:-1);
      if(index>=0&&next>=0&&next<draft.items.length)[draft.items[index],draft.items[next]]=[draft.items[next],draft.items[index]];
      render();
    }
  });
  dialog.addEventListener('pointerdown',event=>{
    const object=event.target.closest('[data-room-object]');if(!object||event.button!==0)return;
    selected=object.dataset.roomObject;
    dialog.querySelectorAll('[data-room-object]').forEach(node=>{node.classList.toggle('is-selected',node.dataset.roomObject===selected);node.setAttribute('aria-pressed',String(node.dataset.roomObject===selected));});
    dialog.querySelector('.room-controls').innerHTML=toolbar();
    const p=selectedPlacement(),rect=dialog.querySelector('.room-scene').getBoundingClientRect();
    drag={pointerId:event.pointerId,x:event.clientX,y:event.clientY,original:{x:p.x,y:p.y},rect};
    object.setPointerCapture(event.pointerId);object.focus({preventScroll:true});event.preventDefault();
  });
  dialog.addEventListener('pointermove',event=>{
    if(!drag||drag.pointerId!==event.pointerId)return;
    applyPlacement({x:drag.original.x+(event.clientX-drag.x)/drag.rect.width*100,y:drag.original.y+(event.clientY-drag.y)/drag.rect.height*100});
  });
  const endDrag=()=>{drag=null;};dialog.addEventListener('pointerup',endDrag);dialog.addEventListener('pointercancel',endDrag);dialog.addEventListener('lostpointercapture',endDrag);
  dialog.addEventListener('focusin',event=>{
    const object=event.target.closest('[data-room-object]');if(!object||object.dataset.roomObject===selected)return;
    selected=object.dataset.roomObject;dialog.querySelectorAll('[data-room-object]').forEach(node=>{node.classList.toggle('is-selected',node===object);node.setAttribute('aria-pressed',String(node===object));});
    dialog.querySelector('.room-controls').innerHTML=toolbar();
  });
  dialog.addEventListener('keydown',event=>{
    if(!event.target.closest('[data-room-object]'))return;
    const p=selectedPlacement(),step=event.shiftKey?5:1;
    if(p&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      event.preventDefault();applyPlacement({x:p.x+({ArrowLeft:-step,ArrowRight:step}[event.key]||0),y:p.y+({ArrowUp:-step,ArrowDown:step}[event.key]||0)});
    }
  });
  dialog.addEventListener('input',event=>{
    const control=event.target.dataset.roomControl;if(!control||!selectedPlacement())return;
    const value=Number(event.target.value);applyPlacement({[control]:control==='scale'?value/100:value});
    event.target.parentElement.querySelector('output').textContent=control==='scale'?value+'%':value+'°';
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  window.addEventListener('hashchange',()=>close());
  return {
    key:ROOM_KEY,renderSummary,rewardNote,
    renderScene:mood=>{syncGifts();return renderRoomScene(state.layout,{mood});},
    snapshot:date=>{syncGifts();return roomAtDate(state,days(),date);},
    onProgress:()=>{latest();syncGifts();},isOpen:()=>dialog.open,
    reload:()=>{state=readRoom(storage,days());syncGifts();},
    reset:()=>{close(true);state=freshRoom(days());persist();},
    balance
  };
}
