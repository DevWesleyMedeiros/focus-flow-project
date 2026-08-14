import { SignJWT, jwtVerify } from "jose";
import { adminAuth } from "../config/firebaseAdmin";
import { prisma } from "../db";

const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000;
const JWT_SECRET = process.env["JWT_SECRET"] || "dev-secret-session-key";

function getSessionSecret() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function createFirebaseSession(idToken: string) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: FIVE_DAYS_MS,
  });
  return { sessionCookie, maxAge: FIVE_DAYS_MS };
}

export async function createBackendSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5d")
    .sign(getSessionSecret());

  return { token, maxAge: FIVE_DAYS_MS };
}

export async function verifyBackendSession(token: string) {
  const verified = await jwtVerify(token, getSessionSecret());
  return verified.payload as { userId: string };
}

export async function upsertFirebaseUser(tokenPayload: {
  uid: string;
  email?: string;
  name?: string;
}) {
  const { uid, email, name } = tokenPayload;

  if (!uid || !email) {
    throw new Error("Token Firebase inválido");
  }

  const userEmail = email;

  const existingByEmail = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (existingByEmail && !existingByEmail.firebaseUid) {
    throw new Error(
      "Este e-mail já está cadastrado com uma conta local. Use a conta local para entrar.",
    );
  }

  const safeName = typeof name === "string" ? name.trim() : "";
  const displayName =
    safeName.length > 0 ? safeName : userEmail.split?.("@")?.[0] || "";

  const user = await prisma.user.upsert({
    where: { firebaseUid: uid },
    update: {
      email: userEmail,
      displayName,
    },
    create: {
      firebaseUid: uid,
      email: userEmail,
      displayName,
    },
  });

  return user;
}
