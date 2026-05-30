import { Skeleton } from "@/components/shared/skeleton";

export function OnboardingSkeleton() {
  return (
    <div className="space-y-6" aria-label="Memuat formulir warung">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full" />
      </div>

      <Skeleton className="h-14 w-full" />
    </div>
  );
}
