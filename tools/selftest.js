// Teste: o check.js detecta ref raiz-absoluta sem o base path?
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const BASE=require('./base');
const probe=path.join(ROOT,'__probe__.html');
const orig='<img src="/img/flapbird/birds/bird-brasil.png">';
fs.writeFileSync(probe,'<!DOCTYPE html><html><body>'+orig+'</body></html>');
let naked=0,err=0;
try{
  delete require.cache[require.resolve('./scan')];
  const {scan}=require('./scan');
  const s=scan();
  const hit=s.abs.filter(a=>a.from==='__probe__.html');
  if(BASE){
    naked=hit.filter(a=>a.naked).length;
    if(naked!==1){console.log('FALHA: esperava 1 naked, veio '+naked+' (abs do probe='+hit.length+')');err=1;}
    else console.log('OK: check detectou a ref sem base (naked='+naked+')');
  }else{
    const missing=hit.filter(a=>!a.dest||!fs.existsSync(a.dest));
    if(hit.length!==1||missing.length!==1){
      console.log('FALHA: esperava 1 ref com arquivo faltando, veio '+hit.length+'/'+missing.length);err=1;
    }else console.log('OK: check detectou a ref com arquivo faltando (base=raiz)');
  }
}catch(e){console.log('ERRO: '+e.message);err=1;}
finally{try{fs.unlinkSync(probe)}catch(e){}}
process.exit(err);
