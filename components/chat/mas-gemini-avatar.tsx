import { cn } from "@/lib/utils/cn";

interface MasGeminiAvatarProps {
  className?: string;
}

export function MasGeminiAvatar({ className }: MasGeminiAvatarProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm",
        className,
      )}
      aria-hidden
    >
      G
    </div>
  );
}
