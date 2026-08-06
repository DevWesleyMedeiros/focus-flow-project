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
authRouter.post("/auth/firebase_session", async (req, res) => {
  const { idToken, csrfToken } = req.body;

  // Expectativa: cliente envia um csrfToken obtido previamente (double-submit)
  const existingCsrf = req.cookies?.csrfToken;
  if (
    !existingCsrf ||
    typeof csrfToken !== "string" ||
    csrfToken !== existingCsrf
  ) {
    return res.status(401).send("UNAUTHORIZED REQUEST!");
  }

  try {
    // Cria a session cookie via Firebase Admin
    const { sessionCookie, maxAge } = await createFirebaseSession(idToken);

    // Flag secure condicionada ao ambiente (evita falha em dev sem HTTPS) (ver se irá funcionar em desenvolvimento)
    const secureFlag = process.env["NODE_ENN"] === "production";

    // Use nomes específicos para evitar colisão com outros cookies (isolamento)
    res.cookie("firebase_session", sessionCookie, {
      maxAge,
      httpOnly: true,
      secure: secureFlag,
      sameSite: "lax",
      path: "/",
    });

    // Gera um novo CSRF token (double-submit pattern). Este cookie NÃO é httpOnly
    // para que o cliente facilite envio do token no corpo das requisições subsequentes.
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
});

export { authRouter };
