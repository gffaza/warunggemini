import type { NextRequest } from "next/server";
import { requireAdminDb } from "@/lib/api/config-checks";
import { fail, ok } from "@/lib/api/response";
import { withAuth } from "@/lib/api/with-auth";
import { getReports } from "@/services/reports.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, userId) => {
    const configError = requireAdminDb();
    if (configError) return configError;

    try {
      const reports = await getReports(userId);
      return ok({ reports });
    } catch {
      return fail(
        "FETCH_FAILED",
        "Gagal memuat laporan. Coba lagi ya, Pak.",
        500,
      );
    }
  });
}
