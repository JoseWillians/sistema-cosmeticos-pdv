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
export async function listCategorias() {
  const [rows] = await pool.query<Categoria[]>("SELECT * FROM categorias WHERE excluido_em IS NULL ORDER BY nome");
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

export async function findCategoriaByNome(nome: string, ignoreId?: number) {
  const params: Array<string | number> = [nome];
  let sql = "SELECT * FROM categorias WHERE nome = ?";
  if (ignoreId) {
    sql += " AND id <> ?";
    params.push(ignoreId);
  }
  const [rows] = await pool.execute<Categoria[]>(sql, params);
  return rows[0] ?? null;
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

export async function archiveCategoria(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE categorias SET excluido_em = NOW() WHERE id = ? AND excluido_em IS NULL",
    [id]
  );
  return result.affectedRows > 0;
}
