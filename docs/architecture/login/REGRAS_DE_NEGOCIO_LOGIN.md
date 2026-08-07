# Regras de Negócio — Tela de Login (Login View)

**Projeto:** focus-flow-project (nome anterior: pomodoro-study) — FocusFlow
**Versão do documento:** v1.2.0 — formalização dos fluxos de recuperação de senha (Google e local, com token)
**Status geral da tela:** 🔴 Proposto (nada implementado ainda)

> Legenda: 🟢 Implementado · 🟡 Em andamento · 🔴 Proposto

---

## 1. Visão geral da tela

Tela responsável pela autenticação do usuário no FocusFlow. Contempla três fluxos de entrada distintos que compartilham a mesma identidade de usuário: login com e-mail/senha, login com Google, e cadastro simples com e-mail/senha — além do fluxo de recuperação de senha. A tela também expõe links para Política de Privacidade e Termos de Serviço.

**Decisão arquitetural central (v1.1.0 — atualizada por você, confirmada):**
A autenticação é **híbrida**, com dois provedores de identidade distintos que convergem para a mesma tabela `User`:

1. **Login com Google** → delegado 100% ao **Firebase Authentication**. O Postgres/Prisma armazena apenas os dados retornados no perfil do Firebase (nome, e-mail, avatar) e o `firebaseUid`. **Nunca** há senha para este tipo de usuário.
2. **Cadastro local (e-mail/senha)** → feito direto pela sua API Express/Prisma, **sem** depender do Firebase. A tabela `User` armazena o **hash da senha** (bcrypt, seguindo o mesmo padrão do Casa do Hambúrguer) e um **token de sessão encriptado**, decriptado/validado no logout —.

Isso significa que a tabela `User` precisa suportar os dois formatos ao mesmo tempo: um campo `passwordHash` **opcional** (`null` para usuários Google) e um `firebaseUid` **opcional** (`null` para usuários locais), com uma constraint de aplicação garantindo que pelo menos um dos dois exista. Essa dualidade é a peça mais delicada do schema — recomendo modelá-la com cuidado (ou até um enum `authProvider: 'GOOGLE' | 'LOCAL'` para deixar explícito qual caminho aquele usuário usa, evitando checagens implícitas espalhadas pelo código).

---

## 2. Requisitos Funcionais (RF)

| ID | Descrição | Status |
| ---- | ----------- | -------- |
| RF-01 | Usuário deve poder se autenticar com e-mail e senha via Firebase Authentication | 🔴 |
| RF-02 | Usuário deve poder se autenticar com sua conta Google via Firebase Auth (OAuth Google) | 🔴 |
| RF-03 | Usuário deve poder criar conta local ao ser redirecionado para uma **tela de cadastro dedicada** (não é modal na própria tela de login), com campos nome, e-mail, senha e confirmar senha | 🔴 |
| RF-04 | Sistema deve exibir, na tela de cadastro, um **texto descritivo da política de senha** (mín. 8 / máx. 15 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial) — sem gerador automático de senha | 🔴 |
| RF-04a | Usuário com conta Google clicando em "FORGOT?" deve ser informado de que a conta usa login do Google, sem tentar redefinição de senha | 🔴 |
| RF-04b | Usuário com conta local clicando em "FORGOT?" deve ser redirecionado à tela `forgot-password` (pede apenas o e-mail) | 🔴 |
| RF-04c | Ao submeter o e-mail em `forgot-password`, o sistema exibe **sempre a mesma mensagem genérica** de sucesso ("se o e-mail existir, você receberá instruções"), independente de o e-mail existir ou de qual provedor usa — evita enumeração de usuários | 🔴 |
| RF-04d | Sistema deve enviar e-mail com link para `reset-password?token=<token>` contendo um token de uso único válido por 15 minutos, apenas para contas locais | 🔴 |
| RF-04e | Tela `reset-password` deve pedir nova senha e confirmação (mesma política de senha do cadastro — RN-AUTH-04), validar o token no submit e não antes (evita expor validade do token via requisição isolada) | 🔴 |
| RF-04f | Após troca de senha bem-sucedida, sistema deve invalidar o token usado e revogar sessões ativas anteriores do usuário, redirecionando para `login` com mensagem de sucesso | 🔴 |
| RF-04g | Se o token for inexistente, expirado ou já utilizado, tela `reset-password` deve exibir erro genérico ("link inválido ou expirado") com opção de solicitar um novo e-mail — sem detalhar qual dos três motivos ocorreu | 🔴 |
| RF-05 | Sistema deve criar/atualizar o registro do usuário no Postgres (tabela `User`) no primeiro login bem-sucedido, vinculado ao `firebaseUid` | 🔴 |
| RF-06 | Sistema deve emitir uma sessão própria do backend (cookie httpOnly) após validar o ID Token do Firebase, para as demais rotas da aplicação não dependerem do SDK client do Firebase a cada request | 🔴 |
| RF-07 | Link "Criar workspace" deve levar à tela de cadastro (e não ser apenas um `href="#"`) | 🔴 |
| RF-08 | Link "FORGOT?" deve abrir a tela/modal de recuperação de senha | 🔴 |
| RF-09 | Todos os textos visíveis ao usuário devem estar em português do Brasil (o `login.html` atual está 100% em inglês) | 🔴 |
| RF-10 | Botão de login com Google deve exibir estado de carregamento e desabilitar múltiplos cliques durante o processo de popup/redirect | 🔴 |

