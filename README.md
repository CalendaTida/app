<p align="center"><img src="public/logo.svg" width="112" alt="CalendaTida"></p>

<h1 align="center">CalendaTida</h1>

Acompanhamento de tratamento com canetas (semaglutida, tirzepatida, liraglutida e outras): calendário anual, peso semanal, IMC automático e anotações para a consulta. Não substitui orientação médica.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3, Supabase Auth, `jose` (JWE) e `next-themes`.

## Como os dados ficam guardados

- **Supabase:** guarda SOMENTE as contas (e-mail e senha). Nenhuma tabela é criada.
- **GitHub (repositório privado de dados):** guarda os dados do tratamento, um arquivo `.jwt` criptografado (JWE, AES-256-GCM) por usuário.

## Páginas

- `/` página inicial (visitante) ou o app (logado)
- `/entrar` entrar ou criar conta (`/entrar?modo=criar` abre direto em "Criar conta")

## Rodar localmente (precisa de Node)

```bash
cp .env.example .env.local   # preencha as variáveis
npm install
npm run dev
```

## Como publicar

1. **Repositórios:** `CalendaTida/app` (este código) e `CalendaTida/dados` (privado, vazio).
2. **Supabase** (supabase.com): crie um projeto.
   - Project Settings > API: copie a *Project URL* e a chave *anon public*.
   - Authentication > Sign In / Providers > Email: **desligue "Confirm email"**. Assim, quem cria a conta já entra direto.
   - Authentication > URL Configuration: *Site URL* = seu domínio da Vercel.
3. **Token dos dados:** GitHub > Settings > Developer settings > Fine-grained tokens. Resource owner: a organização. Acesso só ao repositório `dados`, permissão *Contents: Read and write*.
4. **Vercel:** importe `CalendaTida/app` e cadastre: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SESSION_SECRET` (`openssl rand -hex 32`), `GH_DATA_REPO` (`CalendaTida/dados`) e `GH_DATA_TOKEN`. Faça o deploy depois de cadastrar.

## Observações

- Não há mais login com GitHub, Google ou Microsoft: só e-mail e senha.
- As variáveis `NEXT_PUBLIC_...` precisam existir antes do build; se cadastrar depois, faça um novo deploy.
- Se você perder o `SESSION_SECRET`, os dados salvos não podem ser lidos.
- No plano gratuito do Supabase, projetos sem atividade por um tempo são pausados (confira a regra atual no painel).
- Não há tela de "esqueci a senha" nesta versão.
- O IMC é calculado para qualquer idade. Abaixo de 18 anos o app mostra só o número, sem a classificação de adultos.

## Identidade visual

`public/logo.svg` e `public/favicon.svg` (também em `app/icon.svg`); `brand/logo-512.png` para a foto de perfil; `brand/social-preview.png` em Settings > Social preview.
