import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createRoom } from '../dist/room.js';
import { today } from '../dist/core.js';
import { addDays } from '../dist/practice-core.js';
import { ROOM_KEY } from '../dist/room-core.js';
import { ROOM_ITEMS } from '../dist/room-catalog.js';
import { WEARABLES } from '../dist/wardrobe.js';
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('large fitting preview preserves purchase rules, focus and unsaved outfit',()=>{
  const f=setup({count:1}),click=(a,v)=>f.click(`[data-action="room-${a}"]${v?'[data-value="'+v+'"]':''}`);
  click('open');click('tab','wardrobe');click('try','citron-raincoat');
  const before=f.w.localStorage.getItem(ROOM_KEY);
  click('zoom');assert.equal(f.$('.room-library').hidden,true);
  assert.equal(f.$('[data-action="room-buy"]').disabled,true);
  assert.equal(f.w.document.activeElement.dataset.action,'room-zoom');
  f.$('#room-dialog').dispatchEvent(new f.w.Event('cancel',{cancelable:true}));
  assert.equal(f.$('#room-dialog').open,true);assert.equal(f.$('.room-library').hidden,false);
  assert.ok(f.$('.fitting-mirror [data-worn="citron-raincoat"]'));
  assert.equal(f.w.localStorage.getItem(ROOM_KEY),before);
  click('untry');click('try','cloud-pajamas');click('zoom');click('save');
  assert.equal(f.saved().layout.look.body,'cloud-pajamas');
  click('open');click('tab','wardrobe');assert.equal(f.$('.room-library').hidden,false);
  f.dom.window.close();
});

