import { cn } from "@/lib/utils";
import type { QuoteRow } from "@/data/types";
import { changeTone, fmtNum, fmtPct, toneText } from "@/lib/format";

export function MarketTable({ rows, className }: { rows: QuoteRow[]; className?: string }) {
  return (
    <table className={cn("w-full border-collapse text-[13px]", className)}>
      <thead>
        <tr className="border-b border-border text-left">
          <th className="eyebrow px-3.5 py-2 font-semibold">Instrument</th>
          <th className="eyebrow px-3.5 py-2 text-right font-semibold">Last</th>
          <th className="eyebrow px-3.5 py-2 text-right font-semibold">1D %</th>
          <th className="eyebrow hidden px-3.5 py-2 text-right font-semibold sm:table-cell">Trend</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const tone = changeTone(r.changePct);
          return (
            <tr key={r.ticker} className="row-hover border-b border-border/70 last:border-b-0">
              <td className="px-3.5 py-2">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate font-medium text-foreground">{r.name}</span>
                  <span className="num shrink-0 text-[11px] text-steel-light">{r.ticker}</span>
                </div>
              </td>
              <td className="num px-3.5 py-2 text-right text-foreground">{fmtNum(r.price)}</td>
              <td className={cn("num px-3.5 py-2 text-right font-medium", toneText(tone))}>{fmtPct(r.changePct)}</td>
              <td className="hidden px-3.5 py-2 text-right sm:table-cell">
                <Spark tone={tone} magnitude={Math.min(Math.abs(r.changePct) / 3.2, 1)} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Spark({ tone, magnitude }: { tone: "pos" | "neg" | "neutral"; magnitude: number }) {
  const width = 12 + magnitude * 46;
  return (
    <span className="inline-flex h-1.5 w-[58px] items-center justify-end overflow-hidden rounded-[2px] bg-secondary/70">
      <span
        className={cn("h-1.5 rounded-[2px] transition-all duration-150", {
          "bg-pos": tone === "pos",
          "bg-neg": tone === "neg",
          "bg-steel-light": tone === "neutral",
        })}
        style={{ width: `${width}%` }}
      />
    </span>
  );
}
