import { env } from './env.js';

export interface FeatureFlags {
  fastMode: boolean;
  emailCampaigns: boolean;
  smsCampaigns: boolean;
  websiteBuilder: boolean;
  mobileApp: boolean;
  advancedReports: boolean;
  multiLocation: boolean;
}

export const features: FeatureFlags = {
  fastMode: env.FAST_MODE_ENABLED,
  emailCampaigns: true,
  smsCampaigns: true,
  websiteBuilder: true,
  mobileApp: true,
  advancedReports: true,
  multiLocation: false, // Future feature
};

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return features[feature];
}
