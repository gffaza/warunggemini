import { Skeleton } from "@/components/shared/skeleton";

export function ReportsSkeleton() {
  return (
    <div className="space-y-4 px-4 py-4" aria-label="Memuat laporan">
      <Skeleton className="h-28 w-full rounded-3xl" />
      <Skeleton className="h-28 w-full rounded-3xl" />
      <Skeleton className="h-44 w-full rounded-3xl" />
      <Skeleton className="h-28 w-full rounded-3xl" />
    </div>
  );
}
