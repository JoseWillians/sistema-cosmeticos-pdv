import { dashboardRepository } from "./dashboard.repository.js";

export const dashboardService = {
  async resumo() {
    const [kpis, produtosPorCategoria, produtosPorMarca, statusEstoque, entradasPorPeriodo, produtosCriticos] = await Promise.all([
      dashboardRepository.getKpis(),
      dashboardRepository.getProdutosPorCategoria(),
      dashboardRepository.getProdutosPorMarca(),
      dashboardRepository.getStatusEstoque(),
      dashboardRepository.getEntradasPorPeriodo(),
      dashboardRepository.getProdutosCriticos()
    ]);

    return {
      kpis: {
        totalProdutos: Number(kpis.totalProdutos ?? 0),
        produtosEmEstoque: Number(kpis.produtosEmEstoque ?? 0),
        estoqueBaixo: Number(kpis.estoqueBaixo ?? 0),
        esgotados: Number(kpis.esgotados ?? 0),
        valorEstoqueCusto: Number(kpis.valorEstoqueCusto ?? 0),
        valorEstoqueVenda: Number(kpis.valorEstoqueVenda ?? 0)
      },
      produtosPorCategoria,
      produtosPorMarca,
      statusEstoque,
      entradasPorPeriodo,
      produtosCriticos
    };
  }
};
