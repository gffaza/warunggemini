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
import { AUTH_ERROR_CODES } from "@/domain/constants/error-codes";
import type { AuthUser, UserProfile } from "@/domain/types/user";
import {
  getFirebaseAuth,
  getGoogleProvider,
  type PhoneConfirmationResult,
} from "@/lib/firebase/client";
import {
  clearOnboardingData,
  getOnboardingData,
  saveOnboardingData,
} from "@/lib/firebase/onboarding-storage";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  user: UserProfile | null;
  configError: string | null;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string) => Promise<PhoneConfirmationResult>;
  verifyPhoneOtp: (otp: string) => Promise<void>;
  resetPhoneVerification: () => void;
  signOutUser: () => Promise<void>;
  completeOnboarding: (data: {
    warungName: string;
    warungType: WarungType;
  }) => void;
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

function buildUserProfile(user: User): UserProfile {
  const onboarding = getOnboardingData();
  const base = mapFirebaseUser(user);

  return {
    ...base,
    warungName: onboarding?.warungName,
    warungType: onboarding?.warungType,
    onboardingCompleted: Boolean(onboarding?.completed),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const confirmationResultRef = useRef<PhoneConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const getPostAuthPath = useCallback((): string => {
    const onboarding = getOnboardingData();
    return onboarding?.completed ? "/home" : "/onboarding";
  }, []);

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
      return;
    }

    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(buildUserProfile(firebaseUser));
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    });

    return () => unsubscribe();
  }, []);

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
    clearOnboardingData();
    resetPhoneVerification();
  }, [resetPhoneVerification]);

  const completeOnboarding = useCallback(
    (data: { warungName: string; warungType: WarungType }) => {
      saveOnboardingData(data);

      setUser((current) =>
        current
          ? {
              ...current,
              warungName: data.warungName,
              warungType: data.warungType,
              onboardingCompleted: true,
            }
          : current,
      );
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      configError,
      signInWithGoogle,
      sendPhoneOtp,
      verifyPhoneOtp,
      resetPhoneVerification,
      signOutUser,
      completeOnboarding,
      getPostAuthPath,
    }),
    [
      status,
      user,
      configError,
      signInWithGoogle,
      sendPhoneOtp,
      verifyPhoneOtp,
      resetPhoneVerification,
      signOutUser,
      completeOnboarding,
      getPostAuthPath,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
