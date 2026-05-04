# JW PDV

Primeira versao local de gestao/PDV para loja de cosmeticos, com foco em cadastro de marcas, categorias, produtos e estoque inicial.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, TypeScript, Express, Zod, pg
- Banco: PostgreSQL 16 via Docker Compose

## Como rodar

```bash
npm run install:all
docker compose up -d
npm run dev
```

URLs padrao:

- Web: http://localhost:5173
- API: http://localhost:3333
- Health: http://localhost:3333/health
- Adminer: http://localhost:8081

Banco local atual:

- Sistema: PostgreSQL
- Servidor no Adminer: `postgres`
- Porta local: `5433`
- Banco: `sistema_cosmeticos`
- Usuario: `cosmeticos`

Login local:

- login: `admin`
- senha: `admin`
