import { cn } from "@/lib/utils";
import { ratingTone, toneText } from "@/lib/format";

const BANDS: string[] = ["Strong Sell", "Sell", "Neutral", "Buy", "Strong Buy"];

/** Clean sentiment meter: -100 (Strong Sell) to +100 (Strong Buy). */
export function SignalMeter({ rating, score, className }: { rating: string; score: number; className?: string }) {
  const pos = ((score + 100) / 200) * 100;
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between">
        <span className="eyebrow">Aggregate signal</span>
        <span className={cn("text-[13px] font-semibold tracking-wide uppercase", toneText(ratingTone(rating)))}>
          {rating}
        </span>
      </div>

      <div className="relative mt-3 h-[6px] overflow-hidden rounded-[2px]">
        <div className="absolute inset-0 grid grid-cols-5 gap-px">
          <span className="bg-neg/85" />
          <span className="bg-neg/45" />
          <span className="bg-steel-light/55" />
          <span className="bg-pos/45" />
          <span className="bg-pos/85" />
        </div>
      </div>

      <div className="relative h-4">
        <div
          className="absolute -top-[3px] flex -translate-x-1/2 flex-col items-center transition-all duration-150"
          style={{ left: `${pos}%` }}
        >
          <span className="h-2.5 w-[2px] bg-charcoal" />
        </div>
      </div>

      <div className="grid grid-cols-5 text-center">
        {BANDS.map((b) => (
          <span
            key={b}
            className={cn(
              "text-[10px] leading-3 tracking-wide uppercase",
              b === rating ? "font-semibold text-foreground" : "text-steel-light",
            )}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
