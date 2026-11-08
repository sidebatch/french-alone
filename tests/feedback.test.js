import test from 'node:test';
import assert from 'node:assert/strict';
import { readState } from '../dist/core.js';

let fixture=0;
async function setup(state='running') {
  const contexts=[];
  const parameter=()=>({value:0,events:[],setValueAtTime(value,at){this.events.push([value,at]);},exponentialRampToValueAtTime(value,at){this.events.push([value,at]);}});
  class Audio {
    constructor(){this.state=state;this.currentTime=12;this.destination={};this.voices=[];this.gains=[];contexts.push(this);}
    createGain(){const gain={gain:parameter(),connect(){},disconnect(){this.disconnected=true;}};this.gains.push(gain);return gain;}
    createDynamicsCompressor(){return {threshold:{},knee:{},ratio:{},attack:{},release:{},connect(){},disconnect(){}};}
    createOscillator(){const voice={frequency:parameter(),connect(){},disconnect(){},start(at){this.started=at;},stop(at){this.stopped=at;}};this.voices.push(voice);return voice;}
    resume(){return new Promise((resolve,reject)=>{this.unlock=()=>{this.state='running';resolve();};this.reject=reject;});}
  }
  globalThis.window={AudioContext:Audio};
  const {playFeedback}=await import('../dist/feedback.js?audio-test='+(++fixture));
  return {playFeedback,contexts};
}

test('muted, disabled and unsupported audio never create an audio context',async()=>{
  const {playFeedback,contexts}=await setup();
  assert.equal(playFeedback('correct',false),false);
  assert.equal(playFeedback('correct',true,0),false);
  assert.equal(playFeedback('correct',true,-10),false);
  assert.equal(contexts.length,0);
  globalThis.window={};assert.equal(playFeedback('correct'),false);
});

test('chimes use the saved volume, distinguish outcomes and release their nodes',async()=>{
  const {playFeedback,contexts}=await setup();
  assert.equal(playFeedback('correct',true,50),true);
  const audio=contexts[0];
  assert.equal(audio.gains[0].gain.value,0.35);
  assert.equal(audio.voices.length,6);
  assert.equal(audio.voices[0].type,'triangle');
  assert.ok(audio.voices.every(voice=>voice.started>=audio.currentTime));
  audio.voices.forEach(voice=>voice.onended());assert.equal(audio.gains[0].disconnected,true);
  playFeedback('wrong');assert.equal(audio.voices.length,10);
  playFeedback('complete',true,150);assert.equal(audio.voices.length,20);
  assert.equal(audio.gains.at(-11).gain.value,0.7);
  assert.equal(contexts.length,1,'reuse a context across answers');
});

test('a locked phone context resumes before scheduling and drops an obsolete pending sound',async()=>{
  const {playFeedback,contexts}=await setup('suspended');
  playFeedback('complete');const audio=contexts[0],unlockFirst=audio.unlock;
  assert.equal(audio.voices.length,0);
  playFeedback('wrong');const unlockSecond=audio.unlock;
  unlockFirst();await Promise.resolve();assert.equal(audio.voices.length,0);
  unlockSecond();await Promise.resolve();assert.equal(audio.voices.length,4);
  audio.state='closed';playFeedback('correct');assert.equal(contexts.length,2);
});

test('a rejected resume releases the graph without breaking study',async()=>{
  const {playFeedback,contexts}=await setup('suspended');
  playFeedback('correct');const audio=contexts[0];audio.reject(Error('locked'));
  await Promise.resolve();await Promise.resolve();
  assert.equal(audio.voices.length,0);assert.equal(audio.gains[0].disconnected,true);
});

test('old progress keeps its records and gets a usable volume; invalid volumes are normalized',()=>{
  const raw={version:1,completed:['greetings'],effects:false};
  const read=()=>readState({getItem:()=>JSON.stringify(raw)});
  assert.deepEqual(read().completed,['greetings']);assert.equal(read().effects,false);assert.equal(read().effectsVolume,80);
  raw.effectsVolume=35;assert.equal(read().effectsVolume,35);
  raw.effectsVolume=900;assert.equal(read().effectsVolume,100);
  raw.effectsVolume=-9;assert.equal(read().effectsVolume,0);
  raw.effectsVolume='loud';assert.equal(read().effectsVolume,80);
});
