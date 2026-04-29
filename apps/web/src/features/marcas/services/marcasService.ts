import { api } from "../../../lib/api";
import type { Marca } from "../../../types/marca";

export async function getMarcas() {
  const { data } = await api.get<Marca[]>("/marcas");
  return data;
}

export async function createMarca(payload: { nome: string }) {
  const { data } = await api.post<Marca>("/marcas", payload);
  return data;
}

export async function updateMarca(id: number, payload: { nome: string }) {
  const { data } = await api.put<Marca>(`/marcas/${id}`, payload);
  return data;
}

export async function updateMarcaStatus(id: number, ativo: boolean) {
  const { data } = await api.patch<Marca>(`/marcas/${id}/status`, { ativo });
  return data;
}

export async function archiveMarca(id: number) {
  await api.delete(`/marcas/${id}`);
}
