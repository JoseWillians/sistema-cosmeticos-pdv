import { Pool, types } from "pg";
import { databaseConfig } from "../config/database.js";

// O PostgreSQL retorna NUMERIC como string por padrao; parsear aqui evita conversoes repetidas nas telas.
types.setTypeParser(1700, (value) => Number.parseFloat(value));
types.setTypeParser(20, (value) => Number.parseInt(value, 10));

// Pool compartilhado da API. Mantemos a conexao centralizada para repositories seguirem queries parametrizadas.
export const pool = new Pool(databaseConfig);

export async function testDatabaseConnection() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}
