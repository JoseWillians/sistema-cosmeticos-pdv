# Vendas

## Status

Nao implementado no MVP atual, conforme `docs/visao-geral-do-sistema.md`: vendas, caixa, clientes, financeiro e relatorios avancados aparecem como "Em breve" e nao possuem tabelas, regras ou dados reais.

## Riscos CRÍTICOS para deploy publico

- [ ] CRÍTICO: nao anunciar/usar como PDV de vendas reais enquanto o fluxo de vendas nao existir.
- [ ] CRÍTICO: se o deploy publico exigir venda/checkout, implementar autenticacao, autorizacao, baixa de estoque e registro financeiro antes.

## Riscos altos

- [ ] ALTO: definir regras de cancelamento, estorno e edicao de venda.
- [ ] ALTO: definir impacto automatico no estoque.
- [ ] ALTO: definir relatorios minimos para conferencia operacional.

## Checklist pendente

- [ ] Confirmar escopo: catalogo/gestao local ou PDV com venda real.
- [ ] Definir fluxo: carrinho, pagamento, desconto, finalizacao e cancelamento.
- [ ] Confirmar impacto no estoque.
- [ ] Documentar regras de permissao para cancelar/editar venda.
- [ ] Definir relatorios basicos.
- [ ] Definir tabelas de vendas e itens de venda.
- [ ] Definir numeracao/identificador de venda.

## Links

- [[10-Architecture/padrao-projeto-pdv]]
- [[07-Security/checklist-api-security]]

