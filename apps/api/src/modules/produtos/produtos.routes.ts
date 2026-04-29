import { Router } from "express";
import { validateBody } from "../../shared/middlewares/validateRequest.js";
import {
  createProdutoController,
  deleteProdutoController,
  getProdutoController,
  listProdutosController,
  updateProdutoController
} from "./produtos.controller.js";
import { produtoCreateSchema, produtoUpdateSchema } from "./produtos.schema.js";

export const produtosRoutes = Router();

produtosRoutes.get("/", listProdutosController);
produtosRoutes.get("/:id", getProdutoController);
produtosRoutes.post("/", validateBody(produtoCreateSchema), createProdutoController);
produtosRoutes.put("/:id", validateBody(produtoUpdateSchema), updateProdutoController);
produtosRoutes.delete("/:id", deleteProdutoController);
