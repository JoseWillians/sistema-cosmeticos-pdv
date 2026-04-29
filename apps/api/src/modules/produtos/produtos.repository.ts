import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";
import type { ProdutoCreateInput, ProdutoUpdateInput, UnidadeProduto } from "./produtos.schema.js";

export interface Produto extends RowDataPacket {
  id: number;
  marca_id: number;
  categoria_id: number;
  codigo: string;
  codigo_barras: string | null;
  nome: string;
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

// Repository concentra SQL cru para manter controllers e services livres de detalhes do MySQL.
export async function listProdutos(filters: { busca?: string; marca_id?: number; categoria_id?: number }) {
  const params: Array<string | number> = [];
  const where: string[] = [];

  if (filters.busca) {
    where.push("(p.codigo LIKE ? OR p.nome LIKE ?)");
    params.push(`%${filters.busca}%`, `%${filters.busca}%`);
  }
  if (filters.marca_id) {
    where.push("p.marca_id = ?");
    params.push(filters.marca_id);
  }
  if (filters.categoria_id) {
    where.push("p.categoria_id = ?");
    params.push(filters.categoria_id);
  }

  const sql = `${selectProdutos} ${where.length ? `AND ${where.join(" AND ")}` : ""} ORDER BY p.nome`;
  const [rows] = await pool.execute<Produto[]>(sql, params);
  return rows;
}

export async function listProdutosByStatus(filters: { busca?: string; marca_id?: number; categoria_id?: number; status?: "ativos" | "arquivados" | "todos" }) {
  const params: Array<string | number> = [];
  const where: string[] = [];
  const status = filters.status ?? "ativos";
  const base = selectProdutos.replace("WHERE p.excluido_em IS NULL", status === "arquivados" ? "WHERE p.excluido_em IS NOT NULL" : status === "todos" ? "WHERE 1=1" : "WHERE p.excluido_em IS NULL");

  if (filters.busca) {
    where.push("(p.codigo LIKE ? OR p.nome LIKE ?)");
    params.push(`%${filters.busca}%`, `%${filters.busca}%`);
  }
  if (filters.marca_id) {
    where.push("p.marca_id = ?");
    params.push(filters.marca_id);
  }
  if (filters.categoria_id) {
    where.push("p.categoria_id = ?");
    params.push(filters.categoria_id);
  }

  const sql = `${base} ${where.length ? `AND ${where.join(" AND ")}` : ""} ORDER BY p.excluido_em IS NOT NULL, p.nome`;
  const [rows] = await pool.execute<Produto[]>(sql, params);
  return rows;
}

export async function findProdutoById(id: number) {
  const [rows] = await pool.execute<Produto[]>(`${selectProdutos} AND p.id = ?`, [id]);
  return rows[0] ?? null;
}

export async function findProdutoArchiveStatusById(id: number) {
  const [rows] = await pool.execute<Array<RowDataPacket & { id: number; excluido_em: Date | null }>>(
    "SELECT id, excluido_em FROM produtos WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}

export async function findProdutoByCodigoIncludingArchived(codigo: string) {
  const [rows] = await pool.execute<Produto[]>(
    `${selectProdutos.replace("WHERE p.excluido_em IS NULL", "WHERE 1=1")} AND LOWER(TRIM(p.codigo)) = LOWER(TRIM(?))`,
    [codigo]
  );
  return rows[0] ?? null;
}

export async function getEstoqueAtualByProdutoId(id: number) {
  const [rows] = await pool.execute<Array<RowDataPacket & { estoque_atual: number }>>(
    `SELECT COALESCE(SUM(CASE
      WHEN tipo IN ('ENTRADA', 'AJUSTE_ENTRADA') THEN quantidade
      WHEN tipo IN ('SAIDA', 'AJUSTE_SAIDA') THEN -quantidade
      ELSE 0
    END), 0) AS estoque_atual
    FROM estoque_movimentos
    WHERE produto_id = ?`,
    [id]
  );
  return Number(rows[0]?.estoque_atual ?? 0);
}

export async function createProduto(data: ProdutoCreateInput) {
  const connection = await pool.getConnection();
  try {
    // Produto e estoque inicial precisam nascer juntos; a transacao evita produto sem movimento.
    await connection.beginTransaction();
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO produtos (
        marca_id, categoria_id, codigo, codigo_barras, nome, unidade,
        preco_custo, preco_venda, preco_custo_promocional, preco_venda_promocional,
        promocao_ativa, promocao_inicio, promocao_fim, promocao_observacao,
        estoque_minimo, controlar_estoque,
        descricao, observacoes, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.marca_id,
        data.categoria_id,
        data.codigo,
        data.codigo_barras || null,
        data.nome,
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
      ]
    );

    if (data.controlar_estoque && data.estoque_inicial > 0) {
      await connection.execute(
        "INSERT INTO estoque_movimentos (produto_id, tipo, quantidade, observacao) VALUES (?, 'ENTRADA', ?, ?)",
        [result.insertId, data.estoque_inicial, "Estoque inicial"]
      );
    }

    await connection.commit();
    return findProdutoById(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateProduto(id: number, data: ProdutoUpdateInput) {
  // Atualizacao parcial preserva campos que nao vieram do formulario e evita montar SQL fixo duplicado.
  const fields = Object.entries(data).filter(([, value]) => value !== undefined);
  if (!fields.length) return findProdutoById(id);

  const assignments = fields.map(([key]) => `${key} = ?`).join(", ");
  const values = fields.map(([, value]) => value ?? null);
  await pool.execute(`UPDATE produtos SET ${assignments} WHERE id = ?`, [...values, id]);
  return findProdutoById(id);
}

export async function restoreProdutoFromCreate(id: number, data: ProdutoCreateInput) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Produto comprado em promocao continua sendo o mesmo cadastro; restaurar atualiza os dados comerciais.
    await connection.execute(
      `UPDATE produtos SET
        marca_id = ?, categoria_id = ?, codigo = ?, codigo_barras = ?, nome = ?, unidade = ?,
        preco_custo = ?, preco_venda = ?, preco_custo_promocional = ?, preco_venda_promocional = ?,
        promocao_ativa = ?, promocao_inicio = ?, promocao_fim = ?, promocao_observacao = ?,
        estoque_minimo = ?, controlar_estoque = ?, descricao = ?, observacoes = ?,
        ativo = TRUE, excluido_em = NULL
      WHERE id = ?`,
      [
        data.marca_id,
        data.categoria_id,
        data.codigo,
        data.codigo_barras || null,
        data.nome,
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
        id
      ]
    );

    if (data.controlar_estoque) {
      const estoqueAtual = await getEstoqueAtualByProdutoId(id);
      const diferenca = data.estoque_inicial - estoqueAtual;
      if (diferenca !== 0) {
        await connection.execute(
          "INSERT INTO estoque_movimentos (produto_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?)",
          [id, diferenca > 0 ? "AJUSTE_ENTRADA" : "AJUSTE_SAIDA", Math.abs(diferenca), "Ajuste automático ao restaurar produto arquivado."]
        );
      }
    }

    await connection.commit();
    return findProdutoById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function restoreProduto(id: number) {
  await pool.execute("UPDATE produtos SET ativo = TRUE, excluido_em = NULL WHERE id = ?", [id]);
  return findProdutoById(id);
}

export async function deleteProduto(id: number) {
  // Arquivamento logico preserva o produto e todo o historico de estoque_movimentos.
  const [result] = await pool.execute<ResultSetHeader>("UPDATE produtos SET excluido_em = NOW() WHERE id = ? AND excluido_em IS NULL", [id]);
  return result.affectedRows > 0;
}
