export type StatusEstoque = "SEM_CONTROLE" | "ESGOTADO" | "BAIXO" | "OK";
export type TipoMovimentoEstoque = "ENTRADA" | "SAIDA" | "AJUSTE_ENTRADA" | "AJUSTE_SAIDA";

export interface EstoqueProduto {
  produto_id: number;
  codigo: string;
  produto: string;
  marca: string;
  categoria: string;
  preco_custo: number;
  preco_venda: number;
  estoque_disponivel: number;
  estoque_minimo: number;
  status_estoque: StatusEstoque;
}

export interface EstoqueMovimentoPayload {
  produto_id: number;
  tipo: TipoMovimentoEstoque;
  quantidade: number;
  custo_unitario?: number | null;
  compra_promocional?: boolean;
  observacao?: string | null;
}
