import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export const USE_DEMO_DATA = import.meta.env.VITE_USE_DEMO_DATA === 'true' || import.meta.env.VITE_USE_DEMO_DATA === undefined;

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  error?: string;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let configStatus: FirebaseConfigStatus = { isConfigured: false };

if (!USE_DEMO_DATA) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    configStatus = {
      isConfigured: false,
      error: `VITE_USE_DEMO_DATA is set to false, but Firebase configuration is missing key(s): ${missingKeys.join(', ')}. Please update your .env file or environment variables.`,
    };
    console.error(`[Firebase Initialization Error] ${configStatus.error}`);
  } else {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      configStatus = { isConfigured: true };
    } catch (err: any) {
      configStatus = {
        isConfigured: false,
        error: `Failed to initialize Firebase: ${err.message || err}`,
      };
      console.error('[Firebase Initialization Error]', err);
    }
  }
} else {
  configStatus = {
    isConfigured: true,
  };
}

export { app, auth, db, storage, configStatus };
export const AUTHORIZED_ADMIN_UID = import.meta.env.VITE_ADMIN_UID || '';
