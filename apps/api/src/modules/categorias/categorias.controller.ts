import type { RequestHandler } from "express";
import { categoriasService } from "./categorias.service.js";

export const listCategoriasController: RequestHandler = async (_request, response, next) => {
  try {
    const categorias = await categoriasService.list();
    response.json(categorias);
  } catch (error) {
    next(error);
  }
};

export const createCategoriaController: RequestHandler = async (request, response, next) => {
  try {
    const categoria = await categoriasService.create(request.body);
    response.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};
