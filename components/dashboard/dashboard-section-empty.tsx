import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface DashboardSectionEmptyProps {
  icon: ReactNode;
  title: string;
  description: string;
  hint?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function DashboardSectionEmpty({
  icon,
  title,
  description,
  hint,
  actionLabel,
  actionHref,
  className,
}: DashboardSectionEmptyProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-surface p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
          {hint ? (
            <p className="text-sm leading-relaxed text-foreground/80">{hint}</p>
          ) : null}
          {actionLabel && actionHref ? (
            <Link
              href={actionHref}
              className="mt-3 inline-flex min-h-[44px] items-center text-base font-semibold text-primary underline-offset-4 hover:underline"
            >
              {actionLabel} →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
