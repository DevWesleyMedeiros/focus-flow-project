// TODO: Rotas de autenticação - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_LOGIN.md
import { Router } from "express";
import { loginController } from "../controllers/auth/loginController";
import { logoutController } from "../controllers/auth/logoutController";
import { registerController } from "../controllers/auth/registerController";
import { resetPasswordController } from "../controllers/auth/resetPasswordController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/reset-password", resetPasswordController);

export { authRouter };
