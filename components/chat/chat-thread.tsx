"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingState } from "@/components/shared/loading-state";
import type { ChatMessage } from "@/domain/types/chat";
import type { Transaction } from "@/domain/types/transaction";
import { MessageSquare } from "lucide-react";

export interface ChatThreadItem {
  message: ChatMessage;
  transaction?: Transaction;
  isOptimistic?: boolean;
}

interface ChatThreadProps {
  items: ChatThreadItem[];
  isLoadingHistory: boolean;
  isSending: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function ChatThread({
  items,
  isLoadingHistory,
  isSending,
  error,
  onRetry,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, isSending, error]);

  if (isLoadingHistory) {
    return <LoadingState message="Memuat chat..." fullScreen />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {items.length === 0 ? (
          <EmptyState
            title="Mas Gemini siap bantu!"
            description='Ketik atau bilang jualan Anda, contoh: "jual 3 indomie 45 ribu"'
            icon={<MessageSquare className="h-10 w-10" aria-hidden />}
          />
        ) : (
          items.map((item) => (
            <MessageBubble
              key={item.message.id}
              message={item.message}
              transaction={item.transaction}
              isOptimistic={item.isOptimistic}
            />
          ))
        )}

        {isSending ? <TypingIndicator /> : null}

        {error ? (
          <ErrorBanner message={error} onRetry={onRetry} retryLabel="Kirim Ulang" />
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
