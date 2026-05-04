import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { Categoria } from "../../../types/categoria";
import type { Marca } from "../../../types/marca";
import { unidadeProdutoLabels, unidadesProduto } from "../../../types/produto";
import type { Produto, ProdutoPayload, UnidadeProduto } from "../../../types/produto";
import { ErrorMessage } from "../../../components/feedback/ErrorMessage";
import { parseCurrencyInput } from "../../../lib/parseCurrencyInput";

type ProdutoFormState = Omit<ProdutoPayload, "preco_custo" | "preco_venda" | "preco_custo_promocional" | "preco_venda_promocional"> & {
  preco_custo: string | number;
  preco_venda: string | number;
  preco_custo_promocional?: string | number;
  preco_venda_promocional?: string | number;
};

const initial: ProdutoFormState = {
  codigo: "",
  nome: "",
  marca_id: 0,
  categoria_id: 0,
  unidade: "UN",
  preco_custo: 0,
  preco_venda: 0,
  preco_custo_promocional: "",
  preco_venda_promocional: "",
  promocao_ativa: false,
  promocao_inicio: "",
  promocao_fim: "",
  promocao_observacao: "",
  estoque_inicial: 0,
  estoque_minimo: 0,
  controlar_estoque: true,
  codigo_barras: "",
  imagem_principal_url: "",
  slug: "",
  descricao_curta: "",
  visivel_no_catalogo: true,
  destaque: false,
  mais_vendido: false,
  novo: false,
  ordem_exibicao: null,
  descricao: "",
  observacoes: ""
};

