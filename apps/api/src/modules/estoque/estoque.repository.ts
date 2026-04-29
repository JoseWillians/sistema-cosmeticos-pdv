import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../database/connection.js";
import type { EstoqueMovimentoInput } from "./estoque.schema.js";

export interface EstoqueProduto extends RowDataPacket {
  produto_id: number;
  codigo: string;
  produto: string;
  marca: string;
  categoria: string;
  preco_custo: number;
  preco_venda: number;
  estoque_disponivel: number;
  estoque_minimo: number;
  status_estoque: string;
}

export interface EstoqueMovimento extends RowDataPacket {
  id: number;
  produto_id: number;
  tipo: string;
  quantidade: number;
  observacao: string | null;
  criado_em: Date;
}

// O saldo vem da view para evitar duplicar o calculo de entradas e saidas na aplicacao.
export async function listEstoque() {
  const [rows] = await pool.query<EstoqueProduto[]>(
    "SELECT * FROM vw_estoque_produtos ORDER BY produto"
  );
  return rows;
}

export async function createEstoqueMovimento(data: EstoqueMovimentoInput) {
  // Reposicao e ajuste sempre entram como movimento; o saldo disponivel continua derivado da view.
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO estoque_movimentos (produto_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?)",
    [data.produto_id, data.tipo, data.quantidade, data.observacao || null]
  );
  return findEstoqueMovimentoById(result.insertId);
}

export async function findEstoqueMovimentoById(id: number) {
  const [rows] = await pool.execute<EstoqueMovimento[]>(
    "SELECT * FROM estoque_movimentos WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}
