import { PackageOpen } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LowStockItem } from "@/domain/types/dashboard";

interface LowStockPreviewProps {
  items: LowStockItem[];
}

export function LowStockPreview({ items }: LowStockPreviewProps) {
  const previewItems = items.filter(
    (item) => item.status === "low" || item.status === "empty",
  );

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-semibold">Stok Perlu Perhatian</CardTitle>
        <p className="text-sm text-muted-foreground">
          Barang menipis atau habis
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {previewItems.length === 0 ? (
          <EmptyState
            className="py-6"
            title="Semua stok aman"
            description="Belum ada barang yang menipis hari ini."
            icon={<PackageOpen className="h-10 w-10" aria-hidden />}
          />
        ) : (
          <ul className="space-y-3" aria-label="Daftar stok menipis">
            {previewItems.slice(0, 4).map((item) => (
              <li
                key={item.id}
                className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-border bg-background-subtle px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sisa: {item.qty} pcs
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
