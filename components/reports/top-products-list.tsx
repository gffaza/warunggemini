import { TrendingUp } from "lucide-react";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import type { TopProduct } from "@/domain/types/reports";
import { formatRupiah } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

interface TopProductsListProps {
  products: TopProduct[];
  className?: string;
}

export function TopProductsList({ products, className }: TopProductsListProps) {
  if (products.length === 0) {
    return (
      <section
        className={cn(
          "rounded-3xl border border-border bg-surface p-5 shadow-sm",
          className,
        )}
      >
        <h2 className="text-lg font-semibold text-foreground">
          Barang Paling Laku
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          Belum ada data minggu ini. Catat jualan dulu ya, Pak.
        </p>
      </section>
    );
  }

  const maxQty = products[0]?.quantitySold ?? 1;

  return (
    <section
      aria-labelledby="top-products-heading"
      className={cn(
        "rounded-3xl border border-border bg-surface p-5 shadow-sm",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
        <h2 id="top-products-heading" className="text-lg font-semibold text-foreground">
          Barang Paling Laku
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">7 hari terakhir</p>

      <ol className="space-y-4">
        {products.map((product, index) => {
          const barWidth = Math.max(
            12,
            Math.round((product.quantitySold / maxQty) * 100),
          );

          return (
            <li key={`${product.name}-${index}`} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">
                    {index + 1}. {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Terjual {product.quantitySold} pcs · {formatRupiah(product.revenue)}
                  </p>
                </div>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-border"
                aria-hidden
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
