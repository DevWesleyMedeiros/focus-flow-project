import rateLimit, { ipKeyGenerator } from "express-rate-limit";

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

export const authEmailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env["NODE_ENV"] === "production" ? 10 : 50,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip ?? "")}:${String(req.body?.email ?? "").toLowerCase()}`,
  message: { error: "Muitas tentativas, tente novamente em alguns minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});
