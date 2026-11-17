export const SLOTS = {body:'옷',eyes:'안경',head:'머리 장식'};
export const POSES = {auto:'자동',wave:'손인사',happy:'방긋',think:'갸웃',celebrate:'만세'};
export const COATS = {cream:'크림',ginger:'치즈 줄무늬',calico:'삼색 반점'};
export const WEARABLES = [
  {id:'cloud-pajamas',slot:'body',name:'민트 구름 잠옷',price:0},
  {id:'citron-raincoat',slot:'body',name:'레몬 우비',price:2},
  {id:'picnic-dress',slot:'body',name:'체리 체크 원피스',price:3},
  {id:'academy-blazer',slot:'body',name:'도서관 체크 재킷',price:3},
  {id:'lavender-tutu',slot:'body',name:'라일락 발레복',price:4},
  {id:'lunar-suit',slot:'body',name:'달 탐사 우주복',price:6},
  {id:'velvet-tux',slot:'body',name:'자정의 턱시도',price:5},
  {id:'mariniere',slot:'body',name:'항구의 줄무늬 티',price:0},
  {id:'baker-apron',slot:'body',name:'빵집 앞치마',price:2},
  {id:'denim',slot:'body',name:'데님 멜빵바지',price:3},
  {id:'rose-knit',slot:'body',name:'딸기 꽈배기 니트',price:3},
  {id:'star-cape',slot:'body',name:'한밤의 별 망토',price:6},
  {id:'blossom-glasses',slot:'eyes',name:'살구꽃 안경',price:2},
  {id:'starlight-glasses',slot:'eyes',name:'별사탕 선글라스',price:3},
  {id:'opera-monocle',slot:'eyes',name:'금빛 외알안경',price:3},
  {id:'silver-aviators',slot:'eyes',name:'파일럿 선글라스',price:4},
  {id:'round-glasses',slot:'eyes',name:'모카 동그리 안경',price:0},
  {id:'honey-glasses',slot:'eyes',name:'꿀빛 선글라스',price:2},
  {id:'heart-glasses',slot:'eyes',name:'체리 하트 안경',price:3},
  {id:'cat-glasses',slot:'eyes',name:'민트 캣아이 안경',price:3},
  {id:'lavender-pin',slot:'head',name:'라벤더 꽃핀',price:1},
  {id:'planet-pin',slot:'head',name:'토성 핀',price:2},
  {id:'butterfly-pin',slot:'head',name:'유리 나비 핀',price:3},
  {id:'pilot-goggles',slot:'head',name:'탐험가 고글',price:4},
  {id:'pearl-tiara',slot:'head',name:'진주 티아라',price:5},
  {id:'daisy-pin',slot:'head',name:'데이지 핀',price:0},
  {id:'velvet-bow',slot:'head',name:'자두 벨벳 리본',price:1},
  {id:'chef-hat',slot:'head',name:'구름 셰프 모자',price:3},
  {id:'cherry-pin',slot:'head',name:'쌍둥이 체리 핀',price:2},
  {id:'moon-crown',slot:'head',name:'초승달 왕관',price:5}
];
export const wearable = id => WEARABLES.find(item=>item.id===id);
export const defaultLook = () => ({coat:'cream',pose:'auto',body:null,eyes:null,head:null});
export const starters = WEARABLES.filter(item=>item.price===0).map(item=>item.id);
export function sanitizeLook(raw, owned) {
  const look=defaultLook();
  if(Object.hasOwn(COATS,raw?.coat))look.coat=raw.coat;
  if(Object.hasOwn(POSES,raw?.pose))look.pose=raw.pose;
  for(const slot of Object.keys(SLOTS)){
    const id=raw?.[slot];
    if(owned.has(id)&&wearable(id)?.slot===slot)look[slot]=id;
  }
  return look;
}

