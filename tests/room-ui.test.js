import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createRoom } from '../dist/room.js';
import { today } from '../dist/core.js';
import { addDays } from '../dist/practice-core.js';
import { ROOM_KEY } from '../dist/room-core.js';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('wardrobe previews, buys, layers and restores an outfit without consuming room slots',async()=>{
  const f=setup(),click=(action,value)=>f.click(`[data-action="room-${action}"]${value?'[data-value="'+value+'"]':''}`);
  click('open');click('tab','wardrobe');click('try','star-cape');
  assert.ok(f.$('.fitting-mirror [data-worn="star-cape"]'));assert.equal(f.$('[data-action="room-buy"]').disabled,true);
  click('goal');assert.equal(f.saved().goal,'star-cape');
  click('try','denim');click('buy');await tick();assert.equal(f.ui.balance(),0);
  click('slot','eyes');click('try','round-glasses');
  click('slot','head');click('try','daisy-pin');click('pose','think');click('coat','calico');
  click('save');assert.equal(f.saved().layout.items.length,2);
  assert.deepEqual(f.ui.snapshot(today()).look,{coat:'calico',pose:'think',body:'denim',eyes:'round-glasses',head:'daisy-pin'});
  f.ui.reload();assert.match(f.ui.renderScene('complete'),/data-pose="think"/);assert.match(f.ui.avatar('correct'),/data-worn="denim"/);
  click('open');click('tab','wardrobe');click('unequip');click('close');click('discard');
  assert.equal(f.ui.snapshot(today()).look.body,'denim');
  click('open');click('tab','wardrobe');click('unequip');click('save');assert.equal(f.ui.snapshot(today()).look.body,null);
  assert.equal(f.ui.balance(),0);f.dom.window.close();
});
function setup({count=3,broken=false}={}) {
  const dom=new JSDOM('<button data-action="room-open">꾸미기</button><dialog id="room-dialog"></dialog>',{url:'https://room.test/',pretendToBeVisual:true});
  const w=dom.window;Object.assign(globalThis,{window:w,document:w.document});
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  const days=Object.fromEntries(Array.from({length:count},(_,i)=>[addDays(today(),-i),{questions:3,rounds:1}]));
  const store=broken?{getItem:()=>null,setItem:()=>{throw Error('quota');}}:w.localStorage;
  let failures=0;
  const ui=createRoom({storage:store,getDays:()=>days,icon:()=>'<svg></svg>',escape:s=>s,onSaveError:()=>failures++});
  const $=s=>w.document.querySelector(s),click=s=>{const el=$(s);assert.ok(el,s);assert.equal(el.disabled,false);el.click();};
  const saved=()=>JSON.parse(w.localStorage.getItem(ROOM_KEY));
  return {dom,w,ui,$,click,saved,failures:()=>failures};
}
test('buying and reusing an item charges once, and cancel keeps ownership while discarding layout edits',async()=>{
  const f=setup();f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.click('[data-action="room-preview"][data-value="tulips"]');f.click('[data-action="room-buy"]');await tick();
  assert.equal(f.ui.balance(),2);assert.equal(f.saved().purchases.tulips.cost,1);
  f.click('[data-action="room-preview"][data-value="tulips"]');f.click('[data-action="room-place"]');
  assert.equal(f.$('.room-stage').querySelectorAll('img[src*="svg"]').length,5);
  f.click('[data-action="room-close"]');assert.ok(f.$('.room-discard-prompt'));
  f.click('[data-action="room-discard"]');assert.equal(f.ui.isOpen(),false);
  assert.equal(f.saved().layout.items.filter(i=>i.itemId==='tulips').length,0);
  f.click('[data-action="room-open"]');f.click('[data-action="room-preview"][data-value="tulips"]');f.click('[data-action="room-place"]');f.click('[data-action="room-save"]');
  assert.equal(f.saved().layout.items.filter(i=>i.itemId==='tulips').length,1);assert.equal(f.ui.balance(),2);f.dom.window.close();
});
test('free themes, keyboard movement, scaling and flipping survive a saved room',()=>{
  const f=setup({count:0});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="themes"]');
  f.click('[data-action="room-wall"][data-value="rose"]');f.click('[data-action="room-floor"][data-value="white"]');
  f.$('[data-room-object="lou"]').dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));
  const scale=f.$('[data-room-control="scale"]');scale.value=80;scale.dispatchEvent(new f.w.Event('input',{bubbles:true}));
  f.click('[data-action="room-flip"]');f.click('[data-action="room-save"]');
  const layout=f.saved().layout;assert.equal(layout.wall,'rose');assert.equal(layout.floor,'white');
  assert.equal(layout.lou.x,49);assert.equal(layout.lou.scale,.8);assert.equal(layout.lou.flipped,true);assert.equal(f.ui.balance(),0);f.dom.window.close();
});
test('insufficient funds disables purchase while allowing previews and a saved goal',()=>{
  const f=setup({count:0});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.click('[data-action="room-preview"][data-value="sofa"]');assert.equal(f.$('[data-action="room-buy"]').disabled,true);
  assert.ok(f.$('[data-room-object="preview"]'));f.click('[data-action="room-goal"]');assert.equal(f.saved().goal,'sofa');
  f.click('[data-action="room-close"]');assert.equal(f.ui.isOpen(),false);assert.equal(f.saved().layout.items.length,0);f.dom.window.close();
});
test('concurrent purchase changes are retained and concurrent layout changes are not silently overwritten',async()=>{
  const f=setup({count:7});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.click('[data-action="room-preview"][data-value="tulips"]');f.click('[data-action="room-buy"]');await tick();
  const external=f.saved();external.purchases.cactus={cost:1,date:today()};external.layout.wall='sky';f.w.localStorage.setItem(ROOM_KEY,JSON.stringify(external));
  f.click('[data-action="room-save"]');assert.equal(f.ui.isOpen(),true);assert.match(f.$('.room-status').textContent,/다른 창/);
  assert.equal(f.saved().layout.wall,'sky');assert.ok(f.saved().purchases.cactus);f.dom.window.close();
});
test('unavailable storage keeps the session wallet and layout usable with an explicit notice',async()=>{
  const f=setup({broken:true});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.click('[data-action="room-preview"][data-value="tulips"]');f.click('[data-action="room-buy"]');await tick();
  assert.equal(f.ui.balance(),2);assert.ok(f.failures()>0);f.click('[data-action="room-save"]');
  assert.equal(f.ui.isOpen(),true);assert.match(f.$('.room-status').textContent,/이번 방문/);f.click('[data-action="room-close"]');
  f.click('[data-action="room-open"]');assert.match(f.$('.room-status').textContent,/이번 방문/);assert.equal(f.ui.balance(),2);f.dom.window.close();
});
