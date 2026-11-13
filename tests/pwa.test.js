import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { inflateSync } from 'node:zlib';
import { makeIconPNG } from '../scripts/generate-icons.mjs';

const scope = 'https://sidebatch.github.io/french-alone/';
const workerSource = await readFile(new URL('../dist/sw.js',import.meta.url),'utf8');

function workerHarness() {
  const handlers={}, stores=new Map(), requests=[];
  let offline=false, putFails=false, openFails=false, claims=0, skipped=0, revision='one';
  const key=value=>typeof value==='string'?value:value.url;
  const network=async request=>{
    requests.push(key(request));
    if(offline)throw Error('offline');
    return new Response(revision+':'+new URL(key(request)).pathname,{status:200});
  };
  const caches={
    async open(name){
      if(openFails)throw Error('cache disabled');
      if(!stores.has(name))stores.set(name,new Map());
      const store=stores.get(name);
      return {
        async addAll(items){for(const request of items){const response=await network(request);if(!response.ok)throw Error('bad asset');store.set(key(request),response.clone());}},
        async match(request){return store.get(key(request))?.clone();},
        async put(request,response){if(putFails)throw Error('quota');store.set(key(request),response.clone());}
      };
    },
    async keys(){return [...stores.keys()];},
    async delete(name){return stores.delete(name);}
  };
  const self={registration:{scope},location:new URL(scope),clients:{async claim(){claims++;}},skipWaiting(){skipped++;},addEventListener(name,callback){handlers[name]=callback;}};
  vm.runInNewContext(workerSource,{self,caches,fetch:network,Request,Response,URL,Set,Promise});
  return {
    stores,requests,handlers,
    setOffline:value=>{offline=value;}, setPutFailure:value=>{putFails=value;},setOpenFailure:value=>{openFails=value;},setRevision:value=>{revision=value;},
    stats:()=>({claims,skipped}),
    async lifecycle(name){let pending;handlers[name]({waitUntil(promise){pending=promise;}});await pending;},
    async get(url,{method='GET',mode='cors'}={}){let pending;handlers.fetch({request:{url,method,mode},respondWith(promise){pending=promise;}});return pending ? await pending : null;}
  };
}

test('manifest and real PNG icons install within the repository path',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../dist/manifest.webmanifest',import.meta.url),'utf8'));
  assert.equal(manifest.display,'standalone');
  assert.equal(new URL(manifest.scope,scope).href,scope);
  assert.equal(new URL(manifest.start_url,scope).href,scope+'#home');
  assert.equal(new URL(manifest.id,scope).href,scope);
  for(const size of [192,512,180]){
    const name=size===180?'apple-touch-icon.png':'icon-'+size+'.png';
    const png=await readFile(new URL('../dist/icons/'+name,import.meta.url));
    assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
    assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);assert.equal(png[25],3);
    assert.deepEqual(png,Buffer.from(makeIconPNG(size)));
    const data=[];let offset=8;
    while(offset<png.length){const length=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8);if(type==='IDAT')data.push(png.subarray(offset+8,offset+8+length));offset+=length+12;}
    const raw=inflateSync(Buffer.concat(data));assert.equal(raw.length,(size+1)*size);
    for(let y=0;y<size;y++)assert.equal(raw[y*(size+1)],0);
    assert.ok(new Set(raw).size>2,'icon should contain the brand mark');
  }
  for(const size of [192,512])assert.ok(manifest.icons.some(icon=>icon.sizes===size+'x'+size&&icon.type==='image/png'&&icon.purpose.includes('maskable')));
});

test('offline precache contains every module, stylesheet, manifest and icon and preserves online updates',async()=>{
  const h=workerHarness();await h.lifecycle('install');
  const names=(await Promise.all(h.requests.map(url=>new URL(url).pathname))).map(path=>path.slice('/french-alone/'.length));
  for(const name of ['app.js','core.js','data.js','practice.js','practice-core.js','practice-data.js','practice-content.js','practice-intermediate.js','practice-lessons.js','grammar-data.js','grammar-core.js','grammar.js','grammar.css','learning.css','play.css','companion.js','companion.css','polish.css','assets/lou-sprites-v2.webp','pwa.js','pwa.css','product.css','manifest.webmanifest','icons/icon-512.png'])assert.ok(names.includes(name),name);
  for(const name of names)await access(new URL('../dist/'+(name||'index.html'),import.meta.url));
  assert.equal(h.stats().skipped,0,'install must not interrupt an existing lesson');
  h.setRevision('two');
  assert.match(await (await h.get(scope+'app.js')).text(),/^two:/);
  h.setOffline(true);
  assert.match(await (await h.get(scope+'app.js')).text(),/^two:/);
  assert.match(await (await h.get(scope+'?from=home',{mode:'navigate'})).text(),/^one:/);
  for(const name of ['practice.js','practice-data.js','style.css','pwa.css'])assert.equal((await h.get(scope+name)).status,200);
});

test('worker isolates sibling sites and old caches and activates updates only on explicit request',async()=>{
  const h=workerHarness();await h.lifecycle('install');
  h.stores.set('french-alone:'+scope+':old',new Map());
  h.stores.set('french-alone:https://sidebatch.github.io/another-app/:old',new Map());
  h.stores.set('other-app-cache',new Map());
  await h.lifecycle('activate');
  assert.equal(h.stores.has('french-alone:'+scope+':old'),false);
  assert.ok(h.stores.has('other-app-cache'));assert.ok(h.stores.has('french-alone:https://sidebatch.github.io/another-app/:old'));assert.equal(h.stats().claims,1);
  assert.equal(await h.get('https://fonts.googleapis.com/css2'),null);
  assert.equal(await h.get('https://sidebatch.github.io/another-app/app.js'),null);
  assert.equal(await h.get(scope+'app.js',{method:'POST'}),null);
  h.handlers.message({data:{type:'OTHER'}});assert.equal(h.stats().skipped,0);
  h.handlers.message({data:{type:'ACTIVATE_UPDATE'}});assert.equal(h.stats().skipped,1);
});

test('online lessons survive cache write failures and uncached offline requests fail clearly',async()=>{
  const h=workerHarness();await h.lifecycle('install');h.setPutFailure(true);
  assert.equal((await h.get(scope+'app.js')).status,200);
  h.setOpenFailure(true);assert.equal((await h.get(scope+'app.js')).status,200);
  const empty=workerHarness();empty.setOffline(true);
  assert.equal((await empty.get(scope,{mode:'navigate'})).status,503);
  assert.equal((await empty.get(scope+'app.js')).type,'error');
});
