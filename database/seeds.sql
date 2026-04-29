USE sistema_cosmeticos;

INSERT INTO marcas (nome) VALUES
  ('Salon Line'),
  ('Natura'),
  ('O Boticario'),
  ('Ruby Rose')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO categorias (nome) VALUES
  ('Cabelo'),
  ('Maquiagem'),
  ('Perfumes'),
  ('Skincare')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO produtos (
  marca_id, categoria_id, codigo, codigo_barras, nome, unidade,
  preco_custo, preco_venda, estoque_minimo, controlar_estoque, descricao
) VALUES
  (1, 1, 'CAB-001', NULL, 'Creme de Pentear Cachos 1kg', 'UN', 18.90, 34.90, 5, TRUE, 'Produto demonstrativo para cabelo.'),
  (2, 4, 'SKN-001', NULL, 'Sabonete Facial Refrescante', 'UN', 12.50, 24.90, 4, TRUE, 'Produto demonstrativo de skincare.'),
  (4, 2, 'MAQ-001', NULL, 'Base Liquida Matte', 'UN', 16.00, 36.90, 3, TRUE, 'Produto demonstrativo de maquiagem.')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO estoque_movimentos (produto_id, tipo, quantidade, observacao)
SELECT p.id, 'ENTRADA', x.quantidade, 'Estoque inicial seed'
FROM produtos p
INNER JOIN (
  SELECT 'CAB-001' AS codigo, 12 AS quantidade
  UNION ALL SELECT 'SKN-001', 8
  UNION ALL SELECT 'MAQ-001', 2
) x ON x.codigo = p.codigo
WHERE NOT EXISTS (
  SELECT 1 FROM estoque_movimentos em WHERE em.produto_id = p.id
);
