import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProdutoForm } from "../../features/produtos/components/ProdutoForm";
import { createProduto, getProduto, updateProduto } from "../../features/produtos/services/produtosService";
import { getMarcas } from "../../features/marcas/services/marcasService";
import { getCategorias } from "../../features/categorias/services/categoriasService";
import type { Categoria } from "../../types/categoria";
import type { Marca } from "../../types/marca";
import type { Produto, ProdutoPayload } from "../../types/produto";

export function ProdutoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega produto, marcas e categorias juntos para o formulario ja abrir com selects preenchidos.
    Promise.all([id ? getProduto(id) : Promise.resolve(null), getMarcas(), getCategorias()])
      .then(([produtoData, marcasData, categoriasData]) => {
        setProduto(produtoData);
        setMarcas(marcasData);
        setCategorias(categoriasData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(payload: ProdutoPayload) {
    if (id) {
      // Edicao nao deve reenviar estoque_inicial, porque saldo muda por movimentos de estoque.
      const { estoque_inicial: _estoqueInicial, ...payloadEdicao } = payload;
      await updateProduto(id, payloadEdicao);
    } else {
      const result = await createProduto(payload);
      if (result.restored) window.alert("Produto arquivado restaurado e atualizado com sucesso.");
    }
    navigate("/produtos");
  }

  return (
    <>
      <PageHeader
        title={id ? "Editar produto" : "Novo produto"}
        description="Preencha os dados comerciais e o estoque inicial."
        actions={<Button variant="ghost" onClick={() => navigate(-1)} iconLeft={<ArrowLeft className="h-4 w-4" />}>Voltar</Button>}
      />
      {loading ? <Loading /> : <ProdutoForm produto={produto} marcas={marcas} categorias={categorias} onSubmit={handleSubmit} onCancel={() => navigate("/produtos")} />}
    </>
  );
}
