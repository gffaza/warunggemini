"use client";

import { useCallback, useState } from "react";
import { SuccessToast } from "@/components/shared/success-toast";

export function useSuccessToast() {
  const [message, setMessage] = useState<string | null>(null);

  const showSuccess = useCallback((text: string) => {
    setMessage(text);
  }, []);

  const dismiss = useCallback(() => {
    setMessage(null);
  }, []);

  const Toast = message ? (
    <SuccessToast message={message} onDismiss={dismiss} />
  ) : null;

  return { showSuccess, dismiss, Toast };
}
