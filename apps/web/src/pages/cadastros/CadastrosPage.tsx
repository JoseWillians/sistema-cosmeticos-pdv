import { FormEvent, useEffect, useState } from "react";
import { Archive, Edit, RotateCcw, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { Loading } from "../../components/feedback/Loading";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Table, TableWrap } from "../../components/ui/Table";
import { archiveCategoria, createCategoria, getCategorias, updateCategoria, updateCategoriaStatus } from "../../features/categorias/services/categoriasService";
import { archiveMarca, createMarca, getMarcas, updateMarca, updateMarcaStatus } from "../../features/marcas/services/marcasService";
import type { Categoria } from "../../types/categoria";
import type { Marca } from "../../types/marca";

type Tab = "marcas" | "categorias";
type CadastroItem = Marca | Categoria;

export function CadastrosPage() {
  const [tab, setTab] = useState<Tab>("marcas");
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [marcasData, categoriasData] = await Promise.all([getMarcas(), getCategorias()]);
    setMarcas(marcasData);
    setCategorias(categoriasData);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <PageHeader title="Cadastros" description="Marcas e categorias auxiliares dos produtos." />
      <div className="mb-5 flex gap-2">
        <Button variant={tab === "marcas" ? "primary" : "secondary"} onClick={() => setTab("marcas")}>Marcas</Button>
        <Button variant={tab === "categorias" ? "primary" : "secondary"} onClick={() => setTab("categorias")}>Categorias</Button>
      </div>
      {loading ? <Loading /> : tab === "marcas" ? (
        <CadastroManager
          title="Marcas"
          itemLabel="marca"
          items={marcas}
          onCreate={(nome) => createMarca({ nome })}
          onUpdate={(id, nome) => updateMarca(id, { nome })}
          onStatus={updateMarcaStatus}
          onArchive={archiveMarca}
          onReload={load}
        />
      ) : (
        <CadastroManager
          title="Categorias"
          itemLabel="categoria"
          items={categorias}
          onCreate={(nome) => createCategoria({ nome })}
          onUpdate={(id, nome) => updateCategoria(id, { nome })}
          onStatus={updateCategoriaStatus}
          onArchive={archiveCategoria}
          onReload={load}
        />
      )}
    </>
  );
}

function CadastroManager({
  title,
  itemLabel,
  items,
  onCreate,
  onUpdate,
  onStatus,
  onArchive,
  onReload
}: {
  title: string;
  itemLabel: string;
  items: CadastroItem[];
  onCreate: (nome: string) => Promise<unknown>;
  onUpdate: (id: number, nome: string) => Promise<unknown>;
  onStatus: (id: number, ativo: boolean) => Promise<unknown>;
  onArchive: (id: number) => Promise<unknown>;
  onReload: () => Promise<void>;
}) {
  const [nome, setNome] = useState("");
  const [editing, setEditing] = useState<CadastroItem | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(action: () => Promise<unknown>, message: string) {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await action();
      setSuccess(message);
      setNome("");
      setEditing(null);
      await onReload();
    } catch (error) {
      const data = typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      setError(data?.message ?? "Nao foi possivel concluir a acao.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = nome.trim();
    if (!trimmed) {
      setError("Informe um nome.");
      return;
    }
    await run(() => editing ? onUpdate(editing.id, trimmed) : onCreate(trimmed), editing ? "Cadastro atualizado." : "Cadastro criado.");
  }

  function startEdit(item: CadastroItem) {
    setEditing(item);
    setNome(item.nome);
    setError("");
    setSuccess("");
  }

  async function archiveItem(item: CadastroItem) {
    // Arquivar e soft delete: some da listagem normal, mas permanece no banco para historico.
    if (!window.confirm(`Arquivar ${itemLabel} "${item.nome}"?`)) return;
    await run(() => onArchive(item.id), "Cadastro arquivado.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.4fr]">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-white">{editing ? `Editar ${itemLabel}` : `Nova ${itemLabel}`}</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}
          {success && <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</div>}
          <Input label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} required />
          <div className="flex gap-3">
            {editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); setNome(""); }}>Cancelar</Button>}
            <Button type="submit" loading={loading} iconLeft={<Save className="h-4 w-4" />}>{editing ? "Salvar" : "Cadastrar"}</Button>
          </div>
        </form>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
        <TableWrap>
          <Table>
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Criado em</th><th className="px-4 py-3">Acoes</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="text-slate-200">
                  <td className="px-4 py-3 font-medium text-white">{item.nome}</td>
                  <td className="px-4 py-3"><Badge status={item.ativo ? "OK" : "DEFAULT"}>{item.ativo ? "Ativo" : "Inativo"}</Badge></td>
                  <td className="px-4 py-3 text-slate-400">{new Date(item.criado_em).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" className="h-9 px-3" onClick={() => startEdit(item)} iconLeft={<Edit className="h-4 w-4" />}>Editar</Button>
                      <Button variant={item.ativo ? "ghost" : "success"} className="h-9 px-3" onClick={() => run(() => onStatus(item.id, !item.ativo), item.ativo ? "Cadastro desativado." : "Cadastro reativado.")} iconLeft={item.ativo ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}>{item.ativo ? "Desativar" : "Reativar"}</Button>
                      <Button variant="danger" className="h-9 px-3" onClick={() => archiveItem(item)} iconLeft={item.ativo ? <Archive className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}>Arquivar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>
    </div>
  );
}
