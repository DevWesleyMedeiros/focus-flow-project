import rateLimit from "express-rate-limit";

// Rate limit geral por IP
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit específico para rotas de auth (mais restritivo)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 tentativas de login/cadastro
  message: { error: "Muitas tentativas, tente novamente em 15 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});
