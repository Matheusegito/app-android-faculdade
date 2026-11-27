import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

// Configuração do projeto no Firebase, lida das variáveis de ambiente
// (arquivo .env no desenvolvimento, variáveis do EAS no build do APK).
// Estas chaves identificam o projeto, não são senhas. Quem protege os dados
// são as regras do Firestore.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Long polling evita problemas de conexão do Firestore no React Native.
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
