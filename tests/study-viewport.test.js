import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { bindStudyViewport } from '../dist/study-viewport.js';

function setup(withViewport=true) {
  const dom=new JSDOM('<dialog open><div class="practice-body" tabindex="-1"><div class="practice-question"><h3>말할 수 있어.</h3><input id="practice-input" value="peux"></div></div></dialog>',{pretendToBeVisual:true});
  const win=dom.window,dialog=win.document.querySelector('dialog'),body=dialog.querySelector('.practice-body'),question=dialog.querySelector('.practice-question'),input=dialog.querySelector('input');
  win.innerWidth=393;win.innerHeight=820;
  const viewport=new win.EventTarget();
  Object.assign(viewport,{height:820,offsetTop:0,scale:1});
  if(withViewport)Object.defineProperty(win,'visualViewport',{value:viewport});
  let frame=0;
  const pending=new Map();
  win.requestAnimationFrame=callback=>{pending.set(++frame,callback);return frame;};
  win.cancelAnimationFrame=id=>pending.delete(id);
  const flush=()=>{for(const [id,callback] of pending){pending.delete(id);callback();}};
  body.getBoundingClientRect=()=>({top:viewport.offsetTop+56,bottom:viewport.offsetTop+viewport.height-64,height:viewport.height-120});
  question.getBoundingClientRect=()=>({top:viewport.offsetTop+68-body.scrollTop,bottom:viewport.offsetTop+198-body.scrollTop,height:130});
  input.getBoundingClientRect=()=>({top:viewport.offsetTop+146-body.scrollTop,bottom:viewport.offsetTop+198-body.scrollTop,height:52});
  bindStudyViewport(dialog);
  return {dom,win,dialog,body,input,viewport,flush};
}

test('keyboard resize and viewport panning keep the prompt and typed answer together',()=>{
  const f=setup();
  f.input.focus();
  f.body.scrollTop=110;
  Object.assign(f.viewport,{height:360,offsetTop:26});
  f.viewport.dispatchEvent(new f.win.Event('resize'));f.flush();
  assert.equal(f.dialog.style.getPropertyValue('--study-height'),'360px');
  assert.equal(f.dialog.style.getPropertyValue('--study-top'),'26px');
  assert.equal(f.body.scrollTop,0,'the prompt returns above the input');
  assert.equal(f.input.value,'peux');
  assert.ok(f.dialog.classList.contains('typing-focused'));
  f.body.scrollTop=90;f.viewport.offsetTop=40;
  f.viewport.dispatchEvent(new f.win.Event('scroll'));f.flush();
  assert.equal(f.body.scrollTop,0);
  assert.equal(f.dialog.style.getPropertyValue('--study-top'),'40px');
  f.body.focus();f.body.scrollTop=35;
  f.viewport.dispatchEvent(new f.win.Event('resize'));f.flush();
  assert.equal(f.dialog.classList.contains('typing-focused'),false);
  assert.equal(f.body.scrollTop,35,'ordinary reading is not forced back to the prompt');
  f.viewport.scale=2;f.viewport.height=180;
  f.viewport.dispatchEvent(new f.win.Event('resize'));f.flush();
  assert.equal(f.dialog.style.getPropertyValue('--study-height'),'360px','pinch zoom does not shrink the learning layout');
  f.dom.window.close();
});

test('browsers without VisualViewport follow content resize and recover after the keyboard closes',()=>{
  const f=setup(false);
  f.win.innerHeight=390;f.win.dispatchEvent(new f.win.Event('resize'));f.flush();
  assert.equal(f.dialog.style.getPropertyValue('--study-height'),'390px');
  f.win.innerHeight=820;f.win.dispatchEvent(new f.win.Event('resize'));f.flush();
  assert.equal(f.dialog.style.getPropertyValue('--study-height'),'820px');
  f.dom.window.close();
});
