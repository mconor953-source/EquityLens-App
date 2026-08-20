import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelHeader } from "@/components/equitylens/Panel";
import { WatchlistTable } from "@/components/equitylens/WatchlistTable";
import { watchlist } from "@/data/mock";

export const Route = createFileRoute("/watchlists")({
  head: () => ({
    meta: [
      { title: "Watchlists — EquityLens Market Intelligence" },
      {
        name: "description",
        content: "Track assets with technical ratings, market structure state and event risk in one compact view.",
      },
      { property: "og:title", content: "Watchlists — EquityLens" },
      { property: "og:description", content: "Track ratings, structure and event risk across the assets you follow." },
    ],
  }),
  component: WatchlistsPage,
});

function WatchlistsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Watchlists" subtitle="Assets you follow, with research state attached." />
      <Panel>
        <PanelHeader title="Core Watchlist" meta={`${watchlist.length} assets · mock data`} />
        <div className="overflow-x-auto">
          <WatchlistTable rows={watchlist} className="min-w-[720px]" />
        </div>
      </Panel>
      <p className="text-[12px] text-steel">
        Additional lists, alerts and grouping will be served from <span className="num">/api/watchlist</span>.
      </p>
    </div>
  );
}
