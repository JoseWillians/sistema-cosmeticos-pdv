import { Router } from "express";
import { validateBody } from "../../shared/middlewares/validateRequest.js";
import { createMovimentoEstoqueController, listEstoqueController } from "./estoque.controller.js";
import { estoqueMovimentoSchema } from "./estoque.schema.js";

export const estoqueRoutes = Router();

estoqueRoutes.get("/", listEstoqueController);
estoqueRoutes.post("/movimentos", validateBody(estoqueMovimentoSchema), createMovimentoEstoqueController);
