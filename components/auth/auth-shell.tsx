import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

interface AuthShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AuthShell({
  children,
  title,
  subtitle,
  className,
}: AuthShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8 pt-10">
        <header className="mb-8 text-center">
          <Logo size={64} className="mx-auto mb-4 shadow-md rounded-full" />
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {siteConfig.name}
          </p>
          {title ? (
            <h1 className="mt-3 text-3xl font-bold text-foreground">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              {siteConfig.tagline}
            </p>
          )}
        </header>

        <main className={cn("flex flex-1 flex-col", className)}>{children}</main>
      </div>
    </div>
  );
}
