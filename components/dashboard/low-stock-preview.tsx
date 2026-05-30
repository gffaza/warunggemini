import { Camera, PackageOpen } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { DashboardSectionEmpty } from "@/components/dashboard/dashboard-section-empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LowStockItem } from "@/domain/types/dashboard";

interface LowStockPreviewProps {
  items: LowStockItem[];
  hasInventory: boolean;
  isFirstTime?: boolean;
}

export function LowStockPreview({
  items,
  hasInventory,
  isFirstTime = false,
}: LowStockPreviewProps) {
  const previewItems = items.filter(
    (item) => item.status === "low" || item.status === "empty",
  );

  if (!hasInventory) {
    return (
      <DashboardSectionEmpty
        icon={<Camera className="h-6 w-6" aria-hidden />}
        title="Belum ada daftar stok"
        description="Foto rak barang — Mas Gemini bantu hitung otomatis."
        hint="Tidak perlu ketik manual, cukup ambil foto."
        actionLabel="Foto Rak"
        actionHref="/inventory"
      />
    );
  }

  if (isFirstTime && previewItems.length === 0) {
    return (
      <DashboardSectionEmpty
        icon={<PackageOpen className="h-6 w-6" aria-hidden />}
        title="Stok sudah tercatat"
        description="Bagus! Stok Anda aman. Nanti kalau ada yang menipis, kami kabari di sini."
      />
    );
  }

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
          <DashboardSectionEmpty
            icon={<PackageOpen className="h-6 w-6" aria-hidden />}
            title="Semua stok aman"
            description="Belum ada barang yang menipis hari ini."
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
