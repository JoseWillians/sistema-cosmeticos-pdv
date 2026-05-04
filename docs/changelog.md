# Changelog

## 2026-05-04 - Migração local para PostgreSQL e ajuste pós-mudança de pasta

### Alterado

- Projeto validado no caminho novo `C:\Dev\Projetos\sistema-cosmeticos-pdv`.
- Docker Compose passou a usar PostgreSQL 16 no servico `postgres`, com porta local `5433`.
- Adminer foi mantido em `http://localhost:8081`, agora apontando para PostgreSQL.
- Backend migrado de `mysql2/promise` para `pg` com `Pool` compartilhado.
- Queries dos repositories foram convertidas para parametros `$1`, `$2` e `RETURNING`.
- Painel `/dev/database` passou a consultar `information_schema` do PostgreSQL.
- Upload local passou a resolver a raiz do projeto para evitar gravar arquivos na pasta errada apos a mudanca de diretorio.

### Adicionado

- `apps/web/.env.example` com `VITE_API_URL=http://localhost:3333`.
- Estrutura `database/postgres/` com `schema.sql`, `seeds.sql` e pasta `migrations`.
- Backup logico do MySQL antes da migracao em `database/backups/mysql-backup-before-postgres-migration.sql`, ignorado pelo Git.

### Regras e cuidados

- O MySQL antigo nao foi apagado.
- Volumes Docker nao foram removidos.
- `uploads/` continua fora do Git.
- O banco atual documentado passa a ser PostgreSQL; migrations MySQL antigas ficam como historico do projeto.

### Como testar

1. Rodar `docker compose up -d`.
2. Rodar `npm run build`.
3. Abrir `http://localhost:3333/health`.
4. Abrir `http://localhost:3333/dev/database`.
5. Abrir Adminer em `http://localhost:8081` com sistema PostgreSQL e servidor `postgres`.

## 2026-04-29 - Catalogo publico e imagem principal do produto

### Adicionado

- Primeira versao visual do catalogo publico em `/catalogo`.
- Pagina publica de detalhes em `/catalogo/produto/:slug`.
- Tema inicial `cosmeticos` com visual claro, off-white, cards brancos, verde salvia, lavanda e grafite.
- Componentes do catalogo: header, hero, categorias, cards de produto, secoes, beneficios, footer e botao flutuante de WhatsApp.
- API publica:
  - `GET /catalogo/home`
  - `GET /catalogo/produtos`
  - `GET /catalogo/produtos/:slug`
- Campos de catalogo no produto: imagem principal, slug, descricao curta, visibilidade, destaque, mais vendido, novo e ordem de exibicao.
- Upload local de imagem principal em `POST /produtos/:id/imagem`, salvando arquivos em `uploads/produtos`.
- Placeholder visual para produto sem imagem no admin e no catalogo.

### Regras de negocio

- Produto arquivado ou inativo nao aparece no catalogo publico.
- Produto com `visivel_no_catalogo=false` nao aparece no catalogo.
- Produto sem imagem usa placeholder visual, sem depender de imagem externa.
- O catalogo e apenas vitrine publica; ainda nao existe venda real, carrinho persistente ou checkout.

### Arquivos principais

- `apps/api/src/modules/catalogo/*`
- `apps/api/src/shared/middlewares/uploadProdutoImagem.ts`
- `apps/api/src/shared/utils/slugify.ts`
- `apps/web/src/pages/catalogo/*`
- `apps/web/src/features/catalogo/*`
- `database/migrations/009_add_catalog_product_fields.sql`

## 2026-04-29 - Rate limit local e busca com debounce

### Corrigido

- Rate limit geral ficou menos agressivo em desenvolvimento: `1000` requisicoes por minuto.
- Rate limit de producao segue mais restritivo: `300` requisicoes a cada `15` minutos.
- `/health`, `/dev`, `/dev/database`, `/dev/routes` e `/api-docs` nao sao bloqueados pelo rate limit quando o ambiente e local/dev tools.
- Mensagem de rate limit agora retorna JSON com `code: RATE_LIMIT_EXCEEDED`.

### Mantido

- `POST /auth/login` continua com limite especifico e mais restrito: `20` tentativas em desenvolvimento e `10` em producao a cada `15` minutos.

### Adicionado

- Debounce de `400ms` na busca de Produtos para evitar requisição a cada tecla.
- Migration `008_add_search_indexes.sql` com indices seguros para buscas/filtros comuns.

