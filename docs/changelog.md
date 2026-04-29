# Changelog

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
