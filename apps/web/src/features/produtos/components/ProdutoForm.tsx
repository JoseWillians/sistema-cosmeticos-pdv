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

type ProdutoFormState = Omit<ProdutoPayload, "preco_custo" | "preco_venda"> & {
  preco_custo: string | number;
  preco_venda: string | number;
};

const initial: ProdutoFormState = {
  codigo: "",
  nome: "",
  marca_id: 0,
  categoria_id: 0,
  unidade: "UN",
  preco_custo: 0,
  preco_venda: 0,
  estoque_inicial: 0,
  estoque_minimo: 0,
  controlar_estoque: true,
  codigo_barras: "",
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
        estoque_minimo: produto.estoque_minimo,
        controlar_estoque: produto.controlar_estoque,
        codigo_barras: produto.codigo_barras ?? "",
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
      await onSubmit({
        ...form,
        preco_custo: parseCurrencyInput(form.preco_custo),
        preco_venda: parseCurrencyInput(form.preco_venda),
        marca_id: Number(form.marca_id),
        categoria_id: Number(form.categoria_id),
        controlar_estoque: Boolean(form.controlar_estoque),
        estoque_inicial: Math.trunc(Number(form.estoque_inicial ?? 0)),
        estoque_minimo: Math.trunc(Number(form.estoque_minimo ?? 0))
      });
    } catch (error) {
      const responseData = typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { data?: unknown } }).response?.data
        : undefined;
      console.error("Erro ao salvar produto", responseData ?? error);
      setError(responseData ? "A API recusou os dados enviados. Confira preco, unidade, marca, categoria e estoque." : "Nao foi possivel salvar o produto. Confira os campos e tente novamente.");
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
            {marcas.map((marca) => <option key={marca.id} value={marca.id}>{marca.nome}</option>)}
          </Select>
          <Select label="Categoria" value={form.categoria_id || ""} onChange={(e) => setField("categoria_id", Number(e.target.value))} required>
            <option value="">Selecione</option>
            {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
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
        <div className="flex justify-end">
          {/* Cancelar evita que o usuario fique preso na tela de edicao quando decide nao salvar. */}
          {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" loading={loading} iconLeft={<Save className="h-4 w-4" />}>Salvar produto</Button>
        </div>
      </form>
    </Card>
  );
}
