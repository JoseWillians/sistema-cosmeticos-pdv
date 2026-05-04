# Banco de Dados

Banco atual: PostgreSQL 16 via Docker Compose, banco `sistema_cosmeticos`, porta local `5433`.

A view `vw_estoque_produtos` calcula o saldo por produto e classifica o status em `SEM_CONTROLE`, `ESGOTADO`, `BAIXO` ou `OK`.

## Validacao final

- Schema PostgreSQL inicial existe em `database/postgres/schema.sql`.
- Seeds PostgreSQL existem em `database/postgres/seeds.sql`.
- Migrations historicas do ciclo MySQL permanecem em `database/migrations` para rastreabilidade.
- Backups locais devem ficar fora do Git em `database/backups`.
- Queries devem seguir parametrizadas com `pg`.
- Alteracoes destrutivas exigem backup antes de rodar migration.

## Observacao sobre MySQL antigo

O projeto usava MySQL anteriormente. O volume/container antigo nao deve ser apagado sem backup e autorizacao explicita. Antes da migracao para PostgreSQL foi gerado backup local ignorado pelo Git em `database/backups/mysql-backup-before-postgres-migration.sql`.

## Riscos CRÍTICOS para deploy publico

- [ ] CRÍTICO: nao publicar PostgreSQL diretamente na internet.
- [ ] CRÍTICO: nao usar credenciais locais de desenvolvimento em producao.
- [ ] CRÍTICO: criar rotina de backup e restore antes de operar com dados reais.
- [ ] CRÍTICO: testar restore em ambiente separado antes de depender dos backups.

## Riscos altos

- [ ] ALTO: revisar usuario PostgreSQL da aplicacao com menor privilegio.
- [ ] ALTO: confirmar constraints, indices e chaves estrangeiras.
- [ ] ALTO: revisar soft delete para preservar historico operacional.
- [ ] ALTO: garantir que dumps e backups nao entrem no Git.

## Pendencias

- [ ] Documentar rotina de backup/restore.
- [ ] Confirmar indices usados nos filtros principais.
- [ ] Confirmar regras de soft delete por entidade.
- [ ] Confirmar estrategia de migration em producao.
- [ ] Confirmar politica de retencao de backups.
- [ ] Confirmar se dados sensiveis de clientes serao armazenados no futuro.

## Referencias Codex

- Obsidian: [[06-Codex/checklist-antes-de-pedir-ao-codex]]
- Seguranca: [[07-Security/checklist-seguranca-web]]
- Banco: [[08-Databases/checklist-banco-de-dados]]
