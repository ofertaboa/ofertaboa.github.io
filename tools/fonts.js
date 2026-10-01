// Limpa arquivos que sao o fallback SPA (3981 bytes = index.html) e baixa os que faltam.
const {spawnSync}=require('child_process');
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const ORIGIN='https://pinguim-surfers.paineldemonstrativo.com.br';
const UA='Mozilla/5.0';
const FALLBACK=fs.existsSync(path.join(ROOT,'index.html'))?fs.statSync(path.join(ROOT,'index.html')).size:0;

/* 1) limpa */
let rem=0;
(function walk(d){
  for(const f of fs.readdirSync(d,{withFileTypes:true})){
    const p=path.join(d,f.name);
    if(f.isDirectory()){walk(p);continue;}
    if(f.name==='index.html')continue;
    if(FALLBACK&&fs.statSync(p).size===FALLBACK){fs.unlinkSync(p);rem++;}
  }
})(ROOT);
console.log('removidos (fallback SPA): '+rem);

/* 2) lista real dos que existem no origem */
const L=['/vendor/fonts/codepoint-index/plane0/0-ff.json','/vendor/fonts/font-meta/latin.json'];
for(const fam of ['sans-serif','serif','monospace'])
  for(let w=100;w<=900;w+=100)
    L.push('/vendor/fonts/font-files/latin/'+fam+'.normal.'+w+'.woff');

let ok=0,bad=0;
for(const u of L){
  const dest=path.join(ROOT,u.replace(/^\//,''));
  if(fs.existsSync(dest)&&fs.statSync(dest).size!==FALLBACK){ok++;continue;}
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  const r=spawnSync('curl.exe',['-sS','--fail','--max-time','120','-A',UA,'-o',dest,ORIGIN+u],{encoding:'utf8'});
  if(r.status===0&&fs.existsSync(dest)&&fs.statSync(dest).size!==FALLBACK){ok++;console.log('ok   '+u+'  '+fs.statSync(dest).size);}
  else{bad++;console.log('FAIL '+u);if(fs.existsSync(dest))fs.unlinkSync(dest);}
}
console.log('baixados/ok='+ok+' falhas='+bad);
