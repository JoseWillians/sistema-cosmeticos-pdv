# AGENTS.md - sistema-cosmeticos-pdv

## Contexto

Sistema local de gestao/PDV para cosmeticos com frontend React/Vite, API Express/TypeScript e PostgreSQL via Docker Compose conforme README.

## Stack detectada

- Monorepo Node.js.
- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router, Recharts.
- Backend: Node.js, TypeScript, Express, Zod, pg, Helmet, CORS, express-rate-limit, Multer, Swagger.
- Banco: PostgreSQL 16 via Docker Compose.

## Ler antes de mexer

- README.md
- docs/contexto.md
- docs/arquitetura.md
- docs/banco-de-dados.md
- docs/seguranca.md
- docs/regras-de-negocio.md
- apps/api/src/app.ts
- apps/api/src/routes.ts
- apps/web/src/app/router.tsx

## Comandos confirmados no package.json

- Instalar tudo: `npm run install:all`
- Dev completo: `npm run dev`
- Dev API: `npm run dev:api`
- Dev web: `npm run dev:web`
- Build: `npm run build`
- Teste: pendente de confirmacao.
- Check/lint: pendente de confirmacao.
- API dev: `npm --prefix apps/api run dev`
- API build: `npm --prefix apps/api run build`
- API start: `npm --prefix apps/api run start`
- Web dev: `npm --prefix apps/web run dev`
- Web build: `npm --prefix apps/web run build`
- Web preview: `npm --prefix apps/web run preview`

## Regras de seguranca

- Validar entradas com Zod no backend e no frontend quando aplicavel.
- Manter Helmet, CORS restrito e rate limit nas rotas sensiveis.
- Nao expor dados sensiveis em logs, erros ou frontend.
- Validar uploads por tipo, tamanho e destino.

## Banco

- Usar migrations em `database/migrations`.
- Usar queries parametrizadas com `pg`.
- Preservar historico com soft delete quando aplicavel.
- Fazer backup antes de alteracoes destrutivas.

## Arquivos proibidos de alterar sem pedido explicito

- .env, node_modules/, dist/, build/, database/backups/, uploads, dumps e arquivos gerados.

## Resposta esperada

Arquivos alterados, o que foi feito, como testar, riscos e proximos passos.
