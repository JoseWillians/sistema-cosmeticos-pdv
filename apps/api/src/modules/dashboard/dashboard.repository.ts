import type { RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";

type AnyRow = RowDataPacket & Record<string, number | string>;

export const dashboardRepository = {
  async getKpis() {
    // KPIs usam a view de estoque para manter a mesma regra das telas de Produtos e Estoque.
    const [rows] = await pool.query<AnyRow[]>(`
      SELECT
        COUNT(*) AS totalProdutos,
        SUM(CASE WHEN estoque_disponivel > 0 THEN 1 ELSE 0 END) AS produtosEmEstoque,
        SUM(CASE WHEN estoque_disponivel <= estoque_minimo AND estoque_disponivel > 0 THEN 1 ELSE 0 END) AS estoqueBaixo,
        SUM(CASE WHEN estoque_disponivel <= 0 THEN 1 ELSE 0 END) AS esgotados,
        COALESCE(SUM(preco_custo * estoque_disponivel), 0) AS valorEstoqueCusto,
        COALESCE(SUM(preco_venda * estoque_disponivel), 0) AS valorEstoqueVenda
      FROM vw_estoque_produtos
    `);
    return rows[0];
  },

  async getProdutosPorCategoria() {
    const [rows] = await pool.query<AnyRow[]>(`
      SELECT categoria AS nome, COUNT(*) AS quantidade
      FROM vw_estoque_produtos
      GROUP BY categoria
      ORDER BY quantidade DESC, categoria
    `);
    return rows;
  },

  async getProdutosPorMarca() {
    const [rows] = await pool.query<AnyRow[]>(`
      SELECT marca AS nome, COUNT(*) AS quantidade
      FROM vw_estoque_produtos
      GROUP BY marca
      ORDER BY quantidade DESC, marca
      LIMIT 10
    `);
    return rows;
  },

  async getStatusEstoque() {
    const [rows] = await pool.query<AnyRow[]>(`
      SELECT status_estoque AS status, COUNT(*) AS quantidade
      FROM vw_estoque_produtos
      GROUP BY status_estoque
      ORDER BY status_estoque
    `);
    return rows;
  },

  async getEntradasPorPeriodo() {
    const [rows] = await pool.query<AnyRow[]>(`
      SELECT DATE_FORMAT(criado_em, '%Y-%m') AS periodo, COALESCE(SUM(quantidade), 0) AS quantidade
      FROM estoque_movimentos
      WHERE tipo IN ('ENTRADA', 'AJUSTE_ENTRADA')
        AND criado_em >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(criado_em, '%Y-%m')
      ORDER BY periodo
    `);
    return rows;
  },

  async getProdutosCriticos() {
    const [rows] = await pool.query<AnyRow[]>(`
      SELECT produto_id AS id, codigo, produto AS nome, marca, categoria,
        estoque_disponivel AS estoqueAtual,
        estoque_minimo AS estoqueMinimo,
        status_estoque AS status
      FROM vw_estoque_produtos
      WHERE status_estoque IN ('BAIXO', 'ESGOTADO')
      ORDER BY estoque_disponivel ASC, estoque_minimo DESC, produto
      LIMIT 10
    `);
    return rows;
  }
};
