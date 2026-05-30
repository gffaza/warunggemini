import type { WarungType } from "@/config/site";

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

export interface UserProfile extends AuthUser {
  warungName?: string;
  businessCategory?: WarungType;
  location?: string;
  onboardingCompleted: boolean;
}
