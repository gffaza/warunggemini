import { TrendingUp } from "lucide-react";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { DashboardSectionEmpty } from "@/components/dashboard/dashboard-section-empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TodaySalesSummary } from "@/domain/types/dashboard";

interface TodaySalesCardProps {
  sales: TodaySalesSummary;
  isFirstTime?: boolean;
}

export function TodaySalesCard({ sales, isFirstTime = false }: TodaySalesCardProps) {
  const isEmpty = sales.transactionCount === 0 && sales.revenue === 0;

  if (isEmpty && isFirstTime) {
    return (
      <DashboardSectionEmpty
        icon={<TrendingUp className="h-6 w-6" aria-hidden />}
        title="Belum ada penjualan"
        description="Catat jualan pertama Anda — cukup ketik seperti chat."
        hint='Contoh: "jual 3 indomie 45 ribu"'
        actionLabel="Catat Penjualan"
        actionHref="/chat"
      />
    );
  }

  if (isEmpty) {
    return (
      <DashboardSectionEmpty
        icon={<TrendingUp className="h-6 w-6" aria-hidden />}
        title="Belum ada catatan hari ini"
        description="Setiap jualan yang dicatat hari ini akan muncul di sini."
        actionLabel="Catat Penjualan"
        actionHref="/chat"
      />
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
