import { Router } from "express";
import { catalogoHomeController, getCatalogoProdutoController, listCatalogoProdutosController } from "./catalogo.controller.js";

export const catalogoRoutes = Router();

catalogoRoutes.get("/home", catalogoHomeController);
catalogoRoutes.get("/produtos", listCatalogoProdutosController);
catalogoRoutes.get("/produtos/:slug", getCatalogoProdutoController);
