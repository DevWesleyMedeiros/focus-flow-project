import { Request, Response } from "express";

export async function meController(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  return res.status(200).json({ user });
}
