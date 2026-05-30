"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { ExampleChips } from "@/components/chat/example-chips";
import { Button } from "@/components/ui/button";
import { chatExamples } from "@/config/site";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isSending?: boolean;
  showExamples?: boolean;
}

export function ChatInput({
  onSend,
  disabled,
  isSending,
  showExamples = true,
}: ChatInputProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed || disabled || isSending) return;

    onSend(trimmed);
    setDraft("");
  }

  function handleExampleSelect(example: string) {
    if (disabled || isSending) return;
    onSend(example);
  }

  return (
    <div className="border-t border-border bg-surface px-3 py-3">
      {showExamples ? (
        <div className="mb-3">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Contoh — ketuk untuk coba:
          </p>
          <ExampleChips
            examples={chatExamples}
            onSelect={handleExampleSelect}
            disabled={disabled || isSending}
          />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label className="sr-only" htmlFor="chat-message">
          Ketik jualan
        </label>
        <textarea
          id="chat-message"
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ketik jualan..."
          disabled={disabled || isSending}
          className={cn(
            "max-h-28 min-h-[48px] flex-1 resize-none rounded-2xl border-2 border-border-strong bg-background px-4 py-3",
            "text-lg text-foreground placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:opacity-50",
          )}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />

        <Button
          type="submit"
          size="icon"
          fullWidth={false}
          disabled={!draft.trim() || disabled || isSending}
          isLoading={isSending}
          aria-label="Kirim pesan"
          className="shrink-0"
        >
          {!isSending ? <Send className="h-5 w-5" aria-hidden /> : null}
        </Button>
      </form>
    </div>
  );
}
