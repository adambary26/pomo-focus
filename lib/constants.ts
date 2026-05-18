export const APP_NAME = 'Pomo Focus';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PREMIUM_FEATURES = [
  'Cloud Sync Across Devices',
  '50+ Premium Themes',
  'Custom Sound Upload',
  'Advanced Statistics & Heatmap',
  'Unlimited History',
  'Timer Presets',
  'Data Export (CSV/JSON)',
  'Streaks & Achievements',
  'Custom Alarm Sounds',
  'Priority Support',
] as const;

export const FREE_LIMITS = {
  themes: 11,
  sounds: 3,
  statsHistory: 'today',
  cloudSync: false,
  customSounds: false,
  presets: 0,
  dataExport: false,
  achievements: false,
} as const;

export const PREMIUM_LIMITS = {
  themes: 999,
  sounds: 999,
  statsHistory: 'unlimited',
  cloudSync: true,
  customSounds: true,
  presets: 999,
  dataExport: true,
  achievements: true,
} as const;

export const REFUND_POLICY = {
  windowDays: 14,
  description: 'Full refund within 14 days of purchase, no questions asked. After 14 days, prorated refunds are available based on unused time.',
  contactEmail: 'support@pomofocus.app',
};
