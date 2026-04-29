import { AppError } from "../../shared/errors/AppError.js";
import { archiveCategoria, countProdutosByCategoria, createCategoria, findCategoriaById, findCategoriaByNome, listCategorias, listProdutosByCategoria, setCategoriaStatus, updateCategoria } from "./categorias.repository.js";
import type { CategoriaInput, CategoriaUpdateInput } from "./categorias.schema.js";

export const categoriasService = {
  list: listCategorias,
  async create(data: CategoriaInput) {
    if (await findCategoriaByNome(data.nome)) throw new AppError("Ja existe uma categoria com este nome.", 409);
    return createCategoria(data);
  },
  async update(id: number, data: CategoriaUpdateInput) {
    if (data.nome && await findCategoriaByNome(data.nome, id)) throw new AppError("Ja existe uma categoria com este nome.", 409);
    const categoria = await updateCategoria(id, data);
    if (!categoria) throw new AppError("Categoria nao encontrada.", 404);
    return categoria;
  },
  async setStatus(id: number, ativo: boolean) {
    // Desativar e reversivel; arquivar remove da listagem normal sem apagar do banco.
    const categoria = await setCategoriaStatus(id, ativo);
    if (!categoria) throw new AppError("Categoria nao encontrada.", 404);
    return categoria;
  },
  async archive(id: number) {
    if (!await findCategoriaById(id)) throw new AppError("Categoria nao encontrada.", 404);
    const total = await countProdutosByCategoria(id);
    if (total > 0) {
      const products = await listProdutosByCategoria(id, 20);
      throw new AppError("Não é possível arquivar esta categoria porque existem produtos vinculados.", 409, {
        type: "CATEGORY_IN_USE",
        products,
        moreCount: Math.max(total - products.length, 0)
      });
    }
    await archiveCategoria(id);
  }
};
