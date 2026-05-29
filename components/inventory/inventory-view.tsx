"use client";

import { AlertTriangle, PackageOpen } from "lucide-react";
import { PhotoUpload } from "@/components/inventory/photo-upload";
import { ScanReviewSheet } from "@/components/inventory/scan-review-sheet";
import { StockCard } from "@/components/inventory/stock-card";
import { StockListSkeleton } from "@/components/inventory/stock-list-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useInventory } from "@/hooks/use-inventory";

export function InventoryView() {
  const {
    items,
    lowStockItems,
    isLoading,
    isAnalyzing,
    isSaving,
    error,
    scanResult,
    scanImage,
    saveReviewedItems,
    closeScanReview,
    reload,
  } = useInventory();

  return (
    <div className="flex flex-col">
      <header className="border-b border-border bg-surface px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">Stok Barang</h1>
        <p className="text-sm text-muted-foreground">
          Foto rak — Mas Gemini bantu hitung
        </p>
      </header>

      <div className="space-y-4 px-4 py-4">
        <PhotoUpload
          onSelect={(file) => void scanImage(file)}
          disabled={isLoading}
          isAnalyzing={isAnalyzing}
        />

        {error ? (
          <ErrorBanner message={error} onRetry={() => void reload()} />
        ) : null}

        {!isLoading && lowStockItems.length > 0 ? (
          <div
            role="alert"
            className="flex gap-3 rounded-2xl border border-accent/20 bg-accent-light p-4"
          >
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              aria-hidden
            />
            <div>
              <p className="font-semibold text-accent">
                {lowStockItems.length} barang perlu restock
              </p>
              <p className="mt-1 text-sm text-foreground">
                {lowStockItems
                  .slice(0, 3)
                  .map((item) => item.name)
                  .join(", ")}
                {lowStockItems.length > 3 ? "..." : ""}
              </p>
            </div>
          </div>
        ) : null}

        <section aria-labelledby="stock-list-heading">
          <h2
            id="stock-list-heading"
            className="mb-3 text-lg font-semibold text-foreground"
          >
            Daftar Stok
          </h2>

          {isLoading ? (
            <StockListSkeleton />
          ) : items.length === 0 ? (
            <EmptyState
              className="py-8"
              title="Belum ada daftar stok"
              description="Foto rak barang untuk mulai deteksi stok otomatis."
              icon={<PackageOpen className="h-10 w-10" aria-hidden />}
            />
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <StockCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {scanResult ? (
        <ScanReviewSheet
          items={scanResult.reviewItems}
          confidence={scanResult.confidence}
          notes={scanResult.notes}
          isSaving={isSaving}
          onClose={closeScanReview}
          onSave={(reviewItems) => void saveReviewedItems(reviewItems)}
        />
      ) : null}
    </div>
  );
}
