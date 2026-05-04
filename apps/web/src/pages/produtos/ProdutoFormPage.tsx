import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProdutoForm } from "../../features/produtos/components/ProdutoForm";
import { createProduto, getProduto, updateProduto, uploadProdutoImagem } from "../../features/produtos/services/produtosService";
import { getMarcas } from "../../features/marcas/services/marcasService";
import { getCategorias } from "../../features/categorias/services/categoriasService";
import type { Categoria } from "../../types/categoria";
import type { Marca } from "../../types/marca";
import type { Produto, ProdutoPayload } from "../../types/produto";
import { api } from "../../lib/api";

export function ProdutoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

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
      {!loading && produto && (
        <Card className="mt-5">
          <h2 className="mb-2 text-lg font-bold text-white">Imagem do produto</h2>
          <p className="mb-4 text-sm text-slate-400">Upload local simples para a imagem principal exibida no admin e no catalogo publico.</p>
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="grid aspect-square place-items-center overflow-hidden rounded-lg border border-white/10 bg-slate-950/35">
              {(preview || produto.imagem_principal_url) ? (
                <img className="h-full w-full object-cover" src={preview || `${api.defaults.baseURL}${produto.imagem_principal_url}`} alt={produto.nome} />
              ) : (
                <span className="text-sm text-slate-500">Sem imagem</span>
              )}
            </div>
            <div className="flex flex-col justify-center gap-3">
              <input
                className="block rounded-lg border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-200"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setPreview(URL.createObjectURL(file));
                  setUploading(true);
                  try {
                    const updated = await uploadProdutoImagem(produto.id, file);
                    setProduto(updated);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              <p className="text-xs text-slate-500">Formatos aceitos: JPG, PNG ou WEBP ate 3MB.</p>
              {uploading && <span className="text-sm text-cyan-200">Enviando imagem...</span>}
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
