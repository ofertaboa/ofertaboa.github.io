const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(ROOT,'assets','index-bdc0e7f9.js'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'assets','index-IvDGIQMY.css'),'utf8');

function count(t,needle){let n=0,i=0;while((i=t.indexOf(needle,i))>=0){n++;i+=needle.length;}return n;}

const needles=['data:image/','data:audio/','data:video/','.png','.jpg','.jpeg','.webp','.gif','.svg',
  '.mp3','.ogg','.wav','.m4a','.aac','.mp4','.webm','assets/','base64,','import.meta.glob',
  'new URL(','preload','AudioContext','new Audio(','fetch(','/files/','/storage/','/images/','/img/','/public/',
  'sprite','atlas','texturepacker','PIXI','phaser','canvas','game'];
console.log('--- contagens no JS ---');
for(const n of needles){const c=count(js,n);if(c)console.log(String(c).padStart(6)+'  '+n);}
console.log('--- contagens no CSS ---');
for(const n of ['url(','data:image/','assets/','.woff','.png']){const c=count(css,n);if(c)console.log(String(c).padStart(6)+'  '+n);}

// trechos em torno de ".png" (primeiros 25)
function ctx(t,needle,limit,wide){
  let out=[],i=0;
  while((i=t.indexOf(needle,i))>=0&&out.length<(limit||10)){
    out.push(t.slice(Math.max(0,i-wide||i-80), (i+needle.length)+(wide||80)));
    i+=needle.length;
  }
  return out;
}
console.log('\n--- contextos .png ---');
ctx(js,'.png',25,70).forEach((s,i)=>console.log('['+i+'] '+s.replace(/\n/g,' ')));
console.log('\n--- contextos assets/ ---');
ctx(js,'assets/',20,70).forEach((s,i)=>console.log('['+i+'] '+s.replace(/\n/g,' ')));
console.log('\n--- contextos data:image ---');
ctx(js,'data:image/',6,90).forEach((s,i)=>console.log('['+i+'] '+s.slice(0,220)));
