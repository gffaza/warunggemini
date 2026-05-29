import type { NextResponse } from "next/server";
import { fail } from "@/lib/api/response";
import { isAdminConfigured } from "@/lib/firebase/admin";

export function requireAdminDb(): NextResponse | null {
  if (!isAdminConfigured()) {
    return fail(
      "CONFIG_ERROR",
      "Database belum dikonfigurasi. FIREBASE_SERVICE_ACCOUNT_JSON belum diatur.",
      503,
    );
  }

  return null;
}

export function requireGemini(): NextResponse | null {
  if (!process.env.GEMINI_API_KEY) {
    return fail(
      "CONFIG_ERROR",
      "Mas Gemini belum siap. GEMINI_API_KEY belum diatur.",
      503,
    );
  }

  return null;
}
