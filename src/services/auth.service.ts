import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, AUTHORIZED_ADMIN_UID, USE_DEMO_DATA } from '../lib/firebase';

const DEMO_ADMIN_KEY = 'apex_demo_admin_auth';

const ALLOWED_ADMIN_EMAILS = [
  'theihtpladmin@gmail.com',
  import.meta.env.VITE_ADMIN_EMAIL,
]
  .filter(Boolean)
  .map((e) => (e as string).toLowerCase());

const isEmailAuthorized = (userEmail?: string | null): boolean => {
  if (ALLOWED_ADMIN_EMAILS.length === 0) return true;
  if (!userEmail) return false;
  return ALLOWED_ADMIN_EMAILS.includes(userEmail.toLowerCase());
};

export const isDemoAuthenticated = (): boolean => {
  return localStorage.getItem(DEMO_ADMIN_KEY) === 'true';
};

export const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
  if (USE_DEMO_DATA) {
    if (email === 'admin@apexindustrial.in' && pass === 'admin123') {
      localStorage.setItem(DEMO_ADMIN_KEY, 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials.' };
  }

  if (!auth) throw new Error('Firebase Auth not initialized');

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (!isEmailAuthorized(cred.user.email)) {
      await firebaseSignOut(auth);
      return { success: false, error: 'Access Denied: This email account is not authorized for CMS admin access.' };
    }
    if (AUTHORIZED_ADMIN_UID && cred.user.uid !== AUTHORIZED_ADMIN_UID) {
      await firebaseSignOut(auth);
      return { success: false, error: 'Access Denied: Your account UID is not authorized for CMS admin access.' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication failed' };
  }
};

export const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
  if (USE_DEMO_DATA) {
    localStorage.setItem(DEMO_ADMIN_KEY, 'true');
    return { success: true };
  }

  if (!auth) throw new Error('Firebase Auth not initialized');

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    if (!isEmailAuthorized(cred.user.email)) {
      await firebaseSignOut(auth);
      return { success: false, error: 'Access Denied: Only theihtpladmin@gmail.com is authorized for CMS admin access.' };
    }
    if (AUTHORIZED_ADMIN_UID && cred.user.uid !== AUTHORIZED_ADMIN_UID) {
      await firebaseSignOut(auth);
      return { success: false, error: 'Access Denied: Your Google account is not authorized for CMS admin access.' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Google sign-in failed' };
  }
};

export const logoutAdmin = async (): Promise<void> => {
  if (USE_DEMO_DATA) {
    localStorage.removeItem(DEMO_ADMIN_KEY);
    return;
  }

  if (auth) {
    await firebaseSignOut(auth);
  }
};

export const subscribeAuth = (callback: (user: User | boolean | null) => void) => {
  if (USE_DEMO_DATA) {
    callback(isDemoAuthenticated());
    return () => {};
  }

  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (user && !isEmailAuthorized(user.email)) {
      callback(false); // Unauthorized email
    } else if (user && AUTHORIZED_ADMIN_UID && user.uid !== AUTHORIZED_ADMIN_UID) {
      callback(false); // Unauthorized UID
    } else {
      callback(user);
    }
  });
};
