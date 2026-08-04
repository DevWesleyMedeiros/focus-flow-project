// TODO: Controller de login - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_LOGIN.md
import { Request, Response } from "express";
import { loginService } from "../../services/auth/loginService";

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
}
