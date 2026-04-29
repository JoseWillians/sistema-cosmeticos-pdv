import { api } from "../../../lib/api";
import type { EstoqueMovimentoPayload, EstoqueProduto } from "../../../types/estoque";

export async function getEstoque() {
  const { data } = await api.get<EstoqueProduto[]>("/estoque");
  return data;
}

export async function createMovimentoEstoque(payload: EstoqueMovimentoPayload) {
  // O saldo disponivel e recalculado no backend pela view apos cada movimento registrado.
  const { data } = await api.post("/estoque/movimentos", payload);
  return data;
}
