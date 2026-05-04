# Seguranca

## Status

Projeto usa Express, Zod, Helmet, CORS, rate limit e PostgreSQL conforme `package.json`, AGENTS.md e documentacao. A documentacao atual tambem confirma que o login local e `admin` / `admin` e usa token fake salvo no `localStorage`.

## Riscos CRÍTICOS para deploy publico

- [ ] CRÍTICO: substituir login `admin` / `admin` antes de qualquer ambiente publico.
- [ ] CRÍTICO: substituir token fake em `localStorage` por autenticacao real.
- [ ] CRÍTICO: implementar autorizacao para rotas privadas e operacoes administrativas.
- [ ] CRÍTICO: garantir que ferramentas `/dev`, `/dev/database`, `/dev/routes`, `/api-docs` e Adminer nao fiquem expostas publicamente.
- [ ] CRÍTICO: revisar variaveis de ambiente de producao sem usar credenciais locais.

## Riscos altos

- [ ] ALTO: revisar CORS por ambiente antes de deploy.
- [ ] ALTO: confirmar rate limit adequado para login e rotas sensiveis.
- [ ] ALTO: validar uploads por tipo, tamanho, extensao e destino.
- [ ] ALTO: garantir logs sem senhas, tokens, dados de cliente ou detalhes internos.
- [ ] ALTO: confirmar tratamento de erros sem stack trace/SQL em producao.

## Checklist de preparacao

- [ ] Manter validacao com Zod em body, params e query.
- [ ] Manter Helmet ativo.
- [ ] Manter `.env` fora do Git e `.env.example` atualizado.
- [ ] Separar variaveis publicas e privadas.
- [ ] Revisar armazenamento de token no frontend.
- [ ] Documentar perfis de usuario e permissoes.
- [ ] Definir politica de senha e recuperacao de acesso. Pendente de confirmacao.

## Links

- [[07-Security/checklist-seguranca-web]]
- [[07-Security/security-auditor-codex]]
- [[10-Architecture/padrao-projeto-pdv]]

