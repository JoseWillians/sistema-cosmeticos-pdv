# Financeiro

## Status

Nao implementado no MVP atual, conforme `docs/visao-geral-do-sistema.md`. Financeiro, caixa e relatorios avancados aparecem como "Em breve".

## Riscos CRÍTICOS para deploy publico

- [ ] CRÍTICO: nao usar como sistema financeiro/caixa real enquanto fechamento, pagamentos e auditoria nao existirem.
- [ ] CRÍTICO: se houver dados de pagamento/clientes no futuro, definir protecao e retencao antes de producao.

## Riscos altos

- [ ] ALTO: sem fechamento de caixa, nao ha trilha confiavel para operacao financeira.
- [ ] ALTO: sem permissao por perfil, qualquer usuario autenticado pode ter acesso indevido se rotas/telas forem expostas. Pendente de confirmacao.
- [ ] ALTO: logs nao devem armazenar dados sensiveis de pagamento.

## Checklist pendente

- [ ] Definir formas de pagamento.
- [ ] Definir caixa, sangria, suprimento e fechamento quando existirem.
- [ ] Confirmar relatorios financeiros esperados.
- [ ] Documentar regras de desconto e arredondamento.
- [ ] Evitar logs com dados sensiveis de pagamento.
- [ ] Definir auditoria de alteracoes financeiras.
- [ ] Definir permissoes por perfil.
- [ ] Definir reconciliacao entre vendas, estoque e caixa.

## Links

- [[10-Architecture/padrao-projeto-pdv]]
- [[07-Security/checklist-seguranca-web]]

