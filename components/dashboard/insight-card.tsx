import { Lightbulb, Sparkles } from "lucide-react";
import { DashboardSectionEmpty } from "@/components/dashboard/dashboard-section-empty";
import type { DailyInsight } from "@/domain/types/dashboard";
import { cn } from "@/lib/utils/cn";

interface InsightCardProps {
  insight: DailyInsight | null;
  isFirstTime?: boolean;
}

export function InsightCard({ insight, isFirstTime = false }: InsightCardProps) {
  if (!insight) {
    return (
      <DashboardSectionEmpty
        icon={<Lightbulb className="h-6 w-6 text-secondary" aria-hidden />}
        title="Insight Mas Gemini"
        description={
          isFirstTime
            ? "Setelah Anda catat jualan, Mas Gemini kasih saran praktis untuk warung."
            : "Catat minimal 1 jualan dulu ya, Pak — nanti Mas Gemini kasih saran."
        }
        hint={
          isFirstTime
            ? "Semakin sering catat, semakin akurat sarannya."
            : undefined
        }
        className={cn(isFirstTime && "border-secondary/20 bg-secondary-light/40")}
      />
    );
  }

  return (
    <section
      aria-labelledby="insight-heading"
      className="rounded-3xl border border-secondary/20 bg-secondary-light p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary"
          aria-hidden
        >
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h2
            id="insight-heading"
            className="text-lg font-semibold text-foreground"
          >
            Insight Hari Ini
          </h2>
          <p className="text-base leading-relaxed text-foreground">
            {insight.content}
          </p>
          <p className="text-sm text-muted-foreground">— Mas Gemini</p>
        </div>
      </div>
    </section>
  );
}
