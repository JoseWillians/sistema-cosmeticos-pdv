import { pool } from "../../database/connection.js";
import type { CategoriaInput, CategoriaUpdateInput } from "./categorias.schema.js";

export interface Categoria {
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
  const { rows } = await pool.query<Categoria>(`SELECT * FROM categorias ${where} ORDER BY excluido_em IS NOT NULL, ativo DESC, nome`);
  return rows;
}

export async function createCategoria(data: CategoriaInput) {
  const { rows } = await pool.query<Categoria>(
    "INSERT INTO categorias (nome, ativo) VALUES ($1, $2) RETURNING *",
    [data.nome, data.ativo]
  );
  return rows[0] ?? null;
}

export async function findCategoriaById(id: number) {
  const { rows } = await pool.query<Categoria>("SELECT * FROM categorias WHERE id = $1 AND excluido_em IS NULL", [id]);
  return rows[0] ?? null;
}

export async function findCategoriaByIdIncludingArchived(id: number) {
  const { rows } = await pool.query<Categoria>("SELECT * FROM categorias WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function findCategoriaByNome(nome: string, ignoreId?: number) {
  const params: Array<string | number> = [nome];
  let sql = "SELECT * FROM categorias WHERE LOWER(TRIM(nome)) = LOWER(TRIM($1))";
  if (ignoreId) {
    sql += " AND id <> $2";
    params.push(ignoreId);
  }
  const { rows } = await pool.query<Categoria>(sql, params);
  return rows[0] ?? null;
}

export async function restoreCategoria(id: number, nome?: string) {
  const { rows } = await pool.query<Categoria>(
    "UPDATE categorias SET nome = COALESCE($1, nome), ativo = TRUE, excluido_em = NULL WHERE id = $2 RETURNING *",
    [nome ?? null, id]
  );
  return rows[0] ?? null;
}

export async function updateCategoria(id: number, data: CategoriaUpdateInput) {
  const fields = Object.entries(data).filter(([, value]) => value !== undefined);
  const assignments = fields.map(([key], index) => `${key} = $${index + 1}`).join(", ");
  const values = fields.map(([, value]) => value);
  const { rows } = await pool.query<Categoria>(
    `UPDATE categorias SET ${assignments} WHERE id = $${values.length + 1} AND excluido_em IS NULL RETURNING *`,
    [...values, id]
  );
  return rows[0] ?? null;
}

export async function setCategoriaStatus(id: number, ativo: boolean) {
  const { rows } = await pool.query<Categoria>(
    "UPDATE categorias SET ativo = $1 WHERE id = $2 AND excluido_em IS NULL RETURNING *",
    [ativo, id]
  );
  return rows[0] ?? null;
}

export async function countProdutosByCategoria(id: number) {
  const { rows } = await pool.query<{ total: number }>(
    "SELECT COUNT(*)::int AS total FROM produtos WHERE categoria_id = $1 AND excluido_em IS NULL",
    [id]
  );
  return rows[0]?.total ?? 0;
}

export async function listProdutosByCategoria(id: number, limit = 20) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);
  const { rows } = await pool.query<{ id: number; codigo: string; nome: string }>(
    "SELECT id, codigo, nome FROM produtos WHERE categoria_id = $1 AND excluido_em IS NULL ORDER BY nome LIMIT $2",
    [id, safeLimit]
  );
  return rows;
}

export async function archiveCategoria(id: number) {
  const result = await pool.query(
    "UPDATE categorias SET excluido_em = NOW() WHERE id = $1 AND excluido_em IS NULL",
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}
