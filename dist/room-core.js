import { today } from './core.js';
import { isRecordDate } from './records-core.js';
import { ROOM_ITEMS, WALLS, FLOORS, roomItem } from './room-catalog.js';

export const ROOM_KEY = 'bonjour-room-v1';
export const MAX_ROOM_ITEMS = 24;
export const STAMP_TARGETS = [3,10,20];
export const stampsForQuestions = questions => STAMP_TARGETS.filter(target => questions >= target).length;
export function stampEarnings(days, until = today()) {
  return Object.entries(days).filter(([date]) => isRecordDate(date) && date <= until)
    .reduce((sum,[,day]) => sum + stampsForQuestions(day.questions), 0);
}
export function giftIds(days, until = today()) {
  const count = Object.entries(days).filter(([date,day]) => isRecordDate(date) && date <= until && day.questions >= 3).length;
  return ROOM_ITEMS.filter(item => item.gift && item.gift <= count).map(item => item.id);
}
const clamp = (value,min,max,fallback) => Number.isFinite(value) ? Math.max(min,Math.min(max,value)) : fallback;
export function constrainPlacement(itemId, placement = {}) {
  const item = itemId === 'lou' ? {w:230,h:230} : roomItem(itemId);
  if (!item) return null;
  const scale = clamp(placement.scale,.6,1.6,1), rotation = clamp(placement.rotation,-30,30,0);
  const radians = Math.abs(rotation)*Math.PI/180;
  const halfWidth = (item.w*Math.cos(radians)+item.h*Math.sin(radians))*scale/16;
  const halfHeight = (item.w*Math.sin(radians)+item.h*Math.cos(radians))*scale/10;
  return {x:clamp(placement.x,halfWidth,100-halfWidth,50),y:clamp(placement.y,halfHeight,100-halfHeight,65),scale,rotation,flipped:placement.flipped===true};
}
export function newPlacement(itemId, uid) {
  const item = roomItem(itemId);
  return {uid,itemId,...constrainPlacement(itemId,item)};
}
export function defaultLayout(days = {}, date = today()) {
  const ids = giftIds(days,date);
  return {wall:'sage',floor:'oak',lou:constrainPlacement('lou',{x:50,y:65}),
    items:ids.sort((a,b)=>(a==='rug'?-1:b==='rug'?1:0)).map(id=>newPlacement(id,`gift-${id}`))};
}
export function ownedItems(state, days, date = today()) {
  return new Set([...giftIds(days,date),...Object.entries(state.purchases).filter(([,purchase])=>purchase.date<=date).map(([id])=>id)]);
}
export function wallet(state, days, date = today()) {
  const earned = stampEarnings(days,date);
  const spent = Object.values(state.purchases).filter(p=>p.date<=date).reduce((sum,p)=>sum+p.cost,0);
  return {earned,spent,balance:Math.max(0,earned-spent)};
}
export function sanitizeLayout(raw, owned) {
  const ids = new Set();
  const items = (Array.isArray(raw?.items)?raw.items:[]).filter(item=>{
    if (!item || !owned.has(item.itemId) || typeof item.uid!=='string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(item.uid) || ids.has(item.uid)) return false;
    ids.add(item.uid); return true;
  }).slice(0,MAX_ROOM_ITEMS).map(item=>({uid:item.uid,itemId:item.itemId,...constrainPlacement(item.itemId,item)}));
  return {wall:WALLS.some(w=>w.id===raw?.wall)?raw.wall:'sage',floor:FLOORS.some(f=>f.id===raw?.floor)?raw.floor:'oak',
    lou:constrainPlacement('lou',raw?.lou),items};
}
export function freshRoom(days = {}) {
  return {version:1,purchases:{},granted:giftIds(days),layout:defaultLayout(days),history:{},goal:'tulips',revision:0};
}
export function readRoom(storage, days = {}) {
  const state = freshRoom(days);
  try {
    const raw = JSON.parse(storage.getItem(ROOM_KEY));
    if(raw?.version!==1)return state;
    for(const [id,purchase] of Object.entries(raw.purchases||{})) {
      const item=roomItem(id);
      if(item?.price>0 && isRecordDate(purchase?.date) && purchase.date<=today() && Number.isSafeInteger(purchase.cost) && purchase.cost>0) state.purchases[id]={cost:purchase.cost,date:purchase.date};
    }
    state.granted=Array.isArray(raw.granted)?[...new Set(raw.granted.filter(id=>giftIds(days).includes(id)))]:[];
    state.layout=sanitizeLayout(raw.layout,ownedItems(state,days));
    for(const [date,layout] of Object.entries(raw.history||{})) if(isRecordDate(date)&&date<=today()) state.history[date]=sanitizeLayout(layout,ownedItems(state,days,date));
    state.goal=roomItem(raw.goal)?.price>0?raw.goal:'tulips';
    state.revision=Number.isSafeInteger(raw.revision)&&raw.revision>=0?raw.revision:0;
  } catch { /* Keep the recoverable default when storage is unavailable. */ }
  return state;
}
export function grantRoomGifts(state, days, date = today()) {
  let changed=false;
  for(const id of giftIds(days,date)) if(!state.granted.includes(id)) {
    state.granted.push(id); changed=true;
    if(state.layout.items.length<MAX_ROOM_ITEMS) {
      const item=newPlacement(id,`gift-${id}`);
      if(id==='rug')state.layout.items.unshift(item);else state.layout.items.push(item);
    }
  }
  if(changed)state.history[date]=structuredClone(state.layout);
  return changed;
}
export function buyRoomItem(state, days, itemId, date = today()) {
  const item=roomItem(itemId);
  if(!item||!item.price||!isRecordDate(date)||date>today())return {ok:false,reason:'invalid'};
  if(ownedItems(state,days,date).has(itemId))return {ok:false,reason:'owned'};
  if(wallet(state,days,date).balance<item.price)return {ok:false,reason:'balance'};
  state.purchases[itemId]={cost:item.price,date};
  state.revision++;
  return {ok:true};
}
export function saveLayout(state, days, layout, date = today()) {
  state.layout=sanitizeLayout(layout,ownedItems(state,days,date));
  state.history[date]=structuredClone(state.layout);state.revision++;
}
export function roomAtDate(state, days, date) {
  if(date===today())return structuredClone(state.layout);
  const saved=Object.keys(state.history).filter(day=>day<=date).sort().at(-1);
  return saved?sanitizeLayout(state.history[saved],ownedItems(state,days,date)):defaultLayout(days,date);
}
