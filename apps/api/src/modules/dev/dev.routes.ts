import { Router } from "express";
import { devDatabaseController, devHomeController, devRoutesController } from "./dev.controller.js";

export const devRoutes = Router();

// Rotas auxiliares locais: leitura e diagnostico, sem comandos de escrita no banco.
devRoutes.get("/", devHomeController);
devRoutes.get("/database", devDatabaseController);
devRoutes.get("/routes", devRoutesController);
