import { Menu, Search } from "lucide-react";
import { lastUpdated } from "@/data/mock";

export function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  return (
    <div className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/95 px-4 py-2 backdrop-blur-[2px]">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="rounded-[3px] border border-border-strong p-1 text-steel transition-colors duration-150 hover:bg-secondary/60 lg:hidden"
      >
        <Menu className="size-4" strokeWidth={1.7} />
      </button>

      <div className="flex min-w-0 items-center gap-4">
        <span className="flex shrink-0 items-center gap-1.5 text-[12px] text-steel">
          <span className="size-[6px] rounded-full bg-pos" />
          Markets open
        </span>
        <span className="num hidden shrink-0 text-[12px] text-steel-light sm:inline">
          Last updated {lastUpdated}
        </span>
        <span className="hidden truncate text-[12px] text-warn md:inline">Mock data — not live market data</span>
      </div>

      <button
        type="button"
        className="flex shrink-0 items-center gap-2 rounded-[3px] border border-border-strong px-2 py-1 text-[12px] text-steel transition-colors duration-150 hover:bg-secondary/60"
      >
        <Search className="size-3.5" strokeWidth={1.7} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="num hidden rounded-[2px] border border-border-strong px-1 text-[10px] sm:inline">⌘K</kbd>
      </button>
    </div>
  );
}
