"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatThread } from "@/components/chat/chat-thread";
import { useChat } from "@/hooks/use-chat";

export function ChatView() {
  const {
    items,
    isLoadingHistory,
    isSending,
    error,
    sendMessage,
    retryLastMessage,
  } = useChat();

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <header className="border-b border-border bg-surface px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">Catat Jualan</h1>
        <p className="text-sm text-muted-foreground">
          Ketik jualan — Mas Gemini yang catat
        </p>
      </header>

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
      />
    </div>
  );
}
