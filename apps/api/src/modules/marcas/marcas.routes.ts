import { Router } from "express";
import { validateBody } from "../../shared/middlewares/validateRequest.js";
import { createMarcaController, listMarcasController } from "./marcas.controller.js";
import { marcaSchema } from "./marcas.schema.js";

export const marcasRoutes = Router();

marcasRoutes.get("/", listMarcasController);
marcasRoutes.post("/", validateBody(marcaSchema), createMarcaController);
