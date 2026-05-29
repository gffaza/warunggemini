import { OnboardingGuard } from "@/components/auth/onboarding-guard";
import { OnboardingView } from "@/components/auth/onboarding-view";

export default function OnboardingPage() {
  return (
    <OnboardingGuard>
      <OnboardingView />
    </OnboardingGuard>
  );
}
