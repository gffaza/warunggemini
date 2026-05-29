import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;

function parseServiceAccount(): Record<string, string> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }

  return JSON.parse(raw) as Record<string, string>;
}

export function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  const existing = getApps()[0];

  if (existing) {
    adminApp = existing;
    return adminApp;
  }

  adminApp = initializeApp({
    credential: cert(parseServiceAccount()),
  });

  return adminApp;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}
