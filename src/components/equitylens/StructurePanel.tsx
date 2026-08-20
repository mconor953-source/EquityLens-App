import { cn } from "@/lib/utils";
import type { MarketStructure } from "@/data/types";
import { fmtNum, ratingTone } from "@/lib/format";
import { StatusIndicator } from "./StatusIndicator";

export function TimeframeRow({ structure, className }: { structure: MarketStructure; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 divide-border rounded-[4px] border border-border bg-card md:grid-cols-4 md:divide-x", className)}>
      {structure.timeframes.map((t, i) => (
        <div
          key={t.tf}
          className={cn("min-w-0 px-3.5 py-2.5", i < 2 && "border-b border-border md:border-b-0", i % 2 === 1 && "border-l border-border md:border-l-0")}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="num text-[13px] font-semibold text-foreground">{t.tf}</span>
            <StatusIndicator label={t.bias} tone={ratingTone(t.bias)} />
          </div>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-steel">{t.note}</p>
        </div>
      ))}
    </div>
  );
}

export function KeyLevels({ structure }: { structure: MarketStructure }) {
  return (
    <div className="divide-y divide-border">
      <LevelRow label="Seller level" value={fmtNum(structure.sellerLevel, 2)} tone="neg" />
      <LevelRow label="Buyer level" value={fmtNum(structure.buyerLevel, 2)} tone="pos" />
    </div>
  );
}

function LevelRow({ label, value, tone }: { label: string; value: string; tone: "pos" | "neg" }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5">
      <span className="flex min-w-0 items-center gap-2 text-[12px] text-steel">
        <span
          className={cn("h-0 w-4 shrink-0 border-t border-dashed", tone === "pos" ? "border-pos" : "border-neg")}
        />
        <span className="truncate">{label}</span>
      </span>
      <span className="num text-[14px] font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function PhasePanel({ structure }: { structure: MarketStructure }) {
  const rows = [
    { label: "Break", value: structure.phase.breakState },
    { label: "Correction", value: structure.phase.correction },
    { label: "Continuation", value: structure.phase.continuation },
  ];
  return (
    <div className="divide-y divide-border">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5">
          <span className="truncate text-[12px] text-steel">{r.label}</span>
          <StatusIndicator
            label={r.value}
            tone={r.value === "Confirmed" ? "pos" : r.value === "Waiting" ? "warn" : "neutral"}
          />
        </div>
      ))}
    </div>
  );
}