### Observacao tecnica

- Busca deve usar debounce no frontend e indices do banco relacional. No estado atual, esses indices ficam no PostgreSQL. Nao foi implementada arvore binaria ou arvore de decisao porque o problema era bloqueio por rate limit, nao algoritmo de busca em memoria.

## 2026-04-29 - Cadastros inteligentes e precos promocionais

### Adicionado

- Cadastro inteligente de marcas e categorias por nome normalizado.
- Reativacao automatica de marca/categoria inativa ao cadastrar o mesmo nome.
- Restauracao automatica de marca/categoria arquivada ao cadastrar o mesmo nome.
- Filtros em Cadastros: `Ativos`, `Inativos`, `Arquivados` e `Todos`.
- Botao `Restaurar` para marcas/categorias arquivadas.
- Cadastro inteligente de produtos por `codigo`, bloqueando duplicidade ativa.
- Restauracao de produto arquivado ao cadastrar o mesmo codigo, atualizando os dados enviados.
- Ajuste automatico de estoque ao restaurar produto arquivado com estoque inicial diferente do saldo calculado.
- Campos promocionais no produto: custo/venda promocional, promocao ativa, periodo e observacao.
- Campos em `estoque_movimentos`: `custo_unitario` e `compra_promocional`.
- Campo de custo unitario e checkbox de compra promocional no modal de entrada de estoque.

### Alterado

- Listagem de Produtos ganhou filtro `Ativos`, `Arquivados` e `Todos`.
- Produto arquivado mostra badge `Arquivado` e acao `Restaurar`.
- Produto em promocao mostra badge `Promocao` e preco promocional de venda na tabela.
- `POST /estoque/movimentos` aceita custo de entrada, mas ignora custo em saidas.
- `/dev/routes` e Swagger foram atualizados com rotas de restauracao e campos promocionais.

### Regras de negocio reforcadas

- Marcas/categorias ativas duplicadas continuam bloqueadas.
- Marcas/categorias inativas ou arquivadas nao geram nova linha; sao reativadas/restauradas.
- Produto comprado ou vendido em promocao continua sendo o mesmo cadastro.
- Custo unitario por entrada preserva historico de compras sem alterar o preco padrao do produto.

## 2026-04-29 - Dashboard, arquivamento de produto e estoque ativo

### Corrigido

- Movimentacao de estoque agora envia payload padronizado com `produto_id`, `tipo`, `quantidade` inteira e `observacao`.
- Erros de movimentacao mostram a mensagem retornada pela API e registram `response.data` no console para depuracao.
- Produto arquivado nao pode receber nova movimentacao de estoque.
- View `vw_estoque_produtos` recriada para ocultar produtos arquivados da listagem ativa de Estoque.
- Dashboard passou a ignorar movimentos e saldos de produtos arquivados.

### Adicionado

- Modal de confirmacao antes de arquivar produto.
- Empty states melhores para Produtos, Estoque e graficos do Dashboard.
- Migration `006_recreate_estoque_view_active_products.sql` para alinhar o banco local com a regra de estoque ativo.

### Alterado

- Dashboard recebeu cards de KPI com gradientes sutis, graficos mais altos, legends/tooltips e uma leitura rapida mais clara.
- Produtos arquivados continuam no banco e preservam `estoque_movimentos`, mas nao aparecem nas listagens principais.
- Swagger e `/dev/routes` documentam melhor movimentacao de estoque, soft delete e erro de produto arquivado.

### Regras de negocio reforcadas

- Arquivar produto preenche `produtos.excluido_em` e nao faz `DELETE` fisico.
- Estoque ativo considera somente produtos com `excluido_em IS NULL`.
- Marcas/categorias sao bloqueadas apenas por produtos ativos vinculados; produtos arquivados nao impedem o arquivamento.

### Como testar

1. Rodar `npm run build`.
2. Criar produto ativo e abrir Estoque.
3. Registrar `ENTRADA`, `SAIDA`, `AJUSTE_ENTRADA` e `AJUSTE_SAIDA`.
4. Tentar quantidade `1.5` ou `0` e confirmar erro de validacao.
5. Arquivar produto pela tela Produtos e confirmar o modal.
6. Verificar que o produto some de Produtos e Estoque ativo, mas permanece no banco com `excluido_em`.

