"use client";

import { AuthGate } from "@/components/auth/auth-gate";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  return <AuthGate mode="onboarding">{children}</AuthGate>;
}
