import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <h1 className="truncate text-[20px] leading-7 font-semibold text-foreground">{title}</h1>
        {subtitle ? <p className="mt-0.5 truncate text-[13px] text-steel">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0 sm:text-right">{right}</div> : null}
    </header>
  );
}
