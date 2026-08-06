// TODO: Inicializar Firebase Admin SDK - configurar credenciais do service account
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const rawServiceAccount = process.env["FIREBASE_SERVICE_ACCOUNT_KEY"];
if (!rawServiceAccount) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEY não definido. Configure a variável de ambiente com o JSON do service account.",
  );
}

let serviceAccount: Record<string, unknown>;
try {
  serviceAccount = JSON.parse(rawServiceAccount) as Record<string, unknown>;
} catch (err) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY inválido: JSON malformado.");
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export { getApps };