## 2026-04-29 - Dashboard evoluido e erro de arquivamento detalhado

### Adicionado

- Rota `GET /dashboard/resumo` com KPIs, produtos por categoria, produtos por marca, status do estoque, entradas por periodo e produtos criticos.
- Dashboard inicial com cards, graficos, tabela de estoque critico, painel explicativo e cards de modulos futuros.
- Erro `409` estruturado ao tentar arquivar marca/categoria vinculada a produtos.
- Lista de produtos vinculados no frontend com codigo, nome e link para editar produto.

### Alterado

- Arquivamento bloqueado de marcas/categorias agora informa quais produtos impedem a acao.
- `/dev/routes` e Swagger passaram a listar a rota do dashboard.

### Regra de negocio reforcada

- Marcas e categorias em uso nao podem ser arquivadas porque produtos antigos dependem desses vinculos para manter historico consistente.
- O dashboard atual usa apenas produtos, estoque e movimentacoes; modulos como Clientes, Vendas e Caixa aparecem apenas como expansao futura.

## 2026-04-29 - Segurança básica e cadastros auxiliares

### Adicionado

- Segurança básica no backend com `helmet`.
- Rate limit geral para API e rate limit mais restrito em `POST /auth/login`.
- Página unificada `/cadastros` para gerenciar marcas e categorias.
- Edição, desativação, reativação e arquivamento lógico de marcas.
- Edição, desativação, reativação e arquivamento lógico de categorias.
- Campo `excluido_em` em marcas, categorias e produtos para soft delete.

### Alterado

- Menu lateral agora usa item `Cadastros` no lugar de páginas separadas de marcas/categorias.
- Rotas antigas `/marcas` e `/categorias` do frontend redirecionam para `/cadastros`.
- Produto arquivado usa `excluido_em = NOW()` em vez de exclusão física.
- `/dev/routes` e Swagger documentam as novas rotas de marcas/categorias.

### Segurança

- CORS segue restrito a `localhost` e `127.0.0.1` nas portas `5173` e `5174`.
- `.env` real continua protegido pelo `.gitignore`; exemplos ficam em `.env.example`.
- Repositories revisados para usar queries parametrizadas nos dados de usuário.

### Regras de negócio

- Desativar: `ativo=false`, reversível, esconde de novos cadastros.
- Arquivar: preenche `excluido_em`, remove de listagens normais, sem apagar fisicamente.
- Marcas/categorias com produtos vinculados não podem ser arquivadas; o usuário deve desativar.

## 2026-04-29 - Clareza no modal de movimentacao de estoque

### Alterado

- Label `Quantidade` trocado para `Quantidade a movimentar`.
- Modal agora mostra `Estoque atual` e `Estoque final previsto`.
- Saidas e ajustes negativos exibem alerta quando o estoque final previsto fica abaixo de zero.
- Label de observacao trocado para `Observacao da movimentacao` com placeholder explicativo.

### Regra reforcada

- A observacao digitada no modal fica apenas em `estoque_movimentos.observacao` e nao altera o cadastro do produto.

## 2026-04-29 - Usabilidade, estoque e preparo para Git

### Adicionado

- Funcionalidade de movimentacao de estoque com `POST /estoque/movimentos`.
- Modal de movimentacao em Produtos e Estoque.
- Botao Voltar e Cancelar no formulario de produto.
- Sidebar recolhivel com preferencia salva em `localStorage`.
- Variantes novas do botao reutilizavel: `primary`, `secondary`, `success`, `danger` e `ghost`.

### Alterado

- Botoes refinados com inspiracao visual em Uiverse Buttons, adaptados ao tema do projeto.
- `.gitignore` atualizado para preparar o projeto para Git sem versionar dependencias, builds, `.env`, logs e backups locais.

### Regra de negocio afetada

- Estoque disponivel continua calculado por movimentacoes; reposicao deve ser registrada como `ENTRADA`, sem editar saldo manualmente.
- Quantidade de movimento deve ser inteira e maior que zero.

### Como testar

1. Rodar `npm run build`.
2. Abrir Produtos ou Estoque.
3. Usar Movimentar estoque com `ENTRADA` e confirmar aumento do saldo.
4. Usar `AJUSTE_SAIDA` e confirmar reducao do saldo.
5. Tentar quantidade decimal e confirmar erro de validacao.
6. Recolher a sidebar, recarregar a pagina e confirmar persistencia visual.

