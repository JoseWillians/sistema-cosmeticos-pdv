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

export const updateCategoriaController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await categoriasService.update(Number(request.params.id), request.body));
  } catch (error) {
    next(error);
  }
};

export const updateCategoriaStatusController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await categoriasService.setStatus(Number(request.params.id), request.body.ativo));
  } catch (error) {
    next(error);
  }
};

export const archiveCategoriaController: RequestHandler = async (request, response, next) => {
  try {
    await categoriasService.archive(Number(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
