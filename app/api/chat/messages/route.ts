import type { NextRequest } from "next/server";
import { requireAdminDb, requireGemini } from "@/lib/api/config-checks";
import { chatMessageRequestSchema } from "@/domain/schemas/chat.schema";
import { fail, ok } from "@/lib/api/response";
import { withAuth } from "@/lib/api/with-auth";
import { mapGeminiChatError } from "@/lib/gemini/map-error";
import {
  getChatHistory,
  handleChatMessage,
} from "@/services/chat.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, userId) => {
    const configError = requireAdminDb();
    if (configError) return configError;

    try {
      const history = await getChatHistory(userId);
      return ok(history);
    } catch {
      return fail(
        "FETCH_FAILED",
        "Gagal memuat riwayat chat. Coba lagi ya, Pak.",
        500,
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    const geminiError = requireGemini();
    if (geminiError) return geminiError;

    const dbError = requireAdminDb();
    if (dbError) return dbError;

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return fail("INVALID_JSON", "Permintaan tidak valid.", 400);
    }

    const parsed = chatMessageRequestSchema.safeParse(body);

    if (!parsed.success) {
      return fail(
        "VALIDATION_ERROR",
        "Pesan terlalu panjang atau kosong. Coba lagi ya, Pak.",
        400,
      );
    }

    try {
      const result = await handleChatMessage(userId, parsed.data.message);
      return ok(result);
    } catch (error) {
      const mapped = mapGeminiChatError(error);
      return fail(mapped.code, mapped.message, mapped.status);
    }
  });
}