## 2026-04-29 - Painel dev, Swagger, Adminer e correção de moeda no produto

### Corrigido

- Edição de produto com `400 Bad Request` ao digitar preço com vírgula.
- Normalização de valores como `080,99`, `80,99`, `1.234,56` e `1234.56` antes do `POST`/`PUT`.
- Mensagens de validação Zod agora retornam `{ message: "Erro de validação", errors: [...] }`.
- Frontend agora registra `response.data` no `console.error` quando a API recusa o payload.

### Adicionado

- Painel visual local em `http://localhost:3333/dev`.
- Visualização de tabelas e prévias em `http://localhost:3333/dev/database`.
- Mapa visual de rotas em `http://localhost:3333/dev/routes`.
- Swagger em `http://localhost:3333/api-docs`.
- Adminer no Docker em `http://localhost:8081`.

### Arquivos principais

- `apps/web/src/lib/parseCurrencyInput.ts`
- `apps/web/src/features/produtos/components/ProdutoForm.tsx`
- `apps/api/src/shared/errors/errorHandler.ts`
- `apps/api/src/modules/dev/*`
- `apps/api/src/config/swagger.ts`
- `apps/api/src/routes.ts`
- `docker-compose.yml`

### Regra de negocio afetada

- Preços podem ser digitados em formato brasileiro no frontend, mas seguem como `number` decimal para o backend.
- Ferramentas `/dev` e `/api-docs` só são registradas quando `ENABLE_DEV_TOOLS=true`.

### Como testar

1. Rodar `npm install` no backend se as dependências Swagger ainda não existirem.
2. Rodar `npm run build`.
3. Rodar `docker compose up -d`.
4. Acessar `/dev`, `/dev/database`, `/dev/routes` e `/api-docs`.
5. Editar um produto com preço `080,99`, salvar e conferir persistência no banco.

## 2026-04-29 - Ajustes de produto, estoque e identidade

### Corrigido

- Edicao de produto nao envia mais `estoque_inicial` no `PUT /produtos/:id`, evitando rejeicao do schema de edicao.
- Formulario de produto agora exibe mensagem de erro e libera o botao de salvar quando a API falha.
- Campos de estoque usam valores inteiros com `step="1"` e conversao para inteiro no frontend.

### Adicionado

- Campo `unidade` virou select fixo com `UN`, `KIT`, `CX` e `PC`.
- Validacao Zod no backend aceita apenas as unidades fixas.
- Validacao Zod de estoque inteiro no backend e frontend.
- Comentarios internos em blocos importantes de API, formulario, layout, repositories e SQL.

### Alterado

- Identidade visual exibida trocada de Maia PDV para JW PDV.
- Subtitulo visual alterado para Gestao de Cosmeticos.
- Listagem de produtos passou a exibir a unidade.

### Arquivos principais

- `apps/api/src/modules/produtos/produtos.schema.ts`
- `apps/api/src/modules/produtos/produtos.repository.ts`
- `apps/api/src/modules/produtos/produtos.service.ts`
- `apps/api/src/modules/estoque/estoque.schema.ts`
- `apps/web/src/features/produtos/components/ProdutoForm.tsx`
- `apps/web/src/pages/produtos/ProdutoFormPage.tsx`
- `apps/web/src/features/produtos/components/ProdutosTable.tsx`
- `apps/web/src/types/produto.ts`
- `database/schema.sql`

### Regra de negocio afetada

- Unidade do produto e uma lista fixa no codigo, sem tabela separada nesta etapa.
- Estoque deve ser inteiro. Estoque inicial e minimo aceitam zero ou mais; movimento de estoque deve ser maior que zero.
- Edicao de dados comerciais do produto nao altera estoque inicial.

### Como testar

1. Rodar `npm run build`.
2. Entrar com `admin` / `admin`.
3. Cadastrar produtos usando unidades `UN`, `KIT`, `CX` e `PC`.
4. Confirmar que estoque inicial e minimo sobem de 1 em 1.
5. Editar um produto e confirmar retorno para `/produtos`.
6. Verificar a listagem de produtos e a pagina de estoque.

## Referencias Codex

- Obsidian: [[06-Codex/checklist-antes-de-pedir-ao-codex]]
- Seguranca: [[07-Security/checklist-seguranca-web]]
- Banco: [[08-Databases/checklist-banco-de-dados]]

