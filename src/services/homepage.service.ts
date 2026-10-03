import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { HomepageConfig } from '../types';

const defaultHomepageConfig: HomepageConfig = {
  heroEyebrow: 'ENGINEERED HEAVY INFRASTRUCTURE',
  heroHeading: 'Precision Bridge Bearings & Expansion Joints',
  heroDescription: 'Infinite Hardware Technology (P) Ltd. manufactures and delivers heavy-duty bridge bearings, expansion joints, structural couplings, and infrastructure solutions built for mission-critical reliability.',
  heroImage: '/logo.jpg',
  primaryCtaText: 'Explore Product Catalog',
  primaryCtaLink: '/products',
  secondaryCtaText: 'Request Technical Quote',
  secondaryCtaLink: '/contact',
  trustMetrics: [
    { value: '25+', label: 'Years Experience' },
    { value: '500+', label: 'Infrastructure Projects' },
    { value: '100%', label: 'Field Quality Tested' },
    { value: '24/7', label: 'Technical Field Support' },
  ],
  companyHeading: 'Engineering Strength for Nation Building',
  companyBody: 'Specialized manufacturers of structural bridge bearings, expansion joints, and industrial coupling mechanisms adhering to strict international engineering tolerances.',
  companyImage: '/logo.jpg',
  finalCtaHeading: 'Ready to Engineer Your Next Infrastructure Project?',
  finalCtaDescription: 'Connect with our structural engineering team for technical specifications and project quotes.',
  finalCtaButtonText: 'Request Project Quote',
  finalCtaButtonLink: '/contact',
};

const STORAGE_KEY = 'infinite_homepage_config';

export const getHomepageConfig = async (): Promise<HomepageConfig> => {
  if (USE_DEMO_DATA) {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultHomepageConfig;
  }

  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, 'homepage', 'main');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as HomepageConfig;
  }
  return defaultHomepageConfig;
};

export const updateHomepageConfig = async (config: HomepageConfig): Promise<void> => {
  if (USE_DEMO_DATA) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return;
  }

  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, 'homepage', 'main');
  await setDoc(docRef, config, { merge: true });
};
