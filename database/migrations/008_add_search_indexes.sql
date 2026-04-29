-- Indices para buscas e filtros comuns. O MySQL usa esses indices; nao ha necessidade
-- de criar estruturas manuais como arvore binaria no codigo da aplicacao.
SET @schema_name = DATABASE();

SET @sql = IF(
  EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema = @schema_name AND table_name = 'produtos' AND index_name = 'idx_produtos_nome'),
  'SELECT 1',
  'CREATE INDEX idx_produtos_nome ON produtos (nome)'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema = @schema_name AND table_name = 'produtos' AND index_name = 'idx_produtos_ativo'),
  'SELECT 1',
  'CREATE INDEX idx_produtos_ativo ON produtos (ativo)'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema = @schema_name AND table_name = 'marcas' AND index_name = 'idx_marcas_nome'),
  'SELECT 1',
  'CREATE INDEX idx_marcas_nome ON marcas (nome)'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF(
  EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema = @schema_name AND table_name = 'categorias' AND index_name = 'idx_categorias_nome'),
  'SELECT 1',
  'CREATE INDEX idx_categorias_nome ON categorias (nome)'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
