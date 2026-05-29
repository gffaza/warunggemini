import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

interface MobileShellProps {
  children: ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-20">
        <main className="flex-1">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
