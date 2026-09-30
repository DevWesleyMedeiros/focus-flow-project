import crypto from "node:crypto";
import { prisma } from "../db";

export const SESSION_COOKIE_NAME = "backend_session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;
const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export async function createBackendSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const maxAge = SESSION_MAX_AGE_MS;
  await prisma.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + maxAge) } });
  return { token, maxAge };
}

export async function getBackendSession(token: string) {
  return prisma.session.findFirst({ where: { tokenHash: hashToken(token), revokedAt: null, expiresAt: { gt: new Date() } }, include: { user: true } });
}

export async function revokeBackendSession(token: string) {
  await prisma.session.updateMany({ where: { tokenHash: hashToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
}

export async function revokeUserSessions(userId: string) {
  await prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
}

export async function resolveFirebaseUser(tokenPayload: {
  uid: string;
  email?: string;
  name?: string;
}) {
  const { uid, email, name } = tokenPayload;

  if (!uid || !email) {
    throw new Error("Token Firebase inválido");
  }

  const userEmail = email;

  const existingByUid = await prisma.user.findUnique({ where: { firebaseUid: uid } });
  const existingByEmail = await prisma.user.findUnique({ where: { email: userEmail } });
  if (existingByUid && existingByUid.authProvider !== "GOOGLE") throw new Error("Conflito de identidade da conta Google.");
  if (existingByEmail && existingByEmail.authProvider !== "GOOGLE") throw new Error("Este e-mail já está cadastrado com uma conta local. Use o login com e-mail e senha.");
  if (existingByUid && existingByEmail && existingByUid.id !== existingByEmail.id) throw new Error("Conflito de identidade da conta Google.");

  const safeName = typeof name === "string" ? name.trim() : "";
  const displayName =
    safeName.length > 0 ? safeName : userEmail.split?.("@")?.[0] || "";

  if (existingByUid) return prisma.user.update({ where: { id: existingByUid.id }, data: { email: userEmail, displayName } });
  return prisma.user.create({ data: { firebaseUid: uid, email: userEmail, displayName, authProvider: "GOOGLE" } });
}
