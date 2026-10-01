# Pinguim Surfers — espelho estático

Espelho de `https://pinguim-surfers.paineldemonstrativo.com.br/` publicado em
`https://ofertaboa.github.io/` (base path **raiz**, sem prefixo).

## Stack do origem

- SPA **Vite + React** (`assets/index-bdc0e7f9.js` + `assets/index-IvDGIQMY.css`)
- **Supabase self-hosted** no mesmo domínio: `/rest/v1/*`, `/storage/v1/*`, `/functions/v1/*`
- O bundle usa `JW = window.location.origin` como base da API → no espelho as chamadas
  batem no próprio site, por isso os dados viraram **JSON estático** em `rest/v1/`.
- Jogo em **three.js** (cena procedural, sem sprites); áudio vem das configurações do banco.
- Rotas SPA: `/`, `/auth`, `/gallery`, `/gratis`, `/join`, `/pressel`, `/gerente`, `/admin`.

## O que foi espelhado

| Origem | Espelho |
|---|---|
| `/` (HTML) | `index.html` + uma cópia em cada rota (`auth/index.html` …) + `404.html` |
| `/assets/*` | baixado |
| `/rest/v1/<tabela>` (8 tabelas) | JSON estático (query string é ignorada no Pages) |
| `/storage/v1/object/public/...` | 24 imagens + 11 sons baixados |
| `/vendor/hdri/potsdamer_platz_1k.hdr` | baixado (unico que existe no origem) |
| `/vendor/fonts/**` | 20 woff + `font-meta/latin.json` + `codepoint-index/plane0/0-ff.json` |
| `/push-sw.js`, `/firebase-messaging-sw.js` | stub (não existem no origem; o SPA devolve index.html) |

## Ferramentas (`tools/`)

```
mirror.js     baixa HTML, dados REST, assets e monta as rotas     (node tools\mirror.js)
scan.js       extrai refs de todos os arquivos                     (usado pelos demais)
check.js      rotas 200 + todas as refs resolvem                   (SITE=... node tools\check.js)
rawpaths.js   refs raiz-absolutas com arquivo faltando
verify.js     defeitos de build
follow.js     baixa refs que faltarem (idempotente)
headless.js   renderiza as rotas no Chrome e classifica o console
netlog.js     log de rede do Chrome (status/erros)
selftest.js   teste do próprio scanner
base.js       base path (hoje: '' = raiz)
server.js     servidor local com o mesmo base path (PORT=8092)
```

Servidor local: `set PORT=8092 && node tools\server.js` → `http://localhost:8092/`

## Limitações

- **Login/cadastro/saque não funcionam**: exigem Supabase Auth (`/auth/v1/token`) e
  as tabelas privadas (`profiles`, `wallets`, `game_sessions`, …), que não são públicas.
- `/functions/v1/site-beacon` (ping) e realtime não existem no espelho.
- Consultas autenticadas (`profiles`, `wallets`, `withdrawals`, RPCs) respondem 404 → o app
  entra em modo visitante, que é o comportamento esperado.
