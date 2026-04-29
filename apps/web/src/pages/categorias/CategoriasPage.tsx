import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { CategoriaForm } from "../../features/categorias/components/CategoriaForm";
import { CategoriasTable } from "../../features/categorias/components/CategoriasTable";
import { createCategoria, getCategorias } from "../../features/categorias/services/categoriasService";
import type { Categoria } from "../../types/categoria";

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setCategorias(await getCategorias());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(nome: string) {
    await createCategoria({ nome });
    await load();
  }

  return (
    <>
      <PageHeader title="Categorias" description="Organize os produtos por grupos." />
      <Card className="mb-5"><CategoriaForm onSubmit={handleCreate} /></Card>
      {loading ? <Loading /> : <CategoriasTable categorias={categorias} />}
    </>
  );
}
