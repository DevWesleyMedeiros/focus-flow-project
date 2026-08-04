# 🎯 FocusFlow — Pomodoro Study Timer

> Aplicação web fullstack de timer Pomodoro para controle de tempo de estudo, com autenticação híbrida (Google + local), analytics de produtividade e suporte a PWA.

Projeto pessoal de portfólio, estruturado com o mesmo rigor de arquitetura, segurança e boas práticas servindo como segunda peça do boilerplate pessoal do autor para sistemas fullstack modernos.

---

## 📌 Sobre o projeto

O **FocusFlow** ajuda o usuário a estruturar sessões de estudo usando a técnica Pomodoro: blocos de foco configuráveis, lista de tarefas persistente por sessão, métricas de produtividade (streaks, focus score, horas totais de foco) e um painel de analytics com histórico completo.

O projeto nasceu de telas desenhadas previamente (login, dashboard/analytics, dashboard/timer view e study/task view), cada uma documentada em um arquivo de **regras de negócio** dedicado antes da implementação.

---

## 🖥️ Telas e rotas (Next.js App Router)

### Rotas públicas (grupo (auth))

| Tela | Rota | Documento de regras de negócio |
| --- | --- | --- |
| Login | `/login` | `REGRAS_DE_NEGOCIO_LOGIN.md` |
| Cadastro | `/register` | `REGRAS_DE_NEGOCIO_LOGIN.md` |
| Esqueci minha senha | `/forgot-password` | `REGRAS_DE_NEGOCIO_LOGIN.md` |
| Redefinir senha | `/reset-password` | `REGRAS_DE_NEGOCIO_LOGIN.md` |

### Rotas privadas (grupo (private))

| Tela | Rota | Documento de regras de negócio |
| --- | --- | --- |
| Dashboard — Timer View (página principal) | `/` | `REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md` |
| Study / Task View (aba *Tasks*) | `/tasks` | `REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md` |
| Dashboard — Analytics/History (aba *History*) | `/history` | `REGRAS_DE_NEGOCIO_DASHBOARD_ANALYTICS.md` |
| Detalhe de sessão específica | `/history/[sessionId]` | `REGRAS_DE_NEGOCIO_DASHBOARD_ANALYTICS.md` |
| Página de ajuda | `/ajuda` | - | |

> Cada documento reúne requisitos funcionais (RF), requisitos não funcionais (RNF), regras de negócio (RN-*) e user stories (US).

---

## ✨ Funcionalidades principais

**Timer / Sessão de foco**

- Timer configurável, com blocos entre 25 min (mínimo) e 60 min (teto)
- Botão de incremento **+5min** por clique, ativo apenas com o timer parado/pausado
- Iniciar / pausar / continuar sessão
- Shader animation ao redor do cronômetro, proporcional à duração da sessão
- Alarme + notificação ao final da sessão, com resumo das tasks concluídas
- Indicadores derivados: **Current Flow** (Focus Score) e **Focus Rank** (faixas do Focus Score)

**Tarefas de estudo**

- Criação, edição, exclusão e conclusão de tarefas
- Prioridade, drag-and-drop de ordenação e contador de sessões concluídas por tarefa
- Quick stats: daily goal (pomodoros concluídos no dia), active session e streak
- Filtro por nome; exclusão reflete em tempo real nas métricas semanais

**Analytics / Histórico**

- Daily streak, focus score e total focus hours calculados a partir das sessões armazenadas
- Gráfico semanal, subject mix e métricas de "últimos 7 dias" fiéis aos dados persistidos
- Sessões recentes (3 por padrão) com expansão via "View All History"
- Exportação de métricas do dia em `.csv`
- Intensidade de sessão classificada em 4 faixas: *Low Focus / Moderate / High Intensity / Perfect Focus*

**Autenticação e conta**

- Login social via **Google (Firebase Authentication)**, sem senha local
- Cadastro local próprio (nome, e-mail, senha, confirmar senha), com hash **bcrypt** e token de sessão encriptado
- Política de senha: 8–15 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial (validação com **Zod**, front e back)
- Recuperação de senha: `sendPasswordResetEmail` (Firebase) para contas Google; fluxo próprio para contas locais
- Avatar do usuário armazenado em banco (mime, size) e servido via Cloudinary
- Logout via `POST` limpando cookies de sessão

