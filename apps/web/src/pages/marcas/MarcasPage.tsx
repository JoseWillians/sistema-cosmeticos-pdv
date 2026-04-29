import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { MarcaForm } from "../../features/marcas/components/MarcaForm";
import { MarcasTable } from "../../features/marcas/components/MarcasTable";
import { createMarca, getMarcas } from "../../features/marcas/services/marcasService";
import type { Marca } from "../../types/marca";

export function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setMarcas(await getMarcas());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(nome: string) {
    await createMarca({ nome });
    await load();
  }

  return (
    <>
      <PageHeader title="Marcas" description="Cadastro simples das marcas vendidas." />
      <Card className="mb-5"><MarcaForm onSubmit={handleCreate} /></Card>
      {loading ? <Loading /> : <MarcasTable marcas={marcas} />}
    </>
  );
}
