import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";
import type { CategoriaInput } from "./categorias.schema.js";

export interface Categoria extends RowDataPacket {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: Date;
}

// Categorias ainda sao simples, mas manter repository separa SQL da regra de tela/API.
export async function listCategorias() {
  const [rows] = await pool.query<Categoria[]>("SELECT * FROM categorias ORDER BY nome");
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
  const [rows] = await pool.execute<Categoria[]>("SELECT * FROM categorias WHERE id = ?", [id]);
  return rows[0] ?? null;
}
