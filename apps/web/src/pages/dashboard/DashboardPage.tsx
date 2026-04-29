import { useEffect, useMemo, useState } from "react";
import { Boxes, Package, TrendingDown, WalletCards } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { toCurrency } from "../../lib/currency";
import { getEstoque } from "../../features/estoque/services/estoqueService";
import type { EstoqueProduto } from "../../types/estoque";

export function DashboardPage() {
  const [estoque, setEstoque] = useState<EstoqueProduto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEstoque().then(setEstoque).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = estoque.length;
    const emEstoque = estoque.filter((item) => item.estoque_disponivel > 0).length;
    const baixo = estoque.filter((item) => item.status_estoque === "BAIXO" || item.status_estoque === "ESGOTADO").length;
    const valor = estoque.reduce((sum, item) => sum + Number(item.preco_custo) * Number(item.estoque_disponivel), 0);
    return { total, emEstoque, baixo, valor };
  }, [estoque]);

  const cards = [
    { label: "Total de produtos", value: stats.total, icon: Package, color: "text-cyan-200" },
    { label: "Produtos em estoque", value: stats.emEstoque, icon: Boxes, color: "text-emerald-200" },
    { label: "Estoque baixo", value: stats.baixo, icon: TrendingDown, color: "text-amber-200" },
    { label: "Valor estimado", value: toCurrency(stats.valor), icon: WalletCards, color: "text-pink-200" }
  ];

  return (
    <>
      <PageHeader title="Inicio" description="Resumo visual da operacao local." />
      {loading ? <Loading /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <Icon className={`mb-5 h-6 w-6 ${item.color}`} />
                <p className="text-sm text-slate-400">{item.label}</p>
                <strong className="mt-2 block text-2xl text-white">{item.value}</strong>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
