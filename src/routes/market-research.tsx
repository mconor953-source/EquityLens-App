import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";
import { AssetHeader } from "@/components/equitylens/AssetHeader";
import { PriceChart, TimeframeSelector } from "@/components/equitylens/PriceChart";
import { ResearchSnapshot } from "@/components/equitylens/ResearchSnapshot";
import { SignalMeter } from "@/components/equitylens/SignalMeter";
import { FinancialHealthPanel } from "@/components/equitylens/FinancialHealthPanel";
import { NewsList } from "@/components/equitylens/EventList";
import { StatusIndicator } from "@/components/equitylens/StatusIndicator";
import { assetNews, financialHealth, priceHistory, researchAsset, searchUniverse, technical } from "@/data/mock";
import { ratingTone } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market-research")({
  head: () => ({
    meta: [
      { title: "Market Research — EquityLens Market Intelligence" },
      {
        name: "description",
        content:
          "Understand an asset in minutes: price action, technical rating, financial health scoring, news and event risk.",
      },
      { property: "og:title", content: "Market Research — EquityLens" },
      {
        property: "og:description",
        content: "Technical ratings, financial health scoring and event risk in a single research view.",
      },
    ],
  }),
  component: MarketResearchPage,
});

const TIMEFRAMES = ["1M", "3M", "6M", "1Y", "5Y"] as const;
type Timeframe = (typeof TIMEFRAMES)[number];

function MarketResearchPage() {
  const [tf, setTf] = useState<Timeframe>("6M");
  const [mode, setMode] = useState<"candle" | "line">("candle");
  const [query, setQuery] = useState("");
  const candles = priceHistory[tf];

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return searchUniverse.filter((a) => a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Market Research"
        subtitle="Understand the asset in minutes."
        right={
          <div className="text-[12px] text-steel">
            <div>Mock data — not live market data</div>
            <div className="num text-steel-light">Coverage: 14 tracked assets</div>
          </div>
        }
      />

      <div className="relative">
        <div className="flex items-center gap-2 rounded-[4px] border border-border bg-card px-3 py-2">
          <Search className="size-4 shrink-0 text-steel-light" strokeWidth={1.7} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search asset, ticker or index — e.g. AAPL, Gold, GBP/JPY"
            className="num w-full bg-transparent text-[13px] text-foreground placeholder:font-sans placeholder:text-steel-light focus:outline-none"
          />
          <kbd className="num hidden shrink-0 rounded-[3px] border border-border-strong px-1.5 py-0.5 text-[10px] text-steel sm:block">
            /
          </kbd>
        </div>
        {suggestions.length > 0 ? (
          <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-[4px] border border-border-strong bg-card shadow-[0_2px_6px_rgba(37,42,48,0.1)]">
            {suggestions.map((a) => (
              <li key={a.ticker}>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="row-hover flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left"
                >
                  <span className="num text-[13px] font-semibold text-foreground">{a.ticker}</span>
                  <span className="truncate text-[12px] text-steel">{a.name}</span>
                  <span className="num text-[11px] text-steel-light">{a.exchange}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <AssetHeader asset={researchAsset}>
        <StatusIndicator label={technical.rating} tone={ratingTone(technical.rating)} variant="chip" />
        <span className="num text-[11px] text-steel-light">Delayed quote</span>
      </AssetHeader>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <Panel>
          <PanelHeader
            title="Price Action"
            meta={`${researchAsset.ticker} · ${tf}`}
            actions={
              <>
                <div className="mr-1 inline-flex overflow-hidden rounded-[3px] border border-border-strong">
                  {(["candle", "line"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "px-2 py-1 text-[11px] font-medium capitalize transition-colors duration-150",
                        mode === m ? "bg-charcoal text-white" : "bg-card text-steel hover:bg-surface-active",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <TimeframeSelector options={TIMEFRAMES} value={tf} onChange={setTf} />
              </>
            }
          />
          <PanelBody className="px-2 pb-2">
            <PriceChart candles={candles} mode={mode} height={352} currency={researchAsset.currency} />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Research Snapshot" meta="Engine output" />
          <ResearchSnapshot technical={technical} health={financialHealth} eventRisk="Low" />
          <div className="border-t border-border px-3.5 py-3.5">
            <SignalMeter rating={technical.rating} score={technical.score} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader title="Technical Analysis" meta={`${technical.indicators.length} indicators`} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="eyebrow px-3.5 py-2 font-semibold">Indicator</th>
                  <th className="eyebrow px-3.5 py-2 text-right font-semibold">Value</th>
                  <th className="eyebrow px-3.5 py-2 font-semibold">Signal</th>
                  <th className="eyebrow hidden px-3.5 py-2 font-semibold md:table-cell">Reading</th>
                </tr>
              </thead>
              <tbody>
                {technical.indicators.map((i) => (
                  <tr key={i.name} className="row-hover border-b border-border/60 last:border-b-0">
                    <td className="px-3.5 py-2 font-medium text-foreground">{i.name}</td>
                    <td className="num px-3.5 py-2 text-right text-steel">{i.value}</td>
                    <td className="px-3.5 py-2">
                      <StatusIndicator label={i.signal} tone={ratingTone(i.signal)} />
                    </td>
                    <td className="hidden px-3.5 py-2 text-[12px] text-steel md:table-cell">{i.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="News & Event Risk" meta="Relevance filtered" />
          <NewsList items={assetNews} />
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Financial Health" meta={`${financialHealth.score} / ${financialHealth.max} · ${financialHealth.label}`} />
        <PanelBody className="py-4">
          <FinancialHealthPanel health={financialHealth} />
        </PanelBody>
      </Panel>
    </div>
  );
}
