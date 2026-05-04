import { pool } from "../../database/connection.js";
import type { ProdutoCreateInput, ProdutoUpdateInput, UnidadeProduto } from "./produtos.schema.js";

export interface Produto {
  id: number;
  marca_id: number;
  categoria_id: number;
  codigo: string;
  codigo_barras: string | null;
  imagem_principal_url: string | null;
  nome: string;
  slug: string | null;
  descricao_curta: string | null;
  visivel_no_catalogo: boolean;
  destaque: boolean;
  mais_vendido: boolean;
  novo: boolean;
  ordem_exibicao: number | null;
  unidade: UnidadeProduto;
  preco_custo: number;
  preco_venda: number;
  preco_custo_promocional: number | null;
  preco_venda_promocional: number | null;
  promocao_ativa: boolean;
  promocao_inicio: string | null;
  promocao_fim: string | null;
  promocao_observacao: string | null;
  estoque_minimo: number;
  controlar_estoque: boolean;
  descricao: string | null;
  observacoes: string | null;
  ativo: boolean;
  excluido_em: Date | null;
  marca: string;
  categoria: string;
}

const selectProdutos = `
  SELECT p.*, m.nome AS marca, m.ativo AS marca_ativo, c.nome AS categoria, c.ativo AS categoria_ativo,
    COALESCE(v.estoque_disponivel, 0) AS estoque_disponivel,
    COALESCE(v.status_estoque, 'SEM_CONTROLE') AS status_estoque
  FROM produtos p
  INNER JOIN marcas m ON m.id = p.marca_id
  INNER JOIN categorias c ON c.id = p.categoria_id
  LEFT JOIN vw_estoque_produtos v ON v.produto_id = p.id
  WHERE p.excluido_em IS NULL
`;

function normalizeCreateValues(data: ProdutoCreateInput) {
  return [
    data.marca_id,
    data.categoria_id,
    data.codigo,
    data.codigo_barras || null,
    data.imagem_principal_url || null,
    data.nome,
    data.slug || null,
    data.descricao_curta || null,
    data.visivel_no_catalogo,
    data.destaque,
    data.mais_vendido,
    data.novo,
    data.ordem_exibicao ?? null,
    data.unidade,
    data.preco_custo,
    data.preco_venda,
    data.preco_custo_promocional ?? null,
    data.preco_venda_promocional ?? null,
    data.promocao_ativa,
    data.promocao_inicio || null,
    data.promocao_fim || null,
    data.promocao_observacao || null,
    data.estoque_minimo,
    data.controlar_estoque,
    data.descricao || null,
    data.observacoes || null,
    data.ativo
  ];
}

// Repository concentra SQL cru para manter controllers e services livres de detalhes do PostgreSQL.
export async function listProdutosByStatus(filters: { busca?: string; marca_id?: number; categoria_id?: number; status?: "ativos" | "arquivados" | "todos" }) {
  const params: Array<string | number> = [];
  const where: string[] = [];
  const status = filters.status ?? "ativos";
  const base = selectProdutos.replace("WHERE p.excluido_em IS NULL", status === "arquivados" ? "WHERE p.excluido_em IS NOT NULL" : status === "todos" ? "WHERE 1=1" : "WHERE p.excluido_em IS NULL");

  if (filters.busca) {
    params.push(`%${filters.busca}%`);
    const index = params.length;
    where.push(`(p.codigo ILIKE $${index} OR p.nome ILIKE $${index})`);
  }
  if (filters.marca_id) {
    params.push(filters.marca_id);
    where.push(`p.marca_id = $${params.length}`);
  }
  if (filters.categoria_id) {
    params.push(filters.categoria_id);
    where.push(`p.categoria_id = $${params.length}`);
  }

  const sql = `${base} ${where.length ? `AND ${where.join(" AND ")}` : ""} ORDER BY p.excluido_em IS NOT NULL, p.nome`;
  const { rows } = await pool.query<Produto>(sql, params);
  return rows;
}

export const listProdutos = listProdutosByStatus;

export async function findProdutoById(id: number) {
  const { rows } = await pool.query<Produto>(`${selectProdutos} AND p.id = $1`, [id]);
  return rows[0] ?? null;
}

export async function findProdutoArchiveStatusById(id: number) {
  const { rows } = await pool.query<{ id: number; excluido_em: Date | null }>(
    "SELECT id, excluido_em FROM produtos WHERE id = $1",
    [id]
  );
  return rows[0] ?? null;
}

export async function findProdutoByCodigoIncludingArchived(codigo: string) {
  const { rows } = await pool.query<Produto>(
    `${selectProdutos.replace("WHERE p.excluido_em IS NULL", "WHERE 1=1")} AND LOWER(TRIM(p.codigo)) = LOWER(TRIM($1))`,
    [codigo]
  );
  return rows[0] ?? null;
}

export async function findProdutoBySlugIncludingArchived(slug: string, ignoreId?: number) {
  const params: Array<string | number> = [slug];
  let sql = `${selectProdutos.replace("WHERE p.excluido_em IS NULL", "WHERE 1=1")} AND p.slug = $1`;
  if (ignoreId) {
    sql += " AND p.id <> $2";
    params.push(ignoreId);
  }
  const { rows } = await pool.query<Produto>(sql, params);
  return rows[0] ?? null;
}

