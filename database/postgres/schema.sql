-- Schema PostgreSQL do JW PDV.
-- O MySQL antigo foi preservado por backup/volume; este arquivo inicializa o banco atual em novos containers PostgreSQL.

CREATE TABLE IF NOT EXISTS marcas (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  excluido_em TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS categorias (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  excluido_em TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS produtos (
  id BIGSERIAL PRIMARY KEY,
  marca_id BIGINT NOT NULL REFERENCES marcas(id),
  categoria_id BIGINT NOT NULL REFERENCES categorias(id),
  codigo VARCHAR(40) NOT NULL UNIQUE,
  codigo_barras VARCHAR(80) NULL,
  imagem_principal_url VARCHAR(500) NULL,
  nome VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NULL UNIQUE,
  descricao_curta VARCHAR(255) NULL,
  visivel_no_catalogo BOOLEAN NOT NULL DEFAULT TRUE,
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  mais_vendido BOOLEAN NOT NULL DEFAULT FALSE,
  novo BOOLEAN NOT NULL DEFAULT FALSE,
  ordem_exibicao INTEGER NULL,
  unidade VARCHAR(10) NOT NULL DEFAULT 'UN',
  preco_custo NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  preco_venda NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  preco_custo_promocional NUMERIC(10,2) NULL,
  preco_venda_promocional NUMERIC(10,2) NULL,
  promocao_ativa BOOLEAN NOT NULL DEFAULT FALSE,
  promocao_inicio DATE NULL,
  promocao_fim DATE NULL,
  promocao_observacao TEXT NULL,
  estoque_minimo INTEGER NOT NULL DEFAULT 0,
  controlar_estoque BOOLEAN NOT NULL DEFAULT TRUE,
  descricao TEXT NULL,
  observacoes TEXT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  excluido_em TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS estoque_movimentos (
  id BIGSERIAL PRIMARY KEY,
  produto_id BIGINT NOT NULL REFERENCES produtos(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA', 'AJUSTE_ENTRADA', 'AJUSTE_SAIDA')),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  custo_unitario NUMERIC(10,2) NULL,
  compra_promocional BOOLEAN NOT NULL DEFAULT FALSE,
  observacao VARCHAR(255) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_produtos_updated_at ON produtos;
CREATE TRIGGER trg_produtos_updated_at
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_marcas_nome ON marcas (nome);
CREATE INDEX IF NOT EXISTS idx_marcas_ativo ON marcas (ativo);
CREATE INDEX IF NOT EXISTS idx_marcas_excluido_em ON marcas (excluido_em);
CREATE INDEX IF NOT EXISTS idx_categorias_nome ON categorias (nome);
CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias (ativo);
CREATE INDEX IF NOT EXISTS idx_categorias_excluido_em ON categorias (excluido_em);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos (nome);
CREATE INDEX IF NOT EXISTS idx_produtos_marca_id ON produtos (marca_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria_id ON produtos (categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos (ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_excluido_em ON produtos (excluido_em);
CREATE INDEX IF NOT EXISTS idx_produtos_catalogo ON produtos (visivel_no_catalogo, destaque, mais_vendido, novo, ordem_exibicao);
CREATE INDEX IF NOT EXISTS idx_estoque_produto_id ON estoque_movimentos (produto_id);

CREATE OR REPLACE VIEW vw_estoque_produtos AS
-- A view representa o estoque ativo: produtos arquivados permanecem no banco, mas saem da operacao diaria.
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
