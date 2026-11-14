import test from 'node:test';
import assert from 'node:assert/strict';
import { today } from '../dist/core.js';
import { addDays } from '../dist/practice-core.js';
import { ROOM_ITEMS } from '../dist/room-catalog.js';
import { stampsForQuestions, stampEarnings, freshRoom, readRoom, wallet, ownedItems, buyRoomItem, grantRoomGifts, newPlacement, constrainPlacement, sanitizeLayout, saveLayout, roomAtDate, MAX_ROOM_ITEMS } from '../dist/room-core.js';
const date=today();
const makeDays=(n,questions=3)=>Object.fromEntries(Array.from({length:n},(_,i)=>[addDays(date,-i),{questions,rounds:1}]));
const reload=(state,days)=>readRoom({getItem:()=>JSON.stringify(state)},days);

test('room stamp currency awards the three daily milestones once and ignores future or invalid dates',()=>{
  assert.deepEqual([0,2,3,9,10,19,20,100].map(stampsForQuestions),[0,0,1,1,2,2,3,3]);
  const days=makeDays(3,20);days[addDays(date,1)]={questions:100};days['2026-02-30']={questions:100};
  assert.equal(stampEarnings(days),9);
  assert.equal(stampEarnings(days,addDays(date,-1)),6);
});
test('legacy gifts stay owned when stamps are spent and old learning days fund the wallet',()=>{
  const days=makeDays(7),state=freshRoom(days);
  assert.equal(wallet(state,days).balance,7);
  assert.deepEqual([...ownedItems(state,days)],['plant','books','rug']);
  assert.equal(buyRoomItem(state,days,'sofa').ok,true);
  assert.equal(wallet(reload(state,days),days).balance,0);
  for(const id of ['plant','books','rug','sofa'])assert.ok(ownedItems(reload(state,days),days).has(id));
  assert.equal(stampEarnings(days),7,'spending does not erase learning achievements');
  state.purchases.sofa.cost=6;
  assert.equal(wallet(reload(state,days),days).spent,6,'keep the actual paid price when catalog prices change');
});
test('purchases reject duplicate charges, unknown items and insufficient funds without mutation',()=>{
  const days=makeDays(1),state=freshRoom(days);
  assert.equal(buyRoomItem(state,days,'tulips').ok,true);
  const before=structuredClone(state);
  assert.equal(buyRoomItem(state,days,'tulips').reason,'owned');
  assert.equal(buyRoomItem(state,days,'sofa').reason,'balance');
  assert.equal(buyRoomItem(state,days,'missing').reason,'invalid');
  assert.equal(buyRoomItem(state,days,'plant').reason,'invalid');
  assert.deepEqual(state,before);
});
test('new milestone gifts arrive once and removing a gift from the room does not revoke ownership',()=>{
  const state=freshRoom(),days=makeDays(1);
  assert.equal(grantRoomGifts(state,days),true);
  assert.equal(grantRoomGifts(state,days),false);
  assert.equal(state.layout.items.length,1);
  state.layout.items=[];saveLayout(state,days,state.layout);
  const restored=reload(state,days);
  assert.equal(grantRoomGifts(restored,days),false);
  assert.equal(restored.layout.items.length,0);assert.ok(ownedItems(restored,days).has('plant'));
});
test('purchased decorations can be reused without charging for copies and layouts keep changes',()=>{
  const days=makeDays(2),state=freshRoom(days);buyRoomItem(state,days,'tulips');
  const layout=structuredClone(state.layout);
  layout.items.push(newPlacement('tulips','flower-one'),newPlacement('tulips','flower-two'));
  layout.wall='night';layout.floor='white';layout.lou={x:35,y:55,scale:.85,rotation:15,flipped:true};
  saveLayout(state,days,layout);
  const restored=reload(state,days);
  assert.equal(restored.layout.items.filter(p=>p.itemId==='tulips').length,2);
  assert.deepEqual(restored.layout.lou,layout.lou);
  assert.equal(restored.layout.wall,'night');assert.equal(wallet(restored,days).spent,1);
});
test('saved arrangements and certificate history cannot contain unknown, unowned or future purchases',()=>{
  const days=makeDays(10),state=freshRoom(days),past=addDays(date,-2);
  const layout=structuredClone(state.layout);layout.wall='rose';saveLayout(state,days,layout,past);
  buyRoomItem(state,days,'sofa');layout.items.push(newPlacement('sofa','sofa-one'));layout.wall='night';saveLayout(state,days,layout);
  assert.equal(roomAtDate(state,days,past).wall,'rose');
  assert.equal(roomAtDate(state,days,past).items.some(p=>p.itemId==='sofa'),false);
  assert.equal(roomAtDate(state,days,date).wall,'night');
  state.history[past].items.push(newPlacement('sofa','future-sofa'));
  assert.equal(reload(state,days).history[past].items.some(p=>p.itemId==='sofa'),false);
});
test('layout loading bounds positions and filters duplicates, oversized collections and corrupt purchases',()=>{
  const p=constrainPlacement('sofa',{x:-100,y:500,scale:99,rotation:500});
  assert.equal(p.scale,1.6);assert.equal(p.rotation,30);assert.ok(p.x>0&&p.y<100);
  const layout=sanitizeLayout({wall:'bad',items:[...Array.from({length:40},(_,i)=>newPlacement('plant','p-'+i)),newPlacement('sofa','not-owned')]},new Set(['plant']));
  assert.equal(layout.items.length,MAX_ROOM_ITEMS);assert.equal(layout.wall,'sage');
  const state=freshRoom(makeDays(7));state.purchases={tulips:{date,cost:-1},sofa:{date:'bad',cost:7},missing:{date,cost:0}};
  assert.deepEqual(reload(state,makeDays(7)).purchases,{});
  assert.equal(new Set(ROOM_ITEMS.map(i=>i.id)).size,27);
});
