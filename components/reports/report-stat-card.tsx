import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ReportStatCardProps {
  label: string;
  value: ReactNode;
  subtitle?: string;
  accent?: "primary" | "secondary" | "default";
  className?: string;
}

const accentStyles = {
  primary: "border-primary/20 bg-primary-light/50",
  secondary: "border-secondary/20 bg-secondary-light/60",
  default: "border-border bg-surface",
} as const;

export function ReportStatCard({
  label,
  value,
  subtitle,
  accent = "default",
  className,
}: ReportStatCardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border p-5 shadow-sm",
        accentStyles[accent],
        className,
      )}
    >
      <p className="text-base font-medium text-muted-foreground">{label}</p>
      <div className="mt-2">{value}</div>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </section>
  );
}
