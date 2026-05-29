import {
  ONBOARDING_STORAGE_KEY,
  type OnboardingData,
  type WarungType,
} from "@/config/site";

export function getOnboardingData(): OnboardingData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

export function saveOnboardingData(data: {
  warungName: string;
  warungType: WarungType;
}): OnboardingData {
  const payload: OnboardingData = {
    ...data,
    completed: true,
  };

  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function clearOnboardingData(): void {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
