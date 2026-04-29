-- Soft delete preserva historico e evita apagar cadastros usados por produtos/estoque.
ALTER TABLE marcas ADD COLUMN excluido_em DATETIME NULL;
ALTER TABLE categorias ADD COLUMN excluido_em DATETIME NULL;
ALTER TABLE produtos ADD COLUMN excluido_em DATETIME NULL;

CREATE INDEX idx_marcas_ativo ON marcas (ativo);
CREATE INDEX idx_marcas_excluido_em ON marcas (excluido_em);
CREATE INDEX idx_categorias_ativo ON categorias (ativo);
CREATE INDEX idx_categorias_excluido_em ON categorias (excluido_em);
CREATE INDEX idx_produtos_excluido_em ON produtos (excluido_em);
