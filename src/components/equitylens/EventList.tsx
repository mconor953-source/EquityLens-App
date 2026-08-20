import { cn } from "@/lib/utils";
import { StatusIndicator } from "./StatusIndicator";
import type { EventItem, NewsItem } from "@/data/types";
import { riskTone } from "@/lib/format";

/** Compact horizontal event timeline. */
export function EventList({ events, className }: { events: EventItem[]; className?: string }) {
  return (
    <ol className={cn("grid divide-border md:grid-cols-5 md:divide-x", className)}>
      {events.map((e) => (
        <li key={`${e.date}-${e.label}`} className="row-hover border-b border-border px-3.5 py-3 last:border-b-0 md:border-b-0">
          <div className="flex items-center justify-between gap-2">
            <span className="num text-[11px] font-semibold text-brand">{e.date}</span>
            <StatusIndicator label={e.importance} tone={riskTone(e.importance)} variant="chip" />
          </div>
          <div className="mt-1.5 truncate text-[13px] font-medium text-foreground">{e.label}</div>
          <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-steel">{e.detail}</div>
          <div className="num mt-1.5 text-[11px] text-steel-light">{e.when}</div>
        </li>
      ))}
    </ol>
  );
}

export function NewsList({ items, className }: { items: NewsItem[]; className?: string }) {
  return (
    <ul className={cn("divide-y divide-border", className)}>
      {items.map((n) => (
        <li key={n.headline} className="row-hover px-3.5 py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">{n.headline}</p>
              <p className="mt-1 text-[12px] leading-5 text-steel">{n.why}</p>
              <p className="num mt-1 text-[11px] text-steel-light">
                {n.source} · {n.when}
              </p>
            </div>
            <StatusIndicator label={`${n.importance} impact`} tone={riskTone(n.importance)} variant="chip" />
          </div>
        </li>
      ))}
    </ul>
  );
}
