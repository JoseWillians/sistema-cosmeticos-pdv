import { AppError } from "../../shared/errors/AppError.js";
import { archiveMarca, countProdutosByMarca, createMarca, findMarcaById, findMarcaByNome, listMarcas, listProdutosByMarca, setMarcaStatus, updateMarca } from "./marcas.repository.js";
import type { MarcaInput, MarcaUpdateInput } from "./marcas.schema.js";

export const marcasService = {
  list: listMarcas,
  async create(data: MarcaInput) {
    if (await findMarcaByNome(data.nome)) throw new AppError("Ja existe uma marca com este nome.", 409);
    return createMarca(data);
  },
  async update(id: number, data: MarcaUpdateInput) {
    if (data.nome && await findMarcaByNome(data.nome, id)) throw new AppError("Ja existe uma marca com este nome.", 409);
    const marca = await updateMarca(id, data);
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
  }
};
