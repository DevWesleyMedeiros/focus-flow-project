import crypto from "node:crypto";
import { prisma } from "../db";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutos
const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

// Gera um token opaco (string) e salva apenas o hash no banco.
export async function generateResetToken(userId: string) {
  const plainToken = crypto.randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.passwordTokenReset.updateMany({ where: { userId, usedAt: null }, data: { usedAt: new Date() } }),
    prisma.passwordTokenReset.create({ data: { userId, tokenHash: hashToken(plainToken), expiresAt: new Date(Date.now() + TOKEN_TTL_MS) } }),
  ]);
  return plainToken;
}
export const getResetTokenHash = hashToken;
