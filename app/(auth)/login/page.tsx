import { GuestGuard } from "@/components/auth/guest-guard";
import { LoginView } from "@/components/auth/login-view";

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginView />
    </GuestGuard>
  );
}
