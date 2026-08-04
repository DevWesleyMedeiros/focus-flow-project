// TODO: Middleware de autenticação Firebase - verificar token JWT
import { NextFunction, Request, Response } from "express";
import { adminAuth } from "../config/firebaseAdmin";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
