import { pool } from "../../database/connection.js";

interface TableRow {
  table_name: string;
}

interface CountRow {
  total: number;
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replace(/"/g, "\"\"")}"`;
}

export const devService = {
  async databaseStatus() {
    await pool.query("SELECT 1");
    return "online";
  },

  async getTablePreviews() {
    const { rows: tables } = await pool.query<TableRow>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type IN ('BASE TABLE', 'VIEW') ORDER BY table_name"
    );

    return Promise.all(tables.map(async (table) => {
      const safeName = quoteIdentifier(table.table_name);
      // INFORMATION_SCHEMA define a lista de tabelas; ainda assim escapamos o identificador antes do SELECT.
      const { rows: countRows } = await pool.query<CountRow>(`SELECT COUNT(*)::int AS total FROM ${safeName}`);
      const { rows: previewRows } = await pool.query<Record<string, unknown>>(`SELECT * FROM ${safeName} LIMIT 50`);
      const columns = previewRows.length ? Object.keys(previewRows[0]) : await this.getColumns(table.table_name);

      return {
        name: table.table_name,
        count: countRows[0]?.total ?? 0,
        columns,
        rows: previewRows
      };
    }));
  },

  async getColumns(tableName: string) {
    const { rows: columns } = await pool.query<{ column_name: string }>(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position",
      [tableName]
    );
    return columns.map((column) => column.column_name);
  }
};
