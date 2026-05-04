import { cosmeticosVisualCategories } from "../themes/cosmeticos/cosmeticosSections";

export function CatalogoCategorias({ categorias }: { categorias: Array<{ id: number; nome: string; quantidade: number }> }) {
  const items = categorias.length ? categorias.map((c) => c.nome) : cosmeticosVisualCategories;
  return (
    <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-4">
      <div className="flex gap-3">
        {items.map((item) => <span key={item} className="whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold shadow-sm">{item}</span>)}
      </div>
    </div>
  );
}
