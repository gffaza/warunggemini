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
  const { user, completeOnboarding } = useAuth();
  const [warungName, setWarungName] = useState("");
  const [businessCategory, setBusinessCategory] = useState<WarungType | "">("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (warungName.trim().length < 2) {
      setError("Nama warung minimal 2 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      await completeOnboarding({
        warungName: warungName.trim(),
        businessCategory: businessCategory || undefined,
        location: location.trim() || undefined,
      });
      router.replace("/chat");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan profil warung. Coba lagi ya, Pak.",
      );
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="warungName" className="text-sm font-medium">
            Nama Warung <span className="text-error">*</span>
          </label>
          <Input
            id="warungName"
            placeholder="Warung Berkah"
            value={warungName}
            onChange={(event) => setWarungName(event.target.value)}
            disabled={isSubmitting}
            error={Boolean(error && warungName.trim().length < 2)}
            required
            autoComplete="organization"
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">
            Kategori Usaha{" "}
            <span className="font-normal text-muted-foreground">(opsional)</span>
          </legend>
          <div className="grid gap-3">
            {warungTypes.map((type) => (
              <label
                key={type.value}
                className={cn(
                  "flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-base transition-colors",
                  businessCategory === type.value
                    ? "border-primary bg-primary-light"
                    : "border-border-strong bg-surface",
                )}
              >
                <input
                  type="radio"
                  name="businessCategory"
                  value={type.value}
                  checked={businessCategory === type.value}
                  onChange={() => setBusinessCategory(type.value)}
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

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Lokasi{" "}
            <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <Input
            id="location"
            placeholder="Contoh: Jakarta Selatan"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            disabled={isSubmitting}
            autoComplete="address-level2"
          />
        </div>

        {error ? <ErrorBanner message={error} /> : null}

        <Button type="submit" isLoading={isSubmitting}>
          Mulai Catat Jualan
        </Button>
      </form>
    </AuthShell>
  );
}
