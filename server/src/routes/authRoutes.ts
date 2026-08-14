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
import { authRateLimiter } from "../middlewares/rateLimiter";
import {
    createFirebaseSession,
    upsertFirebaseUser,
} from "../services/authService";

const authRouter = Router();

// Aplica rate limit em todas as rotas públicas de auth
authRouter.post("/login", authRateLimiter, loginController);
authRouter.post("/register", authRateLimiter, registerController);
authRouter.post("/forgot-password", authRateLimiter, forgotPasswordController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/reset-password", authRateLimiter, resetPasswordController);
authRouter.get("/me", authMiddleware, meController);

const firebaseSessionHandler = async (req: any, res: any) => {
  const { idToken, csrfToken } = req.body;

  const existingCsrf = req.cookies?.csrfToken;
  if (
    !existingCsrf ||
    typeof csrfToken !== "string" ||
    csrfToken !== existingCsrf
  ) {
    return res.status(401).send("UNAUTHORIZED REQUEST!");
  }

  try {
    const verified = await (
      await import("../config/firebaseAdmin.js")
    ).adminAuth.verifyIdToken(idToken);
    await upsertFirebaseUser({
      uid: verified.uid,
      email: verified["email"],
      name: verified["name"],
    });

    const { sessionCookie, maxAge } = await createFirebaseSession(idToken);
    const secureFlag = process.env["NODE_ENV"] === "production";

    res.cookie("firebase_session", sessionCookie, {
      maxAge,
      httpOnly: true,
      secure: secureFlag,
      sameSite: "lax",
      path: "/",
    });

    const newCsrf = require("node:crypto").randomBytes(32).toString("hex");
    res.cookie("csrfToken", newCsrf, {
      maxAge,
      httpOnly: false,
      secure: secureFlag,
      sameSite: "lax",
      path: "/",
    });

    return res.json({ status: "success", csrfToken: newCsrf });
  } catch (err) {
    console.error("Erro ao criar session cookie Firebase:", err);
    return res.status(401).send("UNAUTHORIZED REQUEST!");
  }
};

authRouter.post("/firebase_session", authRateLimiter, firebaseSessionHandler);
authRouter.post("/session", authRateLimiter, firebaseSessionHandler);

export { authRouter };
