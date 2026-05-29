import type { Transaction } from "@/domain/types/transaction";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { cn } from "@/lib/utils/cn";

interface TransactionCardProps {
  transaction: Transaction;
  className?: string;
}

export function TransactionCard({
  transaction,
  className,
}: TransactionCardProps) {
  const label = transaction.type === "sale" ? "Jual" : "Beli";

  return (
    <div
      className={cn(
        "mt-2 animate-enter-scale rounded-2xl border border-primary/20 bg-primary-light p-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
          {label}
        </span>
        <time className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
          }).format(new Date(transaction.createdAt))}
        </time>
      </div>
      <p className="text-base font-semibold text-foreground">
        {transaction.product} × {transaction.quantity}
      </p>
      <div className="mt-1">
        <CurrencyDisplay amount={transaction.price} size="default" />
      </div>
    </div>
  );
}
