-- Recria a view para que Produtos e Estoque mostrem somente produtos ativos e nao arquivados.
-- O historico segue preservado em estoque_movimentos; apenas a listagem operacional filtra excluido_em.
CREATE OR REPLACE VIEW vw_estoque_produtos AS
SELECT
  p.id AS produto_id,
  p.codigo,
  p.nome AS produto,
  m.nome AS marca,
  c.nome AS categoria,
  p.preco_custo,
  p.preco_venda,
  CASE
    WHEN p.controlar_estoque = FALSE THEN 0
    ELSE COALESCE(SUM(CASE
      WHEN em.tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN em.quantidade
      WHEN em.tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -em.quantidade
      ELSE 0
    END), 0)
  END AS estoque_disponivel,
  p.estoque_minimo,
  CASE
    WHEN p.controlar_estoque = FALSE THEN 'SEM_CONTROLE'
    WHEN COALESCE(SUM(CASE
      WHEN em.tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN em.quantidade
      WHEN em.tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -em.quantidade
      ELSE 0
    END), 0) <= 0 THEN 'ESGOTADO'
    WHEN COALESCE(SUM(CASE
      WHEN em.tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN em.quantidade
      WHEN em.tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -em.quantidade
      ELSE 0
    END), 0) <= p.estoque_minimo THEN 'BAIXO'
    ELSE 'OK'
  END AS status_estoque
FROM produtos p
INNER JOIN marcas m ON m.id = p.marca_id
INNER JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN estoque_movimentos em ON em.produto_id = p.id
WHERE p.ativo = TRUE AND p.excluido_em IS NULL
GROUP BY p.id, p.codigo, p.nome, m.nome, c.nome, p.preco_custo, p.preco_venda, p.estoque_minimo, p.controlar_estoque;
