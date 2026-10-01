const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(ROOT,'assets','index-bdc0e7f9.js'),'utf8');
const needles=['/rest/v1/','/functions/v1/','/storage/v1/','/auth/v1/','from("','rpc(','storage.from('];
function all(t,n){const o=[];let i=0;while((i=t.indexOf(n,i))>=0){o.push(i);i+=n.length;}return o;}
for(const n of needles){
  const idx=all(js,n);
  console.log('\n=== '+n+' ('+idx.length+') ===');
  idx.slice(0,40).forEach(i=>console.log('  ...'+js.slice(Math.max(0,i-60),i+n.length+70).replace(/\n/g,' ')));
}
// tabelas supabase
const tabs=new Set(); let m;
const re=/\.from\(\s*["'`]([a-z0-9_]+)["'`]/g;
while((m=re.exec(js)))tabs.add(m[1]);
console.log('\n=== tabelas .from(...) ==='); [...tabs].sort().forEach(x=>console.log('  '+x));
const re2=/from\(["'`]([a-z0-9_]+)["'`]\)/g; while((m=re2.exec(js)))tabs.add(m[1]);
console.log('=== tabelas (2) ==='); [...tabs].sort().forEach(x=>console.log('  '+x));
