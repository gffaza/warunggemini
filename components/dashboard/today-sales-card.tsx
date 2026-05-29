import { TrendingUp } from "lucide-react";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TodaySalesSummary } from "@/domain/types/dashboard";

interface TodaySalesCardProps {
  sales: TodaySalesSummary;
}

export function TodaySalesCard({ sales }: TodaySalesCardProps) {
  const isEmpty = sales.transactionCount === 0 && sales.revenue === 0;

  if (isEmpty) {
    return (
      <Card className="p-0">
        <EmptyState
          className="py-8"
          title="Belum ada catatan hari ini"
          description="Setiap jualan yang dicatat akan muncul di sini."
          icon={<TrendingUp className="h-10 w-10" aria-hidden />}
        />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold">Omzet Hari Ini</CardTitle>
        <p className="text-sm text-muted-foreground">
          {sales.transactionCount} transaksi
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <CurrencyDisplay amount={sales.revenue} size="large" />
        {sales.topItem ? (
          <div className="flex items-center gap-2 rounded-2xl bg-primary-light px-4 py-3">
            <TrendingUp className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="text-base text-foreground">
              Terlaris:{" "}
              <span className="font-semibold">{sales.topItem}</span>
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
