import { MobileShell } from "@/components/layout/mobile-shell";
import { ProtectedGate } from "@/components/auth/protected-gate";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedGate>
      <MobileShell>{children}</MobileShell>
    </ProtectedGate>
  );
}