export function ProdutoForm({
  produto,
  marcas,
  categorias,
  onSubmit,
  onCancel
}: {
  produto?: Produto | null;
  marcas: Marca[];
  categorias: Categoria[];
  onSubmit: (payload: ProdutoPayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<ProdutoFormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const marcasDisponiveis = marcas.filter((marca) => (!marca.excluido_em && marca.ativo) || marca.id === produto?.marca_id);
  const categoriasDisponiveis = categorias.filter((categoria) => (!categoria.excluido_em && categoria.ativo) || categoria.id === produto?.categoria_id);

  useEffect(() => {
    if (produto) {
      setForm({
        codigo: produto.codigo,
        nome: produto.nome,
        marca_id: produto.marca_id,
        categoria_id: produto.categoria_id,
        unidade: produto.unidade,
        preco_custo: produto.preco_custo,
        preco_venda: produto.preco_venda,
        preco_custo_promocional: produto.preco_custo_promocional ?? "",
        preco_venda_promocional: produto.preco_venda_promocional ?? "",
        promocao_ativa: Boolean(produto.promocao_ativa),
        promocao_inicio: produto.promocao_inicio?.slice(0, 10) ?? "",
        promocao_fim: produto.promocao_fim?.slice(0, 10) ?? "",
        promocao_observacao: produto.promocao_observacao ?? "",
        estoque_minimo: produto.estoque_minimo,
        controlar_estoque: produto.controlar_estoque,
        codigo_barras: produto.codigo_barras ?? "",
        imagem_principal_url: produto.imagem_principal_url ?? "",
        slug: produto.slug ?? "",
        descricao_curta: produto.descricao_curta ?? "",
        visivel_no_catalogo: Boolean(produto.visivel_no_catalogo ?? true),
        destaque: Boolean(produto.destaque),
        mais_vendido: Boolean(produto.mais_vendido),
        novo: Boolean(produto.novo),
        ordem_exibicao: produto.ordem_exibicao ?? null,
        descricao: produto.descricao ?? "",
        observacoes: produto.observacoes ?? "",
        estoque_inicial: 0
      });
    }
  }, [produto]);

  function setField<K extends keyof ProdutoFormState>(key: K, value: ProdutoFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Moeda e estoque sao normalizados antes do POST/PUT para a API receber tipos previsiveis.
      const precoCustoPromocional = form.preco_custo_promocional === "" || form.preco_custo_promocional === undefined ? null : parseCurrencyInput(form.preco_custo_promocional);
      const precoVendaPromocional = form.preco_venda_promocional === "" || form.preco_venda_promocional === undefined ? null : parseCurrencyInput(form.preco_venda_promocional);
      await onSubmit({
        ...form,
        preco_custo: parseCurrencyInput(form.preco_custo),
        preco_venda: parseCurrencyInput(form.preco_venda),
        preco_custo_promocional: precoCustoPromocional,
        preco_venda_promocional: precoVendaPromocional,
        promocao_ativa: Boolean(form.promocao_ativa),
        promocao_inicio: form.promocao_inicio || null,
        promocao_fim: form.promocao_fim || null,
        promocao_observacao: form.promocao_observacao || null,
        marca_id: Number(form.marca_id),
        categoria_id: Number(form.categoria_id),
        imagem_principal_url: form.imagem_principal_url || null,
        slug: form.slug || null,
        descricao_curta: form.descricao_curta || null,
        visivel_no_catalogo: Boolean(form.visivel_no_catalogo),
        destaque: Boolean(form.destaque),
        mais_vendido: Boolean(form.mais_vendido),
        novo: Boolean(form.novo),
        ordem_exibicao: form.ordem_exibicao === null || form.ordem_exibicao === undefined ? null : Number(form.ordem_exibicao),
        controlar_estoque: Boolean(form.controlar_estoque),
        estoque_inicial: Math.trunc(Number(form.estoque_inicial ?? 0)),
        estoque_minimo: Math.trunc(Number(form.estoque_minimo ?? 0))
      });
    } catch (error) {
      const responseData = typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { data?: unknown } }).response?.data
        : undefined;
      console.error("Erro ao salvar produto", responseData ?? error);
      const apiMessage = typeof responseData === "object" && responseData !== null && "message" in responseData
        ? String((responseData as { message?: string }).message)
        : "";
      setError(apiMessage || (responseData ? "A API recusou os dados enviados. Confira preco, unidade, marca, categoria e estoque." : "Nao foi possivel salvar o produto. Confira os campos e tente novamente."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <form className="grid gap-5" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input label="Codigo" value={form.codigo} onChange={(e) => setField("codigo", e.target.value)} required />
          <Input label="Nome do produto" value={form.nome} onChange={(e) => setField("nome", e.target.value)} required />
          <Select label="Marca" value={form.marca_id || ""} onChange={(e) => setField("marca_id", Number(e.target.value))} required>
            <option value="">Selecione</option>
            {/* Inativas ficam escondidas em produto novo, mas aparecem se ja estavam vinculadas ao produto editado. */}
            {marcasDisponiveis.map((marca) => <option key={marca.id} value={marca.id}>{marca.nome}{!marca.ativo ? " (inativa)" : ""}</option>)}
          </Select>
          <Select label="Categoria" value={form.categoria_id || ""} onChange={(e) => setField("categoria_id", Number(e.target.value))} required>
            <option value="">Selecione</option>
            {categoriasDisponiveis.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}{!categoria.ativo ? " (inativa)" : ""}</option>)}
          </Select>
          {/* Lista fixa evita texto livre como "unid" ou "caixa" enquanto nao existe modulo de unidades. */}
          <Select label="Unidade" value={form.unidade} onChange={(e) => setField("unidade", e.target.value as UnidadeProduto)} required>
            {unidadesProduto.map((unidade) => (
              <option key={unidade} value={unidade}>{unidadeProdutoLabels[unidade]}</option>
            ))}
          </Select>
          <Input label="Preco de custo" inputMode="decimal" value={form.preco_custo} onChange={(e) => setField("preco_custo", e.target.value)} required />
          <Input label="Preco de venda" inputMode="decimal" value={form.preco_venda} onChange={(e) => setField("preco_venda", e.target.value)} required />
          {!produto && <Input label="Estoque inicial" type="number" min="0" step="1" value={form.estoque_inicial} onChange={(e) => setField("estoque_inicial", Math.trunc(Number(e.target.value)))} required />}
          <Input label="Codigo de barras" value={form.codigo_barras ?? ""} onChange={(e) => setField("codigo_barras", e.target.value)} />
          <Input label="Estoque minimo" type="number" min="0" step="1" value={form.estoque_minimo} onChange={(e) => setField("estoque_minimo", Math.trunc(Number(e.target.value)))} />
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/35 px-3 text-sm text-slate-200">
            <input type="checkbox" checked={form.controlar_estoque} onChange={(e) => setField("controlar_estoque", e.target.checked)} />
            Controlar estoque
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Descricao" value={form.descricao ?? ""} onChange={(e) => setField("descricao", e.target.value)} />
          <Input label="Observacoes" value={form.observacoes ?? ""} onChange={(e) => setField("observacoes", e.target.value)} />
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/25 p-4">
          <h2 className="mb-1 font-semibold text-white">Catalogo publico</h2>
          <p className="mb-4 text-xs text-slate-400">Esses campos controlam a vitrine publica. Produto arquivado nunca aparece no catalogo.</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Input label="URL da imagem principal" value={form.imagem_principal_url ?? ""} onChange={(e) => setField("imagem_principal_url", e.target.value)} />
            <Input label="Slug publico" value={form.slug ?? ""} onChange={(e) => setField("slug", e.target.value)} placeholder="gerado automaticamente" />
            <Input label="Descricao curta" value={form.descricao_curta ?? ""} onChange={(e) => setField("descricao_curta", e.target.value)} />
            <Input label="Ordem de exibicao" type="number" value={form.ordem_exibicao ?? ""} onChange={(e) => setField("ordem_exibicao", e.target.value ? Number(e.target.value) : null)} />
            <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/35 px-3 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(form.visivel_no_catalogo)} onChange={(e) => setField("visivel_no_catalogo", e.target.checked)} />
              Visivel no catalogo
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/35 px-3 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(form.destaque)} onChange={(e) => setField("destaque", e.target.checked)} />
              Destaque
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/35 px-3 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(form.mais_vendido)} onChange={(e) => setField("mais_vendido", e.target.checked)} />
              Mais vendido
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/35 px-3 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(form.novo)} onChange={(e) => setField("novo", e.target.checked)} />
              Novo
            </label>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/25 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">Precos promocionais (opcional)</h2>
              <p className="mt-1 text-xs text-slate-400">Promocao nao duplica produto nem substitui os precos padrao.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(form.promocao_ativa)} onChange={(e) => setField("promocao_ativa", e.target.checked)} />
              Promocao ativa?
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input label="Preco de custo promocional" inputMode="decimal" value={form.preco_custo_promocional ?? ""} onChange={(e) => setField("preco_custo_promocional", e.target.value)} />
            <Input label="Preco de venda promocional" inputMode="decimal" value={form.preco_venda_promocional ?? ""} onChange={(e) => setField("preco_venda_promocional", e.target.value)} />
            <Input label="Inicio da promocao" type="date" value={form.promocao_inicio ?? ""} onChange={(e) => setField("promocao_inicio", e.target.value)} />
            <Input label="Fim da promocao" type="date" value={form.promocao_fim ?? ""} onChange={(e) => setField("promocao_fim", e.target.value)} />
            <Input label="Observacao da promocao" value={form.promocao_observacao ?? ""} onChange={(e) => setField("promocao_observacao", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          {/* Cancelar evita que o usuario fique preso na tela de edicao quando decide nao salvar. */}
          {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" loading={loading} iconLeft={<Save className="h-4 w-4" />}>Salvar produto</Button>
        </div>
      </form>
    </Card>
  );
}
