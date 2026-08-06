// TODO: Inicializar cliente Firebase - configurar credenciais do .env
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measumentId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

// Inicializa apenas se as credenciais existirem e não houver app já inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    // ignorar em ambientes onde analytics não está disponível (SSR)
    console.warn("Firebase analytics não inicializado (SSR ou indisponível).");
  }
}

export { app };
export default app;
