// TODO: Middleware de autenticação Firebase - verificar token JWT
import { NextFunction, Request, Response } from "express";
import { getBackendSession, SESSION_COOKIE_NAME } from "../services/authService";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const backendCookie = req.cookies?.[SESSION_COOKIE_NAME];

  try {
    if (!backendCookie)
      return res.status(401).json({ error: "Não autenticado" });
    const session = await getBackendSession(backendCookie);
    if (!session)
      return res.status(401).json({ error: "Sessão inválida ou expirada" });
    (req as any).user = session.user;
    return next();
  } catch {
    return res.status(401).json({ error: "Sessão inválida ou expirada" });
  }
}