**Geral**

- Menu lateral: novo bloco, nova lista de tarefas, configurações, logout
- Suporte a instalação como **PWA** (favicon, logo, manifest.json)

---

## 🏗️ Arquitetura

Arquitetura em duas aplicações desacopladas (frontend e backend), comunicando-se via API REST, adaptada ao Next.js no front:

```
                ┌────────────────────────┐
                │        Cliente          │
                │  Next.js (App Router)   │
                │  React + TypeScript     │
                │  Tailwind CSS           │
                └───────────┬─────────────┘
                            │ REST (Axios/Fetch)
                            ▼
                ┌────────────────────────┐
                │        Backend           │
                │  Node.js + Express       │
                │  Routes → Controllers →  │
                │  Services → Repositories │
                │  Prisma ORM              │
                └───────────┬─────────────┘
                            ▼
                ┌────────────────────────┐
                │      PostgreSQL          │
                └────────────────────────┘

  Auxiliares: Firebase Authentication (login Google) · Cloudinary (avatares)
```

- **Padrão MVC adaptado** no backend (routes / controllers / services / repositories), numa arquitetura monolítica
- **Autenticação híbrida**: JWT/sessão encriptada (contas locais) convivendo com Firebase Auth (contas Google)
- **Separação app/server**: `app.ts` (configuração Express) desacoplado de `index.ts` (porta/listen), visando testabilidade
- **Snapshot/consistência de dados**: sessões e tasks concluídas persistidas de forma que métricas (streak, focus score, subject mix) sejam sempre recalculáveis a partir do histórico bruto, nunca de contadores soltos

---

## 🧰 Stack tecnológica

### Frontend

| Categoria | Tecnologia |
| --- | --- |
| Framework | Next.js (App Router) |
| Linguagem | TypeScript |
| UI | React + Tailwind CSS |
| Estado / dados | Zustand (estado local) + TanStack Query (estado de servidor) |
| Formulários | React Hook Form + Zod |
| HTTP client | Axios |
| Feedback ao usuário | Sonner (toasts) |

### Backend

| Categoria | Tecnologia |
| --- | --- |
| Runtime | Node.js (via Bun) |
| Framework | Express |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Autenticação | Firebase Authentication (Google) + JWT/sessão local (bcrypt) |
| Armazenamento de mídia | Cloudinary |
| Validação | Zod |

### Qualidade e testes

| Categoria | Tecnologia |
| --- | --- |
| Testes unitários / integração | Vitest, Supertest |
| Testes E2E | Playwright |
| Mock de rede | MSW |
| Metodologia | TDD onde aplicável |

### Infraestrutura (proposta, alinhada ao projeto anterior "casa-do-hamburguer")

| Camada | Serviço |
| --- | --- |
| Frontend | Vercel |
| Backend | Railway |
| Banco de dados | Neon (PostgreSQL) |
| Versionamento | GitHub (fluxo `feature/*` → `develop` → `main`, com proteção de branch) |

---

## 📁 Estrutura de pastas (proposta)

```
focus-flow-project/
├── client/                    # Next.js (App Router)
│   ├── src/
│   │   ├── app/                # rotas (login, register, dashboard, tasks...)
│   │   ├── components/
│   │   ├── features/            # timer, tasks, analytics, auth
│   │   ├── shared/               # api (axios), hooks, utils, types
│   │   └── styles/
│   └── public/                  # favicon, manifest.json, ícones PWA
├── server/                    # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── prisma/               # schema.prisma, migrations
│   │   ├── app.ts
│   │   └── index.ts
│   └── prisma/
├── docs/
│   ├── architecture/
│   │   ├── REGRAS_DE_NEGOCIO_LOGIN.md
│   │   ├── REGRAS_DE_NEGOCIO_DASHBOARD_ANALYTICS.md
│   │   ├── REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md
│   │   └── REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md
│   └── design/
│       └── pomodoro-project-design.md
├── .gitignore
├── .editorconfig
├── README.md
└── LICENSE
```

> Estrutura de monorepo simples (`client/` + `server/`), sem workspaces complexos — compatível com deploy separado (Vercel + Railway).

---

## 🚀 Como rodar localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/[GITHUB_USERNAME]/focus-flow-project.git
cd focus-flow-project

