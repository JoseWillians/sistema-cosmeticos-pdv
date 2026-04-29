import type { RequestHandler } from "express";
import { dashboardService } from "./dashboard.service.js";

export const dashboardResumoController: RequestHandler = async (_request, response, next) => {
  try {
    // Rota agregadora evita varias chamadas do frontend e centraliza as regras dos indicadores.
    response.json(await dashboardService.resumo());
  } catch (error) {
    next(error);
  }
};
