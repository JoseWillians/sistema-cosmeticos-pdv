# Visao Geral do Sistema

## Objetivo

O JW PDV e um sistema local de gestao para loja de cosmeticos. O MVP atual prioriza cadastros essenciais e controle inicial de estoque, sem vendas, caixa ou fiscal.

## Modulos atuais

- Login local com usuario `admin` e senha `admin`.
- Dashboard com indicadores, graficos e estoque critico baseados em produtos e movimentacoes.
- Cadastros auxiliares de marcas e categorias.
- Produtos.
- Estoque.
- Catalogo publico visual em `/catalogo`.

## Fluxo de produto

O produto precisa ter marca, categoria, codigo, nome, unidade, preco de custo, preco de venda e estoque inicial no cadastro. A unidade usa lista fixa no codigo: `UN`, `KIT`, `CX` e `PC`.

Marcas e categorias sao cadastros auxiliares dos produtos. Elas podem ser desativadas ou arquivadas:

- Desativar: mantem o registro valido no historico, mas evita uso normal em novos produtos.
- Reativar: volta a permitir uso em novos cadastros.
- Arquivar: preenche `excluido_em` e remove das listagens normais, sem apagar fisicamente.

Ao cadastrar uma marca ou categoria, o sistema compara o nome normalizado, ignorando maiusculas/minusculas e espacos extras. Se ja existir um registro ativo, a API bloqueia a duplicidade. Se existir um registro inativo, ele e reativado. Se existir um registro arquivado, ele e restaurado com `excluido_em = NULL`.

Arquivar marca ou categoria so e permitido quando nao houver produtos vinculados. Produtos antigos continuam mostrando marcas/categorias inativas para preservar o historico e nao quebrar edicoes.

Quando uma tentativa de arquivamento falha por vinculo com produtos, a API retorna erro `409` com uma lista dos produtos que impedem a acao. Esse erro detalhado ajuda o usuario a editar, trocar marca/categoria ou arquivar os produtos antes de tentar novamente.

Produtos tambem usam arquivamento logico. Ao arquivar um produto, o sistema preenche `produtos.excluido_em` e remove o item das listagens principais. O registro continua no banco e as movimentacoes antigas de estoque nao sao apagadas.

Produto arquivado nao aparece em Produtos nem no Estoque ativo. Essa regra evita que o usuario movimente ou conte produto que saiu da operacao atual, mas preserva o historico para consulta tecnica no banco e no painel dev.

O codigo e a identidade principal do produto. Ao cadastrar um produto com codigo ja existente e ativo, o sistema bloqueia duplicidade. Se o codigo existir em produto arquivado, o produto antigo e restaurado e atualizado com os novos dados, sem criar outra linha.

Se um produto arquivado for restaurado por cadastro e o estoque inicial informado for diferente do saldo calculado pelos movimentos antigos, a API registra um movimento automatico de ajuste para chegar ao novo saldo desejado. Os movimentos antigos continuam preservados.

## Precos promocionais

Produtos possuem preco padrao de custo e venda. Campos promocionais opcionais registram uma condicao especial sem duplicar o produto:

- `preco_custo_promocional`
- `preco_venda_promocional`
- `promocao_ativa`
- `promocao_inicio`
- `promocao_fim`
- `promocao_observacao`

O preco promocional nao apaga nem substitui o preco padrao. Ele apenas indica uma condicao comercial ativa ou planejada. Vendas reais ainda nao existem nesta fase.

## Dashboard

O dashboard atual foca na fase operacional existente do sistema:

- Total de produtos.
- Produtos em estoque.
- Produtos com estoque baixo.
- Produtos esgotados.
- Valor estimado do estoque por custo e venda.
- Produtos por categoria.
- Produtos por marca.
- Status do estoque.
- Entradas de estoque por periodo.
- Produtos com menor estoque.

Clientes, Vendas, Caixa, Financeiro e Relatorios avancados aparecem como cards `Em breve`. Eles sao apenas placeholders visuais e ainda nao possuem tabelas, regras ou dados reais.

Na edicao, os dados comerciais podem ser alterados, mas o estoque inicial nao e reenviado. Qualquer ajuste de saldo deve ser tratado como movimento de estoque em uma etapa propria.

O dashboard considera somente produtos ativos e nao arquivados. Se todos os produtos estiverem arquivados, os KPIs ficam zerados e os graficos exibem estados vazios orientando o usuario a cadastrar ou revisar produtos ativos.

## Fluxo de estoque

O saldo de estoque e calculado pela tabela `estoque_movimentos`. Entradas somam saldo, saidas subtraem saldo e a view `vw_estoque_produtos` entrega o estoque disponivel para API, dashboard e telas.

O estoque trabalha com quantidades inteiras nesta versao. Isso evita saldos como `1.5` em produtos vendidos por unidade, kit, caixa ou pacote.

Para repor ou ajustar estoque, use a acao Movimentar estoque em Produtos ou Estoque. A reposicao de compra deve ser `ENTRADA`; ajustes manuais positivos e negativos usam `AJUSTE_ENTRADA` e `AJUSTE_SAIDA`.

Tipos de movimento:

- `ENTRADA`: soma quantidade ao estoque, normalmente por compra ou reposicao.
- `AJUSTE_ENTRADA`: soma quantidade por correcao positiva apos contagem.
- `SAIDA`: subtrai quantidade por retirada manual.
- `AJUSTE_SAIDA`: subtrai quantidade por correcao negativa apos contagem.

