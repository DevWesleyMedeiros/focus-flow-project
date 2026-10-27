# AGENTS.md — FocusFlow

> Instruções operacionais para agentes de IA atuarem neste repositório.
> Aplicam-se à raiz, `client/`, `server/` e `docs/`, salvo instruções mais específicas.
> Idioma de comunicação, documentação e textos da interface: **português brasileiro**.
> Não marque uma funcionalidade como concluída apenas por existir um arquivo, mock ou placeholder.

## 1. Objetivo e estado real

O FocusFlow é uma aplicação fullstack de produtividade e estudos baseada em sessões Pomodoro, tarefas, histórico e analytics. O código está **em desenvolvimento**: a autenticação backend tem implementação parcial; login/cadastro/reset no frontend ainda têm simulações; Timer, Tasks e Analytics contêm vários placeholders e não devem ser descritos como prontos para produção.

Trabalhe em incrementos pequenos, verificáveis e alinhados com as regras de negócio. Preserve comportamento existente que esteja correto; não reescreva módulos fora do escopo sem justificativa.

## 2. Mapa do monorepo

| Caminho                                                   | Responsabilidade                                                                                           |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `client/`                                                 | Next.js App Router, React, TypeScript, Tailwind CSS, Axios, Zustand, TanStack Query, Zod e React Hook Form |
| `client/src/app/(auth)/`                                  | Login, cadastro, solicitação e redefinição de senha                                                        |
| `client/src/app/(private)/`                               | Dashboard Timer, Tasks, histórico/Analytics e ajuda                                                        |
| `client/src/components/`, `hooks/`, `stores/`, `lib/api/` | UI, composição de estado e clientes de API                                                                 |
| `server/`                                                 | Node.js/Express, controllers, services, middleware e API REST                                              |
| `server/prisma/schema.prisma`                             | Schema **fonte de verdade** do banco; PostgreSQL + Prisma                                                  |
| `server/prisma/migrations/`                               | Histórico de migrações; nunca altere migrações já aplicadas sem avaliação explícita                        |
| `docs/architecture/`                                      | RF/RN/RNF e protótipos por tela                                                                            |
| `docs/design/pomodoro-project-design.md`                  | Design system geral                                                                                        |
| `client/public/screenshots/`                              | Capturas de referência; não presumir que retratem comportamento operacional                                |

O frontend chama a API em `/api` no backend. Não presuma que um método em `client/src/lib/api/` tenha um endpoint correspondente no Express: **confirme na tabela de rotas real**. Não trate um model Prisma como prova de CRUD implementado.

## 3. Fontes de verdade e resolução de conflitos

1. **Segurança, integridade e dados reais prevalecem sobre qualquer protótipo ou requisito inseguro**. Reporte conflitos em vez de reproduzir falhas.
2. Para escopo e aceite: documento da tela em `docs/architecture/<tela>/REGRAS_DE_NEGOCIO_*.md`.
3. Para estrutura/estética específica da tela: seu HTML em `docs/architecture/<tela>/` (`login.html` ou `code.html`) e a imagem de referência, quando existir.
4. Para aspectos não especificados na tela: `docs/design/pomodoro-project-design.md`.
5. Para implementação efetiva, versões e comandos: código, `package.json` e `schema.prisma` no checkout atual.

Quando documentação, design e código divergirem:

- registre o requisito, o arquivo e a diferença;
- diferencie **estado atual**, **estado esperado** e **proposta**;
- não mude decisões de produto, autenticação ou modelo de dados silenciosamente;
- solicite decisão manual quando a ambiguidade afetar segurança, persistência, UX relevante ou compatibilidade.

O documento de login contém ambiguidades conhecidas (por exemplo, RF-01 menciona Firebase para senha local, mas a arquitetura adotada é login local Express/Prisma; `RN-SEC-01` aparece com dois significados). Tome essa ambiguidade como exemplo e sinalize qualquer outra desse tipo antes de mudar seus IDs ou seu conteúdo.

## 4. Escopo das quatro telas

- **Login**: `docs/architecture/login/REGRAS_DE_NEGOCIO_LOGIN.md`; autenticação local e Google, cadastro, recuperação, cookies, proteção de rotas, autorização e validações.
- **Timer**: `docs/architecture/dashboard-timer-view/REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md`; controle real do tempo, 25–60 minutos, incremento permitido, sessão, alarme, score e conclusão.
- **Tasks**: `docs/architecture/study-task-view/REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md`; CRUD, prioridade, categorias, ordenação persistente, filtros, vínculos com sessões e metas.
- **Analytics**: `docs/architecture/dashboard-analytics-view/REGRAS_DE_NEGOCIO_DASHBOARD_ANALYTICS.md`; métricas reais, streak, sessões, intensidade, gráfico semanal e exportação CSV.

