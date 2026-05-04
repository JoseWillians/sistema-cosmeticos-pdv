import { pool } from "../../database/connection.js";

type AnyRow = Record<string, number | string>;

export const dashboardRepository = {
  async getKpis() {
    // KPIs usam a view de estoque para manter a mesma regra das telas de Produtos e Estoque.
    const { rows } = await pool.query<AnyRow>(`
      SELECT
        COUNT(*)::int AS "totalProdutos",
        SUM(CASE WHEN estoque_disponivel > 0 THEN 1 ELSE 0 END)::int AS "produtosEmEstoque",
        SUM(CASE WHEN estoque_disponivel <= estoque_minimo AND estoque_disponivel > 0 THEN 1 ELSE 0 END)::int AS "estoqueBaixo",
        SUM(CASE WHEN estoque_disponivel <= 0 THEN 1 ELSE 0 END)::int AS esgotados,
        COALESCE(SUM(preco_custo * estoque_disponivel), 0) AS "valorEstoqueCusto",
        COALESCE(SUM(preco_venda * estoque_disponivel), 0) AS "valorEstoqueVenda"
      FROM vw_estoque_produtos
    `);
    return rows[0];
  },

  async getProdutosPorCategoria() {
    const { rows } = await pool.query<AnyRow>(`
      SELECT categoria AS nome, COUNT(*)::int AS quantidade
      FROM vw_estoque_produtos
      GROUP BY categoria
      ORDER BY quantidade DESC, categoria
    `);
    return rows;
  },

  async getProdutosPorMarca() {
    const { rows } = await pool.query<AnyRow>(`
      SELECT marca AS nome, COUNT(*)::int AS quantidade
      FROM vw_estoque_produtos
      GROUP BY marca
      ORDER BY quantidade DESC, marca
      LIMIT 10
    `);
    return rows;
  },

  async getStatusEstoque() {
    const { rows } = await pool.query<AnyRow>(`
      SELECT status_estoque AS status, COUNT(*)::int AS quantidade
      FROM vw_estoque_produtos
      GROUP BY status_estoque
      ORDER BY status_estoque
    `);
    return rows;
  },

  async getEntradasPorPeriodo() {
    const { rows } = await pool.query<AnyRow>(`
      SELECT TO_CHAR(DATE_TRUNC('month', estoque_movimentos.criado_em), 'YYYY-MM') AS periodo,
        COALESCE(SUM(estoque_movimentos.quantidade), 0)::int AS quantidade
      FROM estoque_movimentos
      INNER JOIN produtos p ON p.id = estoque_movimentos.produto_id
      WHERE estoque_movimentos.tipo IN ('ENTRADA', 'AJUSTE_ENTRADA')
        AND p.excluido_em IS NULL
        AND estoque_movimentos.criado_em >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', estoque_movimentos.criado_em)
      ORDER BY periodo
    `);
    return rows;
  },

  async getProdutosCriticos() {
    const { rows } = await pool.query<AnyRow>(`
      SELECT produto_id AS id, codigo, produto AS nome, marca, categoria,
        estoque_disponivel AS "estoqueAtual",
        estoque_minimo AS "estoqueMinimo",
        status_estoque AS status
      FROM vw_estoque_produtos
      WHERE status_estoque IN ('BAIXO', 'ESGOTADO')
      ORDER BY estoque_disponivel ASC, estoque_minimo DESC, produto
      LIMIT 10
    `);
    return rows;
  }
};
