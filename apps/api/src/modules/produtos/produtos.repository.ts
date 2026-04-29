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
  estoque_minimo: number;
  controlar_estoque: boolean;
  descricao: string | null;
  observacoes: string | null;
  ativo: boolean;
  marca: string;
  categoria: string;
}

const selectProdutos = `
  SELECT p.*, m.nome AS marca, c.nome AS categoria,
    COALESCE(v.estoque_disponivel, 0) AS estoque_disponivel,
    COALESCE(v.status_estoque, 'SEM_CONTROLE') AS status_estoque
  FROM produtos p
  INNER JOIN marcas m ON m.id = p.marca_id
  INNER JOIN categorias c ON c.id = p.categoria_id
  LEFT JOIN vw_estoque_produtos v ON v.produto_id = p.id
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

  const sql = `${selectProdutos} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY p.nome`;
  const [rows] = await pool.execute<Produto[]>(sql, params);
  return rows;
}

export async function findProdutoById(id: number) {
  const [rows] = await pool.execute<Produto[]>(`${selectProdutos} WHERE p.id = ?`, [id]);
  return rows[0] ?? null;
}

export async function createProduto(data: ProdutoCreateInput) {
  const connection = await pool.getConnection();
  try {
    // Produto e estoque inicial precisam nascer juntos; a transacao evita produto sem movimento.
    await connection.beginTransaction();
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO produtos (
        marca_id, categoria_id, codigo, codigo_barras, nome, unidade,
        preco_custo, preco_venda, estoque_minimo, controlar_estoque,
        descricao, observacoes, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.marca_id,
        data.categoria_id,
        data.codigo,
        data.codigo_barras || null,
        data.nome,
        data.unidade,
        data.preco_custo,
        data.preco_venda,
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

export async function deleteProduto(id: number) {
  const [result] = await pool.execute<ResultSetHeader>("UPDATE produtos SET ativo = 0 WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
