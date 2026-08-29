import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel, PanelBody, PanelHeader } from "@/components/equitylens/Panel";
import { AssetHeader } from "@/components/equitylens/AssetHeader";
import { PriceChart, TimeframeSelector } from "@/components/equitylens/PriceChart";
import { KeyLevels, PhasePanel, TimeframeRow } from "@/components/equitylens/StructurePanel";
import { TickerSearch } from "@/components/equitylens/TickerSearch";
import { RetryButton, SkeletonBlock, SkeletonRows, StateMessage } from "@/components/equitylens/States";
import { assetQuery, structureQuery } from "@/lib/api/queries";
import {
  STRUCTURE_TFS,
  TF_LABEL,
  swingsToPoints,
  swingsToSeries,
  toAsset,
  toMarketStructure,
  type StructureTf,
} from "@/lib/api/adapters";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market-structure")({
  head: () => ({
    meta: [
      { title: "Market Structure — EquityLens Market Intelligence" },
      {
        name: "description",
        content:
          "Multi-timeframe price structure with key buyer and seller levels across 4H, 1H, 15M and 5M reads.",
      },
      { property: "og:title", content: "Market Structure — EquityLens" },
      {
        property: "og:description",
        content: "Multi-timeframe structure analysis with buyer and seller levels, break and continuation state.",
      },
    ],
  }),
  component: MarketStructurePage,
});

const QUICK = ["GC=F", "AAPL", "SI=F", "BTC-USD"];

function MarketStructurePage() {
  const [ticker, setTicker] = useState("GC=F");
  const [tf, setTf] = useState<StructureTf>("4h");
  const [open, setOpen] = useState(false);

  const asset = useQuery(assetQuery(ticker));
  const structure = useQuery(structureQuery(ticker));

  const s = structure.data ? toMarketStructure(structure.data) : null;
  const tfData = structure.data?.timeframes?.[tf];
  const series = swingsToSeries(tfData?.swings);
  const points = swingsToPoints(tfData?.swings);
  const sellerLevel = tfData?.levels?.seller_level?.price;
  const buyerLevel = tfData?.levels?.buyer_level?.price;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Market Structure"
        subtitle="Multi-timeframe price structure and key buyer/seller levels."
        right={
          <div className="text-[12px] text-steel">
            <div>Live research engine</div>
            <div className="num text-steel-light">Research view · not trade instructions</div>
          </div>
        }
      />

      <TickerSearch value={ticker} onSubmit={setTicker} quickPicks={QUICK} />

      {asset.isPending ? (
        <Panel>
          <SkeletonRows rows={2} />
        </Panel>
      ) : asset.isError ? (
        <Panel>
          <StateMessage
            tone="error"
            title={`Could not load ${ticker}`}
            detail={(asset.error as Error).message}
            action={<RetryButton onClick={() => void asset.refetch()} />}
          />
        </Panel>
      ) : asset.data ? (
        <AssetHeader
          asset={toAsset(asset.data)}
          status={s?.status ?? asset.data.market_structure?.status ?? undefined}
          statusTone="warn"
          statusLabel="Structure"
        />
      ) : null}

      {structure.isPending ? (
        <Panel>
          <SkeletonRows rows={4} />
        </Panel>
      ) : structure.isError ? (
        <Panel>
          <StateMessage
            tone="error"
            title="Market structure unavailable"
            detail={(structure.error as Error).message}
            action={<RetryButton onClick={() => void structure.refetch()} />}
          />
        </Panel>
      ) : s ? (
        <>
          {s.timeframes.length ? <TimeframeRow structure={s} /> : null}
          <p className="text-[12px] leading-5 text-steel">
            4H and 1H establish higher-timeframe direction. 15M and 5M provide lower-timeframe confirmation.
          </p>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <Panel>
              <PanelHeader
                title="Structure Chart"
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
              {series.length ? (
                <PanelBody className="px-2 pb-2">
                  <PriceChart
                    candles={series}
                    mode="line"
                    height={380}
                    points={points}
                    levels={[
                      ...(sellerLevel != null
                        ? [{ price: sellerLevel, label: "Seller level", tone: "neg" as const }]
                        : []),
                      ...(buyerLevel != null
                        ? [{ price: buyerLevel, label: "Buyer level", tone: "pos" as const }]
                        : []),
                    ]}
                  />
                  <p className="px-1.5 pt-2 text-[11px] leading-4 text-steel-light">
                    Engine-confirmed swing highs and lows (HH / HL / LH / LL) with buyer and seller levels — swing
                    structure data, not candlestick history.
                  </p>
                </PanelBody>
              ) : (
                <StateMessage
                  title={`No ${TF_LABEL[tf]} swings available`}
                  detail={`The engine returned no confirmed ${TF_LABEL[tf]} structure for ${ticker}.`}
                />
              )}
            </Panel>

            <div className="grid content-start gap-4">
              <Panel>
                <PanelHeader title="Key Levels" meta={TF_LABEL[tf]} />
                {sellerLevel != null || buyerLevel != null ? (
                  <KeyLevels
                    structure={{ ...s, sellerLevel: sellerLevel ?? 0, buyerLevel: buyerLevel ?? 0 }}
                  />
                ) : (
                  <StateMessage title="No levels returned" detail="The engine reported no levels for this timeframe." />
                )}
              </Panel>

              <Panel>
                <PanelHeader title="Current Phase" />
                <PhasePanel structure={s} />
              </Panel>

              <Panel>
                <PanelHeader title="Structure Outlook" meta={structure.data?.quality ?? undefined} />
                {s.outlook.length ? (
                  <PanelBody>
                    <ul className="space-y-2">
                      {s.outlook.map((line) => (
                        <li key={line} className="flex gap-2 text-[13px] leading-5 text-foreground">
                          <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-steel-light" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </PanelBody>
                ) : (
                  <StateMessage title="No explanation supplied" />
                )}
              </Panel>
            </div>
          </div>

          <Panel>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="row-hover grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-2.5 text-left"
            >
              <span className="eyebrow text-foreground">Advanced Structure Details</span>
              <ChevronDown
                className={cn("size-4 shrink-0 text-steel transition-transform duration-150", open && "rotate-180")}
                strokeWidth={1.7}
              />
            </button>
            {open ? (
              <dl className="grid divide-y divide-border border-t border-border md:grid-cols-2 md:divide-y-0">
                {s.details.map((d) => (
                  <div
                    key={d.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-border px-3.5 py-2.5 md:border-b"
                  >
                    <dt className="truncate text-[12px] text-steel">{d.label}</dt>
                    <dd className="num shrink-0 text-[12px] text-foreground">{d.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </Panel>

          <Panel>
            <PanelHeader title="Event Risk" meta="Engine output" />
            {asset.data?.event_risk?.label ? (
              <PanelBody>
                <p className="text-[13px] leading-5 text-foreground">{asset.data.event_risk.label}</p>
              </PanelBody>
            ) : (
              <StateMessage title="No event risk data" detail="The engine reported no scheduled events." />
            )}
          </Panel>
        </>
      ) : null}

      {structure.isPending ? <SkeletonBlock height={280} /> : null}
    </div>
  );
}
