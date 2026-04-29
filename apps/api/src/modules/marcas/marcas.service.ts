import { AppError } from "../../shared/errors/AppError.js";
import { archiveMarca, countProdutosByMarca, createMarca, findMarcaById, findMarcaByNome, listMarcas, setMarcaStatus, updateMarca } from "./marcas.repository.js";
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
    if (await countProdutosByMarca(id) > 0) {
      throw new AppError("Não é possível excluir esta marca porque existem produtos vinculados a ela. Você pode desativá-la.", 409);
    }
    await archiveMarca(id);
  }
};
