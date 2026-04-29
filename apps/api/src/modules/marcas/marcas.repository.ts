import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";
import type { MarcaInput } from "./marcas.schema.js";

export interface Marca extends RowDataPacket {
  id: number;
  nome: string;
  ativo: boolean;
  criado_em: Date;
}

// Acesso direto a marcas fica isolado aqui para facilitar trocar filtros ou paginacao depois.
export async function listMarcas() {
  const [rows] = await pool.query<Marca[]>("SELECT * FROM marcas ORDER BY nome");
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
  const [rows] = await pool.execute<Marca[]>("SELECT * FROM marcas WHERE id = ?", [id]);
  return rows[0] ?? null;
}
