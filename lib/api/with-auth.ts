import type { NextRequest } from "next/server";
import { fail } from "@/lib/api/response";
import { verifyIdToken } from "@/lib/firebase/auth-server";

type AuthedHandler = (
  request: NextRequest,
  userId: string,
) => Promise<Response>;

export async function withAuth(
  request: NextRequest,
  handler: AuthedHandler,
): Promise<Response> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return fail("UNAUTHORIZED", "Silakan masuk dulu ya, Pak.", 401);
  }

  const token = authHeader.slice(7);

  try {
    const userId = await verifyIdToken(token);
    return handler(request, userId);
  } catch {
    return fail(
      "UNAUTHORIZED",
      "Sesi habis. Silakan masuk lagi ya, Pak.",
      401,
    );
  }
}
