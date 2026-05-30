import { Skeleton } from "@/components/shared/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 px-4 pt-6 pb-4" aria-label="Memuat beranda">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>

      <Skeleton className="h-52 w-full rounded-3xl" />

      <div className="space-y-3">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <Skeleton className="h-36 w-full rounded-3xl" />
        <Skeleton className="h-36 w-full rounded-3xl" />
      </div>
    </div>
  );
}
