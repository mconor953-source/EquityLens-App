import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ticker input — submits the raw symbol to the engine (AAPL, GC=F, BTC-USD…).
 * No local universe or filtering: the backend resolves the symbol.
 */
export function TickerSearch({
  value,
  onSubmit,
  quickPicks = [],
  placeholder = "Enter a ticker — e.g. AAPL, MSFT, GC=F, BTC-USD",
}: {
  value: string;
  onSubmit: (ticker: string) => void;
  quickPicks?: string[];
  placeholder?: string;
}) {
  const [text, setText] = useState("");

  const submit = (raw: string) => {
    const t = raw.trim().toUpperCase();
    if (!t) return;
    onSubmit(t);
    setText("");
  };

  return (
    <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
        }}
        className="flex items-center gap-2 rounded-[4px] border border-border-structure bg-card px-3 py-2"
      >
        <Search className="size-4 shrink-0 text-steel-light" strokeWidth={1.7} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          aria-label="Ticker symbol"
          className="num w-full bg-transparent text-[13px] text-foreground uppercase placeholder:font-sans placeholder:normal-case placeholder:text-steel-light focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-[3px] border border-border-strong bg-card px-2.5 py-1 text-[11px] font-medium text-steel transition-colors duration-150 hover:bg-surface-active"
        >
          Load
        </button>
      </form>

      {quickPicks.length ? (
        <div className="inline-flex overflow-hidden rounded-[3px] border border-border-strong">
          {quickPicks.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => submit(t)}
              className={cn(
                "num border-r border-border-strong px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 last:border-r-0",
                value === t ? "bg-charcoal text-white" : "bg-card text-steel hover:bg-surface-active",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
