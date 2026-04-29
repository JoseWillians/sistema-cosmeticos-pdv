import { api } from "../../../lib/api";

export interface DashboardResumo {
  kpis: {
    totalProdutos: number;
    produtosEmEstoque: number;
    estoqueBaixo: number;
    esgotados: number;
    valorEstoqueCusto: number;
    valorEstoqueVenda: number;
  };
  produtosPorCategoria: Array<{ nome: string; quantidade: number }>;
  produtosPorMarca: Array<{ nome: string; quantidade: number }>;
  statusEstoque: Array<{ status: string; quantidade: number }>;
  entradasPorPeriodo: Array<{ periodo: string; quantidade: number }>;
  produtosCriticos: Array<{
    id: number;
    codigo: string;
    nome: string;
    marca: string;
    categoria: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    status: string;
  }>;
}

export async function getDashboardResumo() {
  const { data } = await api.get<DashboardResumo>("/dashboard/resumo");
  return data;
}
