# Backlog

## 1. CRÍTICO antes de produção

- [ ] Substituir login `admin` / `admin`. Motivo: credencial padrao bloqueia deploy publico. Arquivos provaveis: `apps/api/src`, `apps/web/src/pages/login/LoginPage.tsx`. Status: pendente.
- [ ] Substituir token fake no `localStorage`. Motivo: autenticacao atual nao e segura para publico. Arquivos provaveis: `apps/web/src`, `apps/api/src`. Status: pendente.
- [ ] Implementar autorizacao por perfil/permissao. Motivo: operacoes administrativas precisam controle de acesso. Arquivos provaveis: `apps/api/src/routes.ts`, `apps/api/src/shared/middlewares`. Status: pendente.
- [ ] Bloquear `/dev`, `/api-docs` e Adminer em publico. Motivo: ferramentas internas nao podem ficar expostas. Arquivos provaveis: `apps/api/src/modules/dev`, `apps/api/src/config/swagger.ts`, `docker-compose.yml`. Status: pendente.
- [ ] Criar e testar backup/restore PostgreSQL. Motivo: dados reais exigem recuperacao testada. Arquivos provaveis: `database/`, `docs/banco-de-dados.md`. Status: pendente.

## 2. Alta prioridade

- [ ] Revisar CORS por ambiente. Motivo: producao deve aceitar apenas origem final. Arquivos provaveis: `apps/api/src/app.ts`, `apps/api/src/config/env.ts`. Status: pendente.
- [ ] Revisar variaveis de producao. Motivo: credenciais locais nao podem ir para deploy. Arquivos provaveis: `.env.example`, `apps/api/.env.example`, `docs/deploy.md`. Status: pendente.
- [ ] Confirmar scripts de teste/check/lint. Motivo: package atual nao confirma testes automatizados. Arquivos provaveis: `package.json`, `apps/api/package.json`, `apps/web/package.json`. Status: pendente de confirmacao.
- [ ] Garantir que PostgreSQL/Adminer nao fiquem publicos. Motivo: exposicao direta compromete banco. Arquivos provaveis: `docker-compose.yml`, `docs/deploy.md`. Status: pendente.
- [ ] Revisar logs de producao. Motivo: evitar senhas, tokens, SQL e stack traces. Arquivos provaveis: `apps/api/src/shared/errors`, `docs/seguranca.md`. Status: pendente.

## 3. Média prioridade

- [ ] Completar regras de estoque. Motivo: estoque ja existe e precisa regra operacional clara. Arquivos provaveis: `docs/estoque.md`, `apps/api/src/modules/estoque`. Status: pendente.
- [ ] Definir escopo de vendas. Motivo: MVP nao implementa vendas reais. Arquivos provaveis: `docs/vendas.md`. Status: pendente de confirmacao.
- [ ] Definir escopo financeiro. Motivo: caixa/financeiro ainda e "Em breve". Arquivos provaveis: `docs/financeiro.md`. Status: pendente de confirmacao.
- [ ] Confirmar indices principais. Motivo: busca e filtros dependem de indices PostgreSQL. Arquivos provaveis: `database/postgres/schema.sql`, `docs/banco-de-dados.md`. Status: pendente.
- [ ] Confirmar regras de soft delete por entidade. Motivo: historico operacional precisa ser preservado. Arquivos provaveis: `database/migrations`, `docs/banco-de-dados.md`. Status: pendente.

## 4. Baixa prioridade

- [ ] Criar resumo executivo do changelog. Motivo: changelog esta grande. Arquivos provaveis: `docs/changelog.md`. Status: pendente.
- [ ] Documentar telas principais do painel. Motivo: facilitar treinamento e suporte. Arquivos provaveis: `docs/visao-geral-do-sistema.md`. Status: pendente.
- [ ] Criar checklist manual de smoke test. Motivo: padronizar validacao antes de deploy. Arquivos provaveis: `docs/deploy.md`. Status: pendente.

## 5. Segurança

- [ ] Implementar autenticacao real. Motivo: token fake nao protege rotas. Arquivos provaveis: `apps/api/src`, `apps/web/src`. Status: pendente.
- [ ] Implementar middleware de autorizacao. Motivo: separar perfis e permissoes. Arquivos provaveis: `apps/api/src/shared/middlewares`, `apps/api/src/routes.ts`. Status: pendente.
- [ ] Validar uploads por tipo, tamanho e destino. Motivo: upload inseguro pode comprometer servidor. Arquivos provaveis: `apps/api/src/shared/middlewares/uploadProdutoImagem.ts`. Status: pendente.
- [ ] Revisar tratamento de erros. Motivo: producao nao deve vazar stack trace/SQL. Arquivos provaveis: `apps/api/src/shared/errors`. Status: pendente.
- [ ] Definir politica de senha. Motivo: login real precisa regras minimas. Arquivos provaveis: `docs/seguranca.md`. Status: pendente de confirmacao.

