import { Request, Response } from "express";
import { loginService } from "../../services/auth/loginService";
import { loginSchema } from "../../schemas/authSchemas";
import { createBackendSession } from "../../services/authService";

const SESSION_COOKIE_NAME = "backend_session";

export async function loginController(req: Request, res: Response) {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await loginService(validated.email, validated.password);

    const { token, maxAge } = await createBackendSession(result.user.id);

    const secureFlag = process.env["NODE_ENV"] === "production";
    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return res.status(200).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.issues[0].message });
    }
    return res.status(401).json({ error: error.message });
  }
}
