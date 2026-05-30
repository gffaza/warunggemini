"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  type User,
} from "firebase/auth";
import { isFirebaseConfigured } from "@/config/env";
import type { WarungType } from "@/config/site";
import type { SaveWarungProfilePayload } from "@/domain/schemas/user.schema";
import { AUTH_ERROR_CODES } from "@/domain/constants/error-codes";
import type { AuthUser, UserProfile } from "@/domain/types/user";
import type { WarungProfile } from "@/domain/types/warung-profile";
import {
  createUserProfile,
  fetchUserProfile,
} from "@/lib/api/profile-client";
import {
  getFirebaseAuth,
  getGoogleProvider,
  type PhoneConfirmationResult,
} from "@/lib/firebase/client";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
export type ProfileLoadState = "idle" | "pending" | "loaded" | "error";

export interface AuthContextValue {
  status: AuthStatus;
  profileLoadState: ProfileLoadState;
  user: UserProfile | null;
  configError: string | null;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string) => Promise<PhoneConfirmationResult>;
  verifyPhoneOtp: (otp: string) => Promise<void>;
  resetPhoneVerification: () => void;
  signOutUser: () => Promise<void>;
  completeOnboarding: (data: SaveWarungProfilePayload) => Promise<WarungProfile>;
  retryProfileLoad: () => Promise<void>;
  getPostAuthPath: () => string;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
  };
}

function mergeUserProfile(
  authUser: AuthUser,
  profile: WarungProfile | null,
): UserProfile {
  return {
    ...authUser,
    warungName: profile?.warungName,
    businessCategory: profile?.businessCategory,
    location: profile?.location,
    onboardingCompleted: Boolean(profile?.warungName),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [profileLoadState, setProfileLoadState] =
    useState<ProfileLoadState>("idle");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const confirmationResultRef = useRef<PhoneConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const firebaseUserRef = useRef<User | null>(null);

  const getPostAuthPath = useCallback((): string => {
    return user?.onboardingCompleted ? "/home" : "/onboarding";
  }, [user?.onboardingCompleted]);

  const loadProfile = useCallback(async (firebaseUser: User) => {
    setProfileLoadState("pending");

    try {
      const profile = await fetchUserProfile();
      setUser(mergeUserProfile(mapFirebaseUser(firebaseUser), profile));
      setProfileLoadState("loaded");
    } catch {
      setUser(mergeUserProfile(mapFirebaseUser(firebaseUser), null));
      setProfileLoadState("error");
    }
  }, []);

  const retryProfileLoad = useCallback(async () => {
    const firebaseUser = firebaseUserRef.current;

    if (!firebaseUser) {
      return;
    }

    await loadProfile(firebaseUser);
  }, [loadProfile]);

  const resetPhoneVerification = useCallback(() => {
    confirmationResultRef.current = null;

    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setConfigError(
        "Firebase belum dikonfigurasi. Salin .env.example ke .env.local.",
      );
      setStatus("unauthenticated");
      setProfileLoadState("idle");
      return;
    }

    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      firebaseUserRef.current = firebaseUser;

      if (firebaseUser) {
        setStatus("authenticated");
        void loadProfile(firebaseUser);
      } else {
        setUser(null);
        setStatus("unauthenticated");
        setProfileLoadState("idle");
      }
    });

    return () => unsubscribe();
  }, [loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signInWithPopup(auth, getGoogleProvider());
  }, []);

  const ensureRecaptcha = useCallback(async () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const auth = getFirebaseAuth();

    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      },
    );

    await recaptchaVerifierRef.current.render();
    return recaptchaVerifierRef.current;
  }, []);

  const sendPhoneOtp = useCallback(
    async (phoneNumber: string) => {
      resetPhoneVerification();

      const auth = getFirebaseAuth();
      const verifier = await ensureRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        verifier,
      );

      confirmationResultRef.current = confirmation;
      return confirmation;
    },
    [ensureRecaptcha, resetPhoneVerification],
  );

  const verifyPhoneOtp = useCallback(async (otp: string) => {
    if (!confirmationResultRef.current) {
      throw { code: AUTH_ERROR_CODES.INVALID_OTP };
    }

    await confirmationResultRef.current.confirm(otp);
    resetPhoneVerification();
  }, [resetPhoneVerification]);

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    resetPhoneVerification();
  }, [resetPhoneVerification]);

  const applyProfile = useCallback((profile: WarungProfile) => {
    setUser((current) =>
      current
        ? {
            ...current,
            warungName: profile.warungName,
            businessCategory: profile.businessCategory,
            location: profile.location,
            onboardingCompleted: true,
          }
        : current,
    );
    setProfileLoadState("loaded");
  }, []);

  const completeOnboarding = useCallback(
    async (data: SaveWarungProfilePayload): Promise<WarungProfile> => {
      try {
        const profile = await createUserProfile(data);
        applyProfile(profile);
        return profile;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Profil warung sudah ada")
        ) {
          const existing = await fetchUserProfile();

          if (existing) {
            applyProfile(existing);
            return existing;
          }
        }

        throw error;
      }
    },
    [applyProfile],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      profileLoadState,
      user,
      configError,
      signInWithGoogle,
      sendPhoneOtp,
      verifyPhoneOtp,
      resetPhoneVerification,
      signOutUser,
      completeOnboarding,
      retryProfileLoad,
      getPostAuthPath,
    }),
    [
      status,
      profileLoadState,
      user,
      configError,
      signInWithGoogle,
      sendPhoneOtp,
      verifyPhoneOtp,
      resetPhoneVerification,
      signOutUser,
      completeOnboarding,
      retryProfileLoad,
      getPostAuthPath,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
