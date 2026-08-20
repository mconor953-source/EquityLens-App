import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LineChart,
  Layers,
  Lightbulb,
  ListChecks,
  Settings,
  Lock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/market-research", label: "Market Research", icon: LineChart },
  { to: "/market-structure", label: "Market Structure", icon: Layers },
  { to: "/investment-ideas", label: "Investment Ideas", icon: Lightbulb },
  { to: "/watchlists", label: "Watchlists", icon: ListChecks },
] as const;

const later = ["Portfolio Lab", "Market Voices"];

export function AppSidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  return (
    <div className="flex h-full w-[230px] flex-col bg-charcoal text-sidebar-foreground">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 border-b border-white/8 px-4 py-4">
        <div className="min-w-0">
          <div className="truncate text-[15px] leading-5 font-semibold tracking-[0.14em] text-white">EQUITYLENS</div>
          <div className="mt-0.5 truncate text-[11px] tracking-[0.06em] text-steel-light">Market Intelligence</div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-[3px] p-1 text-steel-light transition-colors duration-150 hover:bg-white/8 hover:text-white lg:hidden"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                activeOptions={{ exact: item.to === "/" }}
                className="group flex items-center gap-2.5 rounded-[4px] border-l-2 border-transparent px-2.5 py-[7px] text-[13px] text-steel-light transition-colors duration-150 hover:bg-white/6 hover:text-white data-[status=active]:border-brand data-[status=active]:bg-graphite-raised data-[status=active]:font-medium data-[status=active]:text-white"
              >
                <item.icon className="size-[15px] shrink-0" strokeWidth={1.6} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-3 h-px bg-white/8" />

        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-[4px] border-l-2 border-transparent px-2.5 py-[7px] text-[13px] text-steel-light transition-colors duration-150 hover:bg-white/6 hover:text-white data-[status=active]:border-brand data-[status=active]:bg-graphite-raised data-[status=active]:font-medium data-[status=active]:text-white"
        >
          <Settings className="size-[15px] shrink-0" strokeWidth={1.6} />
          <span className="truncate">Settings</span>
        </Link>

        <div className="mt-6 px-2.5">
          <div className="text-[10px] font-semibold tracking-[0.1em] text-steel uppercase">Coming later</div>
          <ul className="mt-2 space-y-1.5">
            {later.map((l) => (
              <li key={l} className={cn("flex items-center gap-2 text-[12px] text-steel")}>
                <Lock className="size-3 shrink-0" strokeWidth={1.6} />
                <span className="truncate">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-white/8 px-4 py-3">
        <div className="text-[10px] leading-4 tracking-wide text-steel uppercase">Mock data build</div>
        <div className="num mt-0.5 text-[11px] text-steel-light">v0.1 · research preview</div>
      </div>
    </div>
  );
}