test('greeting is temporary and does not replace the saved pose or outfit',()=>{
  const f=setup(),click=(a,v)=>f.click(`[data-action="room-${a}"]${v?'[data-value="'+v+'"]':''}`);
  click('open');click('tab','wardrobe');click('try','cloud-pajamas');click('slot','appearance');click('pose','think');
  click('greet');assert.equal(f.$('.fitting-mirror .lou-avatar').dataset.pose,'happy');
  click('save');assert.equal(f.saved().layout.look.pose,'think');assert.equal(f.saved().layout.look.body,'cloud-pajamas');
  f.dom.window.close();
});
test('wardrobe previews, buys, layers and restores an outfit without consuming room slots',async()=>{
  const f=setup(),click=(action,value)=>f.click(`[data-action="room-${action}"]${value?'[data-value="'+value+'"]':''}`);
  click('open');click('tab','wardrobe');click('page','next');click('try','star-cape');
  const dressed=f.$('.fitting-mirror .lou-avatar[data-worn="star-cape"]');
  assert.match(dressed.style.backgroundImage,/lou-outfits-v3\/star-cape\.webp/);assert.equal(dressed.querySelector('img[data-worn]'),null);assert.equal(f.$('[data-action="room-buy"]').disabled,true);
  click('goal');assert.equal(f.saved().goal,'star-cape');
  click('try','denim');click('buy');await tick();assert.equal(f.ui.balance(),0);
  click('slot','eyes');click('try','round-glasses');
  click('slot','head');click('try','daisy-pin');click('slot','appearance');click('pose','think');click('coat','calico');
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
  const $=s=>w.document.querySelector(s),click=s=>{const el=$(s);assert.ok(el,s);assert.ok(!el.matches(':disabled'),s);el.click();};
  const preview=id=>{
    const selector=`[data-action="room-preview"][data-value="${id}"]`;
    while(!$(selector))click('[data-action="room-page"][data-value="next"]:not(:disabled)');
    click(selector);
  };
  const saved=()=>JSON.parse(w.localStorage.getItem(ROOM_KEY));
  return {dom,w,ui,$,click,preview,saved,failures:()=>failures};
}
test('the catalog pages through every decoration and filtering returns to the first page',()=>{
  const f=setup(),seen=[];
  f.click('[data-action="room-open"]');
  f.click('[data-action="room-tab"][data-value="shop"]');
  assert.equal(f.$('.placement-tools').open,false);
  for(;;){
    const cards=[...f.w.document.querySelectorAll('[data-action="room-preview"]')];
    assert.ok(cards.length>0&&cards.length<=6);
    seen.push(...cards.map(card=>card.dataset.value));
    const next=f.$('[data-action="room-page"][data-value="next"]');
    if(!next||next.disabled)break;
    next.click();
  }
  assert.deepEqual(seen,ROOM_ITEMS.map(item=>item.id));
  const filter=f.$('[data-room-category]');filter.value='식물';filter.dispatchEvent(new f.w.Event('change',{bubbles:true}));
  const plants=ROOM_ITEMS.filter(item=>item.category==='식물');
  assert.deepEqual([...f.w.document.querySelectorAll('[data-action="room-preview"]')].map(card=>card.dataset.value),plants.slice(0,6).map(item=>item.id));
  f.preview('tulips');assert.ok(f.$('[data-room-object="preview"]'));
  f.click('[data-action="room-untry"]');assert.equal(f.$('[data-room-object="preview"]'),null);
  f.dom.window.close();
});
test('wardrobe pages keep the fitting-room preview, and free and paid pieces can be mixed and removed separately',async()=>{
  const f=setup({count:4});
  const click=(action,value)=>f.click(`[data-action="room-${action}"]${value?'[data-value="'+value+'"]':''}`);
  click('open');click('tab','wardrobe');
  for(const slot of ['body','eyes','head']){
    click('slot',slot);
    const seen=[];
    for(;;){
      const cards=[...f.w.document.querySelectorAll('.wardrobe-grid [data-action="room-try"]')];
      assert.ok(cards.length>0&&cards.length<=6);
      seen.push(...cards.map(card=>card.dataset.value));
      if(f.$('[data-action="room-page"][data-value="next"]').disabled)break;
      click('page','next');
    }
    assert.deepEqual(seen,WEARABLES.filter(item=>item.slot===slot).map(item=>item.id));
  }
  click('slot','body');click('try','cloud-pajamas');
  assert.equal(f.ui.balance(),4);assert.equal(f.$('.fitting-mirror .lou-avatar').dataset.worn,'cloud-pajamas');
  click('try','lunar-suit');click('page','next');
  assert.equal(f.$('.fitting-mirror .lou-avatar').dataset.worn,'lunar-suit');
  click('untry');assert.equal(f.$('.fitting-mirror .lou-avatar').dataset.worn,'cloud-pajamas');
  click('slot','eyes');click('try','opera-monocle');click('buy');await tick();
  click('slot','head');click('try','lavender-pin');click('buy');await tick();click('save');
  assert.equal(f.ui.balance(),0);
  assert.deepEqual(f.saved().layout.look,{coat:'cream',pose:'auto',body:'cloud-pajamas',eyes:'opera-monocle',head:'lavender-pin'});
  click('open');click('tab','wardrobe');click('slot','eyes');click('unequip');click('save');
  assert.deepEqual(f.saved().layout.look,{coat:'cream',pose:'auto',body:'cloud-pajamas',eyes:null,head:'lavender-pin'});
  f.dom.window.close();
});
test('buying and reusing an item charges once, and cancel keeps ownership while discarding layout edits',async()=>{
  const f=setup();f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.preview('tulips');f.click('[data-action="room-buy"]');await tick();
  assert.equal(f.ui.balance(),2);assert.equal(f.saved().purchases.tulips.cost,1);
  f.preview('tulips');f.click('[data-action="room-place"]');
  assert.equal(f.$('.room-stage').querySelectorAll('img[src*="svg"]').length,5);
  f.click('[data-action="room-close"]');assert.ok(f.$('.room-discard-prompt'));
  f.click('[data-action="room-discard"]');assert.equal(f.ui.isOpen(),false);
  assert.equal(f.saved().layout.items.filter(i=>i.itemId==='tulips').length,0);
  f.click('[data-action="room-open"]');f.preview('tulips');f.click('[data-action="room-place"]');f.click('[data-action="room-save"]');
  assert.equal(f.saved().layout.items.filter(i=>i.itemId==='tulips').length,1);assert.equal(f.ui.balance(),2);f.dom.window.close();
});
test('free themes, keyboard movement, scaling and flipping survive a saved room',()=>{
  const f=setup({count:0});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="themes"]');
  f.click('[data-action="room-wall"][data-value="rose"]');f.click('[data-action="room-floor"][data-value="white"]');
  f.$('[data-room-object="lou"]').dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));
  f.click('.placement-tools summary');assert.equal(f.$('.placement-tools').open,true);
  const scale=f.$('[data-room-control="scale"]');scale.value=80;scale.dispatchEvent(new f.w.Event('input',{bubbles:true}));
  f.click('[data-action="room-flip"]');f.click('[data-action="room-save"]');
  const layout=f.saved().layout;assert.equal(layout.wall,'rose');assert.equal(layout.floor,'white');
  assert.equal(layout.lou.x,49);assert.equal(layout.lou.scale,.8);assert.equal(layout.lou.flipped,true);assert.equal(f.ui.balance(),0);f.dom.window.close();
});

