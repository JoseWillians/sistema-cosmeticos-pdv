import type { RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";

interface TableRow extends RowDataPacket {
  TABLE_NAME: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

function quoteIdentifier(identifier: string) {
  return `\`${identifier.replace(/`/g, "``")}\``;
}

export const devService = {
  async databaseStatus() {
    await pool.query("SELECT 1");
    return "online";
  },

  async getTablePreviews() {
    const [tables] = await pool.execute<TableRow[]>(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE IN ('BASE TABLE', 'VIEW') ORDER BY TABLE_NAME"
    );

    return Promise.all(tables.map(async (table) => {
      const safeName = quoteIdentifier(table.TABLE_NAME);
      // INFORMATION_SCHEMA define a lista de tabelas; ainda assim escapamos o identificador antes do SELECT.
      const [countRows] = await pool.query<CountRow[]>(`SELECT COUNT(*) AS total FROM ${safeName}`);
      const [previewRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${safeName} LIMIT 50`);
      const columns = previewRows.length ? Object.keys(previewRows[0]) : await this.getColumns(table.TABLE_NAME);

      return {
        name: table.TABLE_NAME,
        count: countRows[0]?.total ?? 0,
        columns,
        rows: previewRows as Record<string, unknown>[]
      };
    }));
  },

  async getColumns(tableName: string) {
    const [columns] = await pool.execute<RowDataPacket[]>(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
      [tableName]
    );
    return columns.map((column) => String(column.COLUMN_NAME));
  }
};
