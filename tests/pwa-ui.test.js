import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const source=await readFile(new URL('../dist/pwa.js',import.meta.url),'utf8');
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
function setup({standalone=false,worker=false,waiting=false}={}) {
  const dom=new JSDOM(html,{url:'https://sidebatch.github.io/french-alone/#home',runScripts:'outside-only'});
  const w=dom.window, listeners={}, messages=[], registrations=[];
  w.matchMedia=()=>({matches:standalone,addEventListener(){}});
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  if(worker){
    const reg={waiting:waiting?{postMessage:message=>messages.push(message)}:null,addEventListener(name,callback){listeners['reg:'+name]=callback;}};
    const sw={controller:waiting?{}:null,ready:Promise.resolve(reg),async register(...args){registrations.push(args);return reg;},addEventListener(name,callback){listeners[name]=callback;}};
    Object.defineProperty(w.navigator,'serviceWorker',{value:sw,configurable:true});
  }
  w.eval(source);
  const $=selector=>w.document.querySelector(selector);
  return {w,$,listeners,messages,registrations};
}

test('manual installation stays accessible without a native prompt and copying has a fallback',async()=>{
  const f=setup();assert.equal(f.$('#install-app').hidden,false);
  f.$('#install-app').click();assert.equal(f.$('#install-dialog').open,true);assert.equal(f.$('#pwa-native-install').hidden,true);
  assert.match(f.$('#install-dialog').textContent,/Chrome/);assert.match(f.$('#install-dialog').textContent,/Safari/);
  assert.equal(f.$('#pwa-app-url').value,'https://sidebatch.github.io/french-alone/');
  f.$('#pwa-copy-link').click();await tick();assert.match(f.$('#pwa-install-feedback').textContent,/길게 눌러/);
  f.$('#pwa-close').click();assert.equal(f.$('#install-dialog').open,false);
  f.w.close();
});

test('native install requests need a user click and accepted requests are not reported as completed installs',async()=>{
  const f=setup();let prompts=0;
  const event=new f.w.Event('beforeinstallprompt',{cancelable:true});
  event.prompt=async()=>{prompts++;};event.userChoice=Promise.resolve({outcome:'accepted'});
  f.w.dispatchEvent(event);assert.equal(event.defaultPrevented,true);assert.equal(prompts,0);
  f.$('#install-app').click();assert.equal(f.$('#pwa-native-install').hidden,false);
  f.$('#pwa-native-install').click();await tick();assert.equal(prompts,1);
  assert.match(f.$('#pwa-install-feedback').textContent,/요청/);assert.equal(f.$('#install-app').hidden,false);
  f.w.dispatchEvent(new f.w.Event('appinstalled'));assert.equal(f.$('#install-app').hidden,true);
  f.w.close();
});

test('installed mode hides installation and cache readiness uses a scoped worker',async()=>{
  const f=setup({standalone:true,worker:true});await tick();
  assert.equal(f.$('#install-app').hidden,true);
  assert.equal(f.registrations[0][0],'./sw.js');assert.equal(f.registrations[0][1].scope,'./');assert.equal(f.registrations[0][1].updateViaCache,'none');
  assert.match(f.$('#pwa-offline-status').textContent,/준비 완료/);f.w.close();
});

test('waiting updates do not reload or activate until the learner explicitly chooses to reopen',async()=>{
  const f=setup({worker:true,waiting:true});await tick();
  assert.equal(f.$('#pwa-update').hidden,false);assert.equal(f.messages.length,0);
  f.listeners.controllerchange();assert.equal(f.messages.length,0);
  f.$('#pwa-update-button').click();
  assert.equal(f.messages.length,1);assert.equal(f.messages[0].type,'ACTIVATE_UPDATE');assert.equal(f.$('#pwa-update-button').disabled,true);
  f.w.close();
});
