"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChatMessage } from "@/domain/types/chat";
import type { Transaction } from "@/domain/types/transaction";
import type { ChatThreadItem } from "@/components/chat/chat-thread";
import { apiFetch } from "@/lib/api/client";

interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  transaction?: Transaction;
}

interface HistoryResponse {
  messages: ChatMessage[];
  transactions: Transaction[];
}

function buildThreadItems(
  messages: ChatMessage[],
  transactions: Transaction[],
): ChatThreadItem[] {
  const txMap = new Map(transactions.map((tx) => [tx.id, tx]));

  return messages.map((message) => ({
    message,
    transaction: message.transactionId
      ? txMap.get(message.transactionId)
      : undefined,
  }));
}

export function useChat() {
  const [items, setItems] = useState<ChatThreadItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(
    null,
  );

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setError(null);

    try {
      const data = await apiFetch<HistoryResponse>("/api/chat/messages");
      setItems(buildThreadItems(data.messages, data.transactions));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat riwayat chat. Coba lagi ya, Pak.",
      );
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const sendMessage = useCallback(async (message: string) => {
    setError(null);
    setLastFailedMessage(null);

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: optimisticId,
      userId: "local",
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };

    setItems((current) => [
      ...current,
      { message: optimisticMessage, isOptimistic: true },
    ]);
    setIsSending(true);

    try {
      const data = await apiFetch<SendMessageResponse>("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ message }),
      });

      setItems((current) => {
        const withoutOptimistic = current.filter(
          (item) => item.message.id !== optimisticId,
        );

        return [
          ...withoutOptimistic,
          { message: data.userMessage },
          {
            message: data.assistantMessage,
            transaction: data.transaction,
          },
        ];
      });
    } catch (err) {
      setItems((current) =>
        current.filter((item) => item.message.id !== optimisticId),
      );
      setLastFailedMessage(message);
      setError(
        err instanceof Error
          ? err.message
          : "Ups, gagal catat jualan. Coba kirim ulang ya, Pak.",
      );
    } finally {
      setIsSending(false);
    }
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (!lastFailedMessage) return;
    await sendMessage(lastFailedMessage);
  }, [lastFailedMessage, sendMessage]);

  return {
    items,
    isLoadingHistory,
    isSending,
    error,
    sendMessage,
    retryLastMessage,
    reloadHistory: loadHistory,
  };
}