Telas privadas dependem de autenticação e autorização no backend. Analytics deve derivar métricas de sessões persistidas, nunca de números fictícios ou contadores imutáveis sem regra de consistência. Todas as consultas e mutações envolvendo `taskId`, `sessionId`, categorias ou perfil precisam verificar o usuário dono do recurso.

## 5. Modos de operação do agente

### AUDIT (padrão quando solicitado avaliar/revisar)

- **Somente leitura**: não edite arquivos, não crie commits nem execute migrações.
- Inspecione a cadeia completa: tela → componente → hook/store → cliente HTTP → rota → middleware → controller/service → Prisma → testes.
- Classifique requisitos em: implementado e testado; parcial; ausente; proposta; inconsistência documental.
- Cite caminhos e linhas quando puder comprovar; nunca deduza sucesso apenas de comentários, tipos, mocks ou UI.
- Entregue relatório com evidências, risco, prioridade, reprodução e critérios de aceite. Sinalize o que não foi possível executar.

### IMPLEMENT (somente quando solicitado implementar)

1. Confirme branch, diff e escopo; não sobrescreva mudanças preexistentes do usuário.
2. Leia regras e HTML da tela, dependências e código existente.
3. Planeje tarefas com dependências, riscos e testes antes de alterações importantes.
4. Faça mudanças pequenas, com validação frontend **e** backend, e testes correspondentes.
5. Execute as verificações disponíveis e informe os resultados honestamente.
6. Atualize status documental **somente após evidência suficiente**.
7. Entregue resumo dos arquivos alterados, testes, riscos residuais, pendências e ações manuais.

Nunca assuma autonomia para publicar em produção, trocar credenciais, fazer merge/push, apagar dados ou alterar configurações externas.

## 6. Flags documentais e evidência obrigatória

Conserve os IDs `RF-*`, `RN-*`, `RNF-*` e `US-*` existentes sempre que possível.

- 🟢 **Implementado e validado**: fluxo funcional ponta a ponta quando aplicável, testes adequados e sem bloqueador conhecido.
- 🟡 **Parcial/em andamento**: UI, endpoint, banco ou testes incompletos; ou integração não validada.
- 🔴 **Pendente**: registrado mas ainda sem implementação operacional.
- 🔵 **Proposta**: ideia fora do escopo aprovado; não implementar automaticamente.
- ⚪ **Não aplicável/descartado**: somente após decisão explícita, com justificativa.

Para cada mudança de flag, documente: ID, evidência (arquivos), comportamento verificado, teste e resultado, limitações. A ausência de flag nos três documentos não-login **não** significa concluído. Na auditoria, apresente também funcionalidades visíveis no HTML mas não rastreadas por RF/RN. Antes de reescrever documentos, proponha normalização sem apagar histórico.

## 7. Segurança — condições obrigatórias

- Autenticação **híbrida**: usuários locais com bcrypt + banco; usuários Google via Firebase Authentication e ID token validado pelo Firebase Admin no servidor. Não fazer merge de contas por e-mail silenciosamente. Nunca armazenar senha de usuário Google.
- Proteger **todas** as rotas privadas na API com autenticação e **autorização por recurso**. Middleware do frontend é adicional, nunca único controle. Negar acesso por padrão.
- Sessão por cookie `httpOnly`, `secure` em produção e `sameSite`/domínio adequados; estudar CSRF nos endpoints que alteram estado. Não expor tokens ou dados sensíveis em URL/logs além do estritamente necessário.
- Não utilizar segredo JWT de fallback em produção. Validação de expiração, revogação de sessão no logout/na redefinição de senha, e prevenção de reutilização de token devem ser comprovadas por teste.
- Reset: token criptograficamente aleatório, armazenado apenas como hash, expiração curta, uso único **atômico**, invalidação dos anteriores, resposta genérica sem enumeração. Nunca registrar em log o link/token real.
- Validação de entrada com Zod no servidor; schemas compatíveis no cliente. Hash de senhas (bcrypt), consultas parametrizadas via Prisma e erros públicos sem vazamento de informação interna.
- Rate limiting nas rotas sensíveis, com proteção compatível com ambiente multi-instância e proxy confiável. Testar tentativas inválidas e abuso.
- Segredos só em variáveis de ambiente/secret manager; **não** adicionar `.env`, credenciais, chaves de service account, tokens ou dumps ao Git. A configuração pública do Firebase client não é uma credencial secreta; a conta de serviço do Admin SDK é.
- Não acessar banco de produção para testes, não executar `migrate reset`, `db push` ou `migrate deploy` sem autorização adequada e checagem do ambiente.
- Tratar scanner de segredos, dependências vulneráveis, CORS, headers, cookies, CSRF e exposição de dados como parte da revisão antes de deploy.

