import { Table, TableWrap } from "../../../components/ui/Table";
import type { Marca } from "../../../types/marca";

export function MarcasTable({ marcas }: { marcas: Marca[] }) {
  return (
    <TableWrap>
      <Table>
        <tbody>{marcas.map((marca) => <tr key={marca.id}><td className="px-4 py-3 text-white">{marca.nome}</td><td className="px-4 py-3 text-right text-slate-400">{marca.ativo ? "Ativa" : "Inativa"}</td></tr>)}</tbody>
      </Table>
    </TableWrap>
  );
}
