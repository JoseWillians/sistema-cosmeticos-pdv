import { pool } from "../../database/connection.js";
import type { MarcaInput, MarcaUpdateInput } from "./marcas.schema.js";

export interface Marca {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: Date;
  excluido_em: Date | null;
}

// Acesso direto a marcas fica isolado aqui para facilitar trocar filtros ou paginacao depois.
export async function listMarcas(status: "ativos" | "inativos" | "arquivados" | "todos" = "todos") {
  const where = {
    ativos: "WHERE excluido_em IS NULL AND ativo = TRUE",
    inativos: "WHERE excluido_em IS NULL AND ativo = FALSE",
    arquivados: "WHERE excluido_em IS NOT NULL",
    todos: ""
  }[status];
  const { rows } = await pool.query<Marca>(`SELECT * FROM marcas ${where} ORDER BY excluido_em IS NOT NULL, ativo DESC, nome`);
  return rows;
}

export async function createMarca(data: MarcaInput) {
  const { rows } = await pool.query<Marca>(
    "INSERT INTO marcas (nome, ativo) VALUES ($1, $2) RETURNING *",
    [data.nome, data.ativo]
  );
  return rows[0] ?? null;
}

export async function findMarcaById(id: number) {
  const { rows } = await pool.query<Marca>("SELECT * FROM marcas WHERE id = $1 AND excluido_em IS NULL", [id]);
  return rows[0] ?? null;
}

export async function findMarcaByIdIncludingArchived(id: number) {
  const { rows } = await pool.query<Marca>("SELECT * FROM marcas WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function findMarcaByNome(nome: string, ignoreId?: number) {
  const params: Array<string | number> = [nome];
  let sql = "SELECT * FROM marcas WHERE LOWER(TRIM(nome)) = LOWER(TRIM($1))";
  if (ignoreId) {
    sql += " AND id <> $2";
    params.push(ignoreId);
  }
  const { rows } = await pool.query<Marca>(sql, params);
  return rows[0] ?? null;
}

export async function restoreMarca(id: number, nome?: string) {
  const { rows } = await pool.query<Marca>(
    "UPDATE marcas SET nome = COALESCE($1, nome), ativo = TRUE, excluido_em = NULL WHERE id = $2 RETURNING *",
    [nome ?? null, id]
  );
  return rows[0] ?? null;
}

export async function updateMarca(id: number, data: MarcaUpdateInput) {
  const fields = Object.entries(data).filter(([, value]) => value !== undefined);
  const assignments = fields.map(([key], index) => `${key} = $${index + 1}`).join(", ");
  const values = fields.map(([, value]) => value);
  const { rows } = await pool.query<Marca>(
    `UPDATE marcas SET ${assignments} WHERE id = $${values.length + 1} AND excluido_em IS NULL RETURNING *`,
    [...values, id]
  );
  return rows[0] ?? null;
}

export async function setMarcaStatus(id: number, ativo: boolean) {
  const { rows } = await pool.query<Marca>(
    "UPDATE marcas SET ativo = $1 WHERE id = $2 AND excluido_em IS NULL RETURNING *",
    [ativo, id]
  );
  return rows[0] ?? null;
}

export async function countProdutosByMarca(id: number) {
  const { rows } = await pool.query<{ total: number }>(
    "SELECT COUNT(*)::int AS total FROM produtos WHERE marca_id = $1 AND excluido_em IS NULL",
    [id]
  );
  return rows[0]?.total ?? 0;
}

export async function listProdutosByMarca(id: number, limit = 20) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);
  const { rows } = await pool.query<{ id: number; codigo: string; nome: string }>(
    "SELECT id, codigo, nome FROM produtos WHERE marca_id = $1 AND excluido_em IS NULL ORDER BY nome LIMIT $2",
    [id, safeLimit]
  );
  return rows;
}

export async function archiveMarca(id: number) {
  const result = await pool.query(
    "UPDATE marcas SET excluido_em = NOW() WHERE id = $1 AND excluido_em IS NULL",
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}
