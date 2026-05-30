"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface UseRefetchOnVisibleOptions {
  path: string;
  onRefetch: (silent: boolean) => void | Promise<void>;
}

export function useRefetchOnVisible({
  path,
  onRefetch,
}: UseRefetchOnVisibleOptions) {
  const pathname = usePathname();
  const skipInitialRef = useRef(true);

  useEffect(() => {
    if (skipInitialRef.current) {
      skipInitialRef.current = false;
      return;
    }

    if (pathname === path) {
      void onRefetch(true);
    }
  }, [pathname, path, onRefetch]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && pathname === path) {
        void onRefetch(true);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pathname, path, onRefetch]);
}
