import { Lightbulb, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { DailyInsight } from "@/domain/types/dashboard";
import { cn } from "@/lib/utils/cn";

interface InsightCardProps {
  insight: DailyInsight | null;
}

export function InsightCard({ insight }: InsightCardProps) {
  if (!insight) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-border bg-secondary-light p-6",
        )}
      >
        <EmptyState
          className="py-4"
          title="Insight belum tersedia"
          description="Catat minimal 1 jualan dulu ya, Pak — nanti Mas Gemini kasih saran."
          icon={<Lightbulb className="h-10 w-10 text-secondary" aria-hidden />}
        />
      </div>
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
