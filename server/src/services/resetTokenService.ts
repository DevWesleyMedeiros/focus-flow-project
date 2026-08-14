import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { prisma } from "../db";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutos
const SALT_ROUNDS = 10;

// Gera um token opaco (string) e salva apenas o hash no banco.
export async function generateResetToken(userId: string) {
  // Invalida tokens anteriores não usados para o mesmo usuário (RN-AUTH-08c)
  await prisma.passwordTokenReset.updateMany({
    where: { userId },
    data: { expiresAt: new Date(0) },
  });

  const plainToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(plainToken, SALT_ROUNDS);

  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.passwordTokenReset.create({
    data: {
      userId,
      token: tokenHash,
      expiresAt,
    },
  });

  return plainToken;
}

// Valida um token: retorna o registro correspondente (não marca como usado)
export async function validateResetToken(plainToken: string) {
  const candidates = await prisma.passwordTokenReset.findMany({
    where: { expiresAt: { gt: new Date() } },
  });

  for (const c of candidates) {
    const match = await bcrypt.compare(plainToken, c.token);
    if (match) {
      return c;
    }
  }

  return null;
}

export async function markTokenAsUsed(tokenId: string) {
  await prisma.passwordTokenReset.update({
    where: { id: tokenId },
    data: { expiresAt: new Date(0) },
  });
}

export default { generateResetToken, validateResetToken, markTokenAsUsed };
