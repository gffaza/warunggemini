"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReportsData } from "@/domain/types/reports";
import { apiFetch } from "@/lib/api/client";
import { useRefetchOnVisible } from "@/hooks/use-refetch-on-visible";

type LoadState = "loading" | "success" | "error";

interface ReportsResponse {
  reports: ReportsData;
}

let hasLoadedReportsOnce = false;

export function useReports() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<ReportsData | null>(null);

  const loadReports = useCallback(async (silent = false) => {
    if (!silent) {
      setLoadState("loading");
    }

    try {
      const response = await apiFetch<ReportsResponse>("/api/reports");
      setData(response.reports);
      setLoadState("success");
      hasLoadedReportsOnce = true;
    } catch {
      if (!silent) {
        setLoadState("error");
      }
    }
  }, []);

  useEffect(() => {
    void loadReports(hasLoadedReportsOnce);
  }, [loadReports]);

  useRefetchOnVisible({
    path: "/reports",
    onRefetch: loadReports,
  });

  return {
    data,
    loadState,
    reload: () => loadReports(false),
  };
}
