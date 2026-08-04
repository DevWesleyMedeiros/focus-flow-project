// TODO: Rotas de autenticação - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_LOGIN.md
import { Router } from "express";
import { loginController } from "../controllers/auth/loginController";
import { logoutController } from "../controllers/auth/logoutController";
import { registerController } from "../controllers/auth/registerController";
import { resetPasswordController } from "../controllers/auth/resetPasswordController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authRateLimiter } from "../middlewares/rateLimiter";

const authRouter = Router();

// Aplica rate limit em todas as rotas públicas de auth
authRouter.post("/login", authRateLimiter, loginController);
authRouter.post("/register", authRateLimiter, registerController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/reset-password", authRateLimiter, resetPasswordController);

export { authRouter };