## 3. Regras de Negócio (RN)

| ID | Regra |
| ---- | ------- |
| RN-AUTH-01 | A tabela `User` suporta dois provedores: `firebaseUid` (nulo para usuários locais) e `passwordHash` (nulo para usuários Google). Usuário Google **nunca** tem `passwordHash`; usuário local **nunca** tem `firebaseUid` |
| RN-AUTH-02 | O vínculo Firebase↔Postgres é feito por `firebaseUid` único, nunca por e-mail (e-mail pode mudar; UID não). O vínculo do cadastro local é feito por `email` único |
| RN-AUTH-03 | Se um e-mail já cadastrado localmente tentar entrar via Google (ou vice-versa), o backend deve rejeitar/orientar o conflito explicitamente — **não** deve fazer merge automático silencioso das duas identidades |
| RN-AUTH-04 | Senha de cadastro local: mínimo 8 e máximo 15 caracteres, com pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial — validado com Zod no front (React Hook Form) **e** novamente com Zod no backend antes de gerar o hash (nunca confiar só na validação client-side) |
| RN-AUTH-05 | Senha de cadastro local é armazenada com hash bcrypt (nunca em texto plano, nunca reversível) |
| RN-AUTH-06 | Recuperação de senha tem **duas rotas diferentes**, conforme o provedor do usuário: (a) conta Google → `sendPasswordResetEmail` do Firebase; (b) conta local → fluxo próprio no backend |
| RN-AUTH-07 | Se o usuário existe apenas via Google, o link "FORGOT?" deve identificar esse caso e orientar "Esta conta usa login do Google" em vez de iniciar qualquer reset local |
| RN-AUTH-08 | Fluxo de reset local usa **token de reset**, não e-mail + senha direto no corpo da requisição: `POST /auth/forgot-password { email }` gera um token opaco (ex. `crypto.randomBytes`), salva no Postgres **apenas o hash do token** (nunca o valor puro) vinculado ao `userId`, com `expiresAt` (+15min) e `usedAt` (nulo até o uso), e envia o token puro só por e-mail |
| RN-AUTH-08a | `POST /auth/reset-password { token, newPassword, confirmPassword }` só troca a senha se: o hash do token existir, `expiresAt` não tiver passado, e `usedAt` ainda for nulo. Qualquer uma dessas falhas retorna o mesmo erro genérico (RF-04g) |
| RN-AUTH-08b | Ao trocar a senha com sucesso: marcar `usedAt` no token (torna-o de uso único), gerar novo `passwordHash`, e revogar todas as sessões ativas anteriores do usuário (invalidar cookies/sessões existentes) — protege contra o caso de a conta já estar comprometida |
| RN-AUTH-08c | Solicitar um novo token de reset invalida automaticamente qualquer token anterior ainda não usado para o mesmo usuário (evita múltiplos tokens válidos simultâneos) |
| RN-SEC-01 | A resposta de `POST /auth/forgot-password` é **sempre idêntica** (mesmo texto, mesmo código HTTP) independentemente de o e-mail existir, de estar vinculado a conta Google ou local — a diferenciação (RF-04a vs. envio de token) acontece só no conteúdo do e-mail enviado, nunca na resposta HTTP, para não permitir enumeração de usuários/provedores |
| RN-AUTH-09 | A sessão do backend (cookie httpOnly) tem tempo de vida próprio, independente da sessão do Firebase no client (quando aplicável); logout deve invalidar a sessão do backend e, se Google, também a sessão do Firebase no client |
| RN-AUTH-10 | Rate limiting obrigatório nas rotas de autenticação (`/auth/session`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`) seguindo o mesmo padrão de duas camadas (IP / IP+e-mail) já adotado no Casa do Hambúrguer |
| RN-AUTH-11 | Cookies de sessão devem usar `httpOnly`, `secure` (produção) e `sameSite` compatível com o domínio real de frontend/backend (ver histórico de bug de `sameSite` no Casa do Hambúrguer) |
| RN-UI-01 | O botão "Sign In" deve seguir o efeito de shader/glow definido no `login.html` da própria tela (fonte de verdade — ver seção 5) |
| RN-UI-02 | Links "Não possui conta?" e "Criar workspace" devem ficar visualmente dentro do escopo do card do formulário, não soltos no footer da página como está hoje |
| RN-I18N-01 | Nenhum placeholder, label ou texto de UI pode ficar em inglês na versão final |

## 4. Requisitos Não Funcionais (RNF)

| ID | Descrição |
| ---- | ----------- |
| RNF-01 | Responsividade obrigatória em 3 breakpoints: desktop, tablet e mobile |
| RNF-02 | Formulário deve ter validação client-side (Zod + React Hook Form) além da validação do Firebase |
| RNF-03 | Nenhuma credencial (API key do Firebase client, service account) pode ir para o repositório — apenas variáveis de ambiente |
| RNF-04 | Tempo de resposta percebido: estado de loading em qualquer ação que dependa de rede (login, Google, reset de senha) |
| RNF-05 | Acessibilidade: inputs com `label` associado, foco visível, mensagens de erro anunciadas (`aria-live`) — complementar ao `accessibility_audit.md` que você vai anexar |
| RNF-06 | Toda regra de validação de senha (RN-AUTH-04) deve existir em duplicidade: schema Zod compartilhado ou replicado entre frontend e backend, nunca só um dos lados |
| RNF-07 | Token de reset de senha local (RN-AUTH-08) deve ter expiração curta (sugestão: 15 min) e ser de uso único (invalidado após o primeiro uso ou após nova solicitação) |

## 5. Design system — decisão final (v1.1.0)

Você resolveu a ambiguidade apontada na v1.0.0 deste documento com uma regra clara de precedência:

1. **`login.html` de cada tela é a fonte de verdade** sempre que houver conflito.
2. **`Pomodoro-project-design.md`** (único arquivo geral mantido — os `design.md` individuais por pasta de tela foram removidos) só vale para o que **não** conflita com o `login.html`.

Na prática, para a tela de Login isso significa: os tokens de cor/tipografia já usados no `login.html` (paleta do frontmatter YAML — `primary: #adc6ff`, `background: #081425` etc.) prevalecem sobre a seção "Colors" em prosa do `Pomodoro-project-design.md` (que cita `#3B82F6`/`#0F172A`, nunca usados no código real). Essa regra deve ser aplicada da mesma forma nas próximas telas que você anexar.

## 6. Estrutura de pastas sugerida (apenas para a tela de Login)

### Frontend (Next.js App Router)

```
src/
  app/
    (auth)/
      login/
        page.tsx
      register/
        page.tsx
      forgot-password/
        page.tsx
      reset-password/
        page.tsx
  components/
    auth/
      LoginForm.tsx
      GoogleSignInButton.tsx
      ForgotPasswordForm.tsx
      ResetPasswordForm.tsx
  lib/
    firebase/
      client.ts          # inicialização do Firebase client SDK
    api/
      authService.ts      # axios -> troca ID Token por sessão no backend
  hooks/
    useAuth.ts            # estado de sessão (Zustand ou Context, a definir)
  schemas/
    authSchemas.ts         # Zod: loginSchema, registerSchema, forgotPasswordSchema
  middleware.ts             # protege rotas privadas checando cookie de sessão
```

### Backend (Express)

```
src/
  config/
    firebaseAdmin.ts        # init do Firebase Admin SDK (service account)
  routes/
    authRoutes.ts           # POST /auth/session, POST /auth/logout, GET /auth/me
                             # POST /auth/forgot-password, POST /auth/reset-password
  middlewares/
    verifyFirebaseToken.ts  # valida ID Token recebido do client
    rateLimiter.ts           # reaproveita padrão já criado no Casa do Hambúrguer
  services/
    authService.ts
    resetTokenService.ts    # gera/valida hash do token, expiração, uso único
    mailService.ts           # envio do e-mail de reset (Resend/Nodemailer)
  repositories/
    userRepository.ts        # Prisma: findByFirebaseUid, upsert
  prisma/
    schema.prisma            # model User { firebaseUid @unique, email, name, ... }
                              # model PasswordResetToken { tokenHash @unique, userId, expiresAt, usedAt }
```

## 7. Sugestões de funcionalidades extras (avaliar, não implementado)

- **Confirmação de e-mail** obrigatória antes do primeiro acesso ao app (Firebase já suporta `sendEmailVerification`)
- **"Lembrar-me"** com sessão de longa duração vs. sessão de aba
- **Bloqueio progressivo** após N tentativas falhas (além do rate limit por IP/e-mail)
- **Log de auditoria de login** (IP, user-agent, timestamp) — reaproveitando ideia da ADR-0001 do Casa do Hambúrguer

---
*Próximo passo sugerido por você: anexar as demais telas antes de gerarmos os prompts de implementação por etapa.*
