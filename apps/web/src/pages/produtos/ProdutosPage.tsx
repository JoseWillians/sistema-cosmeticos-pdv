import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProdutoFiltros } from "../../features/produtos/components/ProdutoFiltros";
import { ProdutosTable } from "../../features/produtos/components/ProdutosTable";
import { deleteProduto, getProdutos, restoreProduto } from "../../features/produtos/services/produtosService";
import { MovimentoEstoqueModal } from "../../features/estoque/components/MovimentoEstoqueForm";
import { createMovimentoEstoque } from "../../features/estoque/services/estoqueService";
import { getMarcas } from "../../features/marcas/services/marcasService";
import { getCategorias } from "../../features/categorias/services/categoriasService";
import type { Categoria } from "../../types/categoria";
import type { Marca } from "../../types/marca";
import type { Produto } from "../../types/produto";
import type { EstoqueMovimentoPayload } from "../../types/estoque";

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");
  const [marcaId, setMarcaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [status, setStatus] = useState<"ativos" | "arquivados" | "todos">("ativos");
  const [loading, setLoading] = useState(true);
  const [produtoMovimento, setProdutoMovimento] = useState<Produto | null>(null);
  const [produtoArquivar, setProdutoArquivar] = useState<Produto | null>(null);
  const [arquivando, setArquivando] = useState(false);
  const [archiveError, setArchiveError] = useState("");

  async function load() {
    setLoading(true);
    const [produtosData, marcasData, categoriasData] = await Promise.all([
      getProdutos({ busca: buscaDebounced, marca_id: marcaId, categoria_id: categoriaId, status }),
      getMarcas(),
      getCategorias()
    ]);
    setProdutos(produtosData);
    setMarcas(marcasData);
    setCategorias(categoriasData);
    setLoading(false);
  }

  useEffect(() => {
    // Debounce evita uma chamada HTTP a cada tecla e reduz chance de acionar rate limit local.
    const timer = window.setTimeout(() => setBuscaDebounced(busca), 400);
    return () => window.clearTimeout(timer);
  }, [busca]);

  useEffect(() => { load(); }, [buscaDebounced, marcaId, categoriaId, status]);

  async function handleArchiveConfirm() {
    if (!produtoArquivar) return;
    setArquivando(true);
    setArchiveError("");
    try {
      // Arquivar nao apaga definitivamente; o backend preenche excluido_em e preserva estoque_movimentos.
      await deleteProduto(produtoArquivar.id);
      setProdutoArquivar(null);
      await load();
    } catch (error) {
      const responseData = typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      console.error("Erro ao arquivar produto", responseData ?? error);
      setArchiveError(responseData?.message ?? "Nao foi possivel arquivar o produto.");
    } finally {
      setArquivando(false);
    }
  }

  async function handleMovimento(payload: EstoqueMovimentoPayload) {
    await createMovimentoEstoque(payload);
    await load();
  }

  async function handleRestore(produto: Produto) {
    await restoreProduto(produto.id);
    await load();
  }

  return (
    <>
      <PageHeader title="Produtos" description="Cadastro inicial de produtos e precos." actions={<Link to="/produtos/novo"><Button iconLeft={<Plus className="h-4 w-4" />}>Novo Produto</Button></Link>} />
      <Card className="mb-5">
        <ProdutoFiltros busca={busca} marcaId={marcaId} categoriaId={categoriaId} marcas={marcas} categorias={categorias} onBusca={setBusca} onMarca={setMarcaId} onCategoria={setCategoriaId} />
        <div className="mt-4 flex flex-wrap gap-2">
          {(["ativos", "arquivados", "todos"] as const).map((item) => (
            <Button key={item} type="button" variant={status === item ? "primary" : "secondary"} onClick={() => setStatus(item)}>
              {item === "ativos" ? "Ativos" : item === "arquivados" ? "Arquivados" : "Todos"}
            </Button>
          ))}
        </div>
      </Card>
      {loading ? <Loading /> : <ProdutosTable produtos={produtos} onDelete={setProdutoArquivar} onMovimentar={setProdutoMovimento} onRestore={handleRestore} />}
      {produtoMovimento && (
        <MovimentoEstoqueModal
          produto={{
            produto_id: produtoMovimento.id,
            codigo: produtoMovimento.codigo,
            produto: produtoMovimento.nome,
            estoque_disponivel: produtoMovimento.estoque_disponivel
          }}
          onClose={() => setProdutoMovimento(null)}
          onSubmit={handleMovimento}
        />
      )}
      <ConfirmDialog
        open={!!produtoArquivar}
        title="Arquivar produto?"
        message="Este produto sera removido das listagens principais, mas continuara salvo no banco para historico. As movimentacoes de estoque antigas serao preservadas."
        confirmLabel="Arquivar produto"
        loading={arquivando}
        error={archiveError}
        onCancel={() => { setProdutoArquivar(null); setArchiveError(""); }}
        onConfirm={handleArchiveConfirm}
      />
    </>
  );
}
