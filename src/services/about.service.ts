import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, USE_DEMO_DATA } from '../lib/firebase';
import { AboutConfig } from '../types';

export const defaultAboutConfig: AboutConfig = {
  storyHeading: 'Engineering Integrity & Supply Chain Reliability',
  storyBody:
    'Infinite Hardware Technology (P) Ltd. operates as a trusted engineering and manufacturing partner for tier-1 infrastructure contractors, metro rail developers, highway projects, power plants, and industrial facilities across India. Every product is backed by rigorous quality control, full material traceability, and mill test certification adhering to strict international engineering tolerances.',
  storyImage:
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  highlights: [
    'ISO 9001:2015 Quality Management System Certified',
    'Fully Equipped State-of-the-Art Manufacturing & Testing Facility',
    'Full Mill Test Certificates (MTC) & Third-Party Inspection Reports',
    'IRC:83, MORTH & EN 1337 Standard Compliance',
  ],

  // Mission & Vision
  missionTitle: 'Our Mission',
  missionStatement:
    'To engineer and deliver world-class structural bearings, expansion joints, and precision industrial hardware that safeguard infrastructure longevity, ensure public transit safety, and exceed engineering standards with unyielding reliability.',

  visionTitle: 'Our Vision',
  visionStatement:
    'To be recognized as India’s foremost precision manufacturing authority in heavy infrastructure components, pioneering technological excellence, indigenous manufacturing, and sustainable engineering solutions for nation building.',

  // Values
  valuesHeading: 'Our Core Values',
  valuesDescription: 'The foundational principles that guide every casting, machining process, quality inspection, and project delivery.',
  values: [
    {
      id: 'val-1',
      title: 'Precision & Engineering Integrity',
      description: 'Zero tolerance for structural defects. Every millimeter is precision-machined to exact load-bearing engineering specs.',
      icon: 'ShieldCheck',
    },
    {
      id: 'val-2',
      title: 'Certified Quality First',
      description: 'Strict adherence to ISO 9001:2015, MORTH, and IRC guidelines with complete chemical and physical test traceabilities.',
      icon: 'Award',
    },
    {
      id: 'val-3',
      title: 'Customer-Centric Execution',
      description: 'Dedicated sales engineering desk offering project BOQ reviews, rapid quotation turnarounds, and custom fabrication.',
      icon: 'Users',
    },
    {
      id: 'val-4',
      title: 'On-Time Project Delivery',
      description: 'Reliable nationwide logistics ensuring infrastructure construction schedules and tender milestones are consistently met.',
      icon: 'Truck',
    },
  ],

  // Leadership
  leadershipHeading: 'Executive Leadership',
  leadershipDescription: 'Driven by decades of combined metallurgical, structural, and mechanical engineering expertise.',
  leadershipMembers: [
    {
      id: 'lead-1',
      name: 'Managing Director',
      role: 'Founder & Managing Director',
      bio: 'Leading strategic vision, manufacturing modernization, and nation-wide infrastructure partnerships across highways, metro transit, and bridge development.',
      image: '',
      linkedin: '',
      sortOrder: 1,
    },
    {
      id: 'lead-2',
      name: 'Head of Engineering & QA',
      role: 'Chief Technical Officer',
      bio: 'Oversees precision machining tolerances, proof load testing rigs, MORTH/IRC compliance, and third-party inspection certifications.',
      image: '',
      linkedin: '',
      sortOrder: 2,
    },
    {
      id: 'lead-3',
      name: 'Head of Operations & Logistics',
      role: 'Director of Plant Operations',
      bio: 'Manages raw material sourcing, CNC operations, inventory safety stocks, and rapid on-site project deliveries.',
      image: '',
      linkedin: '',
      sortOrder: 3,
    },
  ],
};

const STORAGE_KEY = 'infinite_about_config';

export const getAboutConfig = async (): Promise<AboutConfig> => {
  if (USE_DEMO_DATA) {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultAboutConfig, ...JSON.parse(saved) } : defaultAboutConfig;
  }

  if (!db) throw new Error('Firestore not initialized');
  try {
    const docRef = doc(db, 'content', 'about');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...defaultAboutConfig, ...snap.data() } as AboutConfig;
    }
  } catch (err) {
    console.warn('Could not fetch about config from firestore, using local fallback:', err);
  }

  const local = localStorage.getItem(STORAGE_KEY);
  return local ? { ...defaultAboutConfig, ...JSON.parse(local) } : defaultAboutConfig;
};

export const updateAboutConfig = async (config: AboutConfig): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  if (!USE_DEMO_DATA && db) {
    try {
      const docRef = doc(db, 'content', 'about');
      await setDoc(docRef, config, { merge: true });
    } catch (err) {
      console.warn('Could not save about config to firestore:', err);
    }
  }
};
