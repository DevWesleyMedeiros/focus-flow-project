// TODO: Rotas de autenticação - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_LOGIN.md
import { Router } from "express";
import { loginController } from "../controllers/auth/loginController";
import { logoutController } from "../controllers/auth/logoutController";
import { registerController } from "../controllers/auth/registerController";
import { resetPasswordController } from "../controllers/auth/resetPasswordController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authRateLimiter } from "../middlewares/rateLimiter";
import { createFirebaseSession } from "../services/authService";

const authRouter = Router();

// Aplica rate limit em todas as rotas públicas de auth
authRouter.post("/login", authRateLimiter, loginController);
authRouter.post("/register", authRateLimiter, registerController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/reset-password", authRateLimiter, resetPasswordController);

// mostra o padrão recomendado pelo próprio Firebase sessão de cookies com Firebase
authRouter.post("/auth/session", async (req, res) => {
  const { idToken, csrfToken } = req.body;

  if (csrfToken !== req.cookies.csrfToken) {
    return res.status(401).send("UNAUTHORIZED REQUEST!");
  }

  try {
    const { sessionCookie, maxAge } = await createFirebaseSession(idToken);
    res.cookie("session", sessionCookie, {
      maxAge,
      httpOnly: true,
      secure: true, // RN-AUTH-11
      sameSite: "lax", // ajustar conforme domínio real (RN-AUTH-11)
    });
    return res.json({ status: "success" });
  } catch {
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
});

export { authRouter };
