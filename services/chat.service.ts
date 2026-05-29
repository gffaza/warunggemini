import type { ChatMessage } from "@/domain/types/chat";
import type { Transaction } from "@/domain/types/transaction";
import type { GeminiParseResponse } from "@/domain/schemas/chat.schema";
import { parseTransactionMessage } from "@/lib/gemini/client";
import {
  createChatMessage,
  findChatMessagesByUser,
} from "@/repositories/chat-message.repository";
import {
  createTransaction,
  findTransactionsByIds,
} from "@/repositories/transaction.repository";

export interface SendMessageResult {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  transaction?: Transaction;
}

export interface ChatHistoryResult {
  messages: ChatMessage[];
  transactions: Transaction[];
}

export async function getChatHistory(userId: string): Promise<ChatHistoryResult> {
  const messages = await findChatMessagesByUser(userId);
  const transactionIds = messages
    .map((message) => message.transactionId)
    .filter((id): id is string => Boolean(id));
  const transactions = await findTransactionsByIds(transactionIds);

  return { messages, transactions };
}

export async function handleChatMessage(
  userId: string,
  message: string,
): Promise<SendMessageResult> {
  const parsed: GeminiParseResponse = await parseTransactionMessage(message);

  const userMessage = await createChatMessage({
    userId,
    role: "user",
    content: message,
  });

  let transaction: Transaction | undefined;

  if (
    (parsed.intent === "record_sale" || parsed.intent === "record_expense") &&
    parsed.product &&
    parsed.quantity &&
    parsed.price !== undefined
  ) {
    transaction = await createTransaction({
      userId,
      type: parsed.intent === "record_expense" ? "expense" : "sale",
      product: parsed.product,
      quantity: parsed.quantity,
      price: parsed.price,
      unitPrice: parsed.unitPrice,
      rawInput: message,
      chatMessageId: userMessage.id,
    });
  }

  const assistantContent =
    parsed.clarificationQuestion ?? parsed.confirmationMessage;

  const assistantMessage = await createChatMessage({
    userId,
    role: "assistant",
    content: assistantContent,
    transactionId: transaction?.id,
    intent: parsed.intent,
  });

  return {
    userMessage,
    assistantMessage,
    transaction,
  };
}
