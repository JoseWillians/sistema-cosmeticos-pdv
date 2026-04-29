import { AppError } from "../../shared/errors/AppError.js";
import { findProdutoById } from "../produtos/produtos.repository.js";
import { createEstoqueMovimento, listEstoque } from "./estoque.repository.js";
import type { EstoqueMovimentoInput } from "./estoque.schema.js";

export const estoqueService = {
  list: listEstoque,
  async createMovimento(data: EstoqueMovimentoInput) {
    // A existencia do produto e validada antes para evitar movimento orfao e erro SQL pouco amigavel.
    const produto = await findProdutoById(data.produto_id);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    return createEstoqueMovimento(data);
  }
};
