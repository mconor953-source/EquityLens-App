import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/format";
import { toneText } from "@/lib/format";

export interface Metric {
  label: string;
  value: string;
  note?: string;
  tone?: Tone;
}

/** One unified compact strip — not four separate cards. */
export function MetricStrip({ metrics, className }: { metrics: Metric[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 divide-border rounded-[4px] border border-border bg-card sm:grid-cols-4 sm:divide-x",
        className,
      )}
    >
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className={cn(
            "min-w-0 px-3.5 py-2.5",
            i < 2 && "border-b border-border sm:border-b-0",
            i % 2 === 1 && "border-l border-border sm:border-l-0",
          )}
        >
          <div className="eyebrow truncate">{m.label}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="num truncate text-[17px] leading-6 font-semibold text-foreground">{m.value}</span>
            {m.note ? (
              <span className={cn("num truncate text-[12px]", toneText(m.tone ?? "neutral"))}>{m.note}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
