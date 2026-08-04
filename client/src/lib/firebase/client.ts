// TODO: Inicializar cliente Firebase - configurar credenciais do .env
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let auth;

// Inicializa apenas se as credenciais existirem e não houver app já inicializado
if (firebaseConfig.apiKey && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else if (getApps().length > 0) {
  app = getApps()[0];
  auth = getAuth(app);
}

export { app, auth };
export default app;
