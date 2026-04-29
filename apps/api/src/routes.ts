import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { categoriasRoutes } from "./modules/categorias/categorias.routes.js";
import { devRoutes } from "./modules/dev/dev.routes.js";
import { estoqueRoutes } from "./modules/estoque/estoque.routes.js";
import { marcasRoutes } from "./modules/marcas/marcas.routes.js";
import { produtosRoutes } from "./modules/produtos/produtos.routes.js";

export const routes = Router();

// /health fica propositalmente simples para monitores e testes rapidos.
routes.get("/health", (_request, response) => {
  response.json({ status: "ok", app: "sistema-cosmeticos-pdv" });
});

routes.post("/auth/login", (request, response) => {
  const { login, senha } = request.body ?? {};
  if (login === "admin" && senha === "admin") {
    return response.json({
      token: "local-token-admin",
      user: { nome: "Administrador", login: "admin", initials: "AD" }
    });
  }

  return response.status(401).json({ message: "Login ou senha invalidos." });
});

routes.use("/marcas", marcasRoutes);
routes.use("/categorias", categoriasRoutes);
routes.use("/produtos", produtosRoutes);
routes.use("/estoque", estoqueRoutes);

if (env.ENABLE_DEV_TOOLS) {
  // Ferramentas locais de diagnostico. Nao exibem credenciais e devem ficar desligadas fora do ambiente local.
  routes.use("/dev", devRoutes);
  routes.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
