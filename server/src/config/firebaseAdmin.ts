// TODO: Inicializar Firebase Admin SDK - configurar credenciais do service account
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const rawServiceAccount = process.env["FIREBASE_SERVICE_ACCOUNT_KEY"];

const adminAuth = (() => {
  if (rawServiceAccount) {
    let serviceAccount: Record<string, unknown>;
    try {
      serviceAccount = JSON.parse(rawServiceAccount) as Record<string, unknown>;
    } catch (err) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY inválido: JSON malformado.",
      );
    }

    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }

    return getAuth();
  }

  if (getApps().length) {
    return getAuth();
  }

  return {
    verifyIdToken: async () => {
      throw new Error("Firebase Admin not initialized");
    },
    verifySessionCookie: async () => {
      throw new Error("Firebase Admin not initialized");
    },
  } as unknown as ReturnType<typeof getAuth>;
})();

const adminDb = (() => {
  if (rawServiceAccount) {
    return getFirestore();
  }

  if (getApps().length) {
    return getFirestore();
  }

  return undefined;
})();

export { adminAuth, adminDb, getApps };
