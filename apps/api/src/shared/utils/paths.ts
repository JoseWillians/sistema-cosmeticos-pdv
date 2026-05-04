import path from "node:path";

// A API pode ser iniciada pela raiz (`npm run dev:api`) ou direto em apps/api.
// Resolver a raiz do projeto evita gravar uploads dentro da pasta errada apos mudanca de diretorio.
export function getProjectRoot() {
  return process.cwd().endsWith(path.join("apps", "api"))
    ? path.resolve(process.cwd(), "..", "..")
    : process.cwd();
}

