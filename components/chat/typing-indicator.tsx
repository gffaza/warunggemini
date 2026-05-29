export function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite">
      <div className="max-w-[85%] rounded-3xl rounded-bl-md border border-border bg-surface px-4 py-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold text-primary">Mas Gemini</p>
        <p className="mb-2 text-sm text-muted-foreground">
          Mas Gemini lagi catat...
        </p>
        <div className="flex gap-1" aria-hidden>
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
