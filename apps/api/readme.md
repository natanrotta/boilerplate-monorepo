<p align="center">
  <h1 align="center">🏥 Boilerplate — Backend API</h1>
  <p align="center">
    Plataforma SaaS de gestão clínica — <b>Module-First</b> + Clean Architecture, TypeScript, Express e IA
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-+pgvector-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-BullMQ-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-1.x-1C3C3C?logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/DI-tsyringe-8b5cf6" />
  <img src="https://img.shields.io/badge/Tests-3864_passing-22c55e?logo=vitest&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Module--First-0ea5e9" />
</p>

---

## 🧭 Sobre

API que sustenta a plataforma clínica Boilerplate: **agenda hospitalar, prontuários, pacientes,
documentos assinados (ICP-Brasil), cobrança (Stripe), importação em massa e um copiloto de IA
clínico** (RAG sobre documentos + tool-calling). Multi-tenant, LGPD/PHI-aware, com processamento
assíncrono via filas e observabilidade de produção.

O código é organizado **module-first**: a **feature (domínio) é a unidade de topo**; as camadas
(domain → application → infrastructure) são subpastas dentro de cada domínio. O _path é a
documentação_ — você lê `modules/patients/application/use-case/create-consultation.use-case.ts`
e sabe **qual feature, qual camada e qual artefato** sem abrir o arquivo.

> **Autoridade de estrutura:** [`.claude/patterns/backend-modules.md`](../../.claude/patterns/backend-modules.md) (ONDE cada arquivo vive) ·
> **Autoridade de lifecycle/patterns:** [`.claude/patterns/backend.md`](../../.claude/patterns/backend.md) (COMO uma request flui).

---

## 📐 Arquitetura Module-First

```
apps/api/src/
├── 🧩 modules/                     # o negócio — 1 pasta por DOMÍNIO (16)
│   └── <domain>/
│       ├── domain/                  # regra pura, zero framework
│       │   ├── entity/               # <x>.entity.ts (+ .spec.ts co-locado)
│       │   ├── repository/           # <x>-repository.interface.ts  (PORT)
│       │   └── provider/             # port próprio do módulo (se houver)
│       ├── application/             # orquestração (depende só de domain)
│       │   ├── use-case/{feature}/   # 1 operação por arquivo + .spec.ts
│       │   ├── dto/                  # schemas Zod + tipos inferidos
│       │   ├── service/              # serviços de aplicação
│       │   └── interface/            # ports não-repositório (estratégias)
│       ├── infrastructure/          # frameworks & drivers
│       │   ├── controller/           # thin: resolve use case, devolve envelope
│       │   ├── route/                # <x>.routes.ts (feature routes)
│       │   ├── repository/           # prisma-<x>-repository.ts  (ADAPTER)
│       │   └── provider/             # adapters (BirdID, Stripe, embedding…)
│       ├── util/  constant/          # helpers/constantes com nome de negócio
│       ├── test/                    # factories de teste do módulo
│       └── <domain>.module.ts        # DI: register<Domain>Module(container)
│
├── ⚪ shared/                       # kernel puro — ZERO conhecimento de domínio
│   ├── error/                       # hierarquia AppError + ~175 ErrorCodes
│   ├── i18n/                        # i18next + locales/{pt-BR,en,es}
│   ├── util/  constant/  policy/    # helpers genéricos, tenancy, limites
│   ├── provider/                    # PORTS genéricos (Cache, Jwt, Llm, Queue…)
│   ├── type/                        # primitivos cross-module (JsonValue, enums)
│   └── dto/                         # common.dto (paginação/response)
│
├── 🏗️ core/                         # o chassi — sobe a app, sem regra de negócio
│   ├── http/                        # app.ts, routes/ (aggregator), middlewares/, logger
│   ├── container/                   # composition root tsyringe + tokens + boot guards
│   ├── config/                      # env.ts (Zod)
│   ├── database/                    # prisma-client, prisma-error-mapper
│   ├── provider/                    # IMPLs genéricas (RedisCache, BullMQ, S3, Jwt, Bcrypt)
│   ├── service/                     # error-reporter (Bugsnag), scheduler, encryption
│   └── bootstrap/                   # registro das filas BullMQ (chamado do main.ts)
│
├── 🧪 test/                         # test kit cross-module (mocks/ + factories/ aggregator)
├── scripts/                         # ferramentas operacionais (seeds, stripe sync)
├── generated/                       # Prisma Client (build artifact, gitignored)
└── main.ts                          # bootstrap (listen, cron, filas)
```

### A lei de dependência (o único import rule)

```
modules/  →  pode importar  →  shared/ , core/ (ports)
core/     →  pode importar  →  shared/
shared/   →  não importa ninguém
modules/  →  NUNCA importa a infrastructure/ de outro módulo
             (só o domain/ ou application/ — a interface / o use case)
```

