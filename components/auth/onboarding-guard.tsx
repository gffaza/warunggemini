"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { useAuth } from "@/hooks/use-auth";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated" && user?.onboardingCompleted) {
      router.replace("/home");
    }
  }, [status, user, router]);

  if (status === "loading") {
    return <LoadingState message="Memuat..." fullScreen />;
  }

  if (status === "unauthenticated") {
    return <LoadingState message="Mengalihkan ke login..." fullScreen />;
  }

  if (user?.onboardingCompleted) {
    return <LoadingState message="Mengalihkan ke beranda..." fullScreen />;
  }

  return <>{children}</>;
}
