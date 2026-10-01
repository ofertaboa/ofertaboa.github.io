// Baixa e monta o espelho estatico em <base> (raiz).
// Uso: node tools\mirror.js
const {spawnSync}=require('child_process');
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');

const ORIGIN='https://pinguim-surfers.paineldemonstrativo.com.br';
const SOUNDS='https://prod.queminvestecresce.com.br';
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0';

const TABLES=[
  ['site_settings','?select=*'],
  ['banners','?select=*&is_active=eq.true&order=display_order.asc'],
  ['game_audio_settings','?select=*'],
  ['game_settings','?select=*'],
  ['financial_settings','?select=*'],
  ['pressel_settings','?select=*'],
  ['demo_settings','?select=*'],
  ['notification_settings','?select=*'],
];

const ROUTES=['auth','gallery','gratis','join','pressel','gerente','admin'];

function curl(url,out){
  const args=['-sS','--fail','--max-time','180','-A',UA];
  if(out)args.push('-o',out);
  args.push(url);
  const r=spawnSync('curl.exe',args,{encoding:'utf8',maxBuffer:64*1024*1024});
  if(r.status!==0)return{ok:false,err:(r.stderr||'').trim()||('code '+r.status)};
  return{ok:true};
}
function mkdir(p){fs.mkdirSync(path.dirname(p),{recursive:true});}

function sanitize(s){
  return s.split(ORIGIN).join('').split(SOUNDS).join('');
}

/* 1) dados REST ------------------------------------------------------- */
const data={};
for(const [t,q] of TABLES){
  const tmp=path.join(require('os').tmpdir(),'rs_'+t+'.json');
  const r=curl(ORIGIN+'/rest/v1/'+t+q,tmp);
  if(!r.ok){console.log('FALHA rest '+t+': '+r.err);process.exitCode=1;continue;}
  let raw=fs.readFileSync(tmp,'utf8');
  try{JSON.parse(raw);}catch(e){console.log('JSON invalido '+t+': '+e.message);process.exitCode=1;continue;}
  const clean=sanitize(raw);
  const dest=path.join(ROOT,'rest','v1',t);
  mkdir(dest);
  fs.writeFileSync(dest,clean);
  data[t]=JSON.parse(clean);
  console.log('REST   '+t+'  '+clean.length+' bytes');
}

/* 2) assets referenciados nos dados ---------------------------------- */
const urls=new Set();
(function walk(o){
  if(typeof o==='string'){
    if(/^\/[A-Za-z0-9_\-./]+\.(png|jpe?g|webp|gif|svg|mp3|ogg|wav|m4a|mp4|webm|json)$/i.test(o.split('?')[0]))urls.add(o);
    else if(/^https?:\/\//i.test(o)&&/\/storage\/v1\//.test(o))urls.add(new URL(o).pathname);
  } else if(Array.isArray(o)) o.forEach(walk);
  else if(o&&typeof o==='object') Object.values(o).forEach(walk);
})(data);
console.log('\nassets referenciados: '+urls.size);
let dl=0,fail=0;
for(const u of [...urls].sort()){
  const dest=path.join(ROOT,u.replace(/^\//,'').split('?')[0]);
  if(fs.existsSync(dest)&&fs.statSync(dest).size>0){dl++;continue;}
  mkdir(dest);
  const r=curl(ORIGIN+u,dest);
  if(r.ok){dl++;console.log('  ok   '+u+'  '+fs.statSync(dest).size);}
  else{fail++;console.log('  FAIL '+u+'  '+r.err);if(fs.existsSync(dest))fs.unlinkSync(dest);}
}
console.log('baixados='+dl+' falhas='+fail);

/* 3) rotas SPA -------------------------------------------------------- */
const index=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
for(const r of ROUTES){
  const dest=path.join(ROOT,r,'index.html');
  mkdir(dest);
  fs.writeFileSync(dest,index);
}
fs.writeFileSync(path.join(ROOT,'404.html'),index);
console.log('rotas SPA: '+ROUTES.join(', ')+' (+404.html)');

/* 4) service workers inexistentes no origem -> stub ------------------- */
const stub="// stub: o origem nao possui este arquivo (SPA fallback devolve index.html)\n";
fs.writeFileSync(path.join(ROOT,'push-sw.js'),stub);
fs.writeFileSync(path.join(ROOT,'firebase-messaging-sw.js'),stub);
console.log('stubs de service worker criados');