A direção aponta sempre **para dentro** (`infrastructure → application → domain`) — a mesma regra
Clean Architecture de sempre, agora **por módulo**. O dia em que `shared/util/x.ts` precisar
importar de um `module/`, isso prova que ele nunca foi shared — pertence àquele módulo. É o
detector de vazamento.

### Aliases de path

`@modules/*` · `@core/*` · `@shared/*` · `@test/*` · `@generated/*`
Os tokens de DI vêm de `@core/container/tokens`. (Os aliases antigos `@domain`/`@application`/`@infrastructure`/`@tests` foram removidos.)

---

## 🧩 Os 16 domínios

| Domínio | O que contém |
| --- | --- |
| 👤 **platform** | Contas, usuários, memberships e gestão de equipe da conta (identidade/tenancy) |
| 🏥 **workplace** | Estrutura organizacional da clínica: workplaces + setores/turnos/membros/convites, profissionais |
| 🩺 **patients** | Pacientes, consultas (+ anexos), documentos do paciente e compartilhamentos públicos |
| 📇 **contacts** | Contatos e os value-objects `address`/`phone` |
| 🏷️ **tags** | Categorização compartilhada (aplicada a contatos e pacientes; lida pela IA/dashboard) |
| 📋 **templates** | Engine de templates de campos dinâmicos (base transversal de patients/documents/ai) |
| 🗓️ **scheduling** | Escalas do workplace + shares, eventos de calendário, importação de escala (IA) |
| 📄 **documents** | Template de documento, assinatura digital ICP-Brasil (BirdID/SafeID); consome `templates` |
| 💳 **billing** | Assinaturas, payment intents, carteira/pacotes/transações de token, planos (Stripe) |
| 🤖 **ai** | Copiloto (LangGraph), RAG/embeddings (pgvector), transcrição, knowledge base, tools |
| 🔐 **auth** | Login (email/senha, Google OAuth), refresh token, reset de senha, verificação de e-mail, convites |
| 🚀 **onboarding** | Personalização pós-signup (geração de seed via LLM, estado da jornada) |
| 📥 **import** | Importação em massa (CSV → entidades) com registry, streaming e filas |
| 🛠️ **admin** | Painel admin, system-status, impersonation, feedback reports, dev tools |
| 💬 **messaging** | Identidade de mensageria do contato (base para WhatsApp) |
| 🏠 **dashboard** | Home do médico (agrega dados dos outros domínios; sem repo próprio) |

Cada domínio expõe `register<Domain>Module(container)` (só bindings de repositório) chamado do
composition root em `core/container/index.ts`. Serviços e use-cases cross-domain seguem
registrados centralmente.

**Em números:** 16 domínios · 42 entidades · 44 repository ports · 44 Prisma repositories · 223 use
cases · 29 DTOs Zod · 30 controllers · 33 route files · ~236 endpoints · 56 modelos Prisma.

---

## 🏛️ Engenharia

### Injeção de dependência & composition root

DI com **tsyringe** (`@injectable` + `@inject(DI_TOKENS.X)`). Cada domínio possui um
`<domain>.module.ts` que registra apenas suas **bindings de repositório** (interface → impl Prisma).
O composition root (`core/container/index.ts`) chama os 12 `register<Domain>Module(container)` e
registra os singletons cross-domain (providers, serviços, copilot registry). Nenhum use case conhece
o container — recebe portas por construtor.

### Ports & Adapters (Hexagonal por dentro)

- **Repository ports** (`modules/<d>/domain/repository/*.interface.ts`) — contratos de persistência; as impls Prisma vivem em `modules/<d>/infrastructure/repository/prisma-*.ts`.
- **Provider ports genéricos** (`shared/provider/*` — 19: `ILlmProvider`, `ICacheProvider`, `IQueueProvider`, `IJwtProvider`, `IStorageProvider`, `IMailProvider`, `IEventBus`…) — implementados no chassi (`core/provider/*` — 21 impls: Redis, BullMQ, S3, JWT, bcrypt…).
- **Ports de módulo** (`modules/<d>/domain/provider/*`) — ex.: `IDigitalSignatureProvider` (documents), `IPaymentProvider` (billing); adapters em `modules/<d>/infrastructure/provider/` (BirdID/SafeID, Stripe).

Módulos dependem sempre da **porta**, nunca da implementação concreta.

### Camada de dados (Prisma 7 + pgvector)

Repositórios Prisma traduzem rows ↔ entidades de domínio (`toEntity()`), rodam escritas em
`$transaction`, e mapeiam erros com `mapPrismaError()` (`core/database/prisma`) — P2002 → Conflict,
P2025 → NotFound, etc. RAG usa **pgvector** (busca por similaridade de embeddings). 56 modelos.

