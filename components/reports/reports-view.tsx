"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ReportStatCard } from "@/components/reports/report-stat-card";
import { ReportsEmpty } from "@/components/reports/reports-empty";
import { ReportsSkeleton } from "@/components/reports/reports-skeleton";
import { TopProductsList } from "@/components/reports/top-products-list";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useReports } from "@/hooks/use-reports";
import { formatRupiah } from "@/lib/utils/currency";

export function ReportsView() {
  const { data, loadState, reload } = useReports();

  if (loadState === "loading") {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Laporan"
          description="Ringkasan jualan warung Anda"
          showLogout={false}
        />
        <ReportsSkeleton />
      </div>
    );
  }

  if (loadState === "error" || !data) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Laporan"
          description="Ringkasan jualan warung Anda"
          showLogout={false}
        />
        <div className="px-4 py-6">
          <ErrorBanner
            message="Ups, gagal memuat laporan. Coba lagi ya, Pak."
            onRetry={() => void reload()}
            retryLabel="Coba Lagi"
          />
        </div>
      </div>
    );
  }

  if (!data.hasTransactions) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Laporan"
          description="Ringkasan jualan warung Anda"
          showLogout={false}
        />
        <ReportsEmpty />
      </div>
    );
  }

  const profitLabel = data.estimatedProfit.hasExpenseRecords
    ? "Perkiraan Untung"
    : "Omzet Minggu Ini";

  const profitNote = data.estimatedProfit.hasExpenseRecords
    ? `Omzet ${formatRupiah(data.estimatedProfit.weeklyRevenue)} − pengeluaran ${formatRupiah(data.estimatedProfit.weeklyExpenses)}`
    : "Belum ada pengeluaran tercatat — belum dikurangi biaya modal.";

  return (
    <div className="flex flex-col pb-4">
      <PageHeader
        title="Laporan"
        description="Ringkasan jualan warung Anda"
        showLogout={false}
      />

      <div className="space-y-4 px-4 py-4">
        <ReportStatCard
          label="Penjualan Hari Ini"
          accent="primary"
          value={
            <CurrencyDisplay amount={data.todaySales.revenue} size="large" />
          }
          subtitle={
            data.todaySales.transactionCount > 0
              ? `${data.todaySales.transactionCount} transaksi hari ini`
              : "Belum ada jualan hari ini"
          }
        />

        <ReportStatCard
          label="Penjualan Minggu Ini"
          accent="default"
          value={
            <CurrencyDisplay amount={data.weeklySales.revenue} size="large" />
          }
          subtitle={`${data.weeklySales.transactionCount} transaksi · ${data.weeklySales.periodLabel}`}
        />

        <TopProductsList products={data.topProducts} />

        <ReportStatCard
          label={profitLabel}
          accent="secondary"
          value={
            <CurrencyDisplay amount={data.estimatedProfit.amount} size="large" />
          }
          subtitle={profitNote}
        />
      </div>
    </div>
  );
}
