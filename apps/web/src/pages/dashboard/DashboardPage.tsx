import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Boxes, CircleDollarSign, Clock3, Package, PackageCheck, PackageX, Sparkles, TrendingDown } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { toCurrency } from "../../lib/currency";
import { formatNumber } from "../../lib/formatters";
import { getDashboardResumo, type DashboardResumo } from "../../features/dashboard/services/dashboardService";

const colors = ["#38bdf8", "#ec4899", "#8b5cf6", "#34d399", "#f59e0b", "#f43f5e"];
const tooltipStyle = { background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#e2e8f0" };

export function DashboardPage() {
  const [data, setData] = useState<DashboardResumo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardResumo().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data) return null;

  const hasProdutosAtivos = data.kpis.totalProdutos > 0;
  const cards = [
    { label: "Produtos ativos", helper: "Listagem principal", value: data.kpis.totalProdutos, icon: Package, tone: "from-cyan-400/20 to-blue-500/10", badge: "Atual" },
    { label: "Em estoque", helper: "Saldo acima de zero", value: data.kpis.produtosEmEstoque, icon: PackageCheck, tone: "from-emerald-400/20 to-cyan-500/10", badge: "OK" },
    { label: "Estoque baixo", helper: "Abaixo ou no minimo", value: data.kpis.estoqueBaixo, icon: TrendingDown, tone: "from-amber-400/20 to-orange-500/10", badge: "Atencao" },
    { label: "Esgotados", helper: "Saldo zerado ou negativo", value: data.kpis.esgotados, icon: PackageX, tone: "from-rose-400/20 to-pink-500/10", badge: "Critico" },
    { label: "Valor custo", helper: "Estimativa do saldo ativo", value: toCurrency(data.kpis.valorEstoqueCusto), icon: Boxes, tone: "from-violet-400/20 to-fuchsia-500/10", badge: "Custo" },
    { label: "Valor venda", helper: "Potencial bruto em estoque", value: toCurrency(data.kpis.valorEstoqueVenda), icon: CircleDollarSign, tone: "from-pink-400/20 to-cyan-500/10", badge: "Venda" }
  ];

  const futuros = ["Clientes", "Vendas", "Caixa", "Resumo", "Financeiro"];

  return (
    <>
      <PageHeader title="Inicio" description="Produtos, estoque e movimentacoes em uma visao operacional." />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-6">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className={`relative overflow-hidden bg-gradient-to-br ${item.tone}`}>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950/35 ring-1 ring-white/10">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <Badge status="DEFAULT">{item.badge}</Badge>
              </div>
              <p className="relative mt-5 text-sm text-slate-300">{item.label}</p>
              <strong className="relative mt-2 block text-2xl text-white">{item.value}</strong>
              <p className="relative mt-2 text-xs text-slate-400">{item.helper}</p>
            </Card>
          );
        })}
      </div>

      {!hasProdutosAtivos && (
        <Card className="mt-5 border-cyan-300/15 bg-cyan-500/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400/15 text-cyan-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-white">Nenhum produto ativo no momento.</h2>
              <p className="mt-1 text-sm text-slate-300">Cadastre produtos ou revise arquivamentos para alimentar graficos, estoque critico e valores estimados.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <ChartCard title="Produtos por categoria">
          {data.produtosPorCategoria.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.produtosPorCategoria} dataKey="quantidade" nameKey="nome" innerRadius={64} outerRadius={104} paddingAngle={4}>
                  {data.produtosPorCategoria.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <DashboardEmptyState />}
        </ChartCard>

        <ChartCard title="Produtos por marca">
          {data.produtosPorMarca.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.produtosPorMarca} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="nome" type="category" stroke="#94a3b8" width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="quantidade" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
          ) : <DashboardEmptyState />}
        </ChartCard>

        <ChartCard title="Status do estoque">
          {data.statusEstoque.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.statusEstoque}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="quantidade" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          ) : <DashboardEmptyState />}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <ChartCard title="Entradas de estoque por periodo">
          {data.entradasPorPeriodo.length ? (
            <ResponsiveContainer width="100%" height={280}>
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
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="quantidade" stroke="#38bdf8" fill="url(#entradaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <DashboardEmptyState title="Ainda nao ha movimentacoes suficientes para este grafico." />}
        </ChartCard>

        <Card className="bg-gradient-to-br from-white/[0.08] to-cyan-500/[0.07]">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400/15 text-cyan-100">
              <Clock3 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Leitura rapida</h2>
          </div>
          <div className="grid gap-3 text-sm leading-6 text-slate-300">
            <p>O dashboard considera apenas produtos ativos. Produtos arquivados somem dos KPIs e do estoque ativo, mas continuam preservados no banco.</p>
            <p>Estoque baixo significa saldo maior que zero e menor ou igual ao minimo configurado. Esgotado indica saldo zerado ou negativo.</p>
            <p>Clientes, vendas e caixa ainda nao alimentam estes numeros; eles aparecem como proximas areas do sistema.</p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Produtos com menor estoque</h2>
          <Badge status={data.produtosCriticos.length ? "BAIXO" : "OK"}>{data.produtosCriticos.length ? "Atencao" : "Estavel"}</Badge>
        </div>
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
              {!data.produtosCriticos.length && <tr><td colSpan={7} className="py-8 text-center text-slate-400">Nenhum produto critico no momento.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-white">Proximos modulos</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {futuros.map((item) => (
          <div key={item} className="rounded-lg border border-white/10 bg-slate-950/30 p-4 opacity-80">
            <Badge status="DEFAULT">Em breve</Badge>
            <h3 className="mt-3 font-semibold text-white">{item}</h3>
            <p className="mt-1 text-xs text-slate-400">Reservado para proximas fases, sem dados reais ainda.</p>
          </div>
        ))}
        </div>
      </Card>
      </div>
    </>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="min-h-[360px]">
      <h2 className="mb-1 text-lg font-bold text-white">{title}</h2>
      <p className="mb-4 text-xs text-slate-500">Somente produtos ativos entram neste calculo.</p>
      {children}
    </Card>
  );
}

function DashboardEmptyState({ title = "Cadastre produtos e movimente estoque para visualizar dados." }: { title?: string }) {
  // Empty state evita que graficos sem dados parecam erro visual na fase inicial do sistema.
  return (
    <div className="grid min-h-[260px] place-items-center rounded-lg border border-dashed border-white/10 bg-slate-950/25 p-6 text-center">
      <div>
        <Sparkles className="mx-auto h-7 w-7 text-cyan-200" />
        <p className="mt-3 text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-400">Ainda nao ha dados suficientes para este painel.</p>
      </div>
    </div>
  );
}