// 안경과 모자는 포즈별 얼굴 위치에 맞춘다. 옷은 네 포즈가 담긴 착용 이미지에 포함된다.
const defs='<linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#fff1b4"/><stop offset=".45" stop-color="#dfb858"/><stop offset="1" stop-color="#ab752f"/></linearGradient>';
const lenses=(shape,color,lens)=>`<path d="M-42 -7l9 3M-12 0q12-7 24 0M34-4l9-5" fill="none" stroke="${color}" stroke-width="2.2"/><g stroke="${color}" stroke-width="2.1" fill="${lens}">${[-24,24].map(x=>`<g transform="translate(${x})">${shape}</g>`).join('')}</g>`;
const art={
  'blossom-glasses':lenses(
    Array.from({length:8},(_,i)=>`<ellipse transform="rotate(${45*i})" cy="-11.4" rx="4.8" ry="4.3" fill="#f3b394" stroke="#b97861" stroke-width=".85"/>`).join('')+
    '<circle r="9.6" stroke="#b58b53" stroke-width="1.4" fill="#f9e0ab30"/><path d="m-6-3 4-4" fill="none" stroke="#fff9de" stroke-width="1.2"/>',
    '#af825e','none'),
  'starlight-glasses':lenses(
    '<path d="m0-14 4.3 7.8 8.8 1.7-6.1 6.7 1.1 8.9L0 7l-8.2 4.1 1.1-8.9-6.1-6.7 8.8-1.7Z"/><path d="m-8-4.2 5.7-.9 2.4-4.6" fill="none" stroke="#f5e3ff" stroke-width="1.2"/>',
    '#8165a5','#ae8cc877'),
  'opera-monocle':`<path d="M33 6q8 6 6 14t6 13" fill="none" stroke="#987447" stroke-width="1.8" stroke-dasharray="1.7 1.2"/>
    <ellipse cx="23" rx="12" ry="13" fill="#eee2ba26" stroke="#987447" stroke-width="3"/>
    <ellipse cx="23" cy="-.3" rx="11.7" ry="12.8" fill="none" stroke="url(#metal)" stroke-width="1.55"/>
    <path d="M14-4q1-4 5-6" stroke="#fff8df" stroke-width="1.6"/><circle cx="34.3" cy="5.2" r="1.9" fill="#e4c17a"/>`,
  'silver-aviators':`<defs><linearGradient id="smoke" x2="0" y2="1"><stop stop-color="#436575" stop-opacity=".86"/><stop offset="1" stop-color="#a4c9c4" stop-opacity=".56"/></linearGradient></defs>
    <path d="m-43-6 8 3m70-1 8-4M-11-3q11-8 22 0m-23-5q12-7 24 0" fill="none" stroke="#788b8d" stroke-width="2"/>
    ${[1,-1].map(sign=>`<g transform="scale(${sign} 1)"><path d="M-38-6q13-7 26-1 2 10-7 16-7 6-14 1-5-4-5-16Z" fill="url(#smoke)" stroke="#697d81" stroke-width="2.3"/><path d="M-35-5q9-4 18-3" stroke="#e2ece6" stroke-width="1.3"/><path d="m-31 0 5-3" stroke="#e7f4f0" stroke-width="1.4"/></g>`).join('')}`,
  'round-glasses':lenses('<circle r="12"/>','#644a40','#dfefee26'),
  'honey-glasses':lenses('<rect x="-12" y="-9" width="24" height="18" rx="7"/>','#bc8a47','#755232b8'),
  'heart-glasses':lenses('<path d="M0 10q-17-11-11-17 5-6 11 0 7-7 12-1 6 6-12 18Z"/>','#b6506c','#f4a2b755'),
  'cat-glasses':lenses('<path d="m-13-9 24 1q2 18-10 17-10 0-14-18Z"/>','#487f78','#a3d6c83d'),
  'lavender-pin':`<path d="M-8 15Q0 3 4-14m-9 27Q5 4 15-6" stroke="#637b5c" stroke-width="1.8"/>
    <path d="M-5 10Q-14 7-13 1q8 1 8 9m4-4q2-8 8-8Q7 4-1 6" fill="#91a57b"/>
    <g transform="rotate(16 4 -8)" fill="#b8a3d5" stroke="#8874a0" stroke-width=".65"><ellipse cx="4" cy="-15" rx="2.5" ry="3.9"/><ellipse cx="1" cy="-10" rx="2.7" ry="3.8"/><ellipse cx="6" cy="-7" rx="2.6" ry="3.6"/><ellipse cx="1" cy="-4" rx="2.4" ry="3.4"/></g>
    <g fill="#c7b7de" stroke="#9580aa" stroke-width=".65"><ellipse cx="15" cy="-7" rx="2.6" ry="3.8" transform="rotate(35 15 -7)"/><ellipse cx="11" cy="-4" rx="2.7" ry="3.4"/><ellipse cx="10" cy="0" rx="2.4" ry="3.1"/></g><path d="m-10 11 6 3" stroke="#d6b16d" stroke-width="2"/>`,
  'planet-pin':`<defs><radialGradient id="planet" cx=".3" cy=".25" r=".8"><stop stop-color="#ffcbb0"/><stop offset=".62" stop-color="#d88491"/><stop offset="1" stop-color="#935b79"/></radialGradient></defs>
    <g transform="rotate(-22)"><ellipse rx="19" ry="6" fill="none" stroke="#b58a4b" stroke-width="2.8"/><circle cy="-.5" r="10.6" fill="url(#planet)" stroke="#946578"/><path d="M-18-1q-2 6 17 6t20-6" fill="none" stroke="#f1cf81" stroke-width="2.5"/><path d="M-7-5q2-3 5-3" stroke="#ffe5c8" stroke-width="1.5"/></g>
    <path d="m16-13 1.3 3.5 3.4 1.2-3.4 1.2-1.3 3.4-1.1-3.4-3.3-1.2 3.3-1.2Z" fill="#edcc81"/>`,
  'butterfly-pin':`<defs><linearGradient id="wing" x2=".8" y2="1"><stop stop-color="#d1e8d9"/><stop offset=".5" stop-color="#9bc8cd"/><stop offset="1" stop-color="#ae99cf"/></linearGradient></defs>
    ${[1,-1].map(sign=>`<g transform="scale(${sign} 1)"><path d="M1 1Q11-17 19-13q5 8-8 16 11-1 8 5-7 11-18-4Z" fill="url(#wing)" stroke="#7d829b" stroke-width="1.2"/><path d="M3 1q8-8 13-10M3 3q9 0 12 5" stroke="#f2e9db" stroke-width=".9"/><circle cx="14" cy="-7" r="1.5" fill="#f7e9dd"/></g>`).join('')}
    <path d="M0 0q-1-7-5-8m5 8q1-7 5-8" stroke="#8d795b" stroke-width="1"/><ellipse cy="2" rx="2.2" ry="6.4" fill="url(#metal)" stroke="#95825b" stroke-width=".65"/>`,
  'pilot-goggles':`<path d="M-36-3q27-11 71-3l1 7q-41-6-70 4Z" fill="#795945" stroke="#59483f" stroke-width="1.2"/>
    ${[-16,14].map(x=>`<g transform="translate(${x} 0)"><rect x="-12" y="-8.5" width="25" height="17" rx="6" fill="url(#metal)" stroke="#806244" stroke-width="1.8"/><rect x="-9" y="-6" width="19" height="12" rx="4" fill="#789ca4" stroke="#555c51"/><path d="m-6 1 5-4m0 6 7-6" stroke="#d4e9dc" stroke-width="1.6"/></g>`).join('')}
    <path d="M-3-1q3-4 6 0" stroke="#d9b77a" stroke-width="2"/>`,
  'pearl-tiara':`<defs><radialGradient id="pearl" cx=".3" cy=".22" r=".8"><stop stop-color="#fffdf3"/><stop offset=".58" stop-color="#f3dfd5"/><stop offset="1" stop-color="#bd9fa8"/></radialGradient></defs>
    <path d="M-26 7q25 9 51-2M-24 6q5-14 11-3 6-16 12-2 8-20 15-3 10-13 10 5" fill="none" stroke="#bd985e" stroke-width="1.6"/>
    ${[[-24,3,2.8],[-14,-4,3.4],[-1,-11,4.3],[12,-6,3.6],[23,0,2.7]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#pearl)" stroke="#b09a86" stroke-width=".7"/>`).join('')}
    <path d="m-2 0 3-5 3 4-3 4Z" fill="#bd9dcf" stroke="#987caa" stroke-width=".65"/>`,
  'daisy-pin':Array.from({length:8},(_,i)=>`<ellipse transform="rotate(${i*45})" cy="-5.8" rx="3.3" ry="5.4" fill="#fff8dc" stroke="#d9cbae" stroke-width=".6"/>`).join('')+'<circle r="4.1" fill="#e3b34e"/>',
  'velvet-bow':'<path d="m-1 2-6 14-4-4-4 1 9-14m9 2 9 10-5 1-2 5-8-14" fill="#9f5372"/><path d="M-1-2q-27-18-22-1-4 18 22 5m2-4q28-18 22 0 3 15-22 5Z" fill="#b46886" stroke="#844461"/><path d="m-17-4 12 5m20-5L5 1" stroke="#d398aa" stroke-width="1.5"/><rect x="-4" y="-4" width="8" height="9" rx="3" fill="#92516f"/>',
  'chef-hat':'<path d="M-19 1q-15-4-12-16 3-11 16-10 4-12 17-10 10 0 14 9 14-4 19 8 6 11-9 18l-2 14-44 1Z" fill="#fff5df" stroke="#bea88b" stroke-width="1.3"/><path d="m-20 3 45-2-2 12-42 2Z" fill="#f3e6d1" stroke="#c5b197"/><path d="m-11-14 4 14m8-19v18m13-14-3 13" stroke="#ddcbb0" fill="none" stroke-width="1.8"/>',
  'cherry-pin':'<path d="M-8 7Q1 1 3-9q0 12 8 16" stroke="#667849" fill="none" stroke-width="2"/><path d="M3-9q-12-8-16-2 7 5 16 2" fill="#839767"/><circle cx="-8" cy="8" r="6" fill="#b45961"/><circle cx="10" cy="9" r="6.5" fill="#d87576"/><path d="m-10 5 2-1m16 2 2-1" stroke="#ffd9c7" stroke-width="1.5"/>',
  'moon-crown':'<path d="m-24-8 10 7 8-12 8 12 11-10 1 13 12-5-4 15q-22 6-44 0Z" fill="url(#metal)" stroke="#a58042"/><path d="M-20 8q20 5 40-1" fill="none" stroke="#fff0be"/><path d="M7-23q-10 3-4 12 5 6 12 1-4 9-13 7-12-3-9-13 2-7 14-7Z" fill="#ffe4a2" stroke="#c49855"/><circle cy="3" r="2.4" fill="#aa829d"/>'
};
const anchors={
  wave:{eyes:[109,74,-10],head:[94,31,-13]},
  happy:{eyes:[107,74,-10],head:[93,31,-12]},
  think:{eyes:[108,73,-18],head:[86,31,-22]},
  celebrate:{eyes:[103,71,-11],head:[88,31,-12]}
};
const boxes={eyes:'-45 -17 90 34',head:'-26 -26 52 53'};
const thumbnailBoxes={
  'chef-hat':'-35 -37 72 55','pilot-goggles':'-39 -13 78 28',
  'opera-monocle':'7 -16 44 54','pearl-tiara':'-30 -19 60 33'
};
const svgURL=(box,content)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="${box}" fill="none" stroke-linejoin="round" stroke-linecap="round"><defs>${defs}</defs>${content}</svg>`);
const outfitAsset = (id,suffix='') => new URL(`./assets/lou-outfits/${id}${suffix}.webp`,import.meta.url).href;
const baseSprite = new URL('./assets/lou-sprites-v2.webp',import.meta.url).href;
export function avatarSprite(look) {
  return wearable(look?.body)?.slot==='body'?outfitAsset(look.body):baseSprite;
}
const thumbs=new Map(WEARABLES.map(item=>[item.id,item.slot==='body'?outfitAsset(item.id,'-thumb'):svgURL(thumbnailBoxes[item.id]||boxes[item.slot],art[item.id])]));
export const clothingImage=id=>thumbs.get(id);
export const poseFor=(look,mood)=>anchors[look?.pose]?look.pose:({complete:'celebrate',correct:'happy',wrong:'think',revealed:'think'}[mood]||'wave');
const layerCache=new Map();
function coatLayer(coat,pose) {
  const key=coat+'/'+pose;
  if(!layerCache.has(key)){
    const [x,y,a]=anchors[pose].eyes;
    const ginger='<g fill="#c79260"><path d="M-23-29q4-6 11-5l4 18q-7-4-15-13m17-7 10-1-2 18q-5-5-8-17m17 0 10 2q-2 11-12 16Z"/><path d="m-52 6 16 5q-10 3-16 0m0 5 14 2q-4 4-13 4m90-15-13 6q9 2 13-1m0 6-12 3q7 3 11 1"/></g>';
    const calico='<path d="M-40-21q7-15 22-16 9-2 11 5 4 8-3 15-8 5-18 5-15 3-12-9Z" fill="#856c60"/><path d="M7-28q4-9 13-7 16 3 19 14 2 8-5 8-11 2-13-3-5-5-11-3-6-3-3-9Z" fill="#ca925e"/><path d="M-49 10q6-6 13-1 6 4 3 9-6 5-12 0-4-3-4-8Z" fill="#ce9b70"/>';
    const content=`<defs><filter id="soft" x="-12%" y="-20%" width="125%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter></defs><g transform="translate(${x} ${y}) rotate(${a})" filter="url(#soft)" opacity=".82">${coat==='ginger'?ginger:calico}</g>`;
    layerCache.set(key,svgURL('0 0 200 200',content));
  }
  return {id:coat,coat:true,src:layerCache.get(key)};
}
export function lookLayers(look,pose) {
  const clothes=['eyes','head'].flatMap(slot=>{
    const id=look?.[slot];if(wearable(id)?.slot!==slot)return [];
    const key=id+'/'+pose;
    if(!layerCache.has(key)){
      const [x,y,angle]=anchors[pose][slot];
      const at=slot==='head'&&id==='chef-hat'?'translate(0 0) scale(.83)':slot==='head'&&id.endsWith('-pin')?'translate(13 1)':'';
      const layer=`<g transform="translate(${x} ${y}) rotate(${angle}) ${at}">${art[id]}</g>`;
      layerCache.set(key,svgURL('0 0 200 200',layer));
    }
    return [{id,src:layerCache.get(key)}];
  });
  return look?.coat&&look.coat!=='cream'&&Object.hasOwn(COATS,look.coat)?[coatLayer(look.coat,pose),...clothes]:clothes;
}
export function renderAvatar(look,mood='wave') {
  const pose=poseFor(look,mood),sprite=avatarSprite(look);
  const dressed=sprite===baseSprite?'':` data-worn="${look.body}" style="background-image:url('${sprite}')"`;
  return `<span class="lou-avatar mascot${mood==='correct'||mood==='complete'?` mascot-${mood}`:''} lou-${pose}" data-pose="${pose}"${dressed} aria-hidden="true">${lookLayers(look,pose).map(layer=>`<img src="${layer.src}" ${layer.coat?'data-coat':'data-worn'}="${layer.id}" alt="" draggable="false">`).join('')}</span>`;
}
