import { AppError } from "../../shared/errors/AppError.js";
import { findProdutoArchiveStatusById } from "../produtos/produtos.repository.js";
import { createEstoqueMovimento, listEstoque } from "./estoque.repository.js";
import type { EstoqueMovimentoInput } from "./estoque.schema.js";

export const estoqueService = {
  list: listEstoque,
  async createMovimento(data: EstoqueMovimentoInput) {
    // A existencia do produto e validada antes para evitar movimento orfao e erro SQL pouco amigavel.
    const produto = await findProdutoArchiveStatusById(data.produto_id);
    if (!produto) throw new AppError("Produto nao encontrado.", 404);
    // Produto arquivado sai do estoque ativo; novas correcoes devem ser feitas reativando/corrigindo o cadastro primeiro.
    if (produto.excluido_em) throw new AppError("Produto arquivado nao pode receber nova movimentacao de estoque.", 409, { type: "PRODUCT_ARCHIVED" });
    return createEstoqueMovimento(data);
  }
};
