import { useEffect, useState } from "react";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { EstoqueTable } from "../../features/estoque/components/EstoqueTable";
import { MovimentoEstoqueModal } from "../../features/estoque/components/MovimentoEstoqueForm";
import { createMovimentoEstoque, getEstoque } from "../../features/estoque/services/estoqueService";
import type { EstoqueMovimentoPayload, EstoqueProduto } from "../../types/estoque";

export function EstoquePage() {
  const [estoque, setEstoque] = useState<EstoqueProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState<EstoqueProduto | null>(null);

  async function load() {
    setLoading(true);
    setEstoque(await getEstoque());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleMovimento(payload: EstoqueMovimentoPayload) {
    await createMovimentoEstoque(payload);
    await load();
  }

  return (
    <>
      <PageHeader title="Estoque" description="Produtos com saldo disponivel e status operacional." />
      {loading ? <Loading /> : <EstoqueTable itens={estoque} onMovimentar={setProdutoSelecionado} />}
      {produtoSelecionado && (
        <MovimentoEstoqueModal
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
          onSubmit={handleMovimento}
        />
      )}
    </>
  );
}
