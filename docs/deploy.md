# Deploy

## Status

Pendente de preparacao para producao. O README descreve execucao local com Docker Compose e login local `admin` / `admin`.

## Riscos CRÍTICOS para deploy publico

- [ ] CRÍTICO: substituir login `admin` / `admin`.
- [ ] CRÍTICO: substituir token fake/localStorage por autenticacao real.
- [ ] CRÍTICO: bloquear ferramentas de desenvolvimento em ambiente publico (`/dev`, `/api-docs`, Adminer).
- [ ] CRÍTICO: configurar variaveis de producao sem credenciais locais.
- [ ] CRÍTICO: criar e testar backup/restore PostgreSQL antes de dados reais.
- [ ] CRÍTICO: nao expor PostgreSQL/Adminer para a internet.

## Riscos altos

- [ ] ALTO: revisar CORS para dominio de producao.
- [ ] ALTO: revisar HTTPS e dominio.
- [ ] ALTO: revisar logs de producao.
- [ ] ALTO: definir processo de rollback.
- [ ] ALTO: confirmar armazenamento de uploads em producao.

## Checklist antes de deploy

- [ ] Definir plataforma: VPS, Docker, Vercel/servicos separados ou outro. Pendente de confirmacao.
- [ ] Definir `NODE_ENV=production` e variaveis equivalentes.
- [ ] Definir `ENABLE_DEV_TOOLS=false` em producao.
- [ ] Configurar CORS apenas para dominio final.
- [ ] Configurar HTTPS.
- [ ] Configurar backup automatico do PostgreSQL.
- [ ] Testar restore.
- [ ] Testar build da API e do frontend.
- [ ] Validar smoke test: login, dashboard, produtos, estoque e catalogo publico.

## Comandos confirmados

- Instalar tudo: `npm run install:all`.
- Desenvolvimento: `npm run dev`.
- Build: `npm run build`.
- Testes: pendente de confirmacao.
- Check/lint: pendente de confirmacao.

## Links

- [[10-Architecture/padrao-projeto-pdv]]
- [[09-Deploy/checklist-deploy]]
- [[07-Security/checklist-seguranca-web]]

