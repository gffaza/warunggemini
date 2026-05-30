"use client";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { GreetingSection } from "@/components/dashboard/greeting-section";
import { InsightCard } from "@/components/dashboard/insight-card";
import { LowStockPreview } from "@/components/dashboard/low-stock-preview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodaySalesCard } from "@/components/dashboard/today-sales-card";
import { LogoutButton } from "@/components/layout/logout-button";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";

export function HomeDashboard() {
  const { user } = useAuth();
  const { data, loadState, reload } = useDashboard();

  const ownerName =
    user?.displayName?.split(" ")[0] ?? user?.warungName ?? "Pak/Bu";

  if (loadState === "loading") {
    return <DashboardSkeleton />;
  }

  if (loadState === "error" || !data) {
    return (
      <div className="space-y-4 px-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <GreetingSection
            ownerName={ownerName}
            warungName={user?.warungName}
          />
          <LogoutButton />
        </div>
        <ErrorBanner
          message="Ups, gagal memuat data beranda. Coba lagi ya, Pak."
          onRetry={() => void reload()}
        />
      </div>
    );
  }

  const isFirstTime = !data.hasAnyTransactions;

  return (
    <div className="space-y-6 px-4 pt-6 pb-4">
      <div className="flex items-start justify-between gap-3">
        <GreetingSection ownerName={ownerName} warungName={user?.warungName} />
        <LogoutButton />
      </div>

      {isFirstTime ? (
        <DashboardWelcome warungName={user?.warungName} />
      ) : (
        <>
          <TodaySalesCard sales={data.sales} />
          <InsightCard insight={data.insight} />
          <LowStockPreview
            items={data.lowStock}
            hasInventory={data.hasInventory}
          />
          <QuickActions />
        </>
      )}
    </div>
  );
}
