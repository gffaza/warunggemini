import { Timestamp } from "firebase-admin/firestore";
import type { Transaction, TransactionType } from "@/domain/types/transaction";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { getJakartaDateString, toIsoString } from "@/lib/utils/dates";
import { normalizeProductName } from "@/lib/utils/normalize-product-name";

const COLLECTION = "transactions";

function mapDoc(id: string, data: FirebaseFirestore.DocumentData): Transaction {
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : toIsoString();

  const items = (data.items as Transaction["items"]) ?? [];
  const primaryItem = items[0];

  return {
    id,
    userId: data.userId as string,
    type: data.type as TransactionType,
    product: primaryItem?.name ?? (data.product as string) ?? "",
    quantity: primaryItem?.qty ?? (data.quantity as number) ?? 0,
    price: (data.total as number) ?? 0,
    items,
    total: (data.total as number) ?? 0,
    rawInput: data.rawInput as string,
    source: "chat",
    chatMessageId: data.chatMessageId as string | undefined,
    createdAt,
    date: data.date as string,
  };
}

export async function findTransactionsByUser(
  userId: string,
): Promise<Transaction[]> {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .get();

  return snapshot.docs.map((doc) => mapDoc(doc.id, doc.data()));
}

export async function findTransactionsByIds(
  ids: string[],
): Promise<Transaction[]> {
  if (ids.length === 0) return [];

  const db = getAdminFirestore();
  const docs = await Promise.all(
    ids.map((id) => db.collection(COLLECTION).doc(id).get()),
  );

  return docs
    .filter((doc) => doc.exists)
    .map((doc) => mapDoc(doc.id, doc.data() ?? {}));
}

export async function createTransaction(input: {
  userId: string;
  type: TransactionType;
  product: string;
  quantity: number;
  price: number;
  unitPrice?: number;
  rawInput: string;
  chatMessageId?: string;
}): Promise<Transaction> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTION).doc();
  const normalizedName = normalizeProductName(input.product);
  const subtotal = input.unitPrice
    ? input.unitPrice * input.quantity
    : input.price;

  const items = [
    {
      name: input.product,
      normalizedName,
      qty: input.quantity,
      unitPrice: input.unitPrice,
      subtotal,
    },
  ];

  const createdAt = Timestamp.now();
  const date = getJakartaDateString();

  await ref.set({
    userId: input.userId,
    type: input.type,
    product: input.product,
    quantity: input.quantity,
    items,
    total: input.price,
    rawInput: input.rawInput,
    source: "chat",
    chatMessageId: input.chatMessageId ?? null,
    date,
    createdAt,
  });

  return {
    id: ref.id,
    userId: input.userId,
    type: input.type,
    product: input.product,
    quantity: input.quantity,
    price: input.price,
    items,
    total: input.price,
    rawInput: input.rawInput,
    source: "chat",
    chatMessageId: input.chatMessageId,
    createdAt: createdAt.toDate().toISOString(),
    date,
  };
}
