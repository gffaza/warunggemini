"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export function ProtectedGate({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
