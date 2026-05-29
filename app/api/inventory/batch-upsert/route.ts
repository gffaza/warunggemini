import type { NextRequest } from "next/server";
import { requireAdminDb } from "@/lib/api/config-checks";
import { batchUpsertRequestSchema } from "@/domain/schemas/inventory.schema";
import { fail, ok } from "@/lib/api/response";
import { withAuth } from "@/lib/api/with-auth";
import { saveReviewedItems } from "@/services/inventory.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    const configError = requireAdminDb();
    if (configError) return configError;

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return fail("INVALID_JSON", "Permintaan tidak valid.", 400);
    }

    const parsed = batchUpsertRequestSchema.safeParse(body);

    if (!parsed.success) {
      return fail(
        "VALIDATION_ERROR",
        "Daftar stok tidak valid. Periksa nama dan jumlah ya, Pak.",
        400,
      );
    }

    try {
      const items = await saveReviewedItems(userId, parsed.data.items);
      return ok({ items });
    } catch {
      return fail(
        "SAVE_FAILED",
        "Gagal menyimpan stok. Coba lagi ya, Pak.",
        500,
      );
    }
  });
}
