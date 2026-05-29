import { StatusBadge } from "@/components/shared/status-badge";
import type { InventoryItem } from "@/domain/types/inventory";
import { cn } from "@/lib/utils/cn";

interface StockCardProps {
  item: InventoryItem;
  className?: string;
}

export function StockCard({ item, className }: StockCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[72px] items-center justify-between gap-3 rounded-3xl border border-border bg-surface p-4 shadow-sm",
        item.status === "empty" && "border-accent/30 bg-accent-light/30",
        item.status === "low" && "border-warning/30 bg-warning-light/20",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-foreground">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground">Sisa: {item.qty} pcs</p>
      </div>
      <StatusBadge status={item.status} />
    </article>
  );
}
