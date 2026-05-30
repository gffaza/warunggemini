"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomeDashboardData } from "@/domain/types/dashboard";
import { apiFetch } from "@/lib/api/client";
import { useRefetchOnVisible } from "@/hooks/use-refetch-on-visible";

type LoadState = "loading" | "success" | "error";

interface DashboardResponse {
  dashboard: HomeDashboardData;
}

let hasLoadedDashboardOnce = false;

export function useDashboard() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<HomeDashboardData | null>(null);

  const loadDashboard = useCallback(async (silent = false) => {
    if (!silent) {
      setLoadState("loading");
    }

    try {
      const response = await apiFetch<DashboardResponse>("/api/dashboard");
      setData(response.dashboard);
      setLoadState("success");
      hasLoadedDashboardOnce = true;
    } catch {
      if (!silent) {
        setLoadState("error");
      }
    }
  }, []);

  useEffect(() => {
    void loadDashboard(hasLoadedDashboardOnce);
  }, [loadDashboard]);

  useRefetchOnVisible({
    path: "/home",
    onRefetch: loadDashboard,
  });

  return {
    data,
    loadState,
    reload: () => loadDashboard(false),
  };
}
