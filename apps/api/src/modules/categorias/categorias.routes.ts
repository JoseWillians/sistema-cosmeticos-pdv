import { Router } from "express";
import { validateBody } from "../../shared/middlewares/validateRequest.js";
import { categoriaSchema } from "./categorias.schema.js";
import { createCategoriaController, listCategoriasController } from "./categorias.controller.js";

export const categoriasRoutes = Router();

categoriasRoutes.get("/", listCategoriasController);
categoriasRoutes.post("/", validateBody(categoriaSchema), createCategoriaController);
