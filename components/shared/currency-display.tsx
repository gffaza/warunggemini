import { cn } from "@/lib/utils/cn";
import { formatRupiah } from "@/lib/utils/currency";

interface CurrencyDisplayProps {
  amount: number;
  size?: "default" | "large";
  className?: string;
}

export function CurrencyDisplay({
  amount,
  size = "default",
  className,
}: CurrencyDisplayProps) {
  return (
    <span
      className={cn(
        "font-bold tabular-nums text-foreground",
        size === "large" ? "text-[32px] leading-tight" : "text-2xl",
        className,
      )}
    >
      {formatRupiah(amount)}
    </span>
  );
}
