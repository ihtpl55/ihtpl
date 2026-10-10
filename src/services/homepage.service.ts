import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, USE_DEMO_DATA, auth } from '../lib/firebase';
import { HomepageConfig } from '../types';

const defaultHomepageConfig: HomepageConfig = {
  heroEyebrow: "ENGINEERING INDIA'S INFRASTRUCTURE",
  heroHeading: 'Leading manufacturers of Bridge Bearing and HSFG Bolts',
  heroDescription: "Precision-manufactured solutions powering India's infrastructure ambitions.",
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
    const data = snap.data() as HomepageConfig;
    const sanitized: HomepageConfig = {
      ...data,
      heroEyebrow:
        !data.heroEyebrow ||
        data.heroEyebrow === 'HARDWARE & INDUSTRIAL SUPPLIES' ||
        data.heroEyebrow === 'ENGINEERED HEAVY INFRASTRUCTURE'
          ? "ENGINEERING INDIA'S INFRASTRUCTURE"
          : data.heroEyebrow,
      heroHeading:
        !data.heroHeading ||
        data.heroHeading === 'Bridge Bearings, Expansion Joints & Hardware' ||
        data.heroHeading === 'Precision Bridge Bearings & Expansion Joints'
          ? 'Leading manufacturers of Bridge Bearing and HSFG Bolts'
          : data.heroHeading,
      heroDescription:
        !data.heroDescription || data.heroDescription.includes('Lorem ipsum')
          ? "Precision-manufactured solutions powering India's infrastructure ambitions."
          : data.heroDescription,
    };

    if (
      auth?.currentUser &&
      (data.heroEyebrow === 'HARDWARE & INDUSTRIAL SUPPLIES' ||
        data.heroHeading === 'Bridge Bearings, Expansion Joints & Hardware' ||
        data.heroDescription?.includes('Lorem ipsum'))
    ) {
      setDoc(docRef, sanitized, { merge: true }).catch(() => {});
    }

    return sanitized;
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
