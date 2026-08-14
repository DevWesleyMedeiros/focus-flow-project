import { Request, Response } from "express";

const SESSION_COOKIE_NAME = "backend_session";

export async function logoutController(_req: Request, res: Response) {
  const secureFlag = process.env["NODE_ENV"] === "production";

  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: "lax",
    path: "/",
  });
  res.clearCookie("firebase_session", {
    httpOnly: true,
    secure: secureFlag,
    sameSite: "lax",
    path: "/",
  });
  res.clearCookie("csrfToken", {
    httpOnly: false,
    secure: secureFlag,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({ success: true });
}