## 8. Convenções de implementação

- TypeScript forte; evite `any`, casts arbitrários e suposições não verificadas.
- Next.js App Router: separar componentes client/server de modo intencional; não importar segredos/server SDK no client.
- UI acessível e responsiva, com `label` correto, foco visível, feedback de erro/estado de rede, estados vazios/loading e texto em pt-BR. Preserve identidade visual dos protótipos dentro dos limites de acessibilidade e desempenho.
- Backend Express por responsabilidades: rota fina → controller → service → Prisma. Não colocar regras críticas exclusivamente na UI.
- Axios/TanStack Query para comunicação/cache remoto, Zustand para estado local adequado; evitar duplicar fontes de verdade.
- Use transações quando múltiplas operações precisam ser atômicas. Evite condições de corrida em reset, tarefas ordenadas e sessões.
- Métricas do timer devem refletir dados reais e comportamento sob pausa, recarga de página e múltiplas abas, conforme requisitos aprovados.
- Não introduza dependência, atualização major ou mudança de arquitetura sem explicar custos, alternativas e impacto.

## 9. Comandos e validação (verificar scripts antes de executar)

Execute no diretório correspondente; o monorepo possui `client/package.json` e `server/package.json`, mas **não** um `package.json` raiz para a aplicação.

```bash
# Frontend
cd client
bun install
bun run dev        # package.json atual: porta 4000
bun run build
bun run test
bun run test:e2e

# Backend
cd server
bun install
bun run dev        # porta definida por PORT; .env.example usa 8080
bun run build
bun run test
bun run prisma:generate
```

**Atenção:** o `client/playwright.config.ts` atual diverge do script de desenvolvimento: usa `baseURL` na porta `3000`, `webServer.url` em `3002`, enquanto `client/package.json` inicia em `4000`. Verifique e corrija a configuração antes de confiar no E2E; não declare testes aprovados se o ambiente não iniciou. `client/package.json` contém `lint: next lint`, que deve ser verificado quanto à compatibilidade da versão instalada. Não altere lockfiles indiscriminadamente; preserve o gerenciador usado no módulo.

Antes de marcar 🟢, preferir:

1. lint/typecheck/build sem erros atribuíveis à mudança;
2. Vitest dos schemas, serviços e componentes afetados;
3. Supertest para endpoints (incluindo 401/403, erros e limites);
4. Playwright para a jornada real quando o ambiente permitir;
5. testes de autenticação, isolamento entre usuários, revogação de sessão, expiração/reuso de tokens e acessibilidade pertinentes.

Se algo não rodar, apresente comando tentado, erro e distinção entre falha existente, falha introduzida ou dependência de ambiente.

## 10. STOP obrigatório para ação manual

Quando uma tarefa depender de atuação do proprietário, **interrompa a parte bloqueada** e emita exatamente:

`STOP: MANUAL_ACTION_REQUIRED`

Descreva em seguida:

- **Motivo:** dependência ou risco específico.
- **Ação do usuário:** passos objetivos sem solicitar que cole segredos no chat.
- **Onde executar:** Firebase Console, provedor de e-mail, Cloudinary, hospedagem, banco ou repositório.
- **Como validar:** verificação segura e reproduzível.
- **O que ficou concluído e o que está bloqueado.**
- **Próximo passo após a confirmação:** ação concreta que o agente fará.

Gatilhos: OAuth/provider e domínios autorizados, secrets, DNS, chaves, serviços externos, operações destrutivas, deploy/migração de produção, políticas sensíveis, custos, ambiguidades de produto/segurança e concessão de permissões.

Não crie chaves fictícias, não simule confirmação do serviço externo e não continue o fluxo dependente do passo manual. Trabalho independente e seguro pode prosseguir se isso não causar confusão.

## 11. Formato de entrega

Ao concluir uma auditoria ou implementação, responda com:

1. Escopo e branch analisados.
2. Matriz RF/RN/RNF com **status anterior → status comprovado**, evidências e pendências.
3. Arquivos analisados/alterados.
4. Resultados reais de build, testes e verificações, inclusive os não executados.
5. Riscos de segurança, desempenho e UX classificados por severidade.
6. Ações manuais/`STOP`, se houver.
7. Próxima ação recomendada, sem afirmar deploy ou prontidão sem evidência.

**Regra final:** prefira comportamento correto, seguro, simples, testável e documentado a uma entrega visualmente convincente, mas simulada.