test('continuing decoration restores expanded placement controls and the previous scroll position',()=>{
  const f=setup();f.click('[data-action="room-open"]');
  f.click('.placement-tools summary');
  f.click('[data-action="room-flip"]');
  const dialog=f.$('#room-dialog');dialog.scrollTop=85;
  f.click('[data-action="room-close"]');assert.ok(f.$('.room-discard-prompt'));
  f.click('[data-action="room-keep"]');
  assert.equal(f.$('.placement-tools').open,true);
  assert.equal(dialog.scrollTop,85);
  assert.equal(f.w.document.activeElement,f.$('.placement-tools summary'));
  f.click('[data-action="room-save"]');assert.equal(f.saved().layout.lou.flipped,true);
  f.dom.window.close();
});

test('a full room keeps purchases in inventory and explains where the item went',async()=>{
  const f=setup();f.click('[data-action="room-open"]');f.click('[data-action="room-save"]');
  const state=f.saved(),template=state.layout.items[0];
  state.layout.items=Array.from({length:24},(_,index)=>({...template,uid:'full-'+index}));
  f.w.localStorage.setItem(ROOM_KEY,JSON.stringify(state));f.ui.reload();
  f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.preview('tulips');f.click('[data-action="room-buy"]');await tick();
  assert.equal(f.ui.balance(),2);
  assert.ok(f.saved().purchases.tulips);
  assert.equal(f.$('[data-action="room-place"]').disabled,true);
  assert.equal(f.$('.room-status').classList.contains('visually-hidden'),false);
  assert.match(f.$('.room-status').textContent,/내 소품에 보관/);
  assert.equal(f.saved().layout.items.length,24);
  f.click('[data-action="room-close"]');assert.equal(f.ui.isOpen(),false);
  f.dom.window.close();
});
test('insufficient funds disables purchase while allowing previews and a saved goal',()=>{
  const f=setup({count:0});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.preview('sofa');assert.equal(f.$('[data-action="room-buy"]').disabled,true);
  assert.ok(f.$('[data-room-object="preview"]'));f.click('[data-action="room-goal"]');assert.equal(f.saved().goal,'sofa');
  f.click('[data-action="room-close"]');assert.equal(f.ui.isOpen(),false);assert.equal(f.saved().layout.items.length,0);f.dom.window.close();
});
test('concurrent purchase changes are retained and concurrent layout changes are not silently overwritten',async()=>{
  const f=setup({count:7});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.preview('tulips');f.click('[data-action="room-buy"]');await tick();
  const external=f.saved();external.purchases.cactus={cost:1,date:today()};external.layout.wall='sky';f.w.localStorage.setItem(ROOM_KEY,JSON.stringify(external));
  f.click('[data-action="room-save"]');assert.equal(f.ui.isOpen(),true);assert.match(f.$('.room-status').textContent,/다른 창/);
  assert.equal(f.saved().layout.wall,'sky');assert.ok(f.saved().purchases.cactus);f.dom.window.close();
});
test('unavailable storage keeps the session wallet and layout usable with an explicit notice',async()=>{
  const f=setup({broken:true});f.click('[data-action="room-open"]');f.click('[data-action="room-tab"][data-value="shop"]');
  f.preview('tulips');f.click('[data-action="room-buy"]');await tick();
  assert.equal(f.ui.balance(),2);assert.ok(f.failures()>0);f.click('[data-action="room-save"]');
  assert.equal(f.ui.isOpen(),true);assert.match(f.$('.room-status').textContent,/이번 방문/);f.click('[data-action="room-close"]');
  f.click('[data-action="room-open"]');assert.match(f.$('.room-status').textContent,/이번 방문/);assert.equal(f.ui.balance(),2);f.dom.window.close();
});
