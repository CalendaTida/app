<p align="center"><img src="public/logo.svg" width="112" alt="CalendaTida"></p>

<h1 align="center">CalendaTida</h1>

Acompanhamento de tratamento com canetas (Mounjaro, Zepbound, Wegovy, Ozempic, Poviztra, Extensior, Saxenda, Olire, Victoza, Lirux, Retatrutida): calendário anual, peso semanal, IMC automático e anotações para a consulta. Não substitui orientação médica.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3, Supabase Auth, `jose` (JWE) e `next-themes` (tema claro, escuro ou automático).

## Como os dados ficam guardados

- **Supabase:** guarda SOMENTE as contas (e-mail e login, com GitHub ou e-mail e senha). Nenhuma tabela é criada.
- **GitHub (repositório privado de dados):** guarda os dados do tratamento, um arquivo `.jwt` criptografado (JWE, AES-256-GCM) por usuário.
- **Google e Microsoft:** desativados. Para ligar um deles, mude `on: false` para `true` em `components/AuthForm.tsx` e ative o provedor em Authentication > Providers no Supabase.

## Estrutura

```
app/            páginas, layout, rota de dados e callback do login
components/     App, AuthForm, Calendar, DayDialog, ConfigForm, ThemeToggle
lib/core.ts     tipos, canetas, datas e cálculo de IMC
lib/server.ts   sessão (Supabase) e armazenamento criptografado
lib/supabase*.ts  clientes do Supabase (servidor e navegador)
middleware.ts   renova a sessão do Supabase
public/         logo.svg e favicon.svg
brand/          logo-512.png e social-preview.png
```

## Rodar localmente (precisa de Node)

```bash
cp .env.example .env.local   # preencha as variáveis
npm install
npm run dev
```

## Como publicar

1. **Repositórios:** `CalendaTida/app` (este código) e `CalendaTida/dados` (privado, vazio).
2. **Supabase** (supabase.com, plano gratuito): crie um projeto.
   - Project Settings > API: copie a *Project URL* e a chave *anon public*.
   - Authentication > Providers > Email: já vem ligado. Deixe "Confirm email" ligado.
   - Authentication > Providers > GitHub: ative e cole o Client ID e o Client Secret do passo 3. Copie a *Callback URL* que o Supabase mostra ali.
   - Authentication > URL Configuration: *Site URL* = seu domínio da Vercel; em *Redirect URLs* adicione `https://SEU-DOMINIO/auth/callback` e `http://localhost:3000/auth/callback`.
3. **GitHub OAuth App** (Settings da organização > Developer settings > OAuth Apps > New): em *Authorization callback URL* use a Callback URL do Supabase (`https://SEU-PROJETO.supabase.co/auth/v1/callback`).
4. **Token dos dados:** GitHub > Settings > Developer settings > Fine-grained tokens. Resource owner: a organização. Acesso só ao repositório `dados`, permissão *Contents: Read and write*.
5. **Vercel:** importe `CalendaTida/app` e cadastre estas variáveis: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SESSION_SECRET` (`openssl rand -hex 32`), `GH_DATA_REPO` (`CalendaTida/dados`) e `GH_DATA_TOKEN`. Faça o deploy depois de cadastrar.

## Observações

- As variáveis `NEXT_PUBLIC_...` precisam existir antes do build; se você as cadastrar depois, faça um novo deploy.
- Se você perder o `SESSION_SECRET`, os dados salvos não podem ser lidos.
- No plano gratuito do Supabase, projetos sem atividade por um tempo são pausados (confira a regra atual no painel) e o envio de e-mails de confirmação tem limite baixo.
- Não há tela de "esqueci a senha" nesta versão.
- O IMC é calculado para qualquer idade. Abaixo de 18 anos o app mostra só o número, sem a classificação de adultos.

## Identidade visual

`public/logo.svg` e `public/favicon.svg` (também em `app/icon.svg`); `brand/logo-512.png` para a foto de perfil; `brand/social-preview.png` em Settings > Social preview.
