// TODO: Rotas de autenticação - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_LOGIN.md
import { Router } from "express";
import { loginController } from "../controllers/auth/loginController";
import { logoutController } from "../controllers/auth/logoutController";
import { meController } from "../controllers/auth/meController";
import { registerController } from "../controllers/auth/registerController";
import {
    forgotPasswordController,
    resetPasswordController,
} from "../controllers/auth/resetPasswordController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authEmailRateLimiter, authRateLimiter } from "../middlewares/rateLimiter";
import { createBackendSession, resolveFirebaseUser, SESSION_COOKIE_NAME } from "../services/authService";
import { sessionCookieOptions } from "../config/sessionCookie";
import { adminAuth } from "../config/firebaseAdmin";
import { sessionSchema } from "../schemas/authSchemas";

const authRouter = Router();

// Aplica rate limit em todas as rotas públicas de auth
authRouter.post("/login", authRateLimiter, authEmailRateLimiter, loginController);
authRouter.post("/register", authRateLimiter, authEmailRateLimiter, registerController);
authRouter.post("/forgot-password", authRateLimiter, authEmailRateLimiter, forgotPasswordController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/reset-password", authRateLimiter, authEmailRateLimiter, resetPasswordController);
authRouter.get("/me", authMiddleware, meController);

const firebaseSessionHandler = async (req: any, res: any) => {
  try {
    const { idToken } = sessionSchema.parse(req.body);
    const verified = await adminAuth.verifyIdToken(idToken);
    const user = await resolveFirebaseUser({
      uid: verified.uid,
      email: verified["email"],
      name: verified["name"],
    });
    const { token, maxAge } = await createBackendSession(user.id);
    res.cookie(SESSION_COOKIE_NAME, token, { ...sessionCookieOptions, maxAge });
    return res.status(200).json({ user: { id: user.id, email: user.email, displayName: user.displayName, authProvider: user.authProvider } });
  } catch (err: any) {
    if (err?.name === "ZodError") return res.status(400).json({ error: err.issues[0]?.message ?? "Dados inválidos" });
    if (err?.message?.includes("conta local") || err?.message?.includes("Conflito")) return res.status(409).json({ error: err.message });
    return res.status(401).json({ error: "Não foi possível autenticar com Google." });
  }
};

authRouter.post("/session", authRateLimiter, authEmailRateLimiter, firebaseSessionHandler);

export { authRouter };
