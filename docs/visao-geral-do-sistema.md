# Visao Geral do Sistema

## Objetivo

O JW PDV e um sistema local de gestao para loja de cosmeticos. O MVP atual prioriza cadastros essenciais e controle inicial de estoque, sem vendas, caixa ou fiscal.

## Modulos atuais

- Login local com usuario `admin` e senha `admin`.
- Dashboard com indicadores, graficos e estoque critico baseados em produtos e movimentacoes.
- Cadastros auxiliares de marcas e categorias.
- Produtos.
- Estoque.

## Fluxo de produto

O produto precisa ter marca, categoria, codigo, nome, unidade, preco de custo, preco de venda e estoque inicial no cadastro. A unidade usa lista fixa no codigo: `UN`, `KIT`, `CX` e `PC`.

Marcas e categorias sao cadastros auxiliares dos produtos. Elas podem ser desativadas ou arquivadas:

- Desativar: mantem o registro valido no historico, mas evita uso normal em novos produtos.
- Reativar: volta a permitir uso em novos cadastros.
- Arquivar: preenche `excluido_em` e remove das listagens normais, sem apagar fisicamente.

Arquivar marca ou categoria so e permitido quando nao houver produtos vinculados. Produtos antigos continuam mostrando marcas/categorias inativas para preservar o historico e nao quebrar edicoes.

Quando uma tentativa de arquivamento falha por vinculo com produtos, a API retorna erro `409` com uma lista dos produtos que impedem a acao. Esse erro detalhado ajuda o usuario a editar, trocar marca/categoria ou arquivar os produtos antes de tentar novamente.

Produtos tambem usam arquivamento logico. Ao arquivar um produto, o sistema preenche `produtos.excluido_em` e remove o item das listagens principais. O registro continua no banco e as movimentacoes antigas de estoque nao sao apagadas.

Produto arquivado nao aparece em Produtos nem no Estoque ativo. Essa regra evita que o usuario movimente ou conte produto que saiu da operacao atual, mas preserva o historico para consulta tecnica no banco e no painel dev.

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

Marcas e categorias so sao bloqueadas por produtos ativos vinculados (`excluido_em IS NULL`). Produtos arquivados mantem o vinculo historico, mas nao impedem o arquivamento de marca/categoria porque ja sairam das listagens operacionais.

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

- Sistema: MySQL
- Servidor: mysql
- Usuario: cosmeticos
- Senha: cosmeticos123
- Banco: sistema_cosmeticos

As rotas `/dev` e `/api-docs` dependem de `ENABLE_DEV_TOOLS=true` e existem apenas para uso local.

## Segurança básica atual

- CORS permite apenas frontends locais em `localhost`/`127.0.0.1` nas portas `5173` e `5174`.
- `helmet` adiciona headers de seguranca HTTP.
- `express-rate-limit` reduz abuso de requisicoes, com limite mais restrito no login.
- O login segue local `admin`/`admin`; JWT real ainda nao foi implementado.

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
- Upload real de imagem de produto.
