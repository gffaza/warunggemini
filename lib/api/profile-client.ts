import type { WarungProfile } from "@/domain/types/warung-profile";
import type { SaveWarungProfilePayload } from "@/domain/schemas/user.schema";
import { apiFetch } from "@/lib/api/client";

interface ProfileResponse {
  profile: WarungProfile | null;
}

export async function fetchUserProfile(): Promise<WarungProfile | null> {
  const data = await apiFetch<ProfileResponse>("/api/profile");
  return data.profile;
}

export async function createUserProfile(
  input: SaveWarungProfilePayload,
): Promise<WarungProfile> {
  const data = await apiFetch<{ profile: WarungProfile }>("/api/profile", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return data.profile;
}
