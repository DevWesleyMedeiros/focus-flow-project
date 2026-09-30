import { Request, Response } from "express";
import { clearSessionCookieOptions } from "../../config/sessionCookie";
import { revokeBackendSession, SESSION_COOKIE_NAME } from "../../services/authService";

export async function logoutController(req: Request, res: Response) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (token) await revokeBackendSession(token);
  res.clearCookie(SESSION_COOKIE_NAME, clearSessionCookieOptions);

  return res.status(200).json({ success: true });
}
