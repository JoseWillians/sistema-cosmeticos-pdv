INSERT INTO marcas (nome) VALUES
  ('Salon Line'),
  ('Natura'),
  ('O Boticario'),
  ('Ruby Rose')
ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome;

INSERT INTO categorias (nome) VALUES
  ('Cabelo'),
  ('Maquiagem'),
  ('Perfumes'),
  ('Skincare')
ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome;

INSERT INTO produtos (
  marca_id, categoria_id, codigo, codigo_barras, nome, slug, unidade,
  preco_custo, preco_venda, estoque_minimo, controlar_estoque, descricao
) VALUES
  (1, 1, 'CAB-001', NULL, 'Creme de Pentear Cachos 1kg', 'creme-de-pentear-cachos-1kg', 'UN', 18.90, 34.90, 5, TRUE, 'Produto demonstrativo para cabelo.'),
  (2, 4, 'SKN-001', NULL, 'Sabonete Facial Refrescante', 'sabonete-facial-refrescante', 'UN', 12.50, 24.90, 4, TRUE, 'Produto demonstrativo de skincare.'),
  (4, 2, 'MAQ-001', NULL, 'Base Liquida Matte', 'base-liquida-matte', 'UN', 16.00, 36.90, 3, TRUE, 'Produto demonstrativo de maquiagem.')
ON CONFLICT (codigo) DO UPDATE SET nome = EXCLUDED.nome, slug = EXCLUDED.slug;

INSERT INTO estoque_movimentos (produto_id, tipo, quantidade, observacao)
SELECT p.id, 'ENTRADA', x.quantidade, 'Estoque inicial seed'
FROM produtos p
INNER JOIN (
  VALUES
    ('CAB-001', 12),
    ('SKN-001', 8),
    ('MAQ-001', 2)
) AS x(codigo, quantidade) ON x.codigo = p.codigo
WHERE NOT EXISTS (
  SELECT 1 FROM estoque_movimentos em WHERE em.produto_id = p.id
);
