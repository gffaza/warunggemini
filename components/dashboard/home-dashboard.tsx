"use client";

import { useCallback, useEffect, useState } from "react";
import { GreetingSection } from "@/components/dashboard/greeting-section";
import { InsightCard } from "@/components/dashboard/insight-card";
import { LowStockPreview } from "@/components/dashboard/low-stock-preview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodaySalesCard } from "@/components/dashboard/today-sales-card";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingState } from "@/components/shared/loading-state";
import type { HomeDashboardData } from "@/domain/types/dashboard";
import { useAuth } from "@/hooks/use-auth";
import { fetchHomeDashboardMock } from "@/lib/mock/home-dashboard";

type LoadState = "loading" | "success" | "error";

export function HomeDashboard() {
  const { user } = useAuth();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<HomeDashboardData | null>(null);

  const ownerName =
    user?.displayName?.split(" ")[0] ?? user?.warungName ?? "Pak/Bu";

  const loadDashboard = useCallback(async () => {
    setLoadState("loading");

    try {
      const dashboard = await fetchHomeDashboardMock();
      setData(dashboard);
      setLoadState("success");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loadState === "loading") {
    return (
      <div className="px-4 pt-6">
        <LoadingState message="Memuat beranda..." fullScreen />
      </div>
    );
  }

  if (loadState === "error" || !data) {
    return (
      <div className="space-y-4 px-4 pt-6">
        <GreetingSection
          ownerName={ownerName}
          warungName={user?.warungName}
        />
        <ErrorBanner
          message="Ups, gagal memuat data beranda. Coba lagi ya, Pak."
          onRetry={() => void loadDashboard()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 pt-6 pb-4">
      <GreetingSection ownerName={ownerName} warungName={user?.warungName} />

      <TodaySalesCard sales={data.sales} />

      <InsightCard insight={data.insight} />

      <LowStockPreview items={data.lowStock} />

      <QuickActions />
    </div>
  );
}
