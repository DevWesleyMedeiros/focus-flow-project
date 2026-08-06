import { adminAuth } from "../config/firebaseAdmin";

const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000;

export async function createFirebaseSession(idToken: string) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: FIVE_DAYS_MS,
  });
  return { sessionCookie, maxAge: FIVE_DAYS_MS };
}
