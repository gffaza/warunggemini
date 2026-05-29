import { getTimeGreeting, formatTodayDate } from "@/lib/utils/greeting";

interface GreetingSectionProps {
  ownerName: string;
  warungName?: string;
}

export function GreetingSection({ ownerName, warungName }: GreetingSectionProps) {
  const greeting = getTimeGreeting();
  const displayName = warungName ?? ownerName;

  return (
    <header className="space-y-1">
      <p className="text-base font-medium text-primary">{greeting}</p>
      <h1 className="text-[28px] font-bold leading-tight text-foreground">
        Halo, {displayName}!
      </h1>
      <p className="text-base text-muted-foreground">{formatTodayDate()}</p>
    </header>
  );
}
