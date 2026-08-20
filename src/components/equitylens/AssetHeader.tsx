import { cn } from "@/lib/utils";
import type { Asset } from "@/data/types";
import { changeTone, fmtNum, fmtPct, toneText } from "@/lib/format";
import { StatusIndicator } from "./StatusIndicator";
import type { Tone } from "@/lib/format";

export function AssetHeader({
  asset,
  status,
  statusTone = "warn",
  statusLabel,
  className,
  children,
}: {
  asset: Asset;
  status?: string;
  statusTone?: Tone;
  statusLabel?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const tone = changeTone(asset.changePct);
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-4 rounded-[4px] border border-border bg-card px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
        <div className="min-w-0">
          <div className="flex min-w-0 items-baseline gap-2">
            <h2 className="truncate text-[18px] leading-6 font-semibold text-foreground">{asset.name}</h2>
            <span className="num shrink-0 rounded-[3px] border border-border-strong px-1.5 py-0.5 text-[11px] font-medium text-steel">
              {asset.ticker}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] tracking-wide text-steel-light uppercase">{asset.exchange}</p>
        </div>

        <div className="h-9 w-px bg-border max-lg:hidden" />

        <div className="flex items-baseline gap-3">
          <span className="num text-[22px] leading-7 font-semibold text-foreground">
            {asset.currency}
            {fmtNum(asset.price, 2)}
          </span>
          <span className={cn("num text-[13px] font-medium", toneText(tone))}>
            {asset.changeAbs > 0 ? "+" : ""}
            {fmtNum(asset.changeAbs, 2)} ({fmtPct(asset.changePct)})
          </span>
        </div>

        {status ? (
          <div className="flex items-center gap-2">
            <span className="eyebrow">{statusLabel ?? "Status"}</span>
            <StatusIndicator label={status} tone={statusTone} variant="chip" />
          </div>
        ) : null}
      </div>

      {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </div>
  );
}
