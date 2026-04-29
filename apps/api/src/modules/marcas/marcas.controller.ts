import type { RequestHandler } from "express";
import { marcasService } from "./marcas.service.js";

export const listMarcasController: RequestHandler = async (request, response, next) => {
  try {
    const marcas = await marcasService.list(request.query.status as "ativos" | "inativos" | "arquivados" | "todos" | undefined);
    response.json(marcas);
  } catch (error) {
    next(error);
  }
};

export const restoreMarcaController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await marcasService.restore(Number(request.params.id)));
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

export const updateMarcaController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await marcasService.update(Number(request.params.id), request.body));
  } catch (error) {
    next(error);
  }
};

export const updateMarcaStatusController: RequestHandler = async (request, response, next) => {
  try {
    response.json(await marcasService.setStatus(Number(request.params.id), request.body.ativo));
  } catch (error) {
    next(error);
  }
};

export const archiveMarcaController: RequestHandler = async (request, response, next) => {
  try {
    await marcasService.archive(Number(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
