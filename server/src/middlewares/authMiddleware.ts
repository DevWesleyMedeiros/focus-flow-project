// TODO: Middleware de autenticação Firebase - verificar token JWT
import { NextFunction, Request, Response } from "express";
import { adminAuth } from "../config/firebaseAdmin";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const sessionCookie = req.cookies?.["firebase_session"];

  try {
    if (authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).json({ error: "Token não fornecido" });
      }
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      (req as any).user = decodedToken;
      return next();
    }

    if (sessionCookie) {
      const decodedToken = await adminAuth.verifySessionCookie(
        sessionCookie,
        true,
      );
      (req as any).user = decodedToken;
      return next();
    }

    return res.status(401).json({ error: "Token não fornecido" });
  } catch (error) {
    console.error("Falha na autenticação:", error);
    return res.status(401).json({ error: "Token inválido" });
  }
}
