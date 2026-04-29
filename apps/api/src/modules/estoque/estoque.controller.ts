import type { RequestHandler } from "express";
import { estoqueService } from "./estoque.service.js";

export const listEstoqueController: RequestHandler = async (_request, response, next) => {
  try {
    const estoque = await estoqueService.list();
    response.json(estoque);
  } catch (error) {
    next(error);
  }
};

export const createMovimentoEstoqueController: RequestHandler = async (request, response, next) => {
  try {
    const movimento = await estoqueService.createMovimento(request.body);
    response.status(201).json(movimento);
  } catch (error) {
    next(error);
  }
};
