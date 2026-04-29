import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";

export function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("admin");
  const [senha, setSenha] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Login local controlado pela API; o frontend apenas guarda o token fake retornado.
      const { data } = await api.post("/auth/login", { login, senha });
      localStorage.setItem("pdv_token", data.token);
      navigate("/");
    } catch {
      setError("Login ou senha invalidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md">
        <div className="mb-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-magenta to-cyanGlow">
            <LockKeyhole className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">JW PDV</h1>
          <p className="mt-1 text-sm text-slate-400">Gestao de Cosmeticos</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}
          <Input label="Login" value={login} onChange={(event) => setLogin(event.target.value)} autoFocus />
          <Input label="Senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} />
          <Button type="submit" disabled={loading}>Entrar no sistema</Button>
        </form>
      </Card>
    </main>
  );
}
