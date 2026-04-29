import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";
import type { CategoriaInput, CategoriaUpdateInput } from "./categorias.schema.js";

export interface Categoria extends RowDataPacket {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: Date;
  excluido_em: Date | null;
}

// Categorias ainda sao simples, mas manter repository separa SQL da regra de tela/API.
export async function listCategorias(status: "ativos" | "inativos" | "arquivados" | "todos" = "todos") {
  const where = {
    ativos: "WHERE excluido_em IS NULL AND ativo = TRUE",
    inativos: "WHERE excluido_em IS NULL AND ativo = FALSE",
    arquivados: "WHERE excluido_em IS NOT NULL",
    todos: ""
  }[status];
  const [rows] = await pool.query<Categoria[]>(`SELECT * FROM categorias ${where} ORDER BY excluido_em IS NOT NULL, ativo DESC, nome`);
  return rows;
}

export async function createCategoria(data: CategoriaInput) {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO categorias (nome, ativo) VALUES (?, ?)",
    [data.nome, data.ativo]
  );
  return findCategoriaById(result.insertId);
}

export async function findCategoriaById(id: number) {
  const [rows] = await pool.execute<Categoria[]>("SELECT * FROM categorias WHERE id = ? AND excluido_em IS NULL", [id]);
  return rows[0] ?? null;
}

export async function findCategoriaByIdIncludingArchived(id: number) {
  const [rows] = await pool.execute<Categoria[]>("SELECT * FROM categorias WHERE id = ?", [id]);
  return rows[0] ?? null;
}

export async function findCategoriaByNome(nome: string, ignoreId?: number) {
  const params: Array<string | number> = [nome];
  let sql = "SELECT * FROM categorias WHERE LOWER(TRIM(nome)) = LOWER(TRIM(?))";
  if (ignoreId) {
    sql += " AND id <> ?";
    params.push(ignoreId);
  }
  const [rows] = await pool.execute<Categoria[]>(sql, params);
  return rows[0] ?? null;
}

export async function restoreCategoria(id: number, nome?: string) {
  await pool.execute(
    "UPDATE categorias SET nome = COALESCE(?, nome), ativo = TRUE, excluido_em = NULL WHERE id = ?",
    [nome ?? null, id]
  );
  return findCategoriaById(id);
}

export async function updateCategoria(id: number, data: CategoriaUpdateInput) {
  const fields = Object.entries(data).filter(([, value]) => value !== undefined);
  const assignments = fields.map(([key]) => `${key} = ?`).join(", ");
  const values = fields.map(([, value]) => value);
  await pool.execute(`UPDATE categorias SET ${assignments} WHERE id = ? AND excluido_em IS NULL`, [...values, id]);
  return findCategoriaById(id);
}

export async function setCategoriaStatus(id: number, ativo: boolean) {
  await pool.execute("UPDATE categorias SET ativo = ? WHERE id = ? AND excluido_em IS NULL", [ativo, id]);
  return findCategoriaById(id);
}

export async function countProdutosByCategoria(id: number) {
  const [rows] = await pool.execute<Array<{ total: number } & RowDataPacket>>(
    "SELECT COUNT(*) AS total FROM produtos WHERE categoria_id = ? AND excluido_em IS NULL",
    [id]
  );
  return rows[0]?.total ?? 0;
}

export async function listProdutosByCategoria(id: number, limit = 20) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);
  const [rows] = await pool.execute<Array<{ id: number; codigo: string; nome: string } & RowDataPacket>>(
    `SELECT id, codigo, nome FROM produtos WHERE categoria_id = ? AND excluido_em IS NULL ORDER BY nome LIMIT ${safeLimit}`,
    [id]
  );
  return rows;
}

export async function archiveCategoria(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE categorias SET excluido_em = NOW() WHERE id = ? AND excluido_em IS NULL",
    [id]
  );
  return result.affectedRows > 0;
}
