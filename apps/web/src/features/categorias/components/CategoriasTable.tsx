import { Table, TableWrap } from "../../../components/ui/Table";
import type { Categoria } from "../../../types/categoria";

export function CategoriasTable({ categorias }: { categorias: Categoria[] }) {
  return (
    <TableWrap>
      <Table>
        <tbody>{categorias.map((categoria) => <tr key={categoria.id}><td className="px-4 py-3 text-white">{categoria.nome}</td><td className="px-4 py-3 text-right text-slate-400">{categoria.ativo ? "Ativa" : "Inativa"}</td></tr>)}</tbody>
      </Table>
    </TableWrap>
  );
}
