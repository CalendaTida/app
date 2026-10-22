<p align="center"><img src="public/logo.svg" width="112" alt="CalendaTida"></p>

<h1 align="center">CalendaTida</h1>

Acompanhamento de tratamento com canetas (Mounjaro, Zepbound, Wegovy, Ozempic, Poviztra, Extensior, Saxenda, Olire, Victoza, Lirux, Retatrutida): calendário anual, peso semanal, IMC automático e anotações para a consulta. Não substitui orientação médica.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3, `jose` (JWT/JWE) e `next-themes` (tema claro, escuro ou automático).

## Estrutura

```
app/            páginas, layout e rotas de API (login OAuth, dados, logout)
components/     App, Calendar, DayDialog, ConfigForm, ThemeToggle
lib/core.ts     tipos, canetas, datas e cálculo de IMC
lib/server.ts   sessão (JWT), provedores OAuth e armazenamento criptografado
public/         logo.svg e favicon.svg
brand/          logo-512.png e social-preview.png
```

## Rodar localmente

```bash
cp .env.example .env.local   # preencha as variáveis
npm install
npm run dev
```

## Como publicar

1. **Código**: repositório principal, por exemplo `CalendaTida/app`.
2. **Dados**: repositório **privado**, por exemplo `CalendaTida/dados`. Cada usuário vira um arquivo `.jwt` criptografado (JWE, AES-256-GCM).
3. **Token**: GitHub > Settings > Developer settings > Fine-grained tokens. Resource owner: a organização. Acesso só ao repositório de dados, permissão *Contents: Read and write*. Vai em `GH_DATA_TOKEN`.
4. **Vercel**: importe o repositório (ele detecta o Next.js) e cadastre as variáveis de `.env.example`. Gere `SESSION_SECRET` com `openssl rand -hex 32`.
5. **Logins OAuth** (domínio fixo da Vercel). URL de callback de cada um:
   - GitHub (OAuth App criado na organização): `https://SEU-DOMINIO/api/auth/callback/github`
   - Google (Cloud Console > Credenciais > ID do cliente OAuth, tipo Web): `https://SEU-DOMINIO/api/auth/callback/google`
   - Microsoft (Entra ID > Registros de aplicativo, contas em qualquer diretório e contas pessoais, plataforma Web): `https://SEU-DOMINIO/api/auth/callback/microsoft`
6. Faça o redeploy. Botões de provedores sem credenciais não aparecem.

## Observações

- Preview deployments da Vercel têm outro domínio e não logam, a menos que você cadastre o callback deles.
- Cada conta (GitHub, Google ou Microsoft) é um usuário separado; entrar por provedores diferentes não une os dados.
- Um JWT comum só é assinado. Por isso os dados usam JWT criptografado (JWE), com chave derivada de `SESSION_SECRET`. Se você perder esse segredo, os dados salvos não podem ser lidos.
- O IMC é calculado para qualquer idade. Abaixo de 18 anos o app mostra só o número, sem a classificação de adultos.

## Identidade visual

`public/logo.svg` e `public/favicon.svg` (também em `app/icon.svg`); `brand/logo-512.png` para a foto de perfil do repositório; `brand/social-preview.png` em Settings > Social preview.
