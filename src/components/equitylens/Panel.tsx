import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("flex flex-col overflow-hidden rounded-[4px] border border-border bg-card", className)}>
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  meta,
  actions,
  className,
}: {
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-3.5 py-2.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-baseline gap-2.5">
        <h2 className="eyebrow truncate text-foreground">{title}</h2>
        {meta ? <span className="truncate text-[11px] text-steel">{meta}</span> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
    </header>
  );
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-3.5 py-3", className)}>{children}</div>;
}
