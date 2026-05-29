import { cn } from "@/lib/utils/cn";
import type { StockStatus } from "@/domain/types/stock";

const STATUS_CONFIG: Record<
  StockStatus,
  { label: string; className: string }
> = {
  ok: {
    label: "Stok aman",
    className: "bg-success-light text-success",
  },
  low: {
    label: "Stok menipis",
    className: "bg-warning-light text-warning",
  },
  empty: {
    label: "Stok habis",
    className: "bg-accent-light text-accent",
  },
};

interface StatusBadgeProps {
  status: StockStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex min-h-[28px] items-center rounded-full px-3 py-1 text-sm font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
