-- Produto guarda dados comerciais; o saldo em estoque fica em movimentos separados.
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca_id INT NOT NULL,
  categoria_id INT NOT NULL,
  codigo VARCHAR(40) NOT NULL,
  codigo_barras VARCHAR(80) NULL,
  nome VARCHAR(180) NOT NULL,
  unidade VARCHAR(10) NOT NULL DEFAULT 'UN',
  preco_custo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  preco_venda DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estoque_minimo DECIMAL(10,3) NOT NULL DEFAULT 0.000,
  controlar_estoque BOOLEAN NOT NULL DEFAULT TRUE,
  descricao TEXT NULL,
  observacoes TEXT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_produtos_codigo (codigo),
  KEY idx_produtos_marca_id (marca_id),
  KEY idx_produtos_categoria_id (categoria_id),
  CONSTRAINT fk_produtos_marca FOREIGN KEY (marca_id) REFERENCES marcas(id),
  CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
