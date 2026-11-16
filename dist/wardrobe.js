export const SLOTS = {body:'옷',eyes:'안경',head:'머리 장식'};
export const POSES = {auto:'자동',wave:'손인사',happy:'방긋',think:'갸웃',celebrate:'만세'};
export const COATS = {cream:'크림',ginger:'치즈 줄무늬',calico:'삼색 반점'};
export const WEARABLES = [
  {id:'mariniere',slot:'body',name:'항구의 줄무늬 티',price:0},
  {id:'baker-apron',slot:'body',name:'빵집 앞치마',price:2},
  {id:'denim',slot:'body',name:'데님 멜빵바지',price:3},
  {id:'rose-knit',slot:'body',name:'딸기 꽈배기 니트',price:3},
  {id:'star-cape',slot:'body',name:'한밤의 별 망토',price:6},
  {id:'round-glasses',slot:'eyes',name:'모카 동그리 안경',price:0},
  {id:'honey-glasses',slot:'eyes',name:'꿀빛 선글라스',price:2},
  {id:'heart-glasses',slot:'eyes',name:'체리 하트 안경',price:3},
  {id:'cat-glasses',slot:'eyes',name:'민트 캣아이 안경',price:3},
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

// Artwork uses local coordinates around the neckline, eye bridge or beret.
const stitch='stroke="#fff5dd" stroke-width=".7" stroke-dasharray="1.4 1.5" fill="none"';
const shirt='M-24 0 Q-20 -3 -15 -3 Q-2 4 12 -4 Q21 -5 26 -1 Q31 8 30 17 Q33 32 31 42 Q30 48 3 49 Q-17 49 -28 45 Q-32 41 -28 21 Q-30 7 -24 0Z';
const star='m0 -3 .9 1.9 2.1.3 -1.5 1.5.4 2.1L0 1.8l-1.9 1 .4-2.1L-3-.8l2.1-.3Z';
const defs=`<linearGradient id="fabric" x2=".85" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#fff7de" stop-opacity=".25"/><stop offset=".46" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#35283d" stop-opacity=".23"/></linearGradient><linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#fff1b4"/><stop offset=".45" stop-color="#dfb858"/><stop offset="1" stop-color="#ab752f"/></linearGradient><clipPath id="shirt"><path d="${shirt}"/></clipPath>`;
const shirtArt=(color,detail)=>`<path d="${shirt}" fill="${color}" stroke="#8b7765" stroke-width=".7"/><g clip-path="url(#shirt)">${detail}<path d="${shirt}" fill="url(#fabric)"/><path d="M-16-2q15 8 29-1M-27 43q28 9 56 0" fill="none" stroke="#aa9a82" stroke-width="1.1"/></g>`;
const lenses=(shape,color,lens)=>`<path d="M-42 -7l9 3M-12 0q12-7 24 0M34-4l9-5" fill="none" stroke="${color}" stroke-width="2.2"/><g stroke="${color}" stroke-width="2.1" fill="${lens}">${[-24,24].map(x=>`<g transform="translate(${x})">${shape}</g>`).join('')}</g>`;
const art={
  mariniere:shirtArt('#f6edda',Array.from({length:6},(_,i)=>`<path d="M-32 ${5+i*8}q31 6 71 -2" stroke="#456179" stroke-width="3.2" fill="none"/>`).join('')),
  'baker-apron':'<path d="M-17 -2q14-9 30-2l4 17 9 10 4 24q-24 9-56 0l3-25 8-10Z" fill="#d3a979" stroke="#967149"/><path d="M-14 2q12 5 24-1l3 12q-15 6-29 0Z" fill="#f5e0b4"/><path d="M-14 26h29v10q-15 14-29 0Z" fill="#edc89b" stroke="#b58961"/><path d="m-10 31 21 0" '+stitch+'/><path d="M-24 45q26 7 50-1" '+stitch+'/>',
  denim:shirtArt('#7896a3','<path d="M-34-4h68v23l-12-4-5-18-5 2 3 15-24 1 2-16-7-1-4 19-14 5Z" fill="#f2d4b6"/><path d="M-11 18h26v10q-14 12-26-1Z" fill="#91acb4" stroke="#587683"/><circle cx="-17" cy="14" r="1.8" fill="#e0b456"/><circle cx="18" cy="13" r="1.8" fill="#e0b456"/><path d="M2 38v13M-23 40l8-6M26 39l-8-6" '+stitch+'/>'),
  'rose-knit':shirtArt('#d294a0','<path d="M-30 0q32 12 64-1M-32 44q33 9 67-2" stroke="#b47486" stroke-width="5" fill="none"/>'+[-20,-7,6,19].map(x=>`<path d="M${x} 8q-6 4 0 8t0 8 0 8 0 8m0-32q6 4 0 8t0 8 0 8 0 8" fill="none" stroke="#f0b9c0" stroke-width="1.8"/>`).join('')),
  'star-cape':'<path d="M-23-2q20 8 43-2 3 21 18 45-20-2-30 5l-7-32-8 34q-18-8-34-3 12-21 18-47Z" fill="#4e5279" stroke="#3d405f"/><path d="M-24 0q20 10 44-2M-38 42q16-6 30 3m18-2q13-8 26-4" fill="none" stroke="#d8b86b" stroke-width="1.6"/><circle cx="0" cy="8" r="3.5" fill="url(#metal)"/>'+[[-19,17],[21,27],[-27,33],[16,12]].map(([x,y])=>`<path transform="translate(${x} ${y})" d="${star}" fill="#f2d590"/>`).join(''),
  'round-glasses':lenses('<circle r="12"/>','#644a40','#dfefee26'),
  'honey-glasses':lenses('<rect x="-12" y="-9" width="24" height="18" rx="7"/>','#bc8a47','#755232b8'),
  'heart-glasses':lenses('<path d="M0 10q-17-11-11-17 5-6 11 0 7-7 12-1 6 6-12 18Z"/>','#b6506c','#f4a2b755'),
  'cat-glasses':lenses('<path d="m-13-9 24 1q2 18-10 17-10 0-14-18Z"/>','#487f78','#a3d6c83d'),
  'daisy-pin':Array.from({length:8},(_,i)=>`<ellipse transform="rotate(${i*45})" cy="-5.8" rx="3.3" ry="5.4" fill="#fff8dc" stroke="#d9cbae" stroke-width=".6"/>`).join('')+'<circle r="4.1" fill="#e3b34e"/>',
  'velvet-bow':'<path d="m-1 2-6 14-4-4-4 1 9-14m9 2 9 10-5 1-2 5-8-14" fill="#9f5372"/><path d="M-1-2q-27-18-22-1-4 18 22 5m2-4q28-18 22 0 3 15-22 5Z" fill="#b46886" stroke="#844461"/><path d="m-17-4 12 5m20-5L5 1" stroke="#d398aa" stroke-width="1.5"/><rect x="-4" y="-4" width="8" height="9" rx="3" fill="#92516f"/>',
  'chef-hat':'<path d="M-19 1q-15-4-12-16 3-11 16-10 4-12 17-10 10 0 14 9 14-4 19 8 6 11-9 18l-2 14-44 1Z" fill="#fff5df" stroke="#bea88b" stroke-width="1.3"/><path d="m-20 3 45-2-2 12-42 2Z" fill="#f3e6d1" stroke="#c5b197"/><path d="m-11-14 4 14m8-19v18m13-14-3 13" stroke="#ddcbb0" fill="none" stroke-width="1.8"/>',
  'cherry-pin':'<path d="M-8 7Q1 1 3-9q0 12 8 16" stroke="#667849" fill="none" stroke-width="2"/><path d="M3-9q-12-8-16-2 7 5 16 2" fill="#839767"/><circle cx="-8" cy="8" r="6" fill="#b45961"/><circle cx="10" cy="9" r="6.5" fill="#d87576"/><path d="m-10 5 2-1m16 2 2-1" stroke="#ffd9c7" stroke-width="1.5"/>',
  'moon-crown':'<path d="m-24-8 10 7 8-12 8 12 11-10 1 13 12-5-4 15q-22 6-44 0Z" fill="url(#metal)" stroke="#a58042"/><path d="M-20 8q20 5 40-1" fill="none" stroke="#fff0be"/><path d="M7-23q-10 3-4 12 5 6 12 1-4 9-13 7-12-3-9-13 2-7 14-7Z" fill="#ffe4a2" stroke="#c49855"/><circle cy="3" r="2.4" fill="#aa829d"/>'
};
const anchors={
  wave:{body:[104,118,-5],eyes:[109,74,-10],head:[94,31,-13]},
  happy:{body:[104,118,-3],eyes:[107,74,-10],head:[93,31,-12]},
  think:{body:[105,119,-10],eyes:[108,73,-18],head:[86,31,-22]},
  celebrate:{body:[103,116,-5],eyes:[103,71,-11],head:[88,31,-12]}
};
// Keep the plush paws in front of worn clothes when the pose crosses the torso.
const paws={
  wave:'<ellipse cx="67" cy="139" rx="10" ry="16" transform="rotate(16 67 139)"/>',
  happy:'<ellipse cx="94" cy="119" rx="10" ry="18" transform="rotate(32 94 119)"/><ellipse cx="119" cy="118" rx="10" ry="18" transform="rotate(-26 119 118)"/>',
  think:'<path d="M72 111q-4 19 1 24 10 10 21-7l2-14Z"/>',celebrate:''
};
const boxes={body:'-43 -9 88 63',eyes:'-45 -17 90 34',head:'-26 -26 52 53'};
const svgURL=(box,content)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="${box}" fill="none" stroke-linejoin="round" stroke-linecap="round"><defs>${defs}</defs>${content}</svg>`);
const thumbs=new Map(WEARABLES.map(item=>[item.id,svgURL(item.id==='chef-hat'?'-35 -37 72 55':boxes[item.slot],art[item.id])]));
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
  const clothes=Object.keys(SLOTS).flatMap(slot=>{
    const id=look?.[slot];if(wearable(id)?.slot!==slot)return [];
    const key=id+'/'+pose;
    if(!layerCache.has(key)){
      const [x,y,angle]=anchors[pose][slot];
      const mask=slot==='body'?`<defs><mask id="paws"><rect width="200" height="200" fill="white"/><g fill="black">${paws[pose]}</g></mask></defs>`:'';
      const at=slot==='head'&&id==='chef-hat'?'translate(0 0) scale(.83)':slot==='head'&&id.endsWith('-pin')?'translate(13 1)':'';
      const layer=`${mask}<g ${mask?'mask="url(#paws)"':''}><g transform="translate(${x} ${y}) rotate(${angle}) ${at}">${art[id]}</g></g>`;
      layerCache.set(key,svgURL('0 0 200 200',layer));
    }
    return [{id,src:layerCache.get(key)}];
  });
  return look?.coat&&look.coat!=='cream'&&Object.hasOwn(COATS,look.coat)?[coatLayer(look.coat,pose),...clothes]:clothes;
}
export function renderAvatar(look,mood='wave') {
  const pose=poseFor(look,mood);
  return `<span class="lou-avatar mascot lou-${pose}" data-pose="${pose}" aria-hidden="true">${lookLayers(look,pose).map(layer=>`<img src="${layer.src}" ${layer.coat?'data-coat':'data-worn'}="${layer.id}" alt="" draggable="false">`).join('')}</span>`;
}
