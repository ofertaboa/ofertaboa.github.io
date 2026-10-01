// Extrai referencias de assets e rotas do bundle Vite/React.
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(ROOT,'assets','index-bdc0e7f9.js'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'assets','index-IvDGIQMY.css'),'utf8');

const EXT='png|jpe?g|gif|svg|ico|webp|bmp|avif|mp4|webm|woff2?|ttf|otf|mp3|ogg|wav|m4a|aac|json|webmanifest|txt|xml|js|css|html|map|br';
const Q="\"'`";
const re=new RegExp('(['+Q+'])(/[^'+Q+'\\s<>)]*?\\.(?:'+EXT+')(?:\\?[^'+Q+'\\s<>)]*)?)\\1','g');

function scan(name,t){
  const s=new Set();let m;const r=new RegExp(re.source,'g');
  while((m=r.exec(t)))s.add(m[2]);
  console.log('=== '+name+' -> '+s.size+' literais raiz-absolutos');
  [...s].sort().forEach(x=>console.log('  '+x));
  return s;
}
const a=scan('js',js); const b=scan('css',css);

// assets com caminho relativo (Vite: "assets/x.png")
const rel=new Set(); let m;
const relre=new RegExp('(['+Q+'])((?:\\.?\\.?/)?assets/[^'+Q+'\\s<>)]*?)\\1','g');
while((m=relre.exec(js)))rel.add(m[2]);
console.log('=== js relativos -> '+rel.size);
[...rel].sort().slice(0,60).forEach(x=>console.log('  '+x));

// rotas do router
const routes=new Set();
for(const re2 of [/path:\s*(['"`])([^'"`]+)\1/g,/to:\s*(['"`])([^'"`]+)\2/g,/(?:index|path)\s*=\s*(['"`])(\/[^'"`]+)\1/g]){
  let r=new RegExp(re2.source,'g'); while((m=r.exec(js))) routes.add(m[2]);
}
console.log('=== rotas ===');
[...routes].sort().forEach(x=>console.log('  '+x));

// strings parecidas com endpoints de API
const api=new Set();
const apire=/(["'`])(\/(?:api|gerente|admin)[^"'`\s<>)]*)\1/g;
while((m=apire.exec(js)))api.add(m[2]);
console.log('=== api/rotas no bundle ===');
[...api].sort().forEach(x=>console.log('  '+x));

fs.writeFileSync(path.join(__dirname,'extract.out.json'),
  JSON.stringify({abs:[...a],rel:[...rel],routes:[...routes],api:[...api]},null,1));
