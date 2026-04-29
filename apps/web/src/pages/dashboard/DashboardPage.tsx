import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Boxes, CircleDollarSign, Package, PackageCheck, PackageX, TrendingDown } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { toCurrency } from "../../lib/currency";
import { formatNumber } from "../../lib/formatters";
import { getDashboardResumo, type DashboardResumo } from "../../features/dashboard/services/dashboardService";

const colors = ["#38bdf8", "#ec4899", "#8b5cf6", "#34d399", "#f59e0b", "#f43f5e"];

export function DashboardPage() {
  const [data, setData] = useState<DashboardResumo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardResumo().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data) return null;

  const cards = [
    { label: "Total de produtos", value: data.kpis.totalProdutos, icon: Package, tone: "text-cyan-200" },
    { label: "Em estoque", value: data.kpis.produtosEmEstoque, icon: PackageCheck, tone: "text-emerald-200" },
    { label: "Estoque baixo", value: data.kpis.estoqueBaixo, icon: TrendingDown, tone: "text-amber-200" },
    { label: "Esgotados", value: data.kpis.esgotados, icon: PackageX, tone: "text-rose-200" },
    { label: "Valor custo", value: toCurrency(data.kpis.valorEstoqueCusto), icon: Boxes, tone: "text-violet-200" },
    { label: "Valor venda", value: toCurrency(data.kpis.valorEstoqueVenda), icon: CircleDollarSign, tone: "text-pink-200" }
  ];

  const futuros = ["Clientes", "Vendas", "Caixa", "Resumo", "Financeiro", "Relatórios avançados"];

  return (
    <>
      <PageHeader title="Inicio" description="Dashboard atual focado em produtos, estoque e movimentacoes." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <Icon className={`mb-4 h-6 w-6 ${item.tone}`} />
              <p className="text-sm text-slate-400">{item.label}</p>
              <strong className="mt-2 block text-2xl text-white">{item.value}</strong>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <ChartCard title="Produtos por categoria">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.produtosPorCategoria} dataKey="quantidade" nameKey="nome" innerRadius={58} outerRadius={92} paddingAngle={4}>
                {data.produtosPorCategoria.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Produtos por marca">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.produtosPorMarca} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="nome" type="category" stroke="#94a3b8" width={90} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status do estoque">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.statusEstoque}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <ChartCard title="Entradas de estoque por periodo">
          {data.entradasPorPeriodo.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.entradasPorPeriodo}>
                <defs>
                  <linearGradient id="entradaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="periodo" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="quantidade" stroke="#38bdf8" fill="url(#entradaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-400">Sem movimentacoes suficientes para o periodo.</p>}
        </ChartCard>

        <Card>
          <h2 className="mb-3 text-lg font-bold text-white">Leitura rápida</h2>
          <p className="text-sm leading-6 text-slate-400">
            Os indicadores atuais usam apenas produtos, estoque e movimentacoes. Clientes, vendas e caixa aparecem como proximos modulos, mas ainda nao alimentam estes números.
          </p>
        </Card>
      </div>

      <Card className="mt-5">
        <h2 className="mb-4 text-lg font-bold text-white">Produtos com menor estoque</h2>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr><th className="py-2">Código</th><th>Produto</th><th>Marca</th><th>Categoria</th><th>Atual</th><th>Mínimo</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.produtosCriticos.map((item) => (
                <tr key={item.id} className="border-t border-white/10 text-slate-200">
                  <td className="py-3 font-mono text-cyan-200">{item.codigo}</td>
                  <td>{item.nome}</td>
                  <td>{item.marca}</td>
                  <td>{item.categoria}</td>
                  <td>{formatNumber(item.estoqueAtual)}</td>
                  <td>{formatNumber(item.estoqueMinimo)}</td>
                  <td><Badge status={item.status === "ESGOTADO" ? "ESGOTADO" : "BAIXO"}>{item.status}</Badge></td>
                </tr>
              ))}
              {!data.produtosCriticos.length && <tr><td colSpan={7} className="py-8 text-center text-slate-400">Nenhum produto crítico no momento.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {futuros.map((item) => (
          <Card key={item} className="opacity-75">
            <Badge status="DEFAULT">Em breve</Badge>
            <h3 className="mt-3 font-semibold text-white">{item}</h3>
            <p className="mt-1 text-xs text-slate-400">Estrutura reservada para proximas fases.</p>
          </Card>
        ))}
      </div>
    </>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      {children}
    </Card>
  );
}
