import mysql from "mysql2/promise";
import { databaseConfig } from "../config/database.js";

// Pool compartilhado da API. O mysql2/promise evita callbacks e facilita transacoes nos repositories.
export const pool = mysql.createPool(databaseConfig);

export async function testDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}
