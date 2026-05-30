import type { ReactNode } from "react";
import { LogoutButton } from "@/components/layout/logout-button";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  showLogout?: boolean;
}

export function PageHeader({
  title,
  description,
  action,
  showLogout = true,
}: PageHeaderProps) {
  const trailingAction = action ?? (showLogout ? <LogoutButton /> : null);

  return (
    <header className="border-b border-border bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {trailingAction ? (
          <div className="shrink-0">{trailingAction}</div>
        ) : null}
      </div>
    </header>
  );
}
