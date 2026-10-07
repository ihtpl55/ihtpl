import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { NavigationVisibility, SiteSettings } from '../types';

export const defaultNavVisibility: NavigationVisibility = {
  products: true,
  industries: true,
  capabilities: true,
  projects: true,
  documents: true,
  gallery: true,
  insights: true,
  about: true,
  contact: true,
};

const emptySettings: SiteSettings = {
  companyName: 'Infinite Hardware Technology (P) Ltd.',
  tagline: 'Bridge Bearings • Expansion Joints • Couplings',
  logoUrl: '/logo.jpg',
  phone: '',
  altPhone: '',
  email: '',
  whatsapp: '',
  address: '',
  businessHours: '',
  googleMapsUrl: '',
  footerDescription: '',
  copyrightText: '© ' + new Date().getFullYear() + ' Infinite Hardware Technology (P) Ltd. All rights reserved.',
  navVisibility: defaultNavVisibility,
};

const STORAGE_KEY = 'infinite_site_settings_cache';
let memoryCache: SiteSettings | null = null;

export const getCachedSettings = (): SiteSettings => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        memoryCache = {
          ...emptySettings,
          ...parsed,
          navVisibility: {
            ...defaultNavVisibility,
            ...(parsed.navVisibility || {}),
          },
        };
        return memoryCache!;
      } catch {}
    }
  }
  if (memoryCache) return memoryCache;
  return emptySettings;
};

// Helper to set local cache
export const setCachedSettings = (settings: SiteSettings) => {
  memoryCache = settings;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('site_settings_updated', { detail: settings }));
  }
};

export const getSiteSettings = async (forceFresh = false): Promise<SiteSettings> => {
  // If running on demo data, return cached or initial values instantly
  if (USE_DEMO_DATA) {
    return getCachedSettings();
  }

  if (!db) {
    return getCachedSettings();
  }

  const hasLocal = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) !== null) || memoryCache !== null;

  // If cached and fresh fetch not explicitly requested, return cached immediately and sync in background
  if (hasLocal && !forceFresh) {
    const docRef = doc(db, 'settings', 'general');
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          const freshData = snap.data() as SiteSettings;
          const normalized: SiteSettings = {
            ...emptySettings,
            ...freshData,
            navVisibility: {
              ...defaultNavVisibility,
              ...(freshData.navVisibility || {}),
            },
          };
          setCachedSettings(normalized);
        }
      })
      .catch((err) => {
        console.warn('Failed to background fetch site settings', err);
      });

    return getCachedSettings();
  }

  // Directly await live data from Firestore
  try {
    const docRef = doc(db, 'settings', 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const freshData = snap.data() as SiteSettings;
      const normalized: SiteSettings = {
        ...emptySettings,
        ...freshData,
        navVisibility: {
          ...defaultNavVisibility,
          ...(freshData.navVisibility || {}),
        },
      };
      setCachedSettings(normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('Failed to fetch site settings from Firestore, using cache', err);
  }

  return getCachedSettings();
};

export const updateSiteSettings = async (settings: SiteSettings): Promise<void> => {
  // Always update local cache first for instant UI response
  setCachedSettings(settings);

  if (USE_DEMO_DATA) {
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, 'settings', 'general');
  await setDoc(docRef, settings, { merge: true });
};

export const subscribeToSiteSettings = (callback: (settings: SiteSettings) => void): (() => void) => {
  // 1. Deliver current cached settings immediately
  callback(getCachedSettings());

  // 2. Listen to cross-tab storage changes
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        const normalized: SiteSettings = {
          ...emptySettings,
          ...parsed,
          navVisibility: {
            ...defaultNavVisibility,
            ...(parsed.navVisibility || {}),
          },
        };
        memoryCache = normalized;
        callback(normalized);
      } catch {}
    }
  };

  // 3. Listen to same-tab custom events
  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<SiteSettings>;
    if (custom.detail) {
      callback(custom.detail);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
    window.addEventListener('site_settings_updated', handleCustomEvent);
  }

  // 4. Real-time Firestore snapshot listener if Firestore available
  let unsubscribeFirestore: (() => void) | null = null;
  if (!USE_DEMO_DATA && db) {
    try {
      const docRef = doc(db, 'settings', 'general');
      unsubscribeFirestore = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const freshData = snap.data() as SiteSettings;
            const normalized: SiteSettings = {
              ...emptySettings,
              ...freshData,
              navVisibility: {
                ...defaultNavVisibility,
                ...(freshData.navVisibility || {}),
              },
            };
            setCachedSettings(normalized);
            callback(normalized);
          }
        },
        (err) => {
          console.warn('Firestore onSnapshot listener error:', err);
        }
      );
    } catch (e) {
      console.warn('Could not setup onSnapshot listener:', e);
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('site_settings_updated', handleCustomEvent);
    }
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
};
