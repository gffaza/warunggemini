"use client";

import Link from "next/link";
import { MessageSquare, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <section aria-labelledby="quick-actions-heading" className={className}>
      <h2
        id="quick-actions-heading"
        className="mb-3 text-lg font-semibold text-foreground"
      >
        Aksi Cepat
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <QuickActionLink
          href="/chat"
          icon={MessageSquare}
          label="Catat Penjualan"
          description="Ketik seperti chat"
        />
        <QuickActionLink
          href="/inventory"
          icon={Package}
          label="Foto Rak"
          description="Foto rak barang"
        />
      </div>
    </section>
  );
}

interface QuickActionLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

function QuickActionLink({
  href,
  icon: Icon,
  label,
  description,
}: QuickActionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-[88px] flex-col items-start justify-center gap-1 rounded-3xl border-2 border-border bg-surface p-4 text-left shadow-sm transition-all",
        "active:scale-[0.97] hover:border-primary/30 hover:bg-primary-light/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      <Icon className="h-6 w-6 text-primary" aria-hidden />
      <span className="text-base font-semibold text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </Link>
  );
}
