"use client";

import { cn } from "@/lib/utils/cn";

interface ExampleChipsProps {
  examples: readonly string[];
  onSelect: (example: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ExampleChips({
  examples,
  onSelect,
  disabled,
  className,
}: ExampleChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {examples.map((example) => (
        <button
          key={example}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(example)}
          className={cn(
            "min-h-[40px] rounded-full border border-primary/30 bg-primary-light px-4 py-2",
            "text-sm font-medium text-primary transition-all",
            "hover:border-primary hover:bg-primary-light/80 active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {example}
        </button>
      ))}
    </div>
  );
}
