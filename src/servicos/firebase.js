import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

// Configuração do projeto "app-android-gb" no Firebase.
// Estas chaves identificam o projeto, não são senhas. Quem protege os dados
// são as regras do Firestore.
const firebaseConfig = {
  apiKey: 'AIzaSyCOpmPuUMHdTy6D4Wl3WBVIrKbmi6ffYF4',
  authDomain: 'app-android-gb.firebaseapp.com',
  projectId: 'app-android-gb',
  storageBucket: 'app-android-gb.firebasestorage.app',
  messagingSenderId: '642406378297',
  appId: '1:642406378297:web:9263290f9b63be13f9d6e8',
};

const app = initializeApp(firebaseConfig);

// Long polling evita problemas de conexão do Firestore no React Native.
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
