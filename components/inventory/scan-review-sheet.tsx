"use client";

import { AlertTriangle, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { ScanConfidence, ScanReviewItem } from "@/domain/types/inventory";
import { computeStockStatus } from "@/lib/utils/stock-status";
import { cn } from "@/lib/utils/cn";

interface ScanReviewSheetProps {
  items: ScanReviewItem[];
  confidence: ScanConfidence;
  notes?: string;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (items: { name: string; qty: number }[]) => void;
}

export function ScanReviewSheet({
  items: initialItems,
  confidence,
  notes,
  isSaving,
  onClose,
  onSave,
}: ScanReviewSheetProps) {
  const [items, setItems] = useState(initialItems);

  const isLowConfidence = confidence === "low" || confidence === "medium";

  function updateQty(id: string, delta: number) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const qty = Math.max(0, item.estimatedQty + delta);
        return {
          ...item,
          estimatedQty: qty,
          status: computeStockStatus(qty),
        };
      }),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleSave() {
    onSave(
      items.map((item) => ({
        name: item.name,
        qty: item.estimatedQty,
      })),
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-review-title"
    >
      <div className="flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-3xl bg-surface shadow-lg">
        <div className="flex items-center justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-border-strong" />
        </div>

        <div className="flex items-start justify-between gap-3 px-4 pb-3">
          <div>
            <h2 id="scan-review-title" className="text-xl font-bold">
              Hasil Deteksi Stok
            </h2>
            <p className="text-sm text-muted-foreground">
              Periksa dulu sebelum simpan ya, Pak
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-background-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLowConfidence ? (
          <div className="mx-4 mb-3 flex gap-3 rounded-2xl bg-warning-light p-4 text-warning">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold">Akurasi AI terbatas</p>
              <p className="mt-1">
                {notes ??
                  "Foto kurang jelas. Periksa dan koreksi jumlah barang sebelum simpan."}
              </p>
            </div>
          </div>
        ) : null}

        <ul className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
          {items.length === 0 ? (
            <li className="rounded-2xl bg-background-subtle p-4 text-center text-sm text-muted-foreground">
              Tidak ada barang terdeteksi. Coba foto ulang ya, Pak.
            </li>
          ) : (
            items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "rounded-2xl border border-border p-4",
                  item.status !== "ok" && "border-warning/40 bg-warning-light/10",
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <div className="mt-1">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Hapus ${item.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-background-subtle"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jumlah</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      aria-label="Kurangi"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-surface"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="min-w-[2rem] text-center text-lg font-bold">
                      {item.estimatedQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      aria-label="Tambah"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-surface"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={items.length === 0}
          >
            Simpan Stok
          </Button>
        </div>
      </div>
    </div>
  );
}
