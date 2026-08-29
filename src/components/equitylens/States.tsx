import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Neutral grey loading bars — same density as the tables they replace. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[3px] bg-secondary", className)} />;
}

export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("divide-y divide-border/60", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5">
          <Skeleton className="h-3 w-[55%]" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonBlock({ height = 200 }: { height?: number }) {
  return (
    <div className="px-3.5 py-3">
      <div className="w-full" style={{ height }}>
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}


export function StateMessage({
  title,
  detail,
  tone = "neutral",
  action,
  className,
}: {
  title: string;
  detail?: string;
  tone?: "neutral" | "error";
  action?: React.ReactNode;
  className?: string;
}) {
  const Icon = tone === "error" ? AlertTriangle : Info;
  return (
    <div className={cn("px-3.5 py-8 text-center", className)}>
      <Icon
        className={cn("mx-auto size-4", tone === "error" ? "text-neg" : "text-steel")}
        strokeWidth={1.7}
      />
      <p className="mt-2.5 text-[13px] font-semibold text-foreground">{title}</p>
      {detail ? <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-steel">{detail}</p> : null}
      {action ? <div className="mt-3 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[3px] border border-border-strong bg-card px-2.5 py-1 text-[11px] font-medium text-steel transition-colors duration-150 hover:bg-surface-active"
    >
      Retry
    </button>
  );
}

/** Subtle per-section demo-data marker. */
export function DemoTag({ className }: { className?: string }) {
  return (
    <span className={cn("num rounded-[3px] border border-border-strong px-1.5 py-0.5 text-[10px] text-steel-light", className)}>
      Demo data
    </span>
  );
}
