import type { Categoria } from "../../../types/categoria";
import type { Marca } from "../../../types/marca";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

export function ProdutoFiltros({
  busca,
  marcaId,
  categoriaId,
  marcas,
  categorias,
  onBusca,
  onMarca,
  onCategoria
}: {
  busca: string;
  marcaId: string;
  categoriaId: string;
  marcas: Marca[];
  categorias: Categoria[];
  onBusca: (value: string) => void;
  onMarca: (value: string) => void;
  onCategoria: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
      <Input label="Buscar" placeholder="Codigo ou nome" value={busca} onChange={(e) => onBusca(e.target.value)} />
      <Select label="Marca" value={marcaId} onChange={(e) => onMarca(e.target.value)}>
        <option value="">Todas</option>
        {marcas.map((marca) => <option key={marca.id} value={marca.id}>{marca.nome}</option>)}
      </Select>
      <Select label="Categoria" value={categoriaId} onChange={(e) => onCategoria(e.target.value)}>
        <option value="">Todas</option>
        {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
      </Select>
    </div>
  );
}
