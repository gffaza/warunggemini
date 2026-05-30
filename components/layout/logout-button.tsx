"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const { signOutUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm("Yakin mau keluar dari akun?")) {
      return;
    }

    setIsLoading(true);

    try {
      await signOutUser();
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      fullWidth={false}
      isLoading={isLoading}
      className={className}
      onClick={() => void handleLogout()}
      aria-label="Keluar dari akun"
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      Keluar
    </Button>
  );
}
