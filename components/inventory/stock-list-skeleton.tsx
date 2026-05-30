import { Skeleton } from "@/components/shared/skeleton";

export function StockListSkeleton() {
  return (
    <div className="space-y-3" aria-label="Memuat daftar stok">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-border bg-surface p-4"
        >
          <Skeleton className="mb-3 h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