### Multi-tenancy (isolamento por conta)

Toda leitura **e** escrita filtra por `account_id`. A checagem de tenant usa
`ensureSameAccount(entity, callerAccountId)` (`shared/policy`) — em mismatch lança `NotFoundError`
(nunca `ForbiddenError`, para não revelar que o recurso existe em outra conta).

### Validação & tratamento de erros

Entrada validada por **Zod** (`modules/<d>/application/dto/*.dto.ts`); `validateRequest` faz o parse
na borda HTTP. Erros seguem uma hierarquia `AppError` (11 subclasses: `NotFoundError`,
`ValidationError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`, `PaymentRequiredError`,
`TooManyRequestsError`…) + ~175 `ErrorCodes` estáveis. O `errorHandlerMiddleware` traduz via i18n
(pt-BR/en/es) e responde `{ ok: false, error: { message, code, details? } }` com o status certo.

### Chassi HTTP & segurança

Middleware chain no `core/http`: **Helmet/CSP → CORS (allowlist) → rate-limit em camadas →
CSRF double-submit → authMiddleware (JWT) → module guard (RBAC/workplace) → validateRequest (Zod) →
controller**. Controllers são finos: resolvem o use case e devolvem o envelope. O webhook do Stripe
usa raw-body + verificação de assinatura.

### Assíncrono & filas (BullMQ + Redis)

Operações pesadas rodam em filas registradas no boot (`core/bootstrap`, 6 filas):
`entity-operations` (bulk deletes), `embedding` (RAG reconcile), `transcription`,
`schedule-import`, `maintenance` e `copilot-module`. Processo único web+workers+cron por réplica.

### Engenharia de IA (`modules/ai`)

O copiloto clínico é construído sobre **LangChain + LangGraph** (`@langchain/langgraph`, `@langchain/openai`, `openai`):

- **`infrastructure/graphs`** — grafos LangGraph que orquestram o raciocínio do copiloto.
- **`infrastructure/tools`** — tool-calling sobre dados clínicos (perfil do paciente, escalas, pré-consulta…).
- **`infrastructure/sources`** — fontes de embedding (consulta, paciente, template, tag, workplace, documento) para RAG via pgvector.
- **`infrastructure/context` / `prompts` / `skills` / `quick-actions`** — montagem de contexto, prompt engineering e ações rápidas.
- **`infrastructure/parsers` / `schedule-import`** — extração LLM de escalas em PDF.
- **`eval/`** — golden set + LLM-judge (`yarn eval:clinical`) para avaliação clínica.
- Hardening de PHI/prompt-injection e contabilização de custo (`util/ai-cost`, `estimate-tokens`, `prompt-sanitizer`).

### Integrações

**Stripe** (assinaturas + webhook raw-body) · **BirdID/SafeID** (assinatura digital ICP-Brasil, com factory de provider) · **AWS S3** (upload com gate de MIME/tamanho) · **Google OAuth** · **OpenAI** (LLM/embeddings/transcrição). Cada integração segue o padrão _port no domain + adapter na infrastructure + env Zod + DI_.

### Observabilidade

Logging estruturado com **Pino** (`ILoggerProvider`, nunca `console.log`) com redaction de PHI;
error tracking via **Bugsnag** (`core/service/error-reporter`, fail-open, `collectUserIp:false`,
redactedKeys). Health endpoints `/healthz` (liveness) e `/api/health` (versão carimbada).

### Testes

**Vitest** com specs **co-locados** (o `.spec.ts` vive na mesma pasta do arquivo que testa).
Factories de dados por módulo (`modules/<d>/test/*.factory.ts`, ids sequenciais + datas fixas);
mocks agregadores cross-module em `test/mocks/`. **558 arquivos de teste · 3840 testes**.

```
558 test files | 3840 tests | 100% passing
```

---

## 🛠 Stack

| Categoria | Tecnologia |
| --- | --- |
| 🟩 Runtime | Node.js 20+ |
| 📘 Linguagem | TypeScript 5.8 |
| 🌐 Framework | Express 4 |
| 🗄️ ORM | Prisma 7 |
| 🐘 Banco | PostgreSQL + **pgvector** |
| ⚡ Cache | Redis (ioredis) |
| 📨 Filas | BullMQ |
| 🤖 IA | LangChain + **LangGraph** + OpenAI |
| ✅ Validação | Zod |
| 💉 DI | tsyringe |
| 🧪 Testes | Vitest |
| 🔑 Auth | JWT + bcrypt + Google OAuth |
| 💳 Pagamentos | Stripe |
| ✍️ Assinatura | ICP-Brasil (BirdID/SafeID) |
| 📝 Logging | Pino |
| 🗂️ Storage | AWS S3 |
| 🛡️ Segurança | Helmet, Rate Limiting, CORS, CSRF |
| 📊 Observabilidade | Bugsnag |

