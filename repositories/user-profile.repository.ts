import { Timestamp } from "firebase-admin/firestore";
import type { WarungType } from "@/config/site";
import type {
  SaveWarungProfileInput,
  WarungProfile,
} from "@/domain/types/warung-profile";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toIsoString } from "@/lib/utils/dates";

const COLLECTION = "users";

function mapDoc(
  uid: string,
  data: FirebaseFirestore.DocumentData,
): WarungProfile {
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : toIsoString();

  const updatedAt =
    data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : toIsoString();

  return {
    uid,
    warungName: data.warungName as string,
    businessCategory: data.businessCategory as WarungType | undefined,
    location: data.location as string | undefined,
    createdAt,
    updatedAt,
  };
}

export async function findUserProfileById(
  userId: string,
): Promise<WarungProfile | null> {
  const db = getAdminFirestore();
  const snapshot = await db.collection(COLLECTION).doc(userId).get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();

  if (!data?.warungName) {
    return null;
  }

  return mapDoc(snapshot.id, data);
}

export async function saveUserProfile(
  userId: string,
  input: SaveWarungProfileInput,
): Promise<WarungProfile> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTION).doc(userId);
  const existing = await ref.get();
  const now = Timestamp.now();

  const payload: Record<string, unknown> = {
    warungName: input.warungName.trim(),
    updatedAt: now,
  };

  if (input.businessCategory) {
    payload.businessCategory = input.businessCategory;
  }

  if (input.location?.trim()) {
    payload.location = input.location.trim();
  }

  if (!existing.exists) {
    payload.createdAt = now;
  }

  await ref.set(payload, { merge: true });

  const saved = await ref.get();
  return mapDoc(saved.id, saved.data() ?? {});
}
