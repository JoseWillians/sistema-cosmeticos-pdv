import { Router } from "express";
import { validateBody } from "../../shared/middlewares/validateRequest.js";
import { archiveMarcaController, createMarcaController, listMarcasController, updateMarcaController, updateMarcaStatusController } from "./marcas.controller.js";
import { marcaSchema, marcaStatusSchema, marcaUpdateSchema } from "./marcas.schema.js";

export const marcasRoutes = Router();

marcasRoutes.get("/", listMarcasController);
marcasRoutes.post("/", validateBody(marcaSchema), createMarcaController);
marcasRoutes.put("/:id", validateBody(marcaUpdateSchema), updateMarcaController);
marcasRoutes.patch("/:id/status", validateBody(marcaStatusSchema), updateMarcaStatusController);
marcasRoutes.delete("/:id", archiveMarcaController);
