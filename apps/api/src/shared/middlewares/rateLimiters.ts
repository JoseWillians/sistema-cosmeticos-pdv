import rateLimit from "express-rate-limit";

// Rate limits simples reduzem abuso local/acidental sem criar autenticação real nesta fase do MVP.
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas requisicoes. Tente novamente em instantes." }
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas tentativas de login. Aguarde alguns minutos." }
});
