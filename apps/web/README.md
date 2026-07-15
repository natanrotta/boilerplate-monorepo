# Boilerplate - Frontend

Aplicação web da plataforma Medic para gestao de pacientes, consultas, prontuarios e escalas medicas.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8-319795?logo=chakraui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)

## Arquitetura

O projeto segue **Clean Architecture** com organizacao **Module-First** (espelha o
`apps/api`). Cada modulo possui tres camadas + um barrel obrigatorio:

```
modules/{nome}/
  domain/          -> Entidades e interfaces de repositorio (PORT); services puros (opcional)
  application/     -> (OPCIONAL, sob demanda) orquestracao sem JSX: use-case headless, dto Zod
  infrastructure/  -> Implementacao HTTP dos repositorios (ADAPTER)
  presentation/    -> pages, components, hooks, context, constants, styles, utils, types
  routes.tsx       -> (opcional) rotas do modulo, agregadas por app/router
  index.ts         -> Barrel file (API publica do modulo — OBRIGATORIO)
```

> Estrutura, camadas, slots e o plano de migracao completos estao em
> [`docs/architecture/web-structure/proposal.md`](../../docs/architecture/web-structure/proposal.md).
> As fronteiras entre camadas sao vigiadas por `no-restricted-imports` (warn) no `.eslintrc.cjs`.

### Estrutura de Pastas

```
src/
├── app/                    Configuracao da aplicacao
│   ├── providers/          Context providers
│   ├── router/             React Router v6 + guards
│   └── theme/              Chakra UI theme (cores, tipografia, componentes)
│
├── core/                   Infraestrutura cross-cutting
│   ├── di/                 Container de injecao de dependencia
│   ├── domain/             Interfaces base (CrudRepository, BaseEntity)
│   ├── errors/             AppError
│   ├── http/               Axios client com interceptors e token refresh
│   └── query/              React Query config, query keys, error handler
│
├── shared/                 Reutilizavel entre modulos
│   ├── components/
│   │   ├── ui/             28 componentes (EntityCard, ListPageLayout, etc.)
│   │   ├── forms/          16 campos de formulario
│   │   ├── layout/         AppShell, SidebarNav, Topbar
│   │   └── skeletons/      7 loading skeletons
│   ├── hooks/              13 hooks reutilizaveis
│   ├── contexts/           Sidebar, ActiveRecording
│   ├── constants/          Messages, storage keys, locale
│   ├── types/              Pagination
│   └── utils/              Date, phone, document, monetary formatters
│
├── modules/                Modulos de feature (24)
│   ├── ai-usage/           Consumo de IA, carteira de tokens e checkout
│   ├── auth/               Autenticacao (login, registro, Google OAuth, impersonation)
│   ├── contacts/           Gestao de contatos
│   ├── copilot/            Copilot clinico (headless: domain + infrastructure)
│   ├── dashboard/          Dashboard
│   ├── development/        Styleguide / ferramentas de dev
│   ├── digital-signature/  Assinatura digital ICP-Brasil
│   ├── document-share/     Compartilhamento publico de documentos
│   ├── feedback-reports/   Relatorios de feedback
│   ├── help/               Central de ajuda (/help)
│   ├── import/             Importacao de dados
│   ├── knowledge-base/     Base de conhecimento
│   ├── legal/              Termos de uso e paginas legais
│   ├── onboarding/         Onboarding do usuario
│   ├── patient-documents/  Documentos e templates de pacientes
│   ├── patients/           Gestao de pacientes e campos dinamicos
│   ├── records/            Prontuarios, gravacao de audio e transcricao
│   ├── schedules/          Calendario de escalas e plantoes
│   ├── settings/           Configuracoes, perfil e equipe
│   ├── subscription/       Assinatura e faturamento
│   ├── system/             Saude/versao da API
│   ├── tags/               Tags para organizacao
│   ├── templates/          Templates de campos personalizados
│   └── workplaces/         Locais de trabalho, membros e convites
│
└── main.tsx                Entry point
```

## Stack Tecnica

### Core

- **React 18** + **TypeScript** strict mode
- **Vite 5** para build e dev server
- **React Router DOM 6** com rotas protegidas e guards
- **TanStack Query v5** para server state, cache e mutations
- **Axios** com interceptors, token refresh automatico e request queue
- **Chakra UI 2.8** como design system com semantic tokens

### Padroes e Abstraccoes

- **Repository Pattern** com injecao de dependencia (`core/di/`)
- **CrudRepository<T>** interface base com generics
- **useEntityList<T>** e **useEntityDetail<T>** hooks genericos para CRUD
- **useListPageController<T>** composicao de paginacao + bulk + filtros
- **useFormState<T>** com validacao, dirty tracking e erros por campo
- **useDetailPageController<T>** com auto-save e validacao
- **React.memo** em componentes de lista para performance
- **Barrel files** (`index.ts`) em cada modulo para API publica

