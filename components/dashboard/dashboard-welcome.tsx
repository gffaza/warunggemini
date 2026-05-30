import Link from "next/link";
import { Camera, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DashboardWelcomeProps {
  warungName?: string;
  className?: string;
}

const onboardingSteps = [
  {
    step: "1",
    text: "Ketik jualan — seperti chat WhatsApp",
  },
  {
    step: "2",
    text: "Foto rak — Mas Gemini hitung stok",
  },
  {
    step: "3",
    text: "Omzet muncul otomatis di beranda",
  },
] as const;

export function DashboardWelcome({
  warungName,
  className,
}: DashboardWelcomeProps) {
  const displayName = warungName ?? "warung Anda";

  return (
    <section
      aria-labelledby="dashboard-welcome-heading"
      className={cn(
        "overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary-light via-surface to-secondary-light p-6 shadow-sm",
        className,
      )}
    >
      <div className="mb-5 flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-2xl shadow-md"
          aria-hidden
        >
          👋
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Selamat datang
          </p>
          <h2
            id="dashboard-welcome-heading"
            className="text-xl font-bold leading-snug text-foreground"
          >
            {displayName} siap dicatat!
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Mulai dari satu langkah mudah. Gampang seperti kirim pesan WA.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/chat"
          className={cn(
            "inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-lg font-semibold text-primary-foreground transition-all active:scale-[0.97] hover:bg-primary-hover",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          )}
        >
          <MessageSquare className="h-5 w-5" aria-hidden />
          Catat Penjualan
        </Link>

        <Link
          href="/inventory"
          className={cn(
            "inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-border-strong bg-surface px-6 text-lg font-semibold text-foreground transition-all active:scale-[0.97] hover:bg-background-subtle",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          )}
        >
          <Camera className="h-5 w-5" aria-hidden />
          Foto Rak
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-surface/80 p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-secondary" aria-hidden />
          Cara pakai — cuma 3 langkah
        </p>
        <ol className="space-y-3">
          {onboardingSteps.map((item) => (
            <li key={item.step} className="flex items-start gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                aria-hidden
              >
                {item.step}
              </span>
              <span className="pt-0.5 text-base leading-snug text-foreground">
                {item.text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
