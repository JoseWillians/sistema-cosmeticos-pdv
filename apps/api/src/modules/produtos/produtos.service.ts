import { AppError } from "../../shared/errors/AppError.js";
import { createProduto, deleteProduto, findProdutoById, listProdutos, updateProduto } from "./produtos.repository.js";
import type { ProdutoCreateInput, ProdutoUpdateInput } from "./produtos.schema.js";

export const produtosService = {
  list: listProdutos,
  async findById(id: number) {
    const produto = await findProdutoById(id);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return produto;
  },
  create(data: ProdutoCreateInput) {
    return createProduto(data);
  },
  async update(id: number, data: ProdutoUpdateInput) {
    // A regra de edicao fica aqui: se o produto nao existir, a API responde 404 em vez de falhar silenciosamente.
    const produto = await updateProduto(id, data);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return produto;
  },
  async delete(id: number) {
    const deleted = await deleteProduto(id);
    if (!deleted) throw new AppError("Produto nao encontrado.", 404);
  }
};
