import { Router } from "express";
import { validateBody } from "../../shared/middlewares/validateRequest.js";
import { categoriaSchema, categoriaStatusSchema, categoriaUpdateSchema } from "./categorias.schema.js";
import { archiveCategoriaController, createCategoriaController, listCategoriasController, updateCategoriaController, updateCategoriaStatusController } from "./categorias.controller.js";

export const categoriasRoutes = Router();

categoriasRoutes.get("/", listCategoriasController);
categoriasRoutes.post("/", validateBody(categoriaSchema), createCategoriaController);
categoriasRoutes.put("/:id", validateBody(categoriaUpdateSchema), updateCategoriaController);
categoriasRoutes.patch("/:id/status", validateBody(categoriaStatusSchema), updateCategoriaStatusController);
categoriasRoutes.delete("/:id", archiveCategoriaController);
