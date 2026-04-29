import cors from "cors";
import express from "express";
import { routes } from "./routes.js";
import { errorHandler } from "./shared/errors/errorHandler.js";
import { notFound } from "./shared/middlewares/notFound.js";

export const app = express();

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
app.use(routes);
app.use(notFound);
app.use(errorHandler);
