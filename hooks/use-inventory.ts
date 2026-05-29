"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  InventoryItem,
  ScanReviewItem,
  VisionScanResult,
} from "@/domain/types/inventory";
import { apiFetch, apiFetchFormData } from "@/lib/api/client";

interface InventoryListResponse {
  items: InventoryItem[];
}

interface BatchUpsertResponse {
  items: InventoryItem[];
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    reviewItems: ScanReviewItem[];
    confidence: VisionScanResult["confidence"];
    notes?: string;
  } | null>(null);

  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiFetch<InventoryListResponse>("/api/inventory");
      setItems(data.items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat stok. Coba lagi ya, Pak.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const scanImage = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await apiFetchFormData<VisionScanResult>(
        "/api/inventory/scan",
        formData,
      );

      setScanResult({
        reviewItems: result.items.map((item, index) => ({
          ...item,
          id: `scan-${Date.now()}-${index}`,
        })),
        confidence: result.confidence,
        notes: result.notes,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Mas Gemini gagal analisis foto. Coba foto ulang ya, Pak.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const saveReviewedItems = useCallback(
    async (reviewItems: { name: string; qty: number }[]) => {
      setIsSaving(true);
      setError(null);

      try {
        const data = await apiFetch<BatchUpsertResponse>(
          "/api/inventory/batch-upsert",
          {
            method: "POST",
            body: JSON.stringify({ items: reviewItems }),
          },
        );

        setItems((current) => {
          const map = new Map(current.map((item) => [item.normalizedName, item]));
          for (const saved of data.items) {
            map.set(saved.normalizedName, saved);
          }
          return Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name, "id"),
          );
        });
        setScanResult(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal menyimpan stok. Coba lagi ya, Pak.",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const lowStockItems = items.filter(
    (item) => item.status === "low" || item.status === "empty",
  );

  return {
    items,
    lowStockItems,
    isLoading,
    isAnalyzing,
    isSaving,
    error,
    scanResult,
    scanImage,
    saveReviewedItems,
    closeScanReview: () => setScanResult(null),
    reload: loadInventory,
  };
}
