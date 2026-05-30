import Link from "next/link";
import { BarChart3, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ReportsEmpty() {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
        <BarChart3 className="h-10 w-10" aria-hidden />
      </div>

      <h2 className="text-2xl font-bold text-foreground">
        Belum ada laporan
      </h2>
      <p className="mt-3 max-w-sm text-lg leading-relaxed text-muted-foreground">
        Catat jualan dulu ya, Pak — nanti omzet dan barang terlaris muncul
        otomatis di sini.
      </p>

      <Link
        href="/chat"
        className={cn(
          "mt-8 inline-flex min-h-[56px] w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-lg font-semibold text-primary-foreground transition-all active:scale-[0.97] hover:bg-primary-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        )}
      >
        <MessageSquare className="h-5 w-5" aria-hidden />
        Catat Penjualan
      </Link>

      <p className="mt-4 text-sm text-muted-foreground">
        Ketik seperti chat WA — contoh: &quot;jual 3 indomie 45 ribu&quot;
      </p>
    </div>
  );
}
