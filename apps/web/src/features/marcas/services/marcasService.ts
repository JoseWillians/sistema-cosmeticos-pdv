import { api } from "../../../lib/api";
import type { Marca } from "../../../types/marca";

export type CadastroStatusFilter = "ativos" | "inativos" | "arquivados" | "todos";
export type CadastroCreateResponse<T> = T & { restored?: boolean; restoredType?: "REACTIVATED" | "UNARCHIVED"; created?: boolean };

export async function getMarcas(status?: CadastroStatusFilter) {
  const { data } = await api.get<Marca[]>("/marcas", { params: status ? { status } : undefined });
  return data;
}

export async function createMarca(payload: { nome: string }) {
  const { data } = await api.post<CadastroCreateResponse<Marca>>("/marcas", payload);
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

export async function restoreMarca(id: number) {
  const { data } = await api.patch<CadastroCreateResponse<Marca>>(`/marcas/${id}/restore`);
  return data;
}
