# Visao Geral do Sistema

## Objetivo

O JW PDV e um sistema local de gestao para loja de cosmeticos. O MVP atual prioriza cadastros essenciais e controle inicial de estoque, sem vendas, caixa ou fiscal.

## Modulos atuais

- Login local com usuario `admin` e senha `admin`.
- Dashboard com indicadores de produtos e estoque.
- Marcas.
- Categorias.
- Produtos.
- Estoque.

## Fluxo de produto

O produto precisa ter marca, categoria, codigo, nome, unidade, preco de custo, preco de venda e estoque inicial no cadastro. A unidade usa lista fixa no codigo: `UN`, `KIT`, `CX` e `PC`.

Na edicao, os dados comerciais podem ser alterados, mas o estoque inicial nao e reenviado. Qualquer ajuste de saldo deve ser tratado como movimento de estoque em uma etapa propria.

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
