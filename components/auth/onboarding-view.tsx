"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ErrorBanner } from "@/components/shared/error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { warungTypes } from "@/config/site";
import type { WarungType } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/cn";

export function OnboardingView() {
  const router = useRouter();
  const { user, completeOnboarding, status } = useAuth();
  const [warungName, setWarungName] = useState("");
  const [warungType, setWarungType] = useState<WarungType>("kelontong");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === "loading") {
    return (
      <AuthShell title="Memuat...">
        <p className="text-center text-muted-foreground">Memuat...</p>
      </AuthShell>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (warungName.trim().length < 2) {
      setError("Nama warung minimal 2 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      completeOnboarding({
        warungName: warungName.trim(),
        warungType,
      });
      router.replace("/chat");
    } catch {
      setError("Gagal menyimpan profil warung. Coba lagi ya, Pak.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Setup Warung"
      subtitle={
        user?.displayName
          ? `Halo ${user.displayName.split(" ")[0]}, ceritakan warung Anda.`
          : "Ceritakan warung Anda — cuma 1 menit."
      }
    >
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Langkah 1 dari 1</span>
          <span className="font-semibold text-primary">100%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div className="h-full w-full rounded-full bg-primary" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="warungName" className="text-sm font-medium">
            Nama Warung
          </label>
          <Input
            id="warungName"
            placeholder="Warung Berkah"
            value={warungName}
            onChange={(event) => setWarungName(event.target.value)}
            disabled={isSubmitting}
            error={Boolean(error)}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Jenis Warung</legend>
          <div className="grid gap-3">
            {warungTypes.map((type) => (
              <label
                key={type.value}
                className={cn(
                  "flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-base transition-colors",
                  warungType === type.value
                    ? "border-primary bg-primary-light"
                    : "border-border-strong bg-surface",
                )}
              >
                <input
                  type="radio"
                  name="warungType"
                  value={type.value}
                  checked={warungType === type.value}
                  onChange={() => setWarungType(type.value)}
                  className="sr-only"
                />
                <span className="text-2xl" aria-hidden>
                  {type.emoji}
                </span>
                <span className="font-medium">{type.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {error ? <ErrorBanner message={error} /> : null}

        <Button type="submit" isLoading={isSubmitting}>
          Mulai Catat Jualan
        </Button>
      </form>
    </AuthShell>
  );
}
