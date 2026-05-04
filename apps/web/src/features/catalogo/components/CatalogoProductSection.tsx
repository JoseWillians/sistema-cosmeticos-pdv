import type { CatalogoProduto } from "../services/catalogoService";
import { CatalogoProductGrid } from "./CatalogoProductGrid";

export function CatalogoProductSection({ id, title, produtos }: { id?: string; title: string; produtos: CatalogoProduto[] }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-5 text-2xl font-bold md:text-3xl">{title}</h2>
      <CatalogoProductGrid produtos={produtos} />
    </section>
  );
}