A observacao informada no modal fica salva somente em `estoque_movimentos.observacao`. Ela documenta o motivo daquele movimento e nao altera a observacao do cadastro do produto.

Produtos arquivados nao podem receber novos movimentos. Se houver erro operacional em um produto arquivado, a correcao deve preservar o historico e ser tratada por uma decisao explicita de cadastro, nao por exclusao fisica de movimentos antigos.

Em entradas de estoque, o movimento pode registrar `custo_unitario` e `compra_promocional`. Esses campos documentam quanto aquela reposicao custou e se veio de uma condicao especial. Eles nao alteram automaticamente o preco padrao do produto e preparam o sistema para calculos futuros de lucro, custo medio ou FIFO.

Marcas e categorias so sao bloqueadas por produtos ativos vinculados (`excluido_em IS NULL`). Produtos arquivados mantem o vinculo historico, mas nao impedem o arquivamento de marca/categoria porque ja sairam das listagens operacionais.

## Catalogo publico

O catalogo publico fica dentro do mesmo frontend em `/catalogo`. Ele e uma vitrine visual para produtos, sem venda real, carrinho persistente, checkout ou login de cliente.

Rotas publicas atuais:

- `/catalogo`
- `/catalogo/produto/:slug`

API publica atual:

- `GET /catalogo/home`
- `GET /catalogo/produtos`
- `GET /catalogo/produtos/:slug`

O tema inicial e `cosmeticos`. Ele centraliza nome visual, textos, cores, labels, WhatsApp e rodape em arquivos de tema. A estrutura fica preparada para temas futuros, como `alimenticio`, `farmaceutico` e `geral`, mas eles ainda nao foram implementados.

Produtos aparecem no catalogo apenas quando:

- nao estao arquivados;
- estao ativos;
- `visivel_no_catalogo = true`.

Produto sem imagem usa placeholder visual. Produto com promocao ativa mostra preco padrao riscado e preco promocional em destaque.

## Imagem principal do produto

O admin de produtos suporta imagem principal por URL e upload local. O upload salva o arquivo em `uploads/produtos` e grava apenas o caminho em `produtos.imagem_principal_url`.

Arquivos de imagem nao sao salvos no banco. O banco armazena somente URL/caminho para manter os registros leves e simples de consultar.

Formatos aceitos no upload local:

- JPEG
- PNG
- WEBP

Limite atual: ate 3MB.

## Login local

O login e propositalmente simples para o MVP. A API aceita `admin` / `admin` e retorna um token fake salvo no `localStorage`.

## Ferramentas locais de desenvolvimento

- Status simples da API: http://localhost:3333/health
- Painel dev: http://localhost:3333/dev
- Tabelas pela API: http://localhost:3333/dev/database
- Rotas principais: http://localhost:3333/dev/routes
- Swagger: http://localhost:3333/api-docs
- Adminer: http://localhost:8081

Para acessar o Adminer:

- Sistema: PostgreSQL
- Servidor: postgres
- Usuario: cosmeticos
- Senha: cosmeticos123
- Banco: sistema_cosmeticos

As rotas `/dev` e `/api-docs` dependem de `ENABLE_DEV_TOOLS=true` e existem apenas para uso local.

## Banco de dados atual

O banco principal atual e PostgreSQL 16 via Docker Compose.

- Servico Docker: `postgres`
- Porta local: `5433`
- Banco: `sistema_cosmeticos`
- Usuario local: `cosmeticos`
- Schema inicial: `database/postgres/schema.sql`
- Seeds: `database/postgres/seeds.sql`

O projeto usava MySQL anteriormente. O MySQL antigo nao foi apagado e seus volumes nao devem ser removidos sem backup e autorizacao. Antes da migracao foi gerado um backup local em `database/backups/mysql-backup-before-postgres-migration.sql`; a pasta `database/backups` fica fora do Git.

## Segurança básica atual

- CORS permite apenas frontends locais em `localhost`/`127.0.0.1` nas portas `5173` e `5174`.
- `helmet` adiciona headers de seguranca HTTP.
- `express-rate-limit` reduz abuso de requisicoes, com limite mais restrito no login.
- Em desenvolvimento, o rate limit geral e mais folgado para nao bloquear testes locais, dashboards e hot reloads.
- `/health` e ferramentas locais `/dev` e `/api-docs` ficam liberadas do rate limit em ambiente local para diagnostico da API.
- O login segue local `admin`/`admin`; JWT real ainda nao foi implementado.

## Busca e indices

A busca de produtos usa debounce no frontend para evitar uma chamada a API a cada tecla digitada. No backend/banco, PostgreSQL usa indices em campos de busca e filtro como codigo, nome, slug, marca, categoria, ativo e `excluido_em`.

Nao ha arvore binaria manual nem arvore de decisao no codigo da aplicacao. Para este sistema, a abordagem correta e usar indices do PostgreSQL, filtros parametrizados e debounce na interface.

## Arquivos que nao devem subir para o Git

- `.env` real nao deve subir porque pode conter credenciais e configuracoes locais.
- `node_modules` nao deve subir porque e recriado com `npm install`.
- `dist` e `build` nao devem subir porque sao gerados pelo build.
- `database/backups` nao deve subir porque pode conter dados reais de clientes ou operacao.
- `.env.example` deve subir porque serve de modelo seguro para configurar o ambiente.

## Futuro

- Vendas completas.
- Caixa.
- Clientes.
- Relatorios.
- Reservas.
- Fiscal/NFC-e.
- Upload avancado com armazenamento externo/CDN, se houver deploy publico.
