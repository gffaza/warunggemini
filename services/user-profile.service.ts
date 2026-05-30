import type {
  SaveWarungProfileInput,
  WarungProfile,
} from "@/domain/types/warung-profile";
import {
  findUserProfileById,
  saveUserProfile,
} from "@/repositories/user-profile.repository";

export class ProfileAlreadyExistsError extends Error {
  constructor() {
    super("PROFILE_ALREADY_EXISTS");
    this.name = "ProfileAlreadyExistsError";
  }
}

export async function getUserProfile(
  userId: string,
): Promise<WarungProfile | null> {
  return findUserProfileById(userId);
}

export async function createUserProfile(
  userId: string,
  input: SaveWarungProfileInput,
): Promise<WarungProfile> {
  const existing = await findUserProfileById(userId);

  if (existing) {
    throw new ProfileAlreadyExistsError();
  }

  return saveUserProfile(userId, input);
}
