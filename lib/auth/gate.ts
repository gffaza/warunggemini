import type { AuthStatus, ProfileLoadState } from "@/providers/auth-provider";

export type AuthGateMode = "guest" | "protected" | "onboarding";

export interface AuthGateState {
  isLoading: boolean;
  isRedirecting: boolean;
  profileLoadError: string | null;
}

interface ResolveAuthGateInput {
  mode: AuthGateMode;
  status: AuthStatus;
  profileLoadState: ProfileLoadState;
  onboardingCompleted: boolean;
}

export function resolveAuthGateState({
  mode,
  status,
  profileLoadState,
  onboardingCompleted,
}: ResolveAuthGateInput): AuthGateState {
  const profileLoadError =
    profileLoadState === "error"
      ? "Gagal memuat profil warung. Periksa koneksi lalu coba lagi."
      : null;

  if (status === "loading") {
    return {
      isLoading: true,
      isRedirecting: false,
      profileLoadError: null,
    };
  }

  if (status === "unauthenticated") {
    if (mode === "guest") {
      return {
        isLoading: false,
        isRedirecting: false,
        profileLoadError: null,
      };
    }

    return {
      isLoading: false,
      isRedirecting: true,
      profileLoadError: null,
    };
  }

  if (profileLoadState === "pending") {
    return {
      isLoading: true,
      isRedirecting: false,
      profileLoadError: null,
    };
  }

  if (profileLoadState === "error") {
    return {
      isLoading: false,
      isRedirecting: false,
      profileLoadError,
    };
  }

  if (mode === "guest") {
    return {
      isLoading: false,
      isRedirecting: true,
      profileLoadError: null,
    };
  }

  if (mode === "onboarding" && onboardingCompleted) {
    return {
      isLoading: false,
      isRedirecting: true,
      profileLoadError: null,
    };
  }

  if (mode === "protected" && !onboardingCompleted) {
    return {
      isLoading: false,
      isRedirecting: true,
      profileLoadError: null,
    };
  }

  return {
    isLoading: false,
    isRedirecting: false,
    profileLoadError: null,
  };
}

export function getAuthRedirectPath(
  mode: AuthGateMode,
  status: AuthStatus,
  profileLoadState: ProfileLoadState,
  onboardingCompleted: boolean,
): string | null {
  if (status === "loading" || profileLoadState !== "loaded") {
    return null;
  }

  if (status === "unauthenticated") {
    return mode === "guest" ? null : "/login";
  }

  if (mode === "guest") {
    return onboardingCompleted ? "/home" : "/onboarding";
  }

  if (mode === "onboarding" && onboardingCompleted) {
    return "/home";
  }

  if (mode === "protected" && !onboardingCompleted) {
    return "/onboarding";
  }

  return null;
}

export function getAuthGateLoadingMessage(
  mode: AuthGateMode,
  isRedirecting: boolean,
): string {
  if (isRedirecting) {
    if (mode === "guest") return "Mengalihkan...";
    if (mode === "onboarding") return "Mengalihkan ke beranda...";
    if (mode === "protected") return "Melengkapi profil warung...";
    return "Mengalihkan ke login...";
  }

  return mode === "onboarding"
    ? "Memuat formulir warung..."
    : "Memuat profil warung...";
}
