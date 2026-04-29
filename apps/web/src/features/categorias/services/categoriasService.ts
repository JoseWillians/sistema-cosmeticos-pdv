import { api } from "../../../lib/api";
import type { Categoria } from "../../../types/categoria";

import type { CadastroCreateResponse, CadastroStatusFilter } from "../../marcas/services/marcasService";

export async function getCategorias(status?: CadastroStatusFilter) {
  const { data } = await api.get<Categoria[]>("/categorias", { params: status ? { status } : undefined });
  return data;
}

export async function createCategoria(payload: { nome: string }) {
  const { data } = await api.post<CadastroCreateResponse<Categoria>>("/categorias", payload);
  return data;
}

export async function updateCategoria(id: number, payload: { nome: string }) {
  const { data } = await api.put<Categoria>(`/categorias/${id}`, payload);
  return data;
}

export async function updateCategoriaStatus(id: number, ativo: boolean) {
  const { data } = await api.patch<Categoria>(`/categorias/${id}/status`, { ativo });
  return data;
}

export async function archiveCategoria(id: number) {
  await api.delete(`/categorias/${id}`);
}

export async function restoreCategoria(id: number) {
  const { data } = await api.patch<CadastroCreateResponse<Categoria>>(`/categorias/${id}/restore`);
  return data;
}
