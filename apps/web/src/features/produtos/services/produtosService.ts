import { api } from "../../../lib/api";
import type { Produto, ProdutoPayload } from "../../../types/produto";

export interface ProdutoFilters {
  busca?: string;
  marca_id?: string;
  categoria_id?: string;
  status?: "ativos" | "arquivados" | "todos";
}

export async function getProdutos(filters: ProdutoFilters = {}) {
  const { data } = await api.get<Produto[]>("/produtos", { params: filters });
  return data;
}

export async function getProduto(id: string) {
  const { data } = await api.get<Produto>(`/produtos/${id}`);
  return data;
}

export async function createProduto(payload: ProdutoPayload) {
  const { data } = await api.post<Produto>("/produtos", payload);
  return data;
}

export async function updateProduto(id: string, payload: Partial<ProdutoPayload>) {
  // PUT recebe apenas dados comerciais; estoque inicial fica fora da edicao para preservar historico.
  const { data } = await api.put<Produto>(`/produtos/${id}`, payload);
  return data;
}

export async function deleteProduto(id: number) {
  await api.delete(`/produtos/${id}`);
}

export async function restoreProduto(id: number) {
  const { data } = await api.patch<Produto>(`/produtos/${id}/restore`);
  return data;
}

export async function uploadProdutoImagem(id: number, file: File) {
  const formData = new FormData();
  formData.append("imagem", file);
  const { data } = await api.post<Produto>(`/produtos/${id}/imagem`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}
