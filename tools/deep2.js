const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(ROOT,'assets','index-bdc0e7f9.js'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'assets','index-IvDGIQMY.css'),'utf8');

function ctx(t,needle,limit,wide){
  const out=[];let i=0;
  while((i=t.indexOf(needle,i))>=0&&out.length<limit){
    out.push(t.slice(Math.max(0,i-wide),(i+needle.length)+wide));
    i+=needle.length;
  }
  return out;
}

console.log('=== new URL( ===');
ctx(js,'new URL(',40,90).forEach((s,i)=>console.log('['+i+'] '+s.replace(/\n/g,' ')));

console.log('\n=== .webm ===');
ctx(js,'.webm',10,160).forEach((s,i)=>console.log('['+i+'] '+s.replace(/\n/g,' ')));

console.log('\n=== /vendor/ ===');
ctx(js,'/vendor/',20,120).forEach((s,i)=>console.log('['+i+'] '+s.replace(/\n/g,' ')));

console.log('\n=== css: @font-face='+(css.indexOf('@font-face'))+' url('+(css.indexOf('url('))+' assets='+(css.indexOf('assets')));

console.log('\n=== font-family no css ===');
ctx(css,'font-family',6,140).forEach((s,i)=>console.log('['+i+'] '+s.replace(/\n/g,' ')));

console.log('\n=== preload no js ===');
ctx(js,'preload',17,90).forEach((s,i)=>console.log('['+i+'] '+s.replace(/\n/g,' ')));
