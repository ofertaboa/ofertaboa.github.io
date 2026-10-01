const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(ROOT,'assets','index-bdc0e7f9.js'),'utf8');

function show(needle,wide,n){
  let i=0,c=0;
  while((i=js.indexOf(needle,i))>=0&&c<(n||3)){
    console.log('\n=== '+needle+' @'+i+' ===');
    console.log(js.slice(Math.max(0,i-wide),i+wide).replace(/\n/g,' '));
    i+=needle.length;c++;
  }
  if(!c)console.log('\n=== '+needle+' [NAO] ===');
}
show('/vendor/fonts',700,2);
show('.hdr',400,2);
show('vendor/fonts',100,1);

// nomes de fonte possiveis
const fonts=new Set();
const fre=/(['"`])([^'"`\s]+?\.woff2?)\1/g;let m;
while((m=fre.exec(js)))fonts.add(m[2]);
console.log('\n=== woff2 literais ===');[...fonts].sort().forEach(x=>console.log('  '+x));

// rotas de musica/som vindo do banco
const sre=/(['"`])([a-z_]*(?:music|sound|sfx|audio)[a-z_]*_url)\1/g;const snd=new Set();
while((m=snd===null?null:null)){}
const sr=new RegExp(sre.source,'g');const s2=new Set();
while((m=sr.exec(js)))s2.add(m[2]);
console.log('\n=== campos *_sound_url / *_music_url ===');[...s2].sort().forEach(x=>console.log('  '+x));

// supabase url / endpoints
const supa=js.match(/https:\/\/[a-z0-9]+\.supabase\.[a-z]+/g);
console.log('\n=== supabase hosts ==='); console.log([...new Set(supa||[])].join('\n')||'(nenhum literal)');

const hosts=new Set(); const hr=/https:\/\/[a-zA-Z0-9.-]+\.[a-z]{2,}/g;
while((m=hr.exec(js)))hosts.add(m[0]);
console.log('\n=== hosts no bundle ===');[...hosts].sort().forEach(x=>console.log('  '+x));
