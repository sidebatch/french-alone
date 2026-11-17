import { today } from './core.js';
import { ROOM_ITEMS, ROOM_CATEGORIES, WALLS, FLOORS, roomItem } from './room-catalog.js';
import { ROOM_KEY, MAX_ROOM_ITEMS, STAMP_TARGETS, stampsForQuestions, readRoom, freshRoom, wallet, ownedItems, grantRoomGifts, ownedClothes, shopItem, buyRoomItem, newPlacement, constrainPlacement, saveLayout, roomAtDate } from './room-core.js';
import { itemImage, renderRoomScene, placementStyle } from './room-art.js';
import { COATS, SLOTS, POSES, WEARABLES, wearable, clothingImage, renderAvatar } from './wardrobe.js';

const PAGE_SIZE = 6;
const TABS = {owned:'내 소품',shop:'소품 가게',wardrobe:'옷장',themes:'벽 · 바닥'};

export function createRoom({storage,getDays,icon,onChange=()=>{},onSaveError=()=>{}}) {
  let state=readRoom(storage,getDays()),memoryOnly=false,draft=null,baseLayout='',returnFocus=null;
  let tab='owned',category='전체',selected='lou',preview=null,previewId=null,drag=null,discard=false;
  let slot='body',page=0;
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
    const chosen=shopItem(state.goal);
    const collection=new Set([...owned(),...ownedClothes(state)]);
    return chosen&&!collection.has(chosen.id)?chosen:[...ROOM_ITEMS,...WEARABLES].find(item=>item.price&&!collection.has(item.id));
  }
  function rewardNote() {
    const questions=days()[today()]?.questions||0,next=STAMP_TARGETS.find(n=>n>questions);
    return next?`${next}문제까지 ${next-questions}문제 더 풀면 스탬프 +1`:'오늘 스탬프 3개를 모두 모았어요.';
  }
  function renderSummary() {
    syncGifts();
    const goal=target(),available=balance();
    return `<section class="room-collection room-shop-summary"><div class="collection-heading"><span>${icon('sparkles')}스탬프</span><b>보유 ${available}개</b></div>
      ${goal?`<div class="room-goal"><img src="${goal.slot?clothingImage(goal.id):itemImage(goal.id)}" alt=""><div><small>다음 목표</small><b>${goal.name}</b></div><span>${Math.min(available,goal.price)} / ${goal.price}</span></div><progress class="room-goal-progress" aria-label="${goal.name} 구매에 필요한 스탬프" max="${goal.price}" value="${Math.min(available,goal.price)}"></progress>`:'<p class="collection-next">옷과 소품을 모두 모았어요.</p>'}
      <p class="collection-rule">문장 연습 3·10·20문제에 스탬프 하나씩.</p></section>`;
  }
  function selectedPlacement() {
    if(selected==='lou')return draft?.lou;
    if(selected==='preview')return preview;
    return draft?.items.find(item=>item.uid===selected);
  }
  const selectedId=()=>selected==='lou'?'lou':selectedPlacement()?.itemId;
  function sceneLayout() {return preview?{...draft,items:[...draft.items,preview]}:draft;}
  const dirty=()=>draft&&JSON.stringify(draft)!==baseLayout;
  function status(text,visible=false) {
    const output=dialog.querySelector('.room-status');if(!output)return;
    output.classList.toggle('visually-hidden',!memoryOnly&&!visible);
    output.textContent=(memoryOnly?'이 기기에 저장하지 못해 이번 방문 동안만 유지돼요. ':'')+text;
  }
  function toolbar() {
    const placement=selectedPlacement();
    if(!placement)return '<p class="room-control-hint">방 안의 소품을 선택해 보세요.</p>';
    return `
      <div class="room-transform-controls"><label>크기 <output>${Math.round(placement.scale*100)}%</output><input aria-label="선택한 소품 크기" data-room-control="scale" type="range" min="60" max="160" step="5" value="${Math.round(placement.scale*100)}"></label><label>각도 <output>${placement.rotation}°</output><input aria-label="선택한 소품 각도" data-room-control="rotation" type="range" min="-30" max="30" step="5" value="${placement.rotation}"></label></div>
      <div class="room-object-actions"><button data-action="room-flip">좌우 반전</button><button data-action="room-forward" ${['lou','preview'].includes(selected)?'disabled':''}>앞으로</button><button data-action="room-backward" ${['lou','preview'].includes(selected)?'disabled':''}>뒤로</button><button data-action="room-remove" ${selected==='lou'?'disabled':''}>${selected==='preview'?'미리보기 닫기':'보관함으로'}</button></div>
      <div class="room-nudge" role="group" aria-label="선택한 소품 위치 이동"><span>조금씩 이동</span>${[['left','←','왼쪽'],['up','↑','위'],['down','↓','아래'],['right','→','오른쪽']].map(([id,label,name])=>`<button data-action="room-nudge" data-value="${id}" aria-label="${name}로 이동">${label}</button>`).join('')}</div>`;
  }
  function shopPreview() {
    const item=roomItem(previewId);if(!item)return '';
    const have=owned().has(item.id),remaining=Math.max(0,item.price-balance());
    const detail=have?'보유 중':item.gift?`학습 ${item.gift}일 선물`:`스탬프 ${item.price}개`;
    const primary=have?`<button class="primary-button" data-action="room-place" ${draft.items.length>=MAX_ROOM_ITEMS?'disabled':''}>${draft.items.length>=MAX_ROOM_ITEMS?'방이 가득 찼어요':'방에 놓기'}</button>`
      :item.gift?'':`<button class="primary-button" data-action="room-buy" ${remaining?'disabled':''}>${remaining?`${remaining}개 더 필요`:'구매하기'}</button>`;
    return `<section class="room-selection"><div class="selection-line"><div><small>${detail}</small><h3>${item.name}</h3></div><button class="icon-button" data-action="room-untry" aria-label="미리보기 닫기">${icon('close')}</button></div>
      <p>${item.description}</p><div class="room-preview-actions">${primary}${!have&&!item.gift?wishButton(item):''}</div></section>`;
  }
  function wishButton(item) {
    return `<button class="secondary-button" data-action="room-goal" aria-pressed="${state.goal===item.id}">${state.goal===item.id?'모으는 중':'목표로 정하기'}</button>`;
  }
  function catalogPage(items,label) {
    const pages=Math.max(1,Math.ceil(items.length/PAGE_SIZE));
    page=Math.min(page,pages-1);
    const pager=pages>1?`<div class="room-pager" role="group" aria-label="${label} 목록 페이지"><button data-action="room-page" data-value="previous" aria-label="이전 ${label} 페이지" ${page===0?'disabled':''}>‹</button><span aria-live="polite">${page+1} / ${pages}</span><button data-action="room-page" data-value="next" aria-label="다음 ${label} 페이지" ${page+1===pages?'disabled':''}>›</button></div>`:'';
    return {pageItems:items.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE),pager};
  }
  function roomCatalog() {
    const inventory=owned();
    const items=ROOM_ITEMS.filter(item=>(tab==='shop'||inventory.has(item.id))&&(category==='전체'||item.category===category));
    const {pageItems,pager}=catalogPage(items,'소품');
    return `<div class="catalog-heading"><label>분류 <select data-room-category aria-label="소품 분류">${ROOM_CATEGORIES.map(name=>`<option ${name===category?'selected':''}>${name}</option>`).join('')}</select></label>${pager}</div>
      <div class="room-item-grid">${pageItems.length?pageItems.map(item=>{
        const label=inventory.has(item.id)?'보유 중':item.gift?`학습 ${item.gift}일 선물`:`스탬프 ${item.price}개`;
        return `<button class="room-shop-item" data-action="room-preview" data-value="${item.id}" aria-pressed="${item.id===previewId}"><img src="${itemImage(item.id)}" alt="" draggable="false"><b>${item.name}</b><span>${label}</span></button>`;
      }).join(''):'<p class="room-inventory-empty">아직 보유한 소품이 없어요. 소품 가게에서 골라 보세요.</p>'}</div>`;
  }
  function appearanceControls() {
    return `<div class="wardrobe-appearance"><div class="wardrobe-poses" role="group" aria-label="털 무늬"><b>털 무늬</b>${Object.entries(COATS).map(([id,name])=>`<button data-action="room-coat" data-value="${id}" aria-pressed="${draft.look.coat===id}"><i class="coat-chip coat-${id}"></i>${name}</button>`).join('')}</div>
      <div class="wardrobe-poses" role="group" aria-label="포즈"><b>포즈</b>${Object.entries(POSES).map(([id,name])=>`<button data-action="room-pose" data-value="${id}" aria-pressed="${draft.look.pose===id}">${name}</button>`).join('')}</div></div>`;
  }
  function fittingRoom() {
    const piece=wearable(previewId);
    const look=piece?{...draft.look,[piece.slot]:piece.id}:draft.look;
    const names=Object.keys(SLOTS).map(key=>wearable(look[key])?.name).filter(Boolean);
    const remaining=piece?Math.max(0,piece.price-balance()):0;
    const canWear=piece&&ownedClothes(state).has(piece.id);
    const remove=draft.look[slot]?`<button class="secondary-button" data-action="room-unequip">${slot==='head'?'장식 빼기':SLOTS[slot]+' 벗기'}</button>`:'';
    const caption=piece?`<div class="fitting-caption"><div class="selection-line"><div><small>미리 입기 · 스탬프 ${piece.price}개</small><h3>${piece.name}</h3></div><button class="icon-button" data-action="room-untry" aria-label="미리보기 닫기">${icon('close')}</button></div>
      <div class="room-preview-actions">${canWear?`<button class="primary-button" data-action="room-try" data-value="${piece.id}">입히기</button>`:`<button class="primary-button" data-action="room-buy" ${remaining?'disabled':''}>${remaining?`${remaining}개 더 필요`:'구매하고 입히기'}</button>${wishButton(piece)}`}</div></div>`
      :`<div class="fitting-caption"><small>현재 차림</small><p>${names.length?names.join(' · '):'기본 차림'}</p>${remove?`<div class="room-preview-actions">${remove}</div>`:''}</div>`;
    return `<div class="fitting-room"><div class="fitting-mirror" role="img" aria-label="${names.join(', ')||'기본 차림'}의 루">${renderAvatar(look)}</div>${caption}</div>`;
  }
  function wardrobeShelf() {
    const slots=Object.entries({...SLOTS,appearance:'털 · 포즈'}).map(([id,name])=>`<button data-action="room-slot" data-value="${id}" aria-pressed="${slot===id}">${name}</button>`).join('');
    const categories=`<div class="room-categories" role="group" aria-label="옷장 분류">${slots}</div>`;
    if(slot==='appearance')return categories+appearanceControls();
    const {pageItems,pager}=catalogPage(WEARABLES.filter(piece=>piece.slot===slot),SLOTS[slot]);
    const clothes=ownedClothes(state),equipped=draft.look[slot];
    const cards=pageItems.map(piece=>{
      const label=equipped===piece.id?'착용 중':piece.price===0?'기본 제공':clothes.has(piece.id)?'보유 중':`스탬프 ${piece.price}개`;
      const photo=piece.slot==='body'?renderAvatar({body:piece.id}):`<img src="${clothingImage(piece.id)}" alt="">`;
      return `<button class="room-shop-item" data-action="room-try" data-value="${piece.id}" aria-pressed="${(previewId||equipped)===piece.id}">${photo}<b>${piece.name}</b><span>${label}</span></button>`;
    }).join('');
    return `<div class="catalog-heading wardrobe-heading">${categories}${pager}</div><div class="room-item-grid wardrobe-grid">${cards}</div>`;
  }
  function shelves() {
    if(tab==='wardrobe')return wardrobeShelf();
    if(tab!=='themes')return roomCatalog();
    return `<div class="room-theme-panel"><h3>벽 색</h3><div class="room-swatches">${WALLS.map(w=>`<button data-action="room-wall" data-value="${w.id}" aria-pressed="${draft.wall===w.id}"><i style="background:${w.color}"></i>${w.name}</button>`).join('')}</div><h3>바닥</h3><div class="room-swatches">${FLOORS.map(f=>`<button data-action="room-floor" data-value="${f.id}" aria-pressed="${draft.floor===f.id}"><i style="background:${f.color}"></i>${f.name}</button>`).join('')}</div></div>`;
  }
  const placementName=()=>selected==='lou'?'루':roomItem(selectedPlacement()?.itemId)?.name||'소품';
  function roomWorkspace(expanded) {
    return `<div class="room-stage">${renderRoomScene(sceneLayout(),{editor:true,selected})}</div>${shopPreview()}
      <details class="placement-tools" ${expanded?'open':''}><summary>배치 조정 <span>${placementName()}</span></summary><div class="room-controls">${toolbar()}</div></details>`;
  }
  function refreshControls() {
    dialog.querySelector('.placement-tools summary span').textContent=placementName();
    dialog.querySelector('.room-controls').innerHTML=toolbar();
  }
  function render(focusAction,resetScroll=false) {
    if(!draft)return;
    const top=resetScroll?0:dialog.scrollTop;
    const expanded=!resetScroll&&dialog.querySelector('.placement-tools')?.open;
    const previous=document.activeElement?.closest('#room-dialog [data-action]')?.dataset;
    const trying=tab==='wardrobe'&&wearable(previewId);
    const warning=memoryOnly?'이 기기에 저장하지 못해 이번 방문 동안만 유지돼요.':'';
    dialog.innerHTML=`<header class="room-dialog-header"><button class="icon-button" data-action="room-close" aria-label="꾸미기 닫기">${icon('close')}</button><h2 id="room-title">루의 방</h2><div class="room-wallet" aria-label="보유 스탬프 ${balance()}개">${icon('sparkles')}<b>${balance()}</b><span>스탬프</span></div><button class="primary-button room-save" data-action="room-save" ${trying?'aria-label="미리보기 제외하고 저장"':''}>저장</button></header>
      ${discard?'<div class="room-discard-prompt" role="alert"><p>바꾼 차림과 배치를 저장하지 않고 닫을까요?</p><button class="secondary-button" data-action="room-keep">계속 꾸미기</button><button class="secondary-button" data-action="room-discard">저장하지 않고 닫기</button></div>':''}
      <div class="room-tabs" role="group" aria-label="꾸미기 메뉴">${Object.entries(TABS).map(([id,name])=>`<button data-action="room-tab" data-value="${id}" aria-pressed="${tab===id}">${name}</button>`).join('')}</div>
      <p class="room-status ${warning?'':'visually-hidden'}" role="status">${warning}</p>
      <div class="room-editor-layout"><section class="room-workspace">${tab==='wardrobe'?fittingRoom():roomWorkspace(expanded)}</section><section class="room-library" aria-label="${TABS[tab]}">${shelves()}</section></div>`;
    dialog.classList.toggle('is-wardrobe',tab==='wardrobe');
    dialog.scrollTop=top;
    if(focusAction)dialog.querySelector(`[data-action="${focusAction}"]:not(:disabled)`)?.focus({preventScroll:true});
    else if(previous?.action){
      const choices=Array.from(dialog.querySelectorAll('[data-action]:not(:disabled)')).filter(node=>node.dataset.action===previous.action);
      const next=choices.find(node=>node.dataset.value===previous.value)||choices[0];
      (next||dialog.querySelector('.room-tabs [aria-pressed="true"]'))?.focus({preventScroll:true});
    }
  }
  function showPreview() {
    const panel=dialog.querySelector('.room-selection,.fitting-room');
    if(!panel)return;
    const header=dialog.querySelector('.room-dialog-header');
    const frame=dialog.getBoundingClientRect(),rect=panel.getBoundingClientRect();
    const top=frame.top+(window.getComputedStyle(header).position==='sticky'?header.offsetHeight:0);
    if(rect.top<top)dialog.scrollTop+=rect.top-top;
    else if(rect.bottom>frame.bottom)dialog.scrollTop+=Math.min(rect.bottom-frame.bottom,rect.top-top);
  }
  function open(initialTab='owned') {
    latest();syncGifts();draft=structuredClone(state.layout);baseLayout=JSON.stringify(state.layout);
    preview=null;previewId=null;selected='lou';discard=false;tab=initialTab;slot='body';page=0;category='전체';returnFocus=document.activeElement;
    render(null,true);dialog.showModal();dialog.scrollTop=0;dialog.querySelector('[data-action="room-close"]').focus({preventScroll:true});
  }
  function close(force=false) {
    if(!dialog.open)return;
    if(!force&&dirty()){discard=true;render('room-keep',true);return;}
    dialog.close();draft=null;drag=null;preview=null;discard=false;onChange();
    if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    else document.querySelector(returnFocus?.dataset.action==='room-closet'?'[data-action="room-closet"]':'[data-action="room-open"]')?.focus({preventScroll:true});
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
    if(draft.items.length>=MAX_ROOM_ITEMS){status('한 방에는 24개까지 놓을 수 있어요. 소품을 보관함으로 옮겨 주세요.',true);return;}
    const uid=`item-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const item={...preview,uid};
    if(roomItem(item.itemId).category==='러그')draft.items.unshift(item);else draft.items.push(item);
    selected=uid;preview=null;previewId=null;render();status('방에 놓았어요.');
  }
  async function buy() {
    const itemId=previewId;if(!itemId)return;
    const purchase=()=>{
      if(!draft||previewId!==itemId)return;
      latest();syncGifts();const result=buyRoomItem(state,days(),itemId);
      if(!result.ok){render();status(result.reason==='owned'?'이미 보유한 소품이에요.':'스탬프가 부족해요. 학습을 마치고 다시 와 주세요.',true);return;}
      persist();
      const clothing=wearable(itemId);
      if(clothing){draft.look[clothing.slot]=itemId;previewId=null;}
      else if(preview?.itemId===itemId)placePreview();
      render();status(`구매 완료 · ${shopItem(itemId).name}. 꾸미기를 저장하면 홈에서 볼 수 있어요.`);
    };
    try {
      if(window.navigator.locks?.request)await window.navigator.locks.request('french-alone-room-purchase',purchase);else purchase();
    } catch {render();status('구매를 마치지 못했어요. 다시 눌러 주세요.',true);}
  }
  function save() {
    latest();
    if(JSON.stringify(state.layout)!==baseLayout) {
      status('다른 창에서 방 배치가 바뀌었어요. 현재 편집을 취소하고 다시 열어 주세요.',true);return;
    }
    saveLayout(state,days(),draft);const saved=persist();baseLayout=JSON.stringify(state.layout);
    if(saved)close(true);else {render();status('현재 방문의 방에만 반영했어요.');}
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action^="room-"]');if(!button||button.disabled)return;
    const {action,value}=button.dataset;
    if(action==='room-open'||action==='room-closet'){open(action==='room-closet'?'wardrobe':'owned');return;}
    if(!dialog.open)return;
    if(action==='room-close'){close();return;}if(action==='room-discard'){close(true);return;}
    if(action==='room-keep'){discard=false;render('room-save');return;}if(action==='room-save'){save();return;}
    if(action==='room-buy'){button.disabled=true;void buy();return;}
    if(action==='room-slot'&&(Object.hasOwn(SLOTS,value)||value==='appearance')){slot=value;page=0;previewId=null;render();return;}
    if(action==='room-pose'&&Object.hasOwn(POSES,value)){draft.look.pose=value;render();return;}
    if(action==='room-coat'&&Object.hasOwn(COATS,value)){draft.look.coat=value;render();return;}
    if(action==='room-try'&&wearable(value)?.slot===slot){
      const have=ownedClothes(state).has(value);
      previewId=have?null:value;
      if(have)draft.look[slot]=value;
      render();
      if(have)status('입혔어요. 다른 옷이나 장식도 함께 골라 보세요.');
      else showPreview();
      return;
    }
    if(action==='room-untry'){previewId=null;preview=null;if(selected==='preview')selected='lou';render();return;}
    if(action==='room-unequip'){draft.look[slot]=null;previewId=null;render();return;}
    if(action==='room-place'){placePreview();return;}
    if(action==='room-tab'&&Object.hasOwn(TABS,value)){tab=value;category='전체';page=0;preview=null;previewId=null;selected='lou';render(null,true);return;}
    if(action==='room-page'){
      page=Math.max(0,page+(value==='next'?1:-1));
      if(tab!=='wardrobe'){previewId=null;preview=null;if(selected==='preview')selected='lou';}
      render();return;
    }
    if(action==='room-preview'&&roomItem(value)){previewId=value;preview=newPlacement(value,'preview');selected='preview';render();showPreview();return;}
    if(action==='room-goal'&&shopItem(previewId)?.price){latest();state.goal=previewId;persist();render();status('다음 스탬프 목표를 저장했어요.');return;}
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
    refreshControls();
    const p=selectedPlacement(),rect=dialog.querySelector('.room-scene').getBoundingClientRect();
    drag={pointerId:event.pointerId,x:event.clientX,y:event.clientY,original:{x:p.x,y:p.y},rect};
    object.setPointerCapture(event.pointerId);object.focus({preventScroll:true});event.preventDefault();
  });
  dialog.addEventListener('pointermove',event=>{
    if(!drag||drag.pointerId!==event.pointerId)return;
    applyPlacement({x:drag.original.x+(event.clientX-drag.x)/drag.rect.width*100,y:drag.original.y+(event.clientY-drag.y)/drag.rect.height*100});
  });
  const endDrag=()=>{drag=null;};dialog.addEventListener('pointerup',endDrag);dialog.addEventListener('pointercancel',endDrag);dialog.addEventListener('lostpointercapture',endDrag);
  dialog.addEventListener('change',event=>{
    if(!event.target.matches('[data-room-category]')||!ROOM_CATEGORIES.includes(event.target.value))return;
    category=event.target.value;page=0;previewId=null;preview=null;if(selected==='preview')selected='lou';
    render();dialog.querySelector('[data-room-category]').focus({preventScroll:true});
  });
  dialog.addEventListener('focusin',event=>{
    const object=event.target.closest('[data-room-object]');if(!object||object.dataset.roomObject===selected)return;
    selected=object.dataset.roomObject;dialog.querySelectorAll('[data-room-object]').forEach(node=>{node.classList.toggle('is-selected',node===object);node.setAttribute('aria-pressed',String(node===object));});
    refreshControls();
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
    avatar:mood=>renderAvatar(state.layout.look,mood),
    renderScene:mood=>{syncGifts();return renderRoomScene(state.layout,{mood});},
    snapshot:date=>{syncGifts();return roomAtDate(state,days(),date);},
    onProgress:()=>{latest();syncGifts();},isOpen:()=>dialog.open,
    reload:()=>{state=readRoom(storage,days());syncGifts();},
    reset:()=>{close(true);state=freshRoom(days());persist();},
    balance
  };
}
