import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";
import { getClientEnv, isFirebaseConfigured } from "@/config/env";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured");
  }

  if (!app) {
    const env = getClientEnv();
    app =
      getApps()[0] ??
      initializeApp({
        apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
  }

  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export type PhoneConfirmationResult = ConfirmationResult;
