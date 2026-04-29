import { api } from "../../../lib/api";
import type { Categoria } from "../../../types/categoria";

export async function getCategorias() {
  const { data } = await api.get<Categoria[]>("/categorias");
  return data;
}

export async function createCategoria(payload: { nome: string }) {
  const { data } = await api.post<Categoria>("/categorias", payload);
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
