import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorBanner({
  message,
  onRetry,
  retryLabel = "Coba Lagi",
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-error/20 bg-error-light p-4 text-error",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="flex-1 space-y-3">
        <p className="text-base font-medium">{message}</p>
        {onRetry ? (
          <Button
            variant="outline"
            size="sm"
            fullWidth={false}
            onClick={onRetry}
            className="border-error/30 text-error hover:bg-error-light"
          >
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
