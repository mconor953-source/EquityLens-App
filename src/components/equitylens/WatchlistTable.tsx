import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { WatchlistRow } from "@/data/types";
import { changeTone, fmtNum, fmtPct, ratingTone, riskTone, toneText } from "@/lib/format";
import { StatusIndicator } from "./StatusIndicator";

export function WatchlistTable({ rows, className }: { rows: WatchlistRow[]; className?: string }) {
  return (
    <table className={cn("w-full border-collapse text-[13px]", className)}>
      <thead>
        <tr className="border-b border-border text-left">
          <th className="eyebrow px-3.5 py-2 font-semibold">Ticker</th>
          <th className="eyebrow px-3.5 py-2 text-right font-semibold">Price</th>
          <th className="eyebrow px-3.5 py-2 text-right font-semibold">1D</th>
          <th className="eyebrow px-3.5 py-2 font-semibold">Technical</th>
          <th className="eyebrow px-3.5 py-2 font-semibold">Structure</th>
          <th className="eyebrow px-3.5 py-2 font-semibold">Event Risk</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.ticker} className="row-hover border-b border-border/60 last:border-b-0">
            <td className="px-3.5 py-2">
              <Link to="/market-research" className="group flex min-w-0 flex-col">
                <span className="num text-[13px] font-semibold text-foreground group-hover:text-brand">{r.ticker}</span>
                <span className="truncate text-[11px] text-steel-light">{r.name}</span>
              </Link>
            </td>
            <td className="num px-3.5 py-2 text-right">{fmtNum(r.price)}</td>
            <td className={cn("num px-3.5 py-2 text-right font-medium", toneText(changeTone(r.changePct)))}>
              {fmtPct(r.changePct)}
            </td>
            <td className="px-3.5 py-2">
              <StatusIndicator label={r.technical} tone={ratingTone(r.technical)} />
            </td>
            <td className="px-3.5 py-2 text-[12px] text-steel">{r.structure}</td>
            <td className="px-3.5 py-2">
              <StatusIndicator label={r.eventRisk} tone={riskTone(r.eventRisk)} variant="chip" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
