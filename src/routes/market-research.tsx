import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";
import { AssetHeader } from "@/components/equitylens/AssetHeader";
import { PriceChart, TimeframeSelector } from "@/components/equitylens/PriceChart";
import { ResearchSnapshot } from "@/components/equitylens/ResearchSnapshot";
import { SignalMeter } from "@/components/equitylens/SignalMeter";
import { FinancialHealthPanel } from "@/components/equitylens/FinancialHealthPanel";
import { NewsList } from "@/components/equitylens/EventList";
import { StatusIndicator } from "@/components/equitylens/StatusIndicator";
import { TickerSearch } from "@/components/equitylens/TickerSearch";
import { RetryButton, SkeletonBlock, SkeletonRows, StateMessage } from "@/components/equitylens/States";
import { eventsQuery, researchQuery, structureQuery } from "@/lib/api/queries";
import {
  STRUCTURE_TFS,
  TF_LABEL,
  swingsToPoints,
  swingsToSeries,
  toAsset,
  toFinancialHealth,
  toNews,
  toTechnical,
  type StructureTf,
} from "@/lib/api/adapters";
import { ratingTone } from "@/lib/format";

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

const QUICK = ["AAPL", "MSFT", "NVDA", "GC=F"];

function MarketResearchPage() {
  const [ticker, setTicker] = useState("AAPL");
  const [tf, setTf] = useState<StructureTf>("4h");

  const research = useQuery(researchQuery(ticker));
  const events = useQuery(eventsQuery(ticker));
  const structure = useQuery(structureQuery(ticker));

  const raw = research.data;
  const asset = raw ? toAsset(raw) : null;
  const technical = toTechnical(raw?.technical);
  const health = toFinancialHealth(raw?.financial_health);
  const news = toNews(events.data);
  const eventRisk = raw?.event_risk?.label ?? "—";

  const swings = structure.data?.timeframes?.[tf]?.swings ?? null;
  const series = swingsToSeries(swings);
  const points = swingsToPoints(swings);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Market Research"
        subtitle="Understand the asset in minutes."
        right={
          <div className="text-[12px] text-steel">
            <div>Live research engine</div>
            <div className="num text-steel-light">{raw?.data_status ? `Quote: ${raw.data_status}` : "—"}</div>
          </div>
        }
      />

      <TickerSearch value={ticker} onSubmit={setTicker} quickPicks={QUICK} />

      {research.isPending ? (
        <Panel>
          <SkeletonRows rows={3} />
        </Panel>
      ) : research.isError ? (
        <Panel>
          <StateMessage
            tone="error"
            title={`Could not load ${ticker}`}
            detail={(research.error as Error).message}
            action={<RetryButton onClick={() => void research.refetch()} />}
          />
        </Panel>
      ) : asset ? (
        <AssetHeader asset={asset}>
          {technical ? (
            <StatusIndicator label={technical.rating} tone={ratingTone(technical.rating)} variant="chip" />
          ) : null}
          <span className="num text-[11px] text-steel-light">{raw?.asset_class ?? ""}</span>
        </AssetHeader>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <Panel>
          <PanelHeader
            title="Structure Swing Series"
            meta={`${ticker} · ${TF_LABEL[tf]} · confirmed swing points (not OHLC)`}
            actions={
              <TimeframeSelector
                options={STRUCTURE_TFS.map((t) => TF_LABEL[t])}
                value={TF_LABEL[tf]}
                onChange={(v) => {
                  const next = STRUCTURE_TFS.find((t) => TF_LABEL[t] === v);
                  if (next) setTf(next);
                }}
              />
            }
          />
          {structure.isPending ? (
            <SkeletonBlock height={320} />
          ) : structure.isError ? (
            <StateMessage
              tone="error"
              title="Structure series unavailable"
              detail={(structure.error as Error).message}
              action={<RetryButton onClick={() => void structure.refetch()} />}
            />
          ) : series.length ? (
            <PanelBody className="px-2 pb-2">
              <PriceChart candles={series} mode="line" height={352} points={points} />
              <p className="px-1.5 pt-2 text-[11px] leading-4 text-steel-light">
                The engine supplies confirmed swing highs and lows only — this is structure data, not a candlestick
                price history.
              </p>
            </PanelBody>
          ) : (
            <StateMessage
              title="No swing series for this timeframe"
              detail={`The engine returned no confirmed ${TF_LABEL[tf]} swings for ${ticker}.`}
            />
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Research Snapshot" meta="Engine output" />
          {research.isPending ? (
            <SkeletonRows rows={5} />
          ) : technical ? (
            <>
              <ResearchSnapshot technical={technical} health={health} eventRisk={eventRisk} />
              <div className="border-t border-border px-3.5 py-3.5">
                <SignalMeter rating={technical.rating} score={technical.score} />
              </div>
            </>
          ) : (
            <StateMessage title="No technical rating" detail={`The engine returned no rating for ${ticker}.`} />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader
            title="Technical Analysis"
            meta={technical ? `${technical.indicators.length} indicators` : undefined}
          />
          {research.isPending ? (
            <SkeletonRows rows={6} />
          ) : technical && technical.indicators.length ? (
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
                      <td className="num px-3.5 py-2 text-right text-steel">{i.value ?? "—"}</td>
                      <td className="px-3.5 py-2">
                        <StatusIndicator label={i.signal} tone={ratingTone(i.signal)} />
                      </td>
                      <td className="hidden px-3.5 py-2 text-[12px] text-steel md:table-cell">{i.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <StateMessage title="No indicator readings" detail="The engine returned no indicator signals." />
          )}
        </Panel>

        <Panel>
          <PanelHeader title="News & Event Risk" meta={eventRisk} />
          {events.isPending ? (
            <SkeletonRows rows={5} />
          ) : events.isError ? (
            <StateMessage
              tone="error"
              title="News unavailable"
              detail={(events.error as Error).message}
              action={<RetryButton onClick={() => void events.refetch()} />}
            />
          ) : news.length ? (
            <NewsList items={news} />
          ) : (
            <StateMessage title="No relevant news" detail={`The engine returned no company news for ${ticker}.`} />
          )}
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Financial Health"
          meta={health ? `${health.score} / ${health.max} · ${health.label}` : "Engine output"}
        />
        {research.isPending ? (
          <SkeletonRows rows={4} />
        ) : health ? (
          <PanelBody className="py-4">
            <FinancialHealthPanel health={health} />
          </PanelBody>
        ) : (
          <StateMessage
            title="Financial health scoring not available"
            detail={`The engine did not return a financial-health score for ${ticker}${
              raw?.asset_class ? ` (asset class: ${raw.asset_class})` : ""
            }. No substitute value is shown.`}
          />
        )}
      </Panel>
    </div>
  );
}