### Tooling

- **ESLint** com regras para hooks e refresh
- **Turbo** como build system do monorepo
- Path aliases: `@/app`, `@/core`, `@/shared`, `@/modules`

## Como Executar

```bash
# Instalar dependencias (a partir da raiz do monorepo)
yarn install

# Dev server (porta 3000, proxy /api -> localhost:3333)
yarn dev

# Build de producao
yarn build

# Verificar tipos
yarn type-check

# Linting
yarn lint
```

## Testes E2E (Playwright)

Usamos **Playwright** para testes end-to-end. Ele abre um navegador de verdade e simula um usuario real clicando, digitando e navegando na aplicacao.

### Pre-requisitos

Antes de rodar os testes, o **backend e o frontend precisam estar rodando**:

```bash
# Terminal 1 — backend
cd apps/api && yarn dev

# Terminal 2 — frontend
cd apps/web && yarn dev
```

### Comandos

| Comando                | O que faz                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `yarn test:e2e`        | Roda todos os testes em modo **headless** (sem abrir navegador)                              |
| `yarn test:e2e:headed` | Abre o **Chrome na tela** e voce ve os cliques acontecendo                                   |
| `yarn test:e2e:ui`     | Abre a **interface visual do Playwright** — roda teste por teste, com screenshots e timeline |
| `yarn test:e2e:report` | Abre o **relatorio HTML** com resultado detalhado de cada teste                              |

### Por onde comecar

Para validar visualmente pela primeira vez, recomendamos:

```bash
cd apps/web
yarn test:e2e:ui
```

Isso abre uma interface grafica onde voce ve cada teste listado, pode clicar para rodar um por um, e ele mostra passo a passo o que aconteceu com screenshot de cada etapa.

Para ver o navegador se movendo sozinho (modo "cinematografico"):

```bash
yarn test:e2e:headed
```

### Como funciona por dentro

1. O Playwright faz login automaticamente com o usuario dev (`ricardo@boilerplate.dev / 123456`)
2. Salva a sessao para nao precisar logar em cada teste
3. Cada teste cria dados unicos (com timestamp no nome) para nao conflitar com outros testes
4. Se um teste falha, ele tira **screenshot automatico** da tela no momento da falha

### Se um teste falhar

Rode `yarn test:e2e:report` — o relatorio HTML mostra exatamente **qual linha falhou**, com screenshot e trace do que o navegador estava fazendo.

### Estrutura dos testes

```
apps/web/
  playwright.config.ts          Configuracao do Playwright
  e2e/
    global.setup.ts             Login automatico (roda antes de tudo)
    fixtures/
      auth.fixture.ts           Fixture de autenticacao reutilizavel
      test-data.ts              Geradores de dados unicos para testes
    pages/                      Page Objects (abstracoes das paginas)
      ContactsListPage.ts
      ContactDetailPage.ts
      components/
        Sidebar.ts
        ConfirmDialog.ts
    tests/                      Testes organizados por modulo
      contacts/
        contact-list.spec.ts
        contact-create.spec.ts
        contact-detail.spec.ts
        contact-delete.spec.ts
        contact-search.spec.ts
```

### Adicionando testes para novos modulos

1. Crie os Page Objects em `e2e/pages/`
2. Crie os testes em `e2e/tests/{modulo}/`
3. Use `createUnique*()` para gerar dados isolados
4. Importe `test` e `expect` de `../../fixtures/auth.fixture` (ja vem autenticado)
5. Siga o padrao do modulo de contatos como referencia

## Documentacao

Documentacao visual detalhada disponivel em `docs/architecture/`:

| Documento                                                                          | Descricao                                                                  |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [architecture-overview.html](docs/architecture/architecture-overview.html)         | Visao geral da arquitetura, camadas, modulos e design system               |
| [crud-flow.html](docs/architecture/crud-flow.html)                                 | Fluxo completo de CRUD (listagem, criacao, edicao, exclusao) com diagramas |
| [development-guide.html](docs/architecture/development-guide.html)                 | Guia passo a passo para criar novos modulos, padroes de codigo e checklist |

Documentos de referencia (schema Prisma, endpoints da API, PRD) foram movidos para
[`docs/reference/`](../../docs/reference) na raiz do monorepo — descrevem backend/produto, nao o front.

Abra os arquivos `.html` diretamente no browser para visualizar.

## Modulos

Os 24 modulos de feature estao listados na secao **Estrutura de Pastas** acima
(`src/modules/`). O contrato de organizacao (camadas, slots, barrel, rotas
distribuidas e o plano de migracao Module-First) esta em
[`docs/architecture/web-structure/proposal.md`](../../docs/architecture/web-structure/proposal.md).

## Variaveis de Ambiente

```env
VITE_API_URL=http://localhost:3333    # URL base da API
VITE_GOOGLE_CLIENT_ID=...            # Google OAuth client ID
```
