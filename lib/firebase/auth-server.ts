import { getAdminAuth, isAdminConfigured } from "@/lib/firebase/admin";

export async function verifyIdToken(token: string): Promise<string> {
  if (!isAdminConfigured()) {
    throw new Error("Firebase Admin is not configured");
  }

  const decoded = await getAdminAuth().verifyIdToken(token);
  return decoded.uid;
}
