"use client";

import { AuthGate } from "@/components/auth/auth-gate";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  return <AuthGate mode="guest">{children}</AuthGate>;
}
