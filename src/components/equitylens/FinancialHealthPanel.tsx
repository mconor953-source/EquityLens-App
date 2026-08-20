import { cn } from "@/lib/utils";
import type { FinancialHealth } from "@/data/types";

export function FinancialHealthPanel({ health, className }: { health: FinancialHealth; className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]", className)}>
      <div>
        <div className="flex items-end gap-3">
          <span className="num text-[38px] leading-10 font-semibold text-foreground">{health.score}</span>
          <span className="num pb-1.5 text-[14px] text-steel">/ {health.max}</span>
          <span className="pb-2 text-[13px] font-medium text-pos">{health.label}</span>
        </div>
        <div className="mt-3 h-[6px] w-full overflow-hidden rounded-[2px] bg-secondary">
          <div
            className="h-full rounded-[2px] bg-brand transition-all duration-150"
            style={{ width: `${(health.score / health.max) * 100}%` }}
          />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <h4 className="eyebrow text-pos">Strengths</h4>
            <ul className="mt-2 space-y-1.5">
              {health.strengths.map((s) => (
                <li key={s} className="flex gap-2 text-[13px] text-foreground">
                  <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-pos" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow text-neg">Weaknesses</h4>
            <ul className="mt-2 space-y-1.5">
              {health.weaknesses.map((s) => (
                <li key={s} className="flex gap-2 text-[13px] text-foreground">
                  <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-neg" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border border-t border-border">
        {health.categories.map((c) => {
          const pct = (c.score / c.max) * 100;
          const tone = pct >= 80 ? "bg-pos" : pct >= 50 ? "bg-warn" : "bg-neg";
          return (
            <div key={c.name} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)_auto] items-center gap-3 py-2.5">
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-foreground">{c.name}</div>
                <div className="truncate text-[11px] text-steel-light">{c.note}</div>
              </div>
              <div className="h-[6px] w-full overflow-hidden rounded-[2px] bg-secondary">
                <div className={cn("h-full rounded-[2px] transition-all duration-150", tone)} style={{ width: `${pct}%` }} />
              </div>
              <div className="num shrink-0 text-[12px] text-foreground">
                {c.score} / {c.max}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
