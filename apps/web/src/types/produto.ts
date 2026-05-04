import type { StatusEstoque } from "./estoque";

export const unidadesProduto = ["UN", "KIT", "CX", "PC"] as const;
export type UnidadeProduto = (typeof unidadesProduto)[number];

export const unidadeProdutoLabels: Record<UnidadeProduto, string> = {
  UN: "UN - Unidade",
  KIT: "KIT - Kit",
  CX: "CX - Caixa",
  PC: "PC - Pacote"
};

export interface Produto {
  id: number;
  marca_id: number;
  categoria_id: number;
  codigo: string;
  codigo_barras: string | null;
  imagem_principal_url?: string | null;
  nome: string;
  slug?: string | null;
  descricao_curta?: string | null;
  visivel_no_catalogo?: boolean;
  destaque?: boolean;
  mais_vendido?: boolean;
  novo?: boolean;
  ordem_exibicao?: number | null;
  unidade: UnidadeProduto;
  preco_custo: number;
  preco_venda: number;
  preco_custo_promocional?: number | null;
  preco_venda_promocional?: number | null;
  promocao_ativa?: boolean;
  promocao_inicio?: string | null;
  promocao_fim?: string | null;
  promocao_observacao?: string | null;
  estoque_minimo: number;
  controlar_estoque: boolean;
  descricao: string | null;
  observacoes: string | null;
  ativo: boolean;
  marca: string;
  marca_ativo?: boolean;
  categoria: string;
  categoria_ativo?: boolean;
  estoque_disponivel: number;
  status_estoque: StatusEstoque;
  excluido_em?: string | null;
  restored?: boolean;
  created?: boolean;
}

export interface ProdutoPayload {
  marca_id: number;
  categoria_id: number;
  codigo: string;
  codigo_barras?: string | null;
  imagem_principal_url?: string | null;
  nome: string;
  slug?: string | null;
  descricao_curta?: string | null;
  visivel_no_catalogo?: boolean;
  destaque?: boolean;
  mais_vendido?: boolean;
  novo?: boolean;
  ordem_exibicao?: number | null;
  unidade: UnidadeProduto;
  preco_custo: number;
  preco_venda: number;
  preco_custo_promocional?: number | null;
  preco_venda_promocional?: number | null;
  promocao_ativa?: boolean;
  promocao_inicio?: string | null;
  promocao_fim?: string | null;
  promocao_observacao?: string | null;
  estoque_minimo?: number;
  controlar_estoque?: boolean;
  estoque_inicial?: number;
  descricao?: string | null;
  observacoes?: string | null;
}
