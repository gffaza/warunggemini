"use client";

import { Store } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PhoneOtpForm } from "@/components/auth/phone-otp-form";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingState } from "@/components/shared/loading-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isFirebaseConfigured } from "@/config/env";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";

export function LoginView() {
  const {
    status,
    configError,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    resetPhoneVerification,
  } = useAuth();

  if (status === "loading") {
    return (
      <AuthShell title="Memuat...">
        <LoadingState message="Memeriksa sesi Anda..." fullScreen />
      </AuthShell>
    );
  }

  if (!isFirebaseConfigured() || configError) {
    return (
      <AuthShell title="Konfigurasi belum siap">
        <ErrorBanner
          message={
            configError ??
            "Firebase belum dikonfigurasi. Isi file .env.local lalu jalankan ulang aplikasi."
          }
        />
        <EmptyState
          className="mt-8"
          title="Belum bisa masuk"
          description="Lengkapi environment variables Firebase terlebih dahulu."
          icon={<Store className="h-10 w-10" aria-hidden />}
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Selamat datang, Pak/Bu!"
      subtitle="Masuk untuk mulai catat jualan warung dengan Mas Gemini."
    >
      <p className="mb-6 text-center text-lg font-semibold text-primary">
        {siteConfig.subTagline}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Masuk ke WarungGemini</CardTitle>
          <CardDescription>
            Pilih Google atau nomor HP — gampang seperti WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoogleSignInButton onSignIn={signInWithGoogle} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface px-3 text-muted-foreground">atau</span>
            </div>
          </div>

          <PhoneOtpForm
            onSendOtp={sendPhoneOtp}
            onVerifyOtp={verifyPhoneOtp}
            onReset={resetPhoneVerification}
          />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Dengan masuk, Anda setuju menggunakan WarungGemini untuk bantu kelola
        warung.
      </p>
    </AuthShell>
  );
}
