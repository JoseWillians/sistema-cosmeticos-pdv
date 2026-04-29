import { AppError } from "../../shared/errors/AppError.js";
import { normalizeName } from "../../shared/utils/normalizeName.js";
import { archiveMarca, countProdutosByMarca, createMarca, findMarcaById, findMarcaByIdIncludingArchived, findMarcaByNome, listMarcas, listProdutosByMarca, restoreMarca, setMarcaStatus, updateMarca } from "./marcas.repository.js";
import type { MarcaInput, MarcaUpdateInput } from "./marcas.schema.js";

export const marcasService = {
  list: listMarcas,
  async create(data: MarcaInput) {
    const nome = normalizeName(data.nome);
    const existing = await findMarcaByNome(nome);
    if (existing?.excluido_em) {
      // Recriar uma marca arquivada geraria duplicidade historica; restaurar mantem o mesmo id.
      return { ...(await restoreMarca(existing.id, nome)), restored: true, restoredType: "UNARCHIVED" };
    }
    if (existing && !existing.ativo) {
      return { ...(await restoreMarca(existing.id, nome)), restored: true, restoredType: "REACTIVATED" };
    }
    if (existing) throw new AppError("Já existe uma marca ativa com este nome.", 409);
    return { ...(await createMarca({ ...data, nome })), created: true, restored: false };
  },
  async update(id: number, data: MarcaUpdateInput) {
    const payload = data.nome ? { ...data, nome: normalizeName(data.nome) } : data;
    if (payload.nome && await findMarcaByNome(payload.nome, id)) throw new AppError("Ja existe uma marca com este nome.", 409);
    const marca = await updateMarca(id, payload);
    if (!marca) throw new AppError("Marca nao encontrada.", 404);
    return marca;
  },
  async setStatus(id: number, ativo: boolean) {
    // Desativar preserva historico e apenas remove a marca dos cadastros novos.
    const marca = await setMarcaStatus(id, ativo);
    if (!marca) throw new AppError("Marca nao encontrada.", 404);
    return marca;
  },
  async archive(id: number) {
    if (!await findMarcaById(id)) throw new AppError("Marca nao encontrada.", 404);
    // Arquivar e soft delete: nao remove fisicamente e bloqueia se houver produto vinculado ativo.
    const total = await countProdutosByMarca(id);
    if (total > 0) {
      // Mostrar os produtos vinculados ajuda o usuario a corrigir o cadastro antes de arquivar.
      const products = await listProdutosByMarca(id, 20);
      throw new AppError("Não é possível arquivar esta marca porque existem produtos vinculados.", 409, {
        type: "BRAND_IN_USE",
        products,
        moreCount: Math.max(total - products.length, 0)
      });
    }
    await archiveMarca(id);
  },
  async restore(id: number) {
    const marca = await findMarcaByIdIncludingArchived(id);
    if (!marca) throw new AppError("Marca nao encontrada.", 404);
    return { ...(await restoreMarca(id)), restored: true, restoredType: marca.excluido_em ? "UNARCHIVED" : "REACTIVATED" };
  }
};
