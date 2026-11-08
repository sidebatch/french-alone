import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function makeIconPNG(size) {
  function u32(n) { return new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]); }
  function join(arrays) {const out=new Uint8Array(arrays.reduce((n,a)=>n+a.length,0));let i=0;for(const a of arrays){out.set(a,i);i+=a.length;}return out;}
  const crcTable = Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
  function chunk(type,data){const name=new Uint8Array([...type].map(c=>c.charCodeAt(0))),both=join([name,data]);let crc=0xffffffff;for(const b of both)crc=crcTable[(crc^b)&255]^(crc>>>8);return join([u32(data.length),both,u32((crc^0xffffffff)>>>0)]);}
  const palette=[],indices=new Map(),raw=new Uint8Array((size+1)*size);
  function colorAt(x,y){
    if(Math.sqrt(Math.abs(x-45))+Math.sqrt(Math.abs(y-17))<=Math.sqrt(7))return [217,171,119];
    const stem=x>=26&&x<=34&&y>=24&&y<=50;
    const crossbar=x>=20&&x<=43&&y>=29&&y<=36;
    const bend=y<=25&&x<=38&&(x-38)**2+(y-25)**2<=144&&(x-38)**2+(y-25)**2>=16;
    const top=x>=37&&x<=45&&y>=13&&y<=21;
    return stem||crossbar||bend||top?[255,249,233]:[61,98,77];
  }
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const rgb=[0,0,0];
    for(const dy of [.25,.75])for(const dx of [.25,.75]){const c=colorAt((x+dx)*64/size,(y+dy)*64/size);for(let j=0;j<3;j++)rgb[j]+=c[j];}
    const values=rgb.map(v=>Math.round(v/4)),key=values.join(',');
    if(!indices.has(key)){indices.set(key,palette.length/3);palette.push(...values);}
    raw[y*(size+1)+1+x]=indices.get(key);
  }
  if(palette.length>768)throw Error('Icon palette too large');
  const compressed=[];let bits=0,count=0;
  function emit(value,length){bits|=value<<count;count+=length;while(count>=8){compressed.push(bits&255);bits>>>=8;count-=8;}}
  function symbol(value){let code,length;if(value<=143){code=0x30+value;length=8;}else if(value<=255){code=0x190+value-144;length=9;}else if(value<=279){code=value-256;length=7;}else{code=0xc0+value-280;length=8;}let reversed=0;for(let i=0;i<length;i++){reversed=(reversed<<1)|(code&1);code>>>=1;}emit(reversed,length);}
  const bases=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const extras=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  emit(3,3);
  let i=0;
  while(i<raw.length){
    const value=raw[i++];symbol(value);
    let run=0;while(i+run<raw.length&&raw[i+run]===value)run++;
    while(run>=3){const length=Math.min(258,run);let index=bases.length-1;while(bases[index]>length)index--;symbol(257+index);emit(length-bases[index],extras[index]);emit(0,5);i+=length;run-=length;}
    while(run-->0)symbol(raw[i++]);
  }
  symbol(256);if(count)compressed.push(bits&255);
  let a=1,b=0;for(const value of raw){a=(a+value)%65521;b=(b+a)%65521;}
  const zlib=join([new Uint8Array([0x78,0x01]),new Uint8Array(compressed),u32(((b<<16)|a)>>>0)]);
  const ihdr=join([u32(size),u32(size),new Uint8Array([8,3,0,0,0])]);
  return join([new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('PLTE',new Uint8Array(palette)),chunk('IDAT',zlib),chunk('IEND',new Uint8Array())]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = new URL('../dist/icons/', import.meta.url);
  mkdirSync(fileURLToPath(dir), {recursive:true});
  for (const size of [192,512,180]) {
    const name = size === 180 ? 'apple-touch-icon.png' : 'icon-' + size + '.png';
    writeFileSync(new URL(name,dir), makeIconPNG(size));
  }
}
