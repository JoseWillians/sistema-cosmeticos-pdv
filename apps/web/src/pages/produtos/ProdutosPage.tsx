import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProdutoFiltros } from "../../features/produtos/components/ProdutoFiltros";
import { ProdutosTable } from "../../features/produtos/components/ProdutosTable";
import { deleteProduto, getProdutos } from "../../features/produtos/services/produtosService";
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
  const [marcaId, setMarcaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [produtoMovimento, setProdutoMovimento] = useState<Produto | null>(null);

  async function load() {
    setLoading(true);
    const [produtosData, marcasData, categoriasData] = await Promise.all([
      getProdutos({ busca, marca_id: marcaId, categoria_id: categoriaId }),
      getMarcas(),
      getCategorias()
    ]);
    setProdutos(produtosData);
    setMarcas(marcasData);
    setCategorias(categoriasData);
    setLoading(false);
  }

  useEffect(() => { load(); }, [busca, marcaId, categoriaId]);

  async function handleDelete(id: number) {
    await deleteProduto(id);
    await load();
  }

  async function handleMovimento(payload: EstoqueMovimentoPayload) {
    await createMovimentoEstoque(payload);
    await load();
  }

  return (
    <>
      <PageHeader title="Produtos" description="Cadastro inicial de produtos e precos." actions={<Link to="/produtos/novo"><Button iconLeft={<Plus className="h-4 w-4" />}>Novo Produto</Button></Link>} />
      <Card className="mb-5">
        <ProdutoFiltros busca={busca} marcaId={marcaId} categoriaId={categoriaId} marcas={marcas} categorias={categorias} onBusca={setBusca} onMarca={setMarcaId} onCategoria={setCategoriaId} />
      </Card>
      {loading ? <Loading /> : <ProdutosTable produtos={produtos} onDelete={handleDelete} onMovimentar={setProdutoMovimento} />}
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
    </>
  );
}
