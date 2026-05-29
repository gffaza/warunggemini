"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { useAuth } from "@/hooks/use-auth";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { status, getPostAuthPath } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(getPostAuthPath());
    }
  }, [status, getPostAuthPath, router]);

  if (status === "loading") {
    return <LoadingState message="Memuat..." fullScreen />;
  }

  if (status === "authenticated") {
    return <LoadingState message="Mengalihkan..." fullScreen />;
  }

  return <>{children}</>;
}
