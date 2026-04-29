import { PackagePlus } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Table, TableWrap } from "../../../components/ui/Table";
import { toCurrency } from "../../../lib/currency";
import { formatNumber } from "../../../lib/formatters";
import type { EstoqueProduto } from "../../../types/estoque";

export function EstoqueTable({ itens, onMovimentar }: { itens: EstoqueProduto[]; onMovimentar: (item: EstoqueProduto) => void }) {
  // Estoque vem da view do banco, mantendo o mesmo status visto pelo dashboard e pela API.
  return (
    <TableWrap>
      <Table>
        <thead className="bg-white/5 text-xs uppercase text-slate-400">
          <tr>
            {["Codigo", "Produto", "Marca", "Categoria", "Disponivel", "Minimo", "Venda", "Status", "Acoes"].map((head) => (
              <th key={head} className="px-4 py-3 font-semibold">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.produto_id} className="text-slate-200">
              <td className="px-4 py-3 font-mono text-xs text-cyan-200">{item.codigo}</td>
              <td className="px-4 py-3 font-medium text-white">{item.produto}</td>
              <td className="px-4 py-3">{item.marca}</td>
              <td className="px-4 py-3">{item.categoria}</td>
              <td className="px-4 py-3">{formatNumber(item.estoque_disponivel)}</td>
              <td className="px-4 py-3">{formatNumber(item.estoque_minimo)}</td>
              <td className="px-4 py-3">{toCurrency(item.preco_venda)}</td>
              <td className="px-4 py-3"><Badge status={item.status_estoque}>{item.status_estoque}</Badge></td>
              <td className="px-4 py-3">
                <Button variant="success" className="h-9 px-3" onClick={() => onMovimentar(item)} iconLeft={<PackagePlus className="h-4 w-4" />}>Movimentar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}
