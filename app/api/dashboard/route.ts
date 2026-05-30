import type { NextRequest } from "next/server";
import { requireAdminDb } from "@/lib/api/config-checks";
import { fail, ok } from "@/lib/api/response";
import { withAuth } from "@/lib/api/with-auth";
import { getHomeDashboard } from "@/services/dashboard.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, userId) => {
    const configError = requireAdminDb();
    if (configError) return configError;

    try {
      const dashboard = await getHomeDashboard(userId);
      return ok({ dashboard });
    } catch {
      return fail(
        "FETCH_FAILED",
        "Gagal memuat beranda. Coba lagi ya, Pak.",
        500,
      );
    }
  });
}
