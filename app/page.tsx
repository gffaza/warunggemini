"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingState } from "@/components/shared/loading-state";
import { useAuth } from "@/hooks/use-auth";

export default function RootPage() {
  const router = useRouter();
  const { status, profileLoadState, getPostAuthPath, retryProfileLoad } =
    useAuth();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (profileLoadState === "pending") return;

    if (profileLoadState === "loaded") {
      router.replace(getPostAuthPath());
    }
  }, [status, profileLoadState, getPostAuthPath, router]);

  if (profileLoadState === "error") {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <ErrorBanner
          message="Gagal memuat profil warung. Periksa koneksi lalu coba lagi."
          onRetry={() => void retryProfileLoad()}
          retryLabel="Coba Lagi"
        />
      </div>
    );
  }

  return <LoadingState message="Memuat WarungGemini..." fullScreen />;
}
