import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";
import type { MarcaInput, MarcaUpdateInput } from "./marcas.schema.js";

export interface Marca extends RowDataPacket {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: Date;
  excluido_em: Date | null;
}

// Acesso direto a marcas fica isolado aqui para facilitar trocar filtros ou paginacao depois.
export async function listMarcas() {
  const [rows] = await pool.query<Marca[]>("SELECT * FROM marcas WHERE excluido_em IS NULL ORDER BY nome");
  return rows;
}

export async function createMarca(data: MarcaInput) {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO marcas (nome, ativo) VALUES (?, ?)",
    [data.nome, data.ativo]
  );
  return findMarcaById(result.insertId);
}

export async function findMarcaById(id: number) {
  const [rows] = await pool.execute<Marca[]>("SELECT * FROM marcas WHERE id = ? AND excluido_em IS NULL", [id]);
  return rows[0] ?? null;
}

export async function findMarcaByNome(nome: string, ignoreId?: number) {
  const params: Array<string | number> = [nome];
  let sql = "SELECT * FROM marcas WHERE nome = ?";
  if (ignoreId) {
    sql += " AND id <> ?";
    params.push(ignoreId);
  }
  const [rows] = await pool.execute<Marca[]>(sql, params);
  return rows[0] ?? null;
}

export async function updateMarca(id: number, data: MarcaUpdateInput) {
  const fields = Object.entries(data).filter(([, value]) => value !== undefined);
  const assignments = fields.map(([key]) => `${key} = ?`).join(", ");
  const values = fields.map(([, value]) => value);
  await pool.execute(`UPDATE marcas SET ${assignments} WHERE id = ? AND excluido_em IS NULL`, [...values, id]);
  return findMarcaById(id);
}

export async function setMarcaStatus(id: number, ativo: boolean) {
  await pool.execute("UPDATE marcas SET ativo = ? WHERE id = ? AND excluido_em IS NULL", [ativo, id]);
  return findMarcaById(id);
}

export async function countProdutosByMarca(id: number) {
  const [rows] = await pool.execute<Array<{ total: number } & RowDataPacket>>(
    "SELECT COUNT(*) AS total FROM produtos WHERE marca_id = ? AND excluido_em IS NULL",
    [id]
  );
  return rows[0]?.total ?? 0;
}

export async function listProdutosByMarca(id: number, limit = 20) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);
  const [rows] = await pool.execute<Array<{ id: number; codigo: string; nome: string } & RowDataPacket>>(
    `SELECT id, codigo, nome FROM produtos WHERE marca_id = ? AND excluido_em IS NULL ORDER BY nome LIMIT ${safeLimit}`,
    [id]
  );
  return rows;
}

export async function archiveMarca(id: number) {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE marcas SET excluido_em = NOW() WHERE id = ? AND excluido_em IS NULL",
    [id]
  );
  return result.affectedRows > 0;
}
