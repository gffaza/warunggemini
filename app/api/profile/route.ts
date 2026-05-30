import type { NextRequest } from "next/server";
import { saveWarungProfileSchema } from "@/domain/schemas/user.schema";
import { requireAdminDb } from "@/lib/api/config-checks";
import { fail, ok } from "@/lib/api/response";
import { withAuth } from "@/lib/api/with-auth";
import {
  createUserProfile,
  getUserProfile,
  ProfileAlreadyExistsError,
} from "@/services/user-profile.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, userId) => {
    const configError = requireAdminDb();
    if (configError) return configError;

    try {
      const profile = await getUserProfile(userId);
      return ok({ profile });
    } catch {
      return fail(
        "FETCH_FAILED",
        "Gagal memuat profil warung. Coba lagi ya, Pak.",
        500,
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    const configError = requireAdminDb();
    if (configError) return configError;

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return fail("INVALID_JSON", "Data tidak valid.", 400);
    }

    const parsed = saveWarungProfileSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Data profil tidak valid.";
      return fail("VALIDATION_ERROR", message, 400);
    }

    const { warungName, businessCategory, location } = parsed.data;

    try {
      const profile = await createUserProfile(userId, {
        warungName,
        businessCategory,
        location: location || undefined,
      });

      return ok({ profile }, 201);
    } catch (error) {
      if (error instanceof ProfileAlreadyExistsError) {
        return fail(
          "PROFILE_EXISTS",
          "Profil warung sudah ada. Silakan lanjut ke beranda.",
          409,
        );
      }

      return fail(
        "SAVE_FAILED",
        "Gagal menyimpan profil warung. Coba lagi ya, Pak.",
        500,
      );
    }
  });
}
