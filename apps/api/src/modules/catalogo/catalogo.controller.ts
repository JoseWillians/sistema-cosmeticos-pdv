import type { RequestHandler } from "express";
import { catalogoService } from "./catalogo.service.js";

export const catalogoHomeController: RequestHandler = async (_request, response, next) => {
  try {
    response.json(await catalogoService.home());
  } catch (error) {
    next(error);
  }
};

export const listCatalogoProdutosController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await catalogoService.listProdutos({
      busca: request.query.busca as string | undefined,
      marca_id: request.query.marca_id ? Number(request.query.marca_id) : undefined,
      categoria_id: request.query.categoria_id ? Number(request.query.categoria_id) : undefined,
      promocao: request.query.promocao === "true",
      destaque: request.query.destaque === "true",
      page: request.query.page ? Number(request.query.page) : undefined,
      limit: request.query.limit ? Number(request.query.limit) : undefined
    }));
  } catch (error) {
    next(error);
  }
};

export const getCatalogoProdutoController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await catalogoService.getProduto(request.params.slug));
  } catch (error) {
    next(error);
  }
};
