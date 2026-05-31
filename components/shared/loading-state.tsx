import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils/cn";

interface LoadingStateProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = "Memuat...",
  className,
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        fullScreen ? "min-h-[50vh] px-4" : "py-8",
        className,
      )}
    >
      {fullScreen ? (
        <Logo size={56} className="animate-pulse" />
      ) : null}
      <span
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
        aria-hidden
      />
      <p className="text-base text-muted-foreground">{message}</p>
    </div>
  );
}
