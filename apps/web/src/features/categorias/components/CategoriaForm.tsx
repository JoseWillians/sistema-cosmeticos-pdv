import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export function CategoriaForm({ onSubmit }: { onSubmit: (nome: string) => Promise<void> }) {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    await onSubmit(nome);
    setNome("");
    setLoading(false);
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
      <div className="flex-1"><Input label="Nova categoria" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
      <Button type="submit" disabled={loading} icon={<Plus className="h-4 w-4" />}>Cadastrar</Button>
    </form>
  );
}
