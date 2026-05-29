import { Timestamp } from "firebase-admin/firestore";
import type { StockStatus } from "@/domain/types/stock";
import type { InventoryItem } from "@/domain/types/inventory";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toIsoString } from "@/lib/utils/dates";
import { normalizeProductName } from "@/lib/utils/normalize-product-name";
import { computeStockStatus } from "@/lib/utils/stock-status";

const COLLECTION = "inventory";

function mapDoc(id: string, data: FirebaseFirestore.DocumentData): InventoryItem {
  const updatedAt =
    data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : toIsoString();

  const lastScannedAt =
    data.lastScannedAt instanceof Timestamp
      ? data.lastScannedAt.toDate().toISOString()
      : undefined;

  return {
    id,
    userId: data.userId as string,
    name: data.name as string,
    normalizedName: data.normalizedName as string,
    qty: data.qty as number,
    status: data.status as StockStatus,
    lastScannedAt,
    source: data.source as InventoryItem["source"],
    updatedAt,
  };
}

export async function findInventoryByUser(
  userId: string,
): Promise<InventoryItem[]> {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .get();

  const items = snapshot.docs.map((doc) => mapDoc(doc.id, doc.data()));

  return items.sort((a, b) => a.name.localeCompare(b.name, "id"));
}

export async function upsertInventoryItem(input: {
  userId: string;
  name: string;
  qty: number;
  source: InventoryItem["source"];
}): Promise<InventoryItem> {
  const db = getAdminFirestore();
  const normalizedName = normalizeProductName(input.name);
  const status = computeStockStatus(input.qty);
  const now = Timestamp.now();

  const existing = await db
    .collection(COLLECTION)
    .where("userId", "==", input.userId)
    .where("normalizedName", "==", normalizedName)
    .limit(1)
    .get();

  if (!existing.empty) {
    const doc = existing.docs[0];
    await doc.ref.update({
      name: input.name.trim(),
      qty: input.qty,
      status,
      source: input.source,
      lastScannedAt: now,
      updatedAt: now,
    });

    const saved = await doc.ref.get();
    return mapDoc(saved.id, saved.data() ?? {});
  }

  const ref = db.collection(COLLECTION).doc();

  await ref.set({
    userId: input.userId,
    name: input.name.trim(),
    normalizedName,
    qty: input.qty,
    status,
    source: input.source,
    lastScannedAt: now,
    updatedAt: now,
  });

  return {
    id: ref.id,
    userId: input.userId,
    name: input.name.trim(),
    normalizedName,
    qty: input.qty,
    status,
    lastScannedAt: now.toDate().toISOString(),
    source: input.source,
    updatedAt: now.toDate().toISOString(),
  };
}

export async function batchUpsertInventory(
  userId: string,
  items: { name: string; qty: number }[],
): Promise<InventoryItem[]> {
  const results: InventoryItem[] = [];

  for (const item of items) {
    const saved = await upsertInventoryItem({
      userId,
      name: item.name,
      qty: item.qty,
      source: "vision",
    });
    results.push(saved);
  }

  return results;
}
