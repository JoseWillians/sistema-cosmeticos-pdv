import type { RequestHandler } from "express";
import { marcasService } from "./marcas.service.js";

export const listMarcasController: RequestHandler = async (_request, response, next) => {
  try {
    const marcas = await marcasService.list();
    response.json(marcas);
  } catch (error) {
    next(error);
  }
};

export const createMarcaController: RequestHandler = async (request, response, next) => {
  try {
    const marca = await marcasService.create(request.body);
    response.status(201).json(marca);
  } catch (error) {
    next(error);
  }
};
