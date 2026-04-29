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
