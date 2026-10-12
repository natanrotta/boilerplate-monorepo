# Deploy — Cloudflare Pages

Este pacote é deployado como SPA estático no **Cloudflare Pages** (projeto `boilerplate-site`
→ `your-domain.tld`). Migrado do AWS Amplify em 2026-06. Arquitetura geral de deploy do Boilerplate:
[`.claude/knowledge/devops.md`](../../.claude/knowledge/devops.md) › Frontends (Cloudflare Pages).

## O site é standalone (FORA do Yarn workspace)

`apps/site` está intencionalmente **fora** do `package.json#workspaces` da raiz. Tem seu
próprio `yarn.lock` e `node_modules` (criado no primeiro `yarn install` dentro de `apps/site/`).
Esse isolamento é deliberado — por isso o projeto Pages aponta **Root directory = `apps/site`**:

- O Cloudflare Pages constrói o site sem tocar no monorepo da plataforma.
- Postinstalls pesados do `@boilerplate/api` (Prisma generate, ffmpeg-static, signpdf) nunca rodam no deploy do site.
- O quirk do Yarn 1 "Cannot find the root of your workspace" não pode acontecer.
- O site é portável — pode ser movido para um repositório próprio sem refactor.

Ao adicionar uma dependência: `yarn install` dentro de `apps/site/`, commita o `apps/site/yarn.lock`.

## Configuração no Cloudflare Pages (uma vez)

**Workers & Pages → Create → Pages → conectar `OWNER/REPO`:**

| Campo             | Valor                                       |
| ----------------- | ------------------------------------------- |
| Production branch | `main`                                      |
| Root directory    | `apps/site`                                 |
| Build command     | `yarn build`                                |
| Output directory  | `dist`                                      |
| Env var           | `NODE_VERSION=22.16.0`                      |
| Custom domain     | `your-domain.tld` (+ `www → apex`, pendente) |

## SPA rewrite + headers (no repo, **não** no console)

Diferente do Amplify, o Cloudflare Pages lê a config de arquivos no `dist/` (copiados verbatim
de `public/` pelo Vite):

- **`public/_redirects`** — fallback SPA (`/*  /index.html  200`) para as rotas client-side
  (`/`, `/privacidade`, `/termos`). Sem isso, refresh numa rota interna dá 404.
- **`public/_headers`** — security headers (HSTS, X-Content-Type-Options, X-Frame-Options,
  Referrer-Policy, Permissions-Policy, COOP) + cache (`/assets/*` immutable). **Substitui o antigo
  `customHttp.yml`** (formato Amplify, que o Pages ignora).

> Formato dos arquivos: <https://developers.cloudflare.com/pages/configuration/>.

## Por deploy

Cada push na branch `main` dispara um build no Pages. Mais nada.

## Variáveis de ambiente

O site não faz chamadas de API em runtime. As duas referências externas ficam em
`src/content/site.ts`: `PLATFORM_URL` (o destino de "Entrar" — defina `VITE_PLATFORM_URL` no
build; sem ela vale o placeholder `https://app.example.com`) e `REPO_URL` (o repositório dos
botões "Ver no GitHub" e do comando de clone — `VITE_REPO_URL`).

## Dependência fora da pasta: `packages/theme`

O site pinta com o design system do produto. `@boilerplate/theme` é um alias para
`../../packages/theme/src` (`vite.config.ts` + `tsconfig.json`): o código é compilado junto com o
do site, sem instalar nada do monorepo. O Pages clona o repositório inteiro, então a pasta está
lá no build — mas mover o site para outro repositório exige levar `packages/theme` junto.

## Validando localmente

```bash
# de dentro de apps/site/
yarn install     # primeira vez ou ao atualizar deps
yarn build
yarn preview     # serve dist/ em http://localhost:3100
```

O output do `preview` é byte-for-byte o que o Cloudflare Pages vai publicar.

## Atalhos da raiz

```bash
yarn site:install   # cd apps/site && yarn install
yarn site           # cd apps/site && yarn dev
yarn site:build     # cd apps/site && yarn build
```
