"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingSkeleton } from "@/components/auth/onboarding-skeleton";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingState } from "@/components/shared/loading-state";
import {
  getAuthGateLoadingMessage,
  getAuthRedirectPath,
  resolveAuthGateState,
  type AuthGateMode,
} from "@/lib/auth/gate";
import { useAuth } from "@/hooks/use-auth";

interface AuthGateProps {
  mode: AuthGateMode;
  children: React.ReactNode;
}

export function AuthGate({ mode, children }: AuthGateProps) {
  const router = useRouter();
  const { status, user, profileLoadState, retryProfileLoad } = useAuth();

  const onboardingCompleted = Boolean(user?.onboardingCompleted);

  const gateState = resolveAuthGateState({
    mode,
    status,
    profileLoadState,
    onboardingCompleted,
  });

  const redirectPath = getAuthRedirectPath(
    mode,
    status,
    profileLoadState,
    onboardingCompleted,
  );

  useEffect(() => {
    if (!redirectPath) return;
    router.replace(redirectPath);
  }, [redirectPath, router]);

  if (gateState.isLoading) {
    if (mode === "onboarding") {
      return (
        <div className="min-h-dvh bg-background px-4 pt-10">
          <OnboardingSkeleton />
        </div>
      );
    }

    return (
      <LoadingState
        message={getAuthGateLoadingMessage(mode, gateState.isRedirecting)}
        fullScreen
      />
    );
  }

  if (gateState.profileLoadError) {
    return (
      <div className="flex min-h-[50vh] flex-col justify-center px-4">
        <ErrorBanner
          message={gateState.profileLoadError}
          onRetry={() => void retryProfileLoad()}
          retryLabel="Coba Lagi"
        />
      </div>
    );
  }

  if (gateState.isRedirecting) {
    return (
      <LoadingState
        message={getAuthGateLoadingMessage(mode, true)}
        fullScreen
      />
    );
  }

  return <>{children}</>;
}
