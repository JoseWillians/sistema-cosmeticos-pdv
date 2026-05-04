# Estoque

## Status

Projeto possui modulo de estoque, tabela de movimentos e view `vw_estoque_produtos`. A documentacao confirma entradas, ajustes, saidas manuais e bloqueio de movimentos para produtos arquivados.

## Regras confirmadas na documentacao

- Saldo calculado por `estoque_movimentos`.
- `ENTRADA` soma saldo.
- `SAIDA` subtrai saldo.
- `AJUSTE_ENTRADA` e `AJUSTE_SAIDA` corrigem contagem.
- Quantidades inteiras nesta versao.
- Produtos arquivados nao devem receber novos movimentos.
- Custo unitario de entrada pode registrar custo da reposicao.

## Riscos CRÍTICOS para deploy publico

- [ ] CRÍTICO: se houver vendas publicas/PDV real, bloquear venda acima do saldo antes de producao. Pendente de confirmacao.
- [ ] CRÍTICO: garantir que usuarios nao autorizados nao possam movimentar estoque.

## Riscos altos

- [ ] ALTO: confirmar impacto de cada movimento em `vw_estoque_produtos`.
- [ ] ALTO: revisar auditoria de movimentos para rastrear quem alterou estoque. Pendente de confirmacao.
- [ ] ALTO: definir politica para correcao de erro em produto arquivado.

## Checklist pendente

- [ ] Confirmar regras de entrada, saida e ajuste.
- [ ] Confirmar campos obrigatorios e validacoes Zod.
- [ ] Confirmar impacto em `vw_estoque_produtos`.
- [ ] Documentar baixa automatica por venda quando existir.
- [ ] Definir relatorios e alertas de estoque baixo.
- [ ] Confirmar se ha permissao por perfil para movimentar estoque.
- [ ] Confirmar se estoque negativo e bloqueado.

## Links

- [[10-Architecture/padrao-projeto-pdv]]
- [[08-Databases/checklist-banco-de-dados]]

