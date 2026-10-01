// Reporta literals de caminho com problema.
//   base != '' -> falta o prefixo do base path
//   base == '' -> caminho raiz-absoluto esta correto; falta e o ARQUIVO
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const BASE=require('./base');
const {MEDIA_RE}=require('./scan');
const EX=new Set(['tools','.git','node_modules']);
const LOGICAL=new Set(['auth','gallery','gratis','join','pressel','gerente','admin']);
const TOKEN=String.fromCharCode(0);
// o origem tambem nao os possui (SPA fallback devolve index.html): presets do three.js
const LAZY=new Set(['/px.png','/nx.png','/py.png','/ny.png','/pz.png','/nz.png']);
const files=[];
(function walk(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);
 if(f.isDirectory()){if(EX.has(f.name))continue;walk(p);continue;}
 if(/\.(html|js|mjs|css|json)$/i.test(f.name))files.push(p);}})(ROOT);

const re=/(["'`])((?:\\)?\/)([^"'`\s<>]*)\1/g;
const hits=new Map();
for(const p of files){
  const rel=path.relative(ROOT,p);
  if(/\.css$/i.test(p))continue;   // seletores Tailwind escapados nao sao URL
  const t=fs.readFileSync(p,'utf8');
  let m;const r=new RegExp(re.source,'g');
  while((m=r.exec(t))){
    const raw=m[3];
    const val=(m[2]+raw).replace(/\\\//g,'/');
    if(val.startsWith('//'))continue;                 // regex literal / protocolo
    if(val.startsWith('/rest/v1/')||val.startsWith('/auth/v1/'))continue;  // endpoint
    if(raw.startsWith(TOKEN))continue;                // token interno
    if(m[0].length<=3)continue;                       // "/" ou '/' solto
    if(/^[.,]/.test(val)&&!/^(?:\.\/|\.\.\/)/.test(val))continue;   // fragmento minificado
    const file=val.split('?')[0].replace(/^\//,'');
    if(BASE){
      if(val.startsWith(BASE+'/'))continue;           // ja tem base
      if(!hits.has(val))hits.set(val,new Set());
      hits.get(val).add(rel);
      continue;
    }
    if(!MEDIA_RE.test(val.split('?')[0]))continue;    // sem extensao = rota/endpoint
    if(LOGICAL.has(file))continue;
    if(LAZY.has(val))continue;                        // nunca buscado pelo app
    if(fs.existsSync(path.join(ROOT,file)))continue;
    if(!hits.has(val))hits.set(val,new Set());
    hits.get(val).add(rel);
  }
}
console.log(BASE?'literals raiz-absolutos SEM base: '+hits.size
                :'refs raiz-absolutas com ARQUIVO faltando: '+hits.size);
[...hits.keys()].sort().forEach(v=>console.log('  '+v.slice(0,90).padEnd(92)+' ['+[...hits.get(v)].join(', ')+']'));
process.exit(hits.size?1:0);
