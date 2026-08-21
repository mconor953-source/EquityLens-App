import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";
import { MetricStrip } from "@/components/equitylens/MetricStrip";
import { MarketTable } from "@/components/equitylens/MarketTable";
import { WatchlistTable } from "@/components/equitylens/WatchlistTable";
import { EventList } from "@/components/equitylens/EventList";
import { StatusIndicator } from "@/components/equitylens/StatusIndicator";
import {
  asOfDate,
  dashboardMetrics,
  globalMarkets,
  importantToday,
  majorAssets,
  movers,
  researchHighlights,
  upcomingEvents,
  watchlist,
  whatMattersToday,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EquityLens — Market Intelligence Dashboard" },
      {
        name: "description",
        content:
          "Markets, research and risk at a glance: breadth, movers, watchlists, technical ratings and upcoming event risk.",
      },
      { property: "og:title", content: "EquityLens — Market Intelligence" },
      {
        property: "og:description",
        content: "A professional research terminal for markets, technical ratings, financial health and event risk.",
      },
    ],
  }),
  component: Dashboard,
});

const TABS = ["Global Markets", "Major Assets", "Movers"] as const;

function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Global Markets");
  const rows = tab === "Global Markets" ? globalMarkets : tab === "Major Assets" ? majorAssets : movers;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        subtitle="Markets, research and risk at a glance."
        right={
          <div className="text-[12px] text-steel">
            <div className="num">{asOfDate}</div>
            <div className="text-warn">Market data delayed · mock data</div>
          </div>
        }
      />

      <MetricStrip metrics={dashboardMetrics} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
        <Panel>
          <PanelHeader
            title="Market Overview"
            actions={
              <div className="inline-flex overflow-hidden rounded-[3px] border border-border-strong">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={cn(
                      "border-r border-border-strong px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 last:border-r-0",
                      tab === t ? "bg-charcoal text-white" : "bg-card text-steel hover:bg-secondary/60",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
          />
          <div className="overflow-x-auto">
            <MarketTable rows={rows} className="min-w-[520px]" />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="What Matters Today" meta="Research desk summary" />
          <PanelBody className="space-y-2">
            {whatMattersToday.map((line) => (
              <p key={line} className="text-[13px] leading-5 text-foreground">
                {line}
              </p>
            ))}
          </PanelBody>
          <div className="border-t border-border">
            <div className="px-3.5 pt-2.5">
              <span className="eyebrow">Important today</span>
            </div>
            <ul className="mt-1 divide-y divide-border">
              {importantToday.map((i) => (
                <li key={i.label} className="row-hover grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-foreground">{i.label}</span>
                    <span className="block truncate text-[11px] text-steel-light">{i.detail}</span>
                  </span>
                  <span className="num shrink-0 text-[11px] text-brand">{i.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
        <Panel>
          <PanelHeader title="Watchlist" meta={`${watchlist.length} assets`} />
          <div className="overflow-x-auto">
            <WatchlistTable rows={watchlist} className="min-w-[720px]" />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Research Highlights" meta="Engine output" />
          <ul className="divide-y divide-border">
            {researchHighlights.map((h) => (
              <li key={h.ticker} className="row-hover px-3.5 py-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="num text-[13px] font-semibold text-foreground">{h.ticker}</span>
                  <span className="truncate text-[11px] text-steel-light">{h.name}</span>
                </div>
                <dl className="mt-1.5 space-y-1">
                  {h.lines.map((l) => (
                    <div key={l.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <dt className="truncate text-[12px] text-steel">{l.label}</dt>
                      <dd className="shrink-0">
                        <StatusIndicator label={l.value} tone={l.tone} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Upcoming Events" meta="Next five scheduled" />
        <EventList events={upcomingEvents} />
      </Panel>
    </div>
  );
}
