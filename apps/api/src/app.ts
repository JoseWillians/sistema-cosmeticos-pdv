import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { routes } from "./routes.js";
import { errorHandler } from "./shared/errors/errorHandler.js";
import { notFound } from "./shared/middlewares/notFound.js";
import { apiRateLimiter } from "./shared/middlewares/rateLimiters.js";
import { getProjectRoot } from "./shared/utils/paths.js";

export const app = express();

// Helmet adiciona headers seguros sem alterar a regra de login local do MVP.
app.use(helmet());
// O frontend pode subir em portas diferentes do Vite; a lista explicita evita liberar origens externas.
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  ],
  credentials: true
}));
// JSON precisa vir antes das rotas para login e cadastros receberem body parseado.
app.use(express.json());
// Imagens de produto ficam em disco local e sao servidas publicamente para admin e catalogo.
app.use("/uploads/produtos", express.static(path.resolve(getProjectRoot(), "uploads", "produtos")));
app.use(apiRateLimiter);
app.use(routes);
app.use(notFound);
app.use(errorHandler);
