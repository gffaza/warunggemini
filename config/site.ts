export const siteConfig = {
  name: "WarungGemini",
  tagline: "AI Co-Founder untuk Warung & UMKM Indonesia",
  description:
    "Catat jualan dan kelola stok warung dengan bantuan Mas Gemini.",
} as const;

export const warungTypes = [
  { value: "kelontong", label: "Warung Kelontong" },
  { value: "warteg", label: "Warteg" },
  { value: "kios", label: "Kios" },
] as const;

export type WarungType = (typeof warungTypes)[number]["value"];

export const ONBOARDING_STORAGE_KEY = "warunggemini_onboarding";

export interface OnboardingData {
  warungName: string;
  warungType: WarungType;
  completed: boolean;
}
