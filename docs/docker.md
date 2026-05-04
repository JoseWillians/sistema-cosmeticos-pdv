# Docker

## Banco de dados atual

O ambiente local usa PostgreSQL 16 via Docker Compose.

- Servico: `postgres`
- Container: `sistema-cosmeticos-postgres`
- Porta local: `5433`
- Banco: `sistema_cosmeticos`
- Usuario: `cosmeticos`
- Adminer: http://localhost:8081

No Adminer, use:

- Sistema: PostgreSQL
- Servidor: `postgres`
- Usuario: `cosmeticos`
- Banco: `sistema_cosmeticos`

## Observacao sobre MySQL antigo

O MySQL foi usado nas primeiras rodadas do projeto. Nao rode `docker compose down -v` nem apague volumes antigos sem backup e autorizacao, pois isso pode remover dados locais.

## Validacao

- `docker compose up -d`
- `docker compose ps`
- `http://localhost:3333/health`
- `http://localhost:3333/dev/database`

