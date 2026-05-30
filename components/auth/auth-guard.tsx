"use client";

import { AuthGate } from "@/components/auth/auth-gate";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  return <AuthGate mode="protected">{children}</AuthGate>;
}
