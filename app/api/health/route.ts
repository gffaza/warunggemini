import { isAdminConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET() {
  const checks = {
    firebaseAdmin: isAdminConfigured(),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    firebaseClient: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  };

  const healthy = checks.firebaseClient && checks.gemini && checks.firebaseAdmin;

  return Response.json(
    {
      status: healthy ? "ok" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
