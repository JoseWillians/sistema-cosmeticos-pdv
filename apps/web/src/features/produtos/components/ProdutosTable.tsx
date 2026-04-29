import { Edit, PackagePlus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Table, TableWrap } from "../../../components/ui/Table";
import { toCurrency } from "../../../lib/currency";
import { formatNumber } from "../../../lib/formatters";
import { unidadeProdutoLabels } from "../../../types/produto";
import type { Produto } from "../../../types/produto";

export function ProdutosTable({ produtos, onDelete, onMovimentar }: { produtos: Produto[]; onDelete: (id: number) => void; onMovimentar: (produto: Produto) => void }) {
  // A tabela mostra os campos operacionais que o balconista precisa comparar rapidamente.
  return (
    <TableWrap>
      <Table>
        <thead className="bg-white/5 text-xs uppercase text-slate-400">
          <tr>
            {["Codigo", "Produto", "Unidade", "Marca", "Categoria", "Estoque", "Custo", "Venda", "Status", "Acoes"].map((head) => (
              <th key={head} className="px-4 py-3 font-semibold">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id} className="border-t border-white/10 text-slate-200">
              <td className="px-4 py-3 font-mono text-xs text-cyan-200">{produto.codigo}</td>
              <td className="px-4 py-3 font-medium text-white">{produto.nome}</td>
              <td className="px-4 py-3">{unidadeProdutoLabels[produto.unidade] ?? produto.unidade}</td>
              <td className="px-4 py-3">{produto.marca}</td>
              <td className="px-4 py-3">{produto.categoria}</td>
              <td className="px-4 py-3">{formatNumber(produto.estoque_disponivel)}</td>
              <td className="px-4 py-3">{toCurrency(produto.preco_custo)}</td>
              <td className="px-4 py-3">{toCurrency(produto.preco_venda)}</td>
              <td className="px-4 py-3"><Badge status={produto.status_estoque}>{produto.status_estoque}</Badge></td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link to={`/produtos/${produto.id}/editar`}><Button variant="secondary" className="h-9 px-3" icon={<Edit className="h-4 w-4" />} /></Link>
                  <Button variant="success" className="h-9 px-3" onClick={() => onMovimentar(produto)} iconLeft={<PackagePlus className="h-4 w-4" />} />
                  <Button variant="danger" className="h-9 px-3" onClick={() => onDelete(produto.id)} iconLeft={<Trash2 className="h-4 w-4" />} />
                </div>
              </td>
            </tr>
          ))}
          {!produtos.length && (
            <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-400">Nenhum produto encontrado.</td></tr>
          )}
        </tbody>
      </Table>
    </TableWrap>
  );
}
