import { CookieOptions } from "express";
import { SESSION_MAX_AGE_MS } from "../services/authService";

const isProduction = process.env["NODE_ENV"] === "production";
const crossSite = process.env["SESSION_CROSS_SITE"] === "true";

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: crossSite ? "none" : "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_MS,
};

export const clearSessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: crossSite ? "none" : "lax",
  path: "/",
};