export async function getEstoqueAtualByProdutoId(id: number) {
  const { rows } = await pool.query<{ estoque_atual: number }>(
    `SELECT COALESCE(SUM(CASE
      WHEN tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN quantidade
      WHEN tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -quantidade
      ELSE 0
    END), 0)::int AS estoque_atual
    FROM estoque_movimentos
    WHERE produto_id = $1`,
    [id]
  );
  return Number(rows[0]?.estoque_atual ?? 0);
}

export async function createProduto(data: ProdutoCreateInput) {
  const client = await pool.connect();
  try {
    // Produto e estoque inicial precisam nascer juntos; a transacao evita produto sem movimento.
    await client.query("BEGIN");
    const { rows } = await client.query<{ id: number }>(
      `INSERT INTO produtos (
        marca_id, categoria_id, codigo, codigo_barras, imagem_principal_url, nome, slug,
        descricao_curta, visivel_no_catalogo, destaque, mais_vendido, novo, ordem_exibicao, unidade,
        preco_custo, preco_venda, preco_custo_promocional, preco_venda_promocional,
        promocao_ativa, promocao_inicio, promocao_fim, promocao_observacao,
        estoque_minimo, controlar_estoque,
        descricao, observacoes, ativo
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      ) RETURNING id`,
      normalizeCreateValues(data)
    );
    const produtoId = rows[0].id;

    if (data.controlar_estoque && data.estoque_inicial > 0) {
      await client.query(
        "INSERT INTO estoque_movimentos (produto_id, tipo, quantidade, observacao) VALUES ($1, 'ENTRADA', $2, $3)",
        [produtoId, data.estoque_inicial, "Estoque inicial"]
      );
    }

    await client.query("COMMIT");
    return findProdutoById(produtoId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateProduto(id: number, data: ProdutoUpdateInput) {
  // Atualizacao parcial preserva campos que nao vieram do formulario e evita montar SQL fixo duplicado.
  const fields = Object.entries(data).filter(([, value]) => value !== undefined);
  if (!fields.length) return findProdutoById(id);

  const assignments = fields.map(([key], index) => `${key} = $${index + 1}`).join(", ");
  const values = fields.map(([, value]) => value ?? null);
  const { rows } = await pool.query<{ id: number }>(
    `UPDATE produtos SET ${assignments} WHERE id = $${values.length + 1} RETURNING id`,
    [...values, id]
  );
  return rows[0] ? findProdutoById(rows[0].id) : null;
}

export async function restoreProdutoFromCreate(id: number, data: ProdutoCreateInput) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Produto comprado em promocao continua sendo o mesmo cadastro; restaurar atualiza os dados comerciais.
    await client.query(
      `UPDATE produtos SET
        marca_id = $1, categoria_id = $2, codigo = $3, codigo_barras = $4, imagem_principal_url = $5, nome = $6, slug = $7,
        descricao_curta = $8, visivel_no_catalogo = $9, destaque = $10, mais_vendido = $11, novo = $12, ordem_exibicao = $13, unidade = $14,
        preco_custo = $15, preco_venda = $16, preco_custo_promocional = $17, preco_venda_promocional = $18,
        promocao_ativa = $19, promocao_inicio = $20, promocao_fim = $21, promocao_observacao = $22,
        estoque_minimo = $23, controlar_estoque = $24, descricao = $25, observacoes = $26,
        ativo = TRUE, excluido_em = NULL
      WHERE id = $27`,
      [...normalizeCreateValues(data).slice(0, 26), id]
    );

    if (data.controlar_estoque) {
      const { rows } = await client.query<{ estoque_atual: number }>(
        `SELECT COALESCE(SUM(CASE
          WHEN tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN quantidade
          WHEN tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -quantidade
          ELSE 0
        END), 0)::int AS estoque_atual
        FROM estoque_movimentos
        WHERE produto_id = $1`,
        [id]
      );
      const diferenca = data.estoque_inicial - Number(rows[0]?.estoque_atual ?? 0);
      if (diferenca !== 0) {
        await client.query(
          "INSERT INTO estoque_movimentos (produto_id, tipo, quantidade, observacao) VALUES ($1, $2, $3, $4)",
          [id, diferenca > 0 ? "AJUSTE_ENTRADA" : "AJUSTE_SAIDA", Math.abs(diferenca), "Ajuste automático ao restaurar produto arquivado."]
        );
      }
    }

    await client.query("COMMIT");
    return findProdutoById(id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function restoreProduto(id: number) {
  const { rows } = await pool.query<{ id: number }>(
    "UPDATE produtos SET ativo = TRUE, excluido_em = NULL WHERE id = $1 RETURNING id",
    [id]
  );
  return rows[0] ? findProdutoById(rows[0].id) : null;
}

export async function updateProdutoImagem(id: number, imagemUrl: string | null) {
  const { rows } = await pool.query<{ id: number }>(
    "UPDATE produtos SET imagem_principal_url = $1 WHERE id = $2 AND excluido_em IS NULL RETURNING id",
    [imagemUrl, id]
  );
  return rows[0] ? findProdutoById(rows[0].id) : null;
}

export async function deleteProduto(id: number) {
  // Arquivamento logico preserva o produto e todo o historico de estoque_movimentos.
  const result = await pool.query("UPDATE produtos SET excluido_em = NOW() WHERE id = $1 AND excluido_em IS NULL", [id]);
  return (result.rowCount ?? 0) > 0;
}
