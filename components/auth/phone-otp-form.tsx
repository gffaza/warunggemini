"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorBanner } from "@/components/shared/error-banner";
import type { PhoneConfirmationResult } from "@/lib/firebase/client";
import { mapFirebaseAuthError } from "@/lib/firebase/auth-errors";

type PhoneOtpStep = "phone" | "otp";

interface PhoneOtpFormProps {
  onSendOtp: (phoneNumber: string) => Promise<PhoneConfirmationResult>;
  onVerifyOtp: (otp: string) => Promise<void>;
  onReset?: () => void;
  disabled?: boolean;
}

export function PhoneOtpForm({
  onSendOtp,
  onVerifyOtp,
  onReset,
  disabled,
}: PhoneOtpFormProps) {
  const [step, setStep] = useState<PhoneOtpStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      onReset?.();
    };
  }, [onReset]);

  function normalizePhoneInput(value: string): string {
    const digits = value.replace(/\D/g, "");

    if (digits.startsWith("62")) {
      return `+${digits}`;
    }

    if (digits.startsWith("0")) {
      return `+62${digits.slice(1)}`;
    }

    if (digits.length > 0) {
      return `+62${digits}`;
    }

    return value;
  }

  async function handleSendOtp(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const normalized = normalizePhoneInput(phone.trim());

    if (normalized.length < 12) {
      setError("Nomor HP tidak valid. Contoh: 08123456789");
      return;
    }

    setIsSending(true);

    try {
      await onSendOtp(normalized);
      setStep("otp");
    } catch (err) {
      setError(mapFirebaseAuthError(err).message);
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerifyOtp(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (otp.trim().length < 6) {
      setError("Masukkan kode OTP 6 digit dari SMS.");
      return;
    }

    setIsVerifying(true);

    try {
      await onVerifyOtp(otp.trim());
    } catch (err) {
      setError(mapFirebaseAuthError(err).message);
    } finally {
      setIsVerifying(false);
    }
  }

  function handleChangeNumber() {
    setStep("phone");
    setOtp("");
    setError(null);
    onReset?.();
  }

  return (
    <div className="space-y-4">
      <div
        id="recaptcha-container"
        ref={recaptchaContainerRef}
        className="sr-only"
        aria-hidden
      />

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Nomor HP
            </label>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="08123456789"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="pl-12"
                disabled={disabled || isSending}
                error={Boolean(error)}
                aria-describedby={error ? "phone-error" : undefined}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Kami kirim kode OTP lewat SMS.
            </p>
          </div>

          {error ? <ErrorBanner message={error} /> : null}

          <Button type="submit" isLoading={isSending} disabled={disabled}>
            Kirim Kode OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium text-foreground">
              Kode OTP
            </label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={disabled || isVerifying}
              error={Boolean(error)}
            />
            <p className="text-sm text-muted-foreground">
              OTP dikirim ke {phone || "nomor Anda"}.
            </p>
          </div>

          {error ? (
            <ErrorBanner message={error} onRetry={() => setError(null)} />
          ) : null}

          <Button type="submit" isLoading={isVerifying} disabled={disabled}>
            Verifikasi & Masuk
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleChangeNumber}
            disabled={isVerifying}
          >
            Ganti Nomor HP
          </Button>
        </form>
      )}
    </div>
  );
}
