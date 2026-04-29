import rateLimit from "express-rate-limit";
import { env } from "../../config/env.js";

const isProduction = env.NODE_ENV === "production";
const localToolsEnabled = env.ENABLE_DEV_TOOLS || !isProduction;

const rateLimitMessage = {
  message: "Muitas requisições. Aguarde alguns instantes e tente novamente.",
  code: "RATE_LIMIT_EXCEEDED"
};

function isLocalToolingPath(path: string) {
  return path === "/health" || path === "/dev" || path.startsWith("/dev/") || path === "/api-docs" || path.startsWith("/api-docs/");
}

// Em desenvolvimento o limite e folgado para nao atrapalhar reloads, dashboards e testes locais.
// Em producao ele continua existindo como protecao basica contra abuso acidental.
export const apiRateLimiter = rateLimit({
  windowMs: isProduction ? 15 * 60 * 1000 : 60 * 1000,
  limit: isProduction ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
  handler: (_request, response) => response.status(429).json(rateLimitMessage),
  skip: (request) => {
    // /health e /dev sao usados para diagnostico local; bloquear esses endpoints dificulta saber se a API esta viva.
    return localToolsEnabled && isLocalToolingPath(request.path);
  }
});

// Login recebe limite proprio porque e a rota com maior risco de tentativa repetida de senha.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProduction ? 10 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
  handler: (_request, response) => response.status(429).json(rateLimitMessage)
});
