import type { NextRequest } from "next/server";
import { requireAdminDb } from "@/lib/api/config-checks";
import { fail, ok } from "@/lib/api/response";
import { withAuth } from "@/lib/api/with-auth";
import { getInventoryList } from "@/services/inventory.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, userId) => {
    const configError = requireAdminDb();
    if (configError) return configError;

    try {
      const items = await getInventoryList(userId);
      return ok({ items });
    } catch {
      return fail(
        "FETCH_FAILED",
        "Gagal memuat stok. Coba lagi ya, Pak.",
        500,
      );
    }
  });
}
