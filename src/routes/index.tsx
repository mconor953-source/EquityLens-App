import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";
import { MetricStrip, type Metric } from "@/components/equitylens/MetricStrip";
import { MarketTable } from "@/components/equitylens/MarketTable";
import { WatchlistTable } from "@/components/equitylens/WatchlistTable";
import { EventList } from "@/components/equitylens/EventList";
import { StatusIndicator } from "@/components/equitylens/StatusIndicator";
import { DemoTag, RetryButton, SkeletonRows, StateMessage } from "@/components/equitylens/States";
import { assetQuery, eventsQuery, watchlistQuery } from "@/lib/api/queries";
import { toEventItems, toWatchlistRow } from "@/lib/api/adapters";
import type { ApiAsset } from "@/lib/api/types";
import { globalMarkets } from "@/data/mock";
import { changeTone, fmtPct, ratingTone, riskTone } from "@/lib/format";
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

const TABS = ["Watchlist Assets", "Global Markets"] as const;
const MAX_ASSETS = 8;

function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Watchlist Assets");

  const lists = useQuery(watchlistQuery());
  const tickers = Array.from(new Set(Object.values(lists.data ?? {}).flat())).slice(0, MAX_ASSETS);

  const assetResults = useQueries({ queries: tickers.map((t) => assetQuery(t)) });
  const assets = assetResults.map((r) => r.data).filter((a): a is ApiAsset => Boolean(a));
  const assetsPending = lists.isPending || (tickers.length > 0 && assetResults.some((r) => r.isPending));

  const rows = assets.map(toWatchlistRow);
  const quotes = rows.map((r) => ({ ticker: r.ticker, name: r.name, price: r.price, changePct: r.changePct }));

  const leadTicker = tickers[0] ?? "";
  const events = useQuery({ ...eventsQuery(leadTicker), enabled: Boolean(leadTicker) });
  const economic = toEventItems((events.data?.economic_events as { events?: unknown } | null)?.events, 5);
  const importantToday = economic.slice(0, 3);

  const advancing = rows.filter((r) => r.changePct > 0).length;
  const mover = rows.reduce<(typeof rows)[number] | null>(
    (best, r) => (!best || Math.abs(r.changePct) > Math.abs(best.changePct) ? r : best),
    null,
  );
  const riskLabels = assets.map((a) => a.event_risk?.label ?? "").filter(Boolean);
  const worstRisk =
    riskLabels.find((l) => l.toLowerCase() === "high") ??
    riskLabels.find((l) => /moderate|medium/i.test(l)) ??
    riskLabels[0] ??
    "—";

  const metrics: Metric[] = [
    {
      label: "Watchlist Breadth",
      value: rows.length ? `${advancing} / ${rows.length}` : "—",
      note: rows.length ? "advancing" : "no data",
    },
    {
      label: "Biggest Mover",
      value: mover ? mover.ticker : "—",
      note: mover ? fmtPct(mover.changePct) : undefined,
      tone: mover ? changeTone(mover.changePct) : "neutral",
    },
    {
      label: "Event Risk",
      value: worstRisk,
      note: leadTicker ? `lead ${leadTicker}` : undefined,
      tone: riskTone(worstRisk),
    },
    {
      label: "Watchlist",
      value: lists.data ? String(Object.values(lists.data).flat().length) : "—",
      note: lists.data ? `${Object.keys(lists.data).length} lists` : undefined,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        subtitle="Markets, research and risk at a glance."
        right={
          <div className="text-[12px] text-steel">
            <div>Live research engine</div>
            <div className="num text-steel-light">
              {assets[0]?.data_status ? `Quotes: ${assets[0].data_status}` : "—"}
            </div>
          </div>
        }
      />

      <MetricStrip metrics={metrics} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
        <Panel>
          <PanelHeader
            title="Market Overview"
            actions={
              <div className="flex items-center gap-2">
                {tab === "Global Markets" ? <DemoTag /> : null}
                <div className="inline-flex overflow-hidden rounded-[3px] border border-border-strong">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={cn(
                        "border-r border-border-strong px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 last:border-r-0",
                        tab === t ? "bg-charcoal text-white" : "bg-card text-steel hover:bg-surface-active",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
          {tab === "Global Markets" ? (
            <div className="overflow-x-auto">
              <MarketTable rows={globalMarkets} className="min-w-[520px]" />
              <p className="px-3.5 py-2 text-[11px] leading-4 text-steel-light">
                The engine exposes no index/overview endpoint yet, so this section remains demo data.
              </p>
            </div>
          ) : assetsPending ? (
            <SkeletonRows rows={6} />
          ) : lists.isError ? (
            <StateMessage
              tone="error"
              title="Live quotes unavailable"
              detail={(lists.error as Error).message}
              action={<RetryButton onClick={() => void lists.refetch()} />}
            />
          ) : quotes.length ? (
            <div className="overflow-x-auto">
              <MarketTable rows={quotes} className="min-w-[520px]" />
            </div>
          ) : (
            <StateMessage title="No watchlist assets" detail="Add a ticker on the Watchlists page to populate this view." />
          )}
        </Panel>

        <Panel>
          <PanelHeader title="What Matters Today" meta={leadTicker ? `Event calendar · ${leadTicker}` : "Event calendar"} />
          {events.isPending && leadTicker ? (
            <SkeletonRows rows={4} />
          ) : economic.length ? (
            <>
              <PanelBody className="space-y-2">
                <p className="text-[13px] leading-5 text-foreground">
                  {`${economic.length} scheduled macro event${economic.length === 1 ? "" : "s"} the engine flags as relevant to ${leadTicker}. Highest impact: ${economic[0]?.importance ?? "—"}.`}
                </p>
              </PanelBody>
              <div className="border-t border-border">
                <div className="px-3.5 pt-2.5">
                  <span className="eyebrow">Important next</span>
                </div>
                <ul className="mt-1 divide-y divide-border">
                  {importantToday.map((i) => (
                    <li
                      key={`${i.date}-${i.label}`}
                      className="row-hover grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-foreground">{i.label}</span>
                        <span className="block truncate text-[11px] text-steel-light">{i.detail}</span>
                      </span>
                      <span className="num shrink-0 text-[11px] text-brand">{i.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <StateMessage title="No scheduled events" detail="The engine returned no relevant economic events." />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
        <Panel>
          <PanelHeader title="Watchlist" meta={rows.length ? `${rows.length} assets · live` : "live"} />
          {assetsPending ? (
            <SkeletonRows rows={6} />
          ) : rows.length ? (
            <div className="overflow-x-auto">
              <WatchlistTable rows={rows} className="min-w-[720px]" />
            </div>
          ) : (
            <StateMessage title="Watchlist empty" detail="The engine returned no watchlist tickers." />
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Research Highlights" meta="Engine output" />
          {assetsPending ? (
            <SkeletonRows rows={5} />
          ) : assets.length ? (
            <ul className="divide-y divide-border">
              {assets.slice(0, 4).map((a) => (
                <li key={a.symbol} className="row-hover px-3.5 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="num text-[13px] font-semibold text-foreground">{a.symbol}</span>
                    <span className="truncate text-[11px] text-steel-light">{a.name ?? ""}</span>
                  </div>
                  <dl className="mt-1.5 space-y-1">
                    {[
                      { label: "Technical rating", value: a.technical?.signal ?? a.technical?.rating ?? "—" },
                      { label: "Structure", value: a.market_structure?.status ?? "—" },
                      { label: "Event risk", value: a.event_risk?.label ?? "—" },
                    ].map((l) => (
                      <div key={l.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                        <dt className="truncate text-[12px] text-steel">{l.label}</dt>
                        <dd className="shrink-0">
                          <StatusIndicator
                            label={l.value}
                            tone={l.label === "Event risk" ? riskTone(l.value) : ratingTone(l.value)}
                          />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
            <StateMessage title="No research output" detail="The engine returned no asset research." />
          )}
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Upcoming Events" meta={leadTicker ? `Economic calendar · ${leadTicker}` : "Economic calendar"} />
        {events.isPending && leadTicker ? (
          <SkeletonRows rows={3} />
        ) : events.isError ? (
          <StateMessage
            tone="error"
            title="Event calendar unavailable"
            detail={(events.error as Error).message}
            action={<RetryButton onClick={() => void events.refetch()} />}
          />
        ) : economic.length ? (
          <EventList events={economic} />
        ) : (
          <StateMessage title="No scheduled events" detail="The engine returned no upcoming economic events." />
        )}
      </Panel>
    </div>
  );
}
