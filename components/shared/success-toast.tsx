"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SuccessToastProps {
  message: string;
  onDismiss: () => void;
  className?: string;
}

export function SuccessToast({
  message,
  onDismiss,
  className,
}: SuccessToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-24 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3",
        "rounded-2xl border border-success/20 bg-success-light px-4 py-3 shadow-lg",
        "animate-toast-in",
        className,
      )}
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden />
      <p className="text-base font-medium text-foreground">{message}</p>
    </div>
  );
}
