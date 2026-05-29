"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface shadow-[0_-2px_8px_rgba(31,41,55,0.06)]"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch px-2 pb-[env(safe-area-inset-bottom)]">
        {bottomNavItems.map((item) => {
          const isActive = item.available && pathname === item.href;
          const Icon = item.icon;

          if (!item.available) {
            return (
              <div
                key={item.href}
                className="flex flex-1 flex-col items-center justify-center gap-1 opacity-40"
                aria-disabled="true"
                title="Segera hadir"
              >
                <Icon className="h-6 w-6 text-muted-foreground" aria-hidden />
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-xl transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn("h-6 w-6", isActive && "stroke-[2.5]")}
                aria-hidden
              />
              <span
                className={cn(
                  "text-xs",
                  isActive ? "font-semibold" : "font-medium",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
