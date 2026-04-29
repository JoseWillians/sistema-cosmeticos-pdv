import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "./AppError.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    // Retornar campo e mensagem ajuda o frontend a diagnosticar payloads 400 sem expor stack trace.
    return response.status(400).json({
      message: "Erro de validação",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return response.status(500).json({ message: "Erro interno do servidor." });
};
