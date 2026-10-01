// Injeta o shim do beacon em index.html e espalha para as rotas/404.
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const p=path.join(ROOT,'index.html');
let t=fs.readFileSync(p,'utf8');

const MARK='espelho estatico: o GitHub Pages nao aceita POST';
// remove qualquer shim antigo (4 ou 8 espacos de indentacao, versao nova ou antiga)
t=t.replace(/[ \t]*<script>\s*\/\/ espelho estatico: o GitHub Pages nao aceita POST[\s\S]*?<\/script>\n?/g,'');

const tag='<script type="module" crossorigin src="/assets/index-bdc0e7f9.js"></script>';
if(t.indexOf(tag)<0){console.log('tag do bundle nao encontrada');process.exit(1);}

const shim=[
'    <script>',
'      // '+MARK+'.',
'      // O bundle manda um ping de analytics para /functions/v1/site-beacon;',
'      // devolvemos 200 sintetico para nao gerar erro de rede.',
'      (() => {',
'        const isBeacon = (u) => String(u).indexOf("/functions/v1/") !== -1;',
'        const nativeFetch = window.fetch;',
'        if (nativeFetch) {',
'          window.fetch = function (input, init) {',
'            const url = typeof input === "string" ? input : (input && input.url) || "";',
'            const method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();',
'            if (method !== "GET" && isBeacon(url)) {',
'              return Promise.resolve(new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));',
'            }',
'            return nativeFetch.apply(this, arguments);',
'          };',
'        }',
'        // o bundle tambem manda o mesmo ping via navigator.sendBeacon (ignora fetch)',
'        try {',
'          const nativeBeacon = Navigator.prototype.sendBeacon;',
'          Object.defineProperty(navigator, "sendBeacon", {',
'            configurable: true,',
'            writable: true,',
'            value: function (url, data) {',
'              if (isBeacon(url)) return true;',
'              return nativeBeacon.call(navigator, url, data);',
'            }',
'          });',
'        } catch (e) {}',
'      })();',
'    </script>',
'    '
].join('\n');

t=t.replace(tag,shim+tag);
fs.writeFileSync(p,t);

const copies=['auth','gallery','gratis','join','pressel','gerente','admin']
  .map(r=>path.join(ROOT,r,'index.html'));
copies.push(path.join(ROOT,'404.html'));
for(const c of copies)fs.writeFileSync(c,t);
console.log('injetado em index + '+copies.length+' arquivos');
