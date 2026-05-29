import type { NextRequest } from "next/server";
import { requireGemini } from "@/lib/api/config-checks";
import { fail, ok } from "@/lib/api/response";
import { withAuth } from "@/lib/api/with-auth";
import { scanShelfImage } from "@/services/inventory.service";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, _userId) => {
    const configError = requireGemini();
    if (configError) return configError;

    let formData: FormData;

    try {
      formData = await req.formData();
    } catch {
      return fail("INVALID_FORM", "Upload foto tidak valid.", 400);
    }

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return fail(
        "VALIDATION_ERROR",
        "Pilih foto rak barang dulu ya, Pak.",
        400,
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return fail(
        "VALIDATION_ERROR",
        "Format foto harus JPG atau PNG.",
        400,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return fail(
        "VALIDATION_ERROR",
        "Foto terlalu besar. Coba foto ulang ya, Pak.",
        400,
      );
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const result = await scanShelfImage(base64, file.type);

      if (result.confidence === "low" && result.items.length === 0) {
        return fail(
          "VISION_UNCLEAR",
          result.notes ??
            "Foto kurang jelas atau bukan foto rak. Coba foto ulang dengan cahaya lebih terang ya, Pak.",
          422,
        );
      }

      return ok(result);
    } catch {
      return fail(
        "VISION_FAILED",
        "Mas Gemini gagal analisis foto. Coba foto ulang ya, Pak.",
        502,
      );
    }
  });
}
