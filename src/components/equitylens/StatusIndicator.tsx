import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/format";

const dotTone: Record<Tone, string> = {
  pos: "bg-pos",
  neg: "bg-neg",
  warn: "bg-warn",
  brand: "bg-brand",
  neutral: "bg-steel-light",
};

const textTone: Record<Tone, string> = {
  pos: "text-pos",
  neg: "text-neg",
  warn: "text-warn",
  brand: "text-brand",
  neutral: "text-foreground",
};

const chipTone: Record<Tone, string> = {
  pos: "border-pos/35 bg-pos-soft text-pos",
  neg: "border-neg/35 bg-neg-soft text-neg",
  warn: "border-warn/35 bg-warn-soft text-warn",
  brand: "border-brand/35 bg-brand-soft text-brand",
  neutral: "border-border-strong bg-secondary/60 text-steel",
};

/**
 * Restrained status treatment. `dot` for inline table cells,
 * `chip` for a thin bordered label. No large colourful pills.
 */
export function StatusIndicator({
  label,
  tone = "neutral",
  variant = "dot",
  className,
}: {
  label: string;
  tone?: Tone;
  variant?: "dot" | "chip" | "text";
  className?: string;
}) {
  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-[3px] border px-1.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
          chipTone[tone],
          className,
        )}
      >
        {label}
      </span>
    );
  }

  if (variant === "text") {
    return <span className={cn("text-[13px] font-medium", textTone[tone], className)}>{label}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px]", className)}>
      <span className={cn("size-[6px] shrink-0 rounded-full", dotTone[tone])} />
      <span className={cn("truncate font-medium", textTone[tone])}>{label}</span>
    </span>
  );
}
