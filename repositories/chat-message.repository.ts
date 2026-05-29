import { Timestamp } from "firebase-admin/firestore";
import type { ChatMessage } from "@/domain/types/chat";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toIsoString } from "@/lib/utils/dates";

const COLLECTION = "chat_messages";

function mapDoc(id: string, data: FirebaseFirestore.DocumentData): ChatMessage {
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : toIsoString();

  return {
    id,
    userId: data.userId as string,
    role: data.role as ChatMessage["role"],
    content: data.content as string,
    transactionId: data.transactionId as string | undefined,
    intent: data.intent as ChatMessage["intent"] | undefined,
    createdAt,
  };
}

export async function findChatMessagesByUser(
  userId: string,
  limit = 50,
): Promise<ChatMessage[]> {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .orderBy("createdAt", "asc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => mapDoc(doc.id, doc.data()));
}

export async function createChatMessage(input: {
  userId: string;
  role: ChatMessage["role"];
  content: string;
  transactionId?: string;
  intent?: ChatMessage["intent"];
}): Promise<ChatMessage> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTION).doc();
  const createdAt = Timestamp.now();

  await ref.set({
    userId: input.userId,
    role: input.role,
    content: input.content,
    transactionId: input.transactionId ?? null,
    intent: input.intent ?? null,
    createdAt,
  });

  return {
    id: ref.id,
    userId: input.userId,
    role: input.role,
    content: input.content,
    transactionId: input.transactionId,
    intent: input.intent,
    createdAt: createdAt.toDate().toISOString(),
  };
}
