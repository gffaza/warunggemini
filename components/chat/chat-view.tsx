"use client";

import { useCallback } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatThread } from "@/components/chat/chat-thread";
import { PageHeader } from "@/components/layout/page-header";
import { useChat } from "@/hooks/use-chat";
import { useSuccessToast } from "@/hooks/use-success-toast";

export function ChatView() {
  const { showSuccess, Toast } = useSuccessToast();

  const handleTransactionSaved = useCallback(
    (isFirst: boolean) => {
      showSuccess(
        isFirst
          ? "Mantap! Catatan pertama sudah masuk ✅"
          : "Siap, sudah dicatat!",
      );
    },
    [showSuccess],
  );

  const {
    items,
    isLoadingHistory,
    isSending,
    error,
    sendMessage,
    retryLastMessage,
  } = useChat({ onTransactionSaved: handleTransactionSaved });

  const showExamples = !isLoadingHistory && items.length === 0;

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {Toast}

      <PageHeader
        title="Catat Jualan"
        description="Ketik jualan — Mas Gemini yang catat"
      />

      <ChatThread
        items={items}
        isLoadingHistory={isLoadingHistory}
        isSending={isSending}
        error={error}
        onRetry={() => void retryLastMessage()}
      />

      <ChatInput
        onSend={(message) => void sendMessage(message)}
        disabled={isLoadingHistory}
        isSending={isSending}
        showExamples={showExamples}
      />
    </div>
  );
}