# 2. Backend
cd server
bun install
cp .env.example .env   # preencher DATABASE_URL, FIREBASE_*, CLOUDINARY_*, JWT_SECRET
bunx --bun prisma migrate dev
bun dev

# 3. Frontend (em outro terminal)
cd client
bun install
cp .env.example .env.local   # preencher NEXT_PUBLIC_API_URL, FIREBASE_*
bun dev
```

---

## 📁 Estrutura do monorepo implementada

```
focus-flow-project/
├── docs/
│   ├── architecture/    # Docs de regras de negócio (REGRAS_DE_NEGOCIO_*.md)
│   └── design/          # Docs de design UI/UX
├── client/              # Frontend Next.js 15 (App Router)
│   ├── src/
│   │   ├── app/         # Rotas com route groups: (auth), (private)
│   │   ├── components/  # Components separados por domínio (auth, timer, tasks...)
│   │   ├── hooks/       # Custom hooks (useAuth, useFocusTimer, useTasks...)
│   │   ├── lib/         # Firebase client + API services
│   │   ├── schemas/     # Validações Zod
│   │   ├── stores/      # Estado global Zustand
│   │   ├── types/       # Tipos TypeScript compartilhados
│   │   └── styles/      # Estilos globais (Tailwind)
│   ├── e2e/             # Testes Playwright
│   └── tests/           # Testes unitários Vitest
└── server/              # Backend Node.js + Express
    ├── src/
    │   ├── config/      # Firebase Admin, DB
    │   ├── controllers/ # Lógica das rotas
    │   ├── services/    # Regras de negócio
    │   ├── repositories/# Acesso a dados
    │   ├── middlewares/ # Auth, validações
    │   ├── routes/      # Definição de rotas API
    │   ├── app.ts       # Configuração Express
    │   └── index.ts     # Entrypoint do servidor
    ├── prisma/          # Schema Prisma ORM
    └── tests/           # Testes unitários Vitest
```

## 📌 Resolução de divergências entre README inicial e docs de regras

Foram resolvidas 3 divergências identificadas durante a criação do scaffolding, registradas neste PR:

1. **Divergência de rotas**: O README inicial mencionava rotas `/dashboard/*`, mas os docs de regras de negócio usavam Next.js App Router com route groups `(auth)` e `(private)`, onde as rotas privadas são diretas na raiz (`/`, `/tasks`, `/history`). Resolução: Atualizou-se o README para refletir a estrutura real implementada, alinhando aos docs de RN.
2. **Organização de components**: O README inicial sugeria uma pasta `components/shared/` genérica, mas os RN indicavam separação por domínio de negócio. Resolução: Implementada estrutura `components/{auth,timer,tasks,analytics,profile,notifications,shared}/`, alinhada ao domínio.
3. **Arquivo de design**: O README inicial mencionava `Pomodoro-Project-Design.md` com maiúsculas e hifens no nome, enquanto os docs exigiam o nome em minúsculas. Resolução: Criado arquivo `docs/design/pomodoro-project-design.md` seguindo a nomenclatura dos demais arquivos de documentação.

---

## 🗺️ Roadmap / Status

| Módulo | Status |
| --- | --- |
| Regras de negócio das 4 telas principais | 🟢 Documentadas |
| Scaffolding do repositório (client/server) | 🟡 Em andamento |
| Autenticação híbrida (Google + local) | ⚪ Planejado |
| Timer / sessão de foco | ⚪ Planejado |
| Tasks de estudo | ⚪ Planejado |
| Dashboard / Analytics | ⚪ Planejado |
| PWA | ⚪ Planejado |
| Testes automatizados | ⚪ Planejado |

Legenda: 🟢 concluído · 🟡 em andamento · ⚪ planejado

---

## 📄 Licença

Licença: MIT — `LICENSE` a ser adicionada na criação do repositório.

## O que você pode fazer?

- **Uso livre**: Você pode usar o código em projetos pessoais ou de graça.
- **Uso comercial**: Você pode vender o código ou cobrar por programas que o usam.
- **Mudanças**: Você pode alterar, juntar ou adaptar o código como quiser

---

## 👤 Autor

Desenvolvido por **Wesley** ([@DevWesleyMedeiros](https://github.com/DevWesleyMedeiros)) como parte do portfólio pessoal fullstack.
