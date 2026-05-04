-- Schema inicial do JW PDV.
-- O saldo de estoque nao fica salvo em produtos; ele e calculado pela soma dos movimentos.
CREATE DATABASE IF NOT EXISTS sistema_cosmeticos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_cosmeticos;

CREATE TABLE IF NOT EXISTS marcas (
  -- Marcas identificam o fabricante/linha comercial exibida no cadastro de produto.
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  excluido_em DATETIME NULL,
  KEY idx_marcas_ativo (ativo),
  KEY idx_marcas_excluido_em (excluido_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categorias (
  -- Categorias agrupam produtos para filtro e organizacao visual no PDV.
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  excluido_em DATETIME NULL,
  KEY idx_categorias_ativo (ativo),
  KEY idx_categorias_excluido_em (excluido_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS produtos (
  -- Produto depende de marca e categoria para evitar cadastros soltos no estoque.
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca_id INT NOT NULL,
  categoria_id INT NOT NULL,
  codigo VARCHAR(40) NOT NULL,
  codigo_barras VARCHAR(80) NULL,
  imagem_principal_url VARCHAR(500) NULL,
  nome VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NULL,
  descricao_curta VARCHAR(255) NULL,
  visivel_no_catalogo BOOLEAN NOT NULL DEFAULT TRUE,
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  mais_vendido BOOLEAN NOT NULL DEFAULT FALSE,
  novo BOOLEAN NOT NULL DEFAULT FALSE,
  ordem_exibicao INT NULL,
  unidade VARCHAR(10) NOT NULL DEFAULT 'UN',
  preco_custo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  preco_venda DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  preco_custo_promocional DECIMAL(10,2) NULL,
  preco_venda_promocional DECIMAL(10,2) NULL,
  promocao_ativa BOOLEAN NOT NULL DEFAULT FALSE,
  promocao_inicio DATE NULL,
  promocao_fim DATE NULL,
  promocao_observacao TEXT NULL,
  estoque_minimo DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  controlar_estoque BOOLEAN NOT NULL DEFAULT TRUE,
  descricao TEXT NULL,
  observacoes TEXT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  excluido_em DATETIME NULL,
  UNIQUE KEY uk_produtos_codigo (codigo),
  UNIQUE KEY uk_produtos_slug (slug),
  KEY idx_produtos_nome (nome),
  KEY idx_produtos_marca_id (marca_id),
  KEY idx_produtos_categoria_id (categoria_id),
  KEY idx_produtos_ativo (ativo),
  KEY idx_produtos_excluido_em (excluido_em),
  KEY idx_produtos_catalogo (visivel_no_catalogo, destaque, mais_vendido, novo, ordem_exibicao),
  CONSTRAINT fk_produtos_marca FOREIGN KEY (marca_id) REFERENCES marcas(id),
  CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS estoque_movimentos (
  -- Cada entrada, saida ou ajuste vira um movimento; isso preserva historico do saldo.
  id INT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  tipo ENUM('ENTRADA', 'SAIDA', 'AJUSTE_ENTRADA', 'AJUSTE_SAIDA') NOT NULL,
  quantidade DECIMAL(10,3) NOT NULL,
  custo_unitario DECIMAL(10,2) NULL,
  compra_promocional BOOLEAN NOT NULL DEFAULT FALSE,
  observacao VARCHAR(255) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_estoque_produto_id (produto_id),
  CONSTRAINT fk_estoque_produto FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW vw_estoque_produtos AS
-- View usada pela API para listar saldo e status sem duplicar calculo no TypeScript.
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
    ELSE COALESCE(SUM(CASE WHEN em.tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN em.quantidade WHEN em.tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -em.quantidade ELSE 0 END), 0)
  END AS estoque_disponivel,
  p.estoque_minimo,
  CASE
    WHEN p.controlar_estoque = FALSE THEN 'SEM_CONTROLE'
    WHEN COALESCE(SUM(CASE WHEN em.tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN em.quantidade WHEN em.tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -em.quantidade ELSE 0 END), 0) <= 0 THEN 'ESGOTADO'
    WHEN COALESCE(SUM(CASE WHEN em.tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN em.quantidade WHEN em.tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -em.quantidade ELSE 0 END), 0) <= p.estoque_minimo THEN 'BAIXO'
    ELSE 'OK'
  END AS status_estoque
FROM produtos p
INNER JOIN marcas m ON m.id = p.marca_id
INNER JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN estoque_movimentos em ON em.produto_id = p.id
WHERE p.ativo = TRUE AND p.excluido_em IS NULL
GROUP BY p.id, p.codigo, p.nome, m.nome, c.nome, p.preco_custo, p.preco_venda, p.estoque_minimo, p.controlar_estoque;
