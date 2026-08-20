import { cn } from "@/lib/utils";
import { StatusIndicator } from "./StatusIndicator";
import type { FinancialHealth, TechnicalAnalysis } from "@/data/types";
import { ratingTone, riskTone } from "@/lib/format";

export function ResearchSnapshot({
  technical,
  health,
  eventRisk,
  className,
}: {
  technical: TechnicalAnalysis;
  health: FinancialHealth;
  eventRisk: "Low" | "Moderate" | "High";
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-border", className)}>
      <SnapRow label="Technical rating">
        <StatusIndicator label={technical.rating} tone={ratingTone(technical.rating)} variant="chip" />
      </SnapRow>

      <SnapRow label="Signal count">
        <span className="num flex items-center gap-2.5 text-[12px]">
          <span className="text-pos">{technical.counts.buy} Buy</span>
          <span className="text-steel">{technical.counts.neutral} Neutral</span>
          <span className="text-neg">{technical.counts.sell} Sell</span>
        </span>
      </SnapRow>

      <SnapRow label="Financial health">
        <span className="flex items-baseline gap-2">
          <span className="num text-[14px] font-semibold text-foreground">
            {health.score} / {health.max}
          </span>
          <span className="text-[12px] text-steel">{health.label}</span>
        </span>
      </SnapRow>

      <SnapRow label="Trend">
        <StatusIndicator label={technical.trend} tone={ratingTone(technical.trend)} />
      </SnapRow>

      <SnapRow label="Event risk">
        <StatusIndicator label={eventRisk} tone={riskTone(eventRisk)} />
      </SnapRow>
    </dl>
  );
}

function SnapRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5">
      <dt className="truncate text-[12px] text-steel">{label}</dt>
      <dd className="shrink-0 text-right">{children}</dd>
    </div>
  );
}
