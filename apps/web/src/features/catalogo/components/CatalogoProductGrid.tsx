import type { CatalogoProduto } from "../services/catalogoService";
import { CatalogoProductCard } from "./CatalogoProductCard";

export function CatalogoProductGrid({ produtos }: { produtos: CatalogoProduto[] }) {
  if (!produtos.length) return <div className="rounded-3xl bg-white p-8 text-center text-[#6f7b70] shadow-sm">Nenhum produto visivel nesta secao ainda.</div>;
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{produtos.map((produto) => <CatalogoProductCard key={produto.id} produto={produto} />)}</div>;
}
