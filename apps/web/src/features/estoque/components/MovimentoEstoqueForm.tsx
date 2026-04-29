import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { formatNumber } from "../../../lib/formatters";
import type { EstoqueMovimentoPayload, TipoMovimentoEstoque } from "../../../types/estoque";

interface ProdutoMovimentavel {
  produto_id: number;
  codigo: string;
  produto: string;
  estoque_disponivel: number;
}

const tipos: Array<{ value: TipoMovimentoEstoque; label: string }> = [
  { value: "ENTRADA", label: "Entrada - reposicao/compra" },
  { value: "SAIDA", label: "Saida - retirada manual" },
  { value: "AJUSTE_ENTRADA", label: "Ajuste positivo" },
  { value: "AJUSTE_SAIDA", label: "Ajuste negativo" }
];

export function MovimentoEstoqueModal({
  produto,
  onClose,
  onSubmit
}: {
  produto: ProdutoMovimentavel;
  onClose: () => void;
  onSubmit: (payload: EstoqueMovimentoPayload) => Promise<void>;
}) {
  const [tipo, setTipo] = useState<TipoMovimentoEstoque>("ENTRADA");
  const [quantidade, setQuantidade] = useState("1");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const quantidadeMovimentar = Number(quantidade || 0);
  const movimentoSoma = tipo === "ENTRADA" || tipo === "AJUSTE_ENTRADA";
  const estoqueFinalPrevisto = movimentoSoma
    ? Number(produto.estoque_disponivel) + quantidadeMovimentar
    : Number(produto.estoque_disponivel) - quantidadeMovimentar;
  const estoqueNegativo = estoqueFinalPrevisto < 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);
    const quantidadeInteira = Number(quantidade);
    if (!Number.isInteger(quantidadeInteira) || quantidadeInteira <= 0) {
      setFeedback({ type: "error", message: "Informe uma quantidade inteira maior que zero." });
      return;
    }
    setLoading(true);
    try {
      const payload: EstoqueMovimentoPayload = {
        produto_id: Number(produto.produto_id),
        tipo,
        quantidade: quantidadeInteira,
        observacao: observacao.trim() || undefined
      };
      // Observacao deste modal documenta o movimento, sem alterar a observacao cadastral do produto.
      if (import.meta.env.DEV) console.log("Payload de movimentacao de estoque", payload);
      await onSubmit(payload);
      setFeedback({ type: "success", message: "Movimento registrado com sucesso." });
      window.setTimeout(onClose, 700);
    } catch (error) {
      const responseData = typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      console.error("Erro ao movimentar estoque", responseData ?? error);
      setFeedback({ type: "error", message: responseData?.message ?? "Nao foi possivel registrar o movimento." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg border border-white/10 bg-navy p-5 shadow-glow">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Movimentar estoque</h2>
            <p className="mt-1 text-sm text-slate-400">{produto.codigo} - {produto.produto}</p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} iconLeft={<X className="h-4 w-4" />} aria-label="Fechar" />
        </div>
        <div className="grid gap-4">
          <div className="grid gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-4 sm:grid-cols-2">
            <div>
              <span className="text-xs uppercase text-slate-500">Estoque atual</span>
              <strong className="mt-1 block text-xl text-cyan-200">{formatNumber(produto.estoque_disponivel)}</strong>
            </div>
            <div>
              <span className="text-xs uppercase text-slate-500">Estoque final previsto</span>
              <strong className={estoqueNegativo ? "mt-1 block text-xl text-rose-200" : "mt-1 block text-xl text-emerald-200"}>
                {formatNumber(estoqueFinalPrevisto)}
              </strong>
            </div>
          </div>
          <Select label="Tipo de movimento" value={tipo} onChange={(event) => setTipo(event.target.value as TipoMovimentoEstoque)}>
            {tipos.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Input label="Quantidade a movimentar" type="number" min="1" step="1" value={quantidade} onChange={(event) => setQuantidade(event.target.value)} required />
          {estoqueNegativo && (
            <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              Este movimento deixara o estoque abaixo de zero. Confira a quantidade antes de salvar.
            </div>
          )}
          <Input
            label="Observacao da movimentacao"
            placeholder="Ex.: Reposicao comprada hoje, ajuste apos contagem fisica..."
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
          />
          {feedback && <div className={feedback.type === "success" ? "text-sm text-emerald-200" : "text-sm text-rose-200"}>{feedback.message}</div>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="success" loading={loading}>Salvar movimento</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
