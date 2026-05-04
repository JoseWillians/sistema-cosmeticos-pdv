-- Campos da primeira vitrine publica. Mantem produto unico no admin e controla exibicao no catalogo.
ALTER TABLE produtos
  ADD COLUMN imagem_principal_url VARCHAR(500) NULL AFTER codigo_barras,
  ADD COLUMN slug VARCHAR(180) NULL AFTER nome,
  ADD COLUMN descricao_curta VARCHAR(255) NULL AFTER slug,
  ADD COLUMN visivel_no_catalogo BOOLEAN NOT NULL DEFAULT TRUE AFTER descricao_curta,
  ADD COLUMN destaque BOOLEAN NOT NULL DEFAULT FALSE AFTER visivel_no_catalogo,
  ADD COLUMN mais_vendido BOOLEAN NOT NULL DEFAULT FALSE AFTER destaque,
  ADD COLUMN novo BOOLEAN NOT NULL DEFAULT FALSE AFTER mais_vendido,
  ADD COLUMN ordem_exibicao INT NULL AFTER novo;

CREATE UNIQUE INDEX uk_produtos_slug ON produtos (slug);
CREATE INDEX idx_produtos_catalogo ON produtos (visivel_no_catalogo, destaque, mais_vendido, novo, ordem_exibicao);