## 6. Banco de dados

- [ ] Criar rotina de backup. Motivo: dados reais precisam copia recuperavel. Arquivos provaveis: `database/backups`, `docs/banco-de-dados.md`. Status: pendente.
- [ ] Testar restore em ambiente separado. Motivo: backup nao testado nao garante recuperacao. Arquivos provaveis: `docs/banco-de-dados.md`. Status: pendente.
- [ ] Revisar usuario PostgreSQL com menor privilegio. Motivo: reduzir impacto de falhas. Arquivos provaveis: `docker-compose.yml`, `.env.example`. Status: pendente de confirmacao.
- [ ] Revisar migrations existentes. Motivo: producao precisa ordem e rastreabilidade. Arquivos provaveis: `database/migrations`. Status: pendente.
- [ ] Confirmar retencao de backups. Motivo: evitar perda ou acumulo inseguro. Arquivos provaveis: `docs/banco-de-dados.md`. Status: pendente.

## 7. Deploy

- [ ] Definir plataforma final. Motivo: deploy ainda nao esta decidido. Arquivos provaveis: `docs/deploy.md`. Status: pendente de confirmacao.
- [ ] Definir `ENABLE_DEV_TOOLS=false` em producao. Motivo: ferramentas dev nao podem ficar publicas. Arquivos provaveis: `.env.example`, `apps/api/.env.example`. Status: pendente.
- [ ] Configurar HTTPS e dominio. Motivo: acesso publico precisa TLS. Arquivos provaveis: `docs/deploy.md`. Status: pendente.
- [ ] Definir rollback. Motivo: reduzir impacto de deploy ruim. Arquivos provaveis: `docs/deploy.md`. Status: pendente.
- [ ] Confirmar armazenamento de uploads. Motivo: imagens precisam persistir em producao. Arquivos provaveis: `uploads/`, `apps/api/src/shared/middlewares/uploadProdutoImagem.ts`. Status: pendente de confirmacao.

## 8. Documentação

- [ ] Completar `docs/seguranca.md`. Motivo: registrar requisitos antes de producao. Arquivos provaveis: `docs/seguranca.md`. Status: pendente.
- [ ] Completar `docs/banco-de-dados.md`. Motivo: backup, indices e soft delete ainda incompletos. Arquivos provaveis: `docs/banco-de-dados.md`. Status: pendente.
- [ ] Completar `docs/estoque.md`. Motivo: regras operacionais ainda pendentes. Arquivos provaveis: `docs/estoque.md`. Status: pendente.
- [ ] Completar `docs/vendas.md`. Motivo: vendas nao implementadas precisam escopo claro. Arquivos provaveis: `docs/vendas.md`. Status: pendente.
- [ ] Completar `docs/financeiro.md`. Motivo: financeiro nao implementado precisa limites claros. Arquivos provaveis: `docs/financeiro.md`. Status: pendente.

## 9. Testes manuais

- [ ] Testar build da API e web. Motivo: validar empacotamento antes de deploy. Arquivos provaveis: `package.json`, `apps/api/package.json`, `apps/web/package.json`. Status: pendente.
- [ ] Testar login apos substituir auth. Motivo: login e bloqueador critico. Arquivos provaveis: `apps/web/src/pages/login`, `apps/api/src`. Status: pendente.
- [ ] Testar rotas privadas sem token. Motivo: confirmar bloqueio de acesso indevido. Arquivos provaveis: `apps/api/src/routes.ts`. Status: pendente.
- [ ] Testar movimentacao de estoque. Motivo: garantir integridade de saldo. Arquivos provaveis: `apps/api/src/modules/estoque`, `apps/web/src/pages/estoque`. Status: pendente.
- [ ] Testar catalogo publico. Motivo: validar vitrine sem expor admin. Arquivos provaveis: `apps/web/src/features/catalogo`, `apps/api/src/modules/catalogo`. Status: pendente.

## Links

- [[10-Architecture/padrao-projeto-pdv]]
- [[07-Security/security-auditor-codex]]
- [[08-Databases/checklist-banco-de-dados]]
- [[09-Deploy/checklist-deploy]]
