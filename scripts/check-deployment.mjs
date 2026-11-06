/* Run after GitHub Pages publication; verify the public files used for installation. */
const base = new URL(process.env.APP_URL || process.argv[2] || 'https://sidebatch.github.io/french-alone/');
const ensure = (condition,message) => { if (!condition) throw new Error(message); };
async function get(path) {
  const url = new URL(path,base);
  const response = await fetch(url,{headers:{'Cache-Control':'no-cache'}});
  ensure(response.ok,'Public asset returned '+response.status+': '+url.href);
  return response;
}
function u32(bytes,offset) { return ((bytes[offset]*0x1000000)+(bytes[offset+1]<<16)+(bytes[offset+2]<<8)+bytes[offset+3])>>>0; }
async function check() {
  const html = await (await get('./')).text();
  ensure(html.includes('id="install-app"') && html.includes('rel="manifest"'),'Installation controls or manifest link missing from the public app');
  const manifest = await (await get('./manifest.webmanifest')).json();
  ensure(manifest.display==='standalone','Standalone display missing');
  ensure(new URL(manifest.scope,base).href===base.href,'Manifest scope must stay inside this repository');
  ensure(new URL(manifest.start_url,base).href.startsWith(base.href),'Start URL escaped the app scope');
  for (const size of [192,512]) {
    const icon = manifest.icons.find(item=>item.sizes===size+'x'+size);
    ensure(icon && icon.type==='image/png','Required install icon missing: '+size);
    const bytes = new Uint8Array(await (await get(icon.src)).arrayBuffer());
    ensure(bytes[0]===137 && bytes[1]===80 && bytes[2]===78 && bytes[3]===71,'Invalid public PNG icon');
    ensure(u32(bytes,16)===size && u32(bytes,20)===size,'Public install icon has the wrong dimensions');
  }
  const paths=['./app.js','./core.js','./data.js','./practice.js','./practice-core.js','./practice-data.js','./style.css','./pwa.css','./product.css','./pwa.js','./sw.js','./icons/apple-touch-icon.png'];
  await Promise.all(paths.map(path=>get(path)));
  console.log('Public PWA verified: '+base.href+' · manifest, icons and all lesson/offline files are reachable');
}
(async () => {
  let error;
  for(let attempt=0;attempt<4;attempt++){
    try { await check(); return; } catch(e) {error=e;if(attempt<3)await new Promise(resolve=>setTimeout(resolve,2000));}
  }
  throw error;
})().catch(error=>{console.error(error.message);process.exitCode=1;});
