import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-base text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} fullWidth={false}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
