import { AppError } from "../../shared/errors/AppError.js";
import { normalizeName } from "../../shared/utils/normalizeName.js";
import { archiveCategoria, countProdutosByCategoria, createCategoria, findCategoriaById, findCategoriaByIdIncludingArchived, findCategoriaByNome, listCategorias, listProdutosByCategoria, restoreCategoria, setCategoriaStatus, updateCategoria } from "./categorias.repository.js";
import type { CategoriaInput, CategoriaUpdateInput } from "./categorias.schema.js";

export const categoriasService = {
  list: listCategorias,
  async create(data: CategoriaInput) {
    const nome = normalizeName(data.nome);
    const existing = await findCategoriaByNome(nome);
    if (existing?.excluido_em) {
      return { ...(await restoreCategoria(existing.id, nome)), restored: true, restoredType: "UNARCHIVED" };
    }
    if (existing && !existing.ativo) {
      return { ...(await restoreCategoria(existing.id, nome)), restored: true, restoredType: "REACTIVATED" };
    }
    if (existing) throw new AppError("Já existe uma categoria ativa com este nome.", 409);
    return { ...(await createCategoria({ ...data, nome })), created: true, restored: false };
  },
  async update(id: number, data: CategoriaUpdateInput) {
    const payload = data.nome ? { ...data, nome: normalizeName(data.nome) } : data;
    if (payload.nome && await findCategoriaByNome(payload.nome, id)) throw new AppError("Ja existe uma categoria com este nome.", 409);
    const categoria = await updateCategoria(id, payload);
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
  },
  async restore(id: number) {
    const categoria = await findCategoriaByIdIncludingArchived(id);
    if (!categoria) throw new AppError("Categoria nao encontrada.", 404);
    return { ...(await restoreCategoria(id)), restored: true, restoredType: categoria.excluido_em ? "UNARCHIVED" : "REACTIVATED" };
  }
};
