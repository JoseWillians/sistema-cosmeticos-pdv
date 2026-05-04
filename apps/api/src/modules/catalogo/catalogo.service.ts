import { AppError } from "../../shared/errors/AppError.js";
import { findCatalogoProdutoBySlug, listCatalogoCategorias, listCatalogoMarcas, listCatalogoProdutos } from "./catalogo.repository.js";

export const catalogoService = {
  listProdutos: listCatalogoProdutos,
  async getProduto(slug: string) {
    const produto = await findCatalogoProdutoBySlug(slug);
    if (!produto) throw new AppError("Produto nao encontrado no catalogo.", 404);
    return produto;
  },
  async home() {
    const [destaques, maisVendidos, promocoes, recentes, categorias, marcas] = await Promise.all([
      listCatalogoProdutos({ destaque: true, limit: 8 }),
      listCatalogoProdutos({ limit: 8 }),
      listCatalogoProdutos({ promocao: true, limit: 8 }),
      listCatalogoProdutos({ limit: 8 }),
      listCatalogoCategorias(),
      listCatalogoMarcas()
    ]);

    return {
      destaques: destaques.length ? destaques : recentes,
      maisVendidos: maisVendidos.filter((produto) => produto.mais_vendido).length ? maisVendidos.filter((produto) => produto.mais_vendido) : recentes,
      promocoes,
      categorias,
      marcas
    };
  }
};
