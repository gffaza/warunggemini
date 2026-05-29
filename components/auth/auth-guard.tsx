"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function AuthGuard({
  children,
  requireOnboarding = true,
}: AuthGuardProps) {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (
      requireOnboarding &&
      status === "authenticated" &&
      user &&
      !user.onboardingCompleted
    ) {
      router.replace("/onboarding");
    }
  }, [status, user, requireOnboarding, router]);

  if (status === "loading") {
    return <LoadingState message="Memuat..." fullScreen />;
  }

  if (status === "unauthenticated") {
    return <LoadingState message="Mengalihkan ke login..." fullScreen />;
  }

  if (requireOnboarding && user && !user.onboardingCompleted) {
    return <LoadingState message="Melengkapi profil warung..." fullScreen />;
  }

  return <>{children}</>;
}
