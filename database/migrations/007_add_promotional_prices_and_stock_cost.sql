-- Campos promocionais ficam no produto como referencia comercial, sem duplicar cadastro.
ALTER TABLE produtos
  ADD COLUMN preco_custo_promocional DECIMAL(10,2) NULL AFTER preco_venda,
  ADD COLUMN preco_venda_promocional DECIMAL(10,2) NULL AFTER preco_custo_promocional,
  ADD COLUMN promocao_ativa BOOLEAN NOT NULL DEFAULT FALSE AFTER preco_venda_promocional,
  ADD COLUMN promocao_inicio DATE NULL AFTER promocao_ativa,
  ADD COLUMN promocao_fim DATE NULL AFTER promocao_inicio,
  ADD COLUMN promocao_observacao TEXT NULL AFTER promocao_fim;

-- Custo por entrada registra compras com condicoes diferentes sem alterar preco padrao do produto.
ALTER TABLE estoque_movimentos
  ADD COLUMN custo_unitario DECIMAL(10,2) NULL AFTER quantidade,
  ADD COLUMN compra_promocional BOOLEAN NOT NULL DEFAULT FALSE AFTER custo_unitario;