---

## 🔒 Segurança

| Feature | Descrição |
| --- | --- |
| **Helmet / CSP** | Headers HTTP seguros (XSS, HSTS, etc.) |
| **Rate Limit** | Em camadas: por usuário, global, e reforçado no login |
| **CORS** | Allowlist de origins via env |
| **CSRF** | Double-submit token |
| **JWT** | Access + Refresh token com `tokenVersion` (revogação imediata) |
| **Multi-tenancy** | `account_id` em toda query + `ensureSameAccount` (NotFound em cross-tenant) |
| **RBAC / Workplace** | Module guards e papéis por workplace |
| **Upload** | Gate de MIME + tamanho por tipo (áudio/imagem/PDF) |
| **Webhook Stripe** | Raw-body + verificação de assinatura |
| **PHI/LGPD** | Redaction no log, `collectUserIp:false`, hardening de prompt-injection na IA |

---

## ⚙️ Configuração

### Pré-requisitos

- Node.js >= 20 · Yarn · Docker & Docker Compose

### Setup

```bash
# 1. Dependências (na raiz do monorepo)
yarn install

# 2. Variáveis de ambiente
cp .env.example .env

# 3. Subir Postgres (pgvector) e Redis
yarn docker:up

# 4. Migrações + Prisma Client
yarn db:deploy && yarn db:generate

# 5. Iniciar a API em dev
yarn dev:api
```

### Variáveis de ambiente (principais)

Todas validadas por Zod em `core/config/env.ts` — a app não sobe com env inválida.

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NODE_ENV` | ✅ | local, development, staging, production |
| `DATABASE_URL` | ✅ | PostgreSQL (+pgvector) |
| `JWT_SECRET` | ✅ | Chave HS256 do JWT |
| `REDIS_HOST` / `REDIS_PORT` | | Redis (BullMQ + cache) |
| `OPENAI_API_KEY` | | LLM / embeddings / transcrição |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | | Billing + webhook |
| `AWS_S3_BUCKET` | | Uploads |
| `GOOGLE_CLIENT_ID` | | Google OAuth |
| `BUGSNAG_API_KEY` | | Error tracking (vazio = desativado, fail-open) |

---

## 📜 Scripts

| Comando | Descrição |
| --- | --- |
| `yarn dev` | Servidor de desenvolvimento (tsx watch) |
| `yarn build` | Compila para produção (tsc + tsc-alias) |
| `yarn start` | Servidor de produção |
| `yarn type-check` | `tsc --noEmit` |
| `yarn test` / `test:watch` / `test:coverage` | Vitest |
| `yarn lint` / `yarn format` | ESLint / Prettier |
| `yarn prisma:migrate <name>` | Nova migração |
| `yarn prisma:deploy` / `prisma:generate` / `prisma:studio` | Aplicar / gerar / inspecionar |
| `yarn seed` · `seed:plans` · `seed:token-packages` | Seeds |
| `yarn backfill:embeddings` · `backfill:all` | Reprocessar embeddings (RAG) |
| `yarn stripe:sync-products` · `sync-plans` · `prune-catalog` | Catálogo Stripe |
| `yarn eval:clinical` | Avaliação clínica do copiloto (golden set + LLM-judge) |
| `yarn signature:live-test` | Teste ao vivo de assinatura (BirdID) |

---

## 🗂️ API

**~236 endpoints** montados por domínio: cada `modules/<d>/infrastructure/route/*.routes.ts` declara
as rotas da feature, e o aggregator `core/http/routes/index.ts` faz o `router.use("/base", …)`. Todas
autenticadas por padrão (JWT), exceto health e o fluxo público de auth/compartilhamento.

---

## 📚 Documentação

| Documento | Descrição |
| --- | --- |
| [`.claude/patterns/backend-modules.md`](../../.claude/patterns/backend-modules.md) | **ONDE** cada arquivo vive — skeleton do módulo, os 16 domínios, o split shared/core |
| [`.claude/patterns/backend.md`](../../.claude/patterns/backend.md) | **COMO** uma request flui — lifecycle canônico + todos os patterns por camada |
| [`.claude/patterns/code-review-checklist.md`](../../.claude/patterns/code-review-checklist.md) | Catálogo de anti-patterns (códigos `B-*`, `X-*`, `SEC-*`) |
| [`REFACTOR-BACKEND-MODULES.md`](../../REFACTOR-BACKEND-MODULES.md) | Plano da migração layer-first → module-first (histórico + gotchas) |

---

## 📝 Licença

MIT
