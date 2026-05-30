"use client";

import { useAuthContext, type AuthContextValue } from "@/providers/auth-provider";

export function useAuth(): AuthContextValue {
  return useAuthContext();
}

export type {
  AuthContextValue,
  AuthStatus,
  ProfileLoadState,
} from "@/providers/auth-provider";
