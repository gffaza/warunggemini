import type { ChatMessage } from "@/domain/types/chat";
import type { Transaction } from "@/domain/types/transaction";
import { MasGeminiAvatar } from "@/components/chat/mas-gemini-avatar";
import { TransactionCard } from "@/components/chat/transaction-card";
import { cn } from "@/lib/utils/cn";

interface MessageBubbleProps {
  message: ChatMessage;
  transaction?: Transaction;
  isOptimistic?: boolean;
}

export function MessageBubble({
  message,
  transaction,
  isOptimistic = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-enter-up",
        isUser ? "justify-end" : "justify-start gap-2",
      )}
    >
      {!isUser ? <MasGeminiAvatar className="mt-1" /> : null}
      <div
        className={cn(
          "max-w-[85%] rounded-3xl px-4 py-3 shadow-sm",
          isUser
            ? "rounded-br-md bg-[#DCF8C6] text-foreground"
            : "rounded-bl-md border border-border bg-surface text-foreground",
          isOptimistic && "opacity-70",
        )}
      >
        {!isUser ? (
          <p className="mb-1 text-xs font-semibold text-primary">Mas Gemini</p>
        ) : null}
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        {transaction ? <TransactionCard transaction={transaction} /> : null}
      </div>
    </div>
  );
}
