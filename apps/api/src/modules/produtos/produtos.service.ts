import { AppError } from "../../shared/errors/AppError.js";
import { createProduto, deleteProduto, findProdutoByCodigoIncludingArchived, findProdutoById, listProdutosByStatus, restoreProduto, restoreProdutoFromCreate, updateProduto } from "./produtos.repository.js";
import type { ProdutoCreateInput, ProdutoUpdateInput } from "./produtos.schema.js";

export const produtosService = {
  list: listProdutosByStatus,
  async findById(id: number) {
    const produto = await findProdutoById(id);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return produto;
  },
  async create(data: ProdutoCreateInput) {
    const existing = await findProdutoByCodigoIncludingArchived(data.codigo);
    if (existing?.excluido_em) {
      const produto = await restoreProdutoFromCreate(existing.id, data);
      return { ...produto, created: false, restored: true };
    }
    if (existing) throw new AppError("Já existe um produto ativo com este código.", 409);
    return { ...(await createProduto(data)), created: true, restored: false };
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
  },
  async restore(id: number) {
    const produto = await restoreProduto(id);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return { ...produto, restored: true };
  }
};
