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
